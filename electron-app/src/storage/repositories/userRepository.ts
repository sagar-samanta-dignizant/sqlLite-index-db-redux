import { createPlatformRepository } from '../utils';
import { getFromIndexedDB, saveToIndexedDB, clearIndexedDB } from '../drivers/indexeddb';

const USERS_STORE = 'users';

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
    return await getFromIndexedDB(USERS_STORE);
  },
  async save(users: any[]) {
    return await saveToIndexedDB(USERS_STORE, users);
  },
  async clear() {
    await clearIndexedDB(USERS_STORE);
  }
};

export const userRepository = createPlatformRepository(electronUserRepository, webUserRepository);
