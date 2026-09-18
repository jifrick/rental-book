import React from 'react';
import { History, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShopSettings } from '../../hooks/useShopSettings';
import { getShopById } from '../../lib/storageService';
import { formatDateOnly } from '../../lib/dateUtils';

interface HeaderProps {
  onOpenNewRental: () => void;
  onOpenHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewRental, onOpenHistory }) => {
  const { currentShopId, role, logout } = useAuth();
  const settings = useShopSettings(currentShopId);
  const shop = getShopById(currentShopId);
  const isSuspended = shop?.status === 'SUSPENDED' && role !== 'platform_admin';
  const currentDateStr = formatDateOnly(new Date());

  const handleNewRentalClick = () => {
    if (isSuspended) {
      alert(`Shop "${shop?.name || 'Your shop'}" is currently SUSPENDED by Platform Admin. New rentals cannot be created.`);
      return;
    }
    onOpenNewRental();
  };

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
        <div>
          <h1 className="font-['Manrope'] text-[24px] sm:text-[29px] font-extrabold tracking-[-1px] text-[#20221f] m-0">
            Good day, <span className="text-[#d35d2f]">{settings.owner_name}</span>
          </h1>
          <div className="text-[#74766f] text-[13px] mt-[5px] font-medium">
            {currentDateStr} · {settings.address}
          </div>
        </div>

        {/* Mobile Logout Button */}
        <button
          onClick={logout}
          type="button"
          title="Logout"
          className="md:hidden flex items-center gap-1.5 h-[38px] border border-[#ded9d0] bg-[#fdfcf9] hover:bg-red-50 text-red-600 rounded-[10px] px-3 font-extrabold text-xs transition-all shrink-0 active:scale-95 shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex items-center gap-[9px] self-end sm:self-auto shrink-0 w-full sm:w-auto justify-end">
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
          onClick={handleNewRentalClick}
          type="button"
          disabled={isSuspended}
          className={`inline-flex items-center justify-center gap-2 h-[46px] border-0 rounded-[11px] px-[17px] font-['Manrope'] font-extrabold text-sm transition-all active:scale-98 ${
            isSuspended
              ? 'bg-[#ded9d0] text-[#74766f] cursor-not-allowed shadow-none'
              : 'bg-[#d35d2f] hover:bg-[#c25227] text-white shadow-[0_7px_20px_#d35d2f2b]'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>＋ New Rental</span>
        </button>
      </div>
    </header>
  );
};
