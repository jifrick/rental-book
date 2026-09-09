import React from 'react';
import { Home, ClipboardList, Wrench, Users, History, PlusCircle } from 'lucide-react';

export type TabType = 'home' | 'rentals' | 'tools' | 'customers' | 'history' | 'settings';

interface MobileBottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewRental: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewRental,
}) => {
  const navItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'rentals', label: 'RENTALS', icon: ClipboardList },
    { id: 'tools', label: 'TOOLS', icon: Wrench },
    { id: 'customers', label: 'CUSTOMERS', icon: Users },
    { id: 'history', label: 'HISTORY', icon: History },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t-2 border-slate-800 pb-safe">
      <div className="flex items-center justify-around px-1 py-1.5 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as TabType)}
              type="button"
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[52px] ${
                isActive
                  ? 'text-amber-400 font-black bg-slate-800/80 scale-105'
                  : 'text-slate-400 font-bold hover:text-slate-200'
              }`}
            >
              <Icon className={`w-6 h-6 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className="text-[11px] tracking-wider uppercase font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="absolute -top-6 right-4 sm:hidden">
        <button
          onClick={onOpenNewRental}
          type="button"
          aria-label="New Rental"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 text-slate-950 font-black rounded-full shadow-2xl border-2 border-slate-900 active:scale-95 transition-all text-sm uppercase tracking-wide"
        >
          <PlusCircle className="w-6 h-6 stroke-[3]" />
          <span>RENT</span>
        </button>
      </div>
    </div>
  );
};
