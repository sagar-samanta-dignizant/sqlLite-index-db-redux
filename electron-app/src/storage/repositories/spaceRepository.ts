import { createPlatformRepository } from '../utils';
import { getFromIndexedDB, saveToIndexedDB, clearIndexedDB } from '../drivers/indexeddb';

const SPACES_STORE = 'spaces';

interface SpaceRepository {
  getAll(): Promise<any>;
  save(spaces: any[]): Promise<any>;
  clear(): Promise<void>;
}

const electronSpaceRepository: SpaceRepository = {
  async getAll() {
    return await window.electronAPI.getSpaces();
  },
  async save(spaces: any[]) {
    return await window.electronAPI.saveSpaces(spaces);
  },
  async clear() {
    await window.electronAPI.clearSpaces();
  }
};

const webSpaceRepository: SpaceRepository = {
  async getAll() {
    return await getFromIndexedDB(SPACES_STORE);
  },
  async save(spaces: any[]) {
    return await saveToIndexedDB(SPACES_STORE, spaces);
  },
  async clear() {
    await clearIndexedDB(SPACES_STORE);
  }
};

export const spaceRepository = createPlatformRepository(electronSpaceRepository, webSpaceRepository);
