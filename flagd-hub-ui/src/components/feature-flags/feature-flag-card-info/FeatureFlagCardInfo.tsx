import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './FeatureFlagCardInfo.css';
import { FeatureFlag, Changelog } from '../../../models';
import * as featureFlagsService from '../../../services/feature-flags.service';

interface FeatureFlagCardInfoProps {
  featureFlag: FeatureFlag;
  onClose: () => void;
}

const FeatureFlagCardInfo: React.FC<FeatureFlagCardInfoProps> = ({ featureFlag, onClose }) => {
  const [changelog, setChangelog] = useState<Changelog | null>(null);

  useEffect(() => {
    const fetchChangelogs = async () => {
      try {
        const changelogs = await featureFlagsService.getChangelogs(featureFlag.key);
        if (changelogs && changelogs.length > 0) {
          setChangelog(changelogs[changelogs.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching changelogs", error);
      }
    };

    fetchChangelogs();
  }, [featureFlag.key]);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="feature-flag-card-info-popup-overlay" onClick={onClose}>
      <div className="feature-flag-card-info-popup" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-title">{featureFlag.name}</h2>
        <p className="popup-description"><strong>key:</strong> {featureFlag.key}</p>
        <p className="popup-description"><strong>description:</strong> {featureFlag.description}</p>
        <p className="popup-description"><strong>area:</strong> {featureFlag.area}</p>
        <p className="popup-info">
          <strong>Created on:</strong> {new Date(featureFlag.creationTime).toLocaleString()}
        </p>
        {changelog && (
          <div className="changelog">
            <p>
              <strong>Changed from:</strong> {changelog.previousVariant}
            </p>
            <p>
              <strong>To:</strong> {changelog.updatedVariant}
            </p>
            <p>
              <strong>Change Date:</strong> {new Date(changelog.timestamp).toLocaleString()}
            </p>
          </div>
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
