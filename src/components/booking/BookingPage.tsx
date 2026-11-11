import React, { useState } from 'react';
import { useVelora } from '../../context/VeloraContext';
import { 
  Scissors, 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  AlertCircle,
  Share2,
  Crown,
  CreditCard,
  Camera,
  Heart,
  MessageCircle
} from 'lucide-react';
import { 
  formatCurrency, 
  formatDatePtBR, 
  calculateEndTime 
} from '../../utils/formatters';
import { Service, StaffMember } from '../../types/velora';
import { VeloraPassCard } from './VeloraPassCard';

export const BookingPage: React.FC = () => {
  const { 
    activeTenant, 
    services, 
    categories, 
    staff, 
    addAppointment, 
    addCustomer, 
    customers, 
    clubPlans,
    setCurrentMode 
  } = useVelora();

  // Top tabs for client experience
  const [activeClientTab, setActiveClientTab] = useState<'booking' | 'pass' | 'barbers' | 'plans' | 'photos'>('booking');

  // Multi-step booking flow (1: Service, 2: Professional, 3: Date & Time, 4: Client Info & Confirm/Deposit)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected booking parameters
  const [selectedService, setSelectedService] = useState<Service | null>(services[0] || null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | 'any'>('any');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-10');
  const [selectedTime, setSelectedTime] = useState<string>('15:00');

  // Customer form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Confirmation state
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Favorited barbers by client
  const [favoritedStaffIds, setFavoritedStaffIds] = useState<string[]>(['staff-iago-master']);

  // Filter services enabled for online booking
  const onlineServices = services.filter(s => s.onlineBookingEnabled);

  // Available time slots generator
  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:15', '13:00', '13:30', '14:30', '15:00', '16:00', '17:00', '18:00'
  ];

  // Resolve staff
  const resolvedStaff: StaffMember = selectedStaff === 'any'
    ? staff[0]
    : selectedStaff;

  const toggleFavoriteBarber = (staffId: string) => {
    setFavoritedStaffIds(prev => 
      prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]
    );
  };

  const handleRepeatAppointment = (serviceName: string, professionalName: string) => {
    const targetService = services.find(s => s.name.toLowerCase().includes(serviceName.toLowerCase())) || services[0];
    const targetStaff = staff.find(st => st.name.toLowerCase().includes(professionalName.toLowerCase())) || staff[0];

    setSelectedService(targetService);
    setSelectedStaff(targetStaff);
    setActiveClientTab('booking');
    setStep(3); // Jump straight to date and time choice
  };

  const handleSelectBarberDirectly = (staffId: string) => {
    const targetStaff = staff.find(s => s.id === staffId);
    if (targetStaff) {
      setSelectedStaff(targetStaff);
      setActiveClientTab('booking');
      setStep(1);
    }
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!selectedService || !customerName.trim() || !customerPhone.trim()) {
      setBookingError('Por favor preencha todos os dados obrigatórios.');
      return;
    }

    // Find or create customer
    let customer = customers.find(c => c.phone.replace(/\D/g, '') === customerPhone.replace(/\D/g, ''));
    if (!customer) {
      customer = addCustomer({
        tenantId: activeTenant.id,
        name: customerName,
        phone: customerPhone,
        email: customerEmail || `${customerName.toLowerCase().replace(/\s+/g, '.')}@cliente.com`,
        tags: ['Online', 'Booking Público'],
        preferences: notes,
        isVip: false
      });
    }

    const calculatedEnd = calculateEndTime(selectedTime, selectedService.durationMinutes);

    const result = addAppointment({
      tenantId: activeTenant.id,
      branchId: 'branch-iago-main',
      customerId: customer.id,
      customerName,
      customerPhone,
      customerEmail: customerEmail || customer.email,
      professionalId: resolvedStaff.id,
      professionalName: resolvedStaff.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      priceInCents: selectedService.priceInCents,
      durationMinutes: selectedService.durationMinutes,
      date: selectedDate,
      startTime: selectedTime,
      endTime: calculatedEnd,
      status: 'confirmed',
      paymentStatus: selectedService.requiresDeposit ? 'deposit_paid' : 'pending',
      source: 'online',
      notes
    });

    if (!result.success) {
      setBookingError(result.message || 'Horário indisponível. Por favor escolha outro horário.');
      return;
    }

    setConfirmedBookingId(result.appointment?.id || `APT-${Date.now()}`);
    setIsConfirmed(true);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(`00020126580014BR.GOV.BCB.PIX0136velora-${activeTenant.slug}-reserva5204000053039865802BR5925VELORA6009SAOPAULO62070503***6304ABCD`);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 text-white min-h-screen flex flex-col items-center">
      {/* Top Banner: Environment Identification */}
      <div className="w-full bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400">Ambiente 03 • VELORA CLIENT:</span>
          <span className="font-mono text-amber-400 font-semibold">{activeTenant.bookingUrl}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`https://${activeTenant.bookingUrl}`);
              alert(`Link copiado! Compartilhe com seus clientes: https://${activeTenant.bookingUrl}`);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700 transition-colors"
            title="Compartilhar link de agendamento em redes sociais e WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Compartilhar Link</span>
          </button>

          <button
            onClick={() => setCurrentMode('business')}
            className="text-zinc-400 hover:text-white flex items-center gap-1 font-semibold text-xs"
          >
            <span>← Painel da Barbearia</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-3xl px-4 py-6 sm:py-8 space-y-6">
        {/* Establishment Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
          <div className="h-44 sm:h-52 w-full relative">
            <img 
              src={activeTenant.coverImage} 
              alt={activeTenant.name} 
              className="w-full h-full object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          </div>

          <div className="p-5 sm:p-6 relative -mt-16 sm:-mt-20 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={activeTenant.logo}
                alt={activeTenant.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-zinc-950 shadow-2xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{activeTenant.name}</h1>
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    ★ {activeTenant.rating} ({activeTenant.reviewCount})
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-lg">{activeTenant.tagline}</p>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeTenant.address}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Aberto hoje até 20h</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Client */}
          <div className="px-5 pb-3 border-t border-zinc-800/80 pt-2 flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveClientTab('booking')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeClientTab === 'booking'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Agendar Serviços</span>
            </button>

            <button
              onClick={() => setActiveClientTab('pass')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeClientTab === 'pass'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>VELORA PASS (Carteira)</span>
            </button>

            <button
              onClick={() => setActiveClientTab('barbers')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeClientTab === 'barbers'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Barbeiros ({staff.length})</span>
            </button>

            <button
              onClick={() => setActiveClientTab('plans')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeClientTab === 'plans'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Clubes &amp; Assinaturas</span>
            </button>

            <button
              onClick={() => setActiveClientTab('photos')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeClientTab === 'photos'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Fotos</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENT: VELORA PASS */}
        {activeClientTab === 'pass' && (
          <div className="animate-in fade-in space-y-4">
            <VeloraPassCard
              tenant={activeTenant}
              onRepeatAppointment={handleRepeatAppointment}
              onSelectBarber={handleSelectBarberDirectly}
            />
          </div>
        )}

        {/* TAB CONTENT: BARBERS & REVIEWS */}
        {activeClientTab === 'barbers' && (
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Nossa Equipe de Barbeiros</h2>
              <p className="text-xs text-zinc-400">Favorite seu barbeiro para agendar com rapidez:</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {staff.map(member => {
                const isFavorited = favoritedStaffIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{member.name}</div>
                          <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{member.rating.toFixed(1)}</span>
                            <span className="text-zinc-500">({member.completedAppointmentsCount} cortes)</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">
                            {member.specialties.join(' • ')}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFavoriteBarber(member.id)}
                        className={`p-2 rounded-lg border transition-colors ${
                          isFavorited
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white'
                        }`}
                        title={isFavorited ? 'Remover dos favoritos' : 'Favoritar este barbeiro'}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 mt-4 flex items-center gap-2">
                      <button
                        onClick={() => handleSelectBarberDirectly(member.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1"
                      >
                        <span>Agendar com {member.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB CONTENT: PLANS (VELORA CLUB) */}
        {activeClientTab === 'plans' && (
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 animate-in fade-in">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Planos de Assinatura • {activeTenant.name}</h2>
              </div>
              <p className="text-xs text-zinc-400">
                Cortes e barbas garantidos todo mês com desconto exclusivo:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clubPlans.map(plan => (
                <div key={plan.id} className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-white text-base">{plan.name}</h3>
                      {plan.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-zinc-950 uppercase">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">{plan.tagline}</p>

                    <div className="my-3">
                      <div className="text-3xl font-black text-white font-tabular">
                        {formatCurrency(plan.monthlyPriceInCents)}
                        <span className="text-xs font-normal text-zinc-400">/mês</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-300 border-t border-zinc-900 pt-3">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>
                          {plan.maxAppointmentsPerMonth >= 999 ? 'Atendimentos ILIMITADOS' : `Até ${plan.maxAppointmentsPerMonth} atendimentos / mês`}
                        </span>
                      </div>
                      {plan.servicesIncluded.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>{plan.discountOnProductsPercent}% OFF</strong> em produtos na barbearia</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Redirecionando para adesão segura do ${plan.name} via Pix Recorrente.`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <span>Assinar Este Plano</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: PHOTOS */}
        {activeClientTab === 'photos' && (
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Ambiente e Trabalhos Recentes</h2>
              <p className="text-xs text-zinc-400">Conheça nosso espaço pensado no seu conforto:</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { title: 'Bancadas & Espelhos', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80' },
                { title: 'Cadeiras Clássicas', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80' },
                { title: 'Degradê & Fade', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80' },
                { title: 'Barba & Toalha Quente', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80' },
                { title: 'Lounge de Espera', url: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600&auto=format&fit=crop&q=80' },
                { title: 'Linha de Produtos', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80' }
              ].map((photo, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden aspect-square border border-zinc-800 bg-zinc-950">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-semibold text-white">{photo.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: STEP-BY-STEP ONLINE BOOKING */}
        {activeClientTab === 'booking' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-xl">
            {!isConfirmed ? (
              <div>
                {/* Stepper Progress */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800 text-xs">
                  {[
                    { num: 1, label: 'Serviço' },
                    { num: 2, label: 'Profissional' },
                    { num: 3, label: 'Data & Horário' },
                    { num: 4, label: 'Confirmar' }
                  ].map(s => (
                    <div key={s.num} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        step === s.num
                          ? 'bg-amber-500 text-zinc-950 font-black'
                          : step > s.num
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {step > s.num ? '✓' : s.num}
                      </div>
                      <span className={`hidden sm:inline font-semibold ${step === s.num ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* STEP 1: Choose Service */}
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <h2 className="text-lg font-bold text-white">1. Escolha o serviço desejado</h2>
                      <p className="text-xs text-zinc-400">Preços oficiais e duração estimada da {activeTenant.name}:</p>
                    </div>

                    <div className="space-y-3">
                      {onlineServices.map(srv => {
                        const isSelected = selectedService?.id === srv.id;

                        return (
                          <div
                            key={srv.id}
                            onClick={() => setSelectedService(srv)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                                : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">{srv.name}</span>
                                {srv.badge && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950">
                                    {srv.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-zinc-400 mt-1">{srv.description}</p>
                              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                                <span className="flex items-center gap-1 font-mono">
                                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                  <span>{srv.durationMinutes} min</span>
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-base font-black text-amber-400 font-tabular block">
                                {formatCurrency(srv.priceInCents)}
                              </span>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-2 ml-auto ${
                                isSelected ? 'border-amber-500 bg-amber-500 text-zinc-950' : 'border-zinc-700'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!selectedService}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
                      >
                        <span>Avançar para Barbeiro</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Choose Professional */}
                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <h2 className="text-lg font-bold text-white">2. Escolha o profissional</h2>
                      <p className="text-xs text-zinc-400">Ou selecione 'Qualquer Profissional' para maior flexibilidade.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Any Available Option */}
                      <div
                        onClick={() => setSelectedStaff('any')}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                          selectedStaff === 'any'
                            ? 'bg-amber-500/15 border-amber-500'
                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">Qualquer Disponível</div>
                          <p className="text-xs text-zinc-400">Primeiro horário vago na barbearia</p>
                        </div>
                      </div>

                      {/* Staff List */}
                      {staff.map(stf => {
                        const isSelected = selectedStaff !== 'any' && selectedStaff.id === stf.id;
                        return (
                          <div
                            key={stf.id}
                            onClick={() => setSelectedStaff(stf)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-amber-500/15 border-amber-500'
                                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={stf.avatar}
                                alt={stf.name}
                                className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                              />
                              <div>
                                <div className="font-bold text-sm text-white">{stf.name}</div>
                                <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span>{stf.rating.toFixed(1)}</span>
                                </div>
                              </div>
                            </div>

                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-amber-500 bg-amber-500 text-zinc-950' : 'border-zinc-700'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        onClick={() => setStep(3)}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                      >
                        <span>Avançar para Horário</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Date & Time */}
                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in">
                    <div>
                      <h2 className="text-lg font-bold text-white">3. Escolha o dia e o horário</h2>
                      <p className="text-xs text-zinc-400">Atendimento com {resolvedStaff.name}.</p>
                    </div>

                    {/* Date Selector */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-2">Data do Atendimento</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:border-amber-500 outline-none"
                      />
                    </div>

                    {/* Slots grid */}
                    <div>
                      <label className="text-xs font-semibold text-zinc-300 block mb-2">Horários Livres</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map(time => {
                          const isSelected = selectedTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                                isSelected
                                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                                  : 'bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        onClick={() => setStep(4)}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                      >
                        <span>Avançar para Identificação</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Client Info & Confirm */}
                {step === 4 && (
                  <form onSubmit={handleConfirmReservation} className="space-y-4 animate-in fade-in">
                    <div>
                      <h2 className="text-lg font-bold text-white">4. Seus dados para confirmação</h2>
                      <p className="text-xs text-zinc-400">Enviaremos lembrete e confirmação automática no WhatsApp.</p>
                    </div>

                    {bookingError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{bookingError}</span>
                      </div>
                    )}

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-zinc-300 font-semibold mb-1">Seu Nome Completo *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Rodrigo Lima"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-300 font-semibold mb-1">Seu WhatsApp com DDD *</label>
                        <input
                          type="tel"
                          required
                          placeholder="(11) 98833-2211"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-300 font-semibold mb-1">E-mail (opcional)</label>
                        <input
                          type="email"
                          placeholder="rodrigo@email.com"
                          value={customerEmail}
                          onChange={e => setCustomerEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-300 font-semibold mb-1">Observações ou Preferências (opcional)</label>
                        <textarea
                          rows={2}
                          placeholder="Ex: Prefiro navalha e corte degradê alto na 0,5"
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Summary box */}
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Serviço:</span>
                        <span className="font-semibold text-white">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Profissional:</span>
                        <span className="font-semibold text-amber-400">{resolvedStaff.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Data &amp; Horário:</span>
                        <span className="font-semibold text-white">{formatDatePtBR(selectedDate)} às {selectedTime}</span>
                      </div>
                      <div className="flex justify-between border-t border-zinc-900 pt-1.5 mt-1.5">
                        <span className="text-zinc-400 font-bold">Valor Total:</span>
                        <span className="text-sm font-black text-white font-tabular">{formatCurrency(selectedService?.priceInCents || 0)}</span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Reserva</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Booking Confirmed Success Card */
              <div className="text-center space-y-6 py-6 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                    Código da Reserva: {confirmedBookingId}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2">
                    Agendamento Confirmado com Sucesso!
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                    Enviamos os dados para o seu WhatsApp ({customerPhone}). {resolvedStaff.name} já reservou sua cadeira.
                  </p>
                </div>

                {/* PIX Deposit QR Code if required */}
                {selectedService?.requiresDeposit && (
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/30 text-left max-w-md mx-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4" />
                        <span>Sinal de Reserva via Pix Instantâneo</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {formatCurrency(Math.round(selectedService.priceInCents * (selectedService.depositPercentage! / 100)))}
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-zinc-300 truncate">
                        00020126580014BR.GOV.BCB.PIX...
                      </span>
                      <button
                        onClick={copyPixCode}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1 shrink-0"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar Pix'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 max-w-md mx-auto text-xs space-y-1.5 text-left">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Local:</span>
                    <span className="text-white font-medium">{activeTenant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Endereço:</span>
                    <span className="text-white font-medium">{activeTenant.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Data:</span>
                    <span className="text-white font-medium">{formatDatePtBR(selectedDate)} às {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Profissional:</span>
                    <span className="text-amber-400 font-medium">{resolvedStaff.name}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsConfirmed(false);
                      setStep(1);
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                  >
                    Novo Agendamento
                  </button>

                  <button
                    onClick={() => setActiveClientTab('pass')}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Ver no meu VELORA PASS</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
