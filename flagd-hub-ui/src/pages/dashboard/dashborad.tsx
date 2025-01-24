import React, { useEffect, useState } from 'react';
import './dashboard.css';
import FlagsEmptyState from '../../components/flags-empty-state/flags-empty-state';
import FeatureFlagCard from '../../components/feature-flags/feature-flag-card/FeatureFlagCard';
import FeatureFlag from '../../models/FeatureFlag';
import CreateFeatureFlagPopup from '../../components/feature-flags/create-feature-flag-popop/CreateFeatureFlagPopup';
import FeatureFlagService from '../../services/feature-flags-service';
import ExportPopup from '../../components/export-popup/ExportPopup'; // Import the popup

interface DashboardProps {
  activeArea: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ activeArea }) => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // Create Flag Popup state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false); // Export Popup state
  const [exportData, setExportData] = useState<object | null>(null); // Data for Export Popup
  const POLLING_INTERVAL = 1000;

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      FeatureFlagService.getFeatureFlags().then(data => {
        const flags = activeArea ? data.filter((flag: FeatureFlag) => flag.area === activeArea) : data;
        setFeatureFlags(flags);

        const defaultVariants = flags.reduce(
          (acc: Record<string, string>, flag: FeatureFlag) => ({ ...acc, [flag.key]: flag.defaultVariant }),
          {}
        );
        setSelectedVariants(defaultVariants);
      });
    };

    fetchFeatureFlags();
    const intervalId = setInterval(fetchFeatureFlags, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
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
    FeatureFlagService.setFeatureFlag(flagId, defaultVariant);
  };

  const handleCreateFlag = (newFlag: FeatureFlag) => {
    FeatureFlagService.createFeatureFlag(newFlag);
    setIsPopupOpen(false);
  };

  const openExportPopup = async () => {
    const data = await FeatureFlagService.getFeatureFlags();
    setExportData(data);
    setIsExportOpen(true);
  };

  return (
    <div className="feature-flags">
      <div className="feature-flags-menu-header">
        <h3>{activeArea ? `Feature Flags for ${activeArea}` : 'All Feature Flags'}</h3>
        <div className="flagfs-actions">
          <div>
            <input
              type="text"
              placeholder="Search feature flags..."
              className="search-bar"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button className="header-button" onClick={() => setIsPopupOpen(true)}>
            Create Feature Flag ➕
          </button>
          <button className="header-button" onClick={openExportPopup}>
            Export 💾
          </button>
        </div>
      </div>
      {featureFlags.length === 0 ? (
        <div className="no-feature-flags">No feature flags available</div>
      ) : filteredFlags.length === 0 ? (
        <FlagsEmptyState searchTerm={searchTerm} />
      ) : (
        <div className="feature-cards">
          {filteredFlags
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
            .map(flag => (
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
      {isExportOpen && exportData && (
        <ExportPopup
          show={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          jsonData={exportData}
        />
      )}
    </div>
  );
};

export default Dashboard;
