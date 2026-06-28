'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { IconSearch, IconX, IconCurrentLocation, IconLoader2 } from '@tabler/icons-react'
import { useGpsLocation } from '@/features/matches/hooks/use-gps-location'

interface LocationFilterProps {
  value?: string
}

export function LocationFilter({ value }: LocationFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { locating, getCity } = useGpsLocation()
  const [inputValue, setInputValue] = useState(value ?? '')

  function buildUrl(location: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (location) {
      params.set('location', location)
    } else {
      params.delete('location')
    }
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push(buildUrl(inputValue.trim() || null))
  }

  function handleClear() {
    setInputValue('')
    router.push(buildUrl(null))
  }

  async function handleGps() {
    const city = await getCity()
    if (city) {
      setInputValue(city)
      router.push(buildUrl(city))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <IconSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Buscar por cidade..."
          className="w-full h-10 pl-9 pr-9 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <IconX size={14} />
          </button>
        )}
      </div>

      <button
        type="submit"
        className="shrink-0 h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        Buscar
      </button>

      <button
        type="button"
        onClick={handleGps}
        disabled={locating}
        className="shrink-0 h-10 w-10 flex items-center justify-center rounded-lg border border-input bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        aria-label="Usar localização atual"
      >
        {locating
          ? <IconLoader2 size={16} className="animate-spin" />
          : <IconCurrentLocation size={16} />
        }
      </button>
    </form>
  )
}
