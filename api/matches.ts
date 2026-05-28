import { client } from '@/api/client'
import type { Match, MatchFilters, ParticipantStatus } from '@/features/matches/types'

export async function apiGetMatches(filters?: MatchFilters): Promise<Match[]> {
  const params: Record<string, unknown> = {}
  if (filters?.level) params.level = filters.level
  if (filters?.paid !== undefined) params.paid = filters.paid
  if (filters?.page) params.page = filters.page
  if (filters?.limit) params.limit = filters.limit
  const { data } = await client.get<Match[]>('/matches', { params })
  return data
}

export async function apiGetMatchById(id: string): Promise<Match | null> {
  try {
    const { data } = await client.get<Match>(`/matches/${id}`)
    return data
  } catch {
    return null
  }
}

export async function apiGetMyMatches(): Promise<Match[]> {
  const { data } = await client.get<Match[]>('/matches/me')
  return data
}

export async function apiCreateMatch(payload: Omit<Match, 'id' | 'participants'>): Promise<Match> {
  const { data } = await client.post<Match>('/matches', payload)
  return data
}

export async function apiJoinMatch(matchId: string): Promise<void> {
  await client.post(`/matches/${matchId}/join`)
}

export async function apiUpdateParticipantStatus(
  matchId: string,
  userId: string,
  status: ParticipantStatus
): Promise<void> {
  await client.patch(`/matches/${matchId}/participants/${userId}`, { status })
}
