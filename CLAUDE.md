# CLAUDE.md — Futvibe

## Visão Geral

PWA mobile-first para organizar partidas casuais de futevôlei.

Fluxo principal: criar partida → compartilhar link → preencher vagas → aprovar jogadores.

MVP apenas frontend com dados mockados. Sem backend, sem chat, sem pagamentos.

---

## Stack

- Next.js 16+ (App Router)
- React 19+
- TypeScript (strict mode)
- TailwindCSS v4
- shadcn/ui
- Tabler Icons (`@tabler/icons-react`)
- TanStack Query (`@tanstack/react-query`)
- Zod (validação de formulários)
- Axios (cliente HTTP)

---

## Estrutura de Pastas

```
/actions              # Server Actions (funções assíncronas chamadas do cliente)
/api                  # Comunicação com APIs externas
/app                  # Rotas (cada pasta/arquivo = uma rota) — pages thin, só chamam componentes
/features             # Lógica de negócio por módulo
  /matches
    /components
    /enums
    /form-schemas     # Schemas Zod
    /hooks
    /providers
    /services
    /types
  /profile
    /components
    /enums
    /form-schemas
    /hooks
    /providers
    /services
    /types
  /promotions
    /components
    /services
    /types
/lib                  # Recursos compartilhados
  /components         # Componentes reutilizáveis globais
  /hooks              # Hooks reutilizáveis globais
  /providers          # Providers globais (QueryProvider, ToastProvider, etc.)
  /types              # Tipos globais
  /utils              # Funções utilitárias
/mocks                # Dados mockados simulando API
/public               # Arquivos estáticos
```

---

## Convenções (Padrão Cervantes)

| Artefato | Padrão | Exemplo |
|----------|--------|---------|
| Arquivos e pastas | kebab-case | `match-card.tsx`, `use-create-match.ts` |
| Hooks | prefixo `use` | `useCreateMatch` |
| Variáveis, métodos, funções | camelCase | `authorizationToken` |
| Constantes | UPPER_SNAKE_CASE | `API_BASE_URL`, `SESSION_COOKIE` |
| Componentes React | PascalCase | `MatchCard` |

---

## Princípios de Arquitetura

- **SOLID** e **Clean Architecture**: separar regras de negócio da UI
- Pages devem ser thin — apenas importar e renderizar componentes de feature
- Componentes de UI não acessam mocks diretamente — via hooks/services
- Mocks simulam delay de API (300–600ms) — troca futura só na camada `api/`
- TanStack Query para data fetching — `useQuery` em hooks de feature, `useMutation` para ações
- Zod valida todos os formulários — schemas em `features/[módulo]/form-schemas/`
- Server Actions em `actions/` para mutações server-side
- Camada `api/` isola chamadas HTTP (Axios) — hoje aponta para mocks, amanhã para API real

---

## Regras de Código

- TypeScript strict, sem `any`
- Sem Redux/MobX
- Sem CSS customizado — utility classes Tailwind
- Componentes pequenos, focados, reutilizáveis

---

## Convenções Next.js 16 (IMPORTANTE)

- `params` e `searchParams` em pages/layouts são `Promise` — sempre `await params`
- Usar `PageProps<'/rota'>` e `LayoutProps<'/rota'>` para tipagem (globals, sem import)
- Componentes server por padrão; `'use client'` apenas quando necessário

---

## Telas do MVP

| Tela | Rota |
|---|---|
| Feed de partidas | `/` |
| Detalhes da partida | `/match/[id]` |
| Criar partida | `/match/create` |
| Perfil | `/profile` |
| Login (UI apenas) | `/login` |

Navegação inferior no mobile com 4 tabs: Feed, Criar, Notificações, Perfil.

---

## Tipos Principais

```ts
type MatchLevel = 'beginner' | 'intermediate' | 'advanced'
type MatchVisibility = 'public' | 'private' | 'hybrid'
type ParticipantStatus = 'host' | 'confirmed' | 'pending' | 'rejected' | 'waitlist'

interface Match {
  id: string
  title: string
  location: string
  date: string
  time: string
  level: MatchLevel
  pricePerPlayer: number
  maxPlayers: number
  visibility: MatchVisibility
  participants: Participant[]
}

interface Participant {
  userId: string
  status: ParticipantStatus
}

interface User {
  id: string
  name: string
  avatar?: string
  level: MatchLevel
  bio?: string
  presenceScore: number
  matchesPlayed: number
}
```

---

## Regras de Negócio

**Partida pública:** aparece no feed, entrada requer aprovação do host.

**Partida privada:** acessível apenas via link, entrada automática.

**Modo híbrido (padrão):** descoberta pública + link com entrada automática + solicitações públicas precisam aprovação.

---

## Requisitos PWA

- `manifest.json` configurado
- Responsivo mobile-first
- Botões grandes, áreas de toque confortáveis
- CTA fixo no mobile
- Preparado para offline (estrutura)

---

## O que NÃO construir no MVP

- Backend ou API real
- Chat
- Pagamentos
- Rankings ou campeonatos
- Integração com mapas
- Autenticação real

---

## Objetivo

Validar usabilidade e fluxo. O usuário deve conseguir criar e compartilhar uma partida em menos de 30 segundos.

---

## Decisões de Arquitetura (aprovadas)

| Tema | Decisão |
|------|---------|
| Loading | Skeleton via Suspense — `loading.tsx` por rota |
| Filtros | Simula query no service — `getMatches({ level, paid })` |
| Banner | `bannerService` com delay simulado — troca fácil por API |
| Pós-criar partida | `router.push('/')` → reload server component |
| Paginação | Service recebe `{ page, limit }` desde já |

---

## TODO — Refatoração para Padrão Cervantes

> Status: `[ ]` pendente · `[x]` feito · `[-]` em progresso

### Fase 1 — Dependências
- [x] Instalar `@tanstack/react-query`, `zod`, `axios`, `@tabler/icons-react`
- [x] Remover `lucide-react` após migração de ícones (Fase 7)

### Fase 2 — Reorganização de `lib/`
- [x] Criar estrutura `lib/components/`, `lib/hooks/`, `lib/providers/`, `lib/types/`, `lib/utils/`
- [x] Mover `components/` (globais) → `lib/components/`
- [x] Mover `hooks/` → `lib/hooks/`
- [x] Mover `contexts/` → `lib/providers/`
- [x] Mover `types/index.ts` → `lib/types/index.ts`
- [x] Atualizar todos os imports após movimentação

### Fase 3 — Estrutura interna das features
- [x] Adicionar `enums/`, `form-schemas/`, `types/`, `providers/` em `features/matches/`
- [x] Adicionar `enums/`, `form-schemas/`, `types/`, `providers/` em `features/profile/`
- [x] Mover tipos de feature de `lib/types/` para `features/[módulo]/types/`
- [x] Criar `actions/` e `api/` (estrutura base)

### Fase 4 — Zod (validação de formulários)
- [x] Schema Zod para criação de partida — `features/matches/form-schemas/create-match-schema.ts`
- [x] Schema Zod para editar perfil — `features/profile/form-schemas/edit-profile-schema.ts`
- [x] Schema Zod para login — `features/auth/form-schemas/login-schema.ts`
- [x] Aplicar validação nos formulários existentes

### Fase 5 — TanStack Query
- [x] Adicionar `QueryProvider` em `lib/providers/query-provider.tsx`
- [x] Criar `useMatches` hook com `useQuery` — `features/matches/hooks/use-matches.ts`
- [x] Criar `useMatch` hook com `useQuery` — `features/matches/hooks/use-match.ts`
- [x] Criar `useCreateMatch` mutation — `features/matches/hooks/use-create-match.ts`
- [x] Criar `useJoinMatch` mutation — `features/matches/hooks/use-join-match.ts`
- [x] Criar `useUpdateParticipant` mutation — `features/matches/hooks/use-update-participant.ts`
- [x] Criar `useCurrentUser` com `useQuery` — `features/profile/hooks/use-current-user.ts`
- [x] Criar `useUpdateProfile` mutation — `features/profile/hooks/use-update-profile.ts`

### Fase 6 — Server Actions
- [x] `actions/match-actions.ts` — `createMatch`, `joinMatch`, `updateParticipantStatus`
- [x] `actions/auth-actions.ts` — `login`, `logout`

### Fase 7 — Ícones (Lucide → Tabler)
- [x] Substituir ícones em `lib/components/` e `features/`
- [x] Substituir ícones nas pages (`app/`)

### Fase 8 — Nomenclatura kebab-case
- [x] Renomear arquivos de componentes: `MatchCard.tsx` → `match-card.tsx`
- [x] Renomear arquivos de hooks: `useCurrentUser.ts` → `use-current-user.ts`
- [x] Atualizar imports após renomeação

---

## Backlog de Features (funcionalidades — já implementadas)

### Auth & Sessão
- [x] Proxy (`proxy.ts`) — proteger rotas `(main)` → redirect `/login` se sem sessão
- [x] `useCurrentUser` hook — lê `localStorage` em client components
- [x] Logout no perfil — `clearSession()` + `router.push('/login')`

### Feed
- [x] Skeleton loading — `app/(main)/loading.tsx` com shimmer cards
- [x] Filtros com simula query — `getMatches({ level?, paid? })` no service
- [x] UI de filtros — chips horizontais no topo do feed
- [ ] Pull-to-refresh — opcional, avaliar depois

### Banner
- [x] `bannerService` com delay simulado
- [x] Mock `mocks/banners.ts` — 3 slides placeholder

### Partida
- [x] Web Share API — botão compartilhar em `/match/[id]`
- [x] Host view — aprovar/recusar participantes `pending`
- [x] Toast feedback — ao solicitar vaga
- [x] Copiar link — partida privada
- [x] Tela de sucesso — após criar partida

### Criação de Partida
- [x] Validação de data mínima
- [x] Preview antes de publicar

### Perfil
- [x] Editar perfil — salva em localStorage
- [x] Histórico de partidas

### UX / PWA
- [x] Toast/snackbar global — Context + portal
- [x] Error boundary por rota
- [x] Dark mode toggle — localStorage

### Infraestrutura de Mock
- [x] Paginação no service — `{ page, limit }`
- [x] Seed de dados — `seedMatches()` com 7 partidas realistas
