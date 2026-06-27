'use client'

import { useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'

export function Header({
  backHref, backLabel = 'Bosh sahifa', actions,
}: { backHref?: string; backLabel?: string; actions?: React.ReactNode }) {
  const router = useRouter()
  const { theme, toggle } = useTheme()

  return (
    <header
      className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-8 sm:py-4"
      style={{ background: 'var(--header)', borderBottom: '1px solid var(--line)' }}
    >
      <h1 className="m-0 flex shrink-0 items-center gap-2 text-lg font-bold sm:text-xl" style={{ color: 'var(--ink)' }}>
        <img src="/urosfera-logo.png" alt="Urosfera" className="h-7 w-7 rounded-full sm:h-8 sm:w-8" />
        Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
      </h1>
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {actions}
        <button
          onClick={toggle}
          aria-label="Temani almashtirish"
          className="btn-animated rounded-lg border px-3 py-2 text-sm"
          style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {backHref && (
          <button
            onClick={() => router.push(backHref)}
            className="btn-animated rounded-lg border px-3 py-2 text-sm sm:px-4"
            style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
          >
            ← {backLabel}
          </button>
        )}
      </div>
    </header>
  )
}
