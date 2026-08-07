import { useState } from 'react';

function LinkDetails({ selectedLink, selectedSummary, isLoading, onToggle, onDelete }) {
  const [expandedUrl, setExpandedUrl] = useState(false);

  return (
    <section className="panel details">
      {selectedLink ? (
        <>
          <div className="details-header">
            <h2>{selectedLink.slug}</h2>
            <span className={`status-badge ${selectedLink.enabled ? 'active' : 'disabled'}`}>
              {selectedLink.enabled ? 'Active' : 'Disabled'}
            </span>
          </div>

          <div className="details-card">
            <h3>Link Information</h3>
            <div className="detail-grid">
              {selectedSummary.map((row) => (
                <div key={row.label} className="detail-item">
                  <div className="label">{row.label}</div>
                  {row.label === 'Destination' ? (
                    <div
                      className={`value ${expandedUrl ? 'expanded' : 'truncated'}`}
                      onClick={() => setExpandedUrl(!expandedUrl)}
                      style={{ cursor: 'pointer', userSelect: expandedUrl ? 'text' : 'auto' }}
                    >
                      {row.value}
                    </div>
                  ) : (
                    <div className="value">{row.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="actions">
            <button onClick={onToggle} disabled={isLoading}>
              {isLoading ? 'Updating...' : selectedLink.enabled ? 'Disable' : 'Enable'}
            </button>
            <button onClick={onDelete} disabled={isLoading}>
              Delete
            </button>
          </div>

          <div className="details-card">
            <h3>Recent Activity</h3>
            {selectedLink.clicks && selectedLink.clicks.length > 0 ? (
              <ul className="clicks-list">
                {selectedLink.clicks
                  .slice(-5)
                  .reverse()
                  .map((click, index) => (
                    <li key={`${click.timestamp}-${index}`} className="click-item">
                      <span className="click-time">{new Date(click.timestamp).toLocaleString()}</span>
                      <span className="click-referrer">{click.referrer || 'Direct'}</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="no-data">No clicks yet</p>
            )}
          </div>
        </>
      ) : (
        <p className="empty-state">Select a link to view its stats.</p>
      )}
    </section>
  );
}

export default LinkDetails;
