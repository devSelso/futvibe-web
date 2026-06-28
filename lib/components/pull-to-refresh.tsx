'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { IconLoader2 } from '@tabler/icons-react'

const THRESHOLD = 70
const MAX_PULL = 110

interface Props {
  children: React.ReactNode
}

export function PullToRefresh({ children }: Props) {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const pullDistanceRef = useRef(0)
  const refreshingRef = useRef(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (refreshingRef.current || window.scrollY !== 0) return
    startYRef.current = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (refreshingRef.current || window.scrollY !== 0) return
    const delta = e.touches[0].clientY - startYRef.current
    if (delta <= 0) {
      pullDistanceRef.current = 0
      setPullDistance(0)
      return
    }
    e.preventDefault()
    const clamped = Math.min(delta, MAX_PULL)
    pullDistanceRef.current = clamped
    setPullDistance(clamped)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (refreshingRef.current) return
    const dist = pullDistanceRef.current
    if (dist >= THRESHOLD) {
      refreshingRef.current = true
      setRefreshing(true)
      setPullDistance(THRESHOLD)
      router.refresh()
      setTimeout(() => {
        refreshingRef.current = false
        setRefreshing(false)
        pullDistanceRef.current = 0
        setPullDistance(0)
      }, 1000)
    } else {
      pullDistanceRef.current = 0
      setPullDistance(0)
    }
  }, [router])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const indicatorOpacity = pullDistance > 0 || refreshing ? Math.min(pullDistance / THRESHOLD, 1) : 0
  const indicatorY = pullDistance > 0 || refreshing ? Math.min(pullDistance * 0.4, 40) : 0

  return (
    <div ref={wrapperRef} className="relative overscroll-y-contain">
      {(pullDistance > 0 || refreshing) && (
        <div
          className="absolute left-0 right-0 flex justify-center pointer-events-none z-10"
          style={{ top: indicatorY, opacity: indicatorOpacity }}
        >
          <div className="bg-background border border-border rounded-full p-2 shadow-sm">
            <IconLoader2
              size={18}
              className={`text-primary ${refreshing ? 'animate-spin' : ''}`}
              style={!refreshing ? { transform: `rotate(${(pullDistance / THRESHOLD) * 360}deg)` } : undefined}
            />
          </div>
        </div>
      )}
      <div style={{
        transform: pullDistance > 0 ? `translateY(${indicatorY + 28}px)` : undefined,
        transition: pullDistance > 0 ? 'none' : 'transform 0.2s',
      }}>
        {children}
      </div>
    </div>
  )
}
