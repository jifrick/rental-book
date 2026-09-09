import React from 'react';
import { Home, ClipboardList, Wrench, Users, History, Settings, LogOut, PlusCircle } from 'lucide-react';
import type { TabType } from './MobileBottomNav';
import { useAuth } from '../../context/AuthContext';

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

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'rentals', label: 'Rentals', icon: ClipboardList },
    { id: 'tools', label: 'Tools Inventory', icon: Wrench },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'history', label: 'Rental History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r-2 border-slate-800 text-white min-h-[calc(100vh-68px)] p-4 shrink-0 justify-between">
      <div className="space-y-6">
        {/* Quick New Rental Button */}
        <button
          onClick={onOpenNewRental}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all border-2 border-amber-300 min-h-[52px]"
        >
          <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          <span>+ NEW RENTAL</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as TabType)}
                type="button"
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-base transition-all min-h-[48px] ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="px-3 py-2 bg-slate-800/60 rounded-xl">
          <p className="text-sm font-bold text-white truncate">{user?.name || 'Shop Owner'}</p>
          <p className="text-xs text-amber-400 truncate">{user?.shopName || 'Tool Rental Shop'}</p>
        </div>

        <button
          onClick={logout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 font-bold text-sm rounded-xl transition-all min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
};
