import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Users table schema
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'),
  role: text('role'),
  department: text('department'),
  status: text('status').default('active'),
  joinedAt: text('joined_at'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP')
});

// Spaces table schema
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

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Space = typeof spaces.$inferSelect;
export type InsertSpace = typeof spaces.$inferInsert;
