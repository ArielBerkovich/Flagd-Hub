// AboutPopup.tsx
import React from 'react';
import './AboutPopup.css';

interface AboutPopupProps {
  onClose: () => void;
}

const AboutPopup: React.FC<AboutPopupProps> = ({ onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="about-popup-overlay" onClick={handleOverlayClick}>
      <div className="about-popup-content">
        <button
          className="about-popup-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Animated Background Elements */}
        <div className="bg-decoration bg-decoration-1"></div>
        <div className="bg-decoration bg-decoration-2"></div>
        <div className="bg-decoration bg-decoration-3"></div>

        <div className="about-hero">
          <div className="logo-wrapper">
            <img
              src="/flagd_about.png"
              alt="Flagd Hub"
              className="about-logo"
            />
            <div className="logo-glow"></div>
          </div>

          <div className="title-section">
            <h1 className="about-title">Flagd Hub</h1>
            <p className="about-tagline">Feature Flags Made Simple</p>
          </div>
        </div>

        <div className="about-content">
          <p className="about-description">
            A modern web interface for managing and visualizing feature flags
            powered by <strong>flagd</strong> — the OpenFeature reference implementation.
          </p>

          <div className="about-badges">
            <div className="badge-item">
              <span className="badge-number">2025</span>
              <span className="badge-label">Created</span>
            </div>
            <div className="badge-divider"></div>
            <div className="badge-item">
              <span className="badge-number">∞</span>
              <span className="badge-label">Possibilities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPopup;