import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import * as featureFlagsService from './services/feature-flags.service';
import { environment } from './utils/environment.util';
import { isTokenExpired } from './utils/jwt.utils';
import { STORAGE_KEYS } from './constants/storage.constants';
import { POLLING_INTERVALS } from './constants/polling.constants';
import { ENV_KEYS } from './constants/environment.constants';
import './App.css';
import { FeatureFlag } from './models';

type ActiveArea = string | null;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [activeArea, setActiveArea] = useState<ActiveArea>(null);
  const [areas, setAreas] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }, []);

  const fetchFeatureFlags = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const data = await featureFlagsService.getFeatureFlags();
      const filteredFlags = activeArea ? data.filter(flag => flag.area === activeArea) : data;
      setFeatureFlags(filteredFlags);
      setAreas(['All', ...new Set(data.map(flag => flag.area))]);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
    }
  }, [activeArea, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFeatureFlags();
    const intervalId = setInterval(fetchFeatureFlags, POLLING_INTERVALS.FEATURE_FLAGS);
    return () => clearInterval(intervalId);
  }, [isAuthenticated, fetchFeatureFlags]);

  if (!isAuthenticated && environment.getBooleanSync(ENV_KEYS.IS_SECURED)) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div id="main" className="main">
      <Sidebar onAreaSelect={setActiveArea} allAreas={areas} onLogout={() => setIsAuthenticated(false)} />
      <div className="mainArea">
        <Dashboard activeArea={activeArea} featureFlags={featureFlags} />
      </div>
    </div>
  );
};

export default App;
