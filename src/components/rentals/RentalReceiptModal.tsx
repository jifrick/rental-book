import React from 'react';
import { X, Printer, Wrench } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-slate-900 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="no-print bg-slate-900 text-white p-4 flex items-center justify-between border-b-2 border-slate-800">
          <h2 className="text-lg font-black uppercase tracking-wide text-amber-400">
            DIGITAL RENTAL RECEIPT
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6 text-slate-900" id="printable-receipt">
          {/* Shop Brand Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="inline-flex items-center gap-2 text-xl font-black uppercase text-slate-900">
              <Wrench className="w-6 h-6 text-amber-600 shrink-0" />
              <span>{settings.shop_name}</span>
            </div>
            <p className="text-xs font-bold text-slate-600">{settings.address}</p>
            <p className="text-xs font-bold text-slate-600">Ph: {settings.phone}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-amber-400 font-mono font-black text-sm rounded-lg">
              Rental #{rental.rental_code}
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-1 text-sm font-bold">
            <div className="text-xs font-black uppercase text-slate-500 mb-1">CUSTOMER DETAILS</div>
            <div className="text-base font-black text-slate-900">{rental.customer_name}</div>
            <div>Phone: {rental.customer_phone}</div>
            {rental.customer_address && <div>Address: {rental.customer_address}</div>}
          </div>

          {/* Tool Taken & Timestamps */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-300 space-y-2 text-sm font-bold">
            <div className="text-xs font-black uppercase text-slate-500">TOOL RENTED</div>
            <div className="flex items-center justify-between text-base">
              <span className="font-black text-slate-900">{rental.tool_name}</span>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-950 font-mono font-black text-sm rounded-md border border-amber-300">
                {rental.tool_code}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block">Taken:</span>
                <span className="font-bold text-slate-900">{formatDateTime(rental.started_at)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Returned:</span>
                <span className="font-bold text-slate-900">{formatDateTime(rental.returned_at)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 uppercase font-black">Total Duration:</span>
              <span className="font-mono font-black text-slate-900 text-sm bg-slate-200 px-2 py-0.5 rounded-md">
                {duration.formatted}
              </span>
            </div>
          </div>

          {/* Charges Breakdown */}
          <div className="space-y-1.5 text-sm font-bold border-t-2 border-slate-900 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Rental Charge:</span>
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

            <div className="flex justify-between text-xl font-black text-slate-900 border-t-2 border-slate-900 pt-2 mt-2">
              <span>TOTAL AMOUNT:</span>
              <span>₹{rental.total_amount || 0}</span>
            </div>

            <div className="flex justify-between text-xs font-black text-slate-600 pt-1">
              <span>Payment Status: <strong className="text-emerald-700">{rental.payment_status || 'PAID'} ({rental.payment_method || 'CASH'})</strong></span>
              <span>Condition: <strong className="text-slate-900">{rental.return_condition || 'GOOD'}</strong></span>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 border-t border-dashed pt-4 font-bold">
            Thank you for renting from {settings.shop_name}!
          </div>
        </div>

        {/* Footer Actions */}
        <div className="no-print bg-slate-100 p-4 border-t-2 border-slate-200 flex gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-base shadow-md uppercase min-h-[48px]"
          >
            <Printer className="w-5 h-5 stroke-[2.5]" />
            <span>PRINT RECEIPT</span>
          </button>
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-base hover:bg-slate-800 min-h-[48px] uppercase"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
