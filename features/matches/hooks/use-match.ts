'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMatchById } from '@/features/matches/services/match-service'

export function useMatch(id: string) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => fetchMatchById(id),
    enabled: !!id,
  })
}
