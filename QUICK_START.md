# Quick Start Guide

## 🚀 Run the Application

### Terminal 1: Start API Server

```bash
cd api-server
npm start
```

Wait for: `🚀 API Server running on http://localhost:3000`

### Terminal 2: Start Electron App

```bash
cd electron-app
npm run electron:dev
```

Wait for Electron window to open.

## 📖 First Use

1. **Users Tab** (default)
   - Click "Fetch Users" or "↻ Refresh"
   - See 20 users load from API
   - Data cached to SQLite

2. **Spaces Tab**
   - Click tab to switch
   - Click "Fetch Spaces" or "↻ Refresh"
   - See 15 spaces with colors

3. **Test Caching**
   - Close the app
   - Reopen it
   - Data loads instantly from SQLite!

## 🎯 API Endpoints

- `http://localhost:3000/api/users` - Get users
- `http://localhost:3000/api/spaces` - Get spaces

## 📁 Database Location

SQLite database is created at:
- Windows: `%APPDATA%/electron-vite-app/database.db`

## 🐛 Troubleshooting

**"Failed to fetch users"**
- Make sure API server is running on port 3000

**"Port already in use"**
- Kill the process on port 3000 or 5173

**Electron won't start**
- Check that all npm packages installed successfully
- Try: `cd electron-app && npm install`

## 📚 Documentation

See [README.md](file:///e:/idb/README.md) for complete documentation.
