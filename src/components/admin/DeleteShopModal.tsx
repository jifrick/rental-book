import React, { useState } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { deleteShop } from '../../lib/storageService';
import type { Shop } from '../../types/database';

interface DeleteShopModalProps {
  shop: Shop;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteShopModal: React.FC<DeleteShopModalProps> = ({ shop, onClose, onSuccess }) => {
  const [confirmName, setConfirmName] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmed = confirmName.trim().toUpperCase() === shop.name.trim().toUpperCase();

  const handleDelete = () => {
    if (!isConfirmed) {
      setError(`Please type "${shop.name}" exactly to confirm deletion.`);
      return;
    }

    setIsDeleting(true);
    try {
      deleteShop(shop.id);
      setIsDeleting(false);
      onSuccess();
    } catch (err: any) {
      setIsDeleting(false);
      setError(err.message || 'Failed to delete shop');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#191b18] border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#32362e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Delete Shop</h2>
              <p className="text-xs text-red-400 font-semibold">Permanent Action • Cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#232621] hover:bg-[#2e332a] text-[#9da699] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-[#9da699] leading-relaxed">
            You are about to delete shop <strong className="text-white font-bold">{shop.name}</strong> ({shop.email}).
            This will permanently remove all associated shop settings, customer directory, tools catalog, and active/historical rental records.
          </div>

          <div>
            <label className="block text-xs text-[#9da699] font-medium mb-1.5">
              Type <strong className="text-white font-bold">{shop.name}</strong> to confirm deletion:
            </label>
            <input
              type="text"
              value={confirmName}
              onChange={e => setConfirmName(e.target.value)}
              placeholder={shop.name}
              className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-red-500 text-sm font-semibold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#32362e]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#232621] hover:bg-[#2e332a] text-white text-sm font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!isConfirmed || isDeleting}
              onClick={handleDelete}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-red-600/20 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Deleting...' : 'Permanently Delete Shop'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
