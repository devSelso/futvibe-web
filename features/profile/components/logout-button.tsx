'use client'

import { useRouter } from 'next/navigation'
import { IconLogout } from '@tabler/icons-react'
import { logout } from '@/features/profile/services/auth-service'

export function LogoutButton() {
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full h-12 px-4 rounded-xl border border-border text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors"
    >
      <IconLogout size={16} />
      Desconectar
    </button>
  )
}
