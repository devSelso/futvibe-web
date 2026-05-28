import { BottomNav } from '@/lib/components/bottom-nav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="max-w-lg mx-auto pb-20">
        {children}
      </div>
      <BottomNav />
    </>
  )
}
