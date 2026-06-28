'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconHome, IconCirclePlus, IconBell, IconUser } from '@tabler/icons-react'
import { useNotifications } from '@/features/notifications/hooks/use-notifications'

export function BottomNav() {
  const pathname = usePathname()
  const { data: notifications } = useNotifications()
  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0

  const tabs = [
    { href: '/', icon: IconHome, label: 'Feed', badge: 0 },
    { href: '/match/create', icon: IconCirclePlus, label: 'Criar', badge: 0 },
    { href: '/notifications', icon: IconBell, label: 'Alertas', badge: unreadCount },
    { href: '/profile', icon: IconUser, label: 'Perfil', badge: 0 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ href, icon: Icon, label, badge }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-medium transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                {badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
