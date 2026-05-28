'use client'

import { useState } from 'react'
import { IconLink, IconCheck } from '@tabler/icons-react'

interface CopyLinkButtonProps {
  url: string
}

export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
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
