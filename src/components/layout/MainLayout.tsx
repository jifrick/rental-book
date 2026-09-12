import React from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import type { TabType } from './MobileBottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { useAuth } from '../../context/AuthContext';
import { getShopById } from '../../lib/storageService';
import { AlertTriangle } from 'lucide-react';

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
  const { currentShopId, role } = useAuth();
  const shop = getShopById(currentShopId);
  const isSuspended = shop?.status === 'SUSPENDED' && role !== 'platform_admin';

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
          {isSuspended && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-semibold">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
              <div>
                <strong className="block font-bold">SHOP SUSPENDED BY PLATFORM ADMIN</strong>
                <span>Your shop is currently suspended. You can view existing data, but creating new rentals is disabled.</span>
              </div>
            </div>
          )}
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
