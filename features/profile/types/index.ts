import type { MatchLevel } from '@/features/matches/types'

export interface User {
  id: string
  name: string
  avatar?: string
  level: MatchLevel
  bio?: string
  presenceScore: number
  matchesPlayed: number
}
