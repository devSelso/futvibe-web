'use client'

import { useEffect } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
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
    <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-4 text-center">
      <IconAlertTriangle size={40} className="text-muted-foreground" />
      <h2 className="font-semibold text-lg">Algo deu errado</h2>
      <p className="text-sm text-muted-foreground">Não foi possível carregar a página.</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => { window.location.href = '/login' }}>
          Voltar ao login
        </Button>
        <Button onClick={reset}>Tentar novamente</Button>
      </div>
    </div>
  )
}
