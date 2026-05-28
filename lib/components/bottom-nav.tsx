'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconHome, IconCirclePlus, IconBell, IconUser } from '@tabler/icons-react'

const tabs = [
  { href: '/', icon: IconHome, label: 'Feed' },
  { href: '/match/create', icon: IconCirclePlus, label: 'Criar' },
  { href: '/notifications', icon: IconBell, label: 'Alertas' },
  { href: '/profile', icon: IconUser, label: 'Perfil' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-medium transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
