import { createPlatformRepository } from '../utils';
import { db } from '../db';



interface UserRepository {
  getAll(): Promise<any>;
  save(users: any[]): Promise<any>;
  clear(): Promise<void>;
}

const electronUserRepository: UserRepository = {
  async getAll() {
    return await window.electronAPI.getUsers();
  },
  async save(users: any[]) {
    return await window.electronAPI.saveUsers(users);
  },
  async clear() {
    await window.electronAPI.clearUsers();
  }
};

const webUserRepository: UserRepository = {
  async getAll() {
    return await db.users.toArray();
  },
  async save(users: any[]) {
    await db.transaction('rw', db.users, async () => {
        await db.users.clear();
        await db.users.bulkPut(users);
    });
    return this.getAll();
  },
  async clear() {
    await db.users.clear();
  }
};

export const userRepository = createPlatformRepository(electronUserRepository, webUserRepository);
