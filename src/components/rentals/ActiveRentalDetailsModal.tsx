import React from 'react';
import { X, Phone, CornerDownLeft, User, Wrench } from 'lucide-react';
import type { Rental } from '../../types/database';
import { formatDateTime, getOverdueInfo } from '../../lib/dateUtils';
import { LiveDurationBadge } from '../shared/LiveDurationBadge';
import { StatusBadge } from '../shared/StatusBadge';

interface ActiveRentalDetailsModalProps {
  rental: Rental | null;
  isOpen: boolean;
  onClose: () => void;
  onReturnTool: (rental: Rental) => void;
}

export const ActiveRentalDetailsModal: React.FC<ActiveRentalDetailsModalProps> = ({
  rental,
  isOpen,
  onClose,
  onReturnTool,
}) => {
  if (!isOpen || !rental) return null;

  const overdueInfo = getOverdueInfo(rental.expected_return_at, rental.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-amber-500 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-800">
          <div>
            <div className="text-amber-400 text-xs font-black uppercase tracking-widest">
              ACTIVE RENTAL RECORD #{rental.rental_code}
            </div>
            <h2 className="text-xl font-black text-white uppercase">{rental.customer_name}</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-900">
          {/* Customer Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
                <User className="w-5 h-5 text-amber-600 shrink-0" />
                <span>CUSTOMER INFO</span>
              </div>
              <a
                href={`tel:${rental.customer_phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                <Phone className="w-4 h-4 stroke-[2.5]" />
                <span>CALL CUSTOMER</span>
              </a>
            </div>

            <div className="text-sm font-bold space-y-1">
              <div>Name: <strong className="text-base text-slate-900">{rental.customer_name}</strong></div>
              <div>Phone: <strong className="text-slate-900 font-mono">{rental.customer_phone}</strong></div>
              {rental.customer_address && <div>Address: {rental.customer_address}</div>}
            </div>
          </div>

          {/* Tool Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
                <Wrench className="w-5 h-5 text-amber-600 shrink-0" />
                <span>TOOL INFO</span>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-950 font-mono font-black text-sm rounded-lg border border-amber-300">
                ID: {rental.tool_code}
              </span>
            </div>

            <div className="text-base font-black text-slate-900">{rental.tool_name}</div>
          </div>

          {/* Timing & Live Duration */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-amber-400 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">STATUS</span>
              <StatusBadge status={overdueInfo.isOverdue ? 'OVERDUE' : 'RENTED'} size="sm" />
            </div>

            <div className="space-y-1 text-sm font-bold">
              <div className="flex justify-between">
                <span className="text-slate-400">Started At:</span>
                <span>{formatDateTime(rental.started_at)}</span>
              </div>
              {rental.expected_return_at && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Return:</span>
                  <span className={overdueInfo.isOverdue ? 'text-red-400 font-black' : 'text-slate-200'}>
                    {formatDateTime(rental.expected_return_at)}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase">Live Duration:</span>
              <LiveDurationBadge startedAt={rental.started_at} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onReturnTool(rental);
              }}
              type="button"
              className="w-full flex items-center justify-center gap-2.5 px-5 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl rounded-2xl shadow-xl active:scale-98 transition-all uppercase min-h-[56px] border-2 border-emerald-400"
            >
              <CornerDownLeft className="w-7 h-7 stroke-[3]" />
              <span>RETURN TOOL NOW</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
