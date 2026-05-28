'use client'

import { useState } from 'react'
import { Button } from '@/lib/components/ui/button'
import { joinMatch } from '@/features/matches/services/match-service'
import { IconCircleCheck, IconAlertCircle } from '@tabler/icons-react'

interface MatchActionsProps {
  matchId: string
  spotsLeft: number
  isAlreadyParticipant: boolean
}

type ToastState = { type: 'success' | 'error'; message: string } | null

export function MatchActions({ matchId, spotsLeft, isAlreadyParticipant }: MatchActionsProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(isAlreadyParticipant)
  const [toast, setToast] = useState<ToastState>(null)

  function showToast(t: ToastState) {
    setToast(t)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleJoin() {
    setLoading(true)
    try {
      await joinMatch(matchId)
      setDone(true)
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

      <Button
        className="w-full h-12 text-base font-semibold"
        size="lg"
        disabled={loading || done}
        onClick={done ? undefined : handleJoin}
      >
        {done
          ? 'Solicitação enviada ✓'
          : loading
          ? 'Aguarde...'
          : spotsLeft > 0
          ? 'Solicitar Vaga'
          : 'Entrar na Lista de Espera'}
      </Button>
    </div>
  )
}
