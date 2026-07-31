import React from 'react';
import { Modal } from '../../common/Modal/Modal';
import './DeleteConfirmationPopup.css';

interface DeleteConfirmationPopupProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="delete-confirmation-modal">
      <div className="popup-form">
        <h3>Confirm Delete</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button className="confirm-button" onClick={onConfirm}>Yes</button>
          <button className="confirm-button" onClick={onCancel}>No</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationPopup;
