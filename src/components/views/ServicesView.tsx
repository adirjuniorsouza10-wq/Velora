import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Scissors, 
  Plus, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Globe, 
  Percent,
  Search
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ServicesView: React.FC = () => {
  const { services, categories, addService, activeTenant } = useVelora();
  const [searchTerm, setSearchTerm] = useState('');
  const [newModalOpen, setNewModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(35);
  const [bufferMinutes, setBufferMinutes] = useState(5);
  const [priceReais, setPriceReais] = useState(65);
  const [requiresDeposit, setRequiresDeposit] = useState(false);
  const [depositPercentage, setDepositPercentage] = useState(30);
  const [commissionPercentage, setCommissionPercentage] = useState(50);
  const [onlineBookingEnabled, setOnlineBookingEnabled] = useState(true);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addService({
      tenantId: activeTenant.id,
      categoryId: categoryId || categories[0]?.id || 'cat-default',
      name,
      description,
      durationMinutes: Number(durationMinutes),
      bufferMinutes: Number(bufferMinutes),
      priceInCents: Math.round(Number(priceReais) * 100),
      requiresDeposit,
      depositPercentage: requiresDeposit ? Number(depositPercentage) : 0,
      onlineBookingEnabled,
      commissionPercentage: Number(commissionPercentage)
    });

    setNewModalOpen(false);
    setName('');
    setDescription('');
    setPriceReais(65);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Scissors className="w-4 h-4" />
            <span>Catálogo Comercial • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Serviços &amp; Preços</h1>
          <p className="text-xs text-zinc-400">
            Duração, comissão, regras de sinal para agendamento online e buffer entre atendimentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar serviço..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 outline-none w-56 focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setNewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Serviço</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(srv => {
          const category = categories.find(c => c.id === srv.categoryId);

          return (
            <div
              key={srv.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {category?.name || 'Serviço'}
                  </span>
                  {srv.badge && (
                    <span className="text-[10px] font-bold text-zinc-950 bg-amber-400 px-2 py-0.5 rounded-full shadow-sm">
                      {srv.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-1.5">{srv.name}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{srv.durationMinutes} min (+{srv.bufferMinutes}m pausa)</span>
                  </div>
                  <div className="text-base font-black text-white font-mono">
                    {formatCurrency(srv.priceInCents)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/40">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3 text-amber-400" />
                    <span>Comissão: {srv.commissionPercentage}%</span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-400" />
                    <span>{srv.onlineBookingEnabled ? 'Booking Online' : 'Interno'}</span>
                  </span>
                </div>

                {srv.requiresDeposit && (
                  <div className="text-[10px] bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/20 flex items-center justify-between">
                    <span>Exige sinal na reserva</span>
                    <strong className="font-mono">{srv.depositPercentage}%</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Service Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>Cadastrar Novo Serviço</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Disponível para a equipe e integrado ao motor de agendamento online.
            </p>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-zinc-300 font-semibold mb-1 block">Nome do Serviço *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Corte Masculino Premium"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Categoria</label>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Preço (R$) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={priceReais}
                    onChange={e => setPriceReais(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Duração (minutos) *</label>
                  <input
                    type="number"
                    required
                    step={5}
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Intervalo / Buffer (minutos)</label>
                  <input
                    type="number"
                    step={5}
                    value={bufferMinutes}
                    onChange={e => setBufferMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-300 font-semibold mb-1 block">Comissão Padrão (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={commissionPercentage}
                    onChange={e => setCommissionPercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="onlineBooking"
                    checked={onlineBookingEnabled}
                    onChange={e => setOnlineBookingEnabled(e.target.checked)}
                    className="rounded text-amber-500 bg-zinc-950"
                  />
                  <label htmlFor="onlineBooking" className="text-zinc-300 cursor-pointer">
                    Exibir no Booking Público
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="text-zinc-300 font-semibold mb-1 block">Descrição do Procedimento</label>
                  <textarea
                    rows={2}
                    placeholder="Detalhes para o cliente entender o que está incluído..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
                >
                  Criar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
