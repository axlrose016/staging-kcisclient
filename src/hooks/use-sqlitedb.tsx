
import { useState, useEffect, useRef, useCallback } from "react";

export const DATABASE_STATUS = {
  busy: "busy",
  notLoaded: "not loaded",
  ready: "ready",
  runningCommand: "running command",
};

// switch (databaseStatus) {
//   case DATABASE_STATUS.busy:
//     return <p>Loading...</p>;

//   case DATABASE_STATUS.notLoaded:
//     return (
//       <DefaultLayout>
//         <DatabaseSelector loadDatabase={loadDatabase} />
//       </DefaultLayout>
//     );

//   case DATABASE_STATUS.ready:
//   case DATABASE_STATUS.runningCommand:
//   default:
//     return (
//       <DefaultLayout>
//         <div className="row">
//           <div className="col-md-3">
//             <Schema execCommand={execCommand} />
//           </div>

//           <div className="col-md-9">
//             <Command execCommand={execCommand} />
//           </div>
//         </div>
//       </DefaultLayout>
//     );
// }

export const useDatabase = () => {
  const worker: any = useRef(null);
  const [databaseStatus, setDatabaseStatus] = useState(DATABASE_STATUS.busy);
  const isDev = false

  useEffect(() => {
    let sqlWorker = new Worker("/worker.sql-wasm.js");

    if (isDev)
      sqlWorker.onerror = (err) => console.log(`SQL Worker Error: ${err}`);

    worker.current = sqlWorker;

    setDatabaseStatus(DATABASE_STATUS.notLoaded);
  }, [isDev]);

  const loadDatabase = useCallback(
    (data:any) => {
      if (databaseStatus === DATABASE_STATUS.busy) return;

      setDatabaseStatus(DATABASE_STATUS.busy);

      worker.current.onmessage = () => {
        if (isDev) console.log("Database opened");

        setDatabaseStatus(DATABASE_STATUS.ready);
      };

      if (data && data.length) {
        if (isDev) console.log("Opening database from file");

        worker.current.postMessage({
          action: "open",
          buffer: data,
        });
      } else {
        if (isDev) console.log("Opening blank database");

        worker.current.postMessage({ action: "open" });
      }
    },
    [databaseStatus, isDev]
  );

  const execCommand = useCallback(
    (command:any, handleResults:any) => {
      if (
        databaseStatus === DATABASE_STATUS.busy ||
        databaseStatus === DATABASE_STATUS.runningCommand
      )
        return;

      setDatabaseStatus(DATABASE_STATUS.runningCommand);

      worker.current.onmessage = (event: any) => {
        if (isDev) console.log(event.data.results);

        setDatabaseStatus(DATABASE_STATUS.ready);
        handleResults(event.data.results);
      };

      if (isDev) console.log(`Running sql: ${command}`);

      worker.current.postMessage({
        action: "exec",
        sql: command,
      });
    },
    [databaseStatus, isDev]
  );

  const exportDatabase = useCallback(
    (handleBuffer:any) => {
      if (
        databaseStatus === DATABASE_STATUS.busy ||
        databaseStatus === DATABASE_STATUS.runningCommand
      )
        return;

      setDatabaseStatus(DATABASE_STATUS.runningCommand);

      worker.current.onmessage = (event: any) => {
        if (isDev) console.log(event.data.buffer);

        setDatabaseStatus(DATABASE_STATUS.ready);
        handleBuffer(event.data.buffer);
      };

      if (isDev) console.log("Exporting database");

      worker.current.postMessage({ action: "export" });
    },
    [databaseStatus, isDev]
  );

  const closeDatabase = useCallback(() => {
    if (
      databaseStatus === DATABASE_STATUS.busy ||
      databaseStatus === DATABASE_STATUS.runningCommand
    )
      return;

    setDatabaseStatus(DATABASE_STATUS.busy);

    worker.current.onmessage = () => {
      setDatabaseStatus(DATABASE_STATUS.notLoaded);

      if (isDev) console.log("Database closed");
    };

    worker.current.postMessage({
      action: "close",
    });
  }, [databaseStatus, isDev]);

  return {
    databaseStatus,
    loadDatabase,
    execCommand,
    exportDatabase,
    closeDatabase,
  };
};