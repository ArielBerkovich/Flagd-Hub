import React, { useState } from 'react';
import './FeatureFlagCard.css';
import FeatureCardInfoPopup from '../feature-flag-card-info/FeatureFlagCardInfo'; // Import the Popup component

const FeatureFlagCard = ({ flag, selectedVariant, onVariantChange }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleToggleChange = () => {
    onVariantChange(flag.id, selectedVariant === 'on' ? 'off' : 'on');
  };

  const handleRadioChange = (variant) => {
    onVariantChange(flag.id, variant);
  };

  const handleInfoClick = (e) => {
    e.stopPropagation(); // Prevent triggering other events on the parent
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="feature-card">
      {flag.description && (
        <button className="info-button" onClick={handleInfoClick} title="More Info">
          i
        </button>
      )}
      <h4>{flag.name}</h4>
      {flag.type === 'boolean' ? (
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={selectedVariant === 'on'}
              onChange={handleToggleChange}
            />
            <span className="slider"></span>
          </label>
        </div>
      ) : (
        <div className="button-radio-group">
          {flag.variants.map((variant) => (
            <label
              key={variant}
              className={`button-radio ${selectedVariant === variant ? 'active' : ''}`}
            >
              <input
                type="radio"
                name={`flag-${flag.id}`}
                value={variant}
                onChange={() => handleRadioChange(variant)}
                checked={selectedVariant === variant}
              />
              {variant}
            </label>
          ))}
        </div>
      )}

      {/* Show Popup when flag.description exists */}
      {showPopup && <FeatureCardInfoPopup title={flag.name} message={flag.description} onClose={handleClosePopup} />}
    </div>
  );
};

export default FeatureFlagCard;
