import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashborad';
import FeatureFlagService from './services/feature-flags-service';
import Environment from './utils/Environment';
import './App.css';
import FeatureFlag from './models/FeatureFlag';

const POLLING_INTERVAL = 1000;

type ActiveArea = string | null;


const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [activeArea, setActiveArea] = useState<ActiveArea>(null);
  const [areas, setAreas] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('flagd-hub-token');
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('flagd-hub-token');
    }
  },[]);

  const fetchFeatureFlags = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const data = await FeatureFlagService.getFeatureFlags();
      const filteredFlags = activeArea ? data.filter(flag => flag.area === activeArea) : data;
      setFeatureFlags(filteredFlags);
      setAreas(['All', ...new Set(data.map(flag => flag.area))]);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
    }
  }, [activeArea,isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFeatureFlags();
    const intervalId = setInterval(fetchFeatureFlags, POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, fetchFeatureFlags]);

  if (!isAuthenticated && Environment.getBoolean('is_secured')) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div id="main" className="main">
      <Sidebar onAreaSelect={setActiveArea} allAreas={areas} onLogout={()=>setIsAuthenticated(false)} />
      <div className="mainArea">
        <Dashboard activeArea={activeArea} featureFlags={featureFlags} />
      </div>
    </div>
  );
};

export default App;
