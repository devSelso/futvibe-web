'use client'

import { useState, useEffect } from 'react'
import { IconPencil, IconCalendar, IconMapPin } from '@tabler/icons-react'
import { LogoutButton } from '@/features/profile/components/logout-button'
import { EditProfileModal } from '@/features/profile/components/edit-profile-modal'
import { DarkModeToggle } from '@/lib/components/dark-mode-toggle'
import { useCurrentUser } from '@/features/profile/hooks/use-current-user'
import { fetchUserMatches } from '@/features/matches/services/match-service'
import type { Match } from '@/lib/types'

const levelLabel = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' }
const statusLabel = {
  host: 'Organizador',
  confirmed: 'Confirmado',
  pending: 'Pendente',
  rejected: 'Rejeitado',
  waitlist: 'Lista de espera',
}

export default function ProfilePage() {
  const { user, loading, refresh } = useCurrentUser()
  const [editOpen, setEditOpen] = useState(false)
  const [history, setHistory] = useState<Match[]>([])

  useEffect(() => {
    if (!user) return
    fetchUserMatches().then(setHistory)
  }, [user])

  if (loading) {
    return (
      <div className="px-4 pt-6 pb-4 space-y-4 animate-pulse">
        <div className="h-6 w-24 bg-muted rounded" />
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-20 h-20 rounded-full bg-muted" />
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Perfil</h1>
        <div className="flex items-center gap-1">
          <DarkModeToggle />
          <button
            onClick={() => setEditOpen(true)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Editar perfil"
          >
            <IconPencil size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-20 h-20 rounded-full bg-muted overflow-hidden">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
              {user.name[0]}
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{levelLabel[user.level]}</p>
        </div>
        {user.bio && (
          <p className="text-sm text-center text-muted-foreground max-w-xs">{user.bio}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{user.matchesPlayed}</p>
          <p className="text-xs text-muted-foreground mt-1">Partidas jogadas</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{user.presenceScore}%</p>
          <p className="text-xs text-muted-foreground mt-1">Presença</p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3">Histórico</h3>
          <div className="space-y-2">
            {history.map((m) => {
              const participation = m.participants.find((p) => p.userId === user.id)
              return (
                <div key={m.id} className="bg-card border border-border rounded-xl p-3 space-y-1">
                  <p className="font-medium text-sm">{m.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IconCalendar size={11} />
                      {m.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <IconMapPin size={11} />
                      {m.location}
                    </span>
                  </div>
                  {participation && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                      {statusLabel[participation.status]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <LogoutButton />

      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={refresh}
        />
      )}
    </div>
  )
}
