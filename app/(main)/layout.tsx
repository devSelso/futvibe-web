import { BottomNav } from '@/lib/components/bottom-nav'
import { PullToRefresh } from '@/lib/components/pull-to-refresh'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="max-w-lg mx-auto pb-20">
        <PullToRefresh>
          {children}
        </PullToRefresh>
      </div>
      <BottomNav />
    </>
  )
}
