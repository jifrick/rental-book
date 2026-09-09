import React from 'react';
import type { Rental } from '../../types/database';
import { formatDateTime, calculateDuration } from '../../lib/dateUtils';
import { getSettings } from '../../lib/storageService';

interface RentalReceiptModalProps {
  rental: Rental | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RentalReceiptModal: React.FC<RentalReceiptModalProps> = ({
  rental,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !rental) return null;

  const settings = getSettings();
  const duration = calculateDuration(rental.started_at, rental.returned_at);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-[#171a18aa] backdrop-blur-[5px] flex items-center justify-center p-[18px] z-50 overflow-y-auto">
      <div className="w-full max-w-[500px] max-h-[92vh] overflow-y-auto bg-[#fdfcf9] rounded-[20px] shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-[#ded9d0] flex flex-col">
        {/* Header */}
        <div className="no-print p-[16px_20px] border-b border-[#ded9d0] flex justify-between items-center bg-[#fdfcf9] sticky top-0 z-10">
          <h2 className="m-0 font-['Manrope'] text-[18px] font-extrabold text-[#d35d2f]">
            Rental Receipt #{rental.rental_code}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="border-0 bg-[#ebe9e3] hover:bg-[#ded9d0] rounded-full w-[35px] h-[35px] text-[19px] flex items-center justify-center text-[#20221f]"
          >
            ×
          </button>
        </div>

        {/* Printable Body */}
        <div className="p-6 bg-[#fdfcf9] text-[#20221f] space-y-4 font-sans" id="printable-receipt">
          {/* Shop Header */}
          <div className="text-center border-b border-[#ded9d0] pb-4 space-y-1">
            <h3 className="font-['Manrope'] text-xl font-extrabold text-[#20221f] uppercase m-0">
              {settings.shop_name}
            </h3>
            <p className="text-xs text-[#74766f] font-medium m-0">{settings.address}</p>
            <p className="text-xs text-[#74766f] font-medium m-0">Ph: {settings.phone}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-[#232621] text-[#f2a36f] font-mono font-bold text-xs rounded-md">
              Receipt #{rental.rental_code}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-[#f6f3ed] p-3 rounded-[11px] border border-[#ded9d0] space-y-1 text-xs font-bold">
            <div className="text-[9px] uppercase font-extrabold text-[#74766f]">CUSTOMER DETAILS</div>
            <div className="text-sm font-extrabold text-[#20221f]">{rental.customer_name}</div>
            <div>Phone: {rental.customer_phone}</div>
            {rental.customer_address && <div>Address: {rental.customer_address}</div>}
          </div>

          {/* Tool Taken */}
          <div className="bg-[#f6f3ed] p-3 rounded-[11px] border border-[#ded9d0] space-y-2 text-xs font-bold">
            <div className="text-[9px] uppercase font-extrabold text-[#74766f]">TOOL RENTED</div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-extrabold text-[#20221f]">{rental.tool_name}</span>
              <span className="font-mono font-bold text-[#d35d2f] bg-[#fff0e8] px-2 py-0.5 rounded border border-[#fcd5c5]">
                {rental.tool_code}
              </span>
            </div>

            <div className="pt-2 border-t border-[#ded9d0] grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#74766f] block font-normal">Taken:</span>
                <span>{formatDateTime(rental.started_at)}</span>
              </div>
              <div>
                <span className="text-[#74766f] block font-normal">Returned:</span>
                <span>{formatDateTime(rental.returned_at)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#ded9d0] flex justify-between items-center text-[11px]">
              <span className="text-[#74766f] font-bold uppercase">Total Duration:</span>
              <span className="font-mono font-extrabold text-sm">{duration.formatted}</span>
            </div>
          </div>

          {/* Charge Breakdown */}
          <div className="space-y-1 text-xs font-bold pt-2 border-t border-[#20221f]">
            <div className="flex justify-between">
              <span className="text-[#74766f]">Rental Charge:</span>
              <span>₹{rental.rental_amount || 0}</span>
            </div>
            {rental.late_fee > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Late Fee:</span>
                <span>₹{rental.late_fee}</span>
              </div>
            )}
            {rental.damage_fee > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Damage Fee:</span>
                <span>₹{rental.damage_fee}</span>
              </div>
            )}
            {rental.other_fee > 0 && (
              <div className="flex justify-between">
                <span>Other Fee:</span>
                <span>₹{rental.other_fee}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-['Manrope'] font-extrabold text-[#20221f] border-t border-[#20221f] pt-2 mt-2">
              <span>TOTAL AMOUNT:</span>
              <span>₹{rental.total_amount || 0}</span>
            </div>

            <div className="flex justify-between text-[11px] text-[#74766f] pt-1">
              <span>Payment: <strong className="text-[#2f8a61]">{rental.payment_status || 'PAID'} ({rental.payment_method || 'CASH'})</strong></span>
              <span>Condition: <strong className="text-[#20221f]">{rental.return_condition || 'GOOD'}</strong></span>
            </div>
          </div>

          <div className="text-center text-[11px] text-[#74766f] border-t border-dashed border-[#ded9d0] pt-3 font-medium">
            Thank you for renting from {settings.shop_name}!
          </div>
        </div>

        {/* Footer Actions */}
        <div className="no-print p-4 bg-[#f6f3ed] border-t border-[#ded9d0] flex gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="flex-1 h-[44px] bg-[#d35d2f] hover:bg-[#c25227] text-white font-extrabold rounded-[11px] text-xs uppercase"
          >
            🖨 Print Receipt
          </button>
          <button
            onClick={onClose}
            type="button"
            className="h-[44px] px-6 bg-[#232621] hover:bg-[#353a34] text-white font-extrabold rounded-[11px] text-xs uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
