import React, { useState, useEffect } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  CalendarPlus, 
  Clock, 
  User, 
  Scissors, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Phone
} from 'lucide-react';
import { formatCurrency, calculateEndTime } from '../../utils/formatters';
import { BookingSource } from '../../types/velora';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilled?: {
    date: string;
    time: string;
    professionalId?: string;
  };
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  prefilled
}) => {
  const { 
    services, 
    staff, 
    customers, 
    activeTenant, 
    addAppointment, 
    addCustomer 
  } = useVelora();

  const [customerId, setCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [professionalId, setProfessionalId] = useState(staff[0]?.id || '');
  const [date, setDate] = useState('2026-11-10');
  const [startTime, setStartTime] = useState('10:00');
  const [source, setSource] = useState<BookingSource>('manual');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (prefilled) {
      if (prefilled.date) setDate(prefilled.date);
      if (prefilled.time) setStartTime(prefilled.time);
      if (prefilled.professionalId) setProfessionalId(prefilled.professionalId);
    }
  }, [prefilled]);

  if (!isOpen) return null;

  const selectedService = services.find(s => s.id === serviceId) || services[0];
  const selectedStaff = staff.find(s => s.id === professionalId) || staff[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let finalCustomerId = customerId;
    let finalCustomerName = customerName;
    let finalCustomerPhone = customerPhone;

    if (!isNewCustomer && customerId) {
      const existing = customers.find(c => c.id === customerId);
      if (existing) {
        finalCustomerName = existing.name;
        finalCustomerPhone = existing.phone;
      }
    } else {
      if (!customerName.trim() || !customerPhone.trim()) {
        setErrorMsg('Nome e telefone do cliente são obrigatórios.');
        return;
      }
      const newCust = addCustomer({
        tenantId: activeTenant.id,
        name: customerName,
        phone: customerPhone,
        email: `${customerName.toLowerCase().replace(/\s+/g, '.')}@cliente.com`,
        tags: ['Encaixe Balcão'],
        isVip: false
      });
      finalCustomerId = newCust.id;
    }

    if (!selectedService || !selectedStaff) {
      setErrorMsg('Selecione serviço e profissional válidos.');
      return;
    }

    const calculatedEnd = calculateEndTime(startTime, selectedService.durationMinutes);

    const result = addAppointment({
      tenantId: activeTenant.id,
      branchId: 'branch-alpha-main',
      customerId: finalCustomerId,
      customerName: finalCustomerName,
      customerPhone: finalCustomerPhone,
      customerEmail: '',
      professionalId: selectedStaff.id,
      professionalName: selectedStaff.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      priceInCents: selectedService.priceInCents,
      durationMinutes: selectedService.durationMinutes,
      date,
      startTime,
      endTime: calculatedEnd,
      status: 'confirmed',
      paymentStatus: 'pending',
      source,
      notes
    });

    if (!result.success) {
      setErrorMsg(result.message || 'Conflito de horário detectado!');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <CalendarPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Novo Agendamento / Encaixe</h3>
              <p className="text-[11px] text-slate-500">{activeTenant.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-500/20 dark:border-rose-500/40 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Selection */}
          <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-700 dark:text-zinc-300 font-semibold">Cliente</label>
              <button
                type="button"
                onClick={() => setIsNewCustomer(!isNewCustomer)}
                className="text-amber-700 dark:text-amber-400 hover:underline text-[11px] font-semibold"
              >
                {isNewCustomer ? '← Escolher da Lista' : '+ Cadastrar Novo Cliente'}
              </button>
            </div>

            {!isNewCustomer ? (
              <select
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
              >
                <option value="">Selecione um cliente cadastrado...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nome do cliente *"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                />
                <input
                  type="text"
                  required
                  placeholder="WhatsApp / Telefone *"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
                />
              </div>
            )}
          </div>

          {/* Service & Staff Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Serviço</label>
              <select
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({formatCurrency(s.priceInCents)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Profissional</label>
              <select
                value={professionalId}
                onChange={e => setProfessionalId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
              >
                {staff.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Horário Início</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Summary Preview */}
          <div className="p-3 bg-slate-50 dark:bg-zinc-950/70 rounded-xl border border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-zinc-400">
              Duração estimada: <strong className="text-slate-900 dark:text-white">{selectedService?.durationMinutes} min</strong>
            </span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
              {selectedService && formatCurrency(selectedService.priceInCents)}
            </span>
          </div>

          <div>
            <label className="text-slate-700 dark:text-zinc-300 font-semibold mb-1 block">Observações (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Pediu para adiantar 15min se vagar"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white outline-none focus:border-amber-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs active:scale-95 transition-all"
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
