import React, { useState } from 'react';
import { X, UserPlus, ShieldAlert } from 'lucide-react';
import { addCustomer } from '../../lib/storageService';
import { useAuth } from '../../context/AuthContext';
import type { Customer } from '../../types/database';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (cust: Customer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentShopId } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const created = addCustomer({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
      }, currentShopId);
      onSuccess(created);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error creating customer');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-amber-500 overflow-hidden flex flex-col">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b-2 border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black uppercase text-white">Add New Customer</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-900 font-bold text-sm rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">Customer Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer Name"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9847123456"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">Address / Town</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Panamaram, Wayanad"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-800 uppercase mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Electrician contractor"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-bold text-slate-900 text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg rounded-xl shadow-lg min-h-[52px] uppercase tracking-wide border-2 border-amber-300"
          >
            SAVE CUSTOMER
          </button>
        </form>
      </div>
    </div>
  );
};
