import { apiLogin, apiRegister, apiLogout } from '@/api/auth'
import { saveSession, clearSession } from '@/lib/auth'
import type { RegisterInput } from '@/features/auth/form-schemas/register-schema'

export async function login(email: string, password: string): Promise<boolean> {
  const result = await apiLogin(email, password)
  if (!result) return false
  saveSession(result.token, result.user.id)
  return true
}

export async function register(payload: RegisterInput): Promise<boolean> {
  const result = await apiRegister(payload)
  if (!result) return false
  saveSession(result.token, result.user.id)
  return true
}

export async function logout(): Promise<void> {
  await apiLogout()
  clearSession()
}
