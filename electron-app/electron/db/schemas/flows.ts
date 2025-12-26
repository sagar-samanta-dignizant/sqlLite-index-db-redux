import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const flows = sqliteTable('flows', {
  id: integer('id').primaryKey(),
  space_id: integer('space_id').notNull(),
  name: text('name').notNull(),
  
  // JSON Columns for nested structures
  // This contains the 500+ members

  
  // Other flow fields
  nodeType: text('nodeType'),
  type: text('type'),
  icon: text('icon'),
  attributes: text('attributes', { mode: 'json' }),
  branch: text('branch', { mode: 'json' }),
  
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
  created_by: text('created_by'),
  
  synced_at: text('synced_at').default('CURRENT_TIMESTAMP')
});

export type FlowSchema = typeof flows.$inferSelect;
export type InsertFlowSchema = typeof flows.$inferInsert;
