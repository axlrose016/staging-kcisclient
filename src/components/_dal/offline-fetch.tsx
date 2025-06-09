import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { cache } from "react";

export const getOfflineListData = (table:string) : () => Promise<any> => {
    return cache(async () => {
        await dexieDb.open();
        const results = await dexieDb.table(table).filter(item => item.is_deleted !== true).toArray();
        return results;
    })
}

export const getOfflineData = (table: string, expression: string): () => Promise<any> => {
    return cache(async () => {
        await dexieDb.open();
        const results = await dexieDb.table(table).where(expression);
        return results;
    });
};
