import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchSpaces, loadSpacesFromCache } from '../store/spacesSlice';
import { Space, SpaceRole, SpaceMember } from '../types/models';

export default function SpacesList() {
  const dispatch = useAppDispatch();
  const { items: spaces, loading, error, lastFetched } = useAppSelector(
    (state) => state.spaces
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
                  background: space.no_logo_colour 
                    ? `linear-gradient(135deg, ${space.no_logo_colour}22 0%, ${space.no_logo_colour}44 100%)`
                    : 'linear-gradient(135deg, #6366f122 0%, #6366f144 100%)',
                }}
              >
                <div
                  className="space-icon"
                  style={{ backgroundColor: space.no_logo_colour || '#6366f1' }}
                >
                   {space.name.charAt(0)}
                </div>
                {space.profile_type === 'personal' && (
                  <span className="private-badge" title="Personal">
                    👤
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
                    👥 {space._count?.space_member || 0}
                  </span>
                </div>
                
                {/* Nested Data Visualization */}
                <div className="nested-preview">
                  <div className="preview-row">
                    <span className="label">Roles:</span>
                    <div className="tag-list">
                      {space.spaceRoles?.slice(0, 2).map((role: SpaceRole) => (
                        <span key={role.id} className="mini-tag" title={role.description}>
                          {role.icon} {role.name}
                        </span>
                      ))}
                      {(space.spaceRoles?.length || 0) > 2 && (
                        <span className="mini-tag more">+{space.spaceRoles!.length - 2}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="preview-row">
                    <span className="label">Members:</span>
                    <div className="avatar-stack">
                      {space.spaceMembers?.slice(0, 3).map((member: SpaceMember) => (
                        <div key={member.id} className="mini-avatar" title={`User ID: ${member.user_id}`}>
                          {member.is_admin ? '👑' : '👤'}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
