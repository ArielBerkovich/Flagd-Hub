import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './FeatureFlagCardInfo.css'; // Optional: for styling the popup
import FeatureFlag from '../../../models/FeatureFlag';
import FeatureFlagsService from '../../../services/feature-flags-service';
import Changelog from '../../../models/Changelog'; // Assuming you have a Changelog model

// Define types for the props
interface FeatureFlagCardInfoProps {
  featureFlag: FeatureFlag;
  onClose: () => void;
}

const FeatureFlagCardInfo: React.FC<FeatureFlagCardInfoProps> = ({ featureFlag, onClose }) => {
  const [changelog, setChangelog] = useState<Changelog | null>(null);

  useEffect(() => {
    // Fetch the changelogs for the feature flag
    const fetchChangelogs = async () => {
      try {
        const changelogs = await FeatureFlagsService.getChangelogs(featureFlag.key);
        if (changelogs && changelogs.length > 0) {
          // Set the most recent changelog (the last item in the list)
          setChangelog(changelogs[changelogs.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching changelogs", error);
      }
    };

    fetchChangelogs();
  }, [featureFlag.key]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the close button click from triggering the overlay's click handler
    onClose(); // Call the passed function to close the popup
  };

  return ReactDOM.createPortal(
    <div className="feature-flag-card-info-popup-overlay" onClick={onClose}>
      <div className="feature-flag-card-info-popup" onClick={(e) => e.stopPropagation()}>
        <h1>{featureFlag.name}</h1>
        <p>{featureFlag.description}</p>
        <p>{"created on " + new Date(featureFlag.creationTime).toLocaleString()}</p>
        {changelog && (
          <p>
            Was changed from <strong>{changelog.previousVariant}</strong> to{" "}
            <strong>{changelog.updatedVariant}</strong> on{" "}
            <strong>{new Date(changelog.timestamp).toLocaleString()}</strong>
          </p>
        )}
        <button className="close-btn" onClick={handleCloseClick}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

export default FeatureFlagCardInfo;
