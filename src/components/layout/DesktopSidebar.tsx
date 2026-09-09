import React from 'react';
import { Home, ClipboardList, Wrench, Users, History, Settings, LogOut, Plus } from 'lucide-react';
import type { TabType } from './MobileBottomNav';
import { useAuth } from '../../context/AuthContext';
import { getSettings } from '../../lib/storageService';

interface DesktopSidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewRental: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewRental,
}) => {
  const { user, logout } = useAuth();
  const settings = getSettings();

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'rentals', label: 'Active Rentals', icon: ClipboardList },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'history', label: 'Rental History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="hidden md:flex flex-col w-[252px] bg-[#232621] text-white fixed inset-y-0 left-0 p-[25px_17px] z-30 justify-between">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-[12px] px-[10px] pb-[32px] pt-[4px]">
          <div className="w-[43px] h-[43px] border-2 border-[#e7a37f] rounded-[13px] grid place-items-center font-['Manrope'] font-extrabold text-[#f5b28e] text-base shrink-0">
            TR
          </div>
          <div>
            <strong className="font-['Manrope'] font-extrabold text-base tracking-[-0.4px] block text-white">
              TOOL RENTAL
            </strong>
            <small className="block text-[#9ea59d] text-[11px] mt-[2px]">
              Digital rental book
            </small>
          </div>
        </div>

        {/* Shop Info Card */}
        <div className="mx-[7px] mb-[23px] bg-[#30352f] border border-[#3d433d] rounded-[13px] p-[13px]">
          <span className="text-[10px] text-[#9fa69e] uppercase font-extrabold tracking-[0.6px] block">
            Shop
          </span>
          <b className="block mt-[4px] text-[14px] font-['Manrope'] text-white truncate">
            {settings.shop_name}
          </b>
        </div>

        {/* Quick New Rental Action */}
        <button
          onClick={onOpenNewRental}
          type="button"
          className="w-full flex items-center justify-center gap-2 mb-4 h-[46px] bg-[#d35d2f] hover:bg-[#c25227] text-white font-['Manrope'] font-extrabold text-sm rounded-[11px] shadow-[0_7px_20px_#d35d2f2b] transition-all active:scale-98"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>＋ New Rental</span>
        </button>

        {/* Nav Links */}
        <nav className="grid gap-[4px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as TabType)}
                type="button"
                className={`w-full flex items-center gap-[10px] px-[12px] py-[13px] rounded-[11px] text-left font-[650] text-[14px] transition-all border-0 ${
                  isActive
                    ? 'bg-[#353a34] text-white font-extrabold shadow-xs'
                    : 'bg-transparent text-[#bfc4be] hover:bg-[#353a34]/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#f2a36f]' : 'text-[#9fa59e]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Aside Footer User Profile */}
      <div className="border-t border-[#3a3f39] pt-[16px] flex items-center justify-between gap-[10px]">
        <div className="flex items-center gap-[10px] min-w-0">
          <div className="w-[38px] h-[38px] rounded-full bg-[#e2ddd4] text-[#34362f] grid place-items-center font-extrabold text-sm shrink-0">
            {user?.name?.charAt(0) || 'M'}
          </div>
          <div className="min-w-0">
            <b className="block text-sm text-white font-['Manrope'] truncate">
              {user?.name || 'Moosa'}
            </b>
            <small className="block text-[#9fa59e] text-[11px] mt-[2px] truncate">
              Shop owner
            </small>
          </div>
        </div>

        <button
          onClick={logout}
          type="button"
          title="Logout"
          className="p-2 text-[#9fa59e] hover:text-red-400 hover:bg-[#353a34] rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
