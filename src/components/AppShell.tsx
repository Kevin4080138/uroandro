'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { useTheme } from './ThemeProvider'
import { createClient } from '@/lib/supabase'

export function AppShell({ title, actions, children }: { title?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  const router = useRouter()
  const { theme, toggle } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setIsAdmin(data?.role === 'admin')
    })
  }, [])

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <Sidebar />
      <div className="min-w-0 flex-1">
        <header
          className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-2 py-3 pl-16 pr-4 md:gap-3 md:py-4 md:pl-6 md:pr-6"
          style={{ background: 'var(--header)', borderBottom: '1px solid var(--line)' }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => router.push('/doctor/dashboard')}
              aria-label="Bosh sahifaga qaytish"
              className="btn-animated flex shrink-0 items-center justify-center rounded-lg border"
              style={{ width: 36, height: 36, background: 'var(--surface-2)', borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
            >
              🏠
            </button>
            {title && <h1 className="m-0 truncate text-base font-bold md:text-lg">{title}</h1>}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-2.5">
            {isAdmin && (
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="btn-animated rounded-lg border px-3 py-2 text-sm md:px-4"
                style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
              >
                <span className="md:hidden">🛠️</span>
                <span className="hidden md:inline">🛠️ Admin paneli</span>
              </button>
            )}
            {actions}
            <button
              onClick={toggle}
              aria-label="Temani almashtirish"
              className="btn-animated rounded-lg border px-3 py-2 text-sm"
              style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <main className="fade-in">{children}</main>
      </div>
    </div>
  )
}
