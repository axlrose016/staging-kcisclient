import PouchDB from "pouchdb";

export const db = new PouchDB("kcis-offline-db");

async function syncWithServer() {
  const remoteDB = new PouchDB("http://your-couchdb-server.com/my_database");
  db.sync(remoteDB, { live: true, retry: true });
}
