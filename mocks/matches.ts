import type { Match, MatchFilters, ParticipantStatus } from '@/lib/types'

export const mockMatches: Match[] = []

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const randomDelay = () => delay(300 + Math.random() * 300)

export async function getMatches(filters?: MatchFilters): Promise<Match[]> {
  await randomDelay()
  let result = [...mockMatches]
  if (filters?.level) result = result.filter((m) => m.level === filters.level)
  if (filters?.paid === true) result = result.filter((m) => m.pricePerPlayer > 0)
  if (filters?.paid === false) result = result.filter((m) => m.pricePerPlayer === 0)
  const page = filters?.page ?? 1
  const limit = filters?.limit ?? result.length
  const start = (page - 1) * limit
  return result.slice(start, start + limit)
}

export async function getMatchById(id: string): Promise<Match | null> {
  await randomDelay()
  return mockMatches.find((m) => m.id === id) ?? null
}

export async function createMatch(data: Omit<Match, 'id' | 'participants'>): Promise<Match> {
  await randomDelay()
  const newMatch: Match = {
    ...data,
    id: `m${Date.now()}`,
    participants: [{ userId: 'u1', status: 'host' }],
  }
  mockMatches.push(newMatch)
  return newMatch
}

export async function requestSpot(matchId: string, userId: string): Promise<void> {
  await randomDelay()
  const match = mockMatches.find((m) => m.id === matchId)
  if (!match) return
  const existing = match.participants.find((p) => p.userId === userId)
  if (existing) return
  const confirmedCount = match.participants.filter(
    (p) => p.status === 'confirmed' || p.status === 'host'
  ).length
  const status: ParticipantStatus =
    match.visibility === 'private' || match.visibility === 'hybrid'
      ? confirmedCount < match.maxPlayers ? 'confirmed' : 'waitlist'
      : confirmedCount < match.maxPlayers ? 'pending' : 'waitlist'
  match.participants.push({ userId, status })
}

export async function getMatchesByUserId(userId: string): Promise<Match[]> {
  await randomDelay()
  return mockMatches.filter((m) => m.participants.some((p) => p.userId === userId))
}

export async function updateParticipantStatus(
  matchId: string,
  userId: string,
  status: ParticipantStatus
): Promise<void> {
  await randomDelay()
  const match = mockMatches.find((m) => m.id === matchId)
  if (!match) return
  const participant = match.participants.find((p) => p.userId === userId)
  if (participant) participant.status = status
}

export function seedMatches(): void {
  if (mockMatches.length > 0) return
  const seeds: Match[] = [
    {
      id: 'seed-1',
      title: 'Pelada da Barra — Sábado',
      location: 'Praia da Barra, Posto 9, Rio de Janeiro',
      date: '2026-05-30',
      time: '08:00',
      level: 'intermediate',
      pricePerPlayer: 20,
      maxPlayers: 6,
      visibility: 'hybrid',
      participants: [
        { userId: 'u1', status: 'host' },
        { userId: 'u2', status: 'confirmed' },
        { userId: 'u3', status: 'pending' },
      ],
    },
    {
      id: 'seed-2',
      title: 'Treino Avançado Ipanema',
      location: 'Praia de Ipanema, Posto 8, Rio de Janeiro',
      date: '2026-05-31',
      time: '07:00',
      level: 'advanced',
      pricePerPlayer: 30,
      maxPlayers: 4,
      visibility: 'public',
      participants: [
        { userId: 'u4', status: 'host' },
        { userId: 'u1', status: 'confirmed' },
      ],
    },
    {
      id: 'seed-3',
      title: 'Futevôlei Iniciantes — Domingo',
      location: 'Praia de Copacabana, Posto 6, Rio de Janeiro',
      date: '2026-06-01',
      time: '09:00',
      level: 'beginner',
      pricePerPlayer: 0,
      maxPlayers: 8,
      visibility: 'public',
      participants: [
        { userId: 'u3', status: 'host' },
        { userId: 'u5', status: 'confirmed' },
        { userId: 'u2', status: 'confirmed' },
      ],
    },
    {
      id: 'seed-4',
      title: 'Jogo Privado — Grupo Seleto',
      location: 'Arena Beach, Barra da Tijuca, Rio de Janeiro',
      date: '2026-05-28',
      time: '16:00',
      level: 'advanced',
      pricePerPlayer: 50,
      maxPlayers: 4,
      visibility: 'private',
      participants: [
        { userId: 'u4', status: 'host' },
        { userId: 'u1', status: 'confirmed' },
        { userId: 'u2', status: 'confirmed' },
        { userId: 'u5', status: 'confirmed' },
      ],
    },
    {
      id: 'seed-5',
      title: 'Pelada do Meio de Semana',
      location: 'Praia do Leblon, Posto 12, Rio de Janeiro',
      date: '2026-06-03',
      time: '18:00',
      level: 'intermediate',
      pricePerPlayer: 15,
      maxPlayers: 6,
      visibility: 'hybrid',
      participants: [
        { userId: 'u5', status: 'host' },
        { userId: 'u3', status: 'pending' },
      ],
    },
    {
      id: 'seed-6',
      title: 'Futevôlei Livre — Sábado Tarde',
      location: 'Praia de São Conrado, Rio de Janeiro',
      date: '2026-05-30',
      time: '14:00',
      level: 'beginner',
      pricePerPlayer: 0,
      maxPlayers: 10,
      visibility: 'public',
      participants: [
        { userId: 'u2', status: 'host' },
        { userId: 'u3', status: 'confirmed' },
        { userId: 'u5', status: 'confirmed' },
      ],
    },
    {
      id: 'seed-7',
      title: 'Desafio Inter-Bairros',
      location: 'Praia do Flamengo, Rio de Janeiro',
      date: '2026-06-06',
      time: '10:00',
      level: 'intermediate',
      pricePerPlayer: 25,
      maxPlayers: 6,
      visibility: 'public',
      participants: [
        { userId: 'u1', status: 'host' },
        { userId: 'u4', status: 'confirmed' },
        { userId: 'u5', status: 'waitlist' },
      ],
    },
  ]
  mockMatches.push(...seeds)
}

seedMatches()
