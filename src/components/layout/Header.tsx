import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  CalendarPlus, 
  ExternalLink, 
  Smartphone, 
  LayoutDashboard, 
  ChevronDown, 
  Wallet,
  Sparkles,
  Scissors,
  CreditCard
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { ThemeToggle } from '../common/ThemeToggle';
import { Logo } from '../common/Logo';

interface HeaderProps {
  onOpenNewAppointment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNewAppointment }) => {
  const { 
    currentMode, 
    setCurrentMode, 
    tenants, 
    activeTenant, 
    setActiveTenantId,
    branches,
    activeBranch,
    setActiveBranchId,
    currentRole,
    setCurrentRole,
    cashSession,
    setActiveTab
  } = useVelora();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="bg-white/95 dark:bg-zinc-950/95 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-40 backdrop-blur-md transition-colors">
      {/* Top Banner: Multi-Experience Switcher Bar */}
      <div className="px-4 py-1.5 bg-slate-50 dark:bg-zinc-900/80 border-b border-slate-200/80 dark:border-zinc-800/60 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-medium text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>VELORA CLOUD MULTI-TENANT</span>
          </div>
          <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">|</span>
          <span className="text-slate-500 dark:text-zinc-400 hidden md:inline text-[11px]">
            Isolamento de dados por <strong className="text-slate-700 dark:text-zinc-300 font-semibold">tenant_id</strong> &amp; RLS
          </span>
        </div>

        {/* 3 Connected Environments Switcher: VELORA Business, VELORA Professional, VELORA Client */}
        <div className="flex items-center bg-slate-200/70 dark:bg-zinc-900/90 p-0.5 rounded-lg border border-slate-200 dark:border-zinc-800 flex-wrap gap-1">
          <button
            onClick={() => setCurrentMode('business')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              currentMode === 'business'
                ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-zinc-950 shadow-xs font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
            title="Ambiente 01: Gestão, Financeiro e Dono"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-600 dark:text-inherit" />
            <span>01. Business</span>
          </button>

          <button
            onClick={() => setCurrentMode('professional')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              currentMode === 'professional'
                ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-zinc-950 shadow-xs font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
            title="Ambiente 02: Agenda do Barbeiro e Comissões"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-600 dark:text-inherit" />
            <span>02. Professional</span>
          </button>

          <button
            onClick={() => setCurrentMode('client')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              currentMode === 'client' || currentMode === 'booking'
                ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-zinc-950 shadow-xs font-bold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
            title="Ambiente 03: Booking do Cliente + VELORA PASS"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-inherit" />
            <span>03. Client</span>
          </button>

          <button
            onClick={() => setCurrentMode('mobile_preview')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              currentMode === 'mobile_preview'
                ? 'bg-white dark:bg-amber-500 text-slate-900 dark:text-zinc-950 shadow-xs font-bold'
                : 'text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300'
            }`}
            title="Simulador PWA Mobile"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PWA</span>
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Active Establishment */}
        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <Logo size="md" showSubtitle={true} />
          </div>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-zinc-800 hidden sm:block" />

          {/* Tenant Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-800 dark:text-zinc-200 transition-colors shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="font-semibold text-slate-900 dark:text-white max-w-[140px] truncate">{activeTenant.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
            </button>

            {tenantDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-xl shadow-xl p-1.5 z-50">
                <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-400 tracking-wider">
                  Unidade Selecionada
                </div>
                {tenants.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTenantId(t.id);
                      setTenantDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                      t.id === activeTenant.id
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <img 
                      src={t.logo} 
                      alt={t.name} 
                      className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-zinc-700" 
                    />
                    <div className="flex-1 truncate">
                      <div className="font-medium text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-400">{t.city}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Branch Switcher */}
          {branches.filter(b => b.tenantId === activeTenant.id).length > 1 && (
            <div className="hidden lg:flex items-center gap-1 text-xs text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 px-2.5 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              <select
                value={activeBranch.id}
                onChange={e => setActiveBranchId(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-zinc-200 outline-none cursor-pointer text-xs"
              >
                {branches
                  .filter(b => b.tenantId === activeTenant.id)
                  .map(b => (
                    <option key={b.id} value={b.id} className="bg-white text-slate-900 dark:bg-zinc-900 dark:text-white">
                      {b.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Actions: Role Switcher, Cash status, ThemeToggle, New Appointment */}
        <div className="flex items-center gap-2.5">
          {/* Cash Register indicator */}
          <button 
            onClick={() => setActiveTab('finance')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-xs transition-colors shadow-xs"
            title="Sessão de caixa diária"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-500 dark:text-zinc-400">Caixa:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{formatCurrency(cashSession.currentAmountInCents)}</span>
          </button>

          {/* Role Simulator Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-slate-500 dark:text-zinc-400">Perfil:</span>
              <span className="font-semibold text-slate-900 dark:text-white capitalize">
                {currentRole === 'owner' ? 'Proprietário' : currentRole === 'professional' ? 'Profissional' : 'Recepção'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-xl p-1 z-50 text-xs">
                <button
                  onClick={() => { setCurrentRole('owner'); setRoleDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                >
                  <strong className="block text-slate-900 dark:text-white">Proprietário (Admin)</strong>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">Acesso irrestrito a financeiro e equipe</span>
                </button>
                <button
                  onClick={() => { setCurrentRole('professional'); setRoleDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                >
                  <strong className="block text-slate-900 dark:text-white">Profissional</strong>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">Apenas sua agenda e comissões</span>
                </button>
                <button
                  onClick={() => { setCurrentRole('receptionist'); setRoleDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                >
                  <strong className="block text-slate-900 dark:text-white">Recepção</strong>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400">Agenda geral, caixa e clientes</span>
                </button>
              </div>
            )}
          </div>

          {/* Dedicated ThemeToggle & Integrated Palette Component */}
          <ThemeToggle />

          {/* Quick New Appointment Button */}
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Agendamento</span>
            <span className="sm:hidden">Agendar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
