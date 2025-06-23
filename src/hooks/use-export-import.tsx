import { useCallback } from 'react';
import Dexie from 'dexie';
import { decryptJsonAsync, encryptJsonAsync } from '@/lib/utils';

export const useExportImport = (dbs: Dexie[]) => {
  const exportToJSON = useCallback(async () => {
    try {
      const fullData: Record<string, Record<string, any[]>> = {};

      for (const db of dbs) {
        const dbData: Record<string, any[]> = {};
        for (const table of db.tables) {
          dbData[table.name] = await table.toArray();
        }
        fullData[db.name] = dbData;
      }

      const json = JSON.stringify(fullData);
      const encrypted = await encryptJsonAsync(json);

      const blob = new Blob([encrypted], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kcis-encrypted-db-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Export failed:", error);
      return false;
    }
  }, [dbs]);

  const importFromJSON = useCallback(async (file: File) => {
    try {
        const encryptedText = await file.text(); // Read file as string
        const decrypted = await decryptJsonAsync(encryptedText); // Decrypt string

        if (!decrypted) {
          throw new Error("Decryption failed or empty.");
        }

        const parsedData = JSON.parse(decrypted); // Convert JSON string to object

      for (const db of dbs) {
        const dbData = parsedData[db.name];
        if (!dbData) continue;

        await db.transaction('rw', db.tables, async () => {
          for (const table of db.tables) {
            const tableData = dbData[table.name];
            if (Array.isArray(tableData)) {
              await table.bulkPut(tableData);
            }
          }
        });
      }

      return true;
    } catch (error) {
      console.error("Import failed:", error);
      return false;
    }
  }, [dbs]);

  return { exportToJSON, importFromJSON };
};
