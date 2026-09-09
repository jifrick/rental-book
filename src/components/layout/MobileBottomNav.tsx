import React from 'react';
import { Home, ClipboardList, Wrench, Users, History } from 'lucide-react';

export type TabType = 'home' | 'rentals' | 'tools' | 'customers' | 'history' | 'settings';

interface MobileBottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewRental?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'rentals', label: 'RENTALS', icon: ClipboardList },
    { id: 'tools', label: 'TOOLS', icon: Wrench },
    { id: 'customers', label: 'CUSTOMERS', icon: Users },
    { id: 'history', label: 'HISTORY', icon: History },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-[#fdfcf9] border-t border-[#ded9d0] grid grid-cols-5 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as TabType)}
            type="button"
            className={`flex flex-col items-center justify-center border-0 bg-transparent transition-all ${
              isActive ? 'text-[#d35d2f] font-extrabold' : 'text-[#74766f] font-bold hover:text-[#20221f]'
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[9px] tracking-wider uppercase font-extrabold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
