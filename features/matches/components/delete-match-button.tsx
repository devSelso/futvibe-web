'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconTrash, IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '@/lib/components/ui/button'
import { deleteMatch } from '@/features/matches/services/match-service'

interface DeleteMatchButtonProps {
  matchId: string
}

export function DeleteMatchButton({ matchId }: DeleteMatchButtonProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      await deleteMatch(matchId)
      router.push('/')
    } catch {
      setError('Erro ao excluir. Tente novamente.')
      setLoading(false)
    }
  }

  if (confirming) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
        <div className="flex items-center gap-2 text-destructive text-sm font-medium">
          <IconAlertTriangle size={16} className="shrink-0" />
          Excluir partida permanentemente?
        </div>
        <p className="text-xs text-muted-foreground">
          Todos os participantes serão removidos. Esta ação não pode ser desfeita.
        </p>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10"
            onClick={() => setConfirming(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 h-10 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
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
      <IconTrash size={15} />
      Excluir partida
    </button>
  )
}
