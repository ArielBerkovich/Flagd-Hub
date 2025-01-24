import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashborad';
import './App.css';

// Define types for the active area state, assuming it can be a string or null
type ActiveArea = string | null;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeArea, setActiveArea] = useState<ActiveArea>(null);

  // Check for token and authentication status on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    }
  }, []);

  // Utility function to check token expiration
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true; // Treat invalid tokens as expired
    }
  };

  // Handle successful login
  const handleLoginSuccess = (token: string) => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated && window.env.REACT_APP_IS_SECURED?.toLocaleLowerCase() === 'true') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="main" className="main">
      <Sidebar onAreaSelect={setActiveArea} />
      <div className="mainArea">
        <Dashboard activeArea={activeArea} />
      </div>
    </div>
  );
};

export default App;
