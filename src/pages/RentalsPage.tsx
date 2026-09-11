import React, { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import type { Rental } from '../types/database';
import { getRentals, subscribeToStore } from '../lib/storageService';
import { useAuth } from '../context/AuthContext';
import { ActiveRentalCard } from '../components/dashboard/ActiveRentalCard';
import { EmptyState } from '../components/shared/EmptyState';
import { getOverdueInfo } from '../lib/dateUtils';

interface RentalsPageProps {
  onOpenNewRental: () => void;
  onOpenReturnTool: (rental: Rental) => void;
  onOpenRentalDetails: (rental: Rental) => void;
}

export const RentalsPage: React.FC<RentalsPageProps> = ({
  onOpenNewRental,
  onOpenReturnTool,
  onOpenRentalDetails,
}) => {
  const { currentShopId } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>(() => getRentals(currentShopId));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subFilter, setSubFilter] = useState<'ALL' | 'DUE_TODAY' | 'OVERDUE'>('ALL');

  const refreshData = () => {
    setRentals(getRentals(currentShopId));
  };

  useEffect(() => {
    refreshData();
    return subscribeToStore(refreshData);
  }, [currentShopId]);

  const activeRentals = useMemo(() => {
    return rentals.filter((r) => r.status === 'ACTIVE');
  }, [rentals]);

  const todayStr = new Date().toDateString();

  const filteredActiveRentals = useMemo(() => {
    return activeRentals.filter((r) => {
      const q = searchQuery.trim().toLowerCase();
      const isOverdue = getOverdueInfo(r.expected_return_at, r.status).isOverdue;
      const isDueToday = r.expected_return_at && new Date(r.expected_return_at).toDateString() === todayStr;

      // Filter check
      if (subFilter === 'OVERDUE' && !isOverdue) return false;
      if (subFilter === 'DUE_TODAY' && !isDueToday) return false;

      if (!q) return true;

      return (
        (r.customer_name && r.customer_name.toLowerCase().includes(q)) ||
        (r.customer_phone && r.customer_phone.includes(q)) ||
        (r.tool_name && r.tool_name.toLowerCase().includes(q)) ||
        (r.tool_code && r.tool_code.toLowerCase().includes(q)) ||
        (r.rental_code && r.rental_code.toLowerCase().includes(q))
      );
    });
  }, [activeRentals, searchQuery, subFilter, todayStr]);

  const overdueCount = activeRentals.filter((r) => getOverdueInfo(r.expected_return_at, r.status).isOverdue).length;
  const dueTodayCount = activeRentals.filter(
    (r) => r.expected_return_at && new Date(r.expected_return_at).toDateString() === todayStr
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ded9d0] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-['Manrope'] text-[24px] sm:text-[29px] font-extrabold text-[#20221f] m-0">
              Active Rentals
            </h1>
            <span className="text-xs font-extrabold px-2.5 py-1 bg-[#fff0e8] text-[#b84e27] rounded-full border border-[#fcd5c5]">
              ● {activeRentals.length} OUTSIDE
            </span>
          </div>
          <p className="text-[#74766f] text-[13px] mt-1 font-medium">
            Live tracking of all equipment currently rented out with customers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            type="button"
            className="p-2.5 border border-[#ded9d0] bg-white hover:bg-[#f6f3ed] text-[#20221f] rounded-[11px] font-bold text-xs"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4 text-[#74766f]" />
          </button>

          <button
            onClick={onOpenNewRental}
            type="button"
            className="inline-flex items-center justify-center gap-2 h-[44px] bg-[#d35d2f] hover:bg-[#c25227] text-white font-extrabold text-xs rounded-[11px] px-[16px] uppercase shadow-xs border-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>＋ Start New Rental</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Search & Sub-filters */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active rental by customer name, phone number, tool, machine code (e.g. DR-04)..."
            className="w-full h-[46px] bg-white border border-[#ded9d0] rounded-[11px] px-[13px] font-medium text-sm outline-hidden shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSubFilter('ALL')}
            type="button"
            className={`px-4 py-2 rounded-[20px] text-[10px] font-extrabold border uppercase transition-all ${
              subFilter === 'ALL'
                ? 'bg-[#232621] text-white border-[#232621]'
                : 'bg-white text-[#74766f] border-[#ded9d0] hover:bg-[#f6f3ed]'
            }`}
          >
            All Active ({activeRentals.length})
          </button>

          <button
            onClick={() => setSubFilter('DUE_TODAY')}
            type="button"
            className={`px-4 py-2 rounded-[20px] text-[10px] font-extrabold border uppercase transition-all ${
              subFilter === 'DUE_TODAY'
                ? 'bg-[#232621] text-white border-[#232621]'
                : 'bg-white text-[#5575ad] border-[#ded9d0] hover:bg-[#f6f3ed]'
            }`}
          >
            Due Today ({dueTodayCount})
          </button>

          <button
            onClick={() => setSubFilter('OVERDUE')}
            type="button"
            className={`px-4 py-2 rounded-[20px] text-[10px] font-extrabold border uppercase transition-all ${
              subFilter === 'OVERDUE'
                ? 'bg-[#c94b48] text-white border-[#c94b48]'
                : 'bg-white text-[#c94b48] border-[#ded9d0] hover:bg-[#fde8e8]'
            }`}
          >
            Overdue Alert ({overdueCount})
          </button>
        </div>
      </div>

      {/* Active Rental Cards Grid */}
      {filteredActiveRentals.length === 0 ? (
        <EmptyState
          title={
            activeRentals.length === 0
              ? 'No tools are currently outside'
              : `No active rentals found matching "${searchQuery}"`
          }
          description={
            activeRentals.length === 0
              ? 'All tools are inside the shop and available for rent.'
              : 'Try searching for a different customer name, phone number, or tool code.'
          }
          actionLabel="＋ Start New Rental"
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
  );
};
