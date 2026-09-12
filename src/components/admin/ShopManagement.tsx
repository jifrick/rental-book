import React, { useState } from 'react';
import { Building2, Search, Plus, CheckCircle2, Ban, ExternalLink, Copy, Check } from 'lucide-react';
import { getShops, updateShopStatus } from '../../lib/storageService';
import { useAuth } from '../../context/AuthContext';
import type { Shop } from '../../types/database';

interface ShopManagementProps {
  onCreateShopClick: () => void;
}

export const ShopManagement: React.FC<ShopManagementProps> = ({ onCreateShopClick }) => {
  const [shops, setShops] = useState<Shop[]>(() => getShops());
  const [searchQuery, setSearchQuery] = useState('');
  const { switchShop } = useAuth();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshShops = () => {
    setShops(getShops());
  };

  const handleToggleStatus = (shop: Shop) => {
    const nextStatus = shop.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    updateShopStatus(shop.id, nextStatus);
    refreshShops();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredShops = shops.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Rental Shops Directory</h1>
          <p className="text-sm text-[#9da699]">Manage all tenant shops, account statuses & access permissions</p>
        </div>

        <button
          onClick={onCreateShopClick}
          className="px-5 py-3 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-[#d35d2f]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Shop</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9da699]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by shop name, owner name, email address, or phone..."
          className="w-full bg-[#232621] border border-[#32362e] rounded-xl pl-12 pr-4 py-3 text-white placeholder-[#687063] focus:outline-none focus:border-[#d35d2f] text-sm"
        />
      </div>

      {/* Shops Table */}
      <div className="bg-[#232621] border border-[#32362e] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#191b18] text-[#9da699] text-xs font-semibold uppercase tracking-wider border-b border-[#32362e]">
              <tr>
                <th className="py-3.5 px-4">Shop Details</th>
                <th className="py-3.5 px-4">Account Email</th>
                <th className="py-3.5 px-4">Owner / Phone</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#32362e]">
              {filteredShops.map(s => (
                <tr key={s.id} className="hover:bg-[#2e332a] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#d35d2f] shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-base">{s.name}</div>
                        <div className="text-xs text-[#9da699]">
                          {s.is_onboarded ? 'Fully Onboarded' : 'Pending First Login Setup'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-orange-400 text-sm">
                    <div className="flex items-center gap-2">
                      <span>{s.email}</span>
                      <button
                        onClick={() => handleCopy(s.email, s.id)}
                        className="text-[#9da699] hover:text-white transition-colors"
                        title="Copy Email"
                      >
                        {copiedId === s.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">{s.owner_name}</div>
                    <div className="text-xs text-[#9da699]">{s.phone}</div>
                  </td>

                  <td className="py-4 px-4 text-xs text-[#9da699] max-w-xs truncate">
                    {s.address}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      s.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {s.status === 'ACTIVE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                      {s.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          s.status === 'ACTIVE'
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {s.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>

                      <button
                        onClick={() => switchShop(s.id)}
                        className="px-3 py-1.5 bg-[#191b18] hover:bg-[#232621] border border-[#32362e] text-[#d35d2f] hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Enter shop workspace preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect Shop</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
