'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchNotifications, markNotificationRead } from '@/features/notifications/services/notification-service'

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 30_000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<import('@/features/notifications/types').Notification[]>(
        ['notifications'],
        (old) => old?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) ?? []
      )
    },
  })
}
