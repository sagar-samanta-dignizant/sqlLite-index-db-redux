import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const flowMembers = sqliteTable('flow_members', {
  id: integer('id').primaryKey(),
  flow_id: integer('flow_id').notNull(),
  member_id: integer('member_id').notNull(),
  
  // Settings
  pinned: integer('pinned', { mode: 'boolean' }).default(false),
  show: integer('show', { mode: 'boolean' }).default(true),
  muted: integer('muted', { mode: 'boolean' }).default(false),
  app_notification: integer('app_notification', { mode: 'boolean' }).default(true),
  desktop_notification: integer('desktop_notification', { mode: 'boolean' }).default(true),
  email_notification: integer('email_notification', { mode: 'boolean' }).default(false),
  active: integer('active', { mode: 'boolean' }).default(true),
  
  unread_messages: integer('unread_messages').default(0),
  key: text('key'),
  isVisible: integer('isVisible', { mode: 'boolean' }).default(true),
  
  // JSON/Complex fields
  callStatus: text('callStatus', { mode: 'json' }),
  user: text('user', { mode: 'json' }), // Denormalized user snapshot if needed
  
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
  synced_at: text('synced_at').default('CURRENT_TIMESTAMP')
});

export type FlowMemberSchema = typeof flowMembers.$inferSelect;
export type InsertFlowMemberSchema = typeof flowMembers.$inferInsert;
