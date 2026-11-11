import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  UserCheck, 
  Plus, 
  Star, 
  Calendar, 
  Clock, 
  Percent, 
  Phone, 
  Mail, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const StaffView: React.FC = () => {
  const { staff, services, activeTenant, appointments, addStaff } = useVelora();
  const [newStaffModalOpen, setNewStaffModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'professional' | 'manager'>('professional');
  const [commissionRate, setCommissionRate] = useState(50);
  const [specialtiesInput, setSpecialtiesInput] = useState('');

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const specialties = specialtiesInput 
      ? specialtiesInput.split(',').map(s => s.trim()).filter(Boolean)
      : ['Atendimento Geral'];

    addStaff({
      tenantId: activeTenant.id,
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@${activeTenant.slug}.com`,
      phone: phone || '(11) 99999-0000',
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      specialties,
      serviceIds: services.map(s => s.id),
      commissionRate: Number(commissionRate),
      workingHours: { start: '09:00', end: '19:00', days: [2, 3, 4, 5, 6] },
      isActive: true
    });

    setNewStaffModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setSpecialtiesInput('');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Gestão de Equipe • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Profissionais &amp; Horários</h1>
          <p className="text-xs text-zinc-400">
            Jornada de trabalho, comissões individuais, serviços habilitados e performance.
          </p>
        </div>

        <button
          onClick={() => setNewStaffModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Profissional</span>
        </button>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map(member => {
          const completedCount = appointments.filter(
            a => a.professionalId === member.id && a.status === 'completed'
          ).length;

          return (
            <div
              key={member.id}
              className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/30 shadow-md"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{member.name}</h3>
                    <div className="text-xs text-amber-400 font-medium capitalize mt-0.5">
                      {member.role === 'owner' ? 'Proprietário & Especialista' : 'Profissional da Equipe'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white">{member.rating}</span>
                      <span>({member.completedAppointmentsCount} atendimentos)</span>
                    </div>
                  </div>
                </div>

                {/* Specialties Tags */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Especialidades
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.specialties.map(spec => (
                      <span
                        key={spec}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-medium border border-zinc-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact & Schedule */}
                <div className="space-y-2 text-xs text-zinc-400 p-3 bg-zinc-950/70 rounded-xl border border-zinc-800/80 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Jornada:</span>
                    </span>
                    <span className="font-semibold text-white">
                      {member.workingHours.start} às {member.workingHours.end}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-amber-400" />
                      <span>Comissão Cadastrada:</span>
                    </span>
                    <span className="font-bold text-amber-400 font-mono">
                      {member.commissionRate}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Agenda Ativa</span>
                </span>

                <span className="text-zinc-500">
                  {completedCount} hoje
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Staff Member Modal */}
      {newStaffModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Cadastrar Novo Profissional</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Irá compor a agenda com horários e cálculo de repasse automático.
            </p>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold mb-1 block">Nome do Profissional *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: André 'Barba Negra'"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold mb-1 block">Telefone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold mb-1 block">E-mail Profissional</label>
                <input
                  type="email"
                  placeholder="andre@barbeariaalpha.com.br"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold mb-1 block">Taxa de Comissão (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={commissionRate}
                  onChange={e => setCommissionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold mb-1 block">Especialidades (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Fade, Barba, Visagismo"
                  value={specialtiesInput}
                  onChange={e => setSpecialtiesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setNewStaffModalOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:bg-zinc-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
                >
                  Salvar Profissional
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
