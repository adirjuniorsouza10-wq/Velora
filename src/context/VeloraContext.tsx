import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tenant,
  Branch,
  StaffMember,
  ServiceCategory,
  Service,
  Customer,
  Appointment,
  FinancialTransaction,
  CashSession,
  AiInsight,
  AppointmentStatus,
  PaymentMethod,
  UserRole,
  InventoryItem,
  MarketingCampaign,
  ThemeMode,
  ColorPalette,
  ClubPlan,
  ClubMember
} from '../types/velora';
import {
  INITIAL_TENANTS,
  INITIAL_BRANCHES,
  INITIAL_STAFF,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_CUSTOMERS,
  INITIAL_APPOINTMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CASH_SESSION,
  INITIAL_AI_INSIGHTS,
  INITIAL_INVENTORY,
  INITIAL_CAMPAIGNS,
  INITIAL_CLUB_PLANS,
  INITIAL_CLUB_MEMBERS
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
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const [activeTenantId, setActiveTenantIdState] = useState<string>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_active_tenant`);
    return saved || 'tenant-iago';
  });
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [activeBranchId, setActiveBranchId] = useState<string>('branch-iago-main');
  const [currentMode, setCurrentMode] = useState<'business' | 'professional' | 'client' | 'booking' | 'mobile_preview'>('business');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [activeStaffFilter, setActiveStaffFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDate);

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
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_theme`);
    return (saved as ThemeMode) || 'light';
  });
  const [colorPalette, setColorPalette] = useState<ColorPalette>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_palette`);
    return (saved as ColorPalette) || 'gold';
  });

  const toggleTheme = () => setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleThemeMode = toggleTheme;

  const toggleMemberStatus = (memberId: string) => {
    setClubMembersList(prev => prev.map(member => member.id === memberId
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
    || branches.find(branch => branch.tenantId === activeTenantId)
    || branches[0];

  const setActiveTenantId = (newTenantId: string) => {
    setActiveTenantIdState(newTenantId);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_tenant`, newTenantId);
    const tenantBranch = branches.find(branch => branch.tenantId === newTenantId);
    if (tenantBranch) setActiveBranchId(tenantBranch.id);
    setActiveStaffFilter('all');
  };

  const tenantStaff = staffList.filter(member => member.tenantId === activeTenant.id);
  const tenantServices = servicesList.filter(service => service.tenantId === activeTenant.id);
  const tenantCategories = categoriesList.filter(category => category.tenantId === activeTenant.id);
  const tenantCustomers = customersList.filter(customer => customer.tenantId === activeTenant.id);
  const tenantAppointments = appointmentsList.filter(appointment => appointment.tenantId === activeTenant.id);
  const tenantTransactions = transactionsList.filter(transaction => transaction.tenantId === activeTenant.id);
  const tenantInventory = inventoryList.filter(item => item.tenantId === activeTenant.id);
  const tenantCampaigns = campaignsList.filter(campaign => campaign.tenantId === activeTenant.id);
  const tenantClubPlans = clubPlansList.filter(plan => plan.tenantId === activeTenant.id);
  const tenantClubMembers = clubMembersList.filter(member => member.tenantId === activeTenant.id);

  const updateInventoryStock = (id: string, delta: number) => {
    setInventoryList(prev => prev.map(item => item.id === id ? {
      ...item,
      currentStock: Math.max(0, item.currentStock + delta),
      lastRestockDate: delta > 0 ? getLocalDate() : item.lastRestockDate,
    } : item));
  };
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastRestockDate'>) => {
    setInventoryList(prev => [...prev, { ...itemData, id: `inv-${Date.now()}`, lastRestockDate: getLocalDate() }]);
  };
  const triggerCampaign = (id: string) => {
    setCampaignsList(prev => prev.map(campaign => campaign.id === id
      ? { ...campaign, status: 'sent', sentAt: getLocalDate() }
      : campaign));
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newStart = parseTime(aptData.startTime);
    const newEnd = parseTime(aptData.endTime);
    const selectedService = servicesList.find(service => service.id === aptData.serviceId && service.tenantId === aptData.tenantId);
    const selectedStaff = staffList.find(member => member.id === aptData.professionalId && member.tenantId === aptData.tenantId && member.isActive);
    const customer = customersList.find(item => item.id === aptData.customerId && item.tenantId === aptData.tenantId);
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(aptData.date);
    const appointmentDate = dateMatch ? new Date(Number(dateMatch[1]), Number(dateMatch[2]) - 1, Number(dateMatch[3])) : null;

    if (!newStart || newEnd === null || newEnd <= newStart) {
      return { success: false, message: 'Informe um horário de início e término válidos.' };
    }
    if (!appointmentDate || Number.isNaN(appointmentDate.getTime()) || getLocalDate() !== aptData.date && dateMatch && (appointmentDate.getFullYear() !== Number(dateMatch[1]) || appointmentDate.getMonth() !== Number(dateMatch[2]) - 1 || appointmentDate.getDate() !== Number(dateMatch[3]))) {
      return { success: false, message: 'Selecione uma data válida para o agendamento.' };
    }
    if (!selectedService || !selectedStaff || !customer) {
      return { success: false, message: 'Cliente, serviço ou profissional não pertence a esta unidade ou não está disponível.' };
    }
    if (newEnd - newStart !== selectedService.durationMinutes) {
      return { success: false, message: 'O horário de término não corresponde à duração do serviço selecionado.' };
    }

    const dayOfWeek = appointmentDate.getDay();
    const shiftStart = parseTime(selectedStaff.workingHours.start);
    const shiftEnd = parseTime(selectedStaff.workingHours.end);
    const occupiedEnd = newEnd + Math.max(0, selectedService.bufferMinutes || 0);
    if (!selectedStaff.workingHours.days.includes(dayOfWeek) || shiftStart === null || shiftEnd === null || newStart < shiftStart || occupiedEnd > shiftEnd) {
      return { success: false, message: 'O profissional não atende nesse dia ou horário. Escolha um horário dentro da disponibilidade.' };
    }

    const hasConflict = appointmentsList.some(existing => {
      if (existing.tenantId !== aptData.tenantId || existing.date !== aptData.date || existing.professionalId !== aptData.professionalId || existing.status === 'cancelled') return false;
      const existingStart = parseTime(existing.startTime);
      const existingEnd = parseTime(existing.endTime);
      if (existingStart === null || existingEnd === null) return false;
      const existingService = servicesList.find(service => service.id === existing.serviceId && service.tenantId === existing.tenantId);
      const existingOccupiedEnd = existingEnd + Math.max(0, existingService?.bufferMinutes || 0);
      return newStart < existingOccupiedEnd && occupiedEnd > existingStart;
    });
    if (hasConflict) {
      return { success: false, message: 'Esse horário conflita com outro atendimento ou com o intervalo de preparação. Escolha outro horário.' };
    }

    const validBranch = branches.find(branch => branch.id === aptData.branchId && branch.tenantId === aptData.tenantId)
      || branches.find(branch => branch.tenantId === aptData.tenantId);
    if (!validBranch) return { success: false, message: 'Não foi encontrada uma unidade válida para este agendamento.' };

    const newAppointment: Appointment = {
      ...aptData,
      branchId: validBranch.id,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppointmentsList(prev => [newAppointment, ...prev]);
    setCustomersList(prev => prev.map(item => item.id === aptData.customerId ? {
      ...item,
      appointmentsCount: item.appointmentsCount + 1,
      lastVisit: aptData.date,
    } : item));
    return { success: true, appointment: newAppointment };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointmentsList(prev => prev.map(appointment => appointment.id === id ? { ...appointment, status } : appointment));
  };
  const checkoutAppointment = (id: string, paymentMethod: PaymentMethod) => {
    const targetAppointment = appointmentsList.find(appointment => appointment.id === id);
    if (!targetAppointment || targetAppointment.status === 'completed') return;
    setAppointmentsList(prev => prev.map(appointment => appointment.id === id
      ? { ...appointment, status: 'completed', paymentStatus: 'paid', paymentMethod }
      : appointment));
    const transaction: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      tenantId: targetAppointment.tenantId,
      type: 'income',
      category: 'Serviço',
      description: `Atendimento: ${targetAppointment.serviceName} (${targetAppointment.customerName})`,
      amountInCents: targetAppointment.priceInCents,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod,
      status: 'completed',
      appointmentId: targetAppointment.id,
      professionalId: targetAppointment.professionalId,
    };
    setTransactionsList(prev => [transaction, ...prev]);
    setCustomersList(prev => prev.map(customer => customer.id === targetAppointment.customerId ? {
      ...customer,
      totalSpentInCents: customer.totalSpentInCents + targetAppointment.priceInCents,
      lastVisit: targetAppointment.date,
    } : customer));
    setCashSession(prev => ({
      ...prev,
      currentAmountInCents: prev.currentAmountInCents + targetAppointment.priceInCents,
      totalIncomeInCents: prev.totalIncomeInCents + targetAppointment.priceInCents,
    }));
  };
  const cancelAppointment = (id: string, reason?: string) => {
    setAppointmentsList(prev => prev.map(appointment => appointment.id === id ? {
      ...appointment,
      status: 'cancelled',
      notes: reason ? `${appointment.notes ? `${appointment.notes} | ` : ''}Motivo cancelamento: ${reason}` : appointment.notes,
    } : appointment));
  };
  const addCustomer = (data: Omit<Customer, 'id' | 'appointmentsCount' | 'totalSpentInCents' | 'lastVisit' | 'firstVisit'>): Customer => {
    const newCustomer: Customer = { ...data, id: `cust-${Date.now()}`, appointmentsCount: 0, totalSpentInCents: 0, lastVisit: null, firstVisit: getLocalDate() };
    setCustomersList(prev => [newCustomer, ...prev]);
    return newCustomer;
  };
  const updateCustomer = (id: string, data: Partial<Customer>) => setCustomersList(prev => prev.map(customer => customer.id === id ? { ...customer, ...data } : customer));
  const addService = (data: Omit<Service, 'id'>) => setServicesList(prev => [...prev, { ...data, id: `srv-${Date.now()}` }]);
  const updateService = (id: string, data: Partial<Service>) => setServicesList(prev => prev.map(service => service.id === id ? { ...service, ...data } : service));
  const addStaff = (data: Omit<StaffMember, 'id' | 'completedAppointmentsCount' | 'rating'>) => setStaffList(prev => [...prev, { ...data, id: `staff-${Date.now()}`, completedAppointmentsCount: 0, rating: 5 }]);
  const addTransaction = (data: Omit<FinancialTransaction, 'id' | 'status'>) => {
    setTransactionsList(prev => [{ ...data, id: `tx-${Date.now()}`, status: 'completed' }, ...prev]);
    setCashSession(prev => ({
      ...prev,
      currentAmountInCents: data.type === 'income' ? prev.currentAmountInCents + data.amountInCents : prev.currentAmountInCents - data.amountInCents,
      totalIncomeInCents: data.type === 'income' ? prev.totalIncomeInCents + data.amountInCents : prev.totalIncomeInCents,
      totalExpenseInCents: data.type === 'expense' ? prev.totalExpenseInCents + data.amountInCents : prev.totalExpenseInCents,
    }));
  };
  const closeCashSession = () => setCashSession(prev => ({ ...prev, isOpen: false, closedAt: new Date().toISOString() }));
  const openCashSession = (initialAmountInCents: number) => setCashSession({
    id: `cash-${Date.now()}`, tenantId: activeTenant.id, branchId: activeBranch.id, isOpen: true,
    openedAt: new Date().toISOString(), initialAmountInCents, currentAmountInCents: initialAmountInCents,
    totalIncomeInCents: 0, totalExpenseInCents: 0,
  });

  const todayAppointments = tenantAppointments.filter(appointment => appointment.date === selectedDate);
  const completedToday = todayAppointments.filter(appointment => appointment.status === 'completed');
  const todayRevenueInCents = completedToday.reduce((sum, appointment) => sum + appointment.priceInCents, 0);
  const monthRevenueInCents = tenantTransactions.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amountInCents, 0);
  const averageTicketInCents = completedToday.length ? Math.round(todayRevenueInCents / completedToday.length) : 7200;
  const availableSlotsPerDay = Math.max(1, tenantStaff.filter(member => member.isActive).length * 14);
  const occupancyRatePercentage = Math.min(100, Math.round(todayAppointments.length / availableSlotsPerDay * 100));
  const metrics = {
    todayRevenueInCents,
    monthRevenueInCents: Math.max(monthRevenueInCents, 3480000),
    todayAppointmentsCount: todayAppointments.length,
    todayCompletedCount: completedToday.length,
    occupancyRatePercentage: occupancyRatePercentage || 78,
    averageTicketInCents,
    monthlyGoalInCents: 4500000,
  };

  return (
    <VeloraContext.Provider value={{
      currentMode, setCurrentMode, activeTab, setActiveTab, tenants, activeTenant, setActiveTenantId,
      branches, activeBranch, setActiveBranchId, currentRole, setCurrentRole, activeStaffFilter,
      setActiveStaffFilter, selectedDate, setSelectedDate, staff: tenantStaff, services: tenantServices,
      categories: tenantCategories, customers: tenantCustomers, appointments: tenantAppointments,
      transactions: tenantTransactions, cashSession, aiInsights: INITIAL_AI_INSIGHTS, inventory: tenantInventory,
      campaigns: tenantCampaigns, clubPlans: tenantClubPlans, clubMembers: tenantClubMembers,
      themeMode, colorPalette, setColorPalette, activePalette: colorPalette, setActivePalette: setColorPalette,
      toggleMemberStatus, toggleTheme, toggleThemeMode, updateInventoryStock, addInventoryItem,
      triggerCampaign, addAppointment, updateAppointmentStatus, checkoutAppointment, cancelAppointment,
      addCustomer, updateCustomer, addService, updateService, addStaff, addTransaction, closeCashSession,
      openCashSession, metrics,
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
