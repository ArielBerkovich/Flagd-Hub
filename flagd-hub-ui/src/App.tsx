import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Logo from './components/logo/Logo';
import Dashboard from './pages/dashborad'
import './App.css';

// Define types for the active area state, assuming it can be a string or null
type ActiveArea = string | null;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeArea, setActiveArea] = useState<ActiveArea>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Load dark mode preference from local storage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString()); // Save to local storage
      return newMode;
    });
  };

  return (
      <div className='main'>
        <Sidebar onAreaSelect={setActiveArea} />
        <div className='mainArea'>
          <Dashboard activeArea={activeArea} />
        </div>
      </div>
  );
};

export default App;
