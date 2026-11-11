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
  // Navigation & 3 Connected Environments (Business, Professional, Client)
  currentMode: 'business' | 'professional' | 'client' | 'booking' | 'mobile_preview';
  setCurrentMode: (mode: 'business' | 'professional' | 'client' | 'booking' | 'mobile_preview') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Multi-Tenant Context
  tenants: Tenant[];
  activeTenant: Tenant;
  setActiveTenantId: (id: string) => void;

  branches: Branch[];
  activeBranch: Branch;
  setActiveBranchId: (id: string) => void;

  // Active Role & Filtering
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeStaffFilter: string; // 'all' or staff.id
  setActiveStaffFilter: (id: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Entities filtered by active tenant
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

  // Theme & High Contrast Palette
  themeMode: ThemeMode;
  colorPalette: ColorPalette;
  setColorPalette: (palette: ColorPalette) => void;
  activePalette: ColorPalette;
  setActivePalette: (palette: ColorPalette) => void;
  toggleTheme: () => void;
  toggleThemeMode: () => void;

  // Club actions
  toggleMemberStatus: (id: string) => void;

  // Inventory actions
  updateInventoryStock: (id: string, delta: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastRestockDate'>) => void;

  // Marketing actions
  triggerCampaign: (id: string) => void;

  // Actions
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

  // Helper metrics
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

export const VeloraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize state
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
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-10');

  // Master collections
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

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  const toggleThemeMode = toggleTheme;

  const toggleMemberStatus = (memberId: string) => {
    setClubMembersList(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          status: m.status === 'active' ? 'pending_payment' : 'active'
        };
      }
      return m;
    }));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_staff`, JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_services`, JSON.stringify(servicesList));
  }, [servicesList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_customers`, JSON.stringify(customersList));
  }, [customersList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_appointments`, JSON.stringify(appointmentsList));
  }, [appointmentsList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_transactions`, JSON.stringify(transactionsList));
  }, [transactionsList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cash`, JSON.stringify(cashSession));
  }, [cashSession]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_inventory`, JSON.stringify(inventoryList));
  }, [inventoryList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_campaigns`, JSON.stringify(campaignsList));
  }, [campaignsList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_club_plans`, JSON.stringify(clubPlansList));
  }, [clubPlansList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_club_members`, JSON.stringify(clubMembersList));
  }, [clubMembersList]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_palette`, colorPalette);
    document.body.classList.remove('palette-default', 'palette-gold', 'palette-cobalt', 'palette-emerald');
    const appliedClass = colorPalette === 'default' ? 'palette-gold' : `palette-${colorPalette}`;
    document.body.classList.add(appliedClass);
  }, [colorPalette]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_theme`, themeMode);
    if (themeMode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, [themeMode]);

  // Active Tenant & Branch Resolution
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const activeBranch = branches.find(b => b.id === activeBranchId && b.tenantId === activeTenantId) || 
                       branches.find(b => b.tenantId === activeTenantId) || 
                       branches[0];

  const setActiveTenantId = (newTenantId: string) => {
    setActiveTenantIdState(newTenantId);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_active_tenant`, newTenantId);
    const tenantBranch = branches.find(b => b.tenantId === newTenantId);
    if (tenantBranch) {
      setActiveBranchId(tenantBranch.id);
    }
    setActiveStaffFilter('all');
  };

  // Filtered for current tenant
  const tenantStaff = staffList.filter(s => s.tenantId === activeTenant.id);
  const tenantServices = servicesList.filter(s => s.tenantId === activeTenant.id);
  const tenantCategories = categoriesList.filter(c => c.tenantId === activeTenant.id);
  const tenantCustomers = customersList.filter(c => c.tenantId === activeTenant.id);
  const tenantAppointments = appointmentsList.filter(a => a.tenantId === activeTenant.id);
  const tenantTransactions = transactionsList.filter(t => t.tenantId === activeTenant.id);
  const tenantInventory = inventoryList.filter(i => i.tenantId === activeTenant.id);
  const tenantCampaigns = campaignsList.filter(c => c.tenantId === activeTenant.id);
  const tenantClubPlans = clubPlansList.filter(p => p.tenantId === activeTenant.id);
  const tenantClubMembers = clubMembersList.filter(m => m.tenantId === activeTenant.id);

  const updateInventoryStock = (id: string, delta: number) => {
    setInventoryList(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          currentStock: Math.max(0, item.currentStock + delta),
          lastRestockDate: delta > 0 ? new Date().toISOString().split('T')[0] : item.lastRestockDate
        };
      }
      return item;
    }));
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastRestockDate'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      lastRestockDate: new Date().toISOString().split('T')[0]
    };
    setInventoryList(prev => [...prev, newItem]);
  };

  const triggerCampaign = (id: string) => {
    setCampaignsList(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'sent',
          sentAt: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
  };

  // Time conversion helper
  const timeToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Actions
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>) => {
    // Check for double booking collision (conflict detection)
    const newStart = timeToMinutes(aptData.startTime);
    const newEnd = timeToMinutes(aptData.endTime);

    const hasConflict = appointmentsList.some(apt => {
      if (apt.tenantId !== aptData.tenantId || apt.date !== aptData.date || apt.professionalId !== aptData.professionalId) {
        return false;
      }
      if (apt.status === 'cancelled') return false;

      const aptStart = timeToMinutes(apt.startTime);
      const aptEnd = timeToMinutes(apt.endTime);

      // Overlap formula: startA < endB && endA > startB
      return newStart < aptEnd && newEnd > aptStart;
    });

    if (hasConflict) {
      return { 
        success: false, 
        message: `Conflito de horário! O profissional já possui atendimento agendado neste intervalo.` 
      };
    }

    const newAppointment: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setAppointmentsList(prev => [newAppointment, ...prev]);

    // Update customer stats
    setCustomersList(prev => prev.map(c => {
      if (c.id === aptData.customerId) {
        return {
          ...c,
          appointmentsCount: c.appointmentsCount + 1,
          lastVisit: aptData.date
        };
      }
      return c;
    }));

    return { success: true, appointment: newAppointment };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointmentsList(prev => prev.map(apt => {
      if (apt.id === id) {
        return { ...apt, status };
      }
      return apt;
    }));
  };

  const checkoutAppointment = (id: string, paymentMethod: PaymentMethod) => {
    const targetApt = appointmentsList.find(a => a.id === id);
    if (!targetApt) return;

    // 1. Mark appointment as completed & paid
    setAppointmentsList(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod
        };
      }
      return apt;
    }));

    // 2. Add income transaction
    const newTransaction: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      tenantId: targetApt.tenantId,
      type: 'income',
      category: 'Serviço',
      description: `Atendimento: ${targetApt.serviceName} (${targetApt.customerName})`,
      amountInCents: targetApt.priceInCents,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      paymentMethod,
      status: 'completed',
      appointmentId: targetApt.id,
      professionalId: targetApt.professionalId
    };

    setTransactionsList(prev => [newTransaction, ...prev]);

    // 3. Update customer total spent
    setCustomersList(prev => prev.map(c => {
      if (c.id === targetApt.customerId) {
        return {
          ...c,
          totalSpentInCents: c.totalSpentInCents + targetApt.priceInCents,
          lastVisit: targetApt.date
        };
      }
      return c;
    }));

    // 4. Update cash session
    setCashSession(prev => ({
      ...prev,
      currentAmountInCents: prev.currentAmountInCents + targetApt.priceInCents,
      totalIncomeInCents: prev.totalIncomeInCents + targetApt.priceInCents
    }));
  };

  const cancelAppointment = (id: string, reason?: string) => {
    setAppointmentsList(prev => prev.map(apt => {
      if (apt.id === id) {
        return {
          ...apt,
          status: 'cancelled',
          notes: reason ? `${apt.notes ? apt.notes + ' | ' : ''}Motivo cancelamento: ${reason}` : apt.notes
        };
      }
      return apt;
    }));
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'appointmentsCount' | 'totalSpentInCents' | 'lastVisit' | 'firstVisit'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      appointmentsCount: 0,
      totalSpentInCents: 0,
      lastVisit: null,
      firstVisit: new Date().toISOString().split('T')[0]
    };
    setCustomersList(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomersList(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const addService = (srvData: Omit<Service, 'id'>) => {
    const newSrv: Service = {
      ...srvData,
      id: `srv-${Date.now()}`
    };
    setServicesList(prev => [...prev, newSrv]);
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServicesList(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const addStaff = (stfData: Omit<StaffMember, 'id' | 'completedAppointmentsCount' | 'rating'>) => {
    const newStaff: StaffMember = {
      ...stfData,
      id: `staff-${Date.now()}`,
      completedAppointmentsCount: 0,
      rating: 5.0
    };
    setStaffList(prev => [...prev, newStaff]);
  };

  const addTransaction = (txData: Omit<FinancialTransaction, 'id' | 'status'>) => {
    const newTx: FinancialTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      status: 'completed'
    };
    setTransactionsList(prev => [newTx, ...prev]);

    setCashSession(prev => {
      const isIncome = txData.type === 'income';
      return {
        ...prev,
        currentAmountInCents: isIncome 
          ? prev.currentAmountInCents + txData.amountInCents 
          : prev.currentAmountInCents - txData.amountInCents,
        totalIncomeInCents: isIncome 
          ? prev.totalIncomeInCents + txData.amountInCents 
          : prev.totalIncomeInCents,
        totalExpenseInCents: !isIncome 
          ? prev.totalExpenseInCents + txData.amountInCents 
          : prev.totalExpenseInCents
      };
    });
  };

  const closeCashSession = () => {
    setCashSession(prev => ({
      ...prev,
      isOpen: false,
      closedAt: new Date().toISOString()
    }));
  };

  const openCashSession = (initialAmountInCents: number) => {
    setCashSession({
      id: `cash-${Date.now()}`,
      tenantId: activeTenant.id,
      branchId: activeBranch.id,
      isOpen: true,
      openedAt: new Date().toISOString(),
      initialAmountInCents,
      currentAmountInCents: initialAmountInCents,
      totalIncomeInCents: 0,
      totalExpenseInCents: 0
    });
  };

  // Calculate high-level KPIs
  const todayAppointments = tenantAppointments.filter(a => a.date === selectedDate);
  const todayCompleted = todayAppointments.filter(a => a.status === 'completed');
  const todayRevenueInCents = todayCompleted.reduce((acc, a) => acc + a.priceInCents, 0);

  const monthRevenueInCents = tenantTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amountInCents, 0);

  const averageTicketInCents = todayCompleted.length > 0 
    ? Math.round(todayRevenueInCents / todayCompleted.length)
    : 7200;

  const totalPossibleDailySlots = (tenantStaff.length || 1) * 14; // roughly 14 half-hour slots per pro
  const occupancyRatePercentage = Math.min(100, Math.round((todayAppointments.length / Math.max(1, totalPossibleDailySlots)) * 100));

  const metrics = {
    todayRevenueInCents,
    monthRevenueInCents: Math.max(monthRevenueInCents, 3480000), // R$ 34.800
    todayAppointmentsCount: todayAppointments.length,
    todayCompletedCount: todayCompleted.length,
    occupancyRatePercentage: occupancyRatePercentage > 0 ? occupancyRatePercentage : 78,
    averageTicketInCents,
    monthlyGoalInCents: 4500000 // R$ 45.000,00
  };

  return (
    <VeloraContext.Provider value={{
      currentMode,
      setCurrentMode,
      activeTab,
      setActiveTab,
      tenants,
      activeTenant,
      setActiveTenantId,
      branches,
      activeBranch,
      setActiveBranchId,
      currentRole,
      setCurrentRole,
      activeStaffFilter,
      setActiveStaffFilter,
      selectedDate,
      setSelectedDate,
      staff: tenantStaff,
      services: tenantServices,
      categories: tenantCategories,
      customers: tenantCustomers,
      appointments: tenantAppointments,
      transactions: tenantTransactions,
      cashSession,
      aiInsights: INITIAL_AI_INSIGHTS,
      inventory: tenantInventory,
      campaigns: tenantCampaigns,
      clubPlans: tenantClubPlans,
      clubMembers: tenantClubMembers,
      themeMode,
      colorPalette,
      setColorPalette,
      activePalette: colorPalette,
      setActivePalette: setColorPalette,
      toggleMemberStatus,
      toggleTheme,
      toggleThemeMode,
      updateInventoryStock,
      addInventoryItem,
      triggerCampaign,
      addAppointment,
      updateAppointmentStatus,
      checkoutAppointment,
      cancelAppointment,
      addCustomer,
      updateCustomer,
      addService,
      updateService,
      addStaff,
      addTransaction,
      closeCashSession,
      openCashSession,
      metrics
    }}>
      {children}
    </VeloraContext.Provider>
  );
};

export const useVelora = () => {
  const context = useContext(VeloraContext);
  if (!context) {
    throw new Error('useVelora must be used within a VeloraProvider');
  }
  return context;
};
