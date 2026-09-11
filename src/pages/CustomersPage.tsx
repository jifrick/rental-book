import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { Customer, Rental } from '../types/database';
import { getCustomers, getRentals, subscribeToStore } from '../lib/storageService';
import { useAuth } from '../context/AuthContext';
import { CustomerProfileModal } from '../components/customers/CustomerProfileModal';
import { AddCustomerModal } from '../components/customers/AddCustomerModal';
import { EmptyState } from '../components/shared/EmptyState';

interface CustomersPageProps {
  onOpenReceipt: (rental: Rental) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ onOpenReceipt }) => {
  const { currentShopId } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>(() => getCustomers(currentShopId));
  const [rentals, setRentals] = useState<Rental[]>(() => getRentals(currentShopId));

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const refreshData = () => {
    setCustomers(getCustomers(currentShopId));
    setRentals(getRentals(currentShopId));
  };

  useEffect(() => {
    refreshData();
    return subscribeToStore(refreshData);
  }, [currentShopId]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.address.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ded9d0] pb-4">
        <div>
          <h1 className="font-['Manrope'] text-[24px] sm:text-[29px] font-extrabold text-[#20221f] m-0">
            Customer Directory
          </h1>
          <p className="text-[#74766f] text-[13px] mt-1 font-medium">
            {customers.length} customers registered in shop ledger.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          type="button"
          className="inline-flex items-center justify-center gap-2 h-[44px] bg-[#d35d2f] hover:bg-[#c25227] text-white font-extrabold text-xs rounded-[11px] px-[16px] uppercase shadow-xs border-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>＋ Add Customer</span>
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search customer by name, phone number, or town..."
        className="w-full h-[46px] bg-white border border-[#ded9d0] rounded-[11px] px-[13px] font-medium text-sm outline-hidden shadow-xs"
      />

      {/* List Grid */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={searchQuery ? `No customer matches "${searchQuery}"` : 'Add your first shop customer.'}
          actionLabel="＋ Add Customer"
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
                className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[18px] p-[18px] shadow-[0_14px_40px_rgba(43,37,28,0.09)] space-y-4 flex flex-col justify-between"
              >
                <div className="flex justify-between items-start gap-3 border-b border-[#efede8] pb-3">
                  <div>
                    <h3 className="font-['Manrope'] text-[18px] font-extrabold text-[#20221f] m-0">
                      {cust.name}
                    </h3>
                    <small className="text-[#74766f] text-[11px] font-bold block mt-0.5">
                      📞 {cust.phone} {cust.address ? `· 📍 ${cust.address}` : ''}
                    </small>
                  </div>

                  <a
                    href={`tel:${cust.phone}`}
                    className="border border-[#ded9d0] bg-white hover:bg-[#f6f3ed] text-[#20221f] rounded-[9px] px-[10px] py-[6px] font-bold text-xs"
                  >
                    ☎ Call
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#f6f3ed] p-2.5 rounded-[12px] border border-[#ded9d0] text-center font-bold text-xs">
                  <div>
                    <span className="text-[#74766f] text-[9px] uppercase block font-extrabold">Total</span>
                    <span className="text-base font-extrabold text-[#20221f]">{custRentals.length}</span>
                  </div>
                  <div>
                    <span className="text-[#74766f] text-[9px] uppercase block font-extrabold">Active</span>
                    <span className="text-base font-extrabold text-[#d35d2f]">{activeCount}</span>
                  </div>
                  <div>
                    <span className="text-[#74766f] text-[9px] uppercase block font-extrabold">Completed</span>
                    <span className="text-base font-extrabold text-[#2f8a61]">{completedCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCustomer(cust)}
                  type="button"
                  className="w-full h-[40px] bg-[#232621] hover:bg-[#353a34] text-white font-extrabold text-xs rounded-[10px] transition-all uppercase"
                >
                  View Customer History →
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CustomerProfileModal
        customer={selectedCustomer}
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        onOpenReceipt={onOpenReceipt}
      />

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(created) => setSelectedCustomer(created)}
      />
    </div>
  );
};
