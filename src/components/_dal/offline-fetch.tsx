import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { cache } from "react";

export const getOfflineLibListData = (table:string):() => Promise<any> => {
    return cache(async () => {
        await libDb.open();
        const result = await libDb.table(table).filter(item => item.is_deleted !== true).toArray();
        return result;
    })
}

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
