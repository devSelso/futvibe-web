'use client'

import { useNotifications, useMarkNotificationRead } from '@/features/notifications/hooks/use-notifications'
import { NotificationItem } from '@/features/notifications/components/notification-item'

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications()
  const { mutate: markRead } = useMarkNotificationRead()

  if (isLoading) {
    return (
      <div className="px-4 pt-6">
        <h1 className="text-xl font-bold mb-5">Notificações</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold mb-5">Notificações</h1>
      {!notifications?.length ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Nenhuma notificação por enquanto.
        </p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={markRead} />
          ))}
        </div>
      )}
    </div>
  )
}
