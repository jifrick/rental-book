import React from 'react';
import type { Rental, Tool } from '../../types/database';

interface SummaryCardsProps {
  rentals: Rental[];
  tools: Tool[];
  onFilterClick?: (filter: 'active' | 'overdue' | 'available' | 'all') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ rentals, tools, onFilterClick }) => {
  const activeRentals = rentals.filter((r) => r.status === 'ACTIVE');
  
  const dueTodayCount = activeRentals.filter((r) => {
    if (!r.expected_return_at) return false;
    const todayStr = new Date().toDateString();
    return new Date(r.expected_return_at).toDateString() === todayStr;
  }).length;

  const availableToolsCount = tools.filter((t) => t.status === 'AVAILABLE').length;

  // Calculate collected today sum
  const todayStr = new Date().toDateString();
  const collectedToday = rentals
    .filter((r) => r.returned_at && new Date(r.returned_at).toDateString() === todayStr)
    .reduce((sum, r) => sum + (r.total_amount || 0), 0);

  return (
    <section className="mt-[25px] bg-[#232621] rounded-[20px] text-white p-[21px] sm:p-[25px_27px] grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-[22px] shadow-[0_14px_40px_rgba(43,37,28,0.09)] relative overflow-hidden">
      {/* Decorative radial blur circle */}
      <div className="hidden sm:block absolute w-[270px] h-[270px] border border-white/10 rounded-full -right-[90px] -top-[120px] shadow-[0_0_0_34px_rgba(255,255,255,0.02),0_0_0_68px_rgba(255,255,255,0.01)] pointer-events-none" />

      <div>
        <div className="text-[11px] tracking-[1px] uppercase text-[#aeb5ad] font-extrabold">
          Today's shop overview
        </div>
        <h2 className="font-['Manrope'] text-[24px] sm:text-[29px] leading-[1.1] my-[8px] font-extrabold text-white">
          Know what is outside.<br className="hidden sm:inline" /> Know what came back.
        </h2>
        <p className="text-[#b8beb8] text-[13px] max-w-[530px] m-0 font-medium">
          Your rental book is now organised, searchable and automatically timed.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-[10px] content-center">
        <button
          onClick={() => onFilterClick && onFilterClick('active')}
          type="button"
          className="bg-[#30352f] hover:bg-[#383e37] border border-[#41463f] rounded-[13px] p-[14px] text-left transition-all cursor-pointer"
        >
          <b className="text-[22px] sm:text-[25px] font-['Manrope'] font-extrabold text-white block">
            {activeRentals.length}
          </b>
          <span className="block text-[#aeb5ad] text-[11px] mt-[2px] font-bold">
            Tools outside
          </span>
        </button>

        <button
          onClick={() => onFilterClick && onFilterClick('all')}
          type="button"
          className="bg-[#30352f] hover:bg-[#383e37] border border-[#41463f] rounded-[13px] p-[14px] text-left transition-all cursor-pointer"
        >
          <b className="text-[22px] sm:text-[25px] font-['Manrope'] font-extrabold text-[#f2a36f] block">
            {dueTodayCount}
          </b>
          <span className="block text-[#aeb5ad] text-[11px] mt-[2px] font-bold">
            Due today
          </span>
        </button>

        <button
          onClick={() => onFilterClick && onFilterClick('available')}
          type="button"
          className="bg-[#30352f] hover:bg-[#383e37] border border-[#41463f] rounded-[13px] p-[14px] text-left transition-all cursor-pointer"
        >
          <b className="text-[22px] sm:text-[25px] font-['Manrope'] font-extrabold text-emerald-400 block">
            {availableToolsCount}
          </b>
          <span className="block text-[#aeb5ad] text-[11px] mt-[2px] font-bold">
            Available tools
          </span>
        </button>

        <div className="bg-[#30352f] border border-[#41463f] rounded-[13px] p-[14px] text-left">
          <b className="text-[20px] sm:text-[25px] font-['Manrope'] font-extrabold text-white block">
            ₹{collectedToday}
          </b>
          <span className="block text-[#aeb5ad] text-[11px] mt-[2px] font-bold">
            Collected today
          </span>
        </div>
      </div>
    </section>
  );
};
