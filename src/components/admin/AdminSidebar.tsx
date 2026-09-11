import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Settings,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 'overview' | 'shops' | 'master-catalog' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'shops', label: 'Shops & Tenants', icon: Building2 },
    { id: 'master-catalog', label: 'Master Tool Catalog', icon: Wrench },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#232621] border-r border-[#32362e] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-[#32362e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[#d35d2f]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">RENTAL BOOK</h1>
              <p className="text-[10px] uppercase tracking-wider text-orange-400 font-semibold">Platform Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#d35d2f] text-white shadow-lg shadow-[#d35d2f]/20 font-semibold'
                    : 'text-[#9da699] hover:bg-[#2e332a] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-[#32362e]">
        <div className="p-3 bg-[#191b18] border border-[#32362e] rounded-xl mb-3">
          <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
          <p className="text-[10px] text-[#9da699] truncate">admin@rentalbook.com</p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin</span>
        </button>
      </div>
    </aside>
  );
};
