'use client'

import { IconShare2, IconCheck } from '@tabler/icons-react'
import { useShare } from '@/features/matches/hooks/use-share'

interface ShareButtonProps {
  title: string
  url: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const { handleShare, copied } = useShare(title, url)

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-muted transition-colors"
      aria-label={copied ? 'Link copiado!' : 'Compartilhar'}
    >
      {copied ? <IconCheck size={20} className="text-green-600" /> : <IconShare2 size={20} />}
    </button>
  )
}
