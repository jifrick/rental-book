import React from 'react';
import { Building2, CheckCircle2, AlertOctagon, Wrench, Users, Receipt, Plus } from 'lucide-react';
import { getShops, getMasterTools, getRentals, getCustomers } from '../../lib/storageService';

interface AdminOverviewProps {
  onNavigateToShops: () => void;
  onCreateShopClick: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateToShops, onCreateShopClick }) => {
  const shops = getShops();
  const masterTools = getMasterTools();
  const allRentals = getRentals();
  const allCustomers = getCustomers();

  const activeShopsCount = shops.filter(s => s.status === 'ACTIVE').length;
  const suspendedShopsCount = shops.filter(s => s.status === 'SUSPENDED').length;
  const totalRentalsCount = allRentals.length;
  const totalCustomersCount = allCustomers.length;

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Overview</h1>
          <p className="text-sm text-[#9da699]">Rental Book SaaS Ecosystem Management</p>
        </div>

        <button
          onClick={onCreateShopClick}
          className="px-5 py-3 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-[#d35d2f]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Shop</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#232621] border border-[#32362e] rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9da699] uppercase tracking-wider">Total Shops</p>
            <h3 className="text-3xl font-bold text-white mt-1">{shops.length}</h3>
            <p className="text-[11px] text-[#9da699] mt-1">{activeShopsCount} active • {suspendedShopsCount} suspended</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#d35d2f]">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-[#232621] border border-[#32362e] rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9da699] uppercase tracking-wider">Master Catalog Tools</p>
            <h3 className="text-3xl font-bold text-white mt-1">{masterTools.length}</h3>
            <p className="text-[11px] text-[#9da699] mt-1">Available for shop onboarding</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-[#232621] border border-[#32362e] rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9da699] uppercase tracking-wider">Total Rentals</p>
            <h3 className="text-3xl font-bold text-white mt-1">{totalRentalsCount}</h3>
            <p className="text-[11px] text-[#9da699] mt-1">Across all registered shops</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-[#232621] border border-[#32362e] rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9da699] uppercase tracking-wider">Total Customers</p>
            <h3 className="text-3xl font-bold text-white mt-1">{totalCustomersCount}</h3>
            <p className="text-[11px] text-[#9da699] mt-1">Platform customer directory</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Registered Shops Table */}
      <div className="bg-[#232621] border border-[#32362e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Registered Rental Shops</h2>
            <p className="text-xs text-[#9da699]">Isolated workspace status and access controls</p>
          </div>
          <button
            onClick={onNavigateToShops}
            className="text-xs text-[#d35d2f] hover:underline font-semibold"
          >
            Manage All Shops →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#191b18] text-[#9da699] text-xs font-semibold uppercase tracking-wider border-b border-[#32362e]">
              <tr>
                <th className="py-3 px-4">Shop Name</th>
                <th className="py-3 px-4">Owner / Manager</th>
                <th className="py-3 px-4">Account Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Onboarding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#32362e]">
              {shops.map(s => (
                <tr key={s.id} className="hover:bg-[#2e332a] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">{s.name}</td>
                  <td className="py-3.5 px-4 text-[#9da699]">{s.owner_name}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-orange-400 font-semibold">{s.email}</td>
                  <td className="py-3.5 px-4 text-[#9da699]">{s.phone}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      s.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {s.status === 'ACTIVE' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertOctagon className="w-3.5 h-3.5" />}
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#9da699]">
                    {s.is_onboarded ? (
                      <span className="text-emerald-400 font-medium">Completed</span>
                    ) : (
                      <span className="text-amber-400 font-medium">Pending Onboarding</span>
                    )}
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
