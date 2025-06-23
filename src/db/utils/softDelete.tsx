import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import Dexie from 'dexie';

export const softDelete = async (
  db: Dexie,
  tableName: string,
  row: any,
  child?: Record<string, {table: string; foreignKey: string}[]>
): Promise<boolean> => {
  try {
    const _session = (await getSession()) as SessionPayload;

    const table = db.table(tableName);
    const primaryKey = table.schema.primKey.name;
    const id = row[primaryKey];

    if (id === undefined) {
      console.error(`Missing primary key (${primaryKey}) in row:`, row);
      return false;
    }

    await db.transaction('rw', db.tables, async (trans) => {
      trans.meta = {
        needsAudit: true,
      };

      // Soft delete the main row
      await table.update(id, {
        is_deleted: true,
        deleted_date: new Date().toISOString(),
        deleted_by: _session?.userData?.email ?? 'unknown',
        remarks: "Record deleted by "+_session?.userData.email,
        push_status_id: 2,
      });

      // Handle related child tables
      if(child){
      const relations = child[tableName];
      if (relations) {
        for (const { table: childTableName, foreignKey } of relations) {
          const childTable = db.table(childTableName);
          const children = await childTable
            .where(foreignKey)
            .equals(id)
            .toArray();

          for (const child of children) {
            const childId = child[childTable.schema.primKey.name];
            await childTable.update(childId, {
              is_deleted: true,
              deleted_date: new Date().toISOString(),
              deleted_by: _session?.userData?.email ?? 'unknown',
              remarks: "Record deleted by "+_session?.userData.email,
              push_status_id: 2,
            });
          }
        }
      }
      }
    });

    console.log(`Soft-deleted from ${tableName} and related children:`, id);
    return true;
  } catch (error) {
    console.error(`Soft delete failed on ${tableName}:`, error);
    return false;
  }
};
