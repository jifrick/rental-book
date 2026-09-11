import React, { useState, useEffect } from 'react';
import type { ShopSettings } from '../types/database';
import { updateSettings } from '../lib/storageService';
import { useShopSettings } from '../hooks/useShopSettings';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { currentShopId } = useAuth();
  const currentSettings = useShopSettings(currentShopId);
  const [settings, setSettings] = useState<ShopSettings>(currentSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settings, currentShopId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="border-b border-[#ded9d0] pb-4">
        <h1 className="font-['Manrope'] text-[24px] sm:text-[29px] font-extrabold text-[#20221f] m-0">
          Shop Settings
        </h1>
        <p className="text-[#74766f] text-[13px] mt-1 font-medium">
          Configure shop name, owner name, address, and receipt info.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[18px] p-6 shadow-[0_14px_40px_rgba(43,37,28,0.09)] space-y-4">
        {savedSuccess && (
          <div className="p-3 bg-[#eaf6f0] border border-[#2f8a61] text-[#176d49] font-extrabold text-xs rounded-[11px] text-center">
            ✓ Shop settings updated successfully!
          </div>
        )}

        <div>
          <label className="block text-xs font-extrabold text-[#20221f] uppercase mb-1">
            Shop Name *
          </label>
          <input
            type="text"
            required
            value={settings.shop_name}
            onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
            className="w-full h-[46px] bg-white border border-[#ded9d0] rounded-[11px] px-3 font-bold text-sm text-[#20221f]"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#20221f] uppercase mb-1">
            Owner / Manager Name *
          </label>
          <input
            type="text"
            required
            value={settings.owner_name}
            onChange={(e) => setSettings({ ...settings, owner_name: e.target.value })}
            className="w-full h-[46px] bg-white border border-[#ded9d0] rounded-[11px] px-3 font-bold text-sm text-[#20221f]"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#20221f] uppercase mb-1">
            Shop Phone Number *
          </label>
          <input
            type="tel"
            required
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            className="w-full h-[46px] bg-white border border-[#ded9d0] rounded-[11px] px-3 font-bold text-sm text-[#20221f]"
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#20221f] uppercase mb-1">
            Shop Address / Location *
          </label>
          <input
            type="text"
            required
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full h-[46px] bg-white border border-[#ded9d0] rounded-[11px] px-3 font-bold text-sm text-[#20221f]"
          />
        </div>

        <button
          type="submit"
          className="w-full h-[49px] border-0 bg-[#d35d2f] text-white font-extrabold text-sm rounded-[11px] shadow-[0_7px_20px_#d35d2f2b] mt-4 uppercase"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};
