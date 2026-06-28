'use client'

import { useState } from 'react'
import { useToast } from '@/lib/providers/toast-context'

export function useShare(title: string, url: string) {
  const { addToast } = useToast()
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        addToast('Link copiado!', 'success')
        setTimeout(() => setCopied(false), 2000)
      } catch {
        addToast('Não foi possível copiar o link.', 'error')
      }
    }
  }

  return { handleShare, copied }
}
