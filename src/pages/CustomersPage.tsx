import React, { useState, useEffect, useMemo } from 'react';
import { Search, Users, UserPlus, Phone, ChevronRight } from 'lucide-react';
import type { Customer, Rental } from '../types/database';
import { getCustomers, getRentals, subscribeToStore } from '../lib/storageService';
import { CustomerProfileModal } from '../components/customers/CustomerProfileModal';
import { AddCustomerModal } from '../components/customers/AddCustomerModal';
import { EmptyState } from '../components/shared/EmptyState';

interface CustomersPageProps {
  onOpenReceipt: (rental: Rental) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ onOpenReceipt }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => getCustomers());
  const [rentals, setRentals] = useState<Rental[]>(() => getRentals());

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    return subscribeToStore(() => {
      setCustomers(getCustomers());
      setRentals(getRentals());
    });
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.address.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-amber-600 font-black text-sm uppercase tracking-wider">
            <Users className="w-5 h-5 stroke-[2.5]" />
            <span>Customer Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Customers ({customers.length})
          </h2>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base rounded-xl shadow-md min-h-[48px] uppercase tracking-wide shrink-0 border-2 border-amber-300"
        >
          <UserPlus className="w-5 h-5 stroke-[2.5]" />
          <span>+ ADD CUSTOMER</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customer by name, phone number, or town..."
          className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-300 rounded-xl font-bold text-slate-900 focus:border-amber-500 outline-hidden shadow-xs text-base"
        />
      </div>

      {/* Customers List Grid */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={searchQuery ? `No customer matches "${searchQuery}"` : 'Add your first shop customer to start recording tool rentals.'}
          actionLabel="+ ADD NEW CUSTOMER"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCustomers.map((cust) => {
            const custRentals = rentals.filter((r) => r.customer_id === cust.id);
            const activeCount = custRentals.filter((r) => r.status === 'ACTIVE').length;
            const completedCount = custRentals.filter((r) => r.status === 'RETURNED').length;

            return (
              <div
                key={cust.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{cust.name}</h3>
                    <div className="text-sm font-bold text-slate-600">📞 {cust.phone}</div>
                    {cust.address && <div className="text-sm font-bold text-slate-500">📍 {cust.address}</div>}
                  </div>

                  <a
                    href={`tel:${cust.phone}`}
                    className="p-2.5 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 rounded-xl border border-emerald-300 transition-all shrink-0 flex items-center gap-1 text-xs font-black uppercase"
                  >
                    <Phone className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                    <span className="hidden sm:inline">CALL</span>
                  </a>
                </div>

                {/* Rental Counters */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center font-bold text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase">Total</span>
                    <span className="text-lg font-black text-slate-900">{custRentals.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase">Active</span>
                    <span className={`text-lg font-black ${activeCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                      {activeCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase">Completed</span>
                    <span className="text-lg font-black text-emerald-700">{completedCount}</span>
                  </div>
                </div>

                {/* View Profile Action */}
                <button
                  onClick={() => setSelectedCustomer(cust)}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all min-h-[44px] uppercase tracking-wide"
                >
                  <span>VIEW CUSTOMER HISTORY</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Modal */}
      <CustomerProfileModal
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        onOpenReceipt={onOpenReceipt}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(created) => {
          setSelectedCustomer(created);
        }}
      />
    </div>
  );
};
