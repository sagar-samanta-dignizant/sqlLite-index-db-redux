import { db } from '../index';
import { spaces } from '../schemas/spaces';
import { flows } from '../schemas/flows';
import { spaceMembers } from '../schemas/space_members';
import { flowMembers } from '../schemas/flow_members';

export const spaceRepository = {
  async getAll() {
    // Drizzle Relational Query: Deep fetch of Spaces -> Flows -> FlowMembers & Spaces -> SpaceMembers
    return db.query.spaces.findMany({
      with: {
        flows: {
          with: {
            flow_members: true
          }
        },
        space_members: true
      }
    });
  },

  async insert(spaceData: any[]) {
    // Optimization: Wrap everything in a single transaction
    await db.transaction(async (tx) => {
      // 1. Clear existing data
      await tx.delete(flowMembers);
      await tx.delete(spaceMembers);
      await tx.delete(flows);
      await tx.delete(spaces);

      if (spaceData.length > 0) {
        // Flattened arrays for bulk insert
        const formattedSpaces: any[] = [];
        const formattedSpaceMembers: any[] = [];
        const formattedFlows: any[] = [];
        const formattedFlowMembers: any[] = [];

        for (const space of spaceData) {
          // Destructure to separate nested data from space metadata
          const { flows: spaceFlows, spaceMembers: members, ...spaceProps } = space;

          // 1. Prepare Space
          formattedSpaces.push({
             ...spaceProps,
             synced_at: new Date().toISOString()
          });

          // 2. Prepare Space Members
          if (members && Array.isArray(members)) {
            for (const member of members) {
              formattedSpaceMembers.push({
                ...member,
                space_id: space.id,
                synced_at: new Date().toISOString()
              });
            }
          }

          // 3. Prepare Flows & Flow Members
          if (spaceFlows && Array.isArray(spaceFlows)) {
            for (const flow of spaceFlows) {
              const { flow_member: fMembers, ...flowProps } = flow;
              
              formattedFlows.push({
                ...flowProps,
                space_id: space.id,
                synced_at: new Date().toISOString()
              });

              if (fMembers && Array.isArray(fMembers)) {
                for (const fMember of fMembers) {
                  formattedFlowMembers.push({
                     ...fMember,
                     flow_id: flow.id,
                     synced_at: new Date().toISOString()
                  });
                }
              }
            }
          }
        }

        // Batch Inserts (Order is not strictly enforced by SQLite but good practice: Parent -> Child)
        // However, bulk inserts are independent if constraints aren't checked immediately or if keys are provided.
        // Since we explicitly provide IDs, order doesn't strictly matter for inserting, but let's follow hierarchy.
        
        if (formattedSpaces.length > 0) await tx.insert(spaces).values(formattedSpaces);
        if (formattedSpaceMembers.length > 0) await tx.insert(spaceMembers).values(formattedSpaceMembers);
        if (formattedFlows.length > 0) await tx.insert(flows).values(formattedFlows);
        if (formattedFlowMembers.length > 0) await tx.insert(flowMembers).values(formattedFlowMembers);
      }
    });
    
    return this.getAll();
  },

  async clear() {
    return db.transaction(async (tx) => {
      await tx.delete(flowMembers);
      await tx.delete(spaceMembers);
      await tx.delete(flows);
      await tx.delete(spaces);
    });
  }
};
