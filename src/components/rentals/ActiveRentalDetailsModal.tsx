import React from 'react';
import type { Rental } from '../../types/database';
import { formatDateTime, getOverdueInfo } from '../../lib/dateUtils';
import { LiveDurationBadge } from '../shared/LiveDurationBadge';

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
    <div className="fixed inset-0 bg-[#171a18aa] backdrop-blur-[5px] flex items-center justify-center p-[18px] z-50 overflow-y-auto">
      <div className="w-full max-w-[500px] max-h-[92vh] overflow-y-auto bg-[#fdfcf9] rounded-[20px] shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-[#ded9d0] flex flex-col">
        {/* Header */}
        <div className="p-[16px_20px] border-b border-[#ded9d0] flex justify-between items-center bg-[#fdfcf9] sticky top-0 z-10">
          <div>
            <div className="text-[10px] text-[#d35d2f] font-extrabold uppercase tracking-[0.8px]">
              Active Rental Record #{rental.rental_code}
            </div>
            <h2 className="m-0 font-['Manrope'] text-[20px] font-extrabold text-[#20221f]">
              {rental.customer_name}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="border-0 bg-[#ebe9e3] hover:bg-[#ded9d0] rounded-full w-[35px] h-[35px] text-[19px] flex items-center justify-center text-[#20221f]"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-[20px] space-y-4">
          <div className="bg-[#f6f3ed] p-3 rounded-[12px] border border-[#ded9d0] space-y-1 text-xs">
            <div className="text-[10px] uppercase font-extrabold text-[#74766f]">CUSTOMER DETAILS</div>
            <div className="text-base font-extrabold text-[#20221f]">{rental.customer_name}</div>
            <div className="font-bold text-[#74766f]">📞 {rental.customer_phone}</div>
            {rental.customer_address && <div className="text-[#74766f]">📍 {rental.customer_address}</div>}
          </div>

          <div className="bg-[#f6f3ed] p-3 rounded-[12px] border border-[#ded9d0] space-y-1 text-xs">
            <div className="text-[10px] uppercase font-extrabold text-[#74766f]">TOOL & MACHINE</div>
            <div className="text-base font-extrabold text-[#20221f]">{rental.tool_name}</div>
            <div className="text-[#d35d2f] font-mono font-extrabold text-sm">Machine Code: {rental.tool_code}</div>
          </div>

          <div className="bg-[#232621] text-white p-4 rounded-[13px] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9fa69e] uppercase font-bold">Status:</span>
              <span className="text-xs font-extrabold text-[#f2a36f]">
                {overdueInfo.isOverdue ? 'OVERDUE' : 'CURRENTLY OUT'}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#9fa69e] uppercase font-bold">Taken At:</span>
              <span className="font-bold">{formatDateTime(rental.started_at)}</span>
            </div>

            <div className="pt-2 border-t border-[#3a3f39] flex justify-between items-center">
              <span className="text-xs text-[#9fa69e] uppercase font-bold">Running Duration:</span>
              <LiveDurationBadge startedAt={rental.started_at} />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <a
              href={`tel:${rental.customer_phone}`}
              className="flex-1 h-[46px] border border-[#ded9d0] bg-white rounded-[11px] font-bold text-xs flex items-center justify-center gap-1 text-[#20221f]"
            >
              ☎ Call Customer
            </a>

            <button
              onClick={() => {
                onClose();
                onReturnTool(rental);
              }}
              type="button"
              className="flex-1 h-[46px] border-0 bg-[#2f8a61] text-white rounded-[11px] font-extrabold text-xs"
            >
              ↩ Return Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
