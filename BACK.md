# BACK.md — Futvibe Backend

## Visão Geral

API REST em **ASP.NET Core 9** com **Clean Architecture**, banco **PostgreSQL via Supabase**, deploy no **Railway**.  
O frontend Next.js consome essa API via camada `api/` — zero mudança em componentes, hooks ou tipos.

---

## Stack Definitiva

| Responsabilidade | Tecnologia | Justificativa |
|---|---|---|
| Linguagem | C# 13 / .NET 9 | Performance, tipagem forte, ecossistema |
| Framework | ASP.NET Core 9 | Minimal APIs + Controllers híbrido |
| ORM | Entity Framework Core 9 | Migrations, LINQ, integração Npgsql |
| Driver Postgres | Npgsql 9 | Driver nativo .NET para PostgreSQL |
| CQRS | MediatR 12 | Separa commands/queries, decoupled |
| Validação | FluentValidation 11 | Regras declarativas por command/query |
| Auth | JWT Bearer (System.IdentityModel.Tokens.Jwt) | Stateless, compatível com Vercel/Railway |
| Hash de senha | BCrypt.Net-Next | Custo ajustável, industry standard |
| Banco | PostgreSQL 15 via Supabase | Free 500MB, connection pooler built-in |
| Deploy API | Railway | $5 crédito/mês free, Docker nativo, CI/CD via GitHub |
| Deploy Front | Vercel | Gratuito para Next.js |
| Testes | xUnit + FluentAssertions + NSubstitute | Padrão .NET, mocks fluentes |

---

## Arquitetura — Clean Architecture

```
Domain ← Application ← Infrastructure
                ↑
            WebApi
```

**Regra de dependência:** camadas internas nunca conhecem camadas externas.  
`Infrastructure` implementa interfaces definidas em `Domain`.  
`WebApi` orquestra via MediatR — controllers nunca chamam repositórios diretamente.

---

## Estrutura de Pastas

```
futvibe-api/
├── src/
│   ├── Futvibe.Domain/
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Match.cs
│   │   │   ├── Participant.cs
│   │   │   └── Banner.cs
│   │   ├── Enums/
│   │   │   ├── MatchLevel.cs
│   │   │   ├── MatchVisibility.cs
│   │   │   └── ParticipantStatus.cs
│   │   ├── Interfaces/
│   │   │   ├── Repositories/
│   │   │   │   ├── IMatchRepository.cs
│   │   │   │   ├── IUserRepository.cs
│   │   │   │   └── IBannerRepository.cs
│   │   │   └── Services/
│   │   │       └── IJwtService.cs
│   │   └── Exceptions/
│   │       ├── NotFoundException.cs
│   │       ├── ForbiddenException.cs
│   │       └── BusinessException.cs
│   │
│   ├── Futvibe.Application/
│   │   ├── Common/
│   │   │   ├── Behaviors/
│   │   │   │   ├── ValidationBehavior.cs    # MediatR pipeline — roda FluentValidation
│   │   │   │   └── LoggingBehavior.cs
│   │   │   └── DTOs/
│   │   │       ├── MatchDto.cs
│   │   │       ├── MatchDetailDto.cs
│   │   │       ├── ParticipantDto.cs
│   │   │       ├── UserDto.cs
│   │   │       └── BannerDto.cs
│   │   ├── Auth/
│   │   │   └── Commands/
│   │   │       └── Login/
│   │   │           ├── LoginCommand.cs
│   │   │           ├── LoginCommandHandler.cs
│   │   │           ├── LoginCommandValidator.cs
│   │   │           └── LoginResult.cs
│   │   ├── Matches/
│   │   │   ├── Commands/
│   │   │   │   ├── CreateMatch/
│   │   │   │   │   ├── CreateMatchCommand.cs
│   │   │   │   │   ├── CreateMatchCommandHandler.cs
│   │   │   │   │   └── CreateMatchCommandValidator.cs
│   │   │   │   ├── JoinMatch/
│   │   │   │   │   ├── JoinMatchCommand.cs
│   │   │   │   │   ├── JoinMatchCommandHandler.cs
│   │   │   │   │   └── JoinMatchCommandValidator.cs
│   │   │   │   └── UpdateParticipantStatus/
│   │   │   │       ├── UpdateParticipantStatusCommand.cs
│   │   │   │       ├── UpdateParticipantStatusCommandHandler.cs
│   │   │   │       └── UpdateParticipantStatusCommandValidator.cs
│   │   │   └── Queries/
│   │   │       ├── GetMatches/
│   │   │       │   ├── GetMatchesQuery.cs
│   │   │       │   └── GetMatchesQueryHandler.cs
│   │   │       ├── GetMatchById/
│   │   │       │   ├── GetMatchByIdQuery.cs
│   │   │       │   └── GetMatchByIdQueryHandler.cs
│   │   │       └── GetUserMatches/
│   │   │           ├── GetUserMatchesQuery.cs
│   │   │           └── GetUserMatchesQueryHandler.cs
│   │   ├── Users/
│   │   │   ├── Commands/
│   │   │   │   └── UpdateProfile/
│   │   │   │       ├── UpdateProfileCommand.cs
│   │   │   │       ├── UpdateProfileCommandHandler.cs
│   │   │   │       └── UpdateProfileCommandValidator.cs
│   │   │   └── Queries/
│   │   │       ├── GetCurrentUser/
│   │   │       │   ├── GetCurrentUserQuery.cs
│   │   │       │   └── GetCurrentUserQueryHandler.cs
│   │   │       └── GetUserById/
│   │   │           ├── GetUserByIdQuery.cs
│   │   │           └── GetUserByIdQueryHandler.cs
│   │   └── Banners/
│   │       └── Queries/
│   │           └── GetBanners/
│   │               ├── GetBannersQuery.cs
│   │               └── GetBannersQueryHandler.cs
│   │
│   ├── Futvibe.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── FutvibeDbContext.cs
│   │   │   ├── Configurations/          # IEntityTypeConfiguration<T> por entidade
│   │   │   │   ├── UserConfiguration.cs
│   │   │   │   ├── MatchConfiguration.cs
│   │   │   │   ├── ParticipantConfiguration.cs
│   │   │   │   └── BannerConfiguration.cs
│   │   │   ├── Repositories/
│   │   │   │   ├── MatchRepository.cs
│   │   │   │   ├── UserRepository.cs
│   │   │   │   └── BannerRepository.cs
│   │   │   └── Migrations/              # gerado pelo EF CLI
│   │   ├── Auth/
│   │   │   └── JwtService.cs
│   │   └── DependencyInjection.cs       # AddInfrastructure() extension method
│   │
│   └── Futvibe.WebApi/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── MatchesController.cs
│       │   ├── UsersController.cs
│       │   └── BannersController.cs
│       ├── Middleware/
│       │   └── ExceptionHandlerMiddleware.cs   # mapeia exceções de domínio → HTTP status
│       ├── Extensions/
│       │   └── ClaimsPrincipalExtensions.cs    # GetUserId() helper
│       ├── appsettings.json
│       ├── appsettings.Production.json
│       ├── Dockerfile
│       └── Program.cs
│
└── tests/
    ├── Futvibe.Domain.Tests/
    └── Futvibe.Application.Tests/
```

---

## Domain — Entidades

```csharp
// User.cs
public class User
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string? Avatar { get; private set; }
    public string? Bio { get; private set; }
    public MatchLevel Level { get; private set; }
    public int PresenceScore { get; private set; }
    public int MatchesPlayed { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // factory + métodos de domínio, sem setters públicos
    public static User Create(string name, string email, string passwordHash, MatchLevel level) { ... }
    public void UpdateProfile(string name, string? bio, MatchLevel level) { ... }
}

// Match.cs
public class Match
{
    public Guid Id { get; private set; }
    public string Title { get; private set; }
    public string Location { get; private set; }
    public DateOnly Date { get; private set; }
    public TimeOnly Time { get; private set; }
    public MatchLevel Level { get; private set; }
    public decimal PricePerPlayer { get; private set; }
    public int MaxPlayers { get; private set; }
    public MatchVisibility Visibility { get; private set; }
    public Guid HostId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public IReadOnlyCollection<Participant> Participants => _participants.AsReadOnly();
    private readonly List<Participant> _participants = [];

    public static Match Create(...) { ... }

    // lógica de negócio encapsulada no domínio
    public ParticipantStatus DetermineStatusForNewJoiner()
    {
        var confirmed = _participants.Count(p =>
            p.Status is ParticipantStatus.Confirmed or ParticipantStatus.Host);

        if (confirmed >= MaxPlayers) return ParticipantStatus.Waitlist;

        return Visibility switch
        {
            MatchVisibility.Private => ParticipantStatus.Confirmed,
            MatchVisibility.Hybrid  => ParticipantStatus.Confirmed,
            MatchVisibility.Public  => ParticipantStatus.Pending,
            _ => ParticipantStatus.Pending,
        };
    }
}

// Participant.cs
public class Participant
{
    public Guid MatchId { get; private set; }
    public Guid UserId { get; private set; }
    public ParticipantStatus Status { get; private set; }

    public void UpdateStatus(ParticipantStatus status) => Status = status;
}
```

---

## Application — Exemplo de Command + Handler

```csharp
// JoinMatchCommand.cs
public record JoinMatchCommand(Guid MatchId, Guid RequestingUserId) : IRequest;

// JoinMatchCommandHandler.cs
public class JoinMatchCommandHandler(IMatchRepository matchRepo) : IRequestHandler<JoinMatchCommand>
{
    public async Task Handle(JoinMatchCommand request, CancellationToken ct)
    {
        var match = await matchRepo.GetByIdWithParticipantsAsync(request.MatchId, ct)
            ?? throw new NotFoundException("Match not found");

        if (match.Participants.Any(p => p.UserId == request.RequestingUserId))
            throw new BusinessException("User already in match");

        var status = match.DetermineStatusForNewJoiner();
        match.AddParticipant(request.RequestingUserId, status);

        await matchRepo.SaveChangesAsync(ct);
    }
}

// JoinMatchCommandValidator.cs
public class JoinMatchCommandValidator : AbstractValidator<JoinMatchCommand>
{
    public JoinMatchCommandValidator()
    {
        RuleFor(x => x.MatchId).NotEmpty();
        RuleFor(x => x.RequestingUserId).NotEmpty();
    }
}
```

---

## Infrastructure — DbContext

```csharp
public class FutvibeDbContext(DbContextOptions<FutvibeDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<Participant> Participants => Set<Participant>();
    public DbSet<Banner> Banners => Set<Banner>();

    protected override void OnModelCreating(ModelBuilder builder)
        => builder.ApplyConfigurationsFromAssembly(typeof(FutvibeDbContext).Assembly);
}

// MatchConfiguration.cs
public class MatchConfiguration : IEntityTypeConfiguration<Match>
{
    public void Configure(EntityTypeBuilder<Match> builder)
    {
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Level).HasConversion<string>();
        builder.Property(m => m.Visibility).HasConversion<string>();
        builder.Property(m => m.PricePerPlayer).HasColumnType("numeric(10,2)");
        builder.HasMany(m => m.Participants)
               .WithOne()
               .HasForeignKey(p => p.MatchId);
    }
}
```

---

## WebApi — Controller Pattern

```csharp
// MatchesController.cs
[ApiController]
[Route("api/matches")]
public class MatchesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMatches([FromQuery] GetMatchesQuery query, CancellationToken ct)
        => Ok(await mediator.Send(query, ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
        => Ok(await mediator.Send(new GetMatchByIdQuery(id), ct));

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateMatchCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command with { HostId = User.GetUserId() }, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPost("{id:guid}/join")]
    [Authorize]
    public async Task<IActionResult> Join(Guid id, CancellationToken ct)
    {
        await mediator.Send(new JoinMatchCommand(id, User.GetUserId()), ct);
        return NoContent();
    }

    [HttpPatch("{matchId:guid}/participants/{userId:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateParticipant(
        Guid matchId, Guid userId,
        [FromBody] UpdateParticipantStatusCommand command,
        CancellationToken ct)
    {
        await mediator.Send(command with { MatchId = matchId, TargetUserId = userId, RequestingUserId = User.GetUserId() }, ct);
        return NoContent();
    }
}
```

---

## Endpoints — Contrato Completo

```
POST   /api/auth/login
       Body: { email, password }
       Response: { token: string, user: UserDto }

GET    /api/matches
       Query: ?level=beginner|intermediate|advanced &paid=true|false &page=1 &limit=10
       Response: MatchDto[]

GET    /api/matches/{id}
       Response: MatchDetailDto (inclui participants com dados do user)

POST   /api/matches                    [Bearer]
       Body: { title, location, date, time, level, pricePerPlayer, maxPlayers, visibility }
       Response: 201 + MatchDto

GET    /api/matches/me                 [Bearer]
       Response: MatchDto[] (partidas do usuário autenticado)

POST   /api/matches/{id}/join          [Bearer]
       Response: 204

PATCH  /api/matches/{id}/participants/{userId}   [Bearer, host only]
       Body: { status: "confirmed" | "rejected" }
       Response: 204

GET    /api/users/me                   [Bearer]
       Response: UserDto

GET    /api/users/{id}
       Response: UserDto

PUT    /api/users/me                   [Bearer]
       Body: { name, bio?, level }
       Response: 200 + UserDto

GET    /api/banners
       Response: BannerDto[]
```

---

## Banco de Dados — Schema PostgreSQL

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE match_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE match_visibility AS ENUM ('public', 'private', 'hybrid');
CREATE TYPE participant_status AS ENUM ('host', 'confirmed', 'pending', 'rejected', 'waitlist');

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    avatar          TEXT,
    bio             VARCHAR(200),
    level           match_level NOT NULL DEFAULT 'beginner',
    presence_score  INT NOT NULL DEFAULT 0,
    matches_played  INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE matches (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(200) NOT NULL,
    location         VARCHAR(300) NOT NULL,
    date             DATE NOT NULL,
    time             TIME NOT NULL,
    level            match_level NOT NULL,
    price_per_player NUMERIC(10, 2) NOT NULL DEFAULT 0,
    max_players      INT NOT NULL,
    visibility       match_visibility NOT NULL DEFAULT 'hybrid',
    host_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE participants (
    match_id    UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      participant_status NOT NULL,
    PRIMARY KEY (match_id, user_id)
);

CREATE TABLE banners (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url     TEXT NOT NULL,
    alt           VARCHAR(100),
    href          TEXT,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL DEFAULT 0
);

-- Índices para queries frequentes
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_matches_level ON matches(level);
CREATE INDEX idx_matches_host ON matches(host_id);
CREATE INDEX idx_participants_user ON participants(user_id);
```

---

## Auth — JWT Strategy

```csharp
// JwtService.cs — em Infrastructure
public class JwtService(IConfiguration config) : IJwtService
{
    public string Generate(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(config["Jwt:Secret"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// ClaimsPrincipalExtensions.cs
public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
        => Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
```

---

## Middleware — Exception Handler

```csharp
// Mapeia exceções de domínio para HTTP status codes corretos
// NotFoundException      → 404
// ForbiddenException     → 403
// BusinessException      → 422
// ValidationException    → 400 (MediatR pipeline)
// Qualquer outra         → 500

app.UseMiddleware<ExceptionHandlerMiddleware>();
```

---

## Program.cs — Estrutura

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplication()           // MediatR + FluentValidation + behaviors
    .AddInfrastructure(builder.Configuration)  // DbContext + repos + JwtService
    .AddControllers();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* config via appsettings */ });

builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(builder.Configuration["AllowedOrigins"]!)
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

// Auto-run migrations em startup (Railway)
using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<FutvibeDbContext>();
await db.Database.MigrateAsync();

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ExceptionHandlerMiddleware>();
app.MapControllers();

app.Run();
```

---

## Supabase — Configuração

Supabase fornece PostgreSQL gerenciado com dois modos de conexão:

| Modo | Porta | Uso |
|------|-------|-----|
| Session mode | 5432 | Migrações EF Core (precisa de sessão persistente) |
| Transaction mode (Supavisor) | 6543 | App em produção (serverless-friendly, connection pooling) |

**Connection strings:**
```
# Migrations (session mode — use no EF CLI localmente e no startup)
Host=db.xxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=...

# App (transaction mode — use em production)
Host=aws-0-sa-east-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.xxxx;Password=...;Pooling=false
```

> `Pooling=false` no Npgsql quando usar Supavisor — ele já faz o pooling, duplo pooling causa erro.

**appsettings.Production.json:**
```json
{
  "ConnectionStrings": {
    "Default": "Host=...pooler...;Port=6543;Database=postgres;Username=postgres.xxxx;Password=...;Pooling=false"
  },
  "Jwt": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "futvibe-api",
    "Audience": "futvibe-app"
  },
  "AllowedOrigins": "https://futvibe.vercel.app"
}
```

---

## Railway — Deploy

### Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/Futvibe.WebApi/Futvibe.WebApi.csproj", "src/Futvibe.WebApi/"]
COPY ["src/Futvibe.Application/Futvibe.Application.csproj", "src/Futvibe.Application/"]
COPY ["src/Futvibe.Infrastructure/Futvibe.Infrastructure.csproj", "src/Futvibe.Infrastructure/"]
COPY ["src/Futvibe.Domain/Futvibe.Domain.csproj", "src/Futvibe.Domain/"]
RUN dotnet restore "src/Futvibe.WebApi/Futvibe.WebApi.csproj"
COPY . .
RUN dotnet publish "src/Futvibe.WebApi/Futvibe.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Futvibe.WebApi.dll"]
```

### Variáveis de Ambiente no Railway

```
ConnectionStrings__Default   = (Supabase Transaction URL)
Jwt__Secret                  = (string aleatória 64+ chars)
Jwt__Issuer                  = futvibe-api
Jwt__Audience                = futvibe-app
AllowedOrigins               = https://futvibe.vercel.app
ASPNETCORE_URLS              = http://+:8080
ASPNETCORE_ENVIRONMENT       = Production
```

### Passos Railway

```
1. Criar conta Railway → New Project → Deploy from GitHub
2. Selecionar repo futvibe-api
3. Railway detecta Dockerfile automaticamente
4. Adicionar variáveis de ambiente acima
5. Deploy → Railway gera URL pública (ex: futvibe-api.up.railway.app)
```

---

## Adaptação Frontend — Camada api/

Toda mudança fica em `features/*/services/` e `api/`. Nenhum componente, hook ou tipo muda.

```ts
// api/client.ts — NOVO
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('futvibe_token')
    : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

```ts
// api/matches.ts — substituir mocks
import { apiClient } from './client'
import type { Match, MatchFilters } from '@/features/matches/types'

export const matchesApi = {
  getAll: (filters?: MatchFilters) =>
    apiClient.get<Match[]>('/matches', { params: filters }).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<Match>(`/matches/${id}`).then(r => r.data),

  create: (data: Omit<Match, 'id' | 'participants'>) =>
    apiClient.post<Match>('/matches', data).then(r => r.data),

  join: (matchId: string) =>
    apiClient.post(`/matches/${matchId}/join`).then(() => undefined),

  updateParticipant: (matchId: string, userId: string, status: string) =>
    apiClient.patch(`/matches/${matchId}/participants/${userId}`, { status }).then(() => undefined),

  getMyMatches: () =>
    apiClient.get<Match[]>('/matches/me').then(r => r.data),
}
```

```ts
// features/matches/services/match-service.ts — troca mock por api/
import { matchesApi } from '@/api/matches'
// ... mesmas assinaturas, zero mudança nos hooks
```

---

## Variáveis de Ambiente — Frontend

```bash
# .env.local (desenvolvimento)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Vercel (produção)
NEXT_PUBLIC_API_URL=https://futvibe-api.up.railway.app/api
```

---

## NuGet Packages — por projeto

```xml
<!-- Futvibe.Application -->
<PackageReference Include="MediatR" Version="12.*" />
<PackageReference Include="FluentValidation" Version="11.*" />

<!-- Futvibe.Infrastructure -->
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.*" />
<PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.*" />
<PackageReference Include="BCrypt.Net-Next" Version="4.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="9.*" />

<!-- Futvibe.WebApi -->
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.*" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="7.*" />

<!-- tests -->
<PackageReference Include="xunit" Version="2.*" />
<PackageReference Include="FluentAssertions" Version="7.*" />
<PackageReference Include="NSubstitute" Version="5.*" />
<PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="9.*" />
```

---

## TODO — Fases de Implementação

> Status: `[ ]` pendente · `[x]` feito · `[-]` em progresso

### Fase B1 — Setup da Solução ✅
- [x] `dotnet new sln -n Futvibe`
- [x] Criar 4 projetos (`classlib` para Domain/Application/Infrastructure, `webapi` para WebApi)
- [x] Adicionar referências entre projetos
- [x] Instalar NuGet packages por projeto

### Fase B2 — Domain ✅
- [x] Entidades: `User`, `Match`, `Participant`, `Banner` com construtores privados e factory methods
- [x] Enums: `MatchLevel`, `MatchVisibility`, `ParticipantStatus`
- [x] Interfaces de repositório: `IMatchRepository`, `IUserRepository`, `IBannerRepository`
- [x] Interface de serviço: `IJwtService`
- [x] Exceções de domínio: `NotFoundException`, `ForbiddenException`, `BusinessException`
- [x] Lógica de negócio em `Match.DetermineStatusForNewJoiner()`

### Fase B3 — Infrastructure ✅
- [x] `FutvibeDbContext` com `DbSet<T>` para cada entidade
- [x] `IEntityTypeConfiguration<T>` para cada entidade (mapeamento de colunas, enums como string, índices)
- [ ] Migrations iniciais via `dotnet ef migrations add InitialCreate` (pós-Supabase)
- [x] Repositórios concretos implementando interfaces do Domain
- [x] `DependencyInjection.cs` com `AddInfrastructure()` extension

### Fase B4 — Application Auth ✅
- [x] `LoginCommand` + `LoginCommandHandler` + `LoginCommandValidator`
- [x] `LoginResult` DTO com `{ Token, User }`
- [x] `ValidationBehavior<TRequest, TResponse>` (MediatR pipeline)
- [x] `LoggingBehavior<TRequest, TResponse>`
- [x] `AddApplication()` extension registrando MediatR + FluentValidation + behaviors
- [x] DTOs compartilhados: `UserDto`, `MatchDto`, `ParticipantDto`, `BannerDto`

### Fase B5 — Application Matches ✅
- [x] `GetMatchesQuery` + Handler (com filtros level, paid, page, limit)
- [x] `GetMatchByIdQuery` + Handler (inclui participants com dados dos usuários)
- [x] `GetUserMatchesQuery` + Handler
- [x] `CreateMatchCommand` + Handler + Validator
- [x] `JoinMatchCommand` + Handler + Validator (usa `Match.DetermineStatusForNewJoiner()`)
- [x] `UpdateParticipantStatusCommand` + Handler + Validator (verifica se requester é host)
- [x] `MatchMapper` — mapper estático centralizado `Match → MatchDto`

### Fase B6 — Application Users + Banners ✅
- [x] `GetCurrentUserQuery` + Handler
- [x] `GetUserByIdQuery` + Handler
- [x] `UpdateProfileCommand` + Handler + Validator
- [x] `GetBannersQuery` + Handler (filtra `is_active = true`, ordena por `display_order`)
- [x] `UserMapper` — mapper estático centralizado `User → UserDto`

### Fase B7 — WebApi
- [ ] `ExceptionHandlerMiddleware` mapeando exceções → HTTP status
- [ ] `ClaimsPrincipalExtensions.GetUserId()`
- [ ] `AuthController` — `POST /api/auth/login`
- [ ] `MatchesController` — todos os endpoints de matches
- [ ] `UsersController` — endpoints de usuário
- [ ] `BannersController` — `GET /api/banners`
- [ ] `Program.cs` com CORS, JWT, migrations no startup
- [ ] `Dockerfile` otimizado com multi-stage build

### Fase B8 — Seed de Dados
- [ ] Script SQL ou Seeder C# com usuários e partidas do mock atual
- [ ] Pelo menos 1 usuário de teste com email/senha conhecidos

### Fase B9 — Adaptação Frontend
- [ ] `api/client.ts` com Axios + interceptor JWT
- [ ] `api/matches.ts` substituindo calls de mock
- [ ] `api/users.ts` substituindo calls de mock
- [ ] `api/banners.ts` substituindo calls de mock
- [ ] `features/*/services/*.ts` apontando para `api/` em vez de `mocks/`
- [ ] `auth-service.ts` salvando token JWT retornado pelo login
- [ ] Variáveis de ambiente `.env.local` e Vercel

### Fase B10 — Deploy ⏸️ (aguardando aprovação — novas features primeiro)
- [ ] Criar projeto no Supabase → copiar connection strings (session + transaction)
- [ ] Criar conta Railway → New Project → conectar repo `futvibe-api`
- [ ] Configurar variáveis de ambiente no Railway
- [ ] Primeiro deploy → verificar migrations rodando no startup
- [ ] Configurar `NEXT_PUBLIC_API_URL` no Vercel
- [ ] Testar fluxo completo em produção: login → criar partida → entrar em partida

---

## Decisões de Arquitetura

| Tema | Decisão | Motivo |
|------|---------|--------|
| CQRS | MediatR, não biblioteca própria | Ecossistema maduro, pipeline behaviors prontos |
| Validação | FluentValidation no pipeline MediatR | Validação antes de chegar no handler, sem try/catch |
| Enums no banco | Armazenados como `string` no EF | Migrations simples, legível no SQL direto |
| Auth | JWT de 30 dias, sem refresh token | MVP — simplicidade antes de refresh flow |
| Migrations | Rodam no startup da aplicação | Zero passo manual no Railway deploy |
| Repos vs DbContext direto | Repositórios por entidade | Testabilidade, Application não conhece EF |
| Supabase connection | `Pooling=false` com Supavisor | Evita conflito entre Npgsql pool e Supavisor pool |
| Erros HTTP | Middleware central | Controllers limpos, mapeamento num só lugar |
