import Link from 'next/link'
import { IconCirclePlus, IconBallVolleyball } from '@tabler/icons-react'
import { fetchMatches } from '@/features/matches/services/match-service'
import { fetchBanners } from '@/features/promotions/services/banner-service'
import { MatchCard } from '@/features/matches/components/match-card'
import { LocationFilter } from '@/features/matches/components/location-filter'
import { Banner } from '@/lib/components/banner'

export default async function FeedPage(props: PageProps<'/'>) {
  const searchParams = await props.searchParams
  const location = searchParams.location as string | undefined

  const [matches, banners] = await Promise.all([
    fetchMatches({ location }),
    fetchBanners(),
  ])

  return (
    <div className="px-4 pt-6 pb-4 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FutVibe</h1>
          <p className="text-sm text-muted-foreground">Partidas perto de você</p>
        </div>
      </div>

      <Banner slides={banners} />

      <LocationFilter value={location} />

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Partidas
        </h2>

        {matches.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-14 text-center">
            <IconBallVolleyball size={40} className="text-muted-foreground" />
            <div>
              <p className="font-semibold">Nenhuma partida por aqui</p>
              <p className="text-sm text-muted-foreground mt-1">
                {location
                  ? `Nenhuma partida encontrada em "${location}".`
                  : 'Seja o primeiro a criar uma partida na sua região.'}
              </p>
            </div>
            <Link
              href="/match/create"
              className="flex items-center gap-2 h-11 px-5 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
            >
              <IconCirclePlus size={16} />
              Criar partida
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
