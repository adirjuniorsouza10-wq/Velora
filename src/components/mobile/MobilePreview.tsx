import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Calendar, 
  Users, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Smartphone, 
  ArrowLeft, 
  Phone, 
  Scissors,
  Sparkles
} from 'lucide-react';
import { formatCurrency, getStatusBadgeStyle } from '../../utils/formatters';

interface MobilePreviewProps {
  onOpenNewAppointment: () => void;
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({ onOpenNewAppointment }) => {
  const { 
    activeTenant, 
    appointments, 
    selectedDate, 
    metrics, 
    setCurrentMode, 
    cashSession, 
    updateAppointmentStatus,
    checkoutAppointment
  } = useVelora();

  const [mobileTab, setMobileTab] = useState<'agenda' | 'kpis' | 'cash'>('agenda');

  const todayApts = appointments.filter(a => a.date === selectedDate);

  return (
    <div className="flex-1 bg-zinc-950 p-4 flex flex-col items-center justify-center min-h-screen">
      {/* Top Bar with exit button */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 text-xs">
        <button
          onClick={() => setCurrentMode('business')}
          className="flex items-center gap-1 text-zinc-400 hover:text-white font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Desktop</span>
        </button>

        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Smartphone className="w-4 h-4" />
          <span>VELORA Mobile (PWA)</span>
        </div>
      </div>

      {/* Smartphone frame */}
      <div className="w-full max-w-sm bg-zinc-950 border-4 border-zinc-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[750px] relative">
        {/* Dynamic Island / Notch */}
        <div className="h-6 bg-black flex items-center justify-center relative">
          <div className="w-24 h-4 bg-zinc-900 rounded-full" />
        </div>

        {/* Mobile Header */}
        <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={activeTenant.logo}
              alt={activeTenant.name}
              className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
            />
            <div>
              <div className="font-bold text-white text-xs">{activeTenant.name}</div>
              <div className="text-[10px] text-zinc-400">Mobile Barbershop &amp; Studio</div>
            </div>
          </div>

          <button
            onClick={onOpenNewAppointment}
            className="w-7 h-7 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-md font-bold"
            title="Novo Encaixe"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mobileTab === 'agenda' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Agenda de Hoje ({todayApts.length})</span>
                </span>
                <span className="text-[10px] text-zinc-400">{selectedDate}</span>
              </div>

              {todayApts.length > 0 ? (
                todayApts.map(apt => {
                  const badge = getStatusBadgeStyle(apt.status);

                  return (
                    <div
                      key={apt.id}
                      className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-white text-sm">{apt.customerName}</div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {apt.serviceName} • {apt.professionalName}
                          </div>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[11px]">
                        <span className="font-mono text-zinc-300">
                          {apt.startTime} - {apt.endTime}
                        </span>
                        <span className="font-mono font-bold text-amber-400">
                          {formatCurrency(apt.priceInCents)}
                        </span>
                      </div>

                      {apt.status === 'confirmed' && (
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                            className="flex-1 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 text-center"
                          >
                            Atender
                          </button>
                          <button
                            onClick={() => checkoutAppointment(apt.id, 'pix')}
                            className="flex-1 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-[11px] text-center"
                          >
                            Cobrar Pix
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-zinc-500">
                  Nenhum agendamento para hoje.
                </div>
              )}
            </div>
          )}

          {mobileTab === 'kpis' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">Resumo do Dia</span>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Faturamento Hoje</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  {formatCurrency(metrics.todayRevenueInCents)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Ocupação</span>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                  {metrics.occupancyRatePercentage}%
                </div>
              </div>
            </div>
          )}

          {mobileTab === 'cash' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">Caixa do Estabelecimento</span>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <span className="text-xs text-zinc-400">Saldo da Gaveta</span>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
                  {formatCurrency(cashSession.currentAmountInCents)}
                </div>
                <div className="text-[10px] text-zinc-500 mt-2">
                  {cashSession.isOpen ? 'Caixa Aberto hoje' : 'Caixa Fechado'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="p-2 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around text-xs">
          <button
            onClick={() => setMobileTab('agenda')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
              mobileTab === 'agenda' ? 'text-amber-400 font-bold' : 'text-zinc-500'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px]">Agenda</span>
          </button>

          <button
            onClick={() => setMobileTab('kpis')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
              mobileTab === 'kpis' ? 'text-amber-400 font-bold' : 'text-zinc-500'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px]">Indicadores</span>
          </button>

          <button
            onClick={() => setMobileTab('cash')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
              mobileTab === 'cash' ? 'text-amber-400 font-bold' : 'text-zinc-500'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-[10px]">Caixa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
