import React, { useState } from 'react';
import './CreateFeatureFlagPopup.css';
import FeatureFlag from '../../../models/FeatureFlag';
import { v4 as uuidv4 } from 'uuid';

interface CreateFeatureFlagPopupProps {
  onClose: () => void;
  onCreate: (newFlag: FeatureFlag) => void;
}

const CreateFeatureFlagPopup: React.FC<CreateFeatureFlagPopupProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [type, setType] = useState<string>('boolean');
  const [values, setValues] = useState<string[]>(['on', 'off']);
  const [defaultValue, setDefaultValue] = useState<string>('on');

  const isFormValid = name.trim() && area.trim() && description.trim() && values.length>0 && values.includes(defaultValue)

  const handleSubmit = () => {
    if (!isFormValid) return;

    const formVariants: Map<string, string> = values.reduce((acc, item) => {
      acc.set(item, item);
      return acc;
    }, new Map<string, string>());

    const newFlag: FeatureFlag = {
      key: uuidv4().substring(0,8),
      name: name.trim(),
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
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={!name.trim() ? 'input-error' : ''}
          />
        </label>
        <label>
          Area
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={!area.trim() ? 'input-error' : ''}
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={!description.trim() ? 'input-error' : ''}
          />
        </label>
        <label>
          Type  
          <select
            value={type}
            onChange={(e) => {
              const selectedType = e.target.value;
              setType(selectedType);
              setValues(selectedType === 'boolean' ? ['on', 'off'] : []);
            }}
          >
            <option value="boolean">Boolean</option>
            <option value="string">String</option>
            <option value="number">Number</option>
          </select>
        </label>
        {type !== 'boolean' && (
          <label>
            Values (comma-separated):
            <input
              type="text"
              placeholder="e.g., small,medium,large"
              onChange={(e) => setValues(e.target.value.split(',').map(val => val.trim()).filter(val => val !== ''))}
            />
          </label>
        )}
        <label>
          Default Value:
          <div className="button-radio-group">
            {[...new Set(values)].map((val) => (
              <div
                key={val} 
                className={`button-radio ${val === defaultValue ? 'active' : ''}`}
                onClick={() => setDefaultValue(val)}
              >
                {val}
              </div>
            ))}
          </div>
        </label>
        <div className="form-actions">
          <button
            className="form-button"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Create
          </button>
          <button className="form-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeatureFlagPopup;
