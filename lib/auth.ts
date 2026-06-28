import { SESSION_COOKIE, CITY_COOKIE } from '@/lib/constants'

const TOKEN_KEY = 'futvibe_token'
const USER_ID_KEY = 'futvibe_user_id'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30

export function saveSession(token: string, userId: string, city: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_ID_KEY, userId)
  document.cookie = `${SESSION_COOKIE}=${userId}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
  document.cookie = `${CITY_COOKIE}=${encodeURIComponent(city)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function updateCity(city: string): void {
  document.cookie = `${CITY_COOKIE}=${encodeURIComponent(city)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getSession(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(USER_ID_KEY)
}

export function updateToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_ID_KEY)
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`
  document.cookie = `${CITY_COOKIE}=; path=/; max-age=0`
}
