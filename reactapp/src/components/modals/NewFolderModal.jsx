import React, { useState } from "react";
import { Modal, Button } from '../ui';
import { COLORS } from '../dashboard/DashboardUtils';

export default function NewFolderModal({ onClose, onCreate, isOpen }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <Modal title="Create New Folder" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Folder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{'--tw-ring-color': COLORS.primary}}
            onFocus={(e) => e.target.style.borderColor = COLORS.primary}
            onBlur={(e) => e.target.style.borderColor = ''}
            placeholder="Enter folder name"
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!name.trim()}>
            Create Folder
          </Button>
        </div>
      </form>
    </Modal>
  );
}
