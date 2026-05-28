'use server'

import { submitNewMatch, joinMatch, setParticipantStatus } from '@/features/matches/services/match-service'
import type { Match, ParticipantStatus } from '@/features/matches/types'

export async function createMatch(data: Omit<Match, 'id' | 'participants'>): Promise<Match> {
  return submitNewMatch(data)
}

export async function requestJoinMatch(matchId: string): Promise<void> {
  return joinMatch(matchId)
}

export async function updateParticipantStatus(
  matchId: string,
  userId: string,
  status: ParticipantStatus
): Promise<void> {
  return setParticipantStatus(matchId, userId, status)
}
