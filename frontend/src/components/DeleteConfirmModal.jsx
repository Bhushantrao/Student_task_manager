import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

/**
 * DeleteConfirmModal Component (Stateless / Presentational Component)
 * 
 * Demonstrates:
 * - Simple confirmation dialog with props.
 * - onClick handlers for confirm/cancel actions.
 */
function DeleteConfirmModal({ isOpen, taskTitle, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-content modal-content-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-icon-wrapper">
          <AlertTriangle size={32} className="warning-icon" />
        </div>

        <h3 className="confirm-title">Delete Task?</h3>
        <p className="confirm-message">
          Are you sure you want to delete <strong>"{taskTitle}"</strong>? This action cannot be undone.
        </p>

        <div className="modal-actions confirm-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;

