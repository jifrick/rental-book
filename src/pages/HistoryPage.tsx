import React, { useState, useEffect, useMemo } from 'react';
import { Search, History, Receipt } from 'lucide-react';
import type { Rental } from '../types/database';
import { getRentals, subscribeToStore } from '../lib/storageService';
import { formatDateOnly, formatTimeOnly, calculateDuration } from '../lib/dateUtils';
import { StatusBadge } from '../components/shared/StatusBadge';
import { EmptyState } from '../components/shared/EmptyState';

interface HistoryPageProps {
  onOpenReceipt: (rental: Rental) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onOpenReceipt }) => {
  const [rentals, setRentals] = useState<Rental[]>(() => getRentals());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'RETURNED'>('ALL');

  useEffect(() => {
    return subscribeToStore(() => setRentals(getRentals()));
  }, []);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-600 font-black text-sm uppercase tracking-wider">
            <History className="w-5 h-5 stroke-[2.5]" />
            <span>Digital Notebook Records</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Rental History
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer, phone, tool ID, #R-1001..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-900 focus:border-amber-500 outline-hidden shadow-xs"
          />
        </div>
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
            className={`px-4 py-2.5 rounded-xl font-black text-sm uppercase shrink-0 min-h-[44px] transition-all ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-amber-400 shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History List Cards */}
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
              <div
                key={rental.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                {/* Header Bar */}
                <div className="flex items-start justify-between gap-3 border-b pb-3">
                  <div>
                    <div className="text-xs font-mono font-black text-amber-600">
                      #{rental.rental_code} • {formatDateOnly(rental.started_at)}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                      {rental.customer_name}
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      📞 {rental.customer_phone} {rental.customer_address ? `• 📍 ${rental.customer_address}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={rental.status} size="sm" />
                    {isCompleted && (
                      <span className="text-xl font-black text-emerald-700">
                        ₹{rental.total_amount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm font-bold">
                  <div>
                    <span className="text-slate-500 text-xs block uppercase font-black">Tool Rented:</span>
                    <span className="text-base text-slate-900">{rental.tool_name}</span>
                    <span className="ml-2 inline-block px-2 py-0.5 bg-amber-100 text-amber-950 font-mono text-xs rounded border border-amber-300">
                      {rental.tool_code}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-xs block uppercase font-black">Timestamps:</span>
                    <div>Taken: {formatTimeOnly(rental.started_at)}</div>
                    {rental.returned_at && <div>Returned: {formatTimeOnly(rental.returned_at)}</div>}
                  </div>

                  <div>
                    <span className="text-slate-500 text-xs block uppercase font-black">Duration:</span>
                    <div className="text-slate-900 font-mono text-base font-black">
                      {duration.formatted}
                    </div>
                  </div>
                </div>

                {/* Bottom Receipt Action */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onOpenReceipt(rental)}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs min-h-[40px] uppercase"
                  >
                    <Receipt className="w-4 h-4 text-amber-400" />
                    <span>View Receipt Record</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
