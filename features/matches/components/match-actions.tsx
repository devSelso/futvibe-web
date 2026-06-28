'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/lib/components/ui/button'
import { joinMatch, leaveMatch } from '@/features/matches/services/match-service'
import { useToast } from '@/lib/providers/toast-context'
import type { ParticipantStatus } from '@/features/matches/types'

interface MatchActionsProps {
  matchId: string
  spotsLeft: number
  currentParticipantStatus?: ParticipantStatus
}

const LEAVABLE_STATUSES: ParticipantStatus[] = ['confirmed', 'pending', 'waitlist']

export function MatchActions({ matchId, spotsLeft, currentParticipantStatus }: MatchActionsProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(!!currentParticipantStatus)

  const canLeave = currentParticipantStatus && LEAVABLE_STATUSES.includes(currentParticipantStatus)

  async function handleJoin() {
    setLoading(true)
    try {
      await joinMatch(matchId)
      setJoined(true)
      addToast(spotsLeft > 0 ? 'Solicitação enviada!' : 'Você entrou na lista de espera.', 'success')
    } catch {
      addToast('Erro ao solicitar vaga. Tente novamente.', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleLeave() {
    setLoading(true)
    try {
      await leaveMatch(matchId)
      router.refresh()
    } catch {
      addToast('Erro ao desistir. Tente novamente.', 'error')
      setLoading(false)
    }
  }

  return (
    <div>
      {canLeave ? (
        <Button
          variant="outline"
          className="w-full h-12 text-base font-semibold text-destructive border-destructive hover:bg-destructive/5"
          size="lg"
          disabled={loading}
          onClick={handleLeave}
        >
          {loading ? 'Aguarde...' : 'Desistir da partida'}
        </Button>
      ) : (
        <Button
          className="w-full h-12 text-base font-semibold"
          size="lg"
          disabled={loading || joined}
          onClick={joined ? undefined : handleJoin}
        >
          {joined
            ? 'Solicitação enviada'
            : loading
            ? 'Aguarde...'
            : spotsLeft > 0
            ? 'Solicitar Vaga'
            : 'Entrar na Lista de Espera'}
        </Button>
      )}
    </div>
  )
}
