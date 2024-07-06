// Modal.js
import React from 'react';
import './modal.css';

const Modal = ({ show, onClose, nodeData }) => {
  const handleClose = (event) => {
    if (event.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{nodeData.data.label}</h2>
        <p><strong>DL:</strong> {nodeData.data.dl}</p>
        <p><strong>participants:</strong> {nodeData.participants}</p>
        <p><strong>details:</strong> {nodeData.description}</p>
      </div>
    </div>
  );
};

export default Modal;
