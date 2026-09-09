import React, { useState } from 'react';
import { X, CornerDownLeft, Clock, AlertTriangle, CheckCircle, Receipt } from 'lucide-react';
import type { Rental, ToolCondition, PaymentMethod, PaymentStatus } from '../../types/database';
import { formatDateTime, calculateDuration } from '../../lib/dateUtils';
import { completeReturn } from '../../lib/storageService';

interface ReturnToolModalProps {
  rental: Rental | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (returnedRental: Rental) => void;
  onOpenReceipt: (rental: Rental) => void;
}

export const ReturnToolModal: React.FC<ReturnToolModalProps> = ({
  rental,
  isOpen,
  onClose,
  onSuccess,
  onOpenReceipt,
}) => {
  if (!isOpen || !rental) return null;

  // Auto Return Time & Duration
  const [returnTimestamp] = useState<string>(new Date().toISOString());
  const duration = calculateDuration(rental.started_at, returnTimestamp);

  // Return Form State
  const [condition, setCondition] = useState<ToolCondition>('GOOD');
  const [rentalAmount, setRentalAmount] = useState<string>('350');
  const [lateFee, setLateFee] = useState<string>('0');
  const [damageFee, setDamageFee] = useState<string>('0');
  const [otherFee, setOtherFee] = useState<string>('0');
  const [damageNotes, setDamageNotes] = useState<string>('');
  const [returnNotes] = useState<string>('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');

  // Step 1 = Form, Step 2 = Success Confirmation
  const [step, setStep] = useState<1 | 2>(1);
  const [completedRental, setCompletedRental] = useState<Rental | null>(null);

  // Calculated total sum
  const numRent = parseFloat(rentalAmount) || 0;
  const numLate = parseFloat(lateFee) || 0;
  const numDamage = parseFloat(damageFee) || 0;
  const numOther = parseFloat(otherFee) || 0;
  const totalSum = numRent + numLate + numDamage + numOther;

  const handleCompleteReturn = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = completeReturn(rental.id, {
        returned_at: returnTimestamp,
        return_condition: condition,
        rental_amount: numRent,
        late_fee: numLate,
        damage_fee: numDamage,
        other_fee: numOther,
        damage_notes: damageNotes,
        notes: returnNotes,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        amount_paid: paymentStatus === 'PAID' ? totalSum : 0,
      });

      setCompletedRental(updated);
      onSuccess(updated);
      setStep(2); // Success step
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error completing return');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-4 border-emerald-500 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center">
              <CornerDownLeft className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                RETURN TOOL ({rental.tool_code})
              </h2>
              <p className="text-xs text-emerald-400 font-bold">
                Customer: {rental.customer_name} ({rental.rental_code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {step === 1 ? (
            <form onSubmit={handleCompleteReturn} className="space-y-4">
              {/* Automatic Timestamps & Calculated Duration Box */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-amber-400 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>AUTOMATIC DURATION CALCULATED</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black font-mono text-base rounded-lg shadow-sm">
                    {duration.formatted}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-400 text-xs block font-bold">Taken Time:</span>
                    <span className="font-bold text-slate-200">{formatDateTime(rental.started_at)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block font-bold">Returned Time:</span>
                    <span className="font-bold text-emerald-400">{formatDateTime(returnTimestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Tool Return Condition */}
              <div>
                <label className="block text-sm font-black text-slate-900 uppercase tracking-wide mb-1.5">
                  Tool Condition *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'GOOD', label: 'GOOD', color: 'bg-emerald-600' },
                      { id: 'MINOR_DAMAGE', label: 'MINOR DAMAGE', color: 'bg-blue-600' },
                      { id: 'DAMAGED', label: 'DAMAGED', color: 'bg-red-600' },
                      { id: 'NEEDS_MAINTENANCE', label: 'MAINTENANCE', color: 'bg-amber-600' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCondition(opt.id as ToolCondition)}
                      className={`py-3 px-2 rounded-xl font-black text-xs sm:text-sm border-2 transition-all min-h-[48px] ${
                        condition === opt.id
                          ? `${opt.color} text-white border-slate-900 shadow-md ring-2 ring-slate-400`
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {(condition === 'DAMAGED' || condition === 'NEEDS_MAINTENANCE') && (
                  <div className="mt-2.5 p-3 bg-red-50 rounded-xl border border-red-300 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-red-700 uppercase">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Tool will be marked under MAINTENANCE in shop catalog</span>
                    </div>
                    <input
                      type="text"
                      value={damageNotes}
                      onChange={(e) => setDamageNotes(e.target.value)}
                      placeholder="Enter damage details or repair required..."
                      className="w-full px-3 py-2 bg-white rounded-lg border border-red-300 font-bold text-sm text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Pricing Section (Owner enters rent amount) */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-3">
                <div className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  ENTER RENTAL CHARGES (₹)
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">RENT AMOUNT *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 font-black text-slate-500">₹</span>
                      <input
                        type="number"
                        required
                        value={rentalAmount}
                        onChange={(e) => setRentalAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-slate-300 font-black text-lg text-slate-900"
                        placeholder="350"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">LATE FEE</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 font-black text-slate-500">₹</span>
                      <input
                        type="number"
                        value={lateFee}
                        onChange={(e) => setLateFee(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-lg text-slate-900"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">DAMAGE FEE</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 font-black text-slate-500">₹</span>
                      <input
                        type="number"
                        value={damageFee}
                        onChange={(e) => setDamageFee(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-lg text-slate-900"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">OTHER FEE</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 font-black text-slate-500">₹</span>
                      <input
                        type="number"
                        value={otherFee}
                        onChange={(e) => setOtherFee(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-lg text-slate-900"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Calculated Amount */}
                <div className="pt-2 border-t flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-300">
                  <span className="font-black text-slate-900 uppercase">TOTAL RENT AMOUNT</span>
                  <span className="text-2xl font-black text-emerald-700">₹{totalSum.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-slate-900 bg-white"
                  >
                    <option value="CASH">💵 Cash</option>
                    <option value="UPI">📱 UPI / GPay</option>
                    <option value="OTHER">💳 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 font-bold text-slate-900 bg-white"
                  >
                    <option value="PAID">PAID FULL</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              {/* COMPLETE RETURN BUTTON */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl active:scale-98 transition-all border-2 border-emerald-400 uppercase tracking-wide min-h-[56px] mt-4"
              >
                <CornerDownLeft className="w-7 h-7 stroke-[3]" />
                <span>COMPLETE RETURN NOW</span>
              </button>
            </form>
          ) : (
            /* STEP 2: RETURN SUCCESS CONFIRMATION */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg border-4 border-emerald-400">
                <CheckCircle className="w-12 h-12 stroke-[2.5]" />
              </div>

              <h3 className="text-3xl font-black text-slate-900 uppercase">
                RETURN COMPLETED ✓
              </h3>

              {completedRental && (
                <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 text-left max-w-md mx-auto space-y-2.5 font-bold">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500 text-sm">Customer:</span>
                    <span className="text-slate-900 text-lg">{completedRental.customer_name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500 text-sm">Tool & Code:</span>
                    <span className="text-slate-900 text-lg">
                      {completedRental.tool_name} ({completedRental.tool_code})
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500 text-sm">Duration:</span>
                    <span className="text-slate-900 text-lg">{duration.formatted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Total Rent Charged:</span>
                    <span className="text-emerald-700 text-2xl font-black">₹{completedRental.total_amount}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {completedRental && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenReceipt(completedRental);
                      onClose();
                    }}
                    className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg rounded-xl shadow-lg flex items-center justify-center gap-2 min-h-[48px] uppercase"
                  >
                    <Receipt className="w-5 h-5 stroke-[2.5]" />
                    <span>VIEW RECORD / RECEIPT</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black text-lg rounded-xl shadow-lg min-h-[48px] uppercase"
                >
                  DONE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
