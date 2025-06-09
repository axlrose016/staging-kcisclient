import { drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";
import { migrate } from "drizzle-orm/sql-js/migrator"; // Import the migration function
import { seed } from "../utils/seed";

export async function getDb() {
  const SQL = await initSqlJs({
    locateFile: (file) => "./public/sql-wasm.wasm", // Ensure this file is in `public/`
  });

  // Initialize the database
  const db = new SQL.Database();
  console.log("✅ SQL.js Database Initialized");

  // Wrap the database with Drizzle ORM
  const drizzleDb = drizzle(db);

  // Run migrations
  try {
    await migrate(drizzleDb, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations Applied Successfully");
  } catch (error) {
    console.error("❌ Migration Error:", error);
  }

  //Query to check existing tables
  try {
    const result = db.exec("SELECT name FROM sqlite_master WHERE type='table';");
    console.log("📌 Tables in Database:", result[0]?.values || []);
  } catch (error) {
    console.error("❌ Error Fetching Tables:", error);
  }

  try{
    await seed(drizzleDb);  // Assuming `seed` is an async function that performs the database seeding.
    console.log("✅ Database Seeded Successfully");
  } catch (error) {
    console.error("❌ Error Seeding Tables:", error);
  }

    
  return drizzleDb;
}

// Export the database instance
export const sqliteDb = await getDb();
