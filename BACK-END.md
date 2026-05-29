# BACK-END.md — Futvibe API

Guia de contribuição para o backend. Repositório: `../futvibe-api/`.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | .NET 9 / ASP.NET Core 9 |
| ORM | EF Core 9 + Npgsql |
| Banco | PostgreSQL (Supabase em produção) |
| CQRS | MediatR 14 |
| Validação | FluentValidation 12 |
| Auth | JWT Bearer — `Microsoft.AspNetCore.Authentication.JwtBearer` |
| Hash | BCrypt.Net-Next |
| Docs | Swashbuckle 6.9 (Swagger UI em `/swagger`) |
| Deploy | Railway (Docker) |

---

## Arquitetura — Clean Architecture

```
Futvibe.Domain          ← entidades, interfaces, enums, exceções
       ↑
Futvibe.Application     ← CQRS handlers, DTOs, mappers, behaviors
       ↑
Futvibe.Infrastructure  ← EF Core, repositórios, JwtService
       ↑
Futvibe.WebApi          ← controllers, middleware, Program.cs
```

**Regra de ouro:** camadas internas nunca importam camadas externas.
- `Domain` conhece apenas si mesmo
- `Application` conhece `Domain`
- `Infrastructure` implementa interfaces de `Domain`
- `WebApi` orquestra via MediatR — controllers nunca tocam repositórios

---

## Estrutura de Pastas

```
futvibe-api/
├── Dockerfile
├── Futvibe.sln
├── BACK.md                          ← status de fases de implementação
└── src/
    ├── Futvibe.Domain/
    │   ├── Entities/
    │   │   ├── User.cs              ← fábrica estática Create(), UpdateProfile()
    │   │   ├── Match.cs             ← regras de negócio: DetermineStatusForNewJoiner(), AddParticipant()
    │   │   ├── Participant.cs       ← UpdateStatus()
    │   │   └── Banner.cs
    │   ├── Enums/
    │   │   ├── MatchLevel.cs        ← Beginner | Intermediate | Advanced
    │   │   ├── MatchVisibility.cs   ← Public | Private | Hybrid
    │   │   └── ParticipantStatus.cs ← Host | Confirmed | Pending | Rejected | Waitlist
    │   ├── Interfaces/
    │   │   ├── Repositories/        ← IUserRepository, IMatchRepository, IBannerRepository
    │   │   └── Services/            ← IJwtService
    │   └── Exceptions/
    │       ├── NotFoundException.cs    → HTTP 404
    │       ├── ForbiddenException.cs   → HTTP 403
    │       └── BusinessException.cs   → HTTP 422
    │
    ├── Futvibe.Application/
    │   ├── Common/
    │   │   ├── Behaviors/
    │   │   │   ├── ValidationBehavior.cs  ← pipeline MediatR: roda FluentValidation
    │   │   │   └── LoggingBehavior.cs     ← pipeline MediatR: log request/response
    │   │   ├── DTOs/                      ← UserDto, MatchDto, ParticipantDto, BannerDto
    │   │   └── Mappers/                   ← MatchMapper.ToDto(), UserMapper.ToDto() (estáticos)
    │   ├── Auth/Commands/Login/           ← LoginCommand + Handler + Validator + LoginResult
    │   ├── Matches/
    │   │   ├── Commands/CreateMatch/
    │   │   ├── Commands/JoinMatch/
    │   │   ├── Commands/UpdateParticipantStatus/
    │   │   └── Queries/GetMatches/ GetMatchById/ GetUserMatches/
    │   ├── Users/
    │   │   ├── Commands/UpdateProfile/
    │   │   └── Queries/GetCurrentUser/ GetUserById/
    │   ├── Banners/Queries/GetBanners/
    │   └── DependencyInjection.cs         ← AddApplication()
    │
    ├── Futvibe.Infrastructure/
    │   ├── Auth/
    │   │   └── JwtService.cs              ← gera JWT 30 dias, claim NameIdentifier = userId
    │   ├── Persistence/
    │   │   ├── FutvibeDbContext.cs
    │   │   ├── DataSeeder.cs              ← seed automático no startup (5 users, 7 matches, 3 banners)
    │   │   ├── Configurations/            ← EF Core Fluent API (snake_case, enums como string)
    │   │   ├── Repositories/             ← implementam interfaces de Domain
    │   │   └── Migrations/               ← geradas com dotnet-ef
    │   └── DependencyInjection.cs         ← AddInfrastructure()
    │
    └── Futvibe.WebApi/
        ├── Controllers/
        │   ├── AuthController.cs          ← POST /api/auth/login
        │   ├── MatchesController.cs       ← CRUD de partidas
        │   ├── UsersController.cs         ← GET/PUT usuários
        │   └── BannersController.cs       ← GET /api/banners
        ├── Middleware/
        │   └── ExceptionHandlerMiddleware.cs  ← mapeia exceções de domínio → HTTP status
        ├── Extensions/
        │   └── ClaimsPrincipalExtensions.cs   ← User.GetUserId() extrai Guid do JWT
        ├── Properties/launchSettings.json     ← porta dev: http://localhost:5122
        ├── appsettings.json                   ← config dev (localhost:5432)
        ├── appsettings.Production.json        ← env vars (Railway injeta)
        └── Program.cs                         ← wiring: JWT, CORS, Swagger, MigrateAsync, SeedAsync
```

---

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| POST | `/api/auth/login` | — | Login → retorna `{ token, user }` |
| GET | `/api/users/me` | ✓ | Usuário logado |
| GET | `/api/users/{id}` | — | Usuário por ID |
| PUT | `/api/users/me` | ✓ | Atualizar perfil `{ name, bio?, level }` |
| GET | `/api/matches` | — | Feed `?level=&paid=&page=&limit=` |
| GET | `/api/matches/me` | ✓ | Partidas do usuário logado |
| GET | `/api/matches/{id}` | — | Partida por ID (inclui `user` em cada participante) |
| POST | `/api/matches` | ✓ | Criar partida |
| POST | `/api/matches/{id}/join` | ✓ | Entrar em partida |
| PATCH | `/api/matches/{matchId}/participants/{userId}` | ✓ | Aprovar/rejeitar participante (host only) |
| GET | `/api/banners` | — | Banners ativos |

---

## Respostas de Erro

`ExceptionHandlerMiddleware` mapeia exceções de domínio:

```json
{ "error": "mensagem", "details": [...] }
```

| Exceção | HTTP |
|---------|------|
| `NotFoundException` | 404 |
| `ForbiddenException` | 403 |
| `BusinessException` | 422 |
| `ValidationException` | 400 |
| Qualquer outra | 500 |

---

## Enums

Todos enviados como **strings lowercase** na API:

| Enum | Valores |
|------|---------|
| `MatchLevel` | `beginner` \| `intermediate` \| `advanced` |
| `MatchVisibility` | `public` \| `private` \| `hybrid` |
| `ParticipantStatus` | `host` \| `confirmed` \| `pending` \| `rejected` \| `waitlist` |

---

## Regras de Negócio (no Domain)

`Match.DetermineStatusForNewJoiner()` — lógica de entrada:

| Visibilidade | Vagas disponíveis | Status |
|---|---|---|
| Private ou Hybrid | sim | `Confirmed` |
| Public | sim | `Pending` |
| Qualquer | não | `Waitlist` |

`Match.UpdateParticipantStatus()` — lança `ForbiddenException` se requester ≠ host.

---

## Banco de Dados

- Tabelas: `users`, `matches`, `participants`, `banners`
- Enums armazenados como `varchar` (legível no SQL)
- `participants` usa chave composta `(match_id, user_id)`
- `Match._participants` é campo privado (EF backing field via `HasField`)
- Migrations rodam automaticamente no startup (`MigrateAsync`)
- Seed automático no startup se `users` vazia (`DataSeeder.SeedAsync`)

---

## Rodar Localmente

**Pré-requisito:** PostgreSQL 16 rodando em `localhost:5432` com user/senha `postgres`.

Docker (mais fácil):
```bash
docker run -d --name futvibe-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
```

**Primeira vez:**
```bash
cd futvibe-api

# instalar ferramenta EF
dotnet tool install --global dotnet-ef

# criar migration
dotnet ef migrations add InitialCreate \
  --project src/Futvibe.Infrastructure \
  --startup-project src/Futvibe.WebApi

# rodar (aplica migration + seed automático)
dotnet run --project src/Futvibe.WebApi
```

**Próximas vezes:**
```bash
dotnet run --project src/Futvibe.WebApi
```

API disponível em `http://localhost:5122` — Swagger em `http://localhost:5122/swagger`.

**Login de teste:** `teste@futvibe.app` / `123456`

---

## Adicionar Nova Feature (passo a passo)

1. **Domain** — entidade/método de negócio se necessário
2. **Application** — criar pasta `Feature/Commands/MeuCommand/` com:
   - `MeuCommand.cs` — `record MeuCommand(...) : IRequest<TResponse>`
   - `MeuCommandValidator.cs` — `AbstractValidator<MeuCommand>`
   - `MeuCommandHandler.cs` — `IRequestHandler<MeuCommand, TResponse>`
3. **Infrastructure** — implementar repositório se necessário
4. **WebApi** — adicionar action no controller adequado, injetar `IMediator`
5. **Frontend** — atualizar `api/` layer + service + hook

---

## Variáveis de Ambiente (Produção — Railway)

```env
ConnectionStrings__Default=Host=...;Port=6543;Database=postgres;Username=postgres.xxx;Password=...;Pooling=false
Jwt__Secret=<mínimo 32 chars>
AllowedOrigins=https://futvibe.vercel.app
```

> Supabase Transaction mode (porta 6543) exige `Pooling=false` para evitar conflito com pool interno do Npgsql.

---

## Deploy

Ver `B10` no `BACK.md` (aguardando aprovação):
- **Supabase** — banco PostgreSQL gratuito
- **Railway** — deploy via Dockerfile, CI/CD GitHub
- **Vercel** — frontend, variável `NEXT_PUBLIC_API_URL` aponta para Railway
