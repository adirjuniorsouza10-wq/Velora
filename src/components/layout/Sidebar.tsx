import React from 'react';
import { useVelora } from '../../context/VeloraContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  UserCheck,
  Scissors,
  DollarSign,
  Wallet,
  Percent,
  Package,
  Megaphone,
  BarChart3,
  Sparkles,
  Settings,
  ChevronRight,
  Share2,
  Crown,
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface SidebarProps {
  onOpenBookingPreview: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
  roles: string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenBookingPreview }) => {
  const { activeTab, setActiveTab, currentRole, activeTenant, appointments, selectedDate } = useVelora();
  const pendingCount = appointments.filter(
    appointment => appointment.date === selectedDate &&
      (appointment.status === 'confirmed' || appointment.status === 'in_progress'),
  ).length;

  const menuSections: MenuSection[] = [
    {
      title: 'Gestão',
      items: [
        { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard, roles: ['owner', 'manager', 'receptionist', 'professional'] },
        { id: 'agenda', label: 'Agenda', icon: Calendar, badge: pendingCount > 0 ? String(pendingCount) : undefined, roles: ['owner', 'manager', 'receptionist', 'professional'] },
        { id: 'appointments', label: 'Agendamentos', icon: Clock, roles: ['owner', 'manager', 'receptionist', 'professional'] },
        { id: 'crm', label: 'Clientes', icon: Users, roles: ['owner', 'manager', 'receptionist'] },
        { id: 'staff', label: 'Profissionais', icon: UserCheck, roles: ['owner', 'manager'] },
        { id: 'services', label: 'Serviços', icon: Scissors, roles: ['owner', 'manager'] },
      ],
    },
    {
      title: 'Financeiro',
      items: [
        { id: 'finance', label: 'Financeiro', icon: DollarSign, roles: ['owner', 'manager'] },
        { id: 'cash', label: 'Caixa', icon: Wallet, roles: ['owner', 'manager', 'receptionist'] },
        { id: 'commissions', label: 'Comissões', icon: Percent, roles: ['owner', 'manager', 'professional'] },
        { id: 'inventory', label: 'Estoque', icon: Package, roles: ['owner', 'manager'] },
      ],
    },
    {
      title: 'Crescimento',
      items: [
        { id: 'club', label: 'VELORA CLUB', icon: Crown, highlight: true, roles: ['owner', 'manager', 'receptionist'] },
        { id: 'marketing', label: 'Marketing', icon: Megaphone, roles: ['owner', 'manager'] },
        { id: 'reports', label: 'Relatórios', icon: BarChart3, roles: ['owner', 'manager'] },
        { id: 'ai', label: 'VELORA AI', icon: Sparkles, highlight: true, roles: ['owner', 'manager'] },
        { id: 'settings', label: 'Configurações', icon: Settings, roles: ['owner'] },
      ],
    },
  ];

  return (
    <aside className="w-60 shrink-0 select-none overflow-y-auto border-r border-slate-200/80 bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-950 max-sm:w-[68px]">
      <div className="flex min-h-full flex-col">
        <div className="border-b border-slate-100 px-4 py-5 dark:border-zinc-800 max-sm:px-2 max-sm:flex max-sm:justify-center">
          <Logo size="sm" showSubtitle />
        </div>

        <nav aria-label="Navegação principal" className="flex-1 space-y-6 px-3 py-5 max-sm:px-2">
          {menuSections.map(section => {
            const visibleItems = section.items.filter(item => item.roles.includes(currentRole));
            if (visibleItems.length === 0) return null;

            return (
              <section key={section.title} aria-label={section.title}>
                <h2 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-zinc-500 max-sm:hidden">
                  {section.title}
                </h2>
                <div className="space-y-1">
                  {visibleItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        title={item.label}
                        className={`group flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#426d70] max-sm:justify-center max-sm:px-0 ${
                          isActive
                            ? 'bg-[#edf4f3] font-semibold text-[#31585b] dark:bg-[#202e30] dark:text-[#a4c9c3]'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-[#426d70] dark:text-[#a4c9c3]' : 'text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'}`} />
                          <span className="truncate max-sm:hidden">{item.label}</span>
                        </span>
                        {item.badge && (
                          <span className="ml-2 min-w-5 rounded-full bg-[#e5efed] px-1.5 py-0.5 text-center text-[10px] font-bold text-[#31585b] dark:bg-[#2b4142] dark:text-[#a4c9c3] max-sm:hidden">
                            {item.badge}
                          </span>
                        )}
                        {item.highlight && !item.badge && <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[#5b8985] max-sm:hidden" />}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-3 dark:border-zinc-800 max-sm:hidden">
          <div className="rounded-xl border border-slate-200/80 bg-[#f7f9f9] p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 dark:text-zinc-300">
                <Share2 className="h-3.5 w-3.5 text-[#426d70] dark:text-[#a4c9c3]" /> Link de agendamento
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-label="Link ativo" />
            </div>
            <p className="mb-2.5 truncate text-[11px] text-slate-500 dark:text-zinc-400">{activeTenant.bookingUrl}</p>
            <button
              type="button"
              onClick={onOpenBookingPreview}
              className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#426d70] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <span>Ver página pública</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
