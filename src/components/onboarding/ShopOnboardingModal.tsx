import React, { useState } from 'react';
import { Store, Wrench, CheckCircle2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { getMasterTools, onboardShop, updateSettings } from '../../lib/storageService';
import type { Shop, MasterTool } from '../../types/database';

interface ShopOnboardingModalProps {
  shop: Shop;
  onComplete: () => void;
}

interface SelectedToolConfig {
  masterToolId: string;
  name: string;
  category_name: string;
  machine_count: number;
  prefix: string;
}

export const ShopOnboardingModal: React.FC<ShopOnboardingModalProps> = ({ shop, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const masterTools = getMasterTools().filter(m => m.is_active);

  // Step 1 State: Shop info
  const [shopName, setShopName] = useState(shop.name);
  const [ownerName, setOwnerName] = useState(shop.owner_name);
  const [phone, setPhone] = useState(shop.phone);
  const [address, setAddress] = useState(shop.address);

  // Step 2 State: Tool Catalog selection
  const [toolConfigs, setToolConfigs] = useState<SelectedToolConfig[]>(() => {
    return masterTools.slice(0, 10).map(m => ({
      masterToolId: m.id,
      name: m.name,
      category_name: m.category_name,
      machine_count: 2,
      prefix: m.name.substring(0, 3).toUpperCase(),
    }));
  });

  const toggleToolSelection = (mTool: MasterTool) => {
    setToolConfigs(prev => {
      const exists = prev.some(t => t.masterToolId === mTool.id);
      if (exists) {
        return prev.filter(t => t.masterToolId !== mTool.id);
      } else {
        const defaultPrefix = mTool.name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
        return [
          ...prev,
          {
            masterToolId: mTool.id,
            name: mTool.name,
            category_name: mTool.category_name,
            machine_count: 2,
            prefix: defaultPrefix || 'TL',
          },
        ];
      }
    });
  };

  const updateCount = (masterToolId: string, count: number) => {
    setToolConfigs(prev =>
      prev.map(t => (t.masterToolId === masterToolId ? { ...t, machine_count: Math.max(1, count) } : t))
    );
  };

  const updatePrefix = (masterToolId: string, prefix: string) => {
    setToolConfigs(prev =>
      prev.map(t => (t.masterToolId === masterToolId ? { ...t, prefix: prefix.toUpperCase() } : t))
    );
  };

  const handleFinish = () => {
    updateSettings({
      shop_name: shopName,
      owner_name: ownerName,
      phone,
      address,
    }, shop.id);

    onboardShop(
      shop.id,
      toolConfigs.map(t => ({
        name: t.name,
        category_name: t.category_name,
        machine_count: t.machine_count,
        prefix: t.prefix,
      }))
    );

    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#191b18] border border-[#32362e] rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#232621] border-b border-[#32362e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#d35d2f]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Welcome! Setup {shopName || shop.name}</h2>
              <p className="text-xs text-[#9da699]">Step {step} of 3 • Quick Shop Onboarding</p>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                  step === s
                    ? 'bg-[#d35d2f] text-white'
                    : step > s
                    ? 'bg-[#2e332a] text-[#d35d2f]'
                    : 'bg-[#232621] text-[#687063] border border-[#32362e]'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                <Store className="w-4 h-4 text-[#d35d2f]" />
                <span>Confirm Shop Profile Information</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-2">
                  Shop Name *
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d35d2f] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-2">
                  Owner / Manager Name *
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d35d2f] text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d35d2f] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9da699] uppercase tracking-wider mb-2">
                    Shop Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full bg-[#232621] border border-[#32362e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d35d2f] text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#d35d2f]" />
                    Select Tool Types from Master Catalog
                  </h3>
                  <p className="text-xs text-[#9da699]">
                    Select which tool types your shop offers to customers.
                  </p>
                </div>
                <span className="text-xs font-medium text-[#d35d2f] bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                  {toolConfigs.length} Tool Types Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {masterTools.map(m => {
                  const isSelected = toolConfigs.some(t => t.masterToolId === m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleToolSelection(m)}
                      className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'bg-orange-500/10 border-[#d35d2f] text-white'
                          : 'bg-[#232621] border-[#32362e] text-[#9da699] hover:border-[#42483d]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#d35d2f] rounded"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{m.name}</div>
                        <div className="text-xs text-[#9da699]">{m.category_name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#d35d2f]" />
                  Configure Physical Machine Quantities
                </h3>
                <p className="text-xs text-[#9da699]">
                  Specify how many physical machines your shop owns for each tool type.
                </p>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {toolConfigs.map(t => (
                  <div
                    key={t.masterToolId}
                    className="p-3.5 bg-[#232621] border border-[#32362e] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-[#9da699]">
                        Generated Machine IDs:{' '}
                        <span className="font-mono text-white">
                          {Array.from({ length: Math.min(t.machine_count, 3) }, (_, i) => `${t.prefix}-${(i + 1).toString().padStart(2, '0')}`).join(', ')}
                          {t.machine_count > 3 ? ' ...' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <label className="block text-[10px] text-[#9da699] uppercase font-semibold">Prefix</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={t.prefix}
                          onChange={e => updatePrefix(t.masterToolId, e.target.value)}
                          className="w-16 bg-[#191b18] border border-[#32362e] rounded-lg px-2 py-1 text-center text-xs font-mono text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#9da699] uppercase font-semibold">Count</label>
                        <div className="flex items-center gap-1 bg-[#191b18] border border-[#32362e] rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => updateCount(t.masterToolId, t.machine_count - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#232621] text-white text-xs"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white">{t.machine_count}</span>
                          <button
                            type="button"
                            onClick={() => updateCount(t.masterToolId, t.machine_count + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#232621] text-white text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#232621] border-t border-[#32362e] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2.5 bg-[#191b18] hover:bg-[#2e332a] border border-[#32362e] text-white text-sm font-medium rounded-xl flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="px-5 py-2.5 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-sm font-medium rounded-xl flex items-center gap-1.5 shadow-md shadow-[#d35d2f]/20"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-sm font-medium rounded-xl flex items-center gap-2 shadow-lg shadow-[#d35d2f]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finish Setup & Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
