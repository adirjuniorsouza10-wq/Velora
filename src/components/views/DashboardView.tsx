import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Play, 
  Check, 
  MessageCircle, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  UserPlus,
  ShoppingBag,
  X,
  CalendarPlus,
  Phone,
  Mail,
  Tag,
  CreditCard
} from 'lucide-react';
import { formatCurrency, formatDatePtBR } from '../../utils/formatters';
import { Appointment, PaymentMethod } from '../../types/velora';

interface DashboardViewProps {
  onOpenNewAppointment: () => void;
  onOpenBookingPage: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onOpenNewAppointment, 
  onOpenBookingPage 
}) => {
  const { 
    activeTenant, 
    metrics, 
    appointments, 
    selectedDate, 
    updateAppointmentStatus, 
    checkoutAppointment, 
    setActiveTab,
    staff,
    addCustomer,
    addTransaction
  } = useVelora();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // FAB Speed Dial state
  const [isFabOpen, setIsFabOpen] = useState(false);

  // Quick "New Client" modal state
  const [newClientModalOpen, setNewClientModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPreferences, setClientPreferences] = useState('');
  const [clientIsVip, setClientIsVip] = useState(false);

  // Quick "New Sale" modal state
  const [newSaleModalOpen, setNewSaleModalOpen] = useState(false);
  const [saleDescription, setSaleDescription] = useState('Pomada Matte Modeladora');
  const [saleCategory, setSaleCategory] = useState('Produtos');
  const [saleAmountReais, setSaleAmountReais] = useState(45);
  const [salePaymentMethod, setSalePaymentMethod] = useState<PaymentMethod>('pix');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;

    addCustomer({
      tenantId: activeTenant.id,
      name: clientName,
      phone: clientPhone,
      email: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      notes: 'Cadastrado via Ações Rápidas (FAB)',
      preferences: clientPreferences || 'Corte e barba habitual',
      tags: clientIsVip ? ['VIP', 'Cliente Frequente'] : ['Novo'],
      isVip: clientIsVip
    });

    setNewClientModalOpen(false);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setClientPreferences('');
    setClientIsVip(false);
    showToast(`Cliente ${clientName} cadastrado com sucesso!`);
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleDescription.trim()) return;

    addTransaction({
      tenantId: activeTenant.id,
      type: 'income',
      category: saleCategory,
      description: saleDescription,
      amountInCents: Math.round(Number(saleAmountReais) * 100),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod: salePaymentMethod
    });

    setNewSaleModalOpen(false);
    setSaleDescription('Pomada Matte Modeladora');
    setSaleAmountReais(45);
    showToast(`Venda de ${formatCurrency(Math.round(Number(saleAmountReais) * 100))} lançada no caixa!`);
  };

  // Filtrar os agendamentos de HOJE
  const todayAppointments = appointments.filter(a => a.date === selectedDate);
  const inProgressApt = todayAppointments.find(a => a.status === 'in_progress');
  const upcomingApts = todayAppointments.filter(a => a.status === 'confirmed');
  const completedApts = todayAppointments.filter(a => a.status === 'completed');

  const handleStartAppointment = (id: string) => {
    updateAppointmentStatus(id, 'in_progress');
    showToast('Atendimento iniciado na cadeira!');
  };

  const handleFinishAppointment = (id: string) => {
    checkoutAppointment(id, 'pix');
    showToast('Atendimento concluído com sucesso e lançado no caixa!');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Toast de feedback */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. BANNER MAIS LIMPO: Título Legível & Uma Ação Principal */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Hoje na {activeTenant.name} • {formatDatePtBR(selectedDate)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agenda &amp; Operação do Dia
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Acompanhe os clientes na cadeira, próximos horários e o fluxo da equipe com máxima clareza.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenBookingPage}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Abrir página pública de agendamento do cliente"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Página de Agendamento</span>
          </button>

          {/* Única ação principal evidente */}
          <button
            onClick={onOpenNewAppointment}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* 2. MAIS DESTAQUE À AGENDA DE HOJE E PRÓXIMOS ATENDIMENTOS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Atendimentos de Hoje ({todayAppointments.length})
              </h2>
              <p className="text-xs text-slate-500">
                Fila de horários organizada em ordem cronológica
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('agenda')}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Ver grade completa da semana</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cartão de destaque: Na Cadeira Agora (se houver atendimento em andamento) */}
        {inProgressApt && (
          <div className="p-4 rounded-xl bg-amber-50/70 border-2 border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider shrink-0 mt-0.5">
                Na Cadeira Agora
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{inProgressApt.customerName}</h3>
                  <span className="text-xs font-mono text-slate-500">Iniciado às {inProgressApt.startTime}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  <strong className="text-amber-800">{inProgressApt.serviceName}</strong> • Barbeiro: {inProgressApt.professionalName} • Valor: {formatCurrency(inProgressApt.priceInCents)}
                </p>
                {inProgressApt.notes && (
                  <p className="text-[11px] text-slate-500 italic mt-1 bg-white/80 p-2 rounded-lg border border-amber-200/60 inline-block">
                    "{inProgressApt.notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => handleFinishAppointment(inProgressApt.id)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Finalizar Atendimento</span>
              </button>
            </div>
          </div>
        )}

        {/* Lista de Atendimentos */}
        <div className="space-y-2.5">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Nenhum agendamento marcado para esta data. Clique em "Novo Agendamento" para reservar um horário.
            </div>
          ) : (
            todayAppointments.map(apt => {
              const isCompleted = apt.status === 'completed';
              const isInProgress = apt.status === 'in_progress';
              const isConfirmed = apt.status === 'confirmed';

              return (
                <div
                  key={apt.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isInProgress
                      ? 'bg-amber-50/50 border-amber-200'
                      : isCompleted
                      ? 'bg-slate-50/80 border-slate-200/60 opacity-80'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Horário em destaque */}
                    <div className="w-16 text-center shrink-0 py-1 px-2 rounded-lg bg-slate-100 border border-slate-200">
                      <span className="text-xs font-mono font-bold text-slate-800 block">
                        {apt.startTime}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {apt.durationMinutes} min
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{apt.customerName}</span>

                        {isCompleted && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Concluído
                          </span>
                        )}
                        {isInProgress && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                            Em Andamento
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            Aguardando
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-medium text-slate-700">{apt.serviceName}</span>
                        <span>•</span>
                        <span>Barbeiro: <strong>{apt.professionalName}</strong></span>
                        <span>•</span>
                        <span>{formatCurrency(apt.priceInCents)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações do Atendimento */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <a
                      href={`https://wa.me/55${apt.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Olá ${apt.customerName}! Mensagem da ${activeTenant.name}: Seu horário de ${apt.serviceName} está confirmado para hoje às ${apt.startTime}. Te esperamos!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-emerald-700 transition-colors"
                      title="Enviar lembrete pelo WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>

                    {isConfirmed && (
                      <button
                        onClick={() => handleStartAppointment(apt.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span>Chamar p/ Cadeira</span>
                      </button>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => handleFinishAppointment(apt.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
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

      {/* 3. DESEMPENHO DO NEGÓCIO SIMPLIFICADO: Poucos dados importantes, fáceis de comparar */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Desempenho &amp; Metas do Dia
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Indicador 1: Faturamento Hoje */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block mb-1">Faturamento Hoje</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {formatCurrency(metrics.todayRevenueInCents)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Atendimentos faturados na data
            </p>
          </div>

          {/* Indicador 2: Clientes Atendidos Hoje */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block mb-1">Cortes Realizados</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {completedApts.length} <span className="text-sm font-normal text-slate-500">de {todayAppointments.length}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {upcomingApts.length} restantes na grade
            </p>
          </div>

          {/* Indicador 3: Faturamento do Mês vs Meta */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block mb-1">Faturamento do Mês</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {formatCurrency(metrics.monthRevenueInCents)}
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-600 h-full rounded-full" 
                style={{ width: `${Math.min(100, Math.round((metrics.monthRevenueInCents / metrics.monthlyGoalInCents) * 100))}%` }} 
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex justify-between">
              <span>Meta: {formatCurrency(metrics.monthlyGoalInCents)}</span>
              <strong className="text-slate-700">{Math.round((metrics.monthRevenueInCents / metrics.monthlyGoalInCents) * 100)}%</strong>
            </p>
          </div>

          {/* Indicador 4: Ticket Médio */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
            <span className="text-xs font-medium text-slate-500 block mb-1">Ticket Médio</span>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {formatCurrency(metrics.averageTicketInCents)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Média por atendimento na cadeira
            </p>
          </div>
        </div>
      </div>

      {/* 4. PAINEL DE IA DISCRETO: Acessível sem competir com a agenda */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-slate-700">
            <strong>Assistente VELORA:</strong> Há uma lacuna livre às 15:00 na cadeira do Iago. 2 clientes da lista de espera aceitam encaixe hoje.
          </span>
        </div>

        <button
          onClick={() => setActiveTab('ai')}
          className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          <span>Abrir Consultoria IA</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* BACKDROP OVERLAY WHEN FAB IS OPEN */}
      {isFabOpen && (
        <div 
          onClick={() => setIsFabOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 transition-opacity"
        />
      )}

      {/* FLOATING ACTION BUTTON (FAB) & SPEED DIAL MENU */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-2.5">
        {/* Speed Dial Menu Actions */}
        {isFabOpen && (
          <div className="flex flex-col items-end gap-2 mb-1 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Action 1: Novo Agendamento */}
            <button
              onClick={() => {
                setIsFabOpen(false);
                onOpenNewAppointment();
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white text-slate-800 hover:bg-slate-50 border border-slate-200/90 shadow-md hover:shadow-lg transition-all text-xs font-semibold group cursor-pointer"
            >
              <span className="text-slate-600 group-hover:text-slate-900">Novo Agendamento</span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <CalendarPlus className="w-4 h-4" />
              </div>
            </button>

            {/* Action 2: Novo Cliente */}
            <button
              onClick={() => {
                setIsFabOpen(false);
                setNewClientModalOpen(true);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white text-slate-800 hover:bg-slate-50 border border-slate-200/90 shadow-md hover:shadow-lg transition-all text-xs font-semibold group cursor-pointer"
            >
              <span className="text-slate-600 group-hover:text-slate-900">Novo Cliente</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
            </button>

            {/* Action 3: Nova Venda / Caixa */}
            <button
              onClick={() => {
                setIsFabOpen(false);
                setNewSaleModalOpen(true);
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white text-slate-800 hover:bg-slate-50 border border-slate-200/90 shadow-md hover:shadow-lg transition-all text-xs font-semibold group cursor-pointer"
            >
              <span className="text-slate-600 group-hover:text-slate-900">Nova Venda / Caixa</span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </button>

            {/* Action 4: Ver Link de Agendamento */}
            <button
              onClick={() => {
                setIsFabOpen(false);
                onOpenBookingPage();
              }}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white text-slate-800 hover:bg-slate-50 border border-slate-200/90 shadow-md hover:shadow-lg transition-all text-xs font-semibold group cursor-pointer"
            >
              <span className="text-slate-600 group-hover:text-slate-900">Link de Agendamento</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {/* Main Floating Action Button */}
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`h-13 w-13 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer active:scale-95 ${
            isFabOpen
              ? 'bg-slate-900 text-white rotate-45 hover:bg-slate-800 shadow-slate-900/30'
              : 'bg-amber-600 hover:bg-amber-700 text-white hover:shadow-xl shadow-amber-600/30'
          }`}
          title={isFabOpen ? 'Fechar ações' : 'Ações Rápidas (Agendamento, Cliente, Venda)'}
          aria-label="Ações Rápidas"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* QUICK NEW CLIENT MODAL */}
      {newClientModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Cliente</h3>
                  <p className="text-[11px] text-slate-500">Unidade {activeTenant.name}</p>
                </div>
              </div>
              <button
                onClick={() => setNewClientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-semibold mb-1 block">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Matheus Guimarães"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold mb-1 block">Telefone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 98888-7777"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold mb-1 block">E-mail (Opcional)</label>
                <input
                  type="email"
                  placeholder="matheus@exemplo.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold mb-1 block">Preferências de Corte / Barba</label>
                <input
                  type="text"
                  placeholder="Ex: Degrade navalhado, barba alinhada com toalha quente"
                  value={clientPreferences}
                  onChange={e => setClientPreferences(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="clientVipCheck"
                  checked={clientIsVip}
                  onChange={e => setClientIsVip(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="clientVipCheck" className="text-slate-700 text-xs font-medium cursor-pointer">
                  Marcar como Cliente VIP / Frequente
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewClientModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK NEW SALE / CAIXA MODAL */}
      {newSaleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Registrar Venda / Receita</h3>
                  <p className="text-[11px] text-slate-500">Lançamento direto no fluxo de caixa</p>
                </div>
              </div>
              <button
                onClick={() => setNewSaleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-semibold mb-1 block">Item ou Produto Vendido *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pomada Efeito Matte 80g"
                  value={saleDescription}
                  onChange={e => setSaleDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold mb-1 block">Categoria</label>
                  <select
                    value={saleCategory}
                    onChange={e => setSaleCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Produtos">Produtos</option>
                    <option value="Bebidas">Bebidas / Café</option>
                    <option value="Serviço Adicional">Serviço Adicional</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold mb-1 block">Valor em Reais (R$) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={saleAmountReais}
                    onChange={e => setSaleAmountReais(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-sm outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold mb-1 block">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'pix', label: 'Pix Instantâneo' },
                    { id: 'credit_card', label: 'Cartão de Crédito' },
                    { id: 'debit_card', label: 'Cartão de Débito' },
                    { id: 'cash', label: 'Dinheiro Espécie' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSalePaymentMethod(m.id as PaymentMethod)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        salePaymentMethod === m.id
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewSaleModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  Confirmar Venda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
