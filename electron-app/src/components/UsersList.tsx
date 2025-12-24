import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUsers, loadUsersFromCache, User } from '../store/usersSlice';

export default function UsersList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: users, loading, error, lastFetched } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    // Load from cache on component mount (instant, no API call)
    dispatch(loadUsersFromCache()).then((result: any) => {
      // If cache is empty, automatically fetch from API
      if (result.payload && result.payload.users.length === 0) {
        dispatch(fetchUsers());
      }
    });
  }, [dispatch]);

  const handleRefresh = () => {
    // This explicitly fetches from API and updates cache
    console.log('Fetching fresh users from API...');
    dispatch(fetchUsers());
  };

  if (loading && users.length === 0) {
    return (
      <div className="skeleton-container">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Failed to load users</h3>
        <p>{error}</p>
        <button onClick={handleRefresh} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <div>
          <h2>👥 Team Members</h2>
          <p className="subtitle">
            {users.length} {users.length === 1 ? 'user' : 'users'}
            {lastFetched && (
              <span className="last-updated">
                {' '}
                • Last synced: {new Date(lastFetched).toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn-refresh"
          disabled={loading}
        >
          {loading ? '↻ Syncing...' : '↻ Refresh'}
        </button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>No users cached yet</h3>
          <p>Click refresh to fetch users from the API and cache them locally</p>
          <button onClick={handleRefresh} className="btn-primary">
            Fetch Users from API
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {users.map((user: User) => (
            <div key={user.id} className="card user-card">
              <div className="card-header">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt={user.name}
                  className="user-avatar"
                />
                <div
                  className={`status-badge ${user.status || 'active'}`}
                  title={user.status || 'active'}
                ></div>
              </div>
              <div className="card-content">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-email">{user.email}</p>
                {user.role && <p className="user-role">{user.role}</p>}
                {user.department && (
                  <span className="badge">{user.department}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
