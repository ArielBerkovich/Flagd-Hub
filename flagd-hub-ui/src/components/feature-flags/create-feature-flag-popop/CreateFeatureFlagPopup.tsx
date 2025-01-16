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

  const handleSubmit = () => {
    if (!name) {
      alert('Name is required');
      return;
    }
    const formVariants: Map<string, string> = values.reduce((acc, item) => {
      acc.set(item, item);
      return acc;
    }, new Map<string, string>());    

    const newFlag: FeatureFlag = { 
      key:uuidv4(),
      name:name, 
      area:area,
      description:description, 
      type:type, 
      variants: formVariants,
      defaultVariant: defaultValue ,
      targeting:"",
    };
    onCreate(newFlag);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <h3>Create New Feature Flag</h3>
        <label>
          Name (required):
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          area (required):
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </label>
        <label>
          Description (optional):
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Type:
          <select value={type} onChange={(e) => {
            const selectedType = e.target.value;
            setType(selectedType);
            setValues(selectedType === 'boolean' ? ['on', 'off'] : []);
          }}>
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
              onChange={(e) => setValues(e.target.value.split(','))}
            />
          </label>
        )}
        <label>
          Default Value:
          <div className="button-radio-group">
            {values.map((val) => (
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
          <button className="form-button" onClick={handleSubmit}>Create</button>
          <button className="form-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeatureFlagPopup;
