import React, { useState } from 'react';
import './dashboard.css';
import FlagsEmptyState from '../../components/flags-empty-state/flags-empty-state';
import FeatureFlagCard from '../../components/feature-flags/feature-flag-card/FeatureFlagCard';
import FeatureFlag from '../../models/FeatureFlag';
import CreateFeatureFlagPopup from '../../components/feature-flags/create-feature-flag-popop/CreateFeatureFlagPopup';
import ExportPopup from '../../components/export-popup/ExportPopup'; // Import the popup
import FeatureFlagsService from '../../services/feature-flags-service';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import HistoryIcon from '@mui/icons-material/History';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ChangeLogs from '../../components/changelogs/ChangeLogs';
import Changelog from '../../models/Changelog';

interface DashboardProps {
  activeArea: string | null;
  featureFlags: FeatureFlag[];
}

const Dashboard: React.FC<DashboardProps> = ({ activeArea, featureFlags }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // Create Flag Popup state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false); // Export Popup state
  const [exportData, setExportData] = useState<FeatureFlag[] | null>(null); // Data for Export Popup
  const [isChangelogsOpen, setIsChangelogsOpen] = useState<boolean>(false); // Export Popup state
  const [changeLogsData, setChangeLogs] = useState<Map<string,Changelog> | null>(null); // Data for changelogs Popup
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null); // Flag being edited
  const [allFlagsEnabled, setAllFlagsEnabled] = useState<boolean>(false); // Track if all flags are enabled

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
    // Otherwise create a new flag
    FeatureFlagsService.createFeatureFlag(newFlag);
    setIsPopupOpen(false);
    setEditingFlag(null);
  };

  const handleEditFlag = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setEditingFlag(null);
  };

  const openExportPopup = async () => {
    const data = await FeatureFlagsService.getFeatureFlags();
    setExportData(data);
    setIsExportOpen(true);
  };

  const openChangeLogs = async () => {
    const data = await FeatureFlagsService.getChangeLogs();
    setChangeLogs(data);
    setIsChangelogsOpen(true);
  };

  // Function to toggle all boolean flags in the current view
  const toggleAllBooleanFlags = async () => {
    // Get only the boolean flags from the filtered flags
    const booleanFlags = filteredFlags.filter(flag => flag.type === 'boolean');
    
    if (booleanFlags.length === 0) return;
    
    // Check if all flags are currently on
    const allOn = booleanFlags.every(flag => flag.defaultVariant === 'on');
    
    // Set the new state (opposite of current state)
    const newState = allOn ? 'off' : 'on';
    
    // Update each boolean flag
    for (const flag of booleanFlags) {
      if (flag.defaultVariant !== newState) {
        await FeatureFlagsService.setFeatureFlag(flag.key, newState);
        // Update the flag in the UI
        flag.defaultVariant = newState;
      }
    }
    
    // Update the toggle state
    setAllFlagsEnabled(!allOn);
    
    // Force a re-render
    setSearchTerm(searchTerm);
  };

  // Calculate if any boolean flags exist in the filtered flags
  const hasBooleanFlags = () => {
    return filteredFlags.some(flag => flag.type === 'boolean');
  };

  // Calculate if all boolean flags are currently enabled
  const calculateAllFlagsState = () => {
    const booleanFlags = filteredFlags.filter(flag => flag.type === 'boolean');
    return booleanFlags.length > 0 && booleanFlags.every(flag => flag.defaultVariant === 'on');
  };

  return (
    <div className="feature-flags">
      <div className="feature-flags-menu-header">
        <h3>{activeArea ? `Feature Flags for ${activeArea}` : 'All Feature Flags'}</h3>
        <div className="flags-actions">
          <input
            type="text"
            placeholder="Search feature flags..."
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="header-button" onClick={() => setIsPopupOpen(true)}>
            Create flag
            <AddIcon className="me-2" />
          </button>
          <button className="header-button" onClick={openExportPopup}>
            Export
            <FileUploadIcon className="me-2" />
          </button>
          <button className="header-button" onClick={openChangeLogs}>
            Changelogs
            <HistoryIcon className="me-2" />
          </button>
        </div>
      </div>
      {featureFlags.length === 0 ? (
        <div className="no-feature-flags">No feature flags available</div>
      ) : filteredFlags.length === 0 ? (
        <FlagsEmptyState searchTerm={searchTerm} />
      ) : (
        <>
          {hasBooleanFlags() && (
            <div className="toggle-all-container">
              <button 
                className="toggle-all-button" 
                onClick={toggleAllBooleanFlags}
                title={calculateAllFlagsState() ? "Disable all boolean flags" : "Enable all boolean flags"}
              >
                {calculateAllFlagsState() ? (
                  <>
                    <ToggleOffIcon className="toggle-icon off" />
                    <span>Disable All Boolean Flags</span>
                  </>
                ) : (
                  <>
                    <ToggleOnIcon className="toggle-icon on" />
                    <span>Enable All Boolean Flags</span>
                  </>
                )}
              </button>
            </div>
          )}
          <div className="feature-cards">
            {filteredFlags
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
              .map(flag => (
                <FeatureFlagCard
                  key={flag.key}
                  flag={flag}
                  selectedVariant={flag.defaultVariant}
                  onVariantChange={handleVariantChange}
                  onEdit={handleEditFlag}
                />
              ))}
          </div>
        </>
      )}
      {isPopupOpen && (
        <CreateFeatureFlagPopup
          onClose={handleClosePopup}
          onCreate={handleCreateFlag}
          featureFlag={editingFlag || undefined}
        />
      )}
      {isExportOpen && exportData && (
        <ExportPopup
          show={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          featureFlags={exportData}
        />
      )}
      {isChangelogsOpen && changeLogsData && (
        <ChangeLogs
          onClose={() => setIsChangelogsOpen(false)}
          changeLogs={changeLogsData}
        />
      )}
    </div>
  );
};

export default Dashboard;
