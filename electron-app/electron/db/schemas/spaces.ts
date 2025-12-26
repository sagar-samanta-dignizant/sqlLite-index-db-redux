import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
// We need to define types that match the JSON structure but Drizzle stores them as strings (unless using specific mode)
// Since explicit 'json' mode in sqlite-core is basically text handled as JSON at runtime

export const spaces = sqliteTable('spaces', {
  id: integer('id').primaryKey(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
  deleted: integer('deleted', { mode: 'boolean' }).default(false),
  deleted_at: text('deleted_at'),
  deleted_by: text('deleted_by'),
  perma_delete_at: text('perma_delete_at'),
  length: integer('length').default(0),
  owner_id: integer('owner_id').notNull(),
  type: text('type').notNull(), // 'personal', 'work' etc
  profile_type: text('profile_type').notNull(),
  name: text('name').notNull(),
  no_logo_colour: text('no_logo_colour'),
  logo_url: text('logo_url'),
  banner_url: text('banner_url'),
  description: text('description'),
  terms: integer('terms', { mode: 'boolean' }).default(false),
  terms_text: text('terms_text'),
  created_by: integer('created_by'),
  
  // Counts and simple fields
  unreadCount: integer('unreadCount').default(0),
  isMention: integer('isMention', { mode: 'boolean' }).default(false),
  isInvited: integer('isInvited', { mode: 'boolean' }).default(false),

  // JSON Columns for nested structures
  // mode: 'json' automatically parses/stringifies
  _count: text('_count', { mode: 'json' }),
  activeCalls: text('activeCalls', { mode: 'json' }),
  spaceRoles: text('spaceRoles', { mode: 'json' }),
  categories: text('categories', { mode: 'json' }),


  synced_at: text('synced_at').default('CURRENT_TIMESTAMP')
});

export type SpaceSchema = typeof spaces.$inferSelect;
export type InsertSpaceSchema = typeof spaces.$inferInsert;
