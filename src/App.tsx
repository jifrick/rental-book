import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './components/layout/MainLayout';
import type { TabType } from './components/layout/MobileBottomNav';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { HistoryPage } from './pages/HistoryPage';
import { ToolsPage } from './pages/ToolsPage';
import { CustomersPage } from './pages/CustomersPage';
import { SettingsPage } from './pages/SettingsPage';
import { NewRentalModal } from './components/rentals/NewRentalModal';
import { ReturnToolModal } from './components/rentals/ReturnToolModal';
import { ActiveRentalDetailsModal } from './components/rentals/ActiveRentalDetailsModal';
import { RentalReceiptModal } from './components/rentals/RentalReceiptModal';
import type { Rental } from './types/database';

const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Global Modals State
  const [isNewRentalOpen, setIsNewRentalOpen] = useState(false);
  const [returnToolRental, setReturnToolRental] = useState<Rental | null>(null);
  const [activeRentalDetails, setActiveRentalDetails] = useState<Rental | null>(null);
  const [receiptRental, setReceiptRental] = useState<Rental | null>(null);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <MainLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onOpenNewRental={() => setIsNewRentalOpen(true)}
    >
      {/* Tab Pages */}
      {activeTab === 'home' && (
        <Dashboard
          onOpenNewRental={() => setIsNewRentalOpen(true)}
          onOpenReturnTool={(rental) => setReturnToolRental(rental)}
          onOpenRentalDetails={(rental) => setActiveRentalDetails(rental)}
        />
      )}

      {activeTab === 'rentals' && (
        <Dashboard
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

      {/* Global Modals */}
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
