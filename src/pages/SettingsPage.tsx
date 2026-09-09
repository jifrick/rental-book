import React, { useState } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';
import { getSettings, updateSettings } from '../lib/storageService';
import type { ShopSettings } from '../types/database';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ShopSettings>(() => getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-md">
          <Settings className="w-7 h-7 stroke-[2.5]" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shop Settings
          </h2>
          <p className="text-sm font-bold text-slate-600">
            Configure your local tool shop name, address, and receipt details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-200 space-y-5">
        {savedSuccess && (
          <div className="p-4 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>Shop settings saved successfully!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-black text-slate-800 uppercase mb-1">
            Shop Name *
          </label>
          <input
            type="text"
            required
            value={settings.shop_name}
            onChange={(e) => setSettings({ ...settings, shop_name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-800 uppercase mb-1">
            Owner / Manager Name *
          </label>
          <input
            type="text"
            required
            value={settings.owner_name}
            onChange={(e) => setSettings({ ...settings, owner_name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-800 uppercase mb-1">
            Shop Phone Number *
          </label>
          <input
            type="tel"
            required
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-black text-slate-800 uppercase mb-1">
            Shop Address / Location *
          </label>
          <input
            type="text"
            required
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">
              Currency Symbol
            </label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-black text-slate-900 text-lg text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">
              Timezone
            </label>
            <input
              type="text"
              disabled
              value={settings.timezone}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-500 text-sm bg-slate-100 text-center"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg rounded-2xl shadow-xl min-h-[52px] uppercase border-2 border-amber-300 mt-4"
        >
          <Save className="w-6 h-6 stroke-[2.5]" />
          <span>SAVE SETTINGS</span>
        </button>
      </form>
    </div>
  );
};
