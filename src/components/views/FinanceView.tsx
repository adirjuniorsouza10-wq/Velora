import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Plus, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Percent,
  Lock,
  Unlock
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { PaymentMethod } from '../../types/velora';

export const FinanceView: React.FC = () => {
  const { 
    transactions, 
    cashSession, 
    closeCashSession, 
    openCashSession, 
    addTransaction, 
    activeTenant, 
    staff, 
    appointments 
  } = useVelora();

  const [newTransactionModalOpen, setNewTransactionModalOpen] = useState(false);
  const [openCashModalOpen, setOpenCashModalOpen] = useState(false);

  // Form states
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txDescription, setTxDescription] = useState('');
  const [txCategory, setTxCategory] = useState('Insumos');
  const [txAmountReais, setTxAmountReais] = useState(50);
  const [txPaymentMethod, setTxPaymentMethod] = useState<PaymentMethod>('pix');

  const [initialCashReais, setInitialCashReais] = useState(200);

  // Calculations
  const totalIncomeInCents = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amountInCents, 0);

  const totalExpenseInCents = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amountInCents, 0);

  const netProfitInCents = totalIncomeInCents - totalExpenseInCents;

  // Calculate professional commissions breakdown
  const staffCommissions = staff.map(member => {
    const completedApts = appointments.filter(
      a => a.professionalId === member.id && a.status === 'completed'
    );
    const totalGenerated = completedApts.reduce((acc, a) => acc + a.priceInCents, 0);
    const commissionDue = Math.round(totalGenerated * (member.commissionRate / 100));

    return {
      staff: member,
      completedCount: completedApts.length,
      totalGenerated,
      commissionDue
    };
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription.trim()) return;

    addTransaction({
      tenantId: activeTenant.id,
      type: txType,
      category: txCategory,
      description: txDescription,
      amountInCents: Math.round(Number(txAmountReais) * 100),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod: txPaymentMethod
    });

    setNewTransactionModalOpen(false);
    setTxDescription('');
    setTxAmountReais(50);
  };

  const handleOpenCash = (e: React.FormEvent) => {
    e.preventDefault();
    openCashSession(Math.round(Number(initialCashReais) * 100));
    setOpenCashModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 dark:bg-zinc-950 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            <DollarSign className="w-4 h-4" />
            <span>Gestão Financeira &amp; Caixa • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Fluxo de Caixa &amp; Comissões</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Separação estrita entre agendamento, atendimento e movimentação financeira real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {cashSession.isOpen ? (
            <button
              onClick={() => closeCashSession()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 text-xs font-semibold shadow-xs transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Fechar Caixa Diário</span>
            </button>
          ) : (
            <button
              onClick={() => setOpenCashModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-500/40 transition-colors shadow-xs"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Abrir Novo Caixa</span>
            </button>
          )}

          <button
            onClick={() => setNewTransactionModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receitas Totais */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Receitas Recebidas</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(totalIncomeInCents)}
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-zinc-400">Atendimentos e produtos</div>
        </div>

        {/* Despesas */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Despesas / Saídas</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 dark:text-rose-400 font-mono">
            {formatCurrency(totalExpenseInCents)}
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-zinc-400">Insumos, contas e taxas</div>
        </div>

        {/* Lucro Líquido */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resultado Líquido</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 dark:text-amber-300 font-mono">
            {formatCurrency(netProfitInCents)}
          </div>
          <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Saldo Operacional Positivo</div>
        </div>

        {/* Caixa Físico do Dia */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gaveta de Caixa</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(cashSession.currentAmountInCents)}
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Fundo: {formatCurrency(cashSession.initialAmountInCents)}</span>
            <span className={cashSession.isOpen ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-slate-400 dark:text-zinc-500'}>
              {cashSession.isOpen ? '● Aberto' : '○ Fechado'}
            </span>
          </div>
        </div>
      </div>

      {/* 2 Grids: Commissions breakdown & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commissions Calculator Table */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-slate-200/90 dark:border-zinc-800 space-y-4 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Comissões a Repassar</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Cálculo baseado em atendimentos concluídos e taxa contratada.
            </p>
          </div>

          <div className="space-y-3">
            {staffCommissions.map(item => (
              <div
                key={item.staff.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.staff.avatar}
                    alt={item.staff.name}
                    className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{item.staff.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                      Taxa: {item.staff.commissionRate}% ({item.completedCount} atendimentos)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                    {formatCurrency(item.commissionDue)}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                    de {formatCurrency(item.totalGenerated)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions ledger */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-slate-200/90 dark:border-zinc-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Extrato e Movimentações Reais</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Todas as entradas e saídas conciliadas no caixa.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Tipo &amp; Categoria</th>
                  <th className="py-2.5 px-3">Descrição</th>
                  <th className="py-2.5 px-3">Meio</th>
                  <th className="py-2.5 px-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                    <td className="py-3 px-3 text-slate-500 dark:text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.type === 'income' 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20' 
                          : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/20'
                      }`}>
                        {tx.type === 'income' ? '+ Receita' : '- Despesa'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-zinc-400 uppercase font-mono text-[11px]">
                      {tx.paymentMethod}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono font-bold text-sm ${
                      tx.type === 'income' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amountInCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Transaction Modal */}
      {newTransactionModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Novo Lançamento Financeiro</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Lançar entrada ou saída extraordinária no caixa do tenant.
            </p>

            <form onSubmit={handleCreateTransaction} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Tipo de Movimentação</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('income')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      txType === 'income' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-500/20 dark:border-emerald-500 dark:text-emerald-300' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    + Receita (Entrada)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('expense')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      txType === 'expense' 
                        ? 'bg-rose-50 border-rose-500 text-rose-900 dark:bg-rose-500/20 dark:border-rose-500 dark:text-rose-300' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    - Despesa (Saída)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Descrição *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Compra de café espresso e descartáveis"
                  value={txDescription}
                  onChange={e => setTxDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Valor (R$) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={txAmountReais}
                    onChange={e => setTxAmountReais(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-mono outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Forma de Pagamento</label>
                  <select
                    value={txPaymentMethod}
                    onChange={e => setTxPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                  >
                    <option value="pix">Pix</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="cash">Dinheiro</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setNewTransactionModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Open Cash Modal */}
      {openCashModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Unlock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Abertura de Caixa Diário</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Informe o fundo de troco para a gaveta hoje.
            </p>

            <form onSubmit={handleOpenCash} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Fundo de Troco Inicial (R$)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={initialCashReais}
                  onChange={e => setInitialCashReais(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white font-mono text-base outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setOpenCashModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  Abrir Caixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
