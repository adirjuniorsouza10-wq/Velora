import React, { useState } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  RotateCcw, 
  Star, 
  CheckCircle2, 
  Calendar, 
  Receipt, 
  ChevronRight, 
  Award, 
  Coffee, 
  Percent, 
  Zap, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Tenant, Service, StaffMember } from '../../types/velora';

interface VeloraPassCardProps {
  tenant: Tenant;
  onRepeatAppointment: (serviceName: string, professionalName: string) => void;
  onSelectBarber: (staffId: string) => void;
}

export const VeloraPassCard: React.FC<VeloraPassCardProps> = ({ 
  tenant, 
  onRepeatAppointment,
  onSelectBarber 
}) => {
  const [favoriteBarber, setFavoriteBarber] = useState('Iago Barber (Fundador)');
  const [copiedReceipt, setCopiedReceipt] = useState<string | null>(null);
  const [showReceipts, setShowReceipts] = useState(false);

  // Digital pass state (mocked for customer Rodrigo Lima)
  const clientName = 'Rodrigo Lima';
  const planName = tenant.id === 'tenant-iago' ? 'Plano Cabelo' : 'Clube Cavalheiro VIP';
  const planPriceInCents = tenant.id === 'tenant-iago' ? 8000 : 18900;
  const cutsTotal = 4;
  const cutsRemaining = 3;
  const loyaltyPoints = 280;
  const pointsGoal = 300;
  const renewalDate = '01/12/2026';

  const receipts = [
    { id: 'rec-901', desc: `Mensalidade ${planName}`, amountInCents: planPriceInCents, date: '01/11/2026', method: '⚡ Pix Recorrente' },
    { id: 'rec-902', desc: 'Pomada Matte Efeito Seco (10% OFF)', amountInCents: 4500, date: '28/10/2026', method: '💳 Cartão de Crédito' },
    { id: 'rec-903', desc: `Mensalidade ${planName}`, amountInCents: planPriceInCents, date: '01/10/2026', method: '⚡ Pix Recorrente' }
  ];

  const handleCopyReceipt = (id: string) => {
    setCopiedReceipt(id);
    setTimeout(() => setCopiedReceipt(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual Digital Card: VELORA PASS */}
      <div className="relative rounded-3xl p-6 sm:p-7 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border-2 border-amber-500/40 shadow-2xl">
        {/* Holographic light effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px] space-y-6">
          {/* Header of the Pass */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-black text-lg shadow-lg font-mono">
                VP
              </div>
              <div>
                <div className="text-xs font-mono tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VELORA PASS • CARTEIRA DIGITAL</span>
                </div>
                <div className="text-base font-extrabold text-white">{tenant.name}</div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Assinatura Ativa
            </span>
          </div>

          {/* Card Middle: Plan & Cut Allowance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                Plano Assinado
              </span>
              <div className="text-xl font-black text-white">{planName}</div>
              <div className="text-xs text-amber-400 font-semibold mt-0.5">
                {formatCurrency(planPriceInCents)}/mês • Renovação: {renewalDate}
              </div>
            </div>

            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-zinc-400 font-medium">Saldo de Cortes no Mês:</span>
                <span className="font-extrabold text-white font-tabular">{cutsRemaining} de {cutsTotal} restantes</span>
              </div>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(cutsRemaining / cutsTotal) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Atendimentos válidos até o fim do ciclo
              </span>
            </div>
          </div>

          {/* Card Footer: Client Info and Pass Serial */}
          <div className="flex items-end justify-between border-t border-zinc-800/80 pt-3 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Titular</span>
              <span className="font-bold text-zinc-200">{clientName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">ID do Cliente</span>
              <span className="font-mono text-zinc-400 text-[11px]">VELORA-VIP-8833</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action: "Repetir Atendimento Anterior" (Recurso estilo Trinks) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-zinc-950 shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Repetir Último Atendimento</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                1 Clique
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              Último corte: <strong>Corte</strong> com <strong>Iago Barber (Fundador)</strong>.
            </p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Horário de preferência: Sextas às 17h ou Sábados pela manhã.
            </p>
          </div>
        </div>

        <button
          onClick={() => onRepeatAppointment('Corte', 'Iago Barber (Fundador)')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>Repetir Agora</span>
        </button>
      </div>

      {/* Loyalty Points + Exclusive Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Programa de Fidelidade */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Pontos de Fidelidade</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">{loyaltyPoints} / {pointsGoal} pts</span>
          </div>

          <div className="text-2xl font-black text-white font-tabular">
            {loyaltyPoints} <span className="text-xs font-normal text-zinc-400">pontos acumulados</span>
          </div>

          <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${(loyaltyPoints / pointsGoal) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-zinc-300">
            Faltam apenas <strong>20 pontos</strong> para você resgatar <strong>1 Corte Gratuito</strong>!
          </p>
        </div>

        {/* Benefícios Ativos */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2.5">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Seus Benefícios VIP</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>10% OFF</strong> em pomadas, óleos e produtos</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Espresso e Cerveja Cortesia na espera</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Acesso prioritário a horários de pico (quinta a sábado)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barbeiro Favorito */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
              Seu Barbeiro Favorito
            </span>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{favoriteBarber}</span>
              <span className="text-[10px] bg-zinc-800 text-amber-400 px-1.5 py-0.2 rounded font-bold">
                ★ 5.0
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectBarber('staff-iago-master')}
          className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <span>Ver Agenda Dele</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comprovantes e Recibos Digitais */}
      <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-bold text-white">Comprovantes &amp; Recibos de Pagamento</span>
          </div>
          <button
            onClick={() => setShowReceipts(!showReceipts)}
            className="text-xs text-amber-400 hover:underline"
          >
            {showReceipts ? 'Ocultar recibos' : 'Ver todos'}
          </button>
        </div>

        {showReceipts && (
          <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs">
            {receipts.map(r => (
              <div key={r.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{r.desc}</div>
                  <div className="text-[11px] text-zinc-400">{r.date} • {r.method}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-white font-tabular">{formatCurrency(r.amountInCents)}</span>
                  <button
                    onClick={() => handleCopyReceipt(r.id)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    title="Copiar código de autenticação"
                  >
                    {copiedReceipt === r.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Receipt className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
