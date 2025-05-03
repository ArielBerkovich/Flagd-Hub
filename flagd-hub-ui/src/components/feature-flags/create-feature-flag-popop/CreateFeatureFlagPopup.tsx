import React, { useState, useEffect } from 'react';
import './CreateFeatureFlagPopup.css';
import FeatureFlag from '../../../models/FeatureFlag';
import Targeting from './targeting/targeting';

// Type definitions
type VariantMap = Map<string, string>;
type VariantObject = { [key: string]: string };

interface CreateFeatureFlagPopupProps {
  onClose: () => void;
  onCreate: (newFlag: FeatureFlag) => void;
  featureFlag?: FeatureFlag;
}

// Default values for different flag types
const DEFAULT_BOOLEAN_VARIANTS: VariantObject = { on: 'true', off: 'false' };
const DEFAULT_BOOLEAN_KEYS: string[] = ['on', 'off'];
const DEFAULT_VARIANT = 'on';

const CreateFeatureFlagPopup: React.FC<CreateFeatureFlagPopupProps> = ({ 
  onClose, 
  onCreate, 
  featureFlag 
}) => {
  // Basic flag properties
  const [flagKey, setFlagKey] = useState<string>(featureFlag?.key || '');
  const [name, setName] = useState<string>(featureFlag?.name || '');
  const [area, setArea] = useState<string>(featureFlag?.area || '');
  const [description, setDescription] = useState<string>(featureFlag?.description || '');
  const [type, setType] = useState<string>(featureFlag?.type || 'boolean');
  
  // Targeting properties
  const [targeting, setTargeting] = useState<string>(featureFlag?.targeting || '');
  const [targetingEnabled, setTargetingEnabled] = useState<boolean>(!!featureFlag?.targeting);
  
  // Variants properties
  const [variantKeys, setVariantKeys] = useState<string[]>(initVariantKeys());
  const [variantValues, setVariantValues] = useState<VariantObject>(initVariantValues());
  const [defaultValue, setDefaultValue] = useState<string>(featureFlag?.defaultVariant || DEFAULT_VARIANT);

  // Helper functions for initializing variants
  function initVariantKeys(): string[] {
    if (!featureFlag?.variants) {
      return type === 'boolean' ? DEFAULT_BOOLEAN_KEYS : [];
    }
    
    if (featureFlag.variants instanceof Map) {
      return Array.from(featureFlag.variants.keys());
    }
    
    return Object.keys(featureFlag.variants);
  }
  
  function initVariantValues(): VariantObject {
    if (!featureFlag?.variants) {
      return type === 'boolean' ? DEFAULT_BOOLEAN_VARIANTS : {};
    }
    
    const values: VariantObject = {};
    
    if (featureFlag.variants instanceof Map) {
      featureFlag.variants.forEach((value, key) => {
        values[key] = value;
      });
    } else {
      Object.entries(featureFlag.variants).forEach(([key, value]) => {
        values[key] = value as string;
      });
    }
    
    return values;
  }

  // Reset variants when type changes (only for new flags)
  useEffect(() => {
    if (!featureFlag && type === 'boolean') {
      setVariantKeys(DEFAULT_BOOLEAN_KEYS);
      setVariantValues(DEFAULT_BOOLEAN_VARIANTS);
      setDefaultValue(DEFAULT_VARIANT);
    }
  }, [type, featureFlag]);

  // Form validation
  const isFormValid = 
    name.trim() !== '' &&
    area.trim() !== '' &&
    description.trim() !== '' &&
    variantKeys.length > 0 &&
    variantKeys.includes(defaultValue) &&
    variantKeys.every(key => variantValues[key]?.trim() !== '');

  // Variant handling functions
  const handleVariantKeysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keys = e.target.value
      .split(',')
      .map(key => key.trim())
      .filter(key => key !== '');
    
    const uniqueKeys = [...new Set(keys)];
    setVariantKeys(uniqueKeys);
    
    // Update variant values to match new keys
    setVariantValues(prevValues => {
      const newValues: VariantObject = {};
      uniqueKeys.forEach(key => {
        newValues[key] = prevValues[key] || '';
      });
      return newValues;
    });
  };

  const handleVariantValueChange = (key: string, value: string) => {
    setVariantValues(prevValues => ({ ...prevValues, [key]: value }));
  };

  const handleDefaultVariantChange = (key: string) => {
    setDefaultValue(key);
  };

  // Form submission
  const handleSubmit = () => {
    if (!isFormValid) return;

    // Create Map from variant keys and values
    const formVariants = new Map<string, string>();
    variantKeys.forEach(key => {
      formVariants.set(key, variantValues[key]);
    });

    const newFlag: FeatureFlag = {
      key: flagKey,
      name: name,
      area: area.trim(),
      description: description.trim(),
      type: type,
      variants: formVariants,
      defaultVariant: defaultValue,
      targeting: targetingEnabled ? targeting : "",
      creationTime: featureFlag?.creationTime || Date.now(),
      wasChanged: !!featureFlag,
    };

    onCreate(newFlag);
  };

  // UI components
  const renderHeader = () => (
    <header className="feature-flag-header">
      <h2 className="header-title">
        {featureFlag ? 'Edit Feature Flag' : 'Create New Feature Flag'}
      </h2>
      <div className="header-actions">
        <button 
          className="header-close-button" 
          onClick={onClose} 
          aria-label="Close form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  );

  const renderFlagDetails = () => (
    <div className="input-values-container">
      <label>Details</label>
      <div className='flag-details'>
        <label>
          key
          <input 
            type="text" 
            value={flagKey} 
            onChange={(e) => setFlagKey(e.target.value)} 
            disabled={!!featureFlag} 
          />
        </label>
        <label>
          Display name
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </label>
        <label>
          Area
          <input 
            type="text" 
            value={area} 
            onChange={(e) => setArea(e.target.value)} 
          />
        </label>
        <label>
          Description
          <textarea 
            className='description-textarea' 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </label>
        <label>
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={!!featureFlag}
          >
            <option value="boolean">Boolean</option>
            <option value="string">String</option>
            <option value="integer">Integer</option>
            <option value="double">Double</option>
            <option value="object">Object</option>
          </select>
        </label>
        <label>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
            Targeting
            <input 
              type="checkbox" 
              checked={targetingEnabled} 
              onChange={() => setTargetingEnabled(prev => !prev)} 
            />
          </span>
        </label>
      </div>
    </div>
  );

  const renderCustomVariantInput = () => (
    type !== 'boolean' && !featureFlag && (
      <label>
        Variant Keys (comma-separated):
        <input 
          type="text" 
          placeholder="e.g., LOW,MEDIUM,HIGH" 
          onChange={handleVariantKeysChange} 
        />
      </label>
    )
  );

  const renderVariantRows = () => (
    variantKeys.length > 0 && (
      <div className="input-values-container variants">
        <label>Variants</label>
        {variantKeys.map(key => (
          <div key={key} className='variant-row'>
            <button 
              onClick={() => handleDefaultVariantChange(key)} 
              className={`variant-key ${key === defaultValue ? 'select' : ''}`}
            >
              {key}
            </button>
            <label>:</label>
            <input
              disabled={type === "boolean" || (!!featureFlag && type !== 'boolean')}
              type="text"
              className="variant-value-input"
              value={variantValues[key] || ''}
              onChange={(e) => handleVariantValueChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
    )
  );

  const renderFormActions = () => (
    <div className="form-actions">
      <button 
        className="form-button" 
        onClick={handleSubmit} 
        disabled={!isFormValid}
      >
        {featureFlag ? 'Save Changes' : 'Create'}
      </button>
      <button className="form-button" onClick={onClose}>
        Cancel
      </button>
    </div>
  );

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <div>{renderHeader()}</div>
        <div className='inputs'>
          <div>
            {renderFlagDetails()}
            {renderCustomVariantInput()}
            {renderVariantRows()}
          </div>
          <div>
            {targetingEnabled && (
              <Targeting 
                variants={variantKeys} 
                setTargeting={setTargeting}
              />
            )}
          </div>
          {renderFormActions()}
        </div>
      </div>
    </div>
  );
};

export default CreateFeatureFlagPopup;