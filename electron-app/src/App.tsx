import { useState } from 'react';
import UsersList from './components/UsersList';
import SpacesList from './components/SpacesList';
import { storageAPI } from './storage';
import './styles/index.css';

type Tab = 'users' | 'spaces';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const isElectron = storageAPI.isElectron();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <div>
              <h1>Electron Workspace</h1>
              <p className="tagline">
                Vite + React + Redux + {isElectron ? 'SQLite' : 'IndexedDB'}
                <span className="storage-badge">
                  {isElectron ? '💾 Electron' : '🌐 Browser'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="tab-icon">👥</span>
          Users
        </button>
        <button
          className={`tab ${activeTab === 'spaces' ? 'active' : ''}`}
          onClick={() => setActiveTab('spaces')}
        >
          <span className="tab-icon">📁</span>
          Spaces
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'users' && <UsersList />}
        {activeTab === 'spaces' && <SpacesList />}
      </main>

      <footer className="app-footer">
        <p>
          Built with <span className="heart">❤️</span> using Electron, Vite,
          React, Redux, and Drizzle ORM
        </p>
      </footer>
    </div>
  );
}

export default App;
