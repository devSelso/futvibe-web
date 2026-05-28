import { client } from '@/api/client'
import type { User } from '@/features/profile/types'

interface LoginResponse {
  token: string
  user: User
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse | null> {
  try {
    const { data } = await client.post<LoginResponse>('/auth/login', { email, password })
    return data
  } catch {
    return null
  }
}
