import React, { useState } from 'react';
import Popup from '../popup/Popup'; // Import the Popup component
import './Logo.css';

const Logo: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Handle logo click to show the popup
  const handleLogoClick = () => {
    setShowPopup(true);
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {/* Logo with an onClick handler */}
      <img
        src="/flagd-hub-logo.png"
        alt="Logo"
        className="logo"
        onClick={handleLogoClick} // Trigger popup on logo click
      />
      {/* Conditionally render the Popup */}
      {showPopup && <Popup onClose={closePopup} />}
    </div>
  );
};

export default Logo;
