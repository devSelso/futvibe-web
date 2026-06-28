'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const OPTIONS = [
  { label: 'Todos', value: undefined },
  { label: 'Grátis', value: 0 },
  { label: 'Até R$20', value: 20 },
  { label: 'Até R$30', value: 30 },
] as const

interface PriceFilterProps {
  value?: number
}

export function PriceFilter({ value }: PriceFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleSelect(price: number | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    if (price !== undefined) {
      params.set('maxPrice', String(price))
    } else {
      params.delete('maxPrice')
    }
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
      {OPTIONS.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={`shrink-0 h-8 px-3 rounded-full text-xs font-medium border transition-colors ${
              active
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-input text-muted-foreground hover:bg-muted'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
