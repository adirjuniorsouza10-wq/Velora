import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { Clock, Search, Phone } from 'lucide-react';
import { formatCurrency, formatDatePtBR, getStatusBadgeStyle } from '../../utils/formatters';

export const AppointmentsListView: React.FC = () => {
  const { appointments, activeTenant, staff, updateAppointmentStatus, checkoutAppointment } = useVelora();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [staffFilter, setStaffFilter] = useState('all');

  const filteredAppointments = appointments
    .filter(appointment => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch = !query || appointment.customerName.toLowerCase().includes(query)
        || appointment.serviceName.toLowerCase().includes(query)
        || appointment.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, ''));
      return matchesSearch
        && (statusFilter === 'all' || appointment.status === statusFilter)
        && (staffFilter === 'all' || appointment.professionalId === staffFilter);
    })
    .sort((a, b) => `${b.date}T${b.startTime}`.localeCompare(`${a.date}T${a.startTime}`));

  return (
    <div className="flex-1 overflow-y-auto space-y-6 bg-[var(--velora-page)] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#426d70] dark:text-[#a4c9c3]">
            <Clock className="h-4 w-4" /><span>Operação · {activeTenant.name}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Agendamentos</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Consulte e acompanhe os horários da sua equipe.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Buscar agendamento</span>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Cliente, serviço ou telefone"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              className="min-h-10 w-56 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-[#426d70] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </label>
          <label>
            <span className="sr-only">Filtrar por status</span>
            <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <option value="all">Todos os status</option>
              <option value="confirmed">Confirmados</option>
              <option value="in_progress">Em atendimento</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
              <option value="no_show">Não compareceu</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Filtrar por profissional</span>
            <select value={staffFilter} onChange={event => setStaffFilter(event.target.value)} className="min-h-10 max-w-52 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <option value="all">Todos os profissionais</option>
              {staff.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <tr>
                <th scope="col" className="px-4 py-3">Data e hora</th><th scope="col" className="px-4 py-3">Cliente</th>
                <th scope="col" className="px-4 py-3">Serviço</th><th scope="col" className="px-4 py-3">Profissional</th>
                <th scope="col" className="px-4 py-3">Valor</th><th scope="col" className="px-4 py-3">Origem</th>
                <th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredAppointments.length ? filteredAppointments.map(appointment => {
                const badge = getStatusBadgeStyle(appointment.status);
                const canStart = appointment.status === 'confirmed';
                const canCharge = appointment.status === 'confirmed' || appointment.status === 'in_progress';
                return (
                  <tr key={appointment.id} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-zinc-800/50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{appointment.startTime}–{appointment.endTime}</div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400">{formatDatePtBR(appointment.date)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{appointment.customerName}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400"><Phone className="h-3 w-3" />{appointment.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3"><div className="font-medium text-slate-800 dark:text-zinc-200">{appointment.serviceName}</div><div className="text-xs text-slate-500">{appointment.durationMinutes} min</div></td>
                    <td className="px-4 py-3 text-slate-700 dark:text-zinc-300">{appointment.professionalName}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-slate-900 dark:text-white">{formatCurrency(appointment.priceInCents)}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">{appointment.source === 'online' ? 'Online' : appointment.source === 'whatsapp' ? 'WhatsApp' : 'Recepção'}</span></td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${badge.bg}`}><span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />{badge.label}</span></td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {canStart && <button type="button" onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')} className="mr-2 rounded-md border border-[#cbdedb] bg-[#edf4f3] px-2.5 py-1.5 text-xs font-semibold text-[#31585b] hover:bg-[#e2eeec] dark:border-[#3b5555] dark:bg-[#202e30] dark:text-[#a4c9c3]">Iniciar</button>}
                      {canCharge && <button type="button" onClick={() => checkoutAppointment(appointment.id, 'pix')} className="rounded-md bg-[#426d70] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#31585b]">Cobrar</button>}
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-zinc-400">Nenhum agendamento encontrado. Ajuste os filtros e tente novamente.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-400">{filteredAppointments.length} {filteredAppointments.length === 1 ? 'agendamento encontrado' : 'agendamentos encontrados'}</p>
    </div>
  );
};
