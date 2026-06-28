'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  IconPencil,
  IconCalendar,
  IconMapPin,
  IconChevronDown,
  IconChevronUp,
  IconBallVolleyball,
} from '@tabler/icons-react'
import { StarRating } from '@/lib/components/star-rating'
import { LogoutButton } from '@/features/profile/components/logout-button'
import { EditProfileModal } from '@/features/profile/components/edit-profile-modal'
import { DarkModeToggle } from '@/lib/components/dark-mode-toggle'
import { ActivityLog } from '@/features/matches/components/activity-log'
import { useCurrentUser } from '@/features/profile/hooks/use-current-user'
import { fetchUserMatches } from '@/features/matches/services/match-service'
import type { Match } from '@/lib/types'

type Tab = 'perfil' | 'partidas'

const levelLabel = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' }
const statusLabel: Record<string, string> = {
  host: 'Organizador',
  confirmed: 'Confirmado',
  pending: 'Pendente',
  rejected: 'Rejeitado',
  waitlist: 'Lista de espera',
  left: 'Desistiu',
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, refresh } = useCurrentUser()
  const [mounted, setMounted] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [history, setHistory] = useState<Match[]>([])
  const [matchesLoading, setMatchesLoading] = useState(false)
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('perfil')

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!user) return
    setMatchesLoading(true)
    fetchUserMatches()
      .then(setHistory)
      .finally(() => setMatchesLoading(false))
  }, [user])

  if (!mounted || loading) {
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

  const activeMatches = history.filter(
    (m) => m.status === 'scheduled' || m.status === 'pendingvalidation'
  )
  const pastMatches = history.filter(
    (m) => m.status !== 'scheduled' && m.status !== 'pendingvalidation'
  )

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

      {/* Tabs */}
      <div className="flex border-b border-border mb-5">
        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'perfil'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('partidas')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
            activeTab === 'partidas'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
        >
          Partidas
          {activeMatches.length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeMatches.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'perfil' && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{user.matchesPlayed}</p>
              <p className="text-xs text-muted-foreground mt-1">Partidas jogadas</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{user.presenceScore}%</p>
              <p className="text-xs text-muted-foreground mt-1">Presença</p>
            </div>
          </div>

          {user.averageRating != null && (
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between mb-6">
              <p className="text-xs text-muted-foreground">Avaliação média</p>
              <StarRating value={user.averageRating} />
            </div>
          )}

          <LogoutButton />
        </>
      )}

      {activeTab === 'partidas' && (
        <div className="space-y-6">
          {matchesLoading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-xl" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
              <IconBallVolleyball size={40} strokeWidth={1.2} />
              <p className="text-sm">Nenhuma partida ainda</p>
            </div>
          ) : (
            <>
              {activeMatches.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-foreground">Ativas</h3>
                  <div className="space-y-2">
                    {activeMatches.map((m) => (
                      <MatchCard
                        key={m.id}
                        match={m}
                        userId={user.id}
                        expandedActivity={expandedActivity}
                        onToggleActivity={(id) =>
                          setExpandedActivity(expandedActivity === id ? null : id)
                        }
                        onNavigate={(id) => router.push(`/match/${id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {pastMatches.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-muted-foreground">Histórico</h3>
                  <div className="space-y-2">
                    {pastMatches.map((m) => (
                      <MatchCard
                        key={m.id}
                        match={m}
                        userId={user.id}
                        expandedActivity={expandedActivity}
                        onToggleActivity={(id) =>
                          setExpandedActivity(expandedActivity === id ? null : id)
                        }
                        onNavigate={(id) => router.push(`/match/${id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

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

interface MatchCardProps {
  match: Match
  userId: string
  expandedActivity: string | null
  onToggleActivity: (id: string) => void
  onNavigate: (id: string) => void
}

function MatchCard({ match: m, userId, expandedActivity, onToggleActivity, onNavigate }: MatchCardProps) {
  const participation = m.participants.find((p) => p.userId === userId)
  const isHost = m.hostId === userId

  return (
    <div
      className="bg-card border border-border rounded-xl p-3 space-y-2 cursor-pointer hover:border-primary/40 transition-colors"
      onClick={() => onNavigate(m.id)}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-sm truncate">{m.title}</p>
        {m.status === 'cancelled' && (
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
            Cancelada
          </span>
        )}
        {m.status === 'pendingvalidation' && isHost && (
          <span className="shrink-0 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
            Validar presença
          </span>
        )}
      </div>

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

      {participation && m.status !== 'cancelled' && (
        <span className="inline-block px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
          {statusLabel[participation.status] ?? participation.status}
        </span>
      )}

      {isHost && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleActivity(m.id) }}
          className="flex items-center gap-1 text-xs text-primary font-medium mt-1"
        >
          {expandedActivity === m.id ? (
            <><IconChevronUp size={13} /> Fechar</>
          ) : (
            <><IconChevronDown size={13} /> Atividade</>
          )}
        </button>
      )}

      {expandedActivity === m.id && (
        <div onClick={(e) => e.stopPropagation()}>
          <ActivityLog matchId={m.id} />
        </div>
      )}
    </div>
  )
}
