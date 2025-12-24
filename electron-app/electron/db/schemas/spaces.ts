import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const spaces = sqliteTable('spaces', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  icon: text('icon'),
  color: text('color'),
  memberCount: integer('member_count').default(0),
  isPrivate: integer('is_private', { mode: 'boolean' }).default(false),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
  syncedAt: text('synced_at').default('CURRENT_TIMESTAMP')
});

export type Space = typeof spaces.$inferSelect;
export type InsertSpace = typeof spaces.$inferInsert;
