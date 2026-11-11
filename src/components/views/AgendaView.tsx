import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  XCircle, 
  CreditCard, 
  Phone, 
  Filter,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { 
  formatCurrency, 
  formatDatePtBR, 
  getWeekdayName, 
  getStatusBadgeStyle 
} from '../../utils/formatters';
import { Appointment, PaymentMethod } from '../../types/velora';

interface AgendaViewProps {
  onOpenNewAppointment: (prefilled?: { date: string; time: string; professionalId?: string }) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({ onOpenNewAppointment }) => {
  const { 
    selectedDate, 
    setSelectedDate, 
    staff, 
    appointments, 
    activeStaffFilter, 
    setActiveStaffFilter,
    updateAppointmentStatus,
    checkoutAppointment,
    cancelAppointment
  } = useVelora();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('pix');

  // Filter professionals
  const displayedStaff = activeStaffFilter === 'all' 
    ? staff 
    : staff.filter(s => s.id === activeStaffFilter);

  // Time grid slots from 09:00 to 19:30 every 30 mins
  const timeSlots: string[] = [];
  for (let h = 9; h <= 19; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 19) {
      timeSlots.push(`${String(h).padStart(2, '0')}:30`);
    }
  }

  // Navigate date
  const changeDateByDays = (days: number) => {
    const parts = selectedDate.split('-');
    const cur = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    cur.setDate(cur.getDate() + days);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
  };

  // Find appointment for a given professional and slot
  const getAppointmentsForSlot = (professionalId: string, time: string) => {
    return appointments.filter(a => {
      if (a.date !== selectedDate || a.professionalId !== professionalId) return false;
      if (a.status === 'cancelled') return false;
      return a.startTime === time;
    });
  };

  const handleCheckoutSubmit = () => {
    if (!selectedAppointment) return;
    checkoutAppointment(selectedAppointment.id, selectedPaymentMethod);
    setCheckoutModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-zinc-950 overflow-hidden transition-colors">
      {/* Top Action & Date Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-xl p-1 shadow-xs">
            <button
              onClick={() => changeDateByDays(-1)}
              className="p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
              title="Dia anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-900 dark:text-white outline-none cursor-pointer"
              />
            </div>
            <button
              onClick={() => changeDateByDays(1)}
              className="p-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
              title="Próximo dia"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:block">
            <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {getWeekdayName(selectedDate)}
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 ml-2">
              ({formatDatePtBR(selectedDate)})
            </span>
          </div>

          <button
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setSelectedDate(today);
            }}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-medium border border-slate-200 dark:border-zinc-700 transition-colors"
          >
            Hoje
          </button>
        </div>

        {/* Staff Filter Tabs & Add appointment */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 ml-2" />
            <select
              value={activeStaffFilter}
              onChange={e => setActiveStaffFilter(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-zinc-200 outline-none pr-3 cursor-pointer text-xs"
            >
              <option value="all" className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-white">Todos os profissionais ({staff.length})</option>
              {staff.map(s => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-white">{s.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onOpenNewAppointment({ date: selectedDate, time: '10:00' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Encaixe / Agendar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Columns by Professional */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="min-w-[850px] flex flex-col">
          {/* Header Row: Professional Avatars & Names */}
          <div className="flex border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/80 sticky top-0 z-20 backdrop-blur-md">
            <div className="w-20 p-3 text-center text-xs font-bold text-slate-400 dark:text-zinc-500 border-r border-slate-200 dark:border-zinc-800 shrink-0">
              Horário
            </div>
            <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${displayedStaff.length}, minmax(220px, 1fr))` }}>
              {displayedStaff.map(pro => {
                const proAppointmentsToday = appointments.filter(
                  a => a.date === selectedDate && a.professionalId === pro.id && a.status !== 'cancelled'
                );

                return (
                  <div key={pro.id} className="p-3 border-r border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{pro.name}</div>
                        <div className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                          <span className="text-amber-700 dark:text-amber-400 font-semibold">★ {pro.rating}</span>
                          <span>•</span>
                          <span>{proAppointmentsToday.length} agendados</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenNewAppointment({ date: selectedDate, time: '09:00', professionalId: pro.id })}
                      className="p-1 text-slate-400 dark:text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                      title="Criar encaixe para este profissional"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Slot Rows */}
          <div className="divide-y divide-slate-200/80 dark:divide-zinc-900">
            {timeSlots.map(slot => (
              <div key={slot} className="flex min-h-[70px] group/slot hover:bg-slate-100/50 dark:hover:bg-zinc-900/30 transition-colors">
                {/* Time column */}
                <div className="w-20 p-2.5 text-center text-xs font-mono text-slate-400 dark:text-zinc-500 border-r border-slate-200 dark:border-zinc-800 shrink-0 select-none">
                  {slot}
                </div>

                {/* Professional Columns for this slot */}
                <div 
                  className="flex-1 grid" 
                  style={{ gridTemplateColumns: `repeat(${displayedStaff.length}, minmax(220px, 1fr))` }}
                >
                  {displayedStaff.map(pro => {
                    const apts = getAppointmentsForSlot(pro.id, slot);

                    return (
                      <div 
                        key={pro.id} 
                        className="p-1.5 border-r border-slate-200/60 dark:border-zinc-800/60 relative group/cell"
                      >
                        {apts.length > 0 ? (
                          apts.map(apt => {
                            const badge = getStatusBadgeStyle(apt.status);

                            return (
                              <div
                                key={apt.id}
                                onClick={() => setSelectedAppointment(apt)}
                                className={`h-full p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md bg-white dark:bg-zinc-900/90 ${badge.bg} flex flex-col justify-between`}
                              >
                                <div className="flex items-start justify-between gap-1 mb-1">
                                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {apt.customerName}
                                  </div>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black/40 text-slate-700 dark:text-zinc-300 shrink-0 border border-slate-200/60 dark:border-white/10">
                                    {apt.startTime} - {apt.endTime}
                                  </span>
                                </div>

                                <div className="text-[11px] font-medium text-amber-800 dark:text-amber-200/90 truncate">
                                  {apt.serviceName}
                                </div>

                                <div className="mt-2 flex items-center justify-between text-[10px]">
                                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                                    {formatCurrency(apt.priceInCents)}
                                  </span>
                                  <span className="capitalize px-1.5 py-0.5 rounded-full bg-white/80 dark:bg-black/30 border border-slate-200 dark:border-white/10 font-medium">
                                    {badge.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          /* Empty slot clickable to create an appointment / encaixe */
                          <button
                            onClick={() => onOpenNewAppointment({ date: selectedDate, time: slot, professionalId: pro.id })}
                            className="w-full h-full min-h-[55px] rounded-lg border border-dashed border-transparent group-hover/cell:border-slate-300 dark:group-hover/cell:border-zinc-800 hover:!border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-500/5 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-all text-xs text-slate-500 dark:text-zinc-500 hover:text-amber-700 dark:hover:text-amber-400 gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Agendar</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Details & Actions Drawer / Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between mb-4 border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                    Detalhes do Atendimento
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(selectedAppointment.status).bg}`}>
                    {getStatusBadgeStyle(selectedAppointment.status).label}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedAppointment.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer summary */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-semibold">Cliente</div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{selectedAppointment.customerName}</div>
                  <div className="text-slate-600 dark:text-zinc-400 flex items-center gap-1 mt-1">
                    <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{selectedAppointment.customerPhone}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/55${selectedAppointment.customerPhone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(selectedAppointment.customerName)}!%20Confirmamos%20seu%20agendamento%20na%20VELORA.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Appointment meta */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
                  <div className="text-slate-500 dark:text-zinc-400 text-[10px] uppercase font-semibold">Profissional</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedAppointment.professionalName}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
                  <div className="text-slate-500 dark:text-zinc-400 text-[10px] uppercase font-semibold">Horário &amp; Duração</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedAppointment.startTime} às {selectedAppointment.endTime} ({selectedAppointment.durationMinutes} min)
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
                  <div className="text-slate-500 dark:text-zinc-400 text-[10px] uppercase font-semibold">Valor do Serviço</div>
                  <div className="font-bold text-slate-900 dark:text-amber-400 font-mono text-sm mt-0.5">
                    {formatCurrency(selectedAppointment.priceInCents)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800">
                  <div className="text-slate-500 dark:text-zinc-400 text-[10px] uppercase font-semibold">Status de Pagamento</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5 capitalize">
                    {selectedAppointment.paymentStatus === 'paid' ? 'Pago (Finalizado)' : selectedAppointment.paymentStatus === 'deposit_paid' ? 'Sinal 30% Pago' : 'Pendente na recepção'}
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 bg-slate-50 dark:bg-zinc-950/60 rounded-xl border border-slate-200 dark:border-zinc-800/80">
                  <div className="text-slate-500 dark:text-zinc-400 text-[10px] uppercase font-semibold mb-1">Observações do Atendimento</div>
                  <p className="text-slate-700 dark:text-zinc-300 italic">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Quick Actions Row */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  cancelAppointment(selectedAppointment.id, 'Cancelado pelo painel');
                  setSelectedAppointment(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-semibold border border-rose-200 dark:border-rose-500/30 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>

              <div className="flex items-center gap-2">
                {selectedAppointment.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'in_progress');
                      setSelectedAppointment(prev => prev ? { ...prev, status: 'in_progress' } : null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-amber-300 dark:border-amber-500/40 text-xs font-bold transition-colors"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Iniciar Atendimento</span>
                  </button>
                )}

                {selectedAppointment.status !== 'completed' && (
                  <button
                    onClick={() => setCheckoutModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Finalizar &amp; Cobrar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout & Cash Receipt Modal */}
      {checkoutModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Recebimento &amp; Fechamento</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Lançamento automático de receita no caixa e comissão do profissional.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 mb-4 text-center">
              <span className="text-xs text-slate-500 dark:text-zinc-400">Total a Pagar</span>
              <div className="text-3xl font-black text-slate-900 dark:text-emerald-400 font-mono mt-1">
                {formatCurrency(selectedAppointment.priceInCents)}
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {selectedAppointment.serviceName} • {selectedAppointment.customerName}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Forma de Pagamento</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'pix', label: 'Pix Instantâneo', badge: 'Sem taxa' },
                  { id: 'credit_card', label: 'Cartão de Crédito', badge: '1x até 12x' },
                  { id: 'debit_card', label: 'Cartão de Débito', badge: 'À vista' },
                  { id: 'cash', label: 'Dinheiro Espécie', badge: 'Troco no caixa' }
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id as PaymentMethod)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold dark:bg-amber-500/15 dark:border-amber-500 dark:text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div>{method.label}</div>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400/80">{method.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold"
              >
                Voltar
              </button>
              <button
                onClick={handleCheckoutSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Confirmar Recebimento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
