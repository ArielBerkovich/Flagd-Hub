import React, { useState } from 'react';
import './FeatureFlagCard.css';
import FeatureCardInfoPopup from '../feature-flag-card-info/FeatureFlagCardInfo';
import DeleteConfirmationPopup from '../delete-confirmation-popup/DeleteConfirmationPopup';
import FeatureFlag from '../../../models/FeatureFlag';
import FeatureFlagsService from '../../../services/feature-flags-service';

interface FeatureFlagCardProps {
  flag: FeatureFlag;
  selectedVariant: string;
  onVariantChange: (flagId: string, variant: string) => void;
}

const FeatureFlagCard: React.FC<FeatureFlagCardProps> = ({ flag, selectedVariant, onVariantChange }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('Card clicked');
    if (flag.description) {
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click handler
    console.log('Delete button clicked');
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    FeatureFlagsService.deleteFeatureFlag(flag.key);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>, variant: string) => {
    console.log('Radio button clicked:', variant);
    onVariantChange(flag.key, variant);
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Toggle clicked');
    onVariantChange(flag.key, selectedVariant === 'on' ? 'off' : 'on');
  };

  return (
    <div className="feature-card">
      <button
        className="delete-button"
        onClick={handleDeleteClick}
        title="Delete Feature Flag"
      >
        ✖️
      </button>
      <div className="flag-title">
      <h4 onClick={handleCardClick}>{flag.name}</h4>
      {flag.wasChanged && (
        <div className="changed-flag-indicator animated">
          <span>ⓘ</span>
        </div>
      )}
      </div>
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
          {Object.keys(flag.variants || {}).map((variant) => (
            <label
              key={variant}
              className={`button-radio ${selectedVariant === variant ? 'active' : ''}`}
            >
              <input
                type="radio"
                name={`flag-${flag.key}`}
                value={variant}
                onChange={(e) => handleRadioChange(e, variant)}
                checked={selectedVariant === variant}
              />
              {variant}
            </label>
          ))}
        </div>
      )}

      {/* Show Popup when flag.description exists */}
      {showPopup && <FeatureCardInfoPopup featureFlag={flag} onClose={handleClosePopup} />}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <DeleteConfirmationPopup
          message={`Are you sure you want to delete feature flag ${flag.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default FeatureFlagCard;
