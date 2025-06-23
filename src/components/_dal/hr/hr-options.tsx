import { LibraryOption } from "@/components/interfaces/library-interface";
import { hrDb } from "@/db/offline/Dexie/databases/hrDb";
import { cache } from "react";

export const getOfflineHROptions = (library: string, descriptionField: string, p0?: string[]): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        const results = await hrDb.table(library).toArray();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
            label: row[descriptionField],
            short_name: row.short_name // 👈 add this field            
        }));
    });
}

export const getOfflineItemCodes = getOfflineHROptions("position_item","item_code")
