'use client'

import { useState } from 'react'
import { IconLink, IconCheck } from '@tabler/icons-react'
import { useToast } from '@/lib/providers/toast-context'

interface CopyLinkButtonProps {
  url: string
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const { addToast } = useToast()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      addToast('Link copiado!', 'success')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      addToast('Não foi possível copiar o link.', 'error')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 w-full h-11 px-4 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
    >
      {copied ? <IconCheck size={15} className="text-green-600" /> : <IconLink size={15} />}
      {copied ? 'Link copiado!' : 'Copiar link da partida'}
    </button>
  )
}
