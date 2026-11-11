export type BusinessSegment = 'barber' | 'salon' | 'nails' | 'beauty';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  segment: BusinessSegment;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  logo: string;
  coverImage: string;
  bookingUrl: string;
  depositRequired: boolean;
  depositPercentage: number;
  cancellationPolicy: string;
  rating: number;
  reviewCount: number;
  openHoursSummary: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  phone: string;
  isMain: boolean;
}

export type UserRole = 'owner' | 'manager' | 'professional' | 'receptionist';

export interface StaffMember {
  id: string;
  tenantId: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar: string;
  specialties: string[];
  serviceIds: string[];
  commissionRate: number; // percentage, e.g. 50%
  workingHours: {
    start: string;
    end: string;
    days: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  };
  isActive: boolean;
  rating: number;
  completedAppointmentsCount: number;
}

export interface ServiceCategory {
  id: string;
  tenantId: string;
  name: string;
  icon?: string;
}

export interface Service {
  id: string;
  tenantId: string;
  categoryId: string;
  name: string;
  description: string;
  durationMinutes: number;
  bufferMinutes: number;
  priceInCents: number;
  requiresDeposit: boolean;
  depositPercentage?: number;
  onlineBookingEnabled: boolean;
  commissionPercentage: number;
  badge?: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  tags: string[];
  notes?: string;
  preferences?: string;
  totalSpentInCents: number;
  appointmentsCount: number;
  lastVisit: string | null;
  firstVisit: string;
  isVip: boolean;
}

export type AppointmentStatus = 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'deposit_paid' | 'paid';
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash';
export type BookingSource = 'online' | 'manual' | 'whatsapp';

export interface Appointment {
  id: string;
  tenantId: string;
  branchId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  priceInCents: number;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  source: BookingSource;
  notes?: string;
  createdAt: string;
}

export interface FinancialTransaction {
  id: string;
  tenantId: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amountInCents: number;
  date: string;
  paymentMethod: PaymentMethod;
  status: 'completed' | 'pending';
  appointmentId?: string;
  professionalId?: string;
}

export interface CashSession {
  id: string;
  tenantId: string;
  branchId: string;
  isOpen: boolean;
  openedAt: string;
  closedAt?: string;
  initialAmountInCents: number;
  currentAmountInCents: number;
  totalIncomeInCents: number;
  totalExpenseInCents: number;
}

export interface AiInsight {
  id: string;
  type: 'opportunity' | 'alert' | 'retention' | 'revenue';
  title: string;
  description: string;
  metric?: string;
  actionText?: string;
  actionPayload?: string;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  name: string;
  category: 'styling' | 'care' | 'supplies' | 'beverage';
  sku: string;
  currentStock: number;
  minStock: number;
  costPriceInCents: number;
  salePriceInCents: number;
  unit: string;
  lastRestockDate: string;
}

export interface MarketingCampaign {
  id: string;
  tenantId: string;
  title: string;
  targetAudience: string;
  channel: 'whatsapp' | 'email' | 'sms';
  status: 'draft' | 'active' | 'sent';
  messageTemplate: string;
  estimatedReach: number;
  conversionRate: number;
  sentAt?: string;
}

export type ThemeMode = 'dark' | 'light';
export type ColorPalette = 'default' | 'gold' | 'cobalt' | 'emerald';

export interface ClubPlan {
  id: string;
  tenantId: string;
  name: string;
  tagline: string;
  monthlyPriceInCents: number;
  servicesIncluded: string[];
  maxAppointmentsPerMonth: number; // e.g. 2, 4, or 999 for unlimited
  discountOnProductsPercent: number;
  badge?: string;
  activeMembersCount: number;
}

export interface ClubMember {
  id: string;
  tenantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  planId: string;
  planName: string;
  status: 'active' | 'pending_payment' | 'suspended';
  sinceDate: string;
  nextRenewalDate: string;
  usedAppointmentsThisMonth: number;
  limitAppointmentsThisMonth: number;
  paymentMethod: 'credit_card' | 'pix_recorrente';
}

export interface VeloraPass {
  customerId: string;
  customerName: string;
  customerPhone: string;
  tenantId: string;
  cardNumber: string;
  activePlan?: {
    id: string;
    name: string;
    monthlyPriceInCents: number;
    cutsRemaining: number;
    cutsTotal: number;
    renewalDate: string;
    status: 'active' | 'pending';
  };
  loyaltyPoints: number;
  pointsGoal: number; // e.g. 300 pts = Free cut
  favoriteBarberId?: string;
  favoriteBarberName?: string;
  benefits: string[];
  lastAppointment?: {
    serviceId: string;
    serviceName: string;
    professionalId: string;
    professionalName: string;
    date: string;
    time: string;
    priceInCents: number;
  };
  receipts: {
    id: string;
    description: string;
    amountInCents: number;
    date: string;
    method: string;
  }[];
}

