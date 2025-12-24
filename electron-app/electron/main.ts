import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path';
import { initDB, closeDB } from './db/index';
import { registerIpcHandlers } from './ipc/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.cjs');
  console.log('📂 Preload path:', preloadPath);
  console.log('📂 __dirname:', __dirname);
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#0f0f1e',
    titleBarStyle: 'default',
    show: false,
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize database and IPC handlers
app.whenReady().then(() => {
  initDB();
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    closeDB();
    app.quit();
  }
});

app.on('before-quit', () => {
  closeDB();
});
