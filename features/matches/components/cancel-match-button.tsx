'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconBan, IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '@/lib/components/ui/button'
import { cancelMatch } from '@/features/matches/services/match-service'
import { useToast } from '@/lib/providers/toast-context'

interface CancelMatchButtonProps {
  matchId: string
}

export function CancelMatchButton({ matchId }: CancelMatchButtonProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCancel() {
    setLoading(true)
    try {
      await cancelMatch(matchId)
      router.refresh()
    } catch {
      addToast('Erro ao cancelar. Tente novamente.', 'error')
      setLoading(false)
    }
  }

  if (confirming) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
        <div className="flex items-center gap-2 text-destructive text-sm font-medium">
          <IconAlertTriangle size={16} className="shrink-0" />
          Cancelar esta partida?
        </div>
        <p className="text-xs text-muted-foreground">
          A partida ficará visível no histórico de todos os participantes como "Cancelada". Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10"
            onClick={() => setConfirming(false)}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button
            className="flex-1 h-10 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? 'Cancelando...' : 'Confirmar cancelamento'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 w-full h-11 px-4 rounded-xl border border-border text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
    >
      <IconBan size={15} />
      Cancelar partida
    </button>
  )
}
