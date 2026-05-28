'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { MatchLevel } from '@/features/matches/types'

interface FilterChip {
  label: string
  param: string
  value: string
}

const LEVEL_CHIPS: FilterChip[] = [
  { label: 'Iniciante', param: 'level', value: 'beginner' },
  { label: 'Intermediário', param: 'level', value: 'intermediate' },
  { label: 'Avançado', param: 'level', value: 'advanced' },
]

const PAID_CHIPS: FilterChip[] = [
  { label: 'Grátis', param: 'paid', value: 'false' },
  { label: 'Pago', param: 'paid', value: 'true' },
]

interface FeedFiltersProps {
  activeLevel?: MatchLevel
  activePaid?: boolean
}

export function FeedFilters({ activeLevel, activePaid }: FeedFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  function toggle(param: string, value: string, currentValue: string | undefined) {
    const params = new URLSearchParams()
    if (activeLevel) params.set('level', activeLevel)
    if (activePaid !== undefined) params.set('paid', String(activePaid))

    const isActive = currentValue === value
    if (isActive) {
      params.delete(param)
    } else {
      params.set(param, value)
    }

    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const chipClass = (active: boolean) =>
    `h-8 px-3 rounded-full text-sm font-medium border transition-colors shrink-0 ${
      active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-background border-border text-muted-foreground'
    }`

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {LEVEL_CHIPS.map((chip) => (
        <button
          key={chip.value}
          className={chipClass(activeLevel === chip.value)}
          onClick={() => toggle('level', chip.value, activeLevel)}
        >
          {chip.label}
        </button>
      ))}
      {PAID_CHIPS.map((chip) => (
        <button
          key={chip.value}
          className={chipClass(
            chip.value === 'true' ? activePaid === true : activePaid === false
          )}
          onClick={() =>
            toggle(
              'paid',
              chip.value,
              activePaid === undefined ? undefined : String(activePaid)
            )
          }
        >
          {chip.label}
        </button>
      ))}
    </div>
  )
}
