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
  Crown
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
  const { activeTab, setActiveTab, currentRole, activeTenant, appointments } = useVelora();

  // Badge count for pending/in_progress appointments today
  const pendingCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'in_progress').length;

  const menuSections: MenuSection[] = [
    {
      title: 'GESTÃO',
      items: [
        { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, roles: ['owner', 'manager', 'receptionist', 'professional'] },
        { id: 'agenda', label: 'Agenda', icon: Calendar, badge: pendingCount > 0 ? String(pendingCount) : undefined, roles: ['owner', 'manager', 'receptionist', 'professional'] },
        { id: 'appointments', label: 'Agendamentos', icon: Clock, roles: ['owner', 'manager', 'receptionist', 'professional'] },
        { id: 'crm', label: 'Clientes', icon: Users, roles: ['owner', 'manager', 'receptionist'] },
        { id: 'staff', label: 'Profissionais', icon: UserCheck, roles: ['owner', 'manager'] },
        { id: 'services', label: 'Serviços', icon: Scissors, roles: ['owner', 'manager'] }
      ]
    },
    {
      title: 'FINANCEIRO',
      items: [
        { id: 'finance', label: 'Financeiro', icon: DollarSign, roles: ['owner', 'manager'] },
        { id: 'cash', label: 'Caixa', icon: Wallet, roles: ['owner', 'manager', 'receptionist'] },
        { id: 'commissions', label: 'Comissões', icon: Percent, roles: ['owner', 'manager', 'professional'] },
        { id: 'inventory', label: 'Estoque', icon: Package, roles: ['owner', 'manager'] }
      ]
    },
    {
      title: 'CRESCIMENTO',
      items: [
        { id: 'club', label: 'VELORA CLUB', icon: Crown, highlight: true, roles: ['owner', 'manager', 'receptionist'] },
        { id: 'marketing', label: 'Marketing', icon: Megaphone, roles: ['owner', 'manager'] },
        { id: 'reports', label: 'Relatórios', icon: BarChart3, roles: ['owner', 'manager'] },
        { id: 'ai', label: 'VELORA AI', icon: Sparkles, highlight: true, roles: ['owner', 'manager'] },
        { id: 'settings', label: 'Configurações', icon: Settings, roles: ['owner'] }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 flex flex-col justify-between shrink-0 select-none overflow-y-auto transition-colors">
      <div className="p-3 space-y-4">
        {/* Brand Header Badge */}
        <div className="px-3 pt-2 pb-2 border-b border-slate-100 dark:border-zinc-900">
          <Logo size="sm" showSubtitle={true} />
        </div>

        {/* 3 Main Sections: GESTÃO, FINANCEIRO, CRESCIMENTO */}
        {menuSections.map(section => {
          const visibleSectionItems = section.items.filter(item => item.roles.includes(currentRole));
          if (visibleSectionItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {section.title}
              </div>

              {visibleSectionItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200 shadow-xs dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive 
                          ? 'text-amber-700 dark:text-amber-400' 
                          : item.highlight 
                          ? 'text-amber-600/80 group-hover:text-amber-700 dark:text-amber-400/80 dark:group-hover:text-amber-300' 
                          : 'text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 shrink-0">
                        {item.badge}
                      </span>
                    )}

                    {item.highlight && !item.badge && (
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Booking Page Link Card */}
      <div className="p-3 border-t border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              Link de Agendamento
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <p className="text-[11px] text-slate-600 dark:text-zinc-300 font-mono truncate mb-2">
            {activeTenant.bookingUrl}
          </p>

          <button
            onClick={onOpenBookingPreview}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            <span>Ver Booking Público</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};
