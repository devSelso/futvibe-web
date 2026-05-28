'use client'

import Link from 'next/link'
import { IconMapPin, IconClock, IconUsers, IconChevronRight } from '@tabler/icons-react'
import type { Match } from '@/features/matches/types'

const levelLabel: Record<Match['level'], string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

const levelColor: Record<Match['level'], string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

interface MatchCardProps {
  match: Match
}

export function MatchCard({ match }: MatchCardProps) {
  const confirmedCount = match.participants.filter(
    (p) => p.status === 'confirmed' || p.status === 'host'
  ).length
  const spotsLeft = match.maxPlayers - confirmedCount

  const formattedDate = new Date(match.date + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })

  return (
    <Link href={`/match/${match.id}`} className="block">
      <div className="bg-card border border-border rounded-xl p-4 active:scale-[0.98] transition-transform">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{match.title}</h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <IconMapPin size={13} className="shrink-0" />
              <span className="truncate">{match.location}</span>
            </div>
          </div>
          <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${levelColor[match.level]}`}>
            {levelLabel[match.level]}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <IconClock size={13} />
            <span>{formattedDate} · {match.time}</span>
          </div>
          <div className="flex items-center gap-1">
            <IconUsers size={13} />
            <span>{confirmedCount}/{match.maxPlayers}</span>
          </div>
          {match.pricePerPlayer > 0 && (
            <span className="ml-auto font-medium text-foreground">
              R$ {match.pricePerPlayer}
            </span>
          )}
          {match.pricePerPlayer === 0 && (
            <span className="ml-auto font-medium text-green-600">Grátis</span>
          )}
        </div>

        {spotsLeft > 0 ? (
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-green-600 font-medium">
              {spotsLeft} vaga{spotsLeft > 1 ? 's' : ''} disponível{spotsLeft > 1 ? 'is' : ''}
            </span>
            <IconChevronRight size={16} className="text-muted-foreground" />
          </div>
        ) : (
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-orange-500 font-medium">Partida cheia</span>
            <IconChevronRight size={16} className="text-muted-foreground" />
          </div>
        )}
      </div>
    </Link>
  )
}
