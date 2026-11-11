import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  Users, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  ShieldAlert,
  Bot,
  DollarSign,
  Calendar,
  Crown,
  CheckCircle2,
  HelpCircle,
  Scissors,
  MessageCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const AiView: React.FC = () => {
  const { 
    activeTenant, 
    aiInsights, 
    customers, 
    appointments, 
    metrics, 
    clubMembers,
    selectedDate 
  } = useVelora();

  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Suggested questions from user brief
  const suggestedQueries = [
    { text: 'Quanto faturei este mês?', icon: DollarSign, color: 'text-emerald-400' },
    { text: 'Quais clientes não voltaram?', icon: Users, color: 'text-red-400' },
    { text: 'Quantos cortes fiz hoje?', icon: Scissors, color: 'text-amber-400' },
    { text: 'Quem está com assinatura vencendo?', icon: Crown, color: 'text-purple-400' },
    { text: 'Quais horários estão disponíveis?', icon: Clock, color: 'text-blue-400' }
  ];

  // Dynamic calculation for responses
  const todayApts = appointments.filter(a => a.date === selectedDate);
  const completedToday = todayApts.filter(a => a.status === 'completed');
  const churnCustomers = customers.filter(c => {
    if (!c.lastVisit) return true;
    const diff = (Date.now() - new Date(c.lastVisit).getTime()) / (1000 * 3600 * 24);
    return diff > 25;
  });

  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string; time: string; badge?: string }>>([
    {
      q: 'Quanto faturei este mês?',
      a: `Olá Iago! Na Backout Barbearia, o faturamento acumulado deste mês é de **${formatCurrency(metrics.monthRevenueInCents)}**, o que representa **${Math.round((metrics.monthRevenueInCents / metrics.monthlyGoalInCents) * 100)}% da sua meta mensal** (${formatCurrency(metrics.monthlyGoalInCents)}). O ticket médio por cliente está em **${formatCurrency(metrics.averageTicketInCents)}**.`,
      time: '10:14',
      badge: 'Financeiro'
    },
    {
      q: 'Quais clientes não voltaram?',
      a: `Identifiquei **${churnCustomers.length} clientes** que não visitam a Backout Barbearia há mais de 30 dias: **Renato Nogueira** (última visita há 36 dias) e **Felipe Alencar** (última visita há 28 dias). Recomendo enviar uma mensagem no WhatsApp oferecendo um cafezinho ou 10% de cortesia.`,
      time: '09:40',
      badge: 'Retenção CRM'
    }
  ]);

  const executeQuery = (queryText: string) => {
    setPrompt('');
    setIsTyping(true);

    setTimeout(() => {
      let response = '';
      let badge = 'Inteligência';
      const qLower = queryText.toLowerCase();

      if (qLower.includes('quanto faturei') || qLower.includes('faturamento') || qLower.includes('ganhei')) {
        badge = 'Financeiro';
        response = `Faturamento deste mês na ${activeTenant.name}: **${formatCurrency(metrics.monthRevenueInCents)}**. Hoje já foram faturados **${formatCurrency(metrics.todayRevenueInCents)}**. A projeção para o fechamento do mês é atingir **${formatCurrency(metrics.monthlyGoalInCents + 320000)}** se mantiver a ocupação das quintas e sextas.`;
      } else if (qLower.includes('não voltaram') || qLower.includes('inativos') || qLower.includes('churn')) {
        badge = 'Retenção CRM';
        response = `Clientes sem retorno há +30 dias: **${churnCustomers.map(c => c.name).slice(0, 3).join(', ')}**. Eles costumavam cortar a cada 15 dias. Se reativar 2 deles, você recupera aproximadamente **R$ 140,00** esta semana.`;
      } else if (qLower.includes('quantos cortes') || qLower.includes('cortes fiz hoje') || qLower.includes('atendimentos hoje')) {
        badge = 'Operação';
        response = `Hoje você tem **${todayApts.length} atendimentos agendados** na Backout Barbearia (${completedToday.length} já concluídos e 1 em andamento). A comissão estimada para sua equipe hoje é de **${formatCurrency(Math.round(metrics.todayRevenueInCents * 0.6))}**.`;
      } else if (qLower.includes('assinatura') || qLower.includes('vencendo') || qLower.includes('clube')) {
        badge = 'VELORA CLUB';
        response = `No VELORA CLUB da Backout Barbearia, há **${clubMembers.length} assinantes ativos**. 2 membros estão com renovação nos próximos 5 dias: **Guilherme Siqueira** (Plano Cabelo - R$ 80,00) e **Marcos Vinicius** (Plano Barba - R$ 120,00). As cobranças via Pix Recorrente estão programadas.`;
      } else if (qLower.includes('horários') || qLower.includes('disponíveis') || qLower.includes('vagas')) {
        badge = 'Agenda';
        response = `Horários livres na cadeira do Iago hoje (${selectedDate}): **11:15**, **15:00**, **16:30** e **18:00**. Você tem 2 clientes na lista de espera aguardando encaixe. Deseja que eu envie um aviso de horário vago?`;
      } else {
        response = `Com base no histórico da ${activeTenant.name}: Temos ${appointments.length} agendamentos registrados, ticket médio de ${formatCurrency(metrics.averageTicketInCents)} e taxa de ocupação em ${metrics.occupancyRatePercentage}%. Posso te ajudar com previsões financeiras, metas ou alertas de clientes.`;
      }

      setAiAnswers(prev => [
        {
          q: queryText,
          a: response,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          badge
        },
        ...prev
      ]);
      setIsTyping(false);
    }, 800);
  };

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    executeQuery(prompt);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl vellora-glass-card border border-zinc-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>05. VELORA AI • Assistente da {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Inteligência Preditiva do Seu Negócio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Pergunte qualquer dado sobre faturamento, clientes ausentes, cortes do dia e horários vagos. A IA analisa os dados reais da Backout Barbearia instantaneamente.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>IA Online &amp; Conectada ao Banco</span>
        </div>
      </div>

      {/* Suggested Quick Question Pills (As 5 perguntas do Iago) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
          Perguntas Frequentes do Iago (Clique para Consultar):
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => executeQuery(item.text)}
                className="px-3.5 py-2 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-xs text-zinc-200 font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span>{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Prompt Input */}
      <form onSubmit={handleAsk} className="relative">
        <div className="flex items-center bg-zinc-900 border border-zinc-700/80 rounded-2xl p-2 shadow-2xl focus-within:border-amber-500 transition-colors">
          <Bot className="w-5 h-5 text-amber-400 ml-2 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Pergunte à IA: Ex: 'Quanto faturei este mês?', 'Quais clientes não voltaram?'..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isTyping}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-40 transition-all shrink-0"
          >
            <span>Perguntar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Conversation Thread */}
      <div className="space-y-4">
        {isTyping && (
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3 animate-pulse text-xs text-amber-400 font-semibold">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Consultando banco de dados da {activeTenant.name}...</span>
          </div>
        )}

        {aiAnswers.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl vellora-glass-card border border-zinc-800 space-y-3 shadow-xl animate-in fade-in"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-300">Pergunta do Iago:</span>
                <span className="text-white font-semibold italic">"{item.q}"</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
                <span className="text-[11px] font-mono text-zinc-500">{item.time}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-2">
              <p className="whitespace-pre-line">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
