import { apiGetCurrentUser, apiGetUserById, apiUpdateProfile } from '@/api/users'
import type { User } from '@/features/profile/types'

export async function fetchCurrentUser(): Promise<User> {
  return apiGetCurrentUser()
}

export async function fetchUserById(id: string): Promise<User | null> {
  return apiGetUserById(id)
}

export async function updateCurrentUser(data: { name: string; bio?: string; level: string }): Promise<User> {
  return apiUpdateProfile(data)
}
