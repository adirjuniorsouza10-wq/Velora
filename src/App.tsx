import React, { useState } from 'react';
import { VeloraProvider, useVelora } from './context/VeloraContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { AgendaView } from './components/views/AgendaView';
import { AppointmentsListView } from './components/views/AppointmentsListView';
import { CrmView } from './components/views/CrmView';
import { StaffView } from './components/views/StaffView';
import { ServicesView } from './components/views/ServicesView';
import { FinanceView } from './components/views/FinanceView';
import { CommissionsView } from './components/views/CommissionsView';
import { InventoryView } from './components/views/InventoryView';
import { MarketingView } from './components/views/MarketingView';
import { ReportsView } from './components/views/ReportsView';
import { AiView } from './components/views/AiView';
import { ClubView } from './components/views/ClubView';
import { SettingsView } from './components/views/SettingsView';
import { BookingPage } from './components/booking/BookingPage';
import { MobilePreview } from './components/mobile/MobilePreview';
import { ProfessionalPortalView } from './components/views/ProfessionalPortalView';
import { NewAppointmentModal } from './components/modals/NewAppointmentModal';

const VeloraAppContent: React.FC = () => {
  const { currentMode, setCurrentMode, activeTab, themeMode } = useVelora();

  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [modalPrefilled, setModalPrefilled] = useState<{
    date: string;
    time: string;
    professionalId?: string;
  } | undefined>(undefined);

  const handleOpenNewAppointment = (prefilled?: { date: string; time: string; professionalId?: string }) => {
    setModalPrefilled(prefilled);
    setNewAppointmentOpen(true);
  };

  // Ambiente 03: VELORA CLIENT (Booking Público Oficial + Carteira Digital VELORA PASS)
  if (currentMode === 'client' || currentMode === 'booking') {
    return <BookingPage />;
  }

  // Se simulador PWA Mobile
  if (currentMode === 'mobile_preview') {
    return <MobilePreview onOpenNewAppointment={() => handleOpenNewAppointment()} />;
  }

  // Ambiente 02: VELORA PROFESSIONAL (Portal do Barbeiro: Agenda & Comissões)
  if (currentMode === 'professional') {
    return (
      <div className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors duration-300 ${
        themeMode === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-zinc-950 text-white'
      }`}>
        <Header onOpenNewAppointment={() => handleOpenNewAppointment()} />
        <main className="flex-1 overflow-hidden flex flex-col">
          <ProfessionalPortalView />
        </main>
        <NewAppointmentModal
          isOpen={newAppointmentOpen}
          onClose={() => setNewAppointmentOpen(false)}
          prefilled={modalPrefilled}
        />
      </div>
    );
  }

  // Ambiente 01: VELORA BUSINESS (Cockpit de Gestão Empresarial)
  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden select-none transition-colors duration-300 ${
      themeMode === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-zinc-950 text-white'
    }`}>
      <Header onOpenNewAppointment={() => handleOpenNewAppointment()} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onOpenBookingPreview={() => setCurrentMode('booking')} />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* GESTÃO */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              onOpenNewAppointment={() => handleOpenNewAppointment()}
              onOpenBookingPage={() => setCurrentMode('booking')}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaView onOpenNewAppointment={handleOpenNewAppointment} />
          )}

          {activeTab === 'appointments' && (
            <AppointmentsListView />
          )}

          {activeTab === 'crm' && (
            <CrmView />
          )}

          {activeTab === 'staff' && (
            <StaffView />
          )}

          {activeTab === 'services' && (
            <ServicesView />
          )}

          {/* FINANCEIRO */}
          {(activeTab === 'finance' || activeTab === 'cash') && (
            <FinanceView />
          )}

          {activeTab === 'commissions' && (
            <CommissionsView />
          )}

          {activeTab === 'inventory' && (
            <InventoryView />
          )}

          {/* CRESCIMENTO */}
          {activeTab === 'club' && (
            <ClubView />
          )}

          {activeTab === 'marketing' && (
            <MarketingView />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'ai' && (
            <AiView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      <NewAppointmentModal
        isOpen={newAppointmentOpen}
        onClose={() => setNewAppointmentOpen(false)}
        prefilled={modalPrefilled}
      />
    </div>
  );
};

export default function App() {
  return (
    <VeloraProvider>
      <VeloraAppContent />
    </VeloraProvider>
  );
}
