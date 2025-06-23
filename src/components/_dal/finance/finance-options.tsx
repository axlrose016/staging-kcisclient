import { LibraryOption } from "@/components/interfaces/library-interface";
import { financeDb } from "@/db/offline/Dexie/databases/financeDb";
import { cache } from "react";

export const getOfflineAllotmentOptions = (library: string, descriptionField: string, p0?: string[]): () => Promise<LibraryOption[]> => {
    return cache(async () => {
        const results = await financeDb.table(library).filter(f => !f.is_deleted).toArray();
        return results.map((row: any) => ({
            id: row.id,
            name: row[descriptionField],
            label: row[descriptionField],
            short_name: row.short_name // 👈 add this field            
        }));
    });
}

export const getOfflineAllotments = getOfflineAllotmentOptions("allotment","allotment_manual_id")
