'use client'

import { useState, useEffect } from 'react'

const KEY = 'futvibe:dark'

export function useDarkMode() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem(KEY, next ? '1' : '0')
  }

  return { dark, toggle }
}
