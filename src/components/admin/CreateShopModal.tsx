import React, { useState } from 'react';
import { X, Building2, RefreshCw, ShieldCheck } from 'lucide-react';
import { createShop } from '../../lib/storageService';
import type { Shop } from '../../types/database';

interface CreateShopModalProps {
  onClose: () => void;
  onSuccess: (createdShop: Shop, tempPass: string) => void;
}

export const CreateShopModal: React.FC<CreateShopModalProps> = ({ onClose, onSuccess }) => {
  const [shopName, setShopName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [userIdCode, setUserIdCode] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [useDefaultTools, setUseDefaultTools] = useState(true);
  const [error, setError] = useState('');

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pass = 'RB-';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(pass);
  };

  const handleShopNameChange = (val: string) => {
    setShopName(val);
    if (!userIdCode || userIdCode === `${val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}001`) {
      const code = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 7);
      if (code) {
        setUserIdCode(`${code}001`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shopName.trim() || !ownerName.trim() || !phone.trim() || !address.trim() || !userIdCode.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const passToUse = tempPassword.trim() || 'RB-TEMP123';

    try {
      const created = createShop({
        name: shopName,
        owner_name: ownerName,
        phone,
        address,
        user_id_code: userIdCode,
        temp_password: passToUse,
        use_default_tools: useDefaultTools,
      });

      onSuccess(created, passToUse);
    } catch (err: any) {
      setError(err.message || 'Failed to create shop account');
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
              <h2 className="text-lg font-bold text-white">Create New Rental Shop Account</h2>
              <p className="text-xs text-[#9da699]">Admin Provisioning • Set Shop & Owner Login Credentials</p>
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
          <div className="text-xs font-bold text-[#d35d2f] uppercase tracking-wider">
            1. Shop & Owner Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Shop Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. CK TOOLS"
                value={shopName}
                onChange={e => handleShopNameChange(e.target.value)}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Owner / Manager Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jamal CK"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 9946052379"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Shop Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Koolimadu, Kozhikode"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
              />
            </div>
          </div>

          <div className="text-xs font-bold text-[#d35d2f] uppercase tracking-wider pt-2">
            2. Initial Login Credentials
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">User ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. CKTOOLS001"
                value={userIdCode}
                onChange={e => setUserIdCode(e.target.value.toUpperCase())}
                className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 font-mono text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm uppercase"
              />
            </div>

            <div>
              <label className="block text-xs text-[#9da699] font-medium mb-1">Temporary Password *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Password"
                  value={tempPassword}
                  onChange={e => setTempPassword(e.target.value)}
                  className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-3.5 py-2.5 font-mono text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
                />
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="px-3 bg-[#232621] hover:bg-[#2e332a] border border-[#32362e] text-[#9da699] hover:text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                  title="Generate Password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white">
              <input
                type="checkbox"
                checked={useDefaultTools}
                onChange={e => setUseDefaultTools(e.target.checked)}
                className="accent-[#d35d2f] rounded w-4 h-4"
              />
              <span>Enable Master Tool Catalog for shop setup</span>
            </label>
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
              className="px-5 py-2.5 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-sm font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-[#d35d2f]/20 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Create Shop Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
