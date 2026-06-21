'use client'

import { useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'

export function Header({ backHref = '/doctor/dashboard', backLabel = 'Bosh sahifa' }: { backHref?: string; backLabel?: string }) {
  const router = useRouter()
  const { theme, toggle } = useTheme()

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-8 py-4"
      style={{ background: 'var(--header)', borderBottom: '1px solid var(--line)' }}
    >
      <h1 className="m-0 text-xl font-bold" style={{ color: 'var(--ink)' }}>
        Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
      </h1>
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggle}
          aria-label="Temani almashtirish"
          className="btn-animated rounded-lg border px-3 py-2 text-sm"
          style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button
          onClick={() => router.push(backHref)}
          className="btn-animated rounded-lg border px-4 py-2 text-sm"
          style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
        >
          ← {backLabel}
        </button>
      </div>
    </header>
  )
}
