import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  PlayCircle, 
  XCircle, 
  DollarSign,
  Phone
} from 'lucide-react';
import { formatCurrency, formatDatePtBR, getStatusBadgeStyle } from '../../utils/formatters';
import { AppointmentStatus } from '../../types/velora';

export const AppointmentsListView: React.FC = () => {
  const { appointments, activeTenant, staff, updateAppointmentStatus, checkoutAppointment } = useVelora();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesStaff = staffFilter === 'all' || apt.professionalId === staffFilter;
    return matchesSearch && matchesStatus && matchesStaff;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-zinc-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Gestão Operacional • {activeTenant.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Histórico de Agendamentos</h1>
          <p className="text-xs text-zinc-400">
            Registro cronológico completo com status comercial e financeiro congelado no momento da reserva.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar agendamento..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 outline-none w-48 focus:border-amber-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 outline-none cursor-pointer"
          >
            <option value="all">Todos os Status</option>
            <option value="confirmed">Confirmados</option>
            <option value="in_progress">Em Atendimento</option>
            <option value="completed">Concluídos</option>
            <option value="cancelled">Cancelados</option>
          </select>

          {/* Staff Filter */}
          <select
            value={staffFilter}
            onChange={e => setStaffFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 outline-none cursor-pointer"
          >
            <option value="all">Todos os Profissionais</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-900/90 border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Data &amp; Hora</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Serviço</th>
                <th className="py-3 px-4">Profissional</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Origem</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(apt => {
                  const badge = getStatusBadgeStyle(apt.status);

                  return (
                    <tr key={apt.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <div className="font-bold text-white">{apt.startTime} - {apt.endTime}</div>
                        <div className="text-[11px] text-zinc-400">{formatDatePtBR(apt.date)}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{apt.customerName}</div>
                        <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          <span>{apt.customerPhone}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{apt.serviceName}</div>
                        <div className="text-[11px] text-zinc-500">{apt.durationMinutes} min</div>
                      </td>

                      <td className="py-3 px-4 font-medium text-zinc-300">
                        {apt.professionalName}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-amber-400 text-sm">
                        {formatCurrency(apt.priceInCents)}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
                          {apt.source === 'online' ? 'Online' : 'Recepção'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] border border-amber-500/40"
                          >
                            Atender
                          </button>
                        )}

                        {apt.status !== 'completed' && (
                          <button
                            onClick={() => checkoutAppointment(apt.id, 'pix')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[11px]"
                          >
                            Cobrar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    Nenhum agendamento encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
