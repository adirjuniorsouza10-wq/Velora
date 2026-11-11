import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Scissors, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Star, 
  DollarSign, 
  User, 
  Phone, 
  MessageCircle, 
  Play, 
  Check, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Appointment, StaffMember } from '../../types/velora';

export const ProfessionalPortalView: React.FC = () => {
  const { 
    staff, 
    activeTenant, 
    appointments, 
    updateAppointmentStatus, 
    checkoutAppointment, 
    selectedDate, 
    setCurrentMode,
    themeMode 
  } = useVelora();

  // Selected professional in the portal (defaults to the first staff member of tenant)
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staff[0]?.id || '');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const activeStaff = staff.find(s => s.id === selectedStaffId) || staff[0];

  if (!activeStaff) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-zinc-400">
        Nenhum profissional cadastrado para esta empresa.
      </div>
    );
  }

  // Filter appointments for this professional today
  const staffAppointments = appointments.filter(
    a => a.tenantId === activeTenant.id && a.professionalId === activeStaff.id && a.date === selectedDate
  );

  const completedToday = staffAppointments.filter(a => a.status === 'completed');
  const inProgressToday = staffAppointments.find(a => a.status === 'in_progress');
  const upcomingToday = staffAppointments.filter(a => a.status === 'confirmed');

  // Commissions
  const commissionRateDecimal = (activeStaff.commissionRate || 50) / 100;
  const todayEarningsInCents = completedToday.reduce((sum, a) => sum + Math.round(a.priceInCents * commissionRateDecimal), 0);
  const potentialTodayInCents = staffAppointments.reduce((sum, a) => sum + Math.round(a.priceInCents * commissionRateDecimal), 0);

  const handleStartAppointment = (aptId: string) => {
    updateAppointmentStatus(aptId, 'in_progress');
    setActionFeedback('Atendimento iniciado! Cronômetro em andamento.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleFinishAndCheckout = (aptId: string) => {
    checkoutAppointment(aptId, 'pix');
    setActionFeedback('Atendimento finalizado com sucesso! Comissão creditada.');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast Feedback */}
      {actionFeedback && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{actionFeedback}</span>
        </div>
      )}

      {/* Top Banner: Professional Environment Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={activeStaff.avatar}
            alt={activeStaff.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/60 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                Ambiente 02 • VELORA PROFESSIONAL
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {activeStaff.rating.toFixed(1)}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5">{activeStaff.name}</h1>
            <p className="text-xs text-zinc-400 flex items-center gap-2">
              <span>{activeTenant.name}</span>
              <span>•</span>
              <span className="text-zinc-300 font-medium">{activeStaff.specialties.join(', ')}</span>
            </p>
          </div>
        </div>

        {/* Professional Switcher (Simulador de Barbeiro) */}
        <div className="flex items-center gap-3 bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
          <User className="w-4 h-4 text-zinc-400" />
          <div className="text-xs">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">Trocar Barbeiro:</span>
            <select
              value={selectedStaffId}
              onChange={e => setSelectedStaffId(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
            >
              {staff.map(s => (
                <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                  {s.name} ({s.role === 'owner' ? 'Fundador' : 'Barbeiro'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards for the Professional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Minha Comissão Hoje */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Minha Comissão Hoje</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-tabular">
            {formatCurrency(todayEarningsInCents)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Potencial total no dia: <strong className="text-white">{formatCurrency(potentialTodayInCents)}</strong>
          </p>
        </div>

        {/* Atendimentos Hoje */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Cortes / Agenda Hoje</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-tabular">
            {completedToday.length} / {staffAppointments.length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            {upcomingToday.length} agendamentos a realizar
          </p>
        </div>

        {/* Taxa de Comissão */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Minha Taxa de Repasse</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-tabular">
            {activeStaff.commissionRate}%
          </div>
          <p className="text-[11px] text-blue-400 font-semibold mt-1">
            Contrato transparente VELORA
          </p>
        </div>

        {/* Histórico Geral */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Total de Cortes Realizados</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-tabular">
            {activeStaff.completedAppointmentsCount}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Clientes atendidos na plataforma
          </p>
        </div>
      </div>

      {/* Main Column: Em Atendimento Agora + Fila de Clientes */}
      <div className="space-y-4">
        {/* Em Atendimento Atualmente */}
        {inProgressToday && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-950 border-2 border-amber-500/60 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Na Cadeira Agora (Em Atendimento)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-300">
                Iniciado às {inProgressToday.startTime}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <h3 className="text-lg font-bold text-white">{inProgressToday.customerName}</h3>
                <p className="text-xs text-zinc-300 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold text-amber-300">{inProgressToday.serviceName}</span>
                  <span>•</span>
                  <span>Valor: {formatCurrency(inProgressToday.priceInCents)}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">
                    Sua Comissão: {formatCurrency(Math.round(inProgressToday.priceInCents * commissionRateDecimal))}
                  </span>
                </p>
                {inProgressToday.notes && (
                  <p className="text-[11px] text-zinc-400 mt-1.5 italic bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                    "{inProgressToday.notes}"
                  </p>
                )}
              </div>

              <button
                onClick={() => handleFinishAndCheckout(inProgressToday.id)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Finalizar Corte &amp; Receber Comissão</span>
              </button>
            </div>
          </div>
        )}

        {/* Lista de Atendimentos do Dia */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Sua Agenda Hoje ({selectedDate})</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Controle o fluxo dos seus clientes e inicie os atendimentos com 1 clique:
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
              {staffAppointments.length} agendamentos
            </span>
          </div>

          <div className="space-y-2.5">
            {staffAppointments.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-xs">
                Nenhum agendamento marcado para este profissional nesta data.
              </div>
            ) : (
              staffAppointments.map((apt) => {
                const commissionInCents = Math.round(apt.priceInCents * commissionRateDecimal);
                return (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      apt.status === 'in_progress'
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                        : apt.status === 'completed'
                        ? 'bg-zinc-950/60 border-zinc-800/80 opacity-75'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 text-center shrink-0">
                        <span className="text-sm font-mono font-bold text-white block">
                          {apt.startTime}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {apt.durationMinutes} min
                        </span>
                      </div>

                      <div className="h-8 w-[1px] bg-zinc-800 hidden sm:block" />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{apt.customerName}</span>
                          {apt.status === 'completed' && (
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">
                              Concluído
                            </span>
                          )}
                          {apt.status === 'in_progress' && (
                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30">
                              Em Atendimento
                            </span>
                          )}
                          {apt.status === 'confirmed' && (
                            <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded border border-blue-500/30">
                              Confirmado
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span className="text-amber-300 font-medium">{apt.serviceName}</span>
                          <span>•</span>
                          <span>Valor: {formatCurrency(apt.priceInCents)}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            Sua Comissão: {formatCurrency(commissionInCents)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center">
                      <a
                        href={`https://wa.me/55${apt.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Olá ${apt.customerName}! Aqui é o ${activeStaff.name} da ${activeTenant.name}. Seu horário para ${apt.serviceName} está confirmado para hoje às ${apt.startTime}. Te aguardo!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 transition-colors"
                        title="Avisar cliente pelo WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleStartAppointment(apt.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Iniciar Corte</span>
                        </button>
                      )}

                      {apt.status === 'in_progress' && (
                        <button
                          onClick={() => handleFinishAndCheckout(apt.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Finalizar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
