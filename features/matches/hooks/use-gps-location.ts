'use client'

import { useState } from 'react'

export function useGpsLocation() {
  const [locating, setLocating] = useState(false)

  async function getCity(): Promise<string | null> {
    if (!navigator.geolocation) return null
    setLocating(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      )
      const { latitude, longitude } = position.coords
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      )
      if (!res.ok) return null
      const data = await res.json()
      return (
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        null
      )
    } catch {
      return null
    } finally {
      setLocating(false)
    }
  }

  return { locating, getCity }
}
