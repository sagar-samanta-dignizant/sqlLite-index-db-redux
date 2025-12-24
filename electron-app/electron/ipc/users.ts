import { ipcMain } from 'electron';
import { userRepository } from '../db/repositories/userRepository';

export function registerUserHandlers() {
  ipcMain.handle('db:getUsers', async () => {
    try {
      return await userRepository.getAll();
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  });

  ipcMain.handle('db:saveUsers', async (event, users) => {
    try {
      return await userRepository.insert(users);
    } catch (error) {
      console.error('Error saving users:', error);
      throw error;
    }
  });

  ipcMain.handle('db:clearUsers', async () => {
    try {
      await userRepository.clear();
    } catch (error) {
      console.error('Error clearing users:', error);
      throw error;
    }
  });
}
