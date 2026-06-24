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
      style={{ width: mounted ? width : 220, background: 'var(--surface)', borderRight: '1px solid var(--line)', zIndex: 30 }}
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
                  className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  style={{ background: 'var(--ink)', color: 'var(--bg)', zIndex: 60, boxShadow: '0 4px 14px rgba(0,0,0,.25)' }}
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
