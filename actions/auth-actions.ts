'use server'

import { login as authLogin, logout as authLogout } from '@/features/profile/services/auth-service'

export async function login(email: string, password: string): Promise<boolean> {
  return authLogin(email, password)
}

export async function logout(): Promise<void> {
  authLogout()
}
