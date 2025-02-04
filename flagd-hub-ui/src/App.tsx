import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashborad';
import FeatureFlagService from './services/feature-flags-service';
import Environment from './utils/Environment';
import './App.css';
import FeatureFlag from './models/FeatureFlag';

// Define types for the active area state
type ActiveArea = string | null;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [activeArea, setActiveArea] = useState<ActiveArea>(null);
  const [areas, setAreas] = useState<string[]>([]);

  // Polling interval constant
  const POLLING_INTERVAL = 1000;

  // Check authentication status on initial load
  useEffect(() => {
    const token = localStorage.getItem('flagd-hub-token');
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

  // Fetch feature flags and update state
  const fetchFeatureFlags = async () => {
    FeatureFlagService.getFeatureFlags().then(data => {
      const flags = activeArea ? data.filter((flag: FeatureFlag) => flag.area === activeArea) : data;
      setFeatureFlags(flags);
      const uniqueAreas = [...new Set(data.map((flag: FeatureFlag) => flag.area))];
      setAreas(['All', ...uniqueAreas]); 
    });
  };

  // Poll for feature flags
  useEffect(() => {
    if(isAuthenticated){
    fetchFeatureFlags();
    const intervalId = setInterval(fetchFeatureFlags, POLLING_INTERVAL);

    return () => clearInterval(intervalId);}
  }, [activeArea,isAuthenticated]);

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
      <Sidebar onAreaSelect={setActiveArea} allAreas={areas} />
      <div className="mainArea">
        <Dashboard activeArea={activeArea} featureFlags={featureFlags} />
      </div>
    </div>
  );
};

export default App;
