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
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ background: 'var(--header)', borderBottom: '1px solid var(--line)' }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/doctor/dashboard')}
              aria-label="Bosh sahifaga qaytish"
              className="btn-animated flex items-center justify-center rounded-lg border"
              style={{ width: 36, height: 36, background: 'var(--surface-2)', borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
            >
              🏠
            </button>
            {title && <h1 className="m-0 text-lg font-bold">{title}</h1>}
          </div>
          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="btn-animated rounded-lg border px-4 py-2 text-sm"
                style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
              >
                🛠️ Admin paneli
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
