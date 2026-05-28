import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { IconMapPin, IconClock, IconUsers, IconArrowLeft, IconConfetti } from '@tabler/icons-react'
import Link from 'next/link'
import { fetchMatchById } from '@/features/matches/services/match-service'
import { ShareButton } from '@/features/matches/components/share-button'
import { CopyLinkButton } from '@/features/matches/components/copy-link-button'
import { MatchActions } from '@/features/matches/components/match-actions'
import { ParticipantList } from '@/features/matches/components/participant-list'
import { headers } from 'next/headers'
import { SESSION_COOKIE } from '@/lib/constants'

const levelLabel = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' }

export default async function MatchDetailPage(props: PageProps<'/match/[id]'>) {
  const { id } = await props.params
  const searchParams = await props.searchParams
  const justCreated = searchParams.created === '1'

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

  const isHost = match.participants.some(
    (p) => p.userId === currentUserId && p.status === 'host'
  )
  const isAlreadyParticipant = match.participants.some((p) => p.userId === currentUserId)

  const confirmedCount = match.participants.filter(
    (p) => p.status === 'confirmed' || p.status === 'host'
  ).length
  const spotsLeft = match.maxPlayers - confirmedCount

  const formattedDate = new Date(match.date + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 pt-5 pb-3">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <IconArrowLeft size={20} />
        </Link>
        <h1 className="font-semibold text-lg truncate flex-1">{match.title}</h1>
        <ShareButton title={match.title} url={matchUrl} />
      </header>

      <div className="px-4 space-y-4 flex-1 pb-2">
        {justCreated && (
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
            <IconConfetti size={16} className="shrink-0" />
            Partida criada! Compartilhe o link para convidar jogadores.
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
            {spotsLeft > 0 && (
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

        {match.visibility === 'private' && (
          <CopyLinkButton url={matchUrl} />
        )}

        <ParticipantList
          matchId={id}
          participants={participantsWithUsers}
          maxPlayers={match.maxPlayers}
          isHost={isHost}
        />
      </div>

      {!isHost && (
        <div className="sticky bottom-20 px-4 pb-4 pt-2 bg-background border-t border-border mt-4">
          <MatchActions
            matchId={id}
            spotsLeft={spotsLeft}
            isAlreadyParticipant={isAlreadyParticipant}
          />
        </div>
      )}
    </div>
  )
}
