export type MatchLevel = 'beginner' | 'intermediate' | 'advanced'
export type MatchVisibility = 'public' | 'private' | 'hybrid'
export type MatchStatus = 'scheduled' | 'pendingvalidation' | 'closed' | 'cancelled'
export type ParticipantStatus = 'host' | 'confirmed' | 'pending' | 'rejected' | 'waitlist' | 'left'

export interface Participant {
  userId: string
  status: ParticipantStatus
  user?: import('@/features/profile/types').User
}

export interface Match {
  id: string
  title: string
  location: string
  city: string
  date: string
  time: string
  level: MatchLevel
  pricePerPlayer: number
  maxPlayers: number
  visibility: MatchVisibility
  status: MatchStatus
  hostId?: string
  participantCount?: number
  participants: Participant[]
}

export interface MatchFilters {
  location?: string
  maxPrice?: number
  page?: number
  limit?: number
}
