import React, { useState, useEffect, useMemo } from 'react';
import type { Rental } from '../types/database';
import { getRentals, subscribeToStore } from '../lib/storageService';
import { useAuth } from '../context/AuthContext';
import { formatDateOnly, formatTimeOnly, calculateDuration } from '../lib/dateUtils';
import { EmptyState } from '../components/shared/EmptyState';

interface HistoryPageProps {
  onOpenReceipt: (rental: Rental) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onOpenReceipt }) => {
  const { currentShopId } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>(() => getRentals(currentShopId));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RETURNED'>('ALL');

  useEffect(() => {
    setRentals(getRentals(currentShopId));
    return subscribeToStore(() => setRentals(getRentals(currentShopId)));
  }, [currentShopId]);

  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

      if (!q) return matchesStatus;

      const matchesSearch =
        (r.customer_name && r.customer_name.toLowerCase().includes(q)) ||
        (r.customer_phone && r.customer_phone.includes(q)) ||
        (r.tool_name && r.tool_name.toLowerCase().includes(q)) ||
        (r.tool_code && r.tool_code.toLowerCase().includes(q)) ||
        (r.rental_code && r.rental_code.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [rentals, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ded9d0] pb-4">
        <div>
          <h1 className="font-['Manrope'] text-[24px] sm:text-[29px] font-extrabold text-[#20221f] m-0">
            Rental History Ledger
          </h1>
          <p className="text-[#74766f] text-[13px] mt-1 font-medium">
            Permanent digital record of all tool rentals.
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search name, phone, tool ID, #R-1001..."
          className="h-[44px] border border-[#ded9d0] bg-white rounded-[11px] px-[13px] font-medium text-sm outline-hidden shadow-xs w-full sm:w-80"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: 'ALL', label: 'All Records' },
            { id: 'RETURNED', label: 'Completed Returns' },
            { id: 'ACTIVE', label: 'Currently Out' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            type="button"
            className={`px-4 py-2.5 rounded-[11px] font-extrabold text-xs uppercase shrink-0 transition-all ${
              statusFilter === tab.id
                ? 'bg-[#232621] text-white shadow-xs'
                : 'bg-white text-[#74766f] hover:bg-[#f6f3ed] border border-[#ded9d0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredRentals.length === 0 ? (
        <EmptyState
          title="No rental history records found"
          description={searchQuery ? `No match found for "${searchQuery}"` : 'All completed tool rentals will appear here permanently.'}
        />
      ) : (
        <div className="space-y-3">
          {filteredRentals.map((rental) => {
            const isCompleted = rental.status === 'RETURNED';
            const duration = calculateDuration(rental.started_at, rental.returned_at);

            return (
              <article
                key={rental.id}
                className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[16px] p-[16px] shadow-[0_14px_40px_rgba(43,37,28,0.09)] space-y-3"
              >
                <div className="flex justify-between items-start gap-3 border-b border-[#efede8] pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#d35d2f]">
                      #{rental.rental_code} · {formatDateOnly(rental.started_at)}
                    </span>
                    <h3 className="font-['Manrope'] text-[18px] font-extrabold text-[#20221f] m-0 mt-0.5">
                      {rental.customer_name}
                    </h3>
                    <small className="text-[#74766f] text-[11px] font-bold block mt-0.5">
                      📞 {rental.customer_phone} {rental.customer_address ? `· 📍 ${rental.customer_address}` : ''}
                    </small>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block text-[10px] font-extrabold px-[9px] py-[4px] rounded-[20px] ${
                        isCompleted ? 'bg-[#eaf6f0] text-[#176d49]' : 'bg-[#fff0e8] text-[#b84e27]'
                      }`}
                    >
                      {rental.status}
                    </span>
                    {isCompleted && (
                      <div className="text-[18px] font-['Manrope'] font-extrabold text-[#2f8a61] mt-1">
                        ₹{rental.total_amount}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#f6f3ed] p-3 rounded-[11px] border border-[#ded9d0] text-xs font-bold">
                  <div>
                    <span className="text-[#74766f] text-[10px] uppercase block font-extrabold">Tool Rented:</span>
                    <span className="text-[#20221f] text-sm font-extrabold">{rental.tool_name}</span>
                    <span className="ml-2 inline-block font-mono text-[#d35d2f]">{rental.tool_code}</span>
                  </div>

                  <div>
                    <span className="text-[#74766f] text-[10px] uppercase block font-extrabold">Time Log:</span>
                    <div>Taken: {formatTimeOnly(rental.started_at)}</div>
                    {rental.returned_at && <div>Returned: {formatTimeOnly(rental.returned_at)}</div>}
                  </div>

                  <div>
                    <span className="text-[#74766f] text-[10px] uppercase block font-extrabold">Duration:</span>
                    <div className="font-mono text-sm text-[#20221f] font-extrabold">{duration.formatted}</div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onOpenReceipt(rental)}
                    type="button"
                    className="h-[38px] px-4 bg-[#232621] hover:bg-[#353a34] text-white font-extrabold text-xs rounded-[9px] uppercase shadow-xs"
                  >
                    🖨 View Receipt Record
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
