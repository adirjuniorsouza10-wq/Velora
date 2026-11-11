# Plano Mestre de Desenvolvimento & Diagnóstico Arquitetural — VELORA

> **Visão Oficial**: Construir uma plataforma SaaS completa para gestão empresarial, começando pelo segmento de barbearias e preparada para expansão em escala para todos os segmentos de beleza e estética (Salões, Unhas, Estética facial).  
> **Identidade Visual**: Preto profundo (`#09090b`), Grafite (`#18181b` / `#27272a`), Dourado champanhe (`#D4AF37` / `#F3E5AB`), com suporte a modo escuro e claro, mantendo tipografia de alta densidade (`Plus Jakarta Sans` e números tabulares mono).

---

## Decisões Críticas & Confirmações

> [!IMPORTANT]
> **Decisões Arquiteturais Definidas**:
> 1. **Estratégia de Entrada**: Foco inicial 100% otimizado para a operação diária de barbearias (agendamento veloz de corte + barba, encaixes, comissões de barbeiros e prevenção de *no-show* com sinal Pix).
> 2. **Isolamento Multi-Tenant**: Toda consulta, mutação e registro conterá obrigatoriamente `tenant_id` e verificação de contexto de sessão no servidor. O frontend nunca ditará regras de acesso; isolamento físico e lógico em backend Node.js + PostgreSQL.
> 3. **Novo Menu em 3 Blocos de Governança**: Reorganização imediata da navegação lateral em **GESTÃO**, **FINANCEIRO** e **CRESCIMENTO**.

---

## ETAPA 1 — Diagnóstico & Auditoria Completa do Projeto Atual

### 1.1 Arquivos e Estrutura Existente
- **Core SPA**: `src/App.tsx`, `src/main.tsx`, `index.html`, `vite.config.ts`, `tsconfig.json`.
- **Modelos e Tipos**: `src/types/velora.ts`, `src/types/auth.ts`.
- **Camada de Dados & Estado**: `src/context/VeloraContext.tsx`, `src/data/mockVeloraData.ts`, `src/utils/formatters.ts`.
- **Layout & Navegação**: `src/components/layout/Header.tsx`, `src/components/layout/Sidebar.tsx`.
- **Módulos Operacionais**:
  - `AgendaView.tsx`: Visualização em colunas por profissional com validação transacional de sobreposição e modal de recebimento/checkout.
  - `DashboardView.tsx`: KPIs de faturamento diário/mensal, ocupação percentual e alertas preditivos.
  - `CrmView.tsx`: Gestão de clientes com LTV, preferências, tags e atalho direto para WhatsApp.
  - `StaffView.tsx`: Roster de equipe com horários, especialidades e comissões.
  - `ServicesView.tsx`: Catálogo com duração, intervalo (*buffer*), comissão e regras de sinal.
  - `FinanceView.tsx`: Extrato de receitas/despesas, abertura/fechamento de caixa e cálculo de repasses.
  - `AiView.tsx`: Assistente consultor e alertas de retenção.
  - `SettingsView.tsx`: Configurações de empresa, sinal Pix e políticas de cancelamento.
  - `BookingPage.tsx`: Experiência pública do cliente final em 4 etapas com simulação de reserva.
  - `MobilePreview.tsx`: Simulador de aplicativo PWA para smartphones.
  - `NewAppointmentModal.tsx`: Modal rápido de encaixes e agendamentos.

### 1.2 Estado Atual do Frontend vs Backend & Banco
- **Frontend**: 100% funcional, compilando sem erros (`tsc --noEmit`), com tipagem estrita, reatividade instantânea e persistência em `localStorage`.
- **Backend / API**: Atualmente utiliza o dev server do Vite. Dependências como `express` e `tsx` já constam em `package.json`, prontas para ativação de um servidor `server.ts` unificado com rotas `/api/*`.
- **Banco de Dados Atual**: Modelado em TypeScript com valores monetários em centavos (`priceInCents`, `amountInCents`), porém ainda residente em memória e `localStorage` no browser.
- **Pontos de Atenção Identificados**:
  - A navegação lateral precisa ser reorganizada para o novo padrão solicitado (**GESTÃO**, **FINANCEIRO**, **CRESCIMENTO**).
  - É necessário preparar o schema declarativo do Prisma para a transição transparente ao PostgreSQL quando o banco remoto for conectado.

---

## ETAPA 2 — Arquitetura Recomendada (SaaS Multi-Tenant)

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CAMADA DE APRESENTAÇÃO                        │
│   VELORA Business (Admin)  │  VELORA Booking (Público)  │  VELORA PWA  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST API (/api/v1)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API & BACKEND (Node.js)                         │
│  ┌───────────────────────┐  ┌────────────────────────────────────────┐ │
│  │ Tenant Context Guard  │  │ RBAC: Owner / Manager / Professional   │ │
│  │ (Valida tenant_id)    │  │ (Permissões contextuais de rotas)      │ │
│  └───────────┬───────────┘  └───────────────────┬────────────────────┘ │
│              │                                  │                      │
│              ▼                                  ▼                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Módulos: Auth | Agendamentos | Clientes | Financeiro | Serviços  │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ Prisma Client (Multi-Tenant Middleware)
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        POSTGRESQL (BANCO DE DADOS)                     │
│  - Row-Level Security (RLS) baseada em tenant_id                       │
│  - Índices compostos: (tenant_id, date, professional_id)               │
│  - Tabela de Auditoria (audit_logs) gravando ator, ação e timestamp    │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Princípios de Isolamento e Segurança
1. **Tenant Context Middleware**: Toda requisição autenticada extrai o `tenant_id` do token/sessão validada e o injeta como filtro obrigatório em todas as cláusulas do banco (`WHERE tenant_id = current_tenant`).
2. **Prevenção de Colisão de Horários**: Bloqueio transacional de reservas simultâneas no mesmo slot de profissional (`start_time < existing_end AND end_time > existing_start`).
3. **Valores Monetários em Unidades Mínimas**: Zero ponto flutuante para dinheiro; 100% dos cálculos e colunas monetárias em inteiros (centavos de Real).

---

## ETAPA 3 — Modelo de Dados Relacional (Prisma & PostgreSQL)

```prisma
// Esquema Conceitual de Banco de Dados VELORA

model Tenant {
  id                  String         @id @default(uuid())
  name                String
  slug                String         @unique
  segment             String         // "barber", "salon", "nails", "beauty"
  phone               String
  email               String
  depositRequired     Boolean        @default(false)
  depositPercentage   Int            @default(0)
  cancellationPolicy  String?
  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt

  branches            Branch[]
  memberships         Membership[]
  professionals       Professional[]
  services            Service[]
  customers           Customer[]
  appointments        Appointment[]
  transactions        Transaction[]
  auditLogs           AuditLog[]
}

model Branch {
  id                  String         @id @default(uuid())
  tenantId            String
  tenant              Tenant         @relation(fields: [tenantId], references: [id])
  name                String
  address             String
  phone               String
  isMain              Boolean        @default(true)
  appointments        Appointment[]
}

model User {
  id                  String         @id @default(uuid())
  name                String
  email               String         @unique
  passwordHash        String
  avatarUrl           String?
  status              String         @default("active")
  createdAt           DateTime       @default(now())

  memberships         Membership[]
}

model Membership {
  id                  String         @id @default(uuid())
  tenantId            String
  userId              String
  role                String         // "owner", "manager", "professional", "receptionist"
  tenant              Tenant         @relation(fields: [tenantId], references: [id])
  user                User           @relation(fields: [userId], references: [id])
}

model Professional {
  id                  String         @id @default(uuid())
  tenantId            String
  userId              String?
  displayName         String
  specialties         String[]
  commissionRate      Int            @default(50) // 50%
  workingHours        Json           // Horários de atendimento e pausas
  tenant              Tenant         @relation(fields: [tenantId], references: [id])
  appointments        Appointment[]
}

model Service {
  id                  String         @id @default(uuid())
  tenantId            String
  name                String
  description         String?
  durationMinutes     Int
  bufferMinutes       Int            @default(5)
  priceInCents        Int            // Moeda em centavos (ex: 6500 = R$ 65,00)
  onlineBooking       Boolean        @default(true)
  requiresDeposit     Boolean        @default(false)
  depositPercentage   Int            @default(0)
  tenant              Tenant         @relation(fields: [tenantId], references: [id])
  appointments        Appointment[]
}

model Customer {
  id                  String         @id @default(uuid())
  tenantId            String
  name                String
  phone               String
  email               String?
  notes               String?
  preferences         String?
  tags                String[]
  isVip               Boolean        @default(false)
  tenant              Tenant         @relation(fields: [tenantId], references: [id])
  appointments        Appointment[]
}

model Appointment {
  id                  String         @id @default(uuid())
  tenantId            String
  branchId            String
  customerId          String
  professionalId      String
  serviceId           String
  date                DateTime       // UTC
  startTime           String         // "14:00"
  endTime             String         // "14:35"
  priceInCents        Int            // Preço congelado no momento da reserva
  status              String         // "confirmed", "in_progress", "completed", "cancelled"
  paymentStatus       String         // "pending", "deposit_paid", "paid"
  paymentMethod       String?        // "pix", "credit_card", "cash"
  source              String         // "online", "manual", "whatsapp"

  tenant              Tenant         @relation(fields: [tenantId], references: [id])
  branch              Branch         @relation(fields: [branchId], references: [id])
  customer            Customer       @relation(fields: [customerId], references: [id])
  professional        Professional   @relation(fields: [professionalId], references: [id])
  service             Service        @relation(fields: [serviceId], references: [id])
}

model Transaction {
  id                  String         @id @default(uuid())
  tenantId            String
  type                String         // "income", "expense"
  category            String
  description         String
  amountInCents       Int
  date                DateTime       @default(now())
  paymentMethod       String
  appointmentId       String?
  tenant              Tenant         @relation(fields: [tenantId], references: [id])
}

model AuditLog {
  id                  String         @id @default(uuid())
  tenantId            String
  actorId             String
  action              String
  metadata            Json?
  createdAt           DateTime       @default(now())
  tenant              Tenant         @relation(fields: [tenantId], references: [id])
}
```

---

## ETAPA 4 — Reorganização do Painel & Estrutura de Navegação Solicitada

Atualização imediata da barra lateral nos 3 blocos hierárquicos:

```
VELORA
Business Management
PRO
────────────────────────
GESTÃO
  • Visão geral
  • Agenda
  • Agendamentos
  • Clientes
  • Profissionais
  • Serviços

FINANCEIRO
  • Financeiro
  • Caixa
  • Comissões
  • Estoque

CRESCIMENTO
  • Marketing
  • Relatórios
  • VELORA AI
  • Configurações
```

---

## ETAPA 5 — Roadmap de Implementação em Fases & Critérios de Conclusão

| Fase | Escopo | Critérios de Conclusão (Definition of Done) |
| :--- | :--- | :--- |
| **Fase 1: Fundação & Navegação** | Reestruturar menu lateral nos 3 blocos (Gestão, Financeiro, Crescimento), refinar tokens de cor Dourado Champanhe / Preto Profundo e alternador de tema Claro/Escuro. | Navegação 100% responsiva, menu sem pills estáticas, modo claro e escuro ativos, troca de tenant fluida. |
| **Fase 2: Operação da Barbearia** | Agenda interativa refinada com suporte a visualização diária/semanal, criação de encaixes, bloqueio rigoroso de colisões de horário e drag-and-drop. | Conflitos entre barbeiros no mesmo slot impedidos; dados congelados no histórico de reservas. |
| **Fase 3: Gestão Financeira & Caixa** | Fluxo de caixa diário, lançamento de receitas/despesas, cálculo automático de comissões por barbeiro e módulo de Estoque preliminar. | Fechamento de sessão de caixa bate com o total em dinheiro; relatórios de comissão detalhados por profissional. |
| **Fase 4: Automação & Booking** | VELORA Booking com página pública de agendamento em 4 passos, cálculo de sinal Pix e disparo de notificações formatadas para WhatsApp. | Cliente consegue agendar em <1 minuto pelo celular sem login obrigatório. |
| **Fase 5: Inteligência & Ecossistema** | VELORA AI com insights de clientes sem retorno (>30d), previsão de demanda de horários ociosos e gestão de múltiplas filiais. | Consultor virtual responde métricas em tempo real cruzando agendamentos e transações. |

---

## Próximos Passos Imediatos

Nenhuma alteração de código ou remoção de arquivo foi executada.  
Assim que você aprovar este plano, iniciaremos a **Fase 1**: reorganizar a barra lateral nos três blocos especificados (**GESTÃO**, **FINANCEIRO**, **CRESCIMENTO**), adicionar as abas de Estoque e Marketing com interface completa e polir a identidade visual Dourado + Preto Profundo com alternância de tema.
