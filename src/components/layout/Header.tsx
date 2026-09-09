import React from 'react';
import { History, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSettings } from '../../lib/storageService';
import { formatDateOnly } from '../../lib/dateUtils';

interface HeaderProps {
  onOpenNewRental: () => void;
  onOpenHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewRental, onOpenHistory }) => {
  const { user } = useAuth();
  const settings = getSettings();
  const ownerName = user?.name || 'Moosa';
  const currentDateStr = formatDateOnly(new Date());

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="font-['Manrope'] text-[24px] sm:text-[29px] font-extrabold tracking-[-1px] text-[#20221f] m-0">
          Good day, <span className="text-[#d35d2f]">{ownerName}</span>
        </h1>
        <div className="text-[#74766f] text-[13px] mt-[5px] font-medium">
          {currentDateStr} · {settings.address || 'Kozhikode, Kerala'}
        </div>
      </div>

      <div className="flex items-center gap-[9px] self-end sm:self-auto shrink-0">
        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            type="button"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 h-[44px] border border-[#ded9d0] bg-[#fdfcf9] hover:bg-[#f6f3ed] text-[#20221f] rounded-[11px] px-[15px] font-bold text-sm transition-all"
          >
            <History className="w-4 h-4 text-[#74766f]" />
            <span>View History</span>
          </button>
        )}

        <button
          onClick={onOpenNewRental}
          type="button"
          className="inline-flex items-center justify-center gap-2 h-[46px] border-0 bg-[#d35d2f] hover:bg-[#c25227] text-white rounded-[11px] px-[17px] font-['Manrope'] font-extrabold text-sm shadow-[0_7px_20px_#d35d2f2b] transition-all active:scale-98"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>＋ New Rental</span>
        </button>
      </div>
    </header>
  );
};
