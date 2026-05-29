<<<<<<< HEAD
# CLAUDE.md — Futvibe Frontend

## Visão Geral

PWA mobile-first para organizar partidas casuais de futevôlei.

Fluxo principal: criar partida → compartilhar link → preencher vagas → aprovar jogadores.

**Status atual:** frontend + backend implementados e integrados. Autenticação JWT real, banco PostgreSQL via Supabase, API REST em ASP.NET Core 9.

Repositório do backend: `futvibe-api/` (mesmo nível — ver `BACK-END.md` para contribuir).

---

## Stack

- Next.js 16+ (App Router)
- React 19+
- TypeScript (strict mode)
- TailwindCSS v4
- shadcn/ui (Base UI)
- Tabler Icons (`@tabler/icons-react`)
- TanStack Query (`@tanstack/react-query`)
- Zod (validação de formulários)
- Axios (cliente HTTP — camada `api/`)

---

## Estrutura de Pastas

```
/actions              # Server Actions (wrappers — auth/matches)
/api                  # Camada HTTP — Axios → API real
  client.ts           # Instância Axios + interceptor JWT + handler 401
  auth.ts             # POST /api/auth/login
  matches.ts          # CRUD de partidas
  users.ts            # GET/PUT usuários
  banners.ts          # GET banners
/app                  # Rotas App Router — pages thin, só chamam componentes
  (auth)/login        # Tela de login
  (main)/             # Rotas protegidas (proxy verifica cookie)
    page.tsx          # Feed
    match/[id]        # Detalhe da partida
    match/create      # Criar partida
    profile           # Perfil do usuário
    notifications     # Notificações (placeholder)
/features             # Lógica de negócio por módulo
  /auth
    /form-schemas     # loginSchema (Zod)
  /matches
    /components       # match-card, participant-list, match-actions, etc.
    /enums
    /form-schemas     # createMatchSchema (Zod)
    /hooks            # use-matches, use-match, use-create-match, use-join-match, use-update-participant
    /providers
    /services         # match-service.ts → chama api/matches.ts
    /types            # Match, Participant, MatchFilters, enums
  /profile
    /components       # edit-profile-modal, logout-button
    /enums
    /form-schemas     # editProfileSchema (Zod)
    /hooks            # use-current-user, use-update-profile
    /providers
    /services         # user-service.ts, auth-service.ts → chama api/users.ts e api/auth.ts
    /types            # User
  /promotions
    /services         # banner-service.ts → chama api/banners.ts
    /types            # BannerSlide
/lib                  # Recursos compartilhados
  /components         # Banner, DarkModeToggle, BottomNav, ui/*
  /hooks              # hooks globais
  /providers          # QueryProvider, ToastProvider
  /types              # Re-exports de features
  auth.ts             # saveSession, getToken, getSession, clearSession
  constants.ts        # SESSION_COOKIE
  utils.ts            # cn()
/mocks                # Dados mockados (NÃO mais usados no fluxo principal)
/public               # Estáticos (banners/, icons/, manifest.json)
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
- Componentes de UI não chamam `api/` diretamente — usam hooks/services
- TanStack Query para data fetching — `useQuery` em hooks de feature, `useMutation` para ações
- Zod valida todos os formulários — schemas em `features/[módulo]/form-schemas/`
- Camada `api/` isola chamadas HTTP (Axios) — toda mudança de endpoint fica aqui

### Fluxo de dados

```
Component/Page
  → Hook (useQuery/useMutation)
    → Service (features/*/services/)
      → API layer (api/*.ts)
        → Axios client (api/client.ts)
          → Backend REST API
```

---

## Autenticação

- JWT Bearer — token gerado pelo backend (30 dias)
- `lib/auth.ts` gerencia storage:
  - `futvibe_token` (localStorage) — JWT para requests
  - `futvibe_user_id` (localStorage) — userId para componentes client
  - Cookie `futvibe_uid` — para Server Components / proxy de rota
- `api/client.ts` injeta `Authorization: Bearer <token>` em todas requests
- 401 response → `clearSession()` + redirect `/login`
- Proxy em `proxy.ts` protege rotas `(main)/` — verifica cookie

---

## Regras de Código

- TypeScript strict, sem `any`
- Sem Redux/MobX
- Sem CSS customizado — utility classes Tailwind
- Componentes pequenos, focados, reutilizáveis
- Sem comentários óbvios — código auto-documentado

---

## Convenções Next.js 16

- `params` e `searchParams` em pages/layouts são `Promise` — sempre `await params`
- Usar `PageProps<'/rota'>` e `LayoutProps<'/rota'>` para tipagem (globals, sem import)
- Componentes server por padrão; `'use client'` apenas quando necessário

---

## Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5122   # dev
# produção: URL do Railway
```

---

## Telas

| Tela | Rota | Auth |
|---|---|---|
| Feed de partidas | `/` | ✓ |
| Detalhes da partida | `/match/[id]` | ✓ |
| Criar partida | `/match/create` | ✓ |
| Perfil | `/profile` | ✓ |
| Login | `/login` | — |

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
  date: string        // 'yyyy-MM-dd'
  time: string        // 'HH:mm'
  level: MatchLevel
  pricePerPlayer: number
  maxPlayers: number
  visibility: MatchVisibility
  participants: Participant[]
  hostId?: string     // presente no MatchDto do backend
}

interface Participant {
  userId: string
  status: ParticipantStatus
  user?: User         // embeds do backend (GET /matches/:id)
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

Lógica reside no backend (`Match.DetermineStatusForNewJoiner()`).

---

## Rodar Localmente

```bash
# backend (outro terminal)
cd futvibe-api && dotnet run --project src/Futvibe.WebApi

# frontend
npm run dev
```

Login de teste: `teste@futvibe.app` / `123456`

---

## O que NÃO construir agora

- Chat em tempo real
- Pagamentos
- Rankings ou campeonatos
- Integração com mapas
- Push notifications reais
- Upload de avatar (URL externa apenas)

---

## Decisões de Arquitetura

| Tema | Decisão |
|------|---------|
| Auth | JWT 30 dias, localStorage + cookie para SSR |
| Loading | Skeleton via Suspense — `loading.tsx` por rota |
| Filtros | `getMatches({ level?, paid?, page?, limit? })` — query params no backend |
| Pós-criar partida | `router.push('/')` → reload server component |
| Participante user data | Embedded no `GET /matches/:id` — sem N+1 |
| Enum serialização | Backend envia strings lowercase — compatível com tipos TS |
=======

>>>>>>> 5eec778a859a0ee0509972e847210f359ddbdfc9
