import React, { useState, useEffect, useMemo } from 'react';

import type { Rental, Tool } from '../types/database';
import { getRentals, getTools, subscribeToStore } from '../lib/storageService';
import { Header } from '../components/layout/Header';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { ActiveRentalCard } from '../components/dashboard/ActiveRentalCard';
import { EmptyState } from '../components/shared/EmptyState';

interface DashboardProps {
  onOpenNewRental: () => void;
  onOpenReturnTool: (rental: Rental) => void;
  onOpenRentalDetails: (rental: Rental) => void;
  onSelectTab?: (tab: 'home' | 'rentals' | 'tools' | 'customers' | 'history' | 'settings') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewRental,
  onOpenReturnTool,
  onOpenRentalDetails,
  onSelectTab,
}) => {
  const [rentals, setRentals] = useState<Rental[]>(() => getRentals());
  const [tools, setTools] = useState<Tool[]>(() => getTools());
  const [toolSearch, setToolSearch] = useState<string>('');

  const refreshData = () => {
    setRentals(getRentals());
    setTools(getTools());
  };

  useEffect(() => {
    return subscribeToStore(refreshData);
  }, []);

  const activeRentals = rentals.filter((r) => r.status === 'ACTIVE');

  // Grouped Tools for "Tools at a glance"
  const groupedTools = useMemo(() => {
    const map = new Map<string, { name: string; total: number; available: number }>();
    tools.forEach((t) => {
      const existing = map.get(t.name);
      if (existing) {
        existing.total += 1;
        if (t.status === 'AVAILABLE') existing.available += 1;
      } else {
        map.set(t.name, {
          name: t.name,
          total: 1,
          available: t.status === 'AVAILABLE' ? 1 : 0,
        });
      }
    });
    return Array.from(map.values());
  }, [tools]);

  const filteredToolsAtGlance = useMemo(() => {
    const q = toolSearch.trim().toLowerCase();
    if (!q) return groupedTools;
    return groupedTools.filter((gt) => gt.name.toLowerCase().includes(q));
  }, [groupedTools, toolSearch]);

  const todayStr = new Date().toDateString();
  const returnedTodayCount = rentals.filter(
    (r) => r.status === 'RETURNED' && r.returned_at && new Date(r.returned_at).toDateString() === todayStr
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header
        onOpenNewRental={onOpenNewRental}
        onOpenHistory={() => onSelectTab && onSelectTab('history')}
      />

      {/* Hero Overview */}
      <SummaryCards rentals={rentals} tools={tools} />

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,0.75fr)] gap-[18px] mt-[18px]">
        {/* Left Panel: Currently Out */}
        <section className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[18px] shadow-[0_14px_40px_rgba(43,37,28,0.09)] flex flex-col justify-between">
          <div>
            <div className="p-[18px_20px_14px] flex justify-between items-center border-b border-[#efede8]">
              <h3 className="m-0 font-['Manrope'] text-[17px] font-extrabold text-[#20221f]">
                Currently out
              </h3>
              <span className="text-[12px] text-[#74766f] font-bold">
                {activeRentals.length} active rental{activeRentals.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="p-[15px] space-y-[10px]">
              {activeRentals.length === 0 ? (
                <EmptyState
                  title="No tools currently outside"
                  description="All physical machines are inside the shop and available for rent."
                  actionLabel="＋ New Rental"
                  onAction={onOpenNewRental}
                />
              ) : (
                activeRentals.map((rental) => (
                  <ActiveRentalCard
                    key={rental.id}
                    rental={rental}
                    onReturnTool={onOpenReturnTool}
                    onSelectRental={onOpenRentalDetails}
                  />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right Stack: Today's Attention & Tools at a glance */}
        <div className="grid gap-[18px]">
          {/* Today's Attention Panel */}
          <section className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[18px] shadow-[0_14px_40px_rgba(43,37,28,0.09)]">
            <div className="p-[18px_20px_14px] flex justify-between items-center border-b border-[#efede8]">
              <h3 className="m-0 font-['Manrope'] text-[17px] font-extrabold text-[#20221f]">
                Today's attention
              </h3>
              <span className="text-[12px] text-[#74766f] font-bold">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </span>
            </div>

            <div className="p-[16px] grid gap-[9px]">
              <div className="flex items-center justify-between p-[13px] rounded-[12px] bg-[#f6f3ed] border border-[#ded9d0]">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[34px] h-[34px] rounded-[9px] grid place-items-center font-extrabold bg-white text-[#5575ad]">
                    ↩
                  </div>
                  <div>
                    <b className="text-[14px] text-[#20221f] block font-bold">Due today</b>
                    <small className="block text-[#74766f] text-[10px] mt-[2px]">1 tool expected back</small>
                  </div>
                </div>
                <strong className="font-['Manrope'] text-[19px] font-extrabold text-[#20221f]">1</strong>
              </div>

              <div className="flex items-center justify-between p-[13px] rounded-[12px] bg-[#f6f3ed] border border-[#ded9d0]">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[34px] h-[34px] rounded-[9px] grid place-items-center font-extrabold bg-white text-[#c94b48]">
                    !
                  </div>
                  <div>
                    <b className="text-[14px] text-[#20221f] block font-bold">Overdue</b>
                    <small className="block text-[#74766f] text-[10px] mt-[2px]">No overdue tools</small>
                  </div>
                </div>
                <strong className="font-['Manrope'] text-[19px] font-extrabold text-[#20221f]">0</strong>
              </div>

              <div className="flex items-center justify-between p-[13px] rounded-[12px] bg-[#f6f3ed] border border-[#ded9d0]">
                <div className="flex items-center gap-[10px]">
                  <div className="w-[34px] h-[34px] rounded-[9px] grid place-items-center font-extrabold bg-white text-[#2f8a61]">
                    ✓
                  </div>
                  <div>
                    <b className="text-[14px] text-[#20221f] block font-bold">Returned today</b>
                    <small className="block text-[#74766f] text-[10px] mt-[2px]">{returnedTodayCount} tools completed</small>
                  </div>
                </div>
                <strong className="font-['Manrope'] text-[19px] font-extrabold text-[#20221f]">{returnedTodayCount}</strong>
              </div>
            </div>
          </section>

          {/* Tools at a glance Panel */}
          <section className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[18px] shadow-[0_14px_40px_rgba(43,37,28,0.09)]">
            <div className="p-[18px_20px_14px] flex justify-between items-center border-b border-[#efede8]">
              <h3 className="m-0 font-['Manrope'] text-[17px] font-extrabold text-[#20221f]">
                Tools at a glance
              </h3>
              <span className="text-[12px] text-[#74766f] font-bold">{tools.length} total</span>
            </div>

            <div className="p-[0_15px_16px]">
              <input
                className="h-[42px] border border-[#ded9d0] bg-white rounded-[10px] w-full px-[12px] outline-hidden mb-[10px] text-xs font-bold my-3"
                placeholder="Search tool..."
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
              />

              <div className="space-y-1">
                {filteredToolsAtGlance.slice(0, 5).map((gt) => (
                  <div key={gt.name} className="flex items-center justify-between py-[12px] px-[4px] border-b border-[#eeeae4] text-xs">
                    <div className="flex items-center gap-[10px]">
                      <div className="w-[35px] h-[35px] rounded-[9px] bg-[#eeeae3] grid place-items-center text-[16px] font-bold text-[#d35d2f]">
                        ⚒
                      </div>
                      <div>
                        <b className="text-[13px] text-[#20221f] block font-extrabold">{gt.name}</b>
                        <small className="block text-[#74766f] text-[10px] mt-[2px] font-bold">{gt.total} machines</small>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-[4px]">
                        {Array.from({ length: Math.min(gt.total, 4) }).map((_, i) => (
                          <i
                            key={i}
                            className={`w-[8px] h-[8px] rounded-full inline-block ${
                              i < (gt.total - gt.available) ? 'bg-[#d35d2f]' : 'bg-[#d8ddd8]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#74766f] font-bold">{gt.available} free</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] mt-[18px]">
        <section className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[17px] p-[19px] shadow-[0_14px_40px_rgba(43,37,28,0.09)]">
          <h3 className="font-['Manrope'] text-[16px] font-extrabold text-[#20221f] m-0">Rental activity</h3>
          <p className="text-[12px] text-[#74766f] line-height-[1.5] mt-1">Today's completed rentals</p>
          <div className="font-['Manrope'] text-[30px] font-extrabold mt-[13px] text-[#20221f]">
            {rentals.length} <span className="text-[13px] text-[#74766f] font-normal font-sans">records</span>
          </div>
          <div className="h-[7px] rounded-[10px] bg-[#e7e4dd] overflow-hidden mt-[12px]">
            <i className="block w-[72%] h-full bg-[#d35d2f] rounded-[10px]" />
          </div>
          <button
            onClick={() => onSelectTab && onSelectTab('history')}
            className="mt-[14px] border-0 bg-transparent text-[#d35d2f] font-extrabold text-xs cursor-pointer p-0 block hover:underline"
          >
            Open history →
          </button>
        </section>

        <section className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[17px] p-[19px] shadow-[0_14px_40px_rgba(43,37,28,0.09)]">
          <h3 className="font-['Manrope'] text-[16px] font-extrabold text-[#20221f] m-0">Customer book</h3>
          <p className="text-[12px] text-[#74766f] line-height-[1.5] mt-1">Search anyone who has rented before.</p>
          <div className="font-['Manrope'] text-[30px] font-extrabold mt-[13px] text-[#20221f]">
            126 <span className="text-[13px] text-[#74766f] font-normal font-sans">customers</span>
          </div>
          <button
            onClick={() => onSelectTab && onSelectTab('customers')}
            className="mt-[14px] border-0 bg-transparent text-[#d35d2f] font-extrabold text-xs cursor-pointer p-0 block hover:underline"
          >
            View customers →
          </button>
        </section>

        <section className="bg-[#fdfcf9] border border-[#ded9d0] rounded-[17px] p-[19px] shadow-[0_14px_40px_rgba(43,37,28,0.09)]">
          <h3 className="font-['Manrope'] text-[16px] font-extrabold text-[#20221f] m-0">Quick reminder</h3>
          <p className="text-[12px] text-[#74766f] line-height-[1.5] mt-1">Keep the physical tools and digital record in sync after every return.</p>
          <button
            onClick={onOpenNewRental}
            className="mt-[14px] border-0 bg-transparent text-[#d35d2f] font-extrabold text-xs cursor-pointer p-0 block hover:underline"
          >
            ＋ Start a rental
          </button>
        </section>
      </div>
    </div>
  );
};
