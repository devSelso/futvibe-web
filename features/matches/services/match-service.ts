import {
  apiGetMatches,
  apiGetMatchById,
  apiGetMyMatches,
  apiCreateMatch,
  apiJoinMatch,
  apiUpdateParticipantStatus,
} from '@/api/matches'
import type { Match, MatchFilters, ParticipantStatus } from '@/features/matches/types'

export async function fetchMatches(filters?: MatchFilters): Promise<Match[]> {
  return apiGetMatches(filters)
}

export async function fetchMatchById(id: string): Promise<Match | null> {
  return apiGetMatchById(id)
}

export async function fetchUserMatches(): Promise<Match[]> {
  return apiGetMyMatches()
}

export async function submitNewMatch(data: Omit<Match, 'id' | 'participants'>): Promise<Match> {
  return apiCreateMatch(data)
}

export async function joinMatch(matchId: string): Promise<void> {
  return apiJoinMatch(matchId)
}

export async function setParticipantStatus(
  matchId: string,
  userId: string,
  status: ParticipantStatus
): Promise<void> {
  return apiUpdateParticipantStatus(matchId, userId, status)
}
