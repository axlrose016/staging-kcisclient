import { auditDb } from "@/db/offline/Dexie/databases/auditDb";
import Dexie from "dexie";
import { v4 as uuidv4 } from "uuid";

export function _registerAuditHooks(db: Dexie, module: string, email: string) {
  db.tables.forEach((table) => {
    const tableName = table.name;

    if (tableName === "auditTrail") return;

    // ✅ CREATE HOOK
    table.hook("creating", function (primKey, obj, trans) {
      if (!trans.meta?.needsAudit) return;

      setTimeout(() => {
        this.onsuccess = (generatedKey: any) => {
          try {
            auditDb.auditTrail.add({
              id: uuidv4(),
              module,
              transacted_by: email,
              table: tableName,
              operation: "create",
              timestamp: new Date().toISOString(),
              primaryKey: generatedKey ?? primKey ?? "autoincrement",
              newValue: obj,
            });
          } catch (err) {
            console.error(`[AuditTrail CREATE] Error logging audit for ${tableName}:` + err);
          }
        };
      });
    });

    // ✅ UPDATE HOOK
    table.hook("updating", function (mods, primKey, oldObj, trans) {
      if (!trans.meta?.needsAudit) return;

      const newValue = { ...oldObj, ...mods };

      setTimeout(() => {
        this.onsuccess = () => {
          try {
            auditDb.auditTrail.add({
              id: uuidv4(),
              module,
              transacted_by: email,
              table: tableName,
              operation: "update",
              timestamp: new Date().toISOString(),
              primaryKey: primKey,
              oldValue: oldObj,
              newValue,
            });
          } catch (err) {
            console.error(`[AuditTrail UPDATE] Error logging audit for ${tableName}:`, err);
          }
        };
      });
    });

    // ✅ DELETE HOOK
    table.hook("deleting", function (primKey, obj, trans) {
      if (!trans.meta?.needsAudit) return;

      setTimeout(() => {
        this.onsuccess = () => {
          try {
            auditDb.auditTrail.add({
              id: uuidv4(),
              module,
              transacted_by: email,
              table: tableName,
              operation: "delete",
              timestamp: new Date().toISOString(),
              primaryKey: primKey,
              oldValue: obj,
            });
          } catch (err) {
            console.error(`[AuditTrail DELETE] Error logging audit for ${tableName}:`, err);
          }
        };
      });
    });
  });
}
