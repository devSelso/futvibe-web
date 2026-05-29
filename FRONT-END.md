# Futvibe — Frontend Integration Guide

## Base URL

| Env | URL |
|-----|-----|
| Dev | `http://localhost:5122` |
| Docker | `http://localhost:8080` |
| Prod | Variável `NEXT_PUBLIC_API_URL` (Railway) |

CORS configurado para `http://localhost:3000` em dev.

---

## Autenticação

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "teste@futvibe.app", "password": "123456" }
```

**Response `200`:**
```json
{
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "name": "Rafael Costa",
    "email": "teste@futvibe.app",
    "avatar": null,
    "bio": "Jogando futevôlei há 8 anos.",
    "level": "advanced",
    "presenceScore": 98,
    "matchesPlayed": 142
  }
}
```

Armazenar JWT no `localStorage` (`futvibe_token`). Enviar em toda request protegida:
```
Authorization: Bearer <token>
```

Expiração: **30 dias**. Sem refresh token — em `401` redirecionar para `/login`.

---

## Enums (strings lowercase)

| Enum | Valores |
|------|---------|
| `MatchLevel` | `"beginner"` \| `"intermediate"` \| `"advanced"` |
| `MatchVisibility` | `"public"` \| `"private"` \| `"hybrid"` |
| `ParticipantStatus` | `"host"` \| `"confirmed"` \| `"pending"` \| `"rejected"` \| `"waitlist"` |

---

## Endpoints

### Users

**Get current user** (auth):
```http
GET /api/users/me
```

**Get user by ID:**
```http
GET /api/users/{id}
```

**Response `UserDto`:**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "avatar": "string|null",
  "bio": "string|null",
  "level": "beginner|intermediate|advanced",
  "presenceScore": 0,
  "matchesPlayed": 0
}
```

**Update profile** (auth):
```http
PUT /api/users/me
Content-Type: application/json

{ "name": "string", "bio": "string|null", "level": "beginner|intermediate|advanced" }
```
Returns updated `UserDto`.

---

### Matches

**List matches:**
```http
GET /api/matches?level=intermediate&paid=false&page=1&limit=10
```

Todos os params opcionais. `paid=true` → `pricePerPlayer > 0`.

**Response `MatchDto[]`:**
```json
[
  {
    "id": "uuid",
    "title": "Pelada da Barra — Sábado",
    "location": "Praia da Barra, Posto 9, Rio de Janeiro",
    "date": "2026-05-30",
    "time": "08:00",
    "level": "intermediate",
    "pricePerPlayer": 20.0,
    "maxPlayers": 6,
    "visibility": "hybrid",
    "hostId": "uuid",
    "participantCount": 2,
    "participants": [
      { "userId": "uuid", "status": "host", "user": null },
      { "userId": "uuid", "status": "confirmed", "user": null }
    ]
  }
]
```

> `participantCount` = contagem de participantes com status `host` ou `confirmed`.  
> No feed (`GET /matches`), `participants[].user` é **sempre `null`** — user data não é carregada nessa query.  
> No detalhe (`GET /matches/:id`), `participants[].user` é **sempre preenchido**.

**Get match by ID:**
```http
GET /api/matches/{id}
```

Retorna `MatchDto` com `participants[].user` preenchido.

**Get user's matches** (auth):
```http
GET /api/matches/me
```

**Create match** (auth):
```http
POST /api/matches
Content-Type: application/json

{
  "title": "string",
  "location": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "level": "beginner|intermediate|advanced",
  "pricePerPlayer": 0,
  "maxPlayers": 6,
  "visibility": "public|private|hybrid"
}
```

Returns `201 Created` + `MatchDto`. Criador é adicionado automaticamente como participante `host`.

**Join match** (auth):
```http
POST /api/matches/{id}/join
```

Returns `204 No Content`. Status atribuído automaticamente por `Match.DetermineStatusForNewJoiner()`:

| Visibilidade | Vagas | Status atribuído |
|---|---|---|
| `private` ou `hybrid` | disponível | `confirmed` |
| `public` | disponível | `pending` |
| qualquer | sem vaga | `waitlist` |

**Update participant status** (auth, host only):
```http
PATCH /api/matches/{matchId}/participants/{userId}
Content-Type: application/json

{ "status": "confirmed|rejected|waitlist|pending" }
```

Returns `204 No Content`. Lança `403` se requester não for o host.

---

### Banners

```http
GET /api/banners
```

```json
[
  {
    "id": "uuid",
    "imageUrl": "/banners/ifood.png",
    "alt": "iFood",
    "href": "https://ifood.com.br"
  }
]
```

Ordenado por `displayOrder`. Usado no carrossel do feed.

---

## Respostas de Erro

```json
{
  "error": "Mensagem descritiva",
  "statusCode": 422,
  "details": ["campo: erro", "..."]
}
```

> `details` presente apenas em erros de validação (`400`). Nos demais casos é `null`.

| HTTP | Significado |
|------|-------------|
| 400 | Validação — `details` preenchido |
| 401 | JWT ausente ou inválido |
| 403 | Ação não permitida (ex: não-host alterando participante) |
| 404 | Recurso não encontrado |
| 422 | Regra de negócio violada (ex: já está na partida, partida cheia) |
| 500 | Erro interno |

---

## Formato

- JSON keys: **camelCase**
- Datas: `"YYYY-MM-DD"` (DateOnly)
- Horas: `"HH:mm"` (sem segundos)
- Enums: strings lowercase
- UUIDs: lowercase com hífens

---

## Seed de Dev

Todos os usuários têm senha `123456`:

| Email | Nome | Nível |
|-------|------|-------|
| `teste@futvibe.app` | Rafael Costa | advanced |
| `juliana@futvibe.app` | Juliana Melo | intermediate |
| `bruno@futvibe.app` | Bruno Alves | beginner |
| `camila@futvibe.app` | Camila Torres | advanced |
| `diego@futvibe.app` | Diego Nunes | intermediate |

7 partidas seed com diferentes níveis/visibilidades. 3 banners (iFood, Uber, Kirra Fitness).

---

## Notas

- `avatar` — sem upload de imagem; campo aceita URL externa (futuro)
- `presenceScore` e `matchesPlayed` — preenchidos no seed, não computados dinamicamente ainda
- Sem endpoint de registro — usuários criados via seed. `POST /api/auth/register` é feature futura
- Swagger UI disponível em `/swagger` (apenas em `Development`)
