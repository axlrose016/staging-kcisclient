import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import  fs from "fs";

import { seedLibrary } from './utils/migrate';

const DB_FILE = process.env.LOCAL_DB_URL!;
console.log("DB_FILE", DB_FILE)
const shouldMigrate = !fs.existsSync(DB_FILE);
const client = createClient({ url: DB_FILE});

export const db = drizzle(client);

if (shouldMigrate) {
    await import("./utils/migrate")
      .then((m) => m.migrateDatabase(db))
      .catch((err) => console.error("Migration failed:", err));

    await seedLibrary(db);
  }