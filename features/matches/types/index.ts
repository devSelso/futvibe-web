export type MatchLevel = 'beginner' | 'intermediate' | 'advanced'
export type MatchVisibility = 'public' | 'private' | 'hybrid'
export type ParticipantStatus = 'host' | 'confirmed' | 'pending' | 'rejected' | 'waitlist'

export interface Participant {
  userId: string
  status: ParticipantStatus
  user?: import('@/features/profile/types').User
}

export interface Match {
  id: string
  title: string
  location: string
  date: string
  time: string
  level: MatchLevel
  pricePerPlayer: number
  maxPlayers: number
  visibility: MatchVisibility
  participants: Participant[]
}

export interface MatchFilters {
  level?: MatchLevel
  paid?: boolean
  page?: number
  limit?: number
}
