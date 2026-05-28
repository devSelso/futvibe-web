'use client'

import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/lib/auth'
import { fetchCurrentUser } from '@/features/profile/services/user-service'

export function useCurrentUser() {
  const token = getToken()

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    enabled: !!token,
  })

  return {
    user: query.data ?? null,
    loading: query.isLoading,
    refresh: query.refetch,
  }
}
