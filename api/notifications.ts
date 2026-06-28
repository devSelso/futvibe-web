import { client } from '@/api/client'
import type { Notification } from '@/features/notifications/types'

export async function apiGetNotifications(): Promise<Notification[]> {
  const { data } = await client.get<Notification[]>('/notifications')
  return data
}

export async function apiMarkNotificationRead(id: string): Promise<void> {
  await client.patch(`/notifications/${id}/read`)
}
