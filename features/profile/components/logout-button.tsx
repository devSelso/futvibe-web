'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IconLogout } from '@tabler/icons-react'
import { logout } from '@/features/profile/services/auth-service'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await logout()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 w-full h-12 px-4 rounded-xl border border-border text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors disabled:opacity-50"
    >
      <IconLogout size={16} />
      {loading ? 'Saindo...' : 'Desconectar'}
    </button>
  )
}
