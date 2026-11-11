import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Crown, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Search, 
  Plus, 
  ShieldCheck, 
  Flame, 
  Check, 
  ArrowUpRight,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ClubView: React.FC = () => {
  const { 
    clubPlans, 
    clubMembers, 
    activeTenant, 
    toggleMemberStatus, 
    customers, 
    staff,
    themeMode 
  } = useVelora();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending_payment' | 'suspended'>('all');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [infoAccordionOpen, setInfoAccordionOpen] = useState(true);

  // New Member Modal State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedPlanId, setSelectedPlanId] = useState(clubPlans[0]?.id || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix_recorrente' | 'credit_card'>('pix_recorrente');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter members
  const filteredMembers = clubMembers.filter(member => {
    const matchesSearch = member.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.customerPhone.includes(searchQuery) ||
                          member.planName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Club Metrics
  const activeMembers = clubMembers.filter(m => m.status === 'active');
  const totalMRRInCents = clubMembers
    .filter(m => m.status === 'active')
    .reduce((sum, m) => {
      const plan = clubPlans.find(p => p.id === m.planId);
      return sum + (plan ? plan.monthlyPriceInCents : 0);
    }, 0);

  const averageVisits = activeMembers.length > 0
    ? (activeMembers.reduce((acc, m) => acc + m.usedAppointmentsThisMonth, 0) / activeMembers.length).toFixed(1)
    : '0';

  const handleEnrollMember = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === selectedCustomerId);
    const plan = clubPlans.find(p => p.id === selectedPlanId);
    if (!cust || !plan) return;

    // Simulate adding member
    clubMembers.unshift({
      id: `member-${Date.now()}`,
      tenantId: activeTenant.id,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      planId: plan.id,
      planName: plan.name,
      status: 'active',
      sinceDate: new Date().toISOString().split('T')[0],
      nextRenewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usedAppointmentsThisMonth: 0,
      limitAppointmentsThisMonth: plan.maxAppointmentsPerMonth,
      paymentMethod: selectedPaymentMethod
    });

    setShowAddMemberModal(false);
    setSuccessToast(`Cliente ${cust.name} cadastrado com sucesso no plano ${plan.name}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              1. VELORA CLUB
            </span>
            <span className="text-xs text-zinc-400 font-medium">Recorrência &amp; Fidelidade</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Clube de Assinaturas VELORA
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Receita previsível todo mês, agenda sempre cheia e clientes fiéis para {activeTenant.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Assinante</span>
          </button>
        </div>
      </div>

      {/* High Visibility KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* MRR */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Receita Recorrente (MRR)</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-tabular">
            {formatCurrency(totalMRRInCents)}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <span>+18.4%</span>
            <span className="text-zinc-500 font-normal">frente ao mês anterior</span>
          </p>
        </div>

        {/* Assinantes Ativos */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Membros Ativos</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-tabular">
            {activeMembers.length} <span className="text-sm font-normal text-zinc-400">assinantes</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            <strong className="text-amber-400 font-semibold">{clubMembers.length - activeMembers.length} pendentes</strong> de confirmação
          </p>
        </div>

        {/* Frequência Média */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Frequência Mensal</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-tabular">
            {averageVisits} <span className="text-sm font-normal text-zinc-400">visitas / membro</span>
          </div>
          <p className="text-[11px] text-blue-400 font-semibold mt-1">
            Taxa de retenção: 96.2%
          </p>
        </div>

        {/* Cobrança Automática */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-400">Meio Mais Usado</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            Pix Recorrente
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Zero inadimplência e taxa reduzida
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEÇÃO OBRIGATÓRIA DESTACADA: "Confira informações importantes"           */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-zinc-900/90 to-zinc-950 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Confira informações importantes
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-zinc-950 uppercase">
                  Regras do Clube
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Diretrizes contratuais, regras de utilização e boas práticas para clientes e equipe da barbearia.
              </p>
            </div>
          </div>

          <button
            onClick={() => setInfoAccordionOpen(!infoAccordionOpen)}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4 shrink-0 transition-colors"
          >
            {infoAccordionOpen ? 'Recolher detalhes' : 'Expandir detalhes'}
          </button>
        </div>

        {infoAccordionOpen && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4 border-t border-zinc-800">
            {/* Regra 1: Recorrência */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>1. Cobrança e Renovação Automática</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                A mensalidade é cobrada a cada <strong>30 dias corridos</strong> de forma automática via Pix Recorrente ou Cartão de Crédito. Sem necessidade de passar na recepção para pagar a cada corte.
              </p>
            </div>

            {/* Regra 2: Validade e Atendimentos */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>2. Utilização e Não Acumulatividade</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Os atendimentos inclusos no plano devem ser desfrutados dentro do <strong>ciclo do mês vigente</strong>. Atendimentos não realizados não acumulam para o mês seguinte.
              </p>
            </div>

            {/* Regra 3: Agendamento Prioritário */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>3. Agendamento Prioritário</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Membros do VELORA CLUB têm <strong>acesso prioritário</strong> à grade de horários via link público e WhatsApp, especialmente nos horários nobres de quinta a sábado.
              </p>
            </div>

            {/* Regra 4: Desconto em Produtos */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>4. Desconto Exclusivo na Loja</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Todos os assinantes ativos possuem <strong>10% a 20% de desconto imediato</strong> em pomadas, óleos, balms e produtos de home care vendidos no estabelecimento.
              </p>
            </div>

            {/* Regra 5: Cancelamento Livre */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>5. Cancelamento Sem Multa</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                O cliente pode cancelar ou pausar seu plano quando quiser, solicitando com até <strong>48h de antecedência</strong> da próxima fatura sem fidelidade forçada nem multas rescisórias.
              </p>
            </div>

            {/* Regra 6: Política de No-Show */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>6. Pontualidade e Desmarcações</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Para manter a excelência para todos, solicita-se reagendamento com no mínimo <strong>2 horas de antecedência</strong> em caso de imprevisto, liberando o horário para outro cliente.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Plans Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Planos do VELORA CLUB
            </h2>
            <p className="text-xs text-zinc-400">
              Pacotes ativos configurados para {activeTenant.name}:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clubPlans.map((plan) => {
            const isTopTier = plan.badge?.includes('Ilimitado') || plan.badge?.includes('Mais');
            return (
              <div 
                key={plan.id}
                className={`p-5 rounded-2xl bg-zinc-900/90 border transition-all flex flex-col justify-between ${
                  isTopTier 
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' 
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-white text-base">{plan.name}</span>
                    {plan.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-zinc-950 uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 mb-4">{plan.tagline}</p>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-tabular">
                        {formatCurrency(plan.monthlyPriceInCents)}
                      </span>
                      <span className="text-xs text-zinc-400">/mês</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">
                      {plan.activeMembersCount} assinantes ativos neste plano
                    </div>
                  </div>

                  {/* Feature check list */}
                  <div className="space-y-2 pt-3 border-t border-zinc-800 mb-4 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {plan.maxAppointmentsPerMonth >= 999 
                          ? 'Cortes e Barbas ILIMITADOS' 
                          : `Até ${plan.maxAppointmentsPerMonth} atendimentos / mês`}
                      </span>
                    </div>

                    {plan.servicesIncluded.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-zinc-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 text-zinc-300">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>{plan.discountOnProductsPercent}% OFF</strong> em qualquer produto</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setShowAddMemberModal(true);
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isTopTier
                        ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    <span>Matricular Cliente Neste Plano</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Members Directory */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">
              Assinantes do VELORA CLUB
            </h2>
            <p className="text-xs text-zinc-400">
              Gerencie status, ciclos de cobrança e atendimentos utilizados:
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente, telefone ou plano..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 w-52 sm:w-64"
              />
            </div>

            {/* Status Tabs */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Todos ({clubMembers.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === 'active' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Ativos ({activeMembers.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending_payment')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === 'pending_payment' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Pendentes
              </button>
            </div>
          </div>
        </div>

        {/* Table of Members */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Cliente / Contato</th>
                <th className="py-2.5 px-3">Plano</th>
                <th className="py-2.5 px-3">Uso no Mês</th>
                <th className="py-2.5 px-3">Próxima Fatura</th>
                <th className="py-2.5 px-3">Forma Pagto</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-zinc-500 text-xs">
                    Nenhum assinante encontrado para o filtro aplicado.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const isUnlimited = member.limitAppointmentsThisMonth >= 999;
                  const usagePercentage = isUnlimited 
                    ? 100 
                    : Math.min(100, Math.round((member.usedAppointmentsThisMonth / member.limitAppointmentsThisMonth) * 100));

                  return (
                    <tr key={member.id} className="hover:bg-zinc-800/40 transition-colors">
                      {/* Name & Phone */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{member.customerName}</div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1 font-mono">
                          <span>{member.customerPhone}</span>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3 px-3 font-medium text-amber-300">
                        {member.planName}
                      </td>

                      {/* Usage */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">
                            {member.usedAppointmentsThisMonth} / {isUnlimited ? '∞' : member.limitAppointmentsThisMonth}
                          </span>
                          <span className="text-[10px] text-zinc-400">visitas</span>
                        </div>
                        <div className="w-20 bg-zinc-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              usagePercentage >= 100 ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${usagePercentage}%` }}
                          />
                        </div>
                      </td>

                      {/* Renewal */}
                      <td className="py-3 px-3 text-zinc-300 font-mono text-[11px]">
                        {member.nextRenewalDate}
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-zinc-800 text-zinc-300">
                          {member.paymentMethod === 'pix_recorrente' ? '⚡ Pix Recorrente' : '💳 Cartão de Crédito'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {member.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Ativo
                          </span>
                        )}
                        {member.status === 'pending_payment' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Pendente
                          </span>
                        )}
                        {member.status === 'suspended' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                            Suspenso
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleMemberStatus(member.id)}
                            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium transition-colors"
                            title="Alternar entre Ativo e Pendente"
                          >
                            {member.status === 'active' ? 'Pausar' : 'Ativar'}
                          </button>

                          <a
                            href={`https://wa.me/55${member.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Olá ${member.customerName}! Mensagem do VELORA CLUB (${activeTenant.name}): Seu plano ${member.planName} está ativo e com agendamentos liberados. Vamos agendar seu horário desta semana?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition-colors"
                            title="Enviar WhatsApp para o membro"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Club Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Matricular no VELORA CLUB</h3>
              </div>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollMember} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Selecione o Cliente</label>
                <select
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white outline-none focus:border-amber-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Plano de Assinatura</label>
                <select
                  value={selectedPlanId}
                  onChange={e => setSelectedPlanId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white outline-none focus:border-amber-500"
                >
                  {clubPlans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(p.monthlyPriceInCents)}/mês
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Forma de Cobrança Recorrente</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('pix_recorrente')}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                      selectedPaymentMethod === 'pix_recorrente'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                    }`}
                  >
                    ⚡ Pix Recorrente
                    <span className="block text-[10px] font-normal text-zinc-400">Sem taxas de maquininha</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('credit_card')}
                    className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                      selectedPaymentMethod === 'credit_card'
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                    }`}
                  >
                    💳 Cartão de Crédito
                    <span className="block text-[10px] font-normal text-zinc-400">Débito todo dia 10</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-300">Benefícios ativados instantaneamente:</div>
                <div>• Liberação de agendamentos prioritários para este cliente</div>
                <div>• Desconto automático no caixa ao comprar pomadas e cosméticos</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
                >
                  Confirmar Adesão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
