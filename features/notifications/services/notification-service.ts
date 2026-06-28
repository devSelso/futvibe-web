import { apiGetNotifications, apiMarkNotificationRead } from '@/api/notifications'
import type { Notification } from '@/features/notifications/types'

export async function fetchNotifications(): Promise<Notification[]> {
  return apiGetNotifications()
}

export async function markNotificationRead(id: string): Promise<void> {
  return apiMarkNotificationRead(id)
}
