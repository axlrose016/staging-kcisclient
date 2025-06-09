import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema',  // Path to your schema files
  out: './drizzle',                // Output directory for generated files
  dialect: 'sqlite',               // Specify SQLite as the database dialect
  dbCredentials: {
    url: `${process.env.LOCAL_DB_URL}`,  
  },
});
