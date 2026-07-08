'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { ProfileMenu } from './ProfileMenu'
import { NotificationBell } from './NotificationBell'

export function Header({
  backHref, backLabel = 'Bosh sahifa', actions,
}: { backHref?: string; backLabel?: string; actions?: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  const logoBosish = () => {
    if (pathname.startsWith('/student')) router.push('/student/dashboard')
    else if (pathname.startsWith('/doctor')) router.push('/doctor/dashboard')
    else if (pathname.startsWith('/patient')) router.push('/patient/dashboard')
    else if (pathname.startsWith('/admin')) router.push('/admin/dashboard')
    else router.push('/')
  }

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-3 sm:px-8 sm:py-4"
      style={{ background: 'var(--header)', borderBottom: '1px solid var(--line)' }}
    >
      <h1 className="m-0 flex shrink-0 items-center text-lg font-bold sm:text-xl" style={{ color: 'var(--ink)' }}>
        <button
          onClick={logoBosish}
          aria-label="Bosh sahifaga o'tish"
          className="soft-press flex items-center gap-2 border-none bg-transparent p-0"
          style={{ color: 'inherit', cursor: 'pointer' }}
        >
          <img src="/urosfera-logo.png" alt="Urosfera" className="h-7 w-7 rounded-full sm:h-8 sm:w-8" />
          <span>Uro<span style={{ color: 'var(--accent)' }}>sfera</span></span>
        </button>
      </h1>
      <div className="flex items-center gap-2 sm:gap-2.5">
        {actions}
        <NotificationBell />
        <button
          onClick={toggle}
          aria-label="Temani almashtirish"
          className="btn-animated rounded-lg border px-3 py-2 text-sm"
          style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <ProfileMenu />
        {backHref && (
          <button
            onClick={() => router.push(backHref)}
            className="btn-animated rounded-lg border px-3 py-2 text-sm sm:px-4"
            style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
          >
            <span className="hidden sm:inline">← {backLabel}</span>
            <span className="sm:hidden">← Admin</span>
          </button>
        )}
      </div>
    </header>
  )
}
