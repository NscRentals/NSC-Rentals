import React, { useState } from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        <p className="mb-4 text-gray-600">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        
        <div className="mb-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            Please provide a reason for deletion:
          </label>
          <textarea
            id="reason"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter deletion reason..."
            required
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            onClick={() => {
              if (reason.trim()) {
                onConfirm(reason);
                setReason('');
                onClose();
              }
            }}
            disabled={!reason.trim()}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
