import { isElectron } from '../utils';
import { getFromIndexedDB, saveToIndexedDB, clearIndexedDB } from '../drivers/indexeddb';

const USERS_STORE = 'users';

export const userRepository = {
  async getAll() {
    if (isElectron()) {
      return await window.electronAPI!.getUsers();
    } else {
      return await getFromIndexedDB(USERS_STORE);
    }
  },

  async save(users: any[]) {
    if (isElectron()) {
      return await window.electronAPI!.saveUsers(users);
    } else {
      return await saveToIndexedDB(USERS_STORE, users);
    }
  },

  async clear() {
    if (isElectron()) {
      await window.electronAPI!.clearUsers();
    } else {
      await clearIndexedDB(USERS_STORE);
    }
  }
};
