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
