import { db } from '../index';
import { spaces, type InsertSpaceSchema } from '../schemas/spaces';

export const spaceRepository = {
  async getAll() {
    return db.select().from(spaces).all();
  },

  async insert(spaceData: InsertSpaceSchema[]) {
    await db.delete(spaces);
    
    // Optimized: Delete all and re-enter is cleaner for local cache sync
    if (spaceData.length > 0) {
      const formattedValues = spaceData.map(space => ({
        ...space,
        syncedAt: new Date().toISOString()
      }));
      await db.insert(spaces).values(formattedValues);
    }
    
    return this.getAll();
  },

  async clear() {
    return db.delete(spaces);
  }
};
