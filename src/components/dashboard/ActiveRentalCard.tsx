import React from 'react';
import { Phone, CornerDownLeft, Calendar, User, Wrench, AlertCircle } from 'lucide-react';
import type { Rental } from '../../types/database';
import { formatDateTime, getOverdueInfo } from '../../lib/dateUtils';
import { LiveDurationBadge } from '../shared/LiveDurationBadge';
import { StatusBadge } from '../shared/StatusBadge';

interface ActiveRentalCardProps {
  rental: Rental;
  onReturnTool: (rental: Rental) => void;
  onSelectRental: (rental: Rental) => void;
}

export const ActiveRentalCard: React.FC<ActiveRentalCardProps> = ({
  rental,
  onReturnTool,
  onSelectRental,
}) => {
  const overdueInfo = getOverdueInfo(rental.expected_return_at, rental.status);

  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border-2 ${
        overdueInfo.isOverdue
          ? 'border-red-500 shadow-md ring-2 ring-red-200'
          : 'border-amber-400 shadow-sm hover:shadow-md'
      } transition-all space-y-4`}
    >
      {/* Top Bar: Customer & Status */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div
          onClick={() => onSelectRental(rental)}
          className="cursor-pointer group flex-1"
        >
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-500 shrink-0" />
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
              {rental.customer_name}
            </h3>
          </div>
          <p className="text-sm font-bold text-slate-500 ml-7">
            {rental.customer_phone} {rental.customer_address ? `• ${rental.customer_address}` : ''}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge status={overdueInfo.isOverdue ? 'OVERDUE' : 'RENTED'} size="sm" />
          {overdueInfo.isOverdue && (
            <span className="inline-flex items-center gap-1 text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
              <AlertCircle className="w-3.5 h-3.5" />
              {overdueInfo.lateText}
            </span>
          )}
        </div>
      </div>

      {/* Middle Bar: Tool Info & Timestamps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4 text-amber-600" />
            <span>TOOL TAKEN</span>
          </div>
          <div className="text-lg font-black text-slate-900">
            {rental.tool_name}
          </div>
          <div className="inline-block mt-1 px-2.5 py-0.5 bg-amber-100 text-amber-950 font-black font-mono text-sm rounded-md border border-amber-300">
            ID: {rental.tool_code}
          </div>
        </div>

        <div className="flex flex-col justify-between sm:items-end">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-black uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>TAKEN TIME</span>
            </div>
            <div className="text-sm font-bold text-slate-800">
              {formatDateTime(rental.started_at)}
            </div>
          </div>

          <div className="mt-2 sm:mt-0 flex items-center gap-2">
            <span className="text-xs font-black uppercase text-slate-500">Duration:</span>
            <LiveDurationBadge startedAt={rental.started_at} />
          </div>
        </div>
      </div>

      {/* Action Buttons Area */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
        {/* Primary Action Button: RETURN TOOL */}
        <button
          onClick={() => onReturnTool(rental)}
          type="button"
          className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-xl shadow-md hover:shadow-lg active:scale-98 transition-all min-h-[50px] border-2 border-emerald-400 uppercase tracking-wide"
        >
          <CornerDownLeft className="w-6 h-6 stroke-[3]" />
          <span>RETURN TOOL</span>
        </button>

        {/* Secondary Action Button: CALL CUSTOMER */}
        <a
          href={`tel:${rental.customer_phone}`}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-xl transition-all min-h-[50px] border-2 border-slate-700 shrink-0"
        >
          <Phone className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
          <span className="sm:hidden">CALL</span>
          <span className="hidden sm:inline">CALL CUSTOMER</span>
        </a>
      </div>
    </div>
  );
};
