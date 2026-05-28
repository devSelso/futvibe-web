'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setParticipantStatus } from '@/features/matches/services/match-service'
import type { ParticipantStatus } from '@/features/matches/types'

export function useUpdateParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      matchId,
      userId,
      status,
    }: {
      matchId: string
      userId: string
      status: ParticipantStatus
    }) => setParticipantStatus(matchId, userId, status),
    onSuccess: (_, { matchId }) => {
      queryClient.invalidateQueries({ queryKey: ['match', matchId] })
    },
  })
}
