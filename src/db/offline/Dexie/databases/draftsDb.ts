import { IDrafts } from "@/components/interfaces/idrafts";
import Dexie, { Table } from "dexie";

class DraftsDatabase extends Dexie {
    drafts!: Table<IDrafts, string>;

    constructor() {
        super('draftsdb');
        this.version(1).stores({
            drafts: `module_path, data_string`,
        });
    }
}

export const draftsDb = new DraftsDatabase();