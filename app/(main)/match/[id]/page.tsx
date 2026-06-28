import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { IconMapPin, IconClock, IconUsers, IconArrowLeft, IconLock, IconCheck, IconPencil, IconBan } from '@tabler/icons-react'
import Link from 'next/link'
import { fetchMatchById } from '@/features/matches/services/match-service'
import { ShareButton } from '@/features/matches/components/share-button'
import { CopyLinkButton } from '@/features/matches/components/copy-link-button'
import { MatchActions } from '@/features/matches/components/match-actions'
import { ParticipantList } from '@/features/matches/components/participant-list'
import { PresenceValidationPanel } from '@/features/matches/components/presence-validation-panel'
import { RateParticipantsPanel } from '@/features/matches/components/rate-participants-panel'
import { CancelMatchButton } from '@/features/matches/components/cancel-match-button'
import { headers } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/constants'

const levelLabel = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' }

export default async function MatchDetailPage(props: PageProps<'/match/[id]'>) {
  const { id } = await props.params
  const cookieStore = await cookies()
  const currentUserId = cookieStore.get(SESSION_COOKIE)?.value ?? ''

  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') ?? 'http'
  const matchUrl = `${proto}://${host}/match/${id}`

  const match = await fetchMatchById(id)
  if (!match) notFound()

  const participantsWithUsers = match.participants.map((p) => ({
    ...p,
    user: p.user ?? null,
  }))

  const currentParticipant = match.participants.find((p) => p.userId === currentUserId)
  const isHost = currentParticipant?.status === 'host'
  const isAlreadyParticipant = !!currentParticipant

  const confirmedCount = match.participants.filter(
    (p) => p.status === 'confirmed' || p.status === 'host'
  ).length
  const spotsLeft = match.maxPlayers - confirmedCount

  const formattedDate = new Date(match.date + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })

  const isClosed = match.status === 'closed'
  const isCancelled = match.status === 'cancelled'
  const isPendingValidation = match.status === 'pendingvalidation'

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 pt-5 pb-3">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <IconArrowLeft size={20} />
        </Link>
        <h1 className="font-semibold text-lg truncate flex-1">{match.title}</h1>
        <div className="flex items-center gap-1 shrink-0">
          {isCancelled ? (
            <span className="flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">
              <IconBan size={12} />
              Cancelada
            </span>
          ) : isClosed ? (
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
              <IconLock size={12} />
              Encerrada
            </span>
          ) : (
            <>
              {isHost && match.status === 'scheduled' && (
                <Link
                  href={`/match/${id}/edit`}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Editar partida"
                >
                  <IconPencil size={18} />
                </Link>
              )}
              <ShareButton title={match.title} url={matchUrl} />
            </>
          )}
        </div>
      </header>

      <div className="px-4 space-y-4 flex-1 pb-2">
        {isClosed && (
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-muted border border-border text-muted-foreground text-sm">
            <IconCheck size={16} className="shrink-0" />
            Partida encerrada.
          </div>
        )}

        {isCancelled && (
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive text-sm">
            <IconBan size={16} className="shrink-0" />
            Partida cancelada pelo organizador.
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <IconMapPin size={16} className="text-muted-foreground shrink-0" />
            <span>{match.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IconClock size={16} className="text-muted-foreground shrink-0" />
            <span>{formattedDate} · {match.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IconUsers size={16} className="text-muted-foreground shrink-0" />
            <span>{confirmedCount}/{match.maxPlayers} jogadores</span>
            {spotsLeft > 0 && !isClosed && (
              <span className="text-green-600 font-medium">
                · {spotsLeft} vaga{spotsLeft > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-muted-foreground">Nível: {levelLabel[match.level]}</span>
            <span className="font-semibold">
              {match.pricePerPlayer === 0 ? 'Grátis' : `R$ ${match.pricePerPlayer}/pessoa`}
            </span>
          </div>
        </div>

        {match.visibility === 'private' && !isClosed && (
          <CopyLinkButton url={matchUrl} />
        )}

        {isHost && isPendingValidation && (
          <PresenceValidationPanel
            matchId={id}
            participants={participantsWithUsers}
          />
        )}

        {isClosed && isAlreadyParticipant && (
          <RateParticipantsPanel
            matchId={id}
            currentUserId={currentUserId}
            participants={participantsWithUsers}
          />
        )}

        {isHost && (match.status === 'scheduled' || match.status === 'pendingvalidation') && (
          <CancelMatchButton matchId={id} />
        )}

        <ParticipantList
          matchId={id}
          participants={participantsWithUsers}
          maxPlayers={match.maxPlayers}
          isHost={isHost}
        />
      </div>

      {!isHost && !isClosed && !isCancelled && (
        <div className="sticky bottom-20 px-4 pb-4 pt-2 bg-background border-t border-border mt-4">
          <MatchActions
            matchId={id}
            spotsLeft={spotsLeft}
            currentParticipantStatus={currentParticipant?.status}
          />
        </div>
      )}
    </div>
  )
}
