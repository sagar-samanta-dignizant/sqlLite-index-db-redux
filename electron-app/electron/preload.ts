const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // User operations
  getUsers: () => ipcRenderer.invoke('db:getUsers'),
  saveUsers: (users: any[]) => ipcRenderer.invoke('db:saveUsers', users),
  clearUsers: () => ipcRenderer.invoke('db:clearUsers'),
  
  // Space operations
  getSpaces: () => ipcRenderer.invoke('db:getSpaces'),
  saveSpaces: (spaces: any[]) => ipcRenderer.invoke('db:saveSpaces', spaces),
  clearSpaces: () => ipcRenderer.invoke('db:clearSpaces'),
});

// Type definitions for renderer process
export interface ElectronAPI {
  getUsers: () => Promise<any[]>;
  saveUsers: (users: any[]) => Promise<any[]>;
  clearUsers: () => Promise<void>;
  getSpaces: () => Promise<any[]>;
  saveSpaces: (spaces: any[]) => Promise<any[]>;
  clearSpaces: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
