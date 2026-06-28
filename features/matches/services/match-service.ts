import {
  apiGetMatches,
  apiGetMatchById,
  apiGetMyMatches,
  apiCreateMatch,
  apiEditMatch,
  apiCancelMatch,
  apiJoinMatch,
  apiLeaveMatch,
  apiUpdateParticipantStatus,
  apiValidatePresence,
  apiGetMatchActivity,
} from '@/api/matches'
import type { ActivityLogEntry } from '@/api/matches'
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

export async function editMatch(
  matchId: string,
  data: Omit<Match, 'id' | 'participants' | 'status' | 'hostId' | 'participantCount'>
): Promise<void> {
  return apiEditMatch(matchId, data)
}

export async function joinMatch(matchId: string): Promise<void> {
  return apiJoinMatch(matchId)
}

export async function leaveMatch(matchId: string): Promise<void> {
  return apiLeaveMatch(matchId)
}

export async function cancelMatch(matchId: string): Promise<void> {
  return apiCancelMatch(matchId)
}

export async function setParticipantStatus(
  matchId: string,
  userId: string,
  status: ParticipantStatus
): Promise<void> {
  return apiUpdateParticipantStatus(matchId, userId, status)
}

export async function validatePresence(
  matchId: string,
  validations: { userId: string; present: boolean }[]
): Promise<void> {
  return apiValidatePresence(matchId, validations)
}

export async function fetchMatchActivity(matchId: string): Promise<ActivityLogEntry[]> {
  return apiGetMatchActivity(matchId)
}
