import React, { useState } from 'react';
import './dashboard.css';
import FlagsEmptyState from '../../components/flags-empty-state/flags-empty-state';
import FeatureFlagCard from '../../components/feature-flags/feature-flag-card/FeatureFlagCard';
import FeatureFlag from '../../models/FeatureFlag';
import CreateFeatureFlagPopup from '../../components/feature-flags/create-feature-flag-popop/CreateFeatureFlagPopup';
import ExportPopup from '../../components/export-popup/ExportPopup'; // Import the popup
import FeatureFlagsService from '../../services/feature-flags-service';

interface DashboardProps {
  activeArea: string | null;
  featureFlags: FeatureFlag[];
}

const Dashboard: React.FC<DashboardProps> = ({ activeArea, featureFlags }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // Create Flag Popup state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false); // Export Popup state
  const [exportData, setExportData] = useState<FeatureFlag[] | null>(null); // Data for Export Popup

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const filteredFlags = featureFlags
    .filter(flag => flag.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (a.defaultVariant === 'on' ? -1 : 1));

  const handleVariantChange = (flagId: string, variant: string) => {
    console.log(`Feature flag ID: ${flagId}, Variant selected: ${variant}`);
    updateFeatureFlag(flagId, variant);
  };

  const updateFeatureFlag = async (flagId: string, defaultVariant: string) => {
    FeatureFlagsService.setFeatureFlag(flagId, defaultVariant);
  };

  const handleCreateFlag = (newFlag: FeatureFlag) => {
    FeatureFlagsService.createFeatureFlag(newFlag);
    setIsPopupOpen(false);
  };

  const openExportPopup = async () => {
    const data = await FeatureFlagsService.getFeatureFlags();
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
                selectedVariant={flag.defaultVariant}
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
          featureFlags={exportData}
        />
      )}
    </div>
  );
};

export default Dashboard;
