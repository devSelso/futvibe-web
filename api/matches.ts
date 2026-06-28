import { client } from '@/api/client'
import type { Match, MatchFilters, ParticipantStatus } from '@/features/matches/types'

export async function apiGetMatches(filters?: MatchFilters): Promise<Match[]> {
  const params: Record<string, unknown> = {}
  if (filters?.location) params.location = filters.location
  if (filters?.maxPrice !== undefined) params.maxPrice = filters.maxPrice
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

export async function apiCreateMatch(payload: Omit<Match, 'id' | 'participants' | 'participantCount'>): Promise<Match> {
  const { data } = await client.post<Match>('/matches', payload)
  return data
}

export async function apiEditMatch(matchId: string, payload: Omit<Match, 'id' | 'participants' | 'status' | 'hostId' | 'participantCount'>): Promise<void> {
  await client.patch(`/matches/${matchId}`, payload)
}

export async function apiJoinMatch(matchId: string): Promise<void> {
  await client.post(`/matches/${matchId}/join`)
}

export async function apiLeaveMatch(matchId: string): Promise<void> {
  await client.delete(`/matches/${matchId}/leave`)
}

export async function apiCancelMatch(matchId: string): Promise<void> {
  await client.post(`/matches/${matchId}/cancel`)
}

export async function apiUpdateParticipantStatus(
  matchId: string,
  userId: string,
  status: ParticipantStatus
): Promise<void> {
  await client.patch(`/matches/${matchId}/participants/${userId}`, { status })
}

export async function apiValidatePresence(
  matchId: string,
  validations: { userId: string; present: boolean }[]
): Promise<void> {
  await client.patch(`/matches/${matchId}/validate-presence`, { validations })
}

export interface ActivityLogEntry {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  action: string
  createdAt: string
}

export async function apiGetMatchActivity(matchId: string): Promise<ActivityLogEntry[]> {
  const { data } = await client.get<ActivityLogEntry[]>(`/matches/${matchId}/activity`)
  return data
}
