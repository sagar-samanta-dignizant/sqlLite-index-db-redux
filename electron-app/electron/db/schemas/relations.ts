import { relations } from 'drizzle-orm';
import { spaces } from './spaces';
import { flows } from './flows';
import { spaceMembers } from './space_members';
import { flowMembers } from './flow_members';

export const spacesRelations = relations(spaces, ({ many }) => ({
  flows: many(flows),
  space_members: many(spaceMembers),
}));

export const flowsRelations = relations(flows, ({ one, many }) => ({
  space: one(spaces, {
    fields: [flows.space_id],
    references: [spaces.id],
  }),
  flow_members: many(flowMembers),
}));

export const spaceMembersRelations = relations(spaceMembers, ({ one }) => ({
  space: one(spaces, {
    fields: [spaceMembers.space_id],
    references: [spaces.id],
  }),
}));

export const flowMembersRelations = relations(flowMembers, ({ one }) => ({
  flow: one(flows, {
    fields: [flowMembers.flow_id],
    references: [flows.id],
  }),
}));
