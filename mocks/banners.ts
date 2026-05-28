import type { BannerSlide } from '@/features/promotions/types'

export const mockBanners: BannerSlide[] = [
  { id: 'b1', imageUrl: '/banners/ifood.png', alt: 'iFood', href: 'https://ifood.com.br' },
  { id: 'b2', imageUrl: '/banners/uber.png', alt: 'Uber', href: 'https://uber.com' },
  { id: 'b3', imageUrl: '/banners/nubank.png', alt: 'Kirra Fitness' },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const randomDelay = () => delay(300 + Math.random() * 300)

export async function getBanners(): Promise<BannerSlide[]> {
  await randomDelay()
  return mockBanners
}
