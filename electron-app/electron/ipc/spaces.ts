import { ipcMain } from 'electron';
import { spaceRepository } from '../db/repositories/spaceRepository';

export function registerSpaceHandlers() {
  ipcMain.handle('db:getSpaces', async () => {
    try {
      return await spaceRepository.getAll();
    } catch (error) {
      console.error('Error getting spaces:', error);
      throw error;
    }
  });

  ipcMain.handle('db:saveSpaces', async (event, spaces) => {
    try {
      return await spaceRepository.insert(spaces);
    } catch (error) {
      console.error('Error saving spaces:', error);
      throw error;
    }
  });

  ipcMain.handle('db:clearSpaces', async () => {
    try {
      await spaceRepository.clear();
    } catch (error) {
      console.error('Error clearing spaces:', error);
      throw error;
    }
  });
}
