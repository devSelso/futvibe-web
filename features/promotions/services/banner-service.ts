import { apiGetBanners } from '@/api/banners'
import type { BannerSlide } from '@/features/promotions/types'

export async function fetchBanners(): Promise<BannerSlide[]> {
  return apiGetBanners()
}
