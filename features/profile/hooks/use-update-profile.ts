'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCurrentUser } from '@/features/profile/services/user-service'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; bio?: string; level: string }) => updateCurrentUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}
