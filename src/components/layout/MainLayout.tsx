import React from 'react';
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
    <div className="min-h-screen bg-[#eee9e1] text-[#20221f] flex">
      {/* Fixed Desktop Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenNewRental={onOpenNewRental}
      />

      {/* Main Content Area */}
      <main className="w-full md:ml-[252px] md:w-[calc(100%-252px)] p-[20px] sm:p-[28px_34px_50px] pb-[88px] md:pb-[50px]">
        <div className="max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Fixed Bottom Nav */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenNewRental={onOpenNewRental}
      />
    </div>
  );
};
