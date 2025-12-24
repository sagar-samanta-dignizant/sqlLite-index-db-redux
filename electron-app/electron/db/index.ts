import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { app } from 'electron';
import * as path from 'path';

let db: ReturnType<typeof drizzle>;
let sqlite: Database.Database;

// Initialize database
export function initDB() {
  const dbPath = path.join(app.getPath('userData'), 'database.db');
  
  sqlite = new Database(dbPath);
  db = drizzle(sqlite);

  // Enable WAL mode for better concurrency
  sqlite.pragma('journal_mode = WAL');

  // Run migrations (create tables)
  runMigrations();

  return db;
}

function runMigrations() {
  try {
    // Create tables if they don't exist
    // In a real production app, use drizzle-kit migrate
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        avatar TEXT,
        role TEXT,
        department TEXT,
        status TEXT DEFAULT 'active',
        joined_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS spaces (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        member_count INTEGER DEFAULT 0,
        is_private INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT,
        synced_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Close database connection
export function closeDB() {
  if (sqlite) {
    sqlite.close();
  }
}

export { db };
