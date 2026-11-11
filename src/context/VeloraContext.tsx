import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Tenant, Branch, StaffMember, ServiceCategory, Service, Customer, Appointment,
  FinancialTransaction, CashSession, AiInsight, AppointmentStatus, PaymentMethod,
  UserRole, InventoryItem, MarketingCampaign, ThemeMode, ColorPalette, ClubPlan, ClubMember,
} from '../types/velora';
import {
  INITIAL_TENANTS, INITIAL_BRANCHES, INITIAL_STAFF, INITIAL_CATEGORIES, INITIAL_SERVICES,
  INITIAL_CUSTOMERS, INITIAL_APPOINTMENTS, INITIAL_TRANSACTIONS, INITIAL_CASH_SESSION,
  INITIAL_AI_INSIGHTS, INITIAL_INVENTORY, INITIAL_CAMPAIGNS, INITIAL_CLUB_PLANS, INITIAL_CLUB_MEMBERS,
} from '../data/mockVeloraData';

interface VeloraContextType {
  currentMode: 'business' | 'professional' | 'client' | 'booking' | 'mobile_preview';
  setCurrentMode: (mode: 'business' | 'professional' | 'client' | 'booking' | 'mobile_preview') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tenants: Tenant[];
  activeTenant: Tenant;
  setActiveTenantId: (id: string) => void;
  branches: Branch[];
  activeBranch: Branch;
  setActiveBranchId: (id: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeStaffFilter: string;
  setActiveStaffFilter: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  staff: StaffMember[];
  services: Service[];
  categories: ServiceCategory[];
  customers: Customer[];
  appointments: Appointment[];
  transactions: FinancialTransaction[];
  cashSession: CashSession;
  aiInsights: AiInsight[];
  inventory: InventoryItem[];
  campaigns: MarketingCampaign[];
  clubPlans: ClubPlan[];
  clubMembers: ClubMember[];
  themeMode: ThemeMode;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  activePalette: ColorPalette;
  setActivePalette: (palette: ColorPalette) => void;
  toggleTheme: () => void;
  toggleThemeMode: () => void;
  toggleMemberStatus: (id: string) => void;
  updateInventoryStock: (id: string, delta: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestockDate'>) => void;
  triggerCampaign: (id: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => { success: boolean; message?: string; appointment?: Appointment };
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  checkoutAppointment: (id: string, paymentMethod: PaymentMethod) => void;
  cancelAppointment: (id: string, reason?: string) => void;
  addCustomer: (cust: Omit<Customer, 'id' | 'appointmentsCount' | 'totalSpentInCents' | 'lastVisit' | 'firstVisit'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  addService: (srv: Omit<Service, 'id'>) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  addStaff: (stf: Omit<StaffMember, 'id' | 'completedAppointmentsCount' | 'rating'>) => void;
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'status'>) => void;
  closeCashSession: () => void;
  openCashSession: (initialAmountInCents: number) => void;
  metrics: {
    todayRevenueInCents: number;
    monthRevenueInCents: number;
    todayAppointmentsCount: number;
    todayCompletedCount: number;
    occupancyRatePercentage: number;
    averageTicketInCents: number;
    monthlyGoalInCents: number;
  };
}

const VeloraContext = createContext<VeloraContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = 'velora_master_state_v1';

const getLocalDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const parseTime = (value: string): number | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
};

export const VeloraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [activeTenantId, setActiveTenantIdState] = useState<string>(() => localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_tenant`) || 'tenant-iago');
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [activeBranchId, setActiveBranchId] = useState('branch-iago-main');
  const [currentMode, setCurrentMode] = useState<'business' | 'professional' | 'client' | 'booking' | 'mobile_preview'>('business');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [activeStaffFilter, setActiveStaffFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(getLocalDate);

  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });
  const [servicesList, setServicesList] = useState<Service[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_services`);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });
  const [categoriesList] = useState<ServiceCategory[]>(INITIAL_CATEGORIES);
  const [customersList, setCustomersList] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_appointments`);
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });
  const [transactionsList, setTransactionsList] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [cashSession, setCashSession] = useState<CashSession>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cash`);
    return saved ? JSON.parse(saved) : INITIAL_CASH_SESSION;
  });
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inventory`);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });
  const [campaignsList, setCampaignsList] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_campaigns`);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });
  const [clubPlansList, setClubPlansList] = useState<ClubPlan[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_club_plans`);
    return saved ? JSON.parse(saved) : INITIAL_CLUB_PLANS;
  });
  const [clubMembersList, setClubMembersList] = useState<ClubMember[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_club_members`);
    return saved ? JSON.parse(saved) : INITIAL_CLUB_MEMBERS;
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem(`${LOCAL_STORAGE_KEY}_theme`) as ThemeMode) || 'light');
  const [colorPalette, setColorPalette] = useState<ColorPalette>(() => (localStorage.getItem(`${LOCAL_STORAGE_KEY}_palette`) as ColorPalette) || 'gold');
  // Prevent a rapid double click from generating duplicate payments before React commits state.
  const checkoutStarted = useRef(new Set<string>());

  const toggleTheme = () => setThemeMode(previous => previous === 'dark' ? 'light' : 'dark');
  const toggleThemeMode = toggleTheme;

  const toggleMemberStatus = (memberId: string) => {
    setClubMembersList(previous => previous.map(member => member.id === memberId
      ? { ...member, status: member.status === 'active' ? 'pending_payment' : 'active' }
      : member));
  };

  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_staff`, JSON.stringify(staffList)); }, [staffList]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_services`, JSON.stringify(servicesList)); }, [servicesList]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customersList)); }, [customersList]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_appointments`, JSON.stringify(appointmentsList)); }, [appointmentsList]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_transactions`, JSON.stringify(transactionsList)); }, [transactionsList]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_cash`, JSON.stringify(cashSession)); }, [cashSession]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_inventory`, JSON.stringify(inventoryList)); }, [inventoryList]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_campaigns`, JSON.stringify(campaignsList)); }, [campaignsList]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_club_plans`, JSON.stringify(clubPlansList)); }, [clubPlansList]);
  useEffect(() => { localStorage.setItem(`${LOCAL_STORAGE_KEY}_club_members`, JSON.stringify(clubMembersList)); }, [clubMembersList]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_palette`, colorPalette);
    document.body.classList.remove('palette-default', 'palette-gold', 'palette-cobalt', 'palette-emerald');
    document.body.classList.add(colorPalette === 'default' ? 'palette-gold' : `palette-${colorPalette}`);
  }, [colorPalette]);
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_theme`, themeMode);
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
    document.documentElement.classList.toggle('light', themeMode === 'light');
    document.body.classList.toggle('theme-dark', themeMode === 'dark');
    document.body.classList.toggle('theme-light', themeMode === 'light');
  }, [themeMode]);

  const activeTenant = tenants.find(tenant => tenant.id === activeTenantId) || tenants[0];
  const activeBranch = branches.find(branch => branch.id === activeBranchId && branch.tenantId === activeTenantId)
    || branches.find(branch => branch.tenantId === activeTenantId) || branches[0];
  const setActiveTenantId = (id: string) => {
    setActiveTenantIdState(id);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_tenant`, id);
    const branch = branches.find(item => item.tenantId === id);
    if (branch) setActiveBranchId(branch.id);
    setActiveStaffFilter('all');
  };

  const tenantStaff = staffList.filter(item => item.tenantId === activeTenant.id);
  const tenantServices = servicesList.filter(item => item.tenantId === activeTenant.id);
  const tenantCategories = categoriesList.filter(item => item.tenantId === activeTenant.id);
  const tenantCustomers = customersList.filter(item => item.tenantId === activeTenant.id);
  const tenantAppointments = appointmentsList.filter(item => item.tenantId === activeTenant.id);
  const tenantTransactions = transactionsList.filter(item => item.tenantId === activeTenant.id);
  const tenantInventory = inventoryList.filter(item => item.tenantId === activeTenant.id);
  const tenantCampaigns = campaignsList.filter(item => item.tenantId === activeTenant.id);
  const tenantClubPlans = clubPlansList.filter(item => item.tenantId === activeTenant.id);
  const tenantClubMembers = clubMembersList.filter(item => item.tenantId === activeTenant.id);

  const updateInventoryStock = (id: string, delta: number) => {
    setInventoryList(previous => previous.map(item => item.id === id ? {
      ...item,
      currentStock: Math.max(0, item.currentStock + delta),
      lastRestockDate: delta > 0 ? getLocalDate() : item.lastRestockDate,
    } : item));
  };
  const addInventoryItem = (data: Omit<InventoryItem, 'id' | 'lastRestockDate'>) => {
    setInventoryList(previous => [...previous, { ...data, id: `inv-${Date.now()}`, lastRestockDate: getLocalDate() }]);
  };
  const triggerCampaign = (id: string) => {
    setCampaignsList(previous => previous.map(item => item.id === id ? { ...item, status: 'sent', sentAt: getLocalDate() } : item));
  };

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>) => {
    const start = parseTime(data.startTime);
    const end = parseTime(data.endTime);
    const service = servicesList.find(item => item.id === data.serviceId && item.tenantId === data.tenantId);
    const professional = staffList.find(item => item.id === data.professionalId && item.tenantId === data.tenantId && item.isActive);
    const customer = customersList.find(item => item.id === data.customerId && item.tenantId === data.tenantId);
    const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.date);
    const date = dateParts ? new Date(Number(dateParts[1]), Number(dateParts[2]) - 1, Number(dateParts[3])) : null;

    if (start === null || end === null || end <= start) return { success: false, message: 'Informe um horário de início e término válidos.' };
    if (!date || !dateParts || date.getFullYear() !== Number(dateParts[1]) || date.getMonth() !== Number(dateParts[2]) - 1 || date.getDate() !== Number(dateParts[3])) {
      return { success: false, message: 'Selecione uma data válida para o agendamento.' };
    }
    if (!service || !professional || !customer) {
      return { success: false, message: 'Cliente, serviço ou profissional não pertence a esta unidade ou não está disponível.' };
    }
    if (!professional.serviceIds.includes(service.id)) return { success: false, message: 'Este profissional não está habilitado para realizar o serviço selecionado.' };
    if (end - start !== service.durationMinutes) return { success: false, message: 'O horário de término não corresponde à duração do serviço selecionado.' };

    const weekday = date.getDay();
    const workStart = parseTime(professional.workingHours.start);
    const workEnd = parseTime(professional.workingHours.end);
    const occupiedEnd = end + Math.max(0, service.bufferMinutes || 0);
    if (!professional.workingHours.days.includes(weekday) || workStart === null || workEnd === null || start < workStart || occupiedEnd > workEnd) {
      return { success: false, message: 'O profissional não atende nesse dia ou horário. Escolha um horário dentro da disponibilidade.' };
    }

    const conflict = appointmentsList.some(existing => {
      if (existing.tenantId !== data.tenantId || existing.date !== data.date || existing.professionalId !== data.professionalId || ['cancelled', 'no_show'].includes(existing.status)) return false;
      const existingStart = parseTime(existing.startTime);
      const existingEnd = parseTime(existing.endTime);
      if (existingStart === null || existingEnd === null) return false;
      const existingService = servicesList.find(item => item.id === existing.serviceId && item.tenantId === existing.tenantId);
      const existingOccupiedEnd = existingEnd + Math.max(0, existingService?.bufferMinutes || 0);
      return start < existingOccupiedEnd && occupiedEnd > existingStart;
    });
    if (conflict) return { success: false, message: 'Esse horário conflita com outro atendimento ou com o intervalo de preparação. Escolha outro horário.' };

    const branch = branches.find(item => item.id === data.branchId && item.tenantId === data.tenantId)
      || branches.find(item => item.tenantId === data.tenantId);
    if (!branch) return { success: false, message: 'Não foi encontrada uma unidade válida para este agendamento.' };

    const appointment: Appointment = { ...data, branchId: branch.id, id: `apt-${Date.now()}`, createdAt: new Date().toISOString() };
    setAppointmentsList(previous => [appointment, ...previous]);
    setCustomersList(previous => previous.map(item => item.id === data.customerId ? {
      ...item, appointmentsCount: item.appointmentsCount + 1, lastVisit: data.date,
    } : item));
    return { success: true, appointment };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointmentsList(previous => previous.map(item => {
      if (item.id !== id) return item;
      if (item.status === 'confirmed' && ['in_progress', 'cancelled', 'no_show'].includes(status)) return { ...item, status };
      if (item.status === 'in_progress' && ['cancelled', 'no_show'].includes(status)) return { ...item, status };
      return item;
    }));
  };

  const checkoutAppointment = (id: string, paymentMethod: PaymentMethod) => {
    const appointment = appointmentsList.find(item => item.id === id);
    if (!appointment || ['completed', 'cancelled', 'no_show'].includes(appointment.status) || checkoutStarted.current.has(id)) return;
    checkoutStarted.current.add(id);
    setAppointmentsList(previous => previous.map(item => item.id === id ? {
      ...item, status: 'completed', paymentStatus: 'paid', paymentMethod,
    } : item));
    const transaction: FinancialTransaction = {
      id: `tx-${Date.now()}`, tenantId: appointment.tenantId, type: 'income', category: 'Serviço',
      description: `Atendimento: ${appointment.serviceName} (${appointment.customerName})`,
      amountInCents: appointment.priceInCents, date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod, status: 'completed', appointmentId: appointment.id, professionalId: appointment.professionalId,
    };
    setTransactionsList(previous => [transaction, ...previous]);
    setCustomersList(previous => previous.map(customer => customer.id === appointment.customerId ? {
      ...customer, totalSpentInCents: customer.totalSpentInCents + appointment.priceInCents, lastVisit: appointment.date,
    } : customer));
    setCashSession(previous => ({
      ...previous, currentAmountInCents: previous.currentAmountInCents + appointment.priceInCents,
      totalIncomeInCents: previous.totalIncomeInCents + appointment.priceInCents,
    }));
  };

  const cancelAppointment = (id: string, reason?: string) => {
    setAppointmentsList(previous => previous.map(item => {
      if (item.id !== id || !['confirmed', 'in_progress'].includes(item.status)) return item;
      return { ...item, status: 'cancelled', notes: reason ? `${item.notes ? `${item.notes} | ` : ''}Motivo cancelamento: ${reason}` : item.notes };
    }));
  };
  const addCustomer = (data: Omit<Customer, 'id' | 'appointmentsCount' | 'totalSpentInCents' | 'lastVisit' | 'firstVisit'>): Customer => {
    const customer: Customer = { ...data, id: `cust-${Date.now()}`, appointmentsCount: 0, totalSpentInCents: 0, lastVisit: null, firstVisit: getLocalDate() };
    setCustomersList(previous => [customer, ...previous]);
    return customer;
  };
  const updateCustomer = (id: string, data: Partial<Customer>) => setCustomersList(previous => previous.map(item => item.id === id ? { ...item, ...data } : item));
  const addService = (data: Omit<Service, 'id'>) => setServicesList(previous => [...previous, { ...data, id: `srv-${Date.now()}` }]);
  const updateService = (id: string, data: Partial<Service>) => setServicesList(previous => previous.map(item => item.id === id ? { ...item, ...data } : item));
  const addStaff = (data: Omit<StaffMember, 'id' | 'completedAppointmentsCount' | 'rating'>) => setStaffList(previous => [...previous, { ...data, id: `staff-${Date.now()}`, completedAppointmentsCount: 0, rating: 5 }]);
  const addTransaction = (data: Omit<FinancialTransaction, 'id' | 'status'>) => {
    setTransactionsList(previous => [{ ...data, id: `tx-${Date.now()}`, status: 'completed' }, ...previous]);
    setCashSession(previous => ({
      ...previous,
      currentAmountInCents: data.type === 'income' ? previous.currentAmountInCents + data.amountInCents : previous.currentAmountInCents - data.amountInCents,
      totalIncomeInCents: data.type === 'income' ? previous.totalIncomeInCents + data.amountInCents : previous.totalIncomeInCents,
      totalExpenseInCents: data.type === 'expense' ? previous.totalExpenseInCents + data.amountInCents : previous.totalExpenseInCents,
    }));
  };
  const closeCashSession = () => setCashSession(previous => ({ ...previous, isOpen: false, closedAt: new Date().toISOString() }));
  const openCashSession = (amount: number) => setCashSession({
    id: `cash-${Date.now()}`, tenantId: activeTenant.id, branchId: activeBranch.id, isOpen: true,
    openedAt: new Date().toISOString(), initialAmountInCents: amount, currentAmountInCents: amount,
    totalIncomeInCents: 0, totalExpenseInCents: 0,
  });

  const todayAppointments = tenantAppointments.filter(item => item.date === selectedDate);
  const completedToday = todayAppointments.filter(item => item.status === 'completed');
  const todayRevenueInCents = completedToday.reduce((sum, item) => sum + item.priceInCents, 0);
  const monthRevenueInCents = tenantTransactions.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amountInCents, 0);
  const averageTicketInCents = completedToday.length ? Math.round(todayRevenueInCents / completedToday.length) : 7200;
  const totalSlots = Math.max(1, tenantStaff.filter(item => item.isActive).length * 14);
  const occupancyRatePercentage = Math.min(100, Math.round(todayAppointments.length / totalSlots * 100));
  const metrics = {
    todayRevenueInCents, monthRevenueInCents: Math.max(monthRevenueInCents, 3480000),
    todayAppointmentsCount: todayAppointments.length, todayCompletedCount: completedToday.length,
    occupancyRatePercentage: occupancyRatePercentage || 78, averageTicketInCents, monthlyGoalInCents: 4500000,
  };

  return (
    <VeloraContext.Provider value={{
      currentMode, setCurrentMode, activeTab, setActiveTab, tenants, activeTenant, setActiveTenantId,
      branches, activeBranch, setActiveBranchId, currentRole, setCurrentRole, activeStaffFilter, setActiveStaffFilter,
      selectedDate, setSelectedDate, staff: tenantStaff, services: tenantServices, categories: tenantCategories,
      customers: tenantCustomers, appointments: tenantAppointments, transactions: tenantTransactions, cashSession,
      aiInsights: INITIAL_AI_INSIGHTS, inventory: tenantInventory, campaigns: tenantCampaigns,
      clubPlans: tenantClubPlans, clubMembers: tenantClubMembers, themeMode, colorPalette,
      setColorPalette, activePalette: colorPalette, setActivePalette: setColorPalette, toggleMemberStatus,
      toggleTheme, toggleThemeMode, updateInventoryStock, addInventoryItem, triggerCampaign, addAppointment,
      updateAppointmentStatus, checkoutAppointment, cancelAppointment, addCustomer, updateCustomer, addService,
      updateService, addStaff, addTransaction, closeCashSession, openCashSession, metrics,
    }}>
      {children}
    </VeloraContext.Provider>
  );
};

export const useVelora = () => {
  const context = useContext(VeloraContext);
  if (!context) throw new Error('useVelora must be used within a VeloraProvider');
  return context;
};
