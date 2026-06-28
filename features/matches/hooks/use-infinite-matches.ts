'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchMatches } from '@/features/matches/services/match-service'
import type { Match, MatchFilters } from '@/features/matches/types'

const PAGE_LIMIT = 10

export function useInfiniteMatches(
  filters: Omit<MatchFilters, 'page' | 'limit'>,
  initialData?: { pages: Match[][]; pageParams: number[] }
) {
  return useInfiniteQuery({
    queryKey: ['matches', 'infinite', filters],
    queryFn: ({ pageParam }) =>
      fetchMatches({ ...filters, page: pageParam as number, limit: PAGE_LIMIT }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length === PAGE_LIMIT ? (lastPageParam as number) + 1 : undefined,
    initialData,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  })
}
