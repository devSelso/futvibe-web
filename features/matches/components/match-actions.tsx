'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/lib/components/ui/button'
import { joinMatch, leaveMatch } from '@/features/matches/services/match-service'
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-react'
import type { ParticipantStatus } from '@/features/matches/types'

interface MatchActionsProps {
  matchId: string
  spotsLeft: number
  currentParticipantStatus?: ParticipantStatus
}

type ToastState = { type: 'success' | 'error'; message: string } | null

const LEAVABLE_STATUSES: ParticipantStatus[] = ['confirmed', 'pending', 'waitlist']

export function MatchActions({ matchId, spotsLeft, currentParticipantStatus }: MatchActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)
  const [joined, setJoined] = useState(!!currentParticipantStatus)

  const canLeave = currentParticipantStatus && LEAVABLE_STATUSES.includes(currentParticipantStatus)

  function showToast(t: ToastState) {
    setToast(t)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleJoin() {
    setLoading(true)
    try {
      await joinMatch(matchId)
      setJoined(true)
      showToast({
        type: 'success',
        message: spotsLeft > 0 ? 'Solicitação enviada!' : 'Você entrou na lista de espera.',
      })
    } catch {
      showToast({ type: 'error', message: 'Erro ao solicitar vaga. Tente novamente.' })
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
      showToast({ type: 'error', message: 'Erro ao desistir. Tente novamente.' })
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      {toast && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <IconCircleCheck size={15} className="shrink-0" />
          ) : (
            <IconAlertCircle size={15} className="shrink-0" />
          )}
          {toast.message}
        </div>
      )}

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
