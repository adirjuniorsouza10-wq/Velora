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
  AiInsight 
} from '../types/velora';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-iago',
    name: 'Backout Barbearia',
    slug: 'backout-barbearia',
    segment: 'barber',
    tagline: 'Vellora Executive • Corte impecável, barba na toalha quente e atendimento de primeira.',
    phone: '(11) 97722-3344',
    email: 'iago@backoutbarbearia.com.br',
    address: 'Rua Augusta, 1200 - Consolação',
    city: 'São Paulo - SP',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&auto=format&fit=crop&q=80',
    bookingUrl: 'velora.app/backout-barbearia',
    depositRequired: false,
    depositPercentage: 0,
    cancellationPolicy: 'Cancelamento gratuito até 2 horas antes do horário reservado.',
    rating: 5.0,
    reviewCount: 48,
    openHoursSummary: 'Segunda a Sábado: 09h às 20h'
  },
  {
    id: 'tenant-alpha',
    name: 'Barbearia Alpha',
    slug: 'alpha-barber',
    segment: 'barber',
    tagline: 'Estilo clássico, precisão moderna e experiência premium.',
    phone: '(11) 98452-1100',
    email: 'contato@barbeariaalpha.com.br',
    address: 'Av. Paulista, 1450 - Bela Vista',
    city: 'São Paulo - SP',
    logo: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&auto=format&fit=crop&q=80',
    bookingUrl: 'velora.app/b/alpha-barber',
    depositRequired: true,
    depositPercentage: 30,
    cancellationPolicy: 'Cancelamento gratuito até 2 horas antes do horário reservado.',
    rating: 4.9,
    reviewCount: 348,
    openHoursSummary: 'Terça a Sábado: 09h às 20h'
  },
  {
    id: 'tenant-nails',
    name: 'Studio Nails Elite',
    slug: 'studio-nails',
    segment: 'nails',
    tagline: 'Alongamento em gel, nail art exclusiva e spa dos pés.',
    phone: '(11) 97120-4490',
    email: 'atendimento@studionailselite.com.br',
    address: 'Rua Oscar Freire, 820 - Jardins',
    city: 'São Paulo - SP',
    logo: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=1200&auto=format&fit=crop&q=80',
    bookingUrl: 'velora.app/b/studio-nails',
    depositRequired: true,
    depositPercentage: 50,
    cancellationPolicy: 'Cancelamentos com menos de 4h de antecedência perdem o sinal de reserva.',
    rating: 4.95,
    reviewCount: 412,
    openHoursSummary: 'Segunda a Sábado: 08h às 19h'
  },
  {
    id: 'tenant-beauty',
    name: 'Beauty Studio Glow',
    slug: 'beauty-glow',
    segment: 'beauty',
    tagline: 'Extensão de cílios, micropigmentação e estética avançada.',
    phone: '(11) 99341-8822',
    email: 'ola@beautystudioglow.com.br',
    address: 'Rua das Figueiras, 410 - Bairro Jardim',
    city: 'Santo André - SP',
    logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
    bookingUrl: 'velora.app/b/beauty-glow',
    depositRequired: false,
    depositPercentage: 0,
    cancellationPolicy: 'Avisar com até 3 horas de antecedência para reagendamento.',
    rating: 4.88,
    reviewCount: 219,
    openHoursSummary: 'Terça a Sábado: 09h às 19h'
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'branch-iago-main',
    tenantId: 'tenant-iago',
    name: 'Backout Barbearia — Matriz',
    address: 'Rua Augusta, 1200 - Consolação',
    phone: '(11) 97722-3344',
    isMain: true
  },
  {
    id: 'branch-alpha-main',
    tenantId: 'tenant-alpha',
    name: 'Unidade Paulista',
    address: 'Av. Paulista, 1450 - Sala 12',
    phone: '(11) 98452-1100',
    isMain: true
  },
  {
    id: 'branch-alpha-pinheiros',
    tenantId: 'tenant-alpha',
    name: 'Unidade Pinheiros',
    address: 'Rua dos Pinheiros, 630',
    phone: '(11) 98452-1155',
    isMain: false
  },
  {
    id: 'branch-nails-main',
    tenantId: 'tenant-nails',
    name: 'Unidade Jardins',
    address: 'Rua Oscar Freire, 820',
    phone: '(11) 97120-4490',
    isMain: true
  },
  {
    id: 'branch-beauty-main',
    tenantId: 'tenant-beauty',
    name: 'Unidade Santo André',
    address: 'Rua das Figueiras, 410',
    phone: '(11) 99341-8822',
    isMain: true
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-iago-master',
    tenantId: 'tenant-iago',
    name: 'Iago Barber (Fundador)',
    role: 'owner',
    email: 'iago@barbeariadoiago.com.br',
    phone: '(11) 97722-3344',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
    specialties: ['Corte Degradê & Fade', 'Barba Terapia', 'Visagismo'],
    serviceIds: ['srv-iago-corte', 'srv-iago-barba'],
    commissionRate: 70,
    workingHours: { start: '09:00', end: '20:00', days: [1, 2, 3, 4, 5, 6] },
    isActive: true,
    rating: 5.0,
    completedAppointmentsCount: 980
  },
  {
    id: 'staff-iago-lucas',
    tenantId: 'tenant-iago',
    name: 'Lucas Barbeiro',
    role: 'professional',
    email: 'lucas@barbeariadoiago.com.br',
    phone: '(11) 97722-3355',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    specialties: ['Navalhado Clássico', 'Barba Modelada'],
    serviceIds: ['srv-iago-corte', 'srv-iago-barba'],
    commissionRate: 50,
    workingHours: { start: '10:00', end: '19:00', days: [2, 3, 4, 5, 6] },
    isActive: true,
    rating: 4.92,
    completedAppointmentsCount: 420
  },
  {
    id: 'staff-alpha-1',
    tenantId: 'tenant-alpha',
    name: 'Lucas "Mestre" Silveira',
    role: 'owner',
    email: 'lucas@barbeariaalpha.com.br',
    phone: '(11) 98877-1234',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    specialties: ['Degradê Navalhado', 'Barba Terapia', 'Visagismo'],
    serviceIds: ['srv-alpha-1', 'srv-alpha-2', 'srv-alpha-3', 'srv-alpha-4'],
    commissionRate: 60,
    workingHours: { start: '09:00', end: '19:00', days: [2, 3, 4, 5, 6] },
    isActive: true,
    rating: 4.95,
    completedAppointmentsCount: 1420
  },
  {
    id: 'staff-alpha-2',
    tenantId: 'tenant-alpha',
    name: 'Rodrigo Fontana',
    role: 'professional',
    email: 'rodrigo@barbeariaalpha.com.br',
    phone: '(11) 97711-5566',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    specialties: ['Corte Clássico', 'Barba Modelada', 'Tratamentos'],
    serviceIds: ['srv-alpha-1', 'srv-alpha-2', 'srv-alpha-3'],
    commissionRate: 50,
    workingHours: { start: '10:00', end: '20:00', days: [2, 3, 4, 5, 6] },
    isActive: true,
    rating: 4.87,
    completedAppointmentsCount: 890
  },
  {
    id: 'staff-alpha-3',
    tenantId: 'tenant-alpha',
    name: 'Gabriel Martins',
    role: 'professional',
    email: 'gabriel@barbeariaalpha.com.br',
    phone: '(11) 96655-2233',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    specialties: ['Fade Freestyle', 'Colorimetria & Platinado'],
    serviceIds: ['srv-alpha-1', 'srv-alpha-4', 'srv-alpha-5'],
    commissionRate: 50,
    workingHours: { start: '09:00', end: '18:00', days: [2, 3, 4, 5, 6] },
    isActive: true,
    rating: 4.82,
    completedAppointmentsCount: 640
  },
  {
    id: 'staff-nails-1',
    tenantId: 'tenant-nails',
    name: 'Camila Albuquerque',
    role: 'owner',
    email: 'camila@studionailselite.com.br',
    phone: '(11) 99123-9988',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    specialties: ['Alongamento Fibra de Vidro', 'Nail Art 3D'],
    serviceIds: ['srv-nails-1', 'srv-nails-2', 'srv-nails-3'],
    commissionRate: 60,
    workingHours: { start: '09:00', end: '18:00', days: [1, 2, 3, 4, 5, 6] },
    isActive: true,
    rating: 4.98,
    completedAppointmentsCount: 1650
  },
  {
    id: 'staff-beauty-1',
    tenantId: 'tenant-beauty',
    name: 'Juliana Paes Costa',
    role: 'owner',
    email: 'juliana@beautystudioglow.com.br',
    phone: '(11) 98223-1122',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
    specialties: ['Cílios Volume Russo', 'Lash Lifting', 'Design Brown'],
    serviceIds: ['srv-beauty-1', 'srv-beauty-2', 'srv-beauty-3'],
    commissionRate: 65,
    workingHours: { start: '09:00', end: '19:00', days: [2, 3, 4, 5, 6] },
    isActive: true,
    rating: 4.92,
    completedAppointmentsCount: 910
  }
];

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-iago-cabelo', tenantId: 'tenant-iago', name: 'Corte de Cabelo', icon: 'Scissors' },
  { id: 'cat-iago-barba', tenantId: 'tenant-iago', name: 'Barba & Rosto', icon: 'Sparkles' },
  { id: 'cat-alpha-cabelo', tenantId: 'tenant-alpha', name: 'Cabelo', icon: 'Scissors' },
  { id: 'cat-alpha-barba', tenantId: 'tenant-alpha', name: 'Barba & Rosto', icon: 'Sparkles' },
  { id: 'cat-alpha-combos', tenantId: 'tenant-alpha', name: 'Combos Exclusivos', icon: 'Flame' },
  { id: 'cat-nails-alongamento', tenantId: 'tenant-nails', name: 'Alongamentos', icon: 'Gem' },
  { id: 'cat-nails-cuidados', tenantId: 'tenant-nails', name: 'Mãos & Pés', icon: 'Heart' },
  { id: 'cat-beauty-cilios', tenantId: 'tenant-beauty', name: 'Olhar & Cílios', icon: 'Eye' },
  { id: 'cat-beauty-facial', tenantId: 'tenant-beauty', name: 'Estética Facial', icon: 'Smile' }
];

export const INITIAL_SERVICES: Service[] = [
  // Barbearia do Iago (Serviços Oficiais)
  {
    id: 'srv-iago-corte',
    tenantId: 'tenant-iago',
    categoryId: 'cat-iago-cabelo',
    name: 'Corte',
    description: 'Corte completo com acabamento moderno, alinhamento na tesoura ou máquina e finalização.',
    durationMinutes: 30,
    bufferMinutes: 5,
    priceInCents: 3500, // R$ 35,00
    requiresDeposit: false,
    onlineBookingEnabled: true,
    commissionPercentage: 60,
    badge: 'Mais Pedido'
  },
  {
    id: 'srv-iago-barba',
    tenantId: 'tenant-iago',
    categoryId: 'cat-iago-barba',
    name: 'Barba',
    description: 'Barba alinhada com toalha quente, navalha descartável, hidratação de fios e pós-barba.',
    durationMinutes: 30,
    bufferMinutes: 5,
    priceInCents: 3000, // R$ 30,00
    requiresDeposit: false,
    onlineBookingEnabled: true,
    commissionPercentage: 60
  },
  // Barbearia Alpha
  {
    id: 'srv-alpha-1',
    tenantId: 'tenant-alpha',
    categoryId: 'cat-alpha-cabelo',
    name: 'Corte Degradê / Fade Master',
    description: 'Corte com acabamento refinado na navalha, lavagem refrescante e styling premium.',
    durationMinutes: 35,
    bufferMinutes: 5,
    priceInCents: 6500, // R$ 65,00
    requiresDeposit: false,
    onlineBookingEnabled: true,
    commissionPercentage: 50,
    badge: 'Mais Popular'
  },
  {
    id: 'srv-alpha-2',
    tenantId: 'tenant-alpha',
    categoryId: 'cat-alpha-barba',
    name: 'Barboterapia & Toalha Quente',
    description: 'Modelagem completa com óleos essenciais, massagem facial e toalha quente revigorante.',
    durationMinutes: 30,
    bufferMinutes: 5,
    priceInCents: 5500, // R$ 55,00
    requiresDeposit: false,
    onlineBookingEnabled: true,
    commissionPercentage: 50
  },
  {
    id: 'srv-alpha-3',
    tenantId: 'tenant-alpha',
    categoryId: 'cat-alpha-combos',
    name: 'Combo Alpha: Cabelo + Barboterapia',
    description: 'Experiência completa com bebida cortesia da casa, corte, barba e finalização especial.',
    durationMinutes: 60,
    bufferMinutes: 10,
    priceInCents: 11000, // R$ 110,00
    requiresDeposit: true,
    depositPercentage: 30,
    onlineBookingEnabled: true,
    commissionPercentage: 50,
    badge: 'Destaque'
  },
  {
    id: 'srv-alpha-4',
    tenantId: 'tenant-alpha',
    categoryId: 'cat-alpha-cabelo',
    name: 'Corte Tesoura Clássico & Visagismo',
    description: 'Consultoria de visagismo personalizada e corte executado 100% na tesoura.',
    durationMinutes: 45,
    bufferMinutes: 5,
    priceInCents: 8500, // R$ 85,00
    requiresDeposit: false,
    onlineBookingEnabled: true,
    commissionPercentage: 50
  },
  {
    id: 'srv-alpha-5',
    tenantId: 'tenant-alpha',
    categoryId: 'cat-alpha-cabelo',
    name: 'Platinado Global / Camuflagem de Fios',
    description: 'Descoloração com proteção capilar anti-quebra e tonalização exclusiva.',
    durationMinutes: 90,
    bufferMinutes: 15,
    priceInCents: 16000, // R$ 160,00
    requiresDeposit: true,
    depositPercentage: 50,
    onlineBookingEnabled: true,
    commissionPercentage: 45
  },

  // Studio Nails
  {
    id: 'srv-nails-1',
    tenantId: 'tenant-nails',
    categoryId: 'cat-nails-alongamento',
    name: 'Alongamento em Fibra de Vidro',
    description: 'Aplicação completa com cutilagem russa, hidratação e esmaltação em gel.',
    durationMinutes: 120,
    bufferMinutes: 15,
    priceInCents: 18000, // R$ 180,00
    requiresDeposit: true,
    depositPercentage: 50,
    onlineBookingEnabled: true,
    commissionPercentage: 60,
    badge: 'Mais Pedido'
  },
  {
    id: 'srv-nails-2',
    tenantId: 'tenant-nails',
    categoryId: 'cat-nails-alongamento',
    name: 'Manutenção Fibra de Vidro + Nail Art',
    description: 'Nivelamento, troca de formato e arte decorativa sofisticada.',
    durationMinutes: 90,
    bufferMinutes: 10,
    priceInCents: 13000, // R$ 130,00
    requiresDeposit: false,
    onlineBookingEnabled: true,
    commissionPercentage: 60
  },
  {
    id: 'srv-nails-3',
    tenantId: 'tenant-nails',
    categoryId: 'cat-nails-cuidados',
    name: 'Spa dos Pés + Plástica dos Pés',
    description: 'Remoção de calosidades, esfoliação com sais marinhos e parafina quente.',
    durationMinutes: 50,
    bufferMinutes: 10,
    priceInCents: 8500, // R$ 85,00
    requiresDeposit: false,
    onlineBookingEnabled: true,
    commissionPercentage: 50
  },

  // Beauty Glow
  {
    id: 'srv-beauty-1',
    tenantId: 'tenant-beauty',
    categoryId: 'cat-beauty-cilios',
    name: 'Extensão de Cílios Volume Russo',
    description: 'Fans artesanais ultrafinos para um olhar marcante e preenchimento denso.',
    durationMinutes: 110,
    bufferMinutes: 10,
    priceInCents: 19000, // R$ 190,00
    requiresDeposit: true,
    depositPercentage: 30,
    onlineBookingEnabled: true,
    commissionPercentage: 65,
    badge: 'Top VIP'
  },
  {
    id: 'srv-beauty-2',
    tenantId: 'tenant-beauty',
    categoryId: 'cat-beauty-cilios',
    name: 'Design de Sobrancelha com Henna',
    description: 'Mapeamento facial simétrico e aplicação de henna natural de longa duração.',
    durationMinutes: 35,
    bufferMinutes: 5,
    priceInCents: 5500, // R$ 55,00
    requiresDeposit: false,
    onlineBookingEnabled: true,
    commissionPercentage: 50
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-iago-1',
    tenantId: 'tenant-iago',
    name: 'Rodrigo Lima (Primeiro Cliente)',
    phone: '(11) 98833-2211',
    email: 'rodrigo.lima@cliente.com',
    tags: ['Primeiro Cliente', 'Plano Cabelo', 'VIP'],
    notes: 'Primeiro cliente da Barbearia do Iago! Gosta de corte na régua e pontualidade.',
    preferences: 'Corte clássico e acabamento na navalha.',
    totalSpentInCents: 24000,
    appointmentsCount: 4,
    lastVisit: '2026-11-09',
    firstVisit: '2026-06-01',
    isVip: true
  },
  {
    id: 'cust-iago-2',
    tenantId: 'tenant-iago',
    name: 'Marcos Vinicius',
    phone: '(11) 97122-8899',
    email: 'marcos.vinicius@gmail.com',
    tags: ['Plano Barba', 'Fidelidade'],
    notes: 'Assinante do Plano Barba. Faz toalha quente a cada 10 dias.',
    preferences: 'Barba alinhada com toalha quente.',
    totalSpentInCents: 36000,
    appointmentsCount: 6,
    lastVisit: '2026-11-08',
    firstVisit: '2026-07-15',
    isVip: true
  },
  {
    id: 'cust-1',
    tenantId: 'tenant-alpha',
    name: 'Guilherme Siqueira',
    phone: '(11) 98112-9900',
    email: 'guilherme.siqueira@gmail.com',
    tags: ['Cliente VIP', 'Cerveja IPA', 'Corte Quinzenal'],
    notes: 'Prefere corte com navalha e degradê bem alto na 0,5. Gosta de cerveja artesanal na espera.',
    preferences: 'Agendar sempre com Lucas nas quintas ou sextas às 17h.',
    totalSpentInCents: 154000, // R$ 1.540,00
    appointmentsCount: 16,
    lastVisit: '2026-11-04',
    firstVisit: '2026-02-10',
    isVip: true
  },
  {
    id: 'cust-2',
    tenantId: 'tenant-alpha',
    name: 'Felipe Alencar',
    phone: '(11) 99443-2211',
    email: 'felipe.alencar@empresa.com.br',
    tags: ['Fiel', 'Combo'],
    notes: 'Costuma fazer cabelo e barba juntos. Pele sensível, usar toalha morna e pós-barba sem álcool.',
    preferences: 'Atendimento rápido e pontual.',
    totalSpentInCents: 88000, // R$ 880,00
    appointmentsCount: 8,
    lastVisit: '2026-10-28',
    firstVisit: '2026-05-14',
    isVip: true
  },
  {
    id: 'cust-3',
    tenantId: 'tenant-alpha',
    name: 'Matheus Brandão',
    phone: '(11) 97332-1188',
    email: 'matheus.brandao@outlook.com',
    tags: ['Novo', 'Online'],
    notes: 'Primeiro agendamento realizado diretamente pelo link público da VELORA.',
    preferences: 'Corte fade clássico.',
    totalSpentInCents: 6500,
    appointmentsCount: 1,
    lastVisit: '2026-11-08',
    firstVisit: '2026-11-08',
    isVip: false
  },
  {
    id: 'cust-4',
    tenantId: 'tenant-alpha',
    name: 'Renato Nogueira',
    phone: '(11) 96221-7788',
    email: 'renato.nog@tech.io',
    tags: ['Em Risco', 'Sem Retorno +30d'],
    notes: 'Costumava vir todo mês, não agenda há 35 dias. Sugerido para envio de WhatsApp.',
    preferences: 'Barba desenhada e cafezinho sem açúcar.',
    totalSpentInCents: 72000,
    appointmentsCount: 7,
    lastVisit: '2026-10-05',
    firstVisit: '2026-03-20',
    isVip: false
  },
  {
    id: 'cust-5',
    tenantId: 'tenant-nails',
    name: 'Beatriz Vasconcelos',
    phone: '(11) 99988-7711',
    email: 'bia.vasconcelos@adv.com.br',
    tags: ['VIP', 'Nail Art'],
    notes: 'Adora formatos ballerina e tons nude perolado.',
    preferences: 'Atendimento com Camila às sextas.',
    totalSpentInCents: 198000,
    appointmentsCount: 12,
    lastVisit: '2026-11-06',
    firstVisit: '2026-01-15',
    isVip: true
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  // Barbearia do Iago
  {
    id: 'apt-iago-1',
    tenantId: 'tenant-iago',
    branchId: 'branch-iago-main',
    customerId: 'cust-iago-1',
    customerName: 'Rodrigo Lima (Primeiro Cliente)',
    customerPhone: '(11) 98833-2211',
    customerEmail: 'rodrigo.lima@cliente.com',
    professionalId: 'staff-iago-master',
    professionalName: 'Iago Barber (Fundador)',
    serviceId: 'srv-iago-corte',
    serviceName: 'Corte',
    priceInCents: 3500, // R$ 35,00
    durationMinutes: 30,
    date: '2026-11-10',
    startTime: '10:00',
    endTime: '10:30',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'pix',
    source: 'online',
    notes: 'Cliente do Plano Cabelo. Atendimento impecável.',
    createdAt: '2026-11-09T18:00:00Z'
  },
  {
    id: 'apt-iago-2',
    tenantId: 'tenant-iago',
    branchId: 'branch-iago-main',
    customerId: 'cust-iago-2',
    customerName: 'Marcos Vinicius',
    customerPhone: '(11) 97122-8899',
    customerEmail: 'marcos.vinicius@gmail.com',
    professionalId: 'staff-iago-master',
    professionalName: 'Iago Barber (Fundador)',
    serviceId: 'srv-iago-barba',
    serviceName: 'Barba',
    priceInCents: 3000, // R$ 30,00
    durationMinutes: 30,
    date: '2026-11-10',
    startTime: '14:30',
    endTime: '15:00',
    status: 'in_progress',
    paymentStatus: 'paid',
    paymentMethod: 'pix',
    source: 'online',
    notes: 'Toalha quente e pós-barba mentolado.',
    createdAt: '2026-11-10T12:00:00Z'
  },
  {
    id: 'apt-iago-3',
    tenantId: 'tenant-iago',
    branchId: 'branch-iago-main',
    customerId: 'cust-iago-1',
    customerName: 'Rodrigo Lima',
    customerPhone: '(11) 98833-2211',
    customerEmail: 'rodrigo.lima@cliente.com',
    professionalId: 'staff-iago-lucas',
    professionalName: 'Lucas Barbeiro',
    serviceId: 'srv-iago-corte',
    serviceName: 'Corte',
    priceInCents: 3500, // R$ 35,00
    durationMinutes: 30,
    date: '2026-11-10',
    startTime: '16:00',
    endTime: '16:30',
    status: 'confirmed',
    paymentStatus: 'pending',
    paymentMethod: 'pix',
    source: 'online',
    createdAt: '2026-11-10T13:00:00Z'
  },
  {
    id: 'apt-101',
    tenantId: 'tenant-alpha',
    branchId: 'branch-alpha-main',
    customerId: 'cust-1',
    customerName: 'Guilherme Siqueira',
    customerPhone: '(11) 98112-9900',
    customerEmail: 'guilherme.siqueira@gmail.com',
    professionalId: 'staff-alpha-1',
    professionalName: 'Lucas "Mestre" Silveira',
    serviceId: 'srv-alpha-3',
    serviceName: 'Combo Alpha: Cabelo + Barboterapia',
    priceInCents: 11000,
    durationMinutes: 60,
    date: '2026-11-10',
    startTime: '10:00',
    endTime: '11:00',
    status: 'in_progress',
    paymentStatus: 'deposit_paid',
    paymentMethod: 'pix',
    source: 'online',
    notes: 'Cliente já na cadeira. Cerveja servida.',
    createdAt: '2026-11-08T14:20:00Z'
  },
  {
    id: 'apt-102',
    tenantId: 'tenant-alpha',
    branchId: 'branch-alpha-main',
    customerId: 'cust-2',
    customerName: 'Felipe Alencar',
    customerPhone: '(11) 99443-2211',
    customerEmail: 'felipe.alencar@empresa.com.br',
    professionalId: 'staff-alpha-1',
    professionalName: 'Lucas "Mestre" Silveira',
    serviceId: 'srv-alpha-1',
    serviceName: 'Corte Degradê / Fade Master',
    priceInCents: 6500,
    durationMinutes: 35,
    date: '2026-11-10',
    startTime: '11:30',
    endTime: '12:05',
    status: 'confirmed',
    paymentStatus: 'pending',
    source: 'whatsapp',
    notes: 'Confirmou presença por WhatsApp hoje às 08h30.',
    createdAt: '2026-11-09T09:15:00Z'
  },
  {
    id: 'apt-103',
    tenantId: 'tenant-alpha',
    branchId: 'branch-alpha-main',
    customerId: 'cust-3',
    customerName: 'Matheus Brandão',
    customerPhone: '(11) 97332-1188',
    customerEmail: 'matheus.brandao@outlook.com',
    professionalId: 'staff-alpha-2',
    professionalName: 'Rodrigo Fontana',
    serviceId: 'srv-alpha-2',
    serviceName: 'Barboterapia & Toalha Quente',
    priceInCents: 5500,
    durationMinutes: 30,
    date: '2026-11-10',
    startTime: '10:30',
    endTime: '11:00',
    status: 'confirmed',
    paymentStatus: 'pending',
    source: 'online',
    notes: 'Agendou pelo link velora.app/b/alpha-barber.',
    createdAt: '2026-11-09T20:10:00Z'
  },
  {
    id: 'apt-104',
    tenantId: 'tenant-alpha',
    branchId: 'branch-alpha-main',
    customerId: 'cust-4',
    customerName: 'Renato Nogueira',
    customerPhone: '(11) 96221-7788',
    customerEmail: 'renato.nog@tech.io',
    professionalId: 'staff-alpha-2',
    professionalName: 'Rodrigo Fontana',
    serviceId: 'srv-alpha-1',
    serviceName: 'Corte Degradê / Fade Master',
    priceInCents: 6500,
    durationMinutes: 35,
    date: '2026-11-10',
    startTime: '14:00',
    endTime: '14:35',
    status: 'confirmed',
    paymentStatus: 'pending',
    source: 'manual',
    createdAt: '2026-11-10T08:00:00Z'
  },
  {
    id: 'apt-105',
    tenantId: 'tenant-alpha',
    branchId: 'branch-alpha-main',
    customerId: 'cust-1',
    customerName: 'Guilherme Siqueira',
    customerPhone: '(11) 98112-9900',
    customerEmail: 'guilherme.siqueira@gmail.com',
    professionalId: 'staff-alpha-3',
    professionalName: 'Gabriel Martins',
    serviceId: 'srv-alpha-4',
    serviceName: 'Corte Tesoura Clássico & Visagismo',
    priceInCents: 8500,
    durationMinutes: 45,
    date: '2026-11-10',
    startTime: '15:00',
    endTime: '15:45',
    status: 'confirmed',
    paymentStatus: 'pending',
    source: 'online',
    createdAt: '2026-11-09T18:00:00Z'
  },
  {
    id: 'apt-100',
    tenantId: 'tenant-alpha',
    branchId: 'branch-alpha-main',
    customerId: 'cust-2',
    customerName: 'Felipe Alencar',
    customerPhone: '(11) 99443-2211',
    customerEmail: 'felipe.alencar@empresa.com.br',
    professionalId: 'staff-alpha-1',
    professionalName: 'Lucas "Mestre" Silveira',
    serviceId: 'srv-alpha-2',
    serviceName: 'Barboterapia & Toalha Quente',
    priceInCents: 5500,
    durationMinutes: 30,
    date: '2026-11-10',
    startTime: '09:00',
    endTime: '09:30',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'pix',
    source: 'manual',
    notes: 'Atendimento finalizado com sucesso. Pago via Pix.',
    createdAt: '2026-11-09T17:00:00Z'
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    tenantId: 'tenant-alpha',
    type: 'income',
    category: 'Serviço',
    description: 'Atendimento: Barboterapia (Felipe Alencar)',
    amountInCents: 5500,
    date: '2026-11-10 09:32',
    paymentMethod: 'pix',
    status: 'completed',
    appointmentId: 'apt-100',
    professionalId: 'staff-alpha-1'
  },
  {
    id: 'tx-2',
    tenantId: 'tenant-alpha',
    type: 'income',
    category: 'Sinal de Reserva',
    description: 'Sinal 30%: Combo Alpha (Guilherme Siqueira)',
    amountInCents: 3300,
    date: '2026-11-08 14:20',
    paymentMethod: 'pix',
    status: 'completed',
    appointmentId: 'apt-101'
  },
  {
    id: 'tx-3',
    tenantId: 'tenant-alpha',
    type: 'expense',
    category: 'Insumos',
    description: 'Pomadas modeladoras, loção pós-barba e lâminas descartáveis',
    amountInCents: 28000,
    date: '2026-11-09 11:00',
    paymentMethod: 'pix',
    status: 'completed'
  },
  {
    id: 'tx-4',
    tenantId: 'tenant-alpha',
    type: 'income',
    category: 'Venda de Produto',
    description: 'Óleo para Barba Wood & Spice (2x)',
    amountInCents: 12000,
    date: '2026-11-09 16:40',
    paymentMethod: 'credit_card',
    status: 'completed'
  },
  {
    id: 'tx-5',
    tenantId: 'tenant-alpha',
    type: 'expense',
    category: 'Estrutura',
    description: 'Internet Fibra Óptica 600MB',
    amountInCents: 14990,
    date: '2026-11-05 08:00',
    paymentMethod: 'pix',
    status: 'completed'
  }
];

export const INITIAL_CASH_SESSION: CashSession = {
  id: 'cash-session-today',
  tenantId: 'tenant-alpha',
  branchId: 'branch-alpha-main',
  isOpen: true,
  openedAt: '2026-11-10T08:30:00Z',
  initialAmountInCents: 20000, // Fundo de caixa R$ 200,00
  currentAmountInCents: 25500,
  totalIncomeInCents: 5500,
  totalExpenseInCents: 0
};

export const INITIAL_AI_INSIGHTS: AiInsight[] = [
  {
    id: 'insight-1',
    type: 'opportunity',
    title: 'Oportunidade de Ocupação: Terças à Tarde',
    description: 'Seu histórico mostra 38% de vagas ociosas entre 14h e 16h nas terças-feiras. Ativar uma campanha de "Happy Hour 15% OFF" pode gerar até R$ 850 adicionais por semana.',
    metric: '+R$ 850/sem',
    actionText: 'Disparar Campanha WhatsApp'
  },
  {
    id: 'insight-2',
    type: 'retention',
    title: '4 Clientes VIPs sem agendar há mais de 30 dias',
    description: 'Renato Nogueira e outros 3 clientes frequentes ultrapassaram a janela média de retorno. Um lembrete amigável recupera 72% desses atendimentos.',
    metric: '4 clientes em risco',
    actionText: 'Ver Lista no CRM'
  },
  {
    id: 'insight-3',
    type: 'revenue',
    title: 'Meta Mensal de Novembro no Caminho Certo',
    description: 'Projeção de faturamento atinge R$ 38.400 este mês (108% da meta). O serviço mais rentável continua sendo o "Combo Alpha".',
    metric: '108% da meta'
  }
];

export const INITIAL_INVENTORY = [
  {
    id: 'inv-1',
    tenantId: 'tenant-alpha',
    name: 'Pomada Modeladora Efeito Matte (150g)',
    category: 'styling' as const,
    sku: 'POM-MATTE-150',
    currentStock: 24,
    minStock: 10,
    costPriceInCents: 2200,
    salePriceInCents: 5800,
    unit: 'unid',
    lastRestockDate: '2026-11-02'
  },
  {
    id: 'inv-2',
    tenantId: 'tenant-alpha',
    name: 'Óleo para Barba Wood & Spice (30ml)',
    category: 'care' as const,
    sku: 'OLEO-WOOD-30',
    currentStock: 16,
    minStock: 8,
    costPriceInCents: 2400,
    salePriceInCents: 6000,
    unit: 'unid',
    lastRestockDate: '2026-11-04'
  },
  {
    id: 'inv-3',
    tenantId: 'tenant-alpha',
    name: 'Lâminas Descartáveis Derby Extra (Caixa 100un)',
    category: 'supplies' as const,
    sku: 'LAM-DERBY-100',
    currentStock: 5,
    minStock: 8,
    costPriceInCents: 3500,
    salePriceInCents: 0,
    unit: 'cx',
    lastRestockDate: '2026-10-18'
  },
  {
    id: 'inv-4',
    tenantId: 'tenant-alpha',
    name: 'Cerveja Artesanal IPA Alpha (Long Neck 355ml)',
    category: 'beverage' as const,
    sku: 'BEB-IPA-355',
    currentStock: 42,
    minStock: 20,
    costPriceInCents: 650,
    salePriceInCents: 1800,
    unit: 'unid',
    lastRestockDate: '2026-11-08'
  },
  {
    id: 'inv-5',
    tenantId: 'tenant-nails',
    name: 'Esmalte em Gel Coleção Nude Perolado',
    category: 'supplies' as const,
    sku: 'GEL-NUDE-10',
    currentStock: 18,
    minStock: 6,
    costPriceInCents: 1900,
    salePriceInCents: 4500,
    unit: 'unid',
    lastRestockDate: '2026-11-05'
  }
];

export const INITIAL_CAMPAIGNS = [
  {
    id: 'camp-1',
    tenantId: 'tenant-alpha',
    title: 'Reativação: Clientes Inativos +30 dias',
    targetAudience: 'Clientes sem agendar há mais de 30 dias',
    channel: 'whatsapp' as const,
    status: 'active' as const,
    messageTemplate: 'Fala, {nome}! Notamos que faz um tempo desde seu último corte aqui na {empresa}. Que tal agendar seu horário com 10% de cortesia esta semana? Link: {link}',
    estimatedReach: 28,
    conversionRate: 35
  },
  {
    id: 'camp-2',
    tenantId: 'tenant-alpha',
    title: 'Happy Hour das Terças (14h às 16h)',
    targetAudience: 'Todos os clientes com histórico de corte à tarde',
    channel: 'whatsapp' as const,
    status: 'draft' as const,
    messageTemplate: 'Terça com estilo na {empresa}! Agende corte ou barba hoje entre 14h e 16h e ganhe uma Cerveja Artesanal IPA por nossa conta. Link: {link}',
    estimatedReach: 64,
    conversionRate: 22
  },
  {
    id: 'camp-3',
    tenantId: 'tenant-alpha',
    title: 'Aniversariantes do Mês de Novembro',
    targetAudience: 'Clientes cadastrados que fazem aniversário em Nov',
    channel: 'whatsapp' as const,
    status: 'sent' as const,
    messageTemplate: 'Parabéns pelo seu dia, {nome}! A equipe da {empresa} separou um presente exclusivo: 20% OFF no seu Combo Cabelo + Barba neste mês. Link: {link}',
    estimatedReach: 14,
    conversionRate: 57,
    sentAt: '2026-11-01'
  }
];

export const INITIAL_CLUB_PLANS = [
  // Barbearia do Iago (Planos Oficiais)
  {
    id: 'plan-iago-cabelo',
    tenantId: 'tenant-iago',
    name: 'Plano Cabelo',
    tagline: 'Cortes mensais garantidos para manter o visual impecável toda semana.',
    monthlyPriceInCents: 8000, // R$ 80,00/mês
    servicesIncluded: ['Corte na Máquina & Tesoura', 'Lavagem', 'Finalização com Pomada'],
    maxAppointmentsPerMonth: 4,
    discountOnProductsPercent: 10,
    badge: 'Mais Popular',
    activeMembersCount: 24
  },
  {
    id: 'plan-iago-barba',
    tenantId: 'tenant-iago',
    name: 'Plano Barba',
    tagline: 'Barba alinhada com toalha quente, navalhado e hidratação especial no mês.',
    monthlyPriceInCents: 12000, // R$ 120,00/mês
    servicesIncluded: ['Barboterapia com Toalha Quente', 'Alinhamento na Navalha', 'Óleo e Balm'],
    maxAppointmentsPerMonth: 999, // Ilimitado ou até 4 visitas
    discountOnProductsPercent: 15,
    badge: 'Barba na Régua',
    activeMembersCount: 18
  },
  // Barbearia Alpha
  {
    id: 'plan-alpha-1',
    tenantId: 'tenant-alpha',
    name: 'Clube Alpha Barba Livre',
    tagline: 'Barboterapia e manutenção alinhada quantas vezes quiser no mês.',
    monthlyPriceInCents: 11900, // R$ 119,00/mês
    servicesIncluded: ['Barboterapia & Toalha Quente', 'Alinhamento na Navalha'],
    maxAppointmentsPerMonth: 999, // Ilimitado
    discountOnProductsPercent: 10,
    badge: 'Mais Assinado',
    activeMembersCount: 42
  },
  {
    id: 'plan-alpha-2',
    tenantId: 'tenant-alpha',
    name: 'Clube Cavalheiro VIP (Cabelo + Barba)',
    tagline: '2 cortes de cabelo + 2 barboterapias por mês com bebida cortesia.',
    monthlyPriceInCents: 18900, // R$ 189,00/mês
    servicesIncluded: ['Corte Degradê / Fade', 'Barboterapia', 'Cerveja Artesanal'],
    maxAppointmentsPerMonth: 4,
    discountOnProductsPercent: 15,
    badge: 'Melhor Custo-Benefício',
    activeMembersCount: 68
  },
  {
    id: 'plan-alpha-3',
    tenantId: 'tenant-alpha',
    name: 'Clube Black Diamond All-Inclusive',
    tagline: 'Acesso total ilimitado a todos os serviços, prioridade máxima e bar aberto.',
    monthlyPriceInCents: 29900, // R$ 299,00/mês
    servicesIncluded: ['Corte Ilimitado', 'Barboterapia Ilimitada', 'Visagismo', 'Open Bar'],
    maxAppointmentsPerMonth: 999,
    discountOnProductsPercent: 25,
    badge: 'Exclusivo VIP',
    activeMembersCount: 19
  }
];

export const INITIAL_CLUB_MEMBERS = [
  {
    id: 'member-iago-1',
    tenantId: 'tenant-iago',
    customerId: 'cust-iago-1',
    customerName: 'Rodrigo Lima (Cliente VIP)',
    customerPhone: '(11) 98833-2211',
    planId: 'plan-iago-cabelo',
    planName: 'Plano Cabelo',
    status: 'active' as const,
    sinceDate: '2026-06-01',
    nextRenewalDate: '2026-12-01',
    usedAppointmentsThisMonth: 1,
    limitAppointmentsThisMonth: 4,
    paymentMethod: 'pix_recorrente' as const
  },
  {
    id: 'member-iago-2',
    tenantId: 'tenant-iago',
    customerId: 'cust-iago-2',
    customerName: 'Marcos Vinicius',
    customerPhone: '(11) 97122-8899',
    planId: 'plan-iago-barba',
    planName: 'Plano Barba',
    status: 'active' as const,
    sinceDate: '2026-07-15',
    nextRenewalDate: '2026-11-15',
    usedAppointmentsThisMonth: 2,
    limitAppointmentsThisMonth: 999,
    paymentMethod: 'credit_card' as const
  },
  {
    id: 'member-1',
    tenantId: 'tenant-alpha',
    customerId: 'cust-1',
    customerName: 'Guilherme Siqueira',
    customerPhone: '(11) 98112-9900',
    planId: 'plan-alpha-2',
    planName: 'Clube Cavalheiro VIP (Cabelo + Barba)',
    status: 'active' as const,
    sinceDate: '2026-03-15',
    nextRenewalDate: '2026-11-15',
    usedAppointmentsThisMonth: 1,
    limitAppointmentsThisMonth: 4,
    paymentMethod: 'credit_card' as const
  },
  {
    id: 'member-2',
    tenantId: 'tenant-alpha',
    customerId: 'cust-2',
    customerName: 'Felipe Alencar',
    customerPhone: '(11) 99443-2211',
    planId: 'plan-alpha-1',
    planName: 'Clube Alpha Barba Livre',
    status: 'active' as const,
    sinceDate: '2026-05-10',
    nextRenewalDate: '2026-11-10',
    usedAppointmentsThisMonth: 2,
    limitAppointmentsThisMonth: 999,
    paymentMethod: 'pix_recorrente' as const
  },
  {
    id: 'member-3',
    tenantId: 'tenant-alpha',
    customerId: 'cust-4',
    customerName: 'Renato Nogueira',
    customerPhone: '(11) 96221-7788',
    planId: 'plan-alpha-2',
    planName: 'Clube Cavalheiro VIP (Cabelo + Barba)',
    status: 'pending_payment' as const,
    sinceDate: '2026-04-01',
    nextRenewalDate: '2026-11-01',
    usedAppointmentsThisMonth: 0,
    limitAppointmentsThisMonth: 4,
    paymentMethod: 'credit_card' as const
  }
];

