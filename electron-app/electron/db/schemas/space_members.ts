import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const spaceMembers = sqliteTable('space_members', {
  id: integer('id').primaryKey(),
  space_id: integer('space_id').notNull(),
  user_id: integer('user_id').notNull(),
  
  status: text('status'),
  is_admin: integer('is_admin', { mode: 'boolean' }).default(false),
  isVisible: integer('isVisible', { mode: 'boolean' }).default(true),
  
  invite_email: text('invite_email'),
  invite_username: text('invite_username'),
  invite_alias: text('invite_alias'),
  notes: text('notes'),
  
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
  synced_at: text('synced_at').default('CURRENT_TIMESTAMP')
});

export type SpaceMemberSchema = typeof spaceMembers.$inferSelect;
export type InsertSpaceMemberSchema = typeof spaceMembers.$inferInsert;
