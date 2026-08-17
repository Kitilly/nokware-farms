import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { DesktopNav } from './DesktopNav'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100">
      <DesktopNav />
      <main className="pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}
