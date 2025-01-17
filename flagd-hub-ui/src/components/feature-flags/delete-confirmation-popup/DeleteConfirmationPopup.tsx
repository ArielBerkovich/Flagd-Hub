import React from 'react';
import ReactDOM from 'react-dom';
import './DeleteConfirmationPopup.css';

interface DeleteConfirmationPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({ message, onConfirm, onCancel }) => {
  return ReactDOM.createPortal(
    <div className="popup-overlay" onClick={onCancel}>
      <div
        className="popup-form"
      >
        <h3>Confirm Delete</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="confirm-button" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteConfirmationPopup;
