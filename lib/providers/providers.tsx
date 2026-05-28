'use client'

import { QueryProvider } from '@/lib/providers/query-provider'
import { ToastProvider } from '@/lib/providers/toast-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  )
}
