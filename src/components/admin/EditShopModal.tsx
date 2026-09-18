import React, { useState } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { updateShopDetails } from '../../lib/storageService';
import type { Shop } from '../../types/database';

interface EditShopModalProps {
  shop: Shop;
  onClose: () => void;
  onSuccess: (updatedShop: Shop) => void;
}

export const EditShopModal: React.FC<EditShopModalProps> = ({ shop, onClose, onSuccess }) => {
  const [shopName, setShopName] = useState(shop.name);
  const [ownerName, setOwnerName] = useState(shop.owner_name);
  const [email, setEmail] = useState(shop.email);
  const [phone, setPhone] = useState(shop.phone);
  const [address, setAddress] = useState(shop.address);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shopName.trim() || !ownerName.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = updateShopDetails(shop.id, {
        name: shopName,
        owner_name: ownerName,
        email: email.trim().toLowerCase(),
        phone,
        address,
      });

      setIsSaving(false);
      onSuccess(updated);
    } catch (err: any) {
      setIsSaving(false);
      setError(err.message || 'Failed to update shop details');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#191b18] border border-[#32362e] rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#32362e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#d35d2f]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Edit Shop Details</h2>
              <p className="text-xs text-[#9da699]">Update information for <span className="text-white font-semibold">{shop.name}</span></p>
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
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Shop Name *</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Owner / Manager Name *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Owner Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#9da699] font-medium mb-1">Shop Address *</label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm resize-none"
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
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-sm font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-[#d35d2f]/20 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
