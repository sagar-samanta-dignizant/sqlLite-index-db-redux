const { contextBridge, ipcRenderer } = require('electron');

console.log('🔧 Preload script starting...');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // User operations
    getUsers: () => ipcRenderer.invoke('db:getUsers'),
    saveUsers: (users) => ipcRenderer.invoke('db:saveUsers', users),
    clearUsers: () => ipcRenderer.invoke('db:clearUsers'),

    // Space operations
    getSpaces: () => ipcRenderer.invoke('db:getSpaces'),
    saveSpaces: (spaces) => ipcRenderer.invoke('db:saveSpaces', spaces),
    clearSpaces: () => ipcRenderer.invoke('db:clearSpaces'),
});

console.log('✅ Preload script completed - electronAPI exposed');
