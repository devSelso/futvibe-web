import { apiLogin } from '@/api/auth'
import { saveSession, clearSession } from '@/lib/auth'

export async function login(email: string, password: string): Promise<boolean> {
  const result = await apiLogin(email, password)
  if (!result) return false
  saveSession(result.token, result.user.id)
  return true
}

export function logout(): void {
  clearSession()
}
