'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useRef } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'

interface LocationFilterProps {
  value?: string
}

export function LocationFilter({ value }: LocationFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const location = inputRef.current?.value.trim()
    if (location) {
      router.push(`${pathname}?location=${encodeURIComponent(location)}`)
    } else {
      router.push(pathname)
    }
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = ''
    router.push(pathname)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <IconSearch
        size={16}
        className="absolute left-3 text-muted-foreground pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        defaultValue={value ?? ''}
        placeholder="Buscar por localização..."
        className="w-full h-10 pl-9 pr-9 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-muted-foreground hover:text-foreground"
        >
          <IconX size={14} />
        </button>
      )}
    </form>
  )
}
