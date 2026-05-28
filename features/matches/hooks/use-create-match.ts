'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitNewMatch } from '@/features/matches/services/match-service'
import type { Match } from '@/features/matches/types'

export function useCreateMatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Match, 'id' | 'participants'>) => submitNewMatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}
