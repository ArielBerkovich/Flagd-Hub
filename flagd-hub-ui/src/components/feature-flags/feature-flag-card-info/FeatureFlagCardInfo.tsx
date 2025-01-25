import React from 'react';
import ReactDOM from 'react-dom';
import './FeatureFlagCardInfo.css'; // Optional: for styling the popup
import FeatureFlag from '../../../models/FeatureFlag';

// Define types for the props
interface FeatureFlagCardInfoProps {
  featureFlag: FeatureFlag;
  onClose: () => void;
}

const FeatureFlagCardInfo: React.FC<FeatureFlagCardInfoProps> = ({ featureFlag, onClose }) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the close button click from triggering the overlay's click handler
    onClose(); // Call the passed function to close the popup
  };

  return ReactDOM.createPortal(
    <div className="feature-flag-card-info-popup-overlay" onClick={onClose}>
      <div className="feature-flag-card-info-popup" onClick={(e) => e.stopPropagation()}>
        <h1>{featureFlag.name}</h1>
        <p>{featureFlag.description}</p>
        <p>{"created on " + new Date(featureFlag.creationTime).toLocaleString()}</p>
        <button className="close-btn" onClick={handleCloseClick}>
          Close
        </button>
      </div>
    </div>,
    document.body 
  );
};

export default FeatureFlagCardInfo;
