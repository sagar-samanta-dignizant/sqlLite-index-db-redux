# Electron Vite App with Redux and SQLite

A modern desktop application built with Electron, Vite, React, Redux Toolkit, and SQLite (via Drizzle ORM) for efficient data caching and management.

## 🚀 Features

- **Electron + Vite**: Fast development with hot module replacement
- **React + TypeScript**: Type-safe UI development
- **Redux Toolkit**: Centralized state management with async thunks
- **SQLite + Drizzle ORM**: Local database for data persistence and performance
- **Modern UI**: Premium design with glassmorphism, animations, and responsive layout
- **API Integration**: Fetches users and spaces from REST API and caches locally

## 📁 Project Structure

```
e:/idb/
├── api-server/              # Backend API
│   ├── data/
│   │   ├── users.js        # Dummy users data
│   │   └── spaces.js       # Dummy spaces data
│   ├── server.js           # Express server
│   └── package.json
│
└── electron-app/            # Electron application
    ├── electron/           # Main process
    │   ├── db/
    │   │   ├── schema.ts   # Drizzle schema
    │   │   └── index.ts    # Database operations
    │   ├── main.ts         # Electron main
    │   └── preload.ts      # Preload script
    ├── src/                # Renderer process
    │   ├── components/
    │   │   ├── UsersList.tsx
    │   │   └── SpacesList.tsx
    │   ├── store/
    │   │   ├── store.ts
    │   │   ├── usersSlice.ts
    │   │   └── spacesSlice.ts
    │   ├── styles/
    │   │   └── index.css
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## 🛠️ Tech Stack

### Backend API
- **Express.js**: REST API server
- **CORS**: Cross-origin resource sharing

### Electron App
- **Electron**: Desktop application framework
- **Vite**: Build tool and dev server
- **React 18**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **SQLite (better-sqlite3)**: Local database
- **Drizzle ORM**: Type-safe database operations

## 📦 Installation

### 1. Install API Server Dependencies

```bash
cd api-server
npm install
```

### 2. Install Electron App Dependencies

```bash
cd ../electron-app
npm install
```

## 🚀 Running the Application

### Step 1: Start the API Server

In one terminal:

```bash
cd api-server
npm start
```

The API server will run on `http://localhost:3000` with endpoints:
- `GET /api/users` - Get all users
- `GET /api/spaces` - Get all spaces

### Step 2: Start the Electron App

In another terminal:

```bash
cd electron-app
npm run electron:dev
```

This will:
1. Start Vite dev server on `http://localhost:5173`
2. Launch Electron window
3. Open DevTools for debugging

## 💡 How It Works

### Architecture

1. **API Server** (Node.js/Express)
   - Serves dummy users and spaces data
   - Simulates network latency (500ms)

2. **Electron Main Process**
   - Initializes SQLite database
   - Handles IPC communication
   - Manages database operations (CRUD)

3. **Electron Renderer Process** (React)
   - Displays UI with modern design
   - Uses Redux for state management
   - Fetches from API and caches to SQLite

### Data Flow

```
API Server → Redux Thunk → Electron IPC → SQLite Database
                    ↓
            Redux Store → React Components
                    ↑
SQLite Database → Electron IPC → Redux Thunk (cached data)
```

### Key Features

#### 🔄 Smart Caching
- **First Load**: Fetches from API, saves to SQLite
- **App Restart**: Instantly loads from SQLite cache
- **Refresh**: Updates from API and refreshes cache

#### 💾 SQLite Database
- Persistent storage in user data directory
- WAL mode for better concurrency
- Automatic migrations on startup
- Full CRUD operations via Drizzle ORM

#### 🎨 Premium UI
- Glassmorphism effects
- Smooth animations and transitions
- Loading skeletons
- Error states
- Responsive design
- Dark theme optimized

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT,
  role TEXT,
  department TEXT,
  status TEXT DEFAULT 'active',
  joined_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Spaces Table
```sql
CREATE TABLE spaces (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  member_count INTEGER DEFAULT 0,
  is_private INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT,
  synced_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Usage

1. **Launch the app** - Opens with empty state
2. **Click "Refresh"** - Fetches data from API and caches to SQLite
3. **View Users** - See team members with avatars, roles, and status
4. **View Spaces** - See workspaces with colors, icons, and member counts
5. **Close and Reopen** - Data loads instantly from SQLite cache
6. **Refresh Again** - Updates cache with latest API data

## 🏗️ Building for Production

```bash
cd electron-app
npm run build
```

This will create distributable packages in the `release/` directory.

## 🔧 Development

### Available Scripts

**API Server:**
- `npm start` - Start the API server

**Electron App:**
- `npm run dev` - Start Vite dev server only
- `npm run electron:dev` - Start Electron with Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 API Endpoints

### GET /api/users
Returns array of 20 users with fields:
- id, name, email, avatar, role, department, status, joinedAt

### GET /api/spaces
Returns array of 15 spaces with fields:
- id, name, description, type, icon, color, memberCount, isPrivate, createdAt, updatedAt

## 🐛 Troubleshooting

### SQLite Database Location
- Windows: `%APPDATA%/electron-vite-app/database.db`
- macOS: `~/Library/Application Support/electron-vite-app/database.db`
- Linux: `~/.config/electron-vite-app/database.db`

### Common Issues

1. **API Connection Failed**
   - Ensure API server is running on port 3000
   - Check if CORS is enabled

2. **Database Errors**
   - Delete the database file and restart
   - Check write permissions

3. **Build Errors**
   - Clear `node_modules` and reinstall
   - Ensure all dependencies are installed

## 📄 License

MIT

## 🙏 Acknowledgments

Built with ❤️ using:
- Electron
- Vite
- React
- Redux Toolkit
- Drizzle ORM
- better-sqlite3
