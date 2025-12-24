import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './electron/db/schema.ts',
  out: './electron/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './database.db'
  },
  verbose: true,
  strict: true
});
