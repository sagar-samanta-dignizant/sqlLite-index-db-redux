import { isElectron } from '../utils';
import { getFromIndexedDB, saveToIndexedDB, clearIndexedDB } from '../drivers/indexeddb';

const SPACES_STORE = 'spaces';

export const spaceRepository = {
  async getAll() {
    if (isElectron()) {
      return await window.electronAPI!.getSpaces();
    } else {
      return await getFromIndexedDB(SPACES_STORE);
    }
  },

  async save(spaces: any[]) {
    if (isElectron()) {
      return await window.electronAPI!.saveSpaces(spaces);
    } else {
      return await saveToIndexedDB(SPACES_STORE, spaces);
    }
  },

  async clear() {
    if (isElectron()) {
      await window.electronAPI!.clearSpaces();
    } else {
      await clearIndexedDB(SPACES_STORE);
    }
  }
};
