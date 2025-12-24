import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
