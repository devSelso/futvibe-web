'use client'

import { useState } from 'react'
import { IconShare2, IconCheck } from '@tabler/icons-react'

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-muted transition-colors relative"
      title={copied ? 'Link copiado!' : 'Compartilhar'}
    >
      {copied ? <IconCheck size={20} className="text-green-600" /> : <IconShare2 size={20} />}
    </button>
  )
}
