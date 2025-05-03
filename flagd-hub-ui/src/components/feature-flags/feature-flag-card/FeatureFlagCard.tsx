import React, { useState, useCallback, JSX } from 'react';
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

const FeatureFlagCard: React.FC<FeatureFlagCardProps> = ({ 
  flag, 
  selectedVariant, 
  onVariantChange, 
  onEdit 
}) => {
  // State
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Helper function to get variant keys, handling both Map and object variants
  const getVariantKeys = useCallback((): string[] => {
    if (!flag.variants) return [];
    
    if (flag.variants instanceof Map) {
      return Array.from(flag.variants.keys());
    } 
    
    return Object.keys(flag.variants);
  }, [flag.variants]);

  // Event handlers
  const handleInfoClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowInfoPopup(true);
  };

  const handleCloseInfoPopup = (): void => {
    setShowInfoPopup(false);
  };

  const handleEditClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(flag);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (): void => {
    setShowDeleteConfirm(false);
    FeatureFlagsService.deleteFeatureFlag(flag.key);
  };

  const handleCancelDelete = (): void => {
    setShowDeleteConfirm(false);
  };

  const updateVariant = (variant: string): void => {
    onVariantChange(flag.key, variant);
    flag.defaultVariant = variant;
  };

  const handleToggleChange = (): void => {
    const newVariant = selectedVariant === 'on' ? 'off' : 'on';
    updateVariant(newVariant);
  };

  const handleRadioChange = (_: React.ChangeEvent<HTMLInputElement>, variant: string): void => {
    updateVariant(variant);
  };

  // UI Component rendering functions
  const renderCardActions = (): JSX.Element => (
    <div className="card-actions">
      <button
        className="info-button"
        onClick={handleInfoClick}
        title="View Flag Details"
        aria-label="View feature flag details"
      >
        <InfoIcon fontSize="medium" />
      </button>
      <button
        className="edit-button"
        onClick={handleEditClick}
        title="Edit Feature Flag"
        aria-label="Edit feature flag"
      >
        <EditIcon fontSize="medium" />
      </button>
      <button
        className="delete-button"
        onClick={handleDeleteClick}
        title="Delete Feature Flag"
        aria-label="Delete feature flag"
      >
        <CloseIcon fontSize="medium" />
      </button>
    </div>
  );

  const renderBooleanToggle = (): JSX.Element => (
    <div className="toggle-wrapper">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={selectedVariant === 'on'}
          onChange={handleToggleChange}
          aria-label={`Toggle ${flag.name} ${selectedVariant === 'on' ? 'off' : 'on'}`}
        />
        <span className="slider"></span>
      </label>
    </div>
  );

  const renderVariantRadioGroup = (): JSX.Element => (
    <div className="button-radio-group" role="radiogroup" aria-label={`${flag.name} variants`}>
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
            aria-checked={selectedVariant === variant}
          />
          {variant}
        </label>
      ))}
    </div>
  );

  const renderPopups = (): JSX.Element => (
    <>
      {showInfoPopup && (
        <FeatureCardInfoPopup 
          featureFlag={flag} 
          onClose={handleCloseInfoPopup} 
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmationPopup
          message={`Are you sure you want to delete feature flag ${flag.name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );

  return (
    <div className="feature-card">
      {renderCardActions()}
      
      <div className="card-header">
        <div className="flag-title">
          <h4>{flag.name}</h4>
        </div>
      </div>
      
      {flag.type === 'boolean' 
        ? renderBooleanToggle() 
        : renderVariantRadioGroup()
      }

      {renderPopups()}
    </div>
  );
};

export default FeatureFlagCard;