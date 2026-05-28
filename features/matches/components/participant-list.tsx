'use client'

import { useState } from 'react'
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { setParticipantStatus } from '@/features/matches/services/match-service'
import type { ParticipantStatus } from '@/features/matches/types'
import type { User } from '@/features/profile/types'

interface ParticipantEntry {
  userId: string
  status: ParticipantStatus
  user: User | null
}

interface ParticipantListProps {
  matchId: string
  participants: ParticipantEntry[]
  maxPlayers: number
  isHost: boolean
}

const statusLabel: Record<ParticipantStatus, string> = {
  host: 'Organizador',
  confirmed: 'Confirmado',
  pending: 'Aguardando',
  rejected: 'Recusado',
  waitlist: 'Lista de espera',
}

export function ParticipantList({ matchId, participants, maxPlayers, isHost }: ParticipantListProps) {
  const [statuses, setStatuses] = useState<Record<string, ParticipantStatus>>(
    Object.fromEntries(participants.map((p) => [p.userId, p.status]))
  )
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(userId: string, newStatus: 'confirmed' | 'rejected') {
    setLoading(userId)
    try {
      await setParticipantStatus(matchId, userId, newStatus)
      setStatuses((prev) => ({ ...prev, [userId]: newStatus }))
    } finally {
      setLoading(null)
    }
  }

  const confirmedCount = Object.values(statuses).filter(
    (s) => s === 'confirmed' || s === 'host'
  ).length

  return (
    <div>
      <h2 className="font-semibold mb-3">
        Participantes ({confirmedCount}/{maxPlayers})
      </h2>
      <div className="space-y-2">
        {participants.map(({ userId, user }) => {
          const status = statuses[userId]
          const isPending = status === 'pending'
          const isLoading = loading === userId

          return (
            <div key={userId} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium overflow-hidden shrink-0">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0] ?? '?'
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name ?? 'Usuário'}</p>
                <p
                  className={`text-xs ${
                    status === 'confirmed' || status === 'host'
                      ? 'text-green-600'
                      : status === 'rejected'
                      ? 'text-red-500'
                      : status === 'waitlist'
                      ? 'text-yellow-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  {statusLabel[status]}
                </p>
              </div>

              {isHost && isPending && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={isLoading}
                    onClick={() => handleAction(userId, 'confirmed')}
                    className="p-1.5 rounded-full text-green-600 hover:bg-green-50 disabled:opacity-40 transition-colors"
                    title="Aprovar"
                  >
                    <IconCircleCheck size={18} />
                  </button>
                  <button
                    disabled={isLoading}
                    onClick={() => handleAction(userId, 'rejected')}
                    className="p-1.5 rounded-full text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
                    title="Recusar"
                  >
                    <IconCircleX size={18} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
