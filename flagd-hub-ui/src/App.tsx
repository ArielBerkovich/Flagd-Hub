import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashborad';
import Environment from './utils/Environment';
import './App.css';

// Define types for the active area state
type ActiveArea = string | null;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeArea, setActiveArea] = useState<ActiveArea>(null);

  // Check authentication status on initial load
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

  // Redirect to the login page if authentication is required
  const isSecured = Environment.get('is_secured')?.toLowerCase() === 'true';
  if (!isAuthenticated && isSecured) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render the main application UI
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
