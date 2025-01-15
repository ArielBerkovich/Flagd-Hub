import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashboard.css';
import FlagsEmptyState from '../components/flags-empty-state/flags-empty-state';
import FeatureFlagCard from '../components/feature-flags/feature-flag-card/FeatureFlagCard';
import FeatureFlag from '../models/FeatureFlag';
import CreateFeatureFlagPopup from '../components/feature-flags/create-feature-flag-popop/CreateFeatureFlagPopup';
import FeatureFlagService from '../services/feature-flags-service'
interface DashboardProps {
  activeArea: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ activeArea }) => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // Popup state
  const POLLING_INTERVAL = 2000;

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const { data } = await axios.get('/flagd-hub/flags');
        const flags = activeArea ? data.filter((flag: FeatureFlag) => flag.area === activeArea) : data;
        setFeatureFlags(flags);

        const defaultVariants = flags.reduce(
          (acc: Record<string, string>, flag: FeatureFlag) => ({ ...acc, [flag.key]: flag.defaultVariant }),
          {}
        );
        setSelectedVariants(defaultVariants);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      }
    };

    fetchFeatureFlags();
    const intervalId = setInterval(fetchFeatureFlags, POLLING_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [activeArea]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const filteredFlags = featureFlags
    .filter(flag => flag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (a.defaultVariant === 'on' ? -1 : 1));

  const handleVariantChange = (flagId: string, variant: string) => {
    console.log(`Feature flag ID: ${flagId}, Variant selected: ${variant}`);
    setSelectedVariants(prev => ({ ...prev, [flagId]: variant }));
    updateFeatureFlag(flagId, variant);
  };

  const updateFeatureFlag = async (flagId: string, defaultVariant: string) => {
    console.log(defaultVariant);
    const featureFlagsSerice = new FeatureFlagService();
    featureFlagsSerice.setFeatureFlag(flagId, defaultVariant)
  };

  const handleCreateFlag = (newFlag: FeatureFlag) => {
    setFeatureFlags(prev => [...prev, newFlag]);
    setIsPopupOpen(false); // Close popup after creation
  };

  return (
    <div className="feature-flags">
      <div className="feature-flags-menu-header">
        <h3>{activeArea ? `Feature Flags for ${activeArea}` : 'All Feature Flags'}</h3>
        <div className="flagfs-actions">
          <button className="create-flag-button" onClick={() => setIsPopupOpen(true)}>
            + Create Feature Flag
          </button>
          <div>
            <input
              type="text"
              placeholder="Search feature flags..."
              className="search-bar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      {filteredFlags.length === 0 ? (
        <FlagsEmptyState searchTerm={searchTerm} />
      ) : (
        <div className="feature-cards">
          {filteredFlags.map(flag => (
            <FeatureFlagCard
              key={flag.key}
              flag={flag}
              selectedVariant={selectedVariants[flag.key]}
              onVariantChange={handleVariantChange}
            />
          ))}
        </div>
      )}
      {isPopupOpen && (
        <CreateFeatureFlagPopup
          onClose={() => setIsPopupOpen(false)}
          onCreate={handleCreateFlag}
        />
      )}
    </div>
  );
};

export default Dashboard;
