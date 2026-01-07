import React, { useState } from "react";
import "./ExportPopup.css";
import FeatureFlag from "../../models/FeatureFlag";

interface JsonPopupProps {
  show: boolean;
  onClose: () => void;
  featureFlags: FeatureFlag[];
}

const ExportPopup: React.FC<JsonPopupProps> = ({ show, onClose, featureFlags }) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  
  // Remove wasChanged property from each flag
  const jsonData = featureFlags.map(({ wasChanged, ...rest }) => rest);
  
  // Format JSON with proper indentation
  const formattedJson = JSON.stringify(jsonData, null, 2);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(null), 2000);
      })
      .catch(err => {
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(null), 2000);
      });
  };

  const handleDownload = () => {
    const blob = new Blob([formattedJson], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `feature-flags-${timestamp}.json`;
    link.click();
    
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
    
    // Cleanup
    URL.revokeObjectURL(link.href);
  };

  if (!show) return null;

  return (
    <div className="export-popup-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="export-popup-container">
        <div className="export-popup-header">
          <div className="export-popup-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <h2>Export Feature Flags</h2>
          </div>
          <div className="export-popup-actions">
            <span className="export-count">{featureFlags.length} flags</span>
            <button className="export-close-button" onClick={onClose} data-testid="export-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="export-popup-body">
          <div className="export-json-container">
            <div className="export-json-header">
              <span className="export-json-title">JSON Preview</span>
              <div className="export-syntax-highlight-toggle">
                <span className="export-json-info">Showing {featureFlags.length} items</span>
              </div>
            </div>
            <pre className="export-json-pre">
              <code data-testid="export-json-content">{formattedJson}</code>
            </pre>
          </div>
        </div>
        
        <div className="export-popup-footer">
          <button
            className={`export-button export-button-primary ${copySuccess ? 'export-button-success' : ''}`}
            onClick={handleCopy}
            data-testid="export-copy-button"
          >
            {copySuccess ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {copySuccess}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy JSON
              </>
            )}
          </button>
          
          <button 
            className={`export-button export-button-success ${downloadSuccess ? 'export-button-downloaded' : ''}`}
            onClick={handleDownload}
          >
            {downloadSuccess ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Downloaded
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download JSON
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportPopup;