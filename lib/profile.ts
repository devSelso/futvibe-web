import type { MatchLevel } from '@/lib/types'

const KEY = 'futvibe:profile_override'

export type ProfileOverride = {
  name?: string
  bio?: string
  level?: MatchLevel
}

export function getProfileOverride(): ProfileOverride {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function setProfileOverride(data: ProfileOverride): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}
