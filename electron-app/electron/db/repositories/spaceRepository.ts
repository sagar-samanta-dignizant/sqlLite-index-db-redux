import { db } from '../index';
import { spaces, type InsertSpace } from '../schemas/spaces';

export const spaceRepository = {
  async getAll() {
    return db.select().from(spaces).all();
  },

  async insert(spaceData: InsertSpace[]) {
    await db.delete(spaces);
    
    for (const space of spaceData) {
      await db.insert(spaces).values({
        ...space,
        syncedAt: new Date().toISOString()
      }).onConflictDoUpdate({
        target: spaces.id,
        set: {
          ...space,
          syncedAt: new Date().toISOString()
        }
      });
    }
    
    return this.getAll();
  },

  async clear() {
    return db.delete(spaces);
  }
};
