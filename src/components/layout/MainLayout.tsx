import React from 'react';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import type { TabType } from './MobileBottomNav';
import { DesktopSidebar } from './DesktopSidebar';

interface MainLayoutProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewRental: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewRental,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <Header onOpenNewRental={onOpenNewRental} />

      {/* Body Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar for Desktop */}
        <DesktopSidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onOpenNewRental={onOpenNewRental}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-6 pb-24 md:pb-8 max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenNewRental={onOpenNewRental}
      />
    </div>
  );
};
