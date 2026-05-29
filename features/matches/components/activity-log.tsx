'use client'

import { useEffect, useState } from 'react'
import { IconClipboardList } from '@tabler/icons-react'
import { fetchMatchActivity } from '@/features/matches/services/match-service'
import type { ActivityLogEntry } from '@/api/matches'

interface ActivityLogProps {
  matchId: string
}

const actionLabel: Record<string, string> = {
  requested: 'Solicitou entrada',
  accepted: 'Foi aceito',
  rejected: 'Foi recusado',
  left: 'Desistiu',
  cancelled: 'Partida cancelada pelo organizador',
}

const actionColor: Record<string, string> = {
  requested: 'text-blue-600',
  accepted: 'text-green-600',
  rejected: 'text-red-500',
  left: 'text-orange-500',
  cancelled: 'text-destructive',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ActivityLog({ matchId }: ActivityLogProps) {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatchActivity(matchId)
      .then(setLogs)
      .finally(() => setLoading(false))
  }, [matchId])

  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <IconClipboardList size={16} className="text-muted-foreground" />
        Atividade
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 rounded bg-muted animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma atividade registrada.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0 overflow-hidden">
                {log.userAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={log.userAvatar} alt={log.userName} className="w-full h-full object-cover" />
                ) : (
                  log.userName[0]
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{log.userName}</span>
                {' '}
                <span className={`text-xs ${actionColor[log.action] ?? 'text-muted-foreground'}`}>
                  {actionLabel[log.action] ?? log.action}
                </span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{formatDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
