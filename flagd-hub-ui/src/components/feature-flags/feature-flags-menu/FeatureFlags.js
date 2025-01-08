import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeatureFlags.css';
import NoFeatureFlags from '../../no-feature-flags/no-feature-flags';
import FeatureFlagCard from '../feature-flag-card/FeatureFlagCard';
import CreateFeatureFlagPopup from '../create-feature-flag-popop/CreateFeatureFlagPopup';

const FeatureFlags = ({ activeArea }) => {
  const [featureFlags, setFeatureFlags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const { data } = await axios.get('/flagd-hub/flags');
        const flags = activeArea ? data.filter(flag => flag.area === activeArea) : data;
        setFeatureFlags(flags);

        const defaultVariants = flags.reduce(
          (acc, flag) => ({ ...acc, [flag.id]: flag.defaultVariant }),
          {}
        );
        setSelectedVariants(defaultVariants);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      }
    };

    fetchFeatureFlags();
  }, [activeArea]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredFlags = featureFlags.filter(flag =>
    flag.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => (a.defaultVariant === 'on' ? -1 : 1));

  const handleVariantChange = (flagId, variant) => {
    setSelectedVariants(prev => ({ ...prev, [flagId]: variant }));
    console.log(`Feature flag ID: ${flagId}, Variant selected: ${variant}`);
  };

  const handleCreateFlag = (newFlag) => {
    setFeatureFlags(prev => [...prev, newFlag]);
    setIsPopupOpen(false); // Close popup after creation
  };

  return (  
    <div className="feature-flags">
      <div className="header-with-search">
        <h3>{activeArea ? `Feature Flags for ${activeArea}` : 'All Feature Flags'}</h3>
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
      {filteredFlags.length === 0 ? (
        <NoFeatureFlags searchTerm={searchTerm} />
      ) : (
        <div className="feature-cards">
          {filteredFlags.map(flag => (
            <FeatureFlagCard
              key={flag.id}
              flag={flag}
              selectedVariant={selectedVariants[flag.id]}
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

export default FeatureFlags;
