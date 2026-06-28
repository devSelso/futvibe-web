import type { MatchLevel } from '@/features/matches/types'

export interface User {
  id: string
  name: string
  avatar?: string
  city: string
  level: MatchLevel
  bio?: string
  presenceScore: number
  matchesPlayed: number
  averageRating?: number
}
