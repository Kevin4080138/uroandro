'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/doctor/dashboard', icon: '🏠', label: 'Bosh sahifa' },
  { href: '/doctor/patients', icon: '🧑‍🤝‍🧑', label: 'Bemorlar' },
  { href: '/doctor/murojaatlar', icon: '📨', label: 'Murojaatlar' },
  { href: '/doctor/protokollar', icon: '📋', label: 'Protokollar' },
  { href: '/doctor/calculators', icon: '🧮', label: 'Kalkulatorlar' },
  { href: '/doctor/kutubxona', icon: '📚', label: 'Kutubxona' },
  { href: '/doctor/qollanmalar', icon: '🌐', label: "Qo'llanmalar" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCollapsed(localStorage.getItem('urosfera-sidebar') === 'collapsed')
  }, [])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('urosfera-sidebar', next ? 'collapsed' : 'open')
  }

  const width = collapsed ? 64 : 220

  return (
    <aside
      className="sticky top-0 flex h-screen flex-shrink-0 flex-col transition-[width] duration-200"
      style={{ width: mounted ? width : 220, background: 'var(--surface)', borderRight: '1px solid var(--line)' }}
    >
      <div className="flex items-center justify-between px-3 py-4" style={{ borderBottom: '1px solid var(--line)' }}>
        {!collapsed && (
          <span className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
          </span>
        )}
        <button
          onClick={toggle}
          aria-label="Menyuni yopish/ochish"
          className="btn-animated flex items-center justify-center rounded-lg"
          style={{ width: 32, height: 32, color: 'var(--muted)' }}
        >
          {collapsed ? '☰' : '⮜'}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2.5">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/doctor/dashboard' && pathname.startsWith(item.href))
          return (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                className="nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
                style={{
                  background: active ? 'var(--accent-soft)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--ink-soft)',
                  fontWeight: active ? 600 : 500,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
              {collapsed && (
                <span
                  className="pointer-events-none absolute left-[60px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: 'var(--ink)', color: 'var(--bg)', zIndex: 50 }}
                >
                  {item.label}
                </span>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
