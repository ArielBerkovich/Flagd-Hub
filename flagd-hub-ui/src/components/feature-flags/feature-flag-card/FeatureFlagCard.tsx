import React, { useState } from 'react';
import './FeatureFlagCard.css';
import FeatureCardInfoPopup from '../feature-flag-card-info/FeatureFlagCardInfo';
import DeleteConfirmationPopup from '../delete-confirmation-popup/DeleteConfirmationPopup';
import FeatureFlag from '../../../models/FeatureFlag';
import FeatureFlagsService from '../../../services/feature-flags-service';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';

interface FeatureFlagCardProps {
  flag: FeatureFlag;
  selectedVariant: string;
  onVariantChange: (flagId: string, variant: string) => void;
  onEdit?: (flag: FeatureFlag) => void;
}

const FeatureFlagCard: React.FC<FeatureFlagCardProps> = ({ flag, selectedVariant, onVariantChange, onEdit }) => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Helper function to get variant keys, handling both Map and object variants
  const getVariantKeys = () => {
    if (!flag.variants) return [];
    
    if (flag.variants instanceof Map) {
      return Array.from(flag.variants.keys());
    } else {
      return Object.keys(flag.variants);
    }
  };

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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click handler
    console.log('Edit button clicked');
    if (onEdit) {
      onEdit(flag);
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click handler
    console.log('Info button clicked');
    setShowPopup(true);
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
    flag.defaultVariant = variant;
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Toggle clicked');
    const variant = selectedVariant === 'on' ? 'off' : 'on';
    onVariantChange(flag.key, variant);
    flag.defaultVariant = variant;
  };

  return (
    <div className="feature-card">
      {/* Card Actions */}
      <div className="card-actions">
        <button
          className="info-button"
          onClick={handleInfoClick}
          title="View Flag Details"
        >
          <InfoIcon fontSize="small" />
        </button>
        <button
          className="edit-button"
          onClick={handleEditClick}
          title="Edit Feature Flag"
        >
          <EditIcon fontSize="small" />
        </button>
        <button
          className="delete-button"
          onClick={handleDeleteClick}
          title="Delete Feature Flag"
        >
          <CloseIcon fontSize="small" />
        </button>
      </div>
      
      <div className="card-header">
        <div className="flag-title">
          <h4>{flag.name}</h4>
        </div>
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
          {getVariantKeys().map((variant) => (
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
