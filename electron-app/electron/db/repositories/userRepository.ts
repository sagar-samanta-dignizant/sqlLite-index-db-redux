import { db } from '../index';
import { users, type InsertUser } from '../schemas/users';
import { eq } from 'drizzle-orm';

export const userRepository = {
  async getAll() {
    return db.select().from(users).all();
  },

  async insert(userData: InsertUser[]) {
    // Clear existing users - transaction would be better here but simple delete works for now
    await db.delete(users);
    
    // Insert new users
    for (const user of userData) {
      await db.insert(users).values({
        ...user,
        updatedAt: new Date().toISOString()
      }).onConflictDoUpdate({
        target: users.id,
        set: {
          ...user,
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    return this.getAll();
  },

  async clear() {
    return db.delete(users);
  }
};
