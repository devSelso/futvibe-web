'use client'

import { useEffect } from 'react'
import { Button } from '@/lib/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-4 text-center">
      <p className="text-4xl">⚠️</p>
      <h2 className="font-semibold text-lg">Algo deu errado</h2>
      <p className="text-sm text-muted-foreground">Tente novamente ou volte ao feed.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  )
}
