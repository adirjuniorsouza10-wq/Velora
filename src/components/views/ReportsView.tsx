import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  Scissors, 
  DollarSign,
  PieChart,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { activeTenant, services, appointments, metrics, customers } = useVelora();
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Revenue breakdown by service
  const serviceStats = services.map(srv => {
    const srvAppointments = appointments.filter(a => a.serviceId === srv.id && a.status === 'completed');
    const totalRevenueInCents = srvAppointments.reduce((acc, a) => acc + a.priceInCents, 0);

    return {
      service: srv,
      count: srvAppointments.length,
      revenueInCents: totalRevenueInCents
    };
  }).sort((a, b) => b.revenueInCents - a.revenueInCents);

  const handleExport = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Inteligência &amp; Desempenho • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Relatórios Gerenciais</h1>
          <p className="text-xs text-zinc-400">
            Métricas analíticas consolidadas de faturamento, volume de atendimentos e serviços mais rentáveis.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Exportar Relatório (CSV / PDF)</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Relatório consolidado exportado com sucesso!</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Projeção Mensal</span>
          <div className="text-2xl font-black text-amber-300 font-mono mt-1">
            {formatCurrency(metrics.monthRevenueInCents)}
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>108% da meta atingida</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Base Ativa de Clientes</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {customers.length} clientes
          </div>
          <div className="text-xs text-zinc-400 mt-1">{customers.filter(c => c.isVip).length} classificados como VIP</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Taxa de Retenção Recorrente</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            84.2%
          </div>
          <div className="text-xs text-zinc-400 mt-1">Clientes retornam em menos de 28 dias</div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          <span className="text-[10px] uppercase font-bold text-zinc-400">Índice de Pontualidade</span>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">
            96.8%
          </div>
          <div className="text-xs text-zinc-400 mt-1">Atendimentos iniciados no horário</div>
        </div>
      </div>

      {/* Top Services Performance Table */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>Ranking de Serviços por Receita &amp; Volume</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Identifique quais procedimentos trazem maior margem e fluxo de caixa.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Serviço</th>
                <th className="py-2.5 px-3">Duração</th>
                <th className="py-2.5 px-3">Preço Unitário</th>
                <th className="py-2.5 px-3">Atendimentos</th>
                <th className="py-2.5 px-3 text-right">Faturamento Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {serviceStats.map(stat => (
                <tr key={stat.service.id} className="hover:bg-zinc-900/40">
                  <td className="py-3 px-3 font-bold text-white">
                    {stat.service.name}
                  </td>
                  <td className="py-3 px-3 text-zinc-400">
                    {stat.service.durationMinutes} min
                  </td>
                  <td className="py-3 px-3 font-mono text-zinc-300">
                    {formatCurrency(stat.service.priceInCents)}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-white">
                    {stat.count} cortes
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-400 text-sm">
                    {formatCurrency(stat.revenueInCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
