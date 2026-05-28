'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchMatches } from '@/features/matches/services/match-service'
import type { MatchFilters } from '@/features/matches/types'

export function useMatches(filters?: MatchFilters) {
  return useQuery({
    queryKey: ['matches', filters],
    queryFn: () => fetchMatches(filters),
  })
}
