'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef } from 'react'
import { IconCirclePlus, IconBallFootball, IconLoader2 } from '@tabler/icons-react'
import { MatchCard } from '@/features/matches/components/match-card'
import { useInfiniteMatches } from '@/features/matches/hooks/use-infinite-matches'
import type { Match, MatchFilters } from '@/features/matches/types'

interface Props {
  initialMatches: Match[]
  filters: Omit<MatchFilters, 'page' | 'limit'>
  effectiveLocation?: string
}

function groupByDate(matches: Match[]): [string, Match[]][] {
  const map = new Map<string, Match[]>()
  for (const match of matches) {
    if (!map.has(match.date)) map.set(match.date, [])
    map.get(match.date)!.push(match)
  }
  return Array.from(map.entries())
}

export function MatchFeed({ initialMatches, filters, effectiveLocation }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Calculated per render so "Hoje"/"Amanhã" stay correct in long sessions
  const dateLabel = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const todayMs = today.getTime()
    const tomorrowMs = tomorrow.getTime()
    return (dateStr: string) => {
      const ms = new Date(dateStr + 'T00:00:00').getTime()
      if (ms === todayMs) return 'Hoje'
      if (ms === tomorrowMs) return 'Amanhã'
      return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long', day: '2-digit', month: 'long',
      })
    }
  }, [])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMatches(filters, {
    pages: [initialMatches],
    pageParams: [1],
  })

  const allMatches = data?.pages.flat() ?? []
  const grouped = useMemo(() => groupByDate(allMatches), [data])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (allMatches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-14 text-center">
        <IconBallFootball size={40} className="text-muted-foreground" />
        <div>
          <p className="font-semibold">Nenhuma partida por aqui</p>
          <p className="text-sm text-muted-foreground mt-1">
            {effectiveLocation
              ? `Nenhuma partida encontrada em "${effectiveLocation}".`
              : 'Seja o primeiro a criar uma partida na sua região.'}
          </p>
        </div>
        <Link
          href="/match/create"
          className="flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
        >
          <IconCirclePlus size={16} />
          Criar partida
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {grouped.map(([date, dayMatches]) => (
        <div key={date}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 capitalize">
            {dateLabel(date)}
          </p>
          <div className="flex flex-col gap-3">
            {dayMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}

      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <IconLoader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {!hasNextPage && allMatches.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-2">
          Todas as partidas carregadas
        </p>
      )}
    </div>
  )
}
