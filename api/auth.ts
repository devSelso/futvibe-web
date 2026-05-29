import { client } from '@/api/client'
import type { User } from '@/features/profile/types'
import type { MatchLevel } from '@/features/matches/types'

interface AuthResponse {
  token: string
  user: User
}

interface RegisterRequest {
  name: string
  email: string
  password: string
  level: MatchLevel
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse | null> {
  try {
    const { data } = await client.post<AuthResponse>('/auth/login', { email, password })
    return data
  } catch {
    return null
  }
}

export async function apiRegister(payload: RegisterRequest): Promise<AuthResponse | null> {
  try {
    const { data } = await client.post<AuthResponse>('/auth/register', payload)
    return data
  } catch {
    return null
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await client.post('/auth/logout')
  } catch {
    // best effort — session cleared locally regardless
  }
}
