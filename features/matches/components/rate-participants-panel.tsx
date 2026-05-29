'use client'

import { useState } from 'react'
import { IconStarFilled, IconStar } from '@tabler/icons-react'
import { apiSubmitRating } from '@/api/ratings'
import type { Participant } from '@/features/matches/types'

interface RateParticipantsPanelProps {
  matchId: string
  currentUserId: string
  participants: Participant[]
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="text-amber-400 transition-colors"
          >
            {active ? <IconStarFilled size={20} /> : <IconStar size={20} className="text-muted-foreground" />}
          </button>
        )
      })}
    </div>
  )
}

export function RateParticipantsPanel({ matchId, currentUserId, participants }: RateParticipantsPanelProps) {
  const rateable = participants.filter(
    (p) => p.userId !== currentUserId && (p.status === 'confirmed' || p.status === 'host')
  )

  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(rateable.map((p) => [p.userId, 0]))
  )
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleRate(userId: string) {
    const score = scores[userId]
    if (!score) return
    setLoading((prev) => ({ ...prev, [userId]: true }))
    setErrors((prev) => ({ ...prev, [userId]: '' }))
    try {
      await apiSubmitRating(userId, matchId, score)
      setSubmitted((prev) => ({ ...prev, [userId]: true }))
    } catch {
      setErrors((prev) => ({ ...prev, [userId]: 'Erro ao enviar. Tente novamente.' }))
    } finally {
      setLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  if (rateable.length === 0) return null

  return (
    <div className="rounded-xl border border-border p-4 space-y-4">
      <h3 className="text-sm font-semibold">Avalie os jogadores</h3>
      <div className="space-y-3">
        {rateable.map((p) => {
          const name = p.user?.name ?? 'Jogador'
          const isDone = submitted[p.userId]
          return (
            <div key={p.userId} className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium truncate flex-1">{name}</span>
              {isDone ? (
                <span className="text-xs text-green-600 font-medium">Avaliado</span>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <StarPicker
                    value={scores[p.userId]}
                    onChange={(v) => setScores((prev) => ({ ...prev, [p.userId]: v }))}
                  />
                  <button
                    type="button"
                    disabled={!scores[p.userId] || loading[p.userId]}
                    onClick={() => handleRate(p.userId)}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
                  >
                    {loading[p.userId] ? '...' : 'Enviar'}
                  </button>
                </div>
              )}
              {errors[p.userId] && (
                <p className="text-xs text-destructive">{errors[p.userId]}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
