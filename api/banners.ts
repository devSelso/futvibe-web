import { client } from '@/api/client'
import type { BannerSlide } from '@/features/promotions/types'

export async function apiGetBanners(): Promise<BannerSlide[]> {
  const { data } = await client.get<BannerSlide[]>('/banners')
  return data
}
