import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Logo from './components/logo/Logo';
import FeatureFlags from './components/feature-flags/feature-flags-menu/FeatureFlags';
import Login from './components/login/Login';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeArea, setActiveArea] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from local storage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode); // Save to local storage
      return newMode;
    });
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <header>
        Flagd Hub
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? '🌙' : '🌞'}
        </button>
      </header>
      <main className='main'>
        <Sidebar onAreaSelect={setActiveArea} />
        <div className='mainArea'>
          <FeatureFlags activeArea={activeArea} />
          <Logo />
        </div>
      </main>
    </div>
  );
};

export default App;
