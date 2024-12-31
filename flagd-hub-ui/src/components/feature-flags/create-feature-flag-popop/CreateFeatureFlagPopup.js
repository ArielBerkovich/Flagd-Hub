import React, { useState } from 'react';
import './CreateFeatureFlagPopup.css';

const CreateFeatureFlagPopup = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('boolean');
  const [values, setValues] = useState(['on', 'off']);
  const [defaultValue, setDefaultValue] = useState('on');

  const handleSubmit = () => {
    if (!name) {
      alert('Name is required');
      return;
    }
    const newFlag = { id: Date.now(), name, description, type, values, defaultVariant: defaultValue };
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
          <button className='form-button' onClick={handleSubmit}>Create</button>
          <button className='form-button' onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateFeatureFlagPopup;
