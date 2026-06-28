'use client'

import { useRouter } from 'next/navigation'
import {
  IconCheck,
  IconX,
  IconEdit,
  IconBan,
  IconClockPlay,
  IconUserPlus,
} from '@tabler/icons-react'
import type { Notification, NotificationType } from '@/features/notifications/types'

const iconMap: Record<NotificationType, React.ReactNode> = {
  joinRequested: <IconUserPlus size={18} className="text-blue-500" />,
  joinAccepted: <IconCheck size={18} className="text-green-500" />,
  joinRejected: <IconX size={18} className="text-red-500" />,
  matchUpdated: <IconEdit size={18} className="text-blue-500" />,
  matchCancelled: <IconBan size={18} className="text-orange-500" />,
  validationWindowOpened: <IconClockPlay size={18} className="text-yellow-500" />,
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `há ${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  return `há ${days}d`
}

interface Props {
  notification: Notification
  onRead: (id: string) => void
}

export function NotificationItem({ notification, onRead }: Props) {
  const router = useRouter()

  function handleClick() {
    if (!notification.isRead) {
      onRead(notification.id)
    }
    if (notification.matchId) {
      router.push(`/match/${notification.matchId}`)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-0 ${
        notification.isRead
          ? 'opacity-50 hover:opacity-70'
          : 'hover:bg-muted/50'
      }`}
    >
      {!notification.isRead && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}
      <span className="mt-0.5 shrink-0">{iconMap[notification.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-snug">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {relativeTime(notification.createdAt)}
        </p>
      </div>
    </button>
  )
}
