import React, { useState, useEffect } from 'react';
import type { Rental, ToolCondition, PaymentMethod, PaymentStatus } from '../../types/database';
import { formatDateTime, calculateDuration } from '../../lib/dateUtils';
import { completeReturn } from '../../lib/storageService';
import { useAuth } from '../../context/AuthContext';

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
  const { currentShopId } = useAuth();
  // Auto Return Time & Duration
  const [returnTimestamp, setReturnTimestamp] = useState<string>(new Date().toISOString());

  // Return Form State
  const [condition, setCondition] = useState<ToolCondition>('GOOD');
  const [rentalAmount, setRentalAmount] = useState<string>('350');
  const [lateFee, setLateFee] = useState<string>('0');
  const [damageFee, setDamageFee] = useState<string>('0');
  const [otherFee, setOtherFee] = useState<string>('0');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');

  const [step, setStep] = useState<1 | 2>(1);
  const [completedRental, setCompletedRental] = useState<Rental | null>(null);

  useEffect(() => {
    if (isOpen && rental) {
      setReturnTimestamp(new Date().toISOString());
      setStep(1);
      setCondition('GOOD');
      setRentalAmount('350');
      setLateFee('0');
      setDamageFee('0');
      setOtherFee('0');
      setPaymentMethod('CASH');
      setPaymentStatus('PAID');
    }
  }, [isOpen, rental]);

  if (!isOpen || !rental) return null;

  const duration = calculateDuration(rental.started_at, returnTimestamp);

  // Calculated total sum
  const numRent = parseFloat(rentalAmount) || 0;
  const numLate = parseFloat(lateFee) || 0;
  const numDamage = parseFloat(damageFee) || 0;
  const numOther = parseFloat(otherFee) || 0;
  const totalSum = numRent + numLate + numDamage + numOther;

  const handleCompleteReturn = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = completeReturn(
        rental.id,
        {
          returned_at: returnTimestamp,
          return_condition: condition,
          rental_amount: numRent,
          late_fee: numLate,
          damage_fee: numDamage,
          other_fee: numOther,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          amount_paid: paymentStatus === 'PAID' ? totalSum : 0,
        },
        currentShopId
      );

      setCompletedRental(updated);
      onSuccess(updated);
      setStep(2);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error completing return');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#171a18aa] backdrop-blur-[5px] flex items-center justify-center p-[18px] z-50 overflow-y-auto">
      <div className="w-full max-w-[590px] max-h-[92vh] overflow-y-auto bg-[#fdfcf9] rounded-[20px] shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-[#ded9d0] flex flex-col">
        {/* Header */}
        <div className="p-[20px_22px] border-b border-[#ded9d0] flex justify-between items-center bg-[#fdfcf9] sticky top-0 z-10">
          <h2 className="m-0 font-['Manrope'] text-[21px] font-extrabold text-[#20221f]">Return Tool</h2>
          <button
            onClick={onClose}
            type="button"
            className="border-0 bg-[#ebe9e3] hover:bg-[#ded9d0] rounded-full w-[35px] h-[35px] text-[19px] flex items-center justify-center text-[#20221f]"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-[20px_22px] flex-1 space-y-4">
          {step === 1 ? (
            <form onSubmit={handleCompleteReturn} className="space-y-4">
              <div className="text-[10px] text-[#74766f] font-extrabold uppercase tracking-[0.8px]">
                Active rental
              </div>
              <h3 className="font-['Manrope'] text-[25px] font-extrabold m-0 text-[#20221f]">
                {rental.customer_name}
              </h3>

              {/* Time Return Box */}
              <div className="bg-[#f1eee8] border border-[#ded9d0] rounded-[13px] p-[15px]">
                <b className="text-[14px] text-[#20221f] block font-['Manrope']">
                  {rental.tool_name} · {rental.tool_code}
                </b>
                <div className="flex justify-between text-[#74766f] text-[10px] mt-[12px] font-bold">
                  <span>Taken<br /><b className="text-[#20221f] text-[11px]">{formatDateTime(rental.started_at)}</b></span>
                  <span className="text-right">Returned<br /><b className="text-[#20221f] text-[11px]">{formatDateTime(returnTimestamp)}</b></span>
                </div>
                <div className="text-center font-['Manrope'] text-[33px] font-extrabold tracking-[-0.5px] my-[12px] text-[#20221f]">
                  {duration.formatted}
                </div>
                <div className="text-center text-[#74766f] text-[10px] font-extrabold tracking-widest uppercase">
                  TOTAL RENTAL TIME
                </div>
              </div>

              {/* Condition Options */}
              <div>
                <div className="font-['Manrope'] text-[16px] font-extrabold text-[#20221f] mb-2">
                  Tool condition
                </div>
                <div className="grid grid-cols-2 gap-[8px]">
                  {(
                    [
                      { id: 'GOOD', label: '✓ Good' },
                      { id: 'MINOR_DAMAGE', label: 'Minor Damage' },
                      { id: 'DAMAGED', label: 'Damaged' },
                      { id: 'NEEDS_MAINTENANCE', label: 'Needs Service' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCondition(opt.id as ToolCondition)}
                      className={`border rounded-[10px] p-[13px] text-left text-[12px] font-extrabold transition-all cursor-pointer ${
                        condition === opt.id
                          ? 'border-[#2f8a61] bg-[#eaf6f0] text-[#176d49]'
                          : 'border-[#ded9d0] bg-white text-[#20221f] hover:bg-[#f6f3ed]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rent Amount */}
              <div>
                <div className="font-['Manrope'] text-[16px] font-extrabold text-[#20221f] mb-2">
                  Rent amount (₹)
                </div>
                <input
                  type="number"
                  required
                  value={rentalAmount}
                  onChange={(e) => setRentalAmount(e.target.value)}
                  className="w-full h-[54px] border border-[#ded9d0] rounded-[11px] text-center text-[22px] font-extrabold outline-hidden bg-white text-[#20221f]"
                  placeholder="₹ 0"
                />

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#74766f] uppercase block">Late Fee</label>
                    <input
                      type="number"
                      value={lateFee}
                      onChange={(e) => setLateFee(e.target.value)}
                      className="w-full h-[38px] border border-[#ded9d0] rounded-[8px] text-center text-sm font-bold bg-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#74766f] uppercase block">Damage Fee</label>
                    <input
                      type="number"
                      value={damageFee}
                      onChange={(e) => setDamageFee(e.target.value)}
                      className="w-full h-[38px] border border-[#ded9d0] rounded-[8px] text-center text-sm font-bold bg-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#74766f] uppercase block">Other Fee</label>
                    <input
                      type="number"
                      value={otherFee}
                      onChange={(e) => setOtherFee(e.target.value)}
                      className="w-full h-[38px] border border-[#ded9d0] rounded-[8px] text-center text-sm font-bold bg-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Selectors */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="text-[10px] font-extrabold text-[#74766f] uppercase block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full h-[40px] border border-[#ded9d0] rounded-[9px] bg-white text-xs font-bold px-2"
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI / GPay</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-[#74766f] uppercase block mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full h-[40px] border border-[#ded9d0] rounded-[9px] bg-white text-xs font-bold px-2"
                  >
                    <option value="PAID">PAID FULL</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-[8px] mt-[16px]">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-[49px] border border-[#ded9d0] bg-white rounded-[11px] font-bold text-sm text-[#20221f]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[49px] border-0 bg-[#2f8a61] text-white rounded-[11px] font-extrabold text-sm shadow-xs"
                >
                  Complete Return
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: CONFIRMATION */
            <div className="text-center py-[30px] px-[20px]">
              <div className="w-[60px] h-[60px] rounded-full bg-[#e8f5ee] text-[#2f8a61] grid place-items-center mx-auto mb-[14px] text-[29px] font-extrabold">
                ✓
              </div>
              <h2 className="margin-0 font-['Manrope'] text-[25px] font-extrabold text-[#20221f]">
                Return Completed
              </h2>
              <p className="text-[#74766f] text-[12px] mt-1">
                Return completed and saved permanently.
              </p>

              {completedRental && (
                <div className="bg-[#f1eee8] border border-[#ded9d0] rounded-[12px] p-[13px] my-[16px] space-y-1 text-left max-w-sm mx-auto">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#74766f]">Customer</span>
                    <b className="text-[#20221f]">{completedRental.customer_name}</b>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#74766f]">Tool & Machine</span>
                    <b className="text-[#20221f]">{completedRental.tool_name} ({completedRental.tool_code})</b>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#74766f]">Duration</span>
                    <b className="text-[#20221f]">{duration.formatted}</b>
                  </div>
                  <div className="flex justify-between text-[13px] pt-1 border-t border-[#ded9d0]">
                    <span className="text-[#74766f]">Total Rent</span>
                    <b className="text-[#2f8a61] font-mono text-lg font-extrabold">₹{completedRental.total_amount}</b>
                  </div>
                </div>
              )}

              <div className="flex gap-[8px] mt-[16px] max-w-sm mx-auto">
                {completedRental && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenReceipt(completedRental);
                      onClose();
                    }}
                    className="flex-1 h-[49px] border border-[#ded9d0] bg-white rounded-[11px] font-extrabold text-xs text-[#20221f]"
                  >
                    View Receipt
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-[49px] border-0 bg-[#232621] text-white rounded-[11px] font-extrabold text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
