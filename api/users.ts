import { client } from '@/api/client'
import type { User } from '@/features/profile/types'

export interface UpdateProfilePayload {
  name: string
  bio?: string
  level: string
}

export async function apiGetCurrentUser(): Promise<User> {
  const { data } = await client.get<User>('/users/me')
  return data
}

export async function apiGetUserById(id: string): Promise<User | null> {
  try {
    const { data } = await client.get<User>(`/users/${id}`)
    return data
  } catch {
    return null
  }
}

export async function apiUpdateProfile(payload: UpdateProfilePayload): Promise<User> {
  const { data } = await client.put<User>('/users/me', payload)
  return data
}
