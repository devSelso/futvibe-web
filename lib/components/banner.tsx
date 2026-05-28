'use client'

import { useState, useEffect, useCallback } from 'react'
import type { BannerSlide } from '@/features/promotions/types'

interface BannerProps {
  slides?: BannerSlide[]
  intervalMs?: number
}

const PLACEHOLDER_COUNT = 3

export function Banner({ slides, intervalMs = 4000 }: BannerProps) {
  const items: BannerSlide[] = slides && slides.length > 0
    ? slides
    : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({ id: `placeholder-${i}` }))

  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    const timer = setInterval(next, intervalMs)
    return () => clearInterval(timer)
  }, [next, intervalMs])

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-muted" style={{ aspectRatio: '16/7' }}>
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((slide) => (
          <div key={slide.id} className="shrink-0 w-full h-full">
            {slide.imageUrl ? (
              slide.href ? (
                <a href={slide.href} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.imageUrl} alt={slide.alt ?? ''} className="w-full h-full object-cover" />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slide.imageUrl} alt={slide.alt ?? ''} className="w-full h-full object-cover" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-xs text-muted-foreground">Espaço para anúncio</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {items.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-4 bg-primary' : 'w-1.5 bg-primary/30'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
