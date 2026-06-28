import { cookies } from 'next/headers'
import { fetchMatches } from '@/features/matches/services/match-service'
import { fetchBanners } from '@/features/promotions/services/banner-service'
import { MatchFeed } from '@/features/matches/components/match-feed'
import { LocationFilter } from '@/features/matches/components/location-filter'
import { PriceFilter } from '@/features/matches/components/price-filter'
import { Banner } from '@/lib/components/banner'
import { CITY_COOKIE } from '@/lib/constants'

export default async function FeedPage(props: PageProps<'/'>) {
  const searchParams = await props.searchParams
  const cookieStore = await cookies()

  const locationParam = searchParams.location as string | undefined
  const rawMaxPrice = searchParams.maxPrice
  const maxPriceParam = rawMaxPrice !== undefined && !isNaN(Number(rawMaxPrice)) ? Number(rawMaxPrice) : undefined
  const rawCity = cookieStore.get(CITY_COOKIE)?.value
  const cityFromCookie = rawCity ? decodeURIComponent(rawCity) : undefined

  const effectiveLocation = locationParam ?? cityFromCookie
  const filters = { location: effectiveLocation, maxPrice: maxPriceParam }

  const [initialMatches, banners] = await Promise.all([
    fetchMatches({ ...filters, page: 1, limit: 10 }),
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

      <LocationFilter value={effectiveLocation} />
      <PriceFilter value={maxPriceParam} />

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Partidas
        </h2>
        <MatchFeed
          initialMatches={initialMatches}
          filters={filters}
          effectiveLocation={effectiveLocation}
        />
      </div>
    </div>
  )
}
