import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchSpaces, loadSpacesFromCache, Space } from '../store/spacesSlice';

export default function SpacesList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: spaces, loading, error, lastFetched } = useSelector(
    (state: RootState) => state.spaces
  );

  useEffect(() => {
    // Load from cache on component mount (instant, no API call)
    dispatch(loadSpacesFromCache()).then((result: any) => {
      // If cache is empty, automatically fetch from API
      if (result.payload && result.payload.spaces.length === 0) {
        dispatch(fetchSpaces());
      }
    });
  }, [dispatch]);

  const handleRefresh = () => {
    // This explicitly fetches from API and updates cache
    console.log('Fetching fresh spaces from API...');
    dispatch(fetchSpaces());
  };

  if (loading && spaces.length === 0) {
    return (
      <div className="skeleton-container">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && spaces.length === 0) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Failed to load spaces</h3>
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
          <h2>📁 Workspaces</h2>
          <p className="subtitle">
            {spaces.length} {spaces.length === 1 ? 'space' : 'spaces'}
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

      {spaces.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No spaces cached yet</h3>
          <p>Click refresh to fetch spaces from the API and cache them locally</p>
          <button onClick={handleRefresh} className="btn-primary">
            Fetch Spaces from API
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {spaces.map((space: Space) => (
            <div key={space.id} className="card space-card">
              <div
                className="space-header"
                style={{
                  background: `linear-gradient(135deg, ${space.color}22 0%, ${space.color}44 100%)`,
                }}
              >
                <div
                  className="space-icon"
                  style={{ backgroundColor: space.color }}
                >
                  {space.icon}
                </div>
                {space.isPrivate && (
                  <span className="private-badge" title="Private">
                    🔒
                  </span>
                )}
              </div>
              <div className="card-content">
                <h3 className="space-name">{space.name}</h3>
                <p className="space-description">
                  {space.description || 'No description'}
                </p>
                <div className="space-meta">
                  <span className="badge type-badge">{space.type}</span>
                  <span className="member-count">
                    👥 {space.memberCount || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
