'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconCheck, IconX, IconClockHour4 } from '@tabler/icons-react'
import { Button } from '@/lib/components/ui/button'
import { validatePresence } from '@/features/matches/services/match-service'
import { useToast } from '@/lib/providers/toast-context'
import type { Participant } from '@/features/matches/types'

interface PresenceValidationPanelProps {
  matchId: string
  participants: Participant[]
}

export function PresenceValidationPanel({ matchId, participants }: PresenceValidationPanelProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const confirmed = participants.filter((p) => p.status === 'confirmed')
  const [presence, setPresence] = useState<Record<string, boolean>>(
    Object.fromEntries(confirmed.map((p) => [p.userId, true]))
  )
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function toggle(userId: string) {
    setPresence((prev) => ({ ...prev, [userId]: !prev[userId] }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const validations = Object.entries(presence).map(([userId, present]) => ({ userId, present }))
      await validatePresence(matchId, validations)
      setDone(true)
      addToast('Presenças registradas!', 'success')
      setTimeout(() => router.refresh(), 1500)
    } catch {
      addToast('Erro ao salvar presenças. Tente novamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (confirmed.length === 0) {
    return (
      <div className="rounded-xl border border-border p-4 text-sm text-muted-foreground text-center">
        Nenhum jogador confirmado para validar.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 space-y-4">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium text-sm">
        <IconClockHour4 size={16} className="shrink-0" />
        Valide a presença dos jogadores (72h)
      </div>

      <div className="space-y-2">
        {confirmed.map((p) => {
          const isPresent = presence[p.userId] ?? true
          const name = p.user?.name ?? p.userId
          return (
            <div
              key={p.userId}
              className="flex items-center justify-between bg-background rounded-lg px-3 py-2 border border-border"
            >
              <span className="text-sm font-medium truncate flex-1">{name}</span>
              <button
                type="button"
                onClick={() => toggle(p.userId)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                  isPresent
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}
              >
                {isPresent ? <IconCheck size={13} /> : <IconX size={13} />}
                {isPresent ? 'Presente' : 'Faltou'}
              </button>
            </div>
          )
        })}
      </div>

      {done ? (
        <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          <IconCheck size={16} className="shrink-0" />
          Presenças registradas!
        </div>
      ) : (
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-11 font-semibold"
        >
          {loading ? 'Salvando...' : 'Confirmar presenças'}
        </Button>
      )}
    </div>
  )
}
