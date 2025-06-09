import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import { seed } from "./seed";

export async function migrateDatabase(db: any) {
    console.log("Running database migration...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration complete.");
}

export async function seedLibrary(db: any) {
    // console.log("Seeding library...");
    // await seed(db);
    // console.log("Library seeded.");
    try {
        console.log("Seeding library...");
        await seed(db);  // Assuming `seed` is an async function that performs the database seeding.
        console.log("Library seeded successfully.");
      } catch (error: any) {
        console.error("Failed to seed library:", error.message);  // Print the error message
        if (error.code) {
          console.error("Error Code:", error.code);  // Print the error code (if available)
        }
        if (error.stack) {
          console.error("Stack Trace:", error.stack);  // Print the full stack trace for debugging
        }
      }
}
