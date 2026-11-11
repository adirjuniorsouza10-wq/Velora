import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Percent, 
  DollarSign, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Filter, 
  Download,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDatePtBR } from '../../utils/formatters';

export const CommissionsView: React.FC = () => {
  const { staff, appointments, activeTenant } = useVelora();
  const [selectedStaffId, setSelectedStaffId] = useState<string>('all');
  const [paidCommissions, setPaidCommissions] = useState<Record<string, boolean>>({});

  const filteredStaff = selectedStaffId === 'all' 
    ? staff 
    : staff.filter(s => s.id === selectedStaffId);

  // Calculate detailed commission metrics for each professional
  const breakdown = filteredStaff.map(member => {
    const memberAppointments = appointments.filter(
      a => a.professionalId === member.id && a.status === 'completed'
    );

    const totalRevenueInCents = memberAppointments.reduce((acc, a) => acc + a.priceInCents, 0);
    const commissionDueInCents = Math.round(totalRevenueInCents * (member.commissionRate / 100));
    const averageTicket = memberAppointments.length > 0 
      ? Math.round(totalRevenueInCents / memberAppointments.length) 
      : 0;

    return {
      member,
      appointments: memberAppointments,
      count: memberAppointments.length,
      totalRevenueInCents,
      commissionDueInCents,
      averageTicket,
      isPaid: !!paidCommissions[member.id]
    };
  });

  const grandTotalCommissions = breakdown.reduce((acc, b) => acc + b.commissionDueInCents, 0);
  const grandTotalBilled = breakdown.reduce((acc, b) => acc + b.totalRevenueInCents, 0);

  const toggleMarkPaid = (staffId: string) => {
    setPaidCommissions(prev => ({
      ...prev,
      [staffId]: !prev[staffId]
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Percent className="w-4 h-4" />
            <span>Repasses &amp; Comissões • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Comissões da Equipe</h1>
          <p className="text-xs text-zinc-400">
            Cálculo automático baseado em atendimentos concluídos e taxas contratuais individuais.
          </p>
        </div>

        {/* Filter by Staff */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400 ml-2" />
            <select
              value={selectedStaffId}
              onChange={e => setSelectedStaffId(e.target.value)}
              className="bg-transparent text-zinc-200 outline-none pr-3 cursor-pointer text-xs"
            >
              <option value="all">Toda a Equipe ({staff.length})</option>
              {staff.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Total Faturado pela Equipe</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {formatCurrency(grandTotalBilled)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Atendimentos finalizados no período</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-amber-400">Total de Comissões a Repassar</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {formatCurrency(grandTotalCommissions)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Taxas configuradas entre 45% e 65%</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Retenção Líquida da Casa</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {formatCurrency(grandTotalBilled - grandTotalCommissions)}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Margem bruta para o caixa do estabelecimento</div>
        </div>
      </div>

      {/* Breakdown per Professional Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Demonstrativo Individual por Barbeiro / Especialista
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {breakdown.map(item => (
            <div
              key={item.member.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.member.avatar}
                    alt={item.member.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/30"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.member.name}</h4>
                    <div className="text-xs text-amber-400/90 font-medium">
                      Taxa de Comissão: <strong className="font-mono">{item.member.commissionRate}%</strong>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {item.count} atendimentos concluídos
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  item.isPaid 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {item.isPaid ? '✓ Repasse Efetuado' : '● Em Aberto'}
                </span>
              </div>

              {/* Financial Box */}
              <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Faturamento Gerado</div>
                  <div className="font-bold text-white font-mono text-sm mt-0.5">
                    {formatCurrency(item.totalRevenueInCents)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-amber-400 uppercase font-semibold">Valor da Comissão</div>
                  <div className="font-bold text-amber-400 font-mono text-base mt-0.5">
                    {formatCurrency(item.commissionDueInCents)}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  Ticket Médio: <strong className="text-zinc-300 font-mono">{formatCurrency(item.averageTicket)}</strong>
                </span>

                <button
                  onClick={() => toggleMarkPaid(item.member.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    item.isPaid
                      ? 'bg-zinc-800 text-zinc-400 hover:text-white'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 active:scale-95'
                  }`}
                >
                  {item.isPaid ? 'Desfazer Baixa' : 'Dar Baixa no Repasse'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
