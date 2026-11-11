import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Tag, 
  MessageSquare, 
  Sparkles, 
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDatePtBR } from '../../utils/formatters';
import { Customer } from '../../types/velora';

export const CrmView: React.FC = () => {
  const { customers, appointments, addCustomer, activeTenant } = useVelora();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);

  // New Customer Modal
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPreferences, setNewPreferences] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  // Collect all unique tags
  const allTags = Array.from(new Set(customers.flatMap(c => c.tags)));

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.phone.includes(searchTerm) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || c.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get appointments for selected customer
  const customerAppointments = selectedCustomer 
    ? appointments.filter(a => a.customerId === selectedCustomer.id) 
    : [];

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const tags = newTagInput ? newTagInput.split(',').map(t => t.trim()).filter(Boolean) : ['Novo'];

    const created = addCustomer({
      tenantId: activeTenant.id,
      name: newName,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      notes: newNotes,
      preferences: newPreferences,
      tags,
      isVip: tags.includes('Cliente VIP') || tags.includes('VIP')
    });

    setSelectedCustomer(created);
    setNewCustomerModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
    setNewPreferences('');
    setNewTagInput('');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors">
      {/* Left List Pane */}
      <div className="w-full md:w-96 border-r border-slate-200 dark:border-zinc-800 flex flex-col h-full bg-white dark:bg-zinc-900/30">
        {/* Search & Actions Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Clientes &amp; CRM</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-mono">
                {customers.length}
              </span>
            </div>

            <button
              onClick={() => setNewCustomerModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou e-mail..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-zinc-200 placeholder-slate-400 dark:placeholder-zinc-500 outline-none focus:border-amber-600"
            />
          </div>

          {/* Tag filters pill scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                selectedTag === 'all'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Todos
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                  selectedTag === tag
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Customer list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-900">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map(customer => {
              const isSelected = selectedCustomer?.id === customer.id;

              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-amber-50 dark:bg-amber-500/10 border-l-2 border-amber-600 dark:border-amber-500' : 'hover:bg-slate-50 dark:hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-bold text-amber-700 dark:text-amber-400 text-sm shrink-0">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2 truncate">
                        <span className="truncate">{customer.name}</span>
                        {customer.isVip && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-500/30 shrink-0">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                        {customer.phone}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {formatCurrency(customer.totalSpentInCents)}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                      {customer.appointmentsCount} visitas
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-zinc-400">
              Nenhum cliente encontrado com estes filtros.
            </div>
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {selectedCustomer ? (
          <>
            {/* Customer Header Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/90 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-black text-xl text-white shadow-sm">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black text-slate-900 dark:text-white">{selectedCustomer.name}</h1>
                    {selectedCustomer.isVip && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                        Cliente VIP
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedCustomer.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedCustomer.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/55${selectedCustomer.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(selectedCustomer.name)}!%20Como%20podemos%20te%20ajudar%20na%20${encodeURIComponent(activeTenant.name)}%3F`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Mensagem WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 mb-1">
                  LTV (Valor Total Gasto)
                </div>
                <div className="text-xl font-black text-amber-700 dark:text-amber-400 font-mono">
                  {formatCurrency(selectedCustomer.totalSpentInCents)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 mb-1">
                  Total de Atendimentos
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                  {selectedCustomer.appointmentsCount} visitas
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800 shadow-xs">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 mb-1">
                  Última Visita
                </div>
                <div className="text-xl font-bold text-slate-800 dark:text-zinc-200">
                  {selectedCustomer.lastVisit ? formatDatePtBR(selectedCustomer.lastVisit) : 'Primeira vez'}
                </div>
              </div>
            </div>

            {/* Notes, Preferences and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Notes */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800 space-y-2 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Preferências do Atendimento</span>
                </h3>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {selectedCustomer.preferences || 'Nenhuma preferência cadastrada ainda.'}
                </p>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center gap-1.5">
                  <span>Observações Internas (Privadas)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 italic">
                  {selectedCustomer.notes || 'Sem observações adicionais.'}
                </p>
              </div>

              {/* Tags */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800 space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Etiquetas &amp; Segmentação</span>
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {selectedCustomer.tags.map(t => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400">
                  Cadastrado desde {formatDatePtBR(selectedCustomer.firstVisit)}
                </div>
              </div>
            </div>

            {/* Visit History */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200/90 dark:border-zinc-800 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Histórico de Atendimentos Registrados</span>
              </h3>

              {customerAppointments.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-zinc-900">
                  {customerAppointments.map(apt => (
                    <div key={apt.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{apt.serviceName}</div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                          {formatDatePtBR(apt.date)} às {apt.startTime} com {apt.professionalName}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900 dark:text-amber-400">
                          {formatCurrency(apt.priceInCents)}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400 capitalize">
                          {apt.status === 'completed' ? 'Concluído' : apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-400 dark:text-zinc-500">
                  Nenhum agendamento gravado para este cliente nesta unidade.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 dark:text-zinc-500 text-xs">
            Selecione um cliente para visualizar sua ficha completa.
          </div>
        )}
      </div>

      {/* New Customer Modal */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Cadastrar Novo Cliente</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Armazenado com isolamento no tenant {activeTenant.name}.
            </p>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Telefone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 99999-8888"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">E-mail (Opcional)</label>
                <input
                  type="email"
                  placeholder="carlos@exemplo.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Preferências de Atendimento</label>
                <input
                  type="text"
                  placeholder="Ex: Degradê navalhado baixo, água com gás"
                  value={newPreferences}
                  onChange={e => setNewPreferences(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="VIP, Cabelo, Barba"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setNewCustomerModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl"
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
    </div>
  );
};
