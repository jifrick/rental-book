import React, { useState, useEffect } from 'react';
import { Search, Wrench, RefreshCw } from 'lucide-react';
import type { Rental, Tool } from '../types/database';
import { getRentals, getTools, subscribeToStore } from '../lib/storageService';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { ActiveRentalCard } from '../components/dashboard/ActiveRentalCard';
import { EmptyState } from '../components/shared/EmptyState';

interface DashboardProps {
  onOpenNewRental: () => void;
  onOpenReturnTool: (rental: Rental) => void;
  onOpenRentalDetails: (rental: Rental) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewRental,
  onOpenReturnTool,
  onOpenRentalDetails,
}) => {
  const [rentals, setRentals] = useState<Rental[]>(() => getRentals());
  const [tools, setTools] = useState<Tool[]>(() => getTools());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const refreshData = () => {
    setRentals(getRentals());
    setTools(getTools());
  };

  useEffect(() => {
    return subscribeToStore(refreshData);
  }, []);

  const activeRentals = rentals.filter((r) => r.status === 'ACTIVE');

  // Filter active rentals by search query
  const filteredActiveRentals = activeRentals.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (r.customer_name && r.customer_name.toLowerCase().includes(q)) ||
      (r.customer_phone && r.customer_phone.includes(q)) ||
      (r.tool_name && r.tool_name.toLowerCase().includes(q)) ||
      (r.tool_code && r.tool_code.toLowerCase().includes(q)) ||
      (r.rental_code && r.rental_code.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Dashboard Top Greeting & Subhead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm font-bold text-slate-600">
            Good Morning! Here is what's currently rented outside the shop today.
          </p>
        </div>

        <button
          onClick={refreshData}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-sm transition-all min-h-[44px] self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <SummaryCards rentals={rentals} tools={tools} />

      {/* CURRENTLY OUT SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl border-2 border-amber-500 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
              <Wrench className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                CURRENTLY OUT ({activeRentals.length})
              </h3>
              <p className="text-xs font-bold text-amber-400">
                Active tools currently taken by customers
              </p>
            </div>
          </div>

          {/* Quick Search inside Active Rentals */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active rentals..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-white font-bold rounded-xl text-sm focus:border-amber-500 outline-hidden"
            />
          </div>
        </div>

        {/* Active Rentals Grid */}
        {filteredActiveRentals.length === 0 ? (
          <EmptyState
            title={activeRentals.length === 0 ? 'No tools are currently outside' : `No active rentals found for "${searchQuery}"`}
            description={
              activeRentals.length === 0
                ? 'All physical tools are inside the shop and available for rent.'
                : 'Try searching with a different customer name, phone number, or tool code.'
            }
            actionLabel="+ NEW RENTAL"
            onAction={onOpenNewRental}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredActiveRentals.map((rental) => (
              <ActiveRentalCard
                key={rental.id}
                rental={rental}
                onReturnTool={onOpenReturnTool}
                onSelectRental={onOpenRentalDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
