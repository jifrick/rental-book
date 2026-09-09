import React from 'react';
import type { Rental } from '../../types/database';
import { formatDateTime, getOverdueInfo } from '../../lib/dateUtils';
import { LiveDurationBadge } from '../shared/LiveDurationBadge';

interface ActiveRentalCardProps {
  rental: Rental;
  onReturnTool: (rental: Rental) => void;
  onSelectRental: (rental: Rental) => void;
}

export const ActiveRentalCard: React.FC<ActiveRentalCardProps> = ({
  rental,
  onReturnTool,
  onSelectRental,
}) => {
  const overdueInfo = getOverdueInfo(rental.expected_return_at, rental.status);
  const initialLetter = rental.customer_name ? rental.customer_name.charAt(0).toUpperCase() : 'C';

  return (
    <article className="border border-[#ded9d0] rounded-[14px] bg-white p-[16px] relative shadow-xs hover:shadow-md transition-all">
      {/* Top Person Info & Status */}
      <div className="flex justify-between items-start gap-[12px]">
        <div
          onClick={() => onSelectRental(rental)}
          className="flex gap-[11px] items-center cursor-pointer group"
        >
          <div className="w-[39px] h-[39px] rounded-[11px] bg-[#f4e9e1] text-[#d35d2f] grid place-items-center font-extrabold text-base shrink-0">
            {initialLetter}
          </div>
          <div>
            <b className="text-[16px] font-['Manrope'] text-[#20221f] group-hover:text-[#d35d2f] transition-colors block">
              {rental.customer_name}
            </b>
            <small className="block text-[#74766f] text-[11px] mt-[2px]">
              {rental.customer_phone} {rental.customer_address ? `· ${rental.customer_address}` : ''}
            </small>
          </div>
        </div>

        <span
          className={`text-[10px] font-extrabold px-[9px] py-[6px] rounded-[20px] h-max border ${
            overdueInfo.isOverdue
              ? 'bg-[#fde8e8] text-[#c94b48] border-[#f8b4b4]'
              : 'bg-[#fff0e8] text-[#b84e27] border-[#fcd5c5]'
          }`}
        >
          {overdueInfo.isOverdue ? '● OVERDUE' : '● RENTED OUT'}
        </span>
      </div>

      {/* 3-Column Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-[12px] my-[15px] py-[13px] border-y border-[#efede8]">
        <div>
          <label className="block text-[9px] text-[#92958d] uppercase font-extrabold tracking-[0.6px]">
            Tool
          </label>
          <b className="text-[13px] text-[#20221f] block mt-[4px] font-bold">
            {rental.tool_name}
          </b>
        </div>

        <div>
          <label className="block text-[9px] text-[#92958d] uppercase font-extrabold tracking-[0.6px]">
            Machine
          </label>
          <b className="text-[13px] text-[#d35d2f] block mt-[4px] font-extrabold font-mono">
            {rental.tool_code}
          </b>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[9px] text-[#92958d] uppercase font-extrabold tracking-[0.6px]">
            Taken
          </label>
          <b className="text-[13px] text-[#20221f] block mt-[4px] font-medium">
            {formatDateTime(rental.started_at)}
          </b>
        </div>
      </div>

      {/* Timer & Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-[12px]">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <small className="text-[#74766f] text-[11px] font-bold block">Running time</small>
          <LiveDurationBadge startedAt={rental.started_at} />
        </div>

        <div className="flex gap-[7px]">
          <a
            href={`tel:${rental.customer_phone}`}
            className="border border-[#ded9d0] bg-white hover:bg-[#f6f3ed] text-[#20221f] rounded-[9px] px-[12px] py-[10px] font-bold text-xs inline-flex items-center justify-center gap-1 transition-all"
          >
            <span>☎ Call</span>
          </a>

          <button
            onClick={() => onReturnTool(rental)}
            type="button"
            className="border-0 bg-[#2f8a61] hover:bg-[#256f4e] text-white rounded-[9px] px-[13px] py-[10px] font-extrabold text-xs inline-flex items-center justify-center gap-1 transition-all shadow-xs active:scale-98"
          >
            <span>↩ Return Tool</span>
          </button>
        </div>
      </div>
    </article>
  );
};
