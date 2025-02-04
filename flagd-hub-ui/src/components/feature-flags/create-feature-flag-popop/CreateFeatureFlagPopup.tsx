import React, { useState } from 'react';
import './CreateFeatureFlagPopup.css';
import FeatureFlag from '../../../models/FeatureFlag';

interface CreateFeatureFlagPopupProps {
  onClose: () => void;
  onCreate: (newFlag: FeatureFlag) => void;
}

const CreateFeatureFlagPopup: React.FC<CreateFeatureFlagPopupProps> = ({ onClose, onCreate }) => {
  const [flagKey, setFlagKey] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string>('boolean');
  const [variantKeys, setVariantKeys] = useState<string[]>(['on', 'off']);
  const [variantValues, setVariantValues] = useState<{ [key: string]: string }>({ on: 'true', off: 'false' });
  const [defaultValue, setDefaultValue] = useState<string>('on');

  const isFormValid =
    name.trim() &&
    area.trim() &&
    description.trim() &&
    variantKeys.length > 0 &&
    variantKeys.includes(defaultValue) &&
    variantKeys.every((key) => variantValues[key]?.trim() !== '');

  const handleVariantKeysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keys = e.target.value.split(',').map((key) => key.trim()).filter((key) => key !== '');
    setVariantKeys(keys);
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

    const formVariants = new Map<string, string>();
    variantKeys.forEach((key) => {
      formVariants.set(key, variantValues[key]);
    });

    const newFlag: FeatureFlag = {
      key: name.trim(),
      name: name,
      area: area.trim(),
      description: description.trim(),
      type: type,
      variants: formVariants,
      defaultVariant: defaultValue,
      targeting: "",
      creationTime: Date.now(),
      wasChanged: false,
    };

    onCreate(newFlag);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <h3>Create New Feature Flag</h3>
        <label>
          Flag key
          <input type="text" value={flagKey} onChange={(e) => setFlagKey(e.target.value)} />
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
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Type
          <select
            value={type}
            onChange={(e) => {
              const selectedType = e.target.value;
              setType(selectedType);
              setVariantKeys(selectedType === 'boolean' ? ['on', 'off'] : []);
              setVariantValues(selectedType === 'boolean' ? { on: 'true', off: 'false' } : {});
            }}
          >
            <option value="boolean">Boolean</option>
            <option value="string">String</option>
            <option value="integer">Integer</option>
            <option value="double">Double</option>
            <option value="object">Object</option>
          </select>
        </label>
        {type !== 'boolean' && (
          <label>
            Variant Keys (comma-separated):
            <input type="text" placeholder="e.g., LOW,MEDIUM,HIGH" onChange={handleVariantKeysChange} />
          </label>
        )}
        {variantKeys.length > 0 && (
          <div className="variant-values-container">
            <label>Variants:</label>
            {variantKeys.map((key) => (
              <div
                key={key}
                className={`variant-row ${key === defaultValue ? 'active' : ''}`}
                onClick={() => setDefaultValue(key)}
              >
                <button className={`variant-key ${key === defaultValue ? 'selected' : ''}`}>
                  {key}
                </button>
                <input
                  type="text"
                  className="variant-value-input"
                  value={variantValues[key] || ''}
                  onChange={(e) => handleVariantValueChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
        <div className="form-actions">
          <button className="form-button" onClick={handleSubmit} disabled={!isFormValid}>
            Create
          </button>
          <button className="form-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeatureFlagPopup;