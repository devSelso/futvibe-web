'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { joinMatch } from '@/features/matches/services/match-service'

export function useJoinMatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (matchId: string) => joinMatch(matchId),
    onSuccess: (_, matchId) => {
      queryClient.invalidateQueries({ queryKey: ['match', matchId] })
    },
  })
}
