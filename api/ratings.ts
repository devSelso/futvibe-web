import { client } from '@/api/client'

export async function apiSubmitRating(ratedId: string, matchId: string, score: number): Promise<void> {
  await client.post('/ratings', { ratedId, matchId, score })
}
