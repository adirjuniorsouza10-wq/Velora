export const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

export const formatDatePtBR = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }
  return dateStr;
};

export const getWeekdayName = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(new Date(year, month - 1, day));
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }
  return '';
};

export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};

export const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30', label: 'Confirmado', dot: 'bg-emerald-600 dark:bg-emerald-400' };
    case 'in_progress':
      return { bg: 'bg-[#edf4f3] text-[#31585b] border-[#cbdedb] dark:bg-[#202e30] dark:text-[#a4c9c3] dark:border-[#3b5555]', label: 'Na cadeira', dot: 'bg-[#426d70] dark:bg-[#a4c9c3]' };
    case 'completed':
      return { bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700', label: 'Concluído', dot: 'bg-slate-500 dark:bg-zinc-400' };
    case 'cancelled':
      return { bg: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30', label: 'Cancelado', dot: 'bg-rose-600 dark:bg-rose-400' };
    case 'no_show':
      return { bg: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30', label: 'Não compareceu', dot: 'bg-orange-600 dark:bg-orange-400' };
    default:
      return { bg: 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400', label: status, dot: 'bg-slate-400 dark:bg-zinc-500' };
  }
};
