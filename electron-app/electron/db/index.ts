import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import * as spacesSchema from './schemas/spaces';
import * as flowsSchema from './schemas/flows';
import * as spaceMembersSchema from './schemas/space_members';
import * as flowMembersSchema from './schemas/flow_members';
import * as relationsSchema from './schemas/relations';

let db: ReturnType<typeof drizzle<typeof schema>>;
let sqlite: Database.Database;

const schema = {
  ...spacesSchema,
  ...flowsSchema,
  ...spaceMembersSchema,
  ...flowMembersSchema,
  ...relationsSchema
};

// Initialize database
export function initDB() {
  const dbPath = path.join(app.getPath('userData'), 'database.db');
  
  sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema });

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
        categories TEXT,
        
        synced_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      DROP TABLE IF EXISTS flows;

      CREATE TABLE IF NOT EXISTS flows (
        id INTEGER PRIMARY KEY,
        space_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        nodeType TEXT,
        type TEXT,
        icon TEXT,
        attributes TEXT,
        branch TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        created_by TEXT,
        synced_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      DROP TABLE IF EXISTS space_members;

      CREATE TABLE IF NOT EXISTS space_members (
        id INTEGER PRIMARY KEY,
        space_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        status TEXT,
        is_admin INTEGER DEFAULT 0,
        isVisible INTEGER DEFAULT 1,
        invite_email TEXT,
        invite_username TEXT,
        invite_alias TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        synced_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      DROP TABLE IF EXISTS flow_members;

      CREATE TABLE IF NOT EXISTS flow_members (
        id INTEGER PRIMARY KEY,
        flow_id INTEGER NOT NULL,
        member_id INTEGER NOT NULL,
        pinned INTEGER DEFAULT 0,
        show INTEGER DEFAULT 1,
        muted INTEGER DEFAULT 0,
        app_notification INTEGER DEFAULT 1,
        desktop_notification INTEGER DEFAULT 1,
        email_notification INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        unread_messages INTEGER DEFAULT 0,
        key TEXT,
        isVisible INTEGER DEFAULT 1,
        callStatus TEXT,
        user TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
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
