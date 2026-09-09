import React from 'react';
import { X, Phone, User, History, Receipt } from 'lucide-react';
import type { Customer, Rental } from '../../types/database';
import { getRentals } from '../../lib/storageService';
import { formatDateTime } from '../../lib/dateUtils';
import { StatusBadge } from '../shared/StatusBadge';

interface CustomerProfileModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt: (rental: Rental) => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({
  customer,
  isOpen,
  onClose,
  onOpenReceipt,
}) => {
  if (!isOpen || !customer) return null;

  const allRentals = getRentals();
  const customerRentals = allRentals.filter((r) => r.customer_id === customer.id);

  const activeCount = customerRentals.filter((r) => r.status === 'ACTIVE').length;
  const completedCount = customerRentals.filter((r) => r.status === 'RETURNED').length;
  const totalPaid = customerRentals.reduce((sum, r) => sum + (r.total_amount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-4 border-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
              <User className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{customer.name}</h2>
              <p className="text-xs text-amber-400 font-bold">Customer Profile & Rental Log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-900">
          {/* Contact Box & Call Trigger */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xl font-black text-slate-900">{customer.name}</div>
              <div className="text-sm font-bold text-slate-600">📞 {customer.phone}</div>
              {customer.address && <div className="text-sm font-bold text-slate-600">📍 {customer.address}</div>}
            </div>

            <a
              href={`tel:${customer.phone}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-xl shadow-md uppercase min-h-[48px] border-2 border-emerald-400 shrink-0"
            >
              <Phone className="w-5 h-5 stroke-[2.5]" />
              <span>CALL CUSTOMER</span>
            </a>
          </div>

          {/* Metrics Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300">
              <div className="text-2xl font-black text-slate-900">{customerRentals.length}</div>
              <div className="text-[11px] font-bold uppercase text-slate-600">Total Rentals</div>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl border border-amber-300">
              <div className="text-2xl font-black text-amber-900">{activeCount}</div>
              <div className="text-[11px] font-bold uppercase text-amber-900">Active Now</div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-300">
              <div className="text-2xl font-black text-emerald-900">{completedCount}</div>
              <div className="text-[11px] font-bold uppercase text-emerald-900">Completed</div>
            </div>
            <div className="p-3 bg-slate-900 text-amber-400 rounded-xl border border-slate-800">
              <div className="text-xl font-black">₹{totalPaid}</div>
              <div className="text-[11px] font-bold uppercase text-slate-400">Total Paid</div>
            </div>
          </div>

          {/* Customer History Log */}
          <div className="space-y-2 pt-2">
            <h3 className="text-base font-black text-slate-900 uppercase flex items-center gap-2">
              <History className="w-5 h-5 text-amber-600" />
              <span>Rental History Log ({customerRentals.length})</span>
            </h3>

            {customerRentals.length === 0 ? (
              <div className="text-center py-6 text-slate-500 font-bold">
                No rentals recorded yet for {customer.name}.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {customerRentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="p-3 bg-white rounded-xl border-2 border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-base font-black text-slate-900">
                        {rental.tool_name} ({rental.tool_code})
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        Taken: {formatDateTime(rental.started_at)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={rental.status} size="sm" />
                      <button
                        onClick={() => onOpenReceipt(rental)}
                        type="button"
                        className="p-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
