'use client'

import { IconMoon, IconSun } from '@tabler/icons-react'
import { useDarkMode } from '@/lib/hooks/use-dark-mode'

export function DarkModeToggle() {
  const { dark, toggle } = useDarkMode()
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full hover:bg-muted transition-colors"
      aria-label="Alternar modo escuro"
    >
      {dark ? <IconSun size={16} /> : <IconMoon size={16} />}
    </button>
  )
}
