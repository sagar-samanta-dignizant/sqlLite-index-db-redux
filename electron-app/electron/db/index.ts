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

      DROP TABLE IF EXISTS spaces;

      CREATE TABLE IF NOT EXISTS spaces (
        id INTEGER PRIMARY KEY,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted INTEGER DEFAULT 0,
        deleted_at TEXT,
        deleted_by TEXT,
        perma_delete_at TEXT,
        length INTEGER DEFAULT 0,
        owner_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        profile_type TEXT NOT NULL,
        name TEXT NOT NULL,
        no_logo_colour TEXT,
        logo_url TEXT,
        banner_url TEXT,
        description TEXT,
        terms INTEGER DEFAULT 0,
        terms_text TEXT,
        created_by INTEGER,
        unreadCount INTEGER DEFAULT 0,
        isMention INTEGER DEFAULT 0,
        isInvited INTEGER DEFAULT 0,
        
        _count TEXT,
        activeCalls TEXT,
        spaceRoles TEXT,
        flows TEXT,
        categories TEXT,
        spaceMembers TEXT,

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
