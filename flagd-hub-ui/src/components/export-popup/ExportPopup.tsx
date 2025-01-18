import React from "react";
import "./ExportPopup.css";

interface JsonPopupProps {
  show: boolean;
  onClose: () => void;
  jsonData: object;
}

const ExportPopup: React.FC<JsonPopupProps> = ({ show, onClose, jsonData }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    alert("JSON copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    link.click();
  };

  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>export flags JSON</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="popup-body">
          <pre className="json-pre">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
        <div className="popup-footer">
          <button className="button button-primary" onClick={handleCopy}>Copy</button>
          <button className="button button-success" onClick={handleDownload}>Download</button>
        </div>
      </div>
    </div>
  );
};

export default ExportPopup;
