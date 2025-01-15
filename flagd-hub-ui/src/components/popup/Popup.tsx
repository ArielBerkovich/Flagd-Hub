import React from 'react';
import './Popup.css'; // Optional: for styling the popup

interface PopupProps {
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>About</h2>
        <p>Version: 1.0.0</p>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
