import React, { useState, useEffect } from 'react';
import './CreateFeatureFlagPopup.css';
import FeatureFlag from '../../../models/FeatureFlag';
import Targeting from './targeting/trageting';

interface CreateFeatureFlagPopupProps {
  onClose: () => void;
  onCreate: (newFlag: FeatureFlag) => void;
  featureFlag?: FeatureFlag;
}

const CreateFeatureFlagPopup: React.FC<CreateFeatureFlagPopupProps> = ({ onClose, onCreate, featureFlag }) => {
  const [flagKey, setFlagKey] = useState<string>(featureFlag?.key || '');
  const [name, setName] = useState<string>(featureFlag?.name || '');
  const [area, setArea] = useState<string>(featureFlag?.area || '');
  const [description, setDescription] = useState<string>(featureFlag?.description || '');
  const [targeting, setTargeting] = useState<string>(featureFlag?.targeting || '');
  const [type, setType] = useState<string>(featureFlag?.type || 'boolean');
  const [targetingEnabled, setTargetingEnabled] = useState<boolean>(!!featureFlag?.targeting);
  
  // Initialize variants from the provided feature flag or use defaults
  const initVariantKeys = () => {
    if (featureFlag?.variants) {
      // Check if variants is a Map, if not convert it
      if (featureFlag.variants instanceof Map) {
        return Array.from(featureFlag.variants.keys());
      } else {
        // Handle the case where variants is an object
        return Object.keys(featureFlag.variants);
      }
    }
    return type === 'boolean' ? ['on', 'off'] : [];
  };
  
  const initVariantValues = () => {
    if (featureFlag?.variants) {
      const values: { [key: string]: string } = {};
      
      if (featureFlag.variants instanceof Map) {
        featureFlag.variants.forEach((value, key) => {
          values[key] = value;
        });
      } else {
        // Handle the case where variants is an object
        Object.entries(featureFlag.variants).forEach(([key, value]) => {
          values[key] = value as string;
        });
      }
      
      return values;
    }
    return type === 'boolean' ? { on: 'true', off: 'false' } : {};
  };
  
  const [variantKeys, setVariantKeys] = useState<string[]>(initVariantKeys());
  const [variantValues, setVariantValues] = useState<{ [key: string]: string }>(initVariantValues());
  const [defaultValue, setDefaultValue] = useState<string>(featureFlag?.defaultVariant || 'on');

  // Update variant keys and values when type changes
  useEffect(() => {
    if (!featureFlag) {
      if (type === 'boolean') {
        setVariantKeys(['on', 'off']);
        setVariantValues({ on: 'true', off: 'false' });
        setDefaultValue('on');
      }
    }
  }, [type, featureFlag]);

  const isFormValid =
    name.trim() &&
    area.trim() &&
    description.trim() &&
    variantKeys.length > 0 &&
    variantKeys.includes(defaultValue) &&
    variantKeys.every((key) => variantValues[key]?.trim() !== '');

  const handleVariantKeysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keys = e.target.value.split(',').map((key) => key.trim()).filter((key) => key !== '');
    setVariantKeys([...new Set(keys)]);
    setVariantValues((prevValues) => {
      const newValues: { [key: string]: string } = {};
      keys.forEach((key) => {
        newValues[key] = prevValues[key] || '';
      });
      return newValues;
    });
  };

  const handleVariantValueChange = (key: string, value: string) => {
    setVariantValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    console.log("targetingEnabled:", targetingEnabled);
    console.log("targeting before setting:", targeting);

    // Create a Map from the variant keys and values
    const formVariants = new Map<string, string>();
    variantKeys.forEach((key) => {
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

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <div>
        <header className="feature-flag-header">
          <h2 className="header-title">{featureFlag ? 'Edit Feature Flag' : 'Create New Feature Flag'}</h2>
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
        </div>
        <div className='inputs'>
        <div>
          <div className="input-values-container">
            <label>Details</label>
            <div className='flag-details'>
              <label>
                key
                <input type="text" value={flagKey} onChange={(e) => setFlagKey(e.target.value)} disabled={!!featureFlag} />
              </label>
              <label>
                Display name
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Area
                <input type="text" value={area} onChange={(e) => setArea(e.target.value)} />
              </label>
              <label>
                Description
                <textarea className='description-textarea' value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
              <label>
                Type
                <select
                  value={type}
                  onChange={(e) => {
                    const selectedType = e.target.value;
                    setType(selectedType);
                    if (!featureFlag) {
                      setVariantKeys(selectedType === 'boolean' ? ['on', 'off'] : []);
                      setVariantValues(selectedType === 'boolean' ? { on: 'true', off: 'false' } : {});
                    }
                  }}
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
                  <input type="checkbox" checked={targetingEnabled} onChange={() => setTargetingEnabled((prev) => !prev)} />
                </span>
              </label>
            </div>
          </div>
          {type !== 'boolean' && !featureFlag && (
            <label>
              Variant Keys (comma-separated):
              <input type="text" placeholder="e.g., LOW,MEDIUM,HIGH" onChange={handleVariantKeysChange} />
            </label>
          )}
          {variantKeys.length > 0 && (
            <div className="input-values-container variants">
              <label>Variants</label>
              {variantKeys.map((key) => (
                <div
                  key={key}
                  className='variant-row'
                >
                  <button onClick={() => {
                    setDefaultValue(key)
                    console.log(defaultValue)
                  }
                  } className={`variant-key ${key === defaultValue ? 'select' : ''}`}>
                    {key}
                  </button>
                  <label>:</label>
                  <input
                    disabled={type == "boolean" || (!!featureFlag && type !== 'boolean')}
                    type="text"
                    className="variant-value-input"
                    value={variantValues[key] || ''}
                    onChange={(e) => handleVariantValueChange(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {targetingEnabled && <Targeting variants={variantKeys} setTargeting={setTargeting}></Targeting>}
        </div>
        <div className="form-actions">
          <button className="form-button" onClick={handleSubmit} disabled={!isFormValid}>
            {featureFlag ? 'Save Changes' : 'Create'}
          </button>
          <button className="form-button" onClick={onClose}>Cancel</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeatureFlagPopup;