import React from "react";
import "./ChangeLogs.css";
import Changelog from "../../models/Changelog";

interface ChangeLogProps {
  changeLogs: Record<string, Changelog> | Map<string, Changelog>;
  onClose: () => void;
}

const ChangeLogs: React.FC<ChangeLogProps> = ({ changeLogs, onClose }) => {
  const logsArray = changeLogs instanceof Map 
    ? Array.from(changeLogs.entries()) 
    : Object.entries(changeLogs);

  // Sort logs by timestamp (latest first)
  const sortedLogs = logsArray.sort(([_, a], [__, b]) => b.timestamp - a.timestamp);

  return (
    <div className="changelogs-popup-overlay">
      <div className="changelogs-popup-container" data-testid="changelogs-dialog">
        <div className="changelogs-popup-header">
          <h2>Changelogs</h2>
          <button className="changelogs-close-button" onClick={onClose} data-testid="changelogs-close-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="changelogs-popup-content">
          {sortedLogs.length > 0 ? (
            <div className="changelog-grid">
              {sortedLogs.map(([flagName, log], index) => (
                <div key={flagName} className="changelog-card" data-testid={`changelog-entry-${index}`}>
                  <div className="changelog-card-header">
                    <span className="changelog-index">{index + 1}</span>
                    <h3>{flagName}</h3>
                    <span className="changelog-date">{new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="changelog-card-content">
                    <div className="changelog-transition">
                      <div className="changelog-from">
                        <span className="label">From</span>
                        <span className="value">{log.previousVariant}</span>
                      </div>
                      <div className="changelog-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                      <div className="changelog-to">
                        <span className="label">To</span>
                        <span className="value">{log.updatedVariant}</span>
                      </div>
                    </div>
                    <div className="changelog-time">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>No changelogs available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeLogs;