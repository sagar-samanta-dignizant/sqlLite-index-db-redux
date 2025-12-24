const DB_NAME = 'workspace-db';
const DB_VERSION = 1;
const USERS_STORE = 'users';
const SPACES_STORE = 'spaces';

let db: IDBDatabase | null = null;

export const initIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Create users store
      if (!database.objectStoreNames.contains(USERS_STORE)) {
        const usersStore = database.createObjectStore(USERS_STORE, { keyPath: 'id' });
        usersStore.createIndex('email', 'email', { unique: true });
      }

      // Create spaces store
      if (!database.objectStoreNames.contains(SPACES_STORE)) {
        database.createObjectStore(SPACES_STORE, { keyPath: 'id' });
      }
    };
  });
};

export const getFromIndexedDB = async (storeName: string): Promise<any[]> => {
  const database = await initIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const saveToIndexedDB = async (storeName: string, data: any[]): Promise<any[]> => {
  const database = await initIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    // Clear existing data
    store.clear();

    // Add new data
    data.forEach(item => store.put(item));

    transaction.oncomplete = () => resolve(data);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const clearIndexedDB = async (storeName: string): Promise<void> => {
  const database = await initIndexedDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
