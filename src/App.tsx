import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import type { TabType } from './components/layout/MobileBottomNav';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { RentalsPage } from './pages/RentalsPage';
import { HistoryPage } from './pages/HistoryPage';
import { ToolsPage } from './pages/ToolsPage';
import { CustomersPage } from './pages/CustomersPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { NewRentalModal } from './components/rentals/NewRentalModal';
import { ReturnToolModal } from './components/rentals/ReturnToolModal';
import { ActiveRentalDetailsModal } from './components/rentals/ActiveRentalDetailsModal';
import { RentalReceiptModal } from './components/rentals/RentalReceiptModal';
import { ForcePasswordChangeModal } from './components/auth/ForcePasswordChangeModal';
import { ShopOnboardingModal } from './components/onboarding/ShopOnboardingModal';

// Admin Components
import { AdminSidebar, type AdminTab } from './components/admin/AdminSidebar';
import { AdminOverview } from './components/admin/AdminOverview';
import { ShopManagement } from './components/admin/ShopManagement';
import { MasterCatalogManager } from './components/admin/MasterCatalogManager';
import { CreateShopModal } from './components/admin/CreateShopModal';
import { Check, Copy, ShieldAlert, ArrowLeft } from 'lucide-react';
import type { Rental, Shop } from './types/database';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, role, currentShop, isTempPassword } = useAuth();

  // Shop Owner Tab State
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Admin Tab State
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [isCreateShopOpen, setIsCreateShopOpen] = useState(false);
  const [createdShopInfo, setCreatedShopInfo] = useState<{ shop: Shop; tempPass: string } | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);
  const [adminPreviewMode, setAdminPreviewMode] = useState(false);

  // Shop Modals State
  const [isNewRentalOpen, setIsNewRentalOpen] = useState(false);
  const [returnToolRental, setReturnToolRental] = useState<Rental | null>(null);
  const [activeRentalDetails, setActiveRentalDetails] = useState<Rental | null>(null);
  const [receiptRental, setReceiptRental] = useState<Rental | null>(null);

  if (!isAuthenticated) {
    return <Login />;
  }

  // 1. Force Password Change Enforcement for Temporary Passwords
  if (isTempPassword) {
    return <ForcePasswordChangeModal onComplete={() => {}} />;
  }

  // 2. Platform Admin Dashboard
  if (role === 'platform_admin' && !adminPreviewMode) {
    return (
      <div className="min-h-screen bg-[#191b18] text-white flex">
        <AdminSidebar activeTab={adminTab} setActiveTab={setAdminTab} />

        <main className="flex-1 overflow-y-auto min-h-screen">
          {adminTab === 'overview' && (
            <AdminOverview
              onNavigateToShops={() => setAdminTab('shops')}
              onCreateShopClick={() => setIsCreateShopOpen(true)}
            />
          )}

          {adminTab === 'shops' && (
            <ShopManagement
              onCreateShopClick={() => setIsCreateShopOpen(true)}
            />
          )}

          {adminTab === 'master-catalog' && (
            <MasterCatalogManager />
          )}

          {adminTab === 'settings' && (
            <div className="p-6 space-y-4">
              <h1 className="text-2xl font-bold text-white">System Settings</h1>
              <p className="text-sm text-[#9da699]">Rental Book Platform Global Configuration</p>
              <div className="p-6 bg-[#232621] border border-[#32362e] rounded-2xl text-sm text-[#9da699]">
                Global SaaS Configuration & RLS Security Active
              </div>
            </div>
          )}
        </main>

        {/* Create Shop Modal */}
        {isCreateShopOpen && (
          <CreateShopModal
            onClose={() => setIsCreateShopOpen(false)}
            onSuccess={(shop, tempPass) => {
              setIsCreateShopOpen(false);
              setCreatedShopInfo({ shop, tempPass });
            }}
          />
        )}

        {/* Shop Credentials Success Dialog */}
        {createdShopInfo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#191b18] border border-[#32362e] rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">Shop Account Created Successfully!</h2>
                <p className="text-xs text-[#9da699]">Provide these temporary login credentials to the shop owner.</p>
              </div>

              <div className="bg-[#232621] border border-[#32362e] rounded-xl p-4 text-left font-mono text-xs space-y-2">
                <div>
                  <span className="text-[#9da699]">Shop Name: </span>
                  <span className="text-white font-bold">{createdShopInfo.shop.name}</span>
                </div>
                <div>
                  <span className="text-[#9da699]">Owner: </span>
                  <span className="text-white font-bold">{createdShopInfo.shop.owner_name}</span>
                </div>
                <div>
                  <span className="text-[#9da699]">User ID Code: </span>
                  <span className="text-orange-400 font-bold">{createdShopInfo.shop.user_id_code}</span>
                </div>
                <div>
                  <span className="text-[#9da699]">Temporary Password: </span>
                  <span className="text-emerald-400 font-bold">{createdShopInfo.tempPass}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const text = `Rental Book Credentials\nShop: ${createdShopInfo.shop.name}\nUser ID: ${createdShopInfo.shop.user_id_code}\nTemp Password: ${createdShopInfo.tempPass}`;
                    navigator.clipboard.writeText(text);
                    setCopiedPass(true);
                    setTimeout(() => setCopiedPass(false), 2000);
                  }}
                  className="flex-1 py-2.5 bg-[#232621] hover:bg-[#2e332a] border border-[#32362e] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPass ? 'Copied!' : 'Copy Credentials'}</span>
                </button>

                <button
                  onClick={() => setCreatedShopInfo(null)}
                  className="flex-1 py-2.5 bg-[#d35d2f] hover:bg-[#c04d21] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. First-Time Shop Onboarding Flow
  if (currentShop && !currentShop.is_onboarded) {
    return <ShopOnboardingModal shop={currentShop} onComplete={() => {}} />;
  }

  // 4. Shop Owner Workspace UI
  return (
    <MainLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onOpenNewRental={() => setIsNewRentalOpen(true)}
    >
      {/* Admin Preview Header Indicator */}
      {role === 'platform_admin' && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-amber-400 text-xs font-semibold">
          <span>Viewing shop workspace as Platform Admin ({currentShop?.name})</span>
          <button
            onClick={() => setAdminPreviewMode(false)}
            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin Panel
          </button>
        </div>
      )}

      {/* Tab Pages */}
      {activeTab === 'home' && (
        <Dashboard
          onOpenNewRental={() => setIsNewRentalOpen(true)}
          onOpenReturnTool={(rental) => setReturnToolRental(rental)}
          onOpenRentalDetails={(rental) => setActiveRentalDetails(rental)}
          onSelectTab={setActiveTab}
        />
      )}

      {activeTab === 'rentals' && (
        <RentalsPage
          onOpenNewRental={() => setIsNewRentalOpen(true)}
          onOpenReturnTool={(rental) => setReturnToolRental(rental)}
          onOpenRentalDetails={(rental) => setActiveRentalDetails(rental)}
        />
      )}

      {activeTab === 'tools' && (
        <ToolsPage
          onReturnTool={(rental) => setReturnToolRental(rental)}
        />
      )}

      {activeTab === 'customers' && (
        <CustomersPage
          onOpenReceipt={(rental) => setReceiptRental(rental)}
        />
      )}

      {activeTab === 'history' && (
        <HistoryPage
          onOpenReceipt={(rental) => setReceiptRental(rental)}
        />
      )}

      {activeTab === 'settings' && <SettingsPage />}

      {/* Global Shop Modals */}
      <NewRentalModal
        isOpen={isNewRentalOpen}
        onClose={() => setIsNewRentalOpen(false)}
        onSuccess={() => {
          setActiveTab('home');
        }}
      />

      <ReturnToolModal
        rental={returnToolRental}
        isOpen={Boolean(returnToolRental)}
        onClose={() => setReturnToolRental(null)}
        onSuccess={() => {
          setActiveTab('home');
        }}
        onOpenReceipt={(rental) => {
          setReceiptRental(rental);
        }}
      />

      <ActiveRentalDetailsModal
        rental={activeRentalDetails}
        isOpen={Boolean(activeRentalDetails)}
        onClose={() => setActiveRentalDetails(null)}
        onReturnTool={(rental) => setReturnToolRental(rental)}
      />

      <RentalReceiptModal
        rental={receiptRental}
        isOpen={Boolean(receiptRental)}
        onClose={() => setReceiptRental(null)}
      />
    </MainLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

export default App;
