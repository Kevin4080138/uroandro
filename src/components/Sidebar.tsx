'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV = [
  { href: '/doctor/dashboard', icon: '🏠', label: 'Bosh sahifa' },
  { href: '/doctor/patients', icon: '🧑‍🤝‍🧑', label: 'Bemorlar' },
  { href: '/doctor/murojaatlar', icon: '📨', label: 'Murojaatlar' },
  { href: '/doctor/protokollar', icon: '📋', label: 'Protokollar' },
  { href: '/doctor/calculators', icon: '🧮', label: 'Kalkulatorlar' },
  { href: '/doctor/kutubxona', icon: '📚', label: 'Kutubxona' },
  { href: '/doctor/qollanmalar', icon: '🌐', label: "Qo'llanmalar" },
]

function NavRoyxati({ pathname, yangiMurojaat, collapsed, onNavigate }: {
  pathname: string; yangiMurojaat: number; collapsed: boolean; onNavigate?: () => void
}) {
  return (
    <>
      {NAV.map((item) => {
        const active = pathname === item.href || (item.href !== '/doctor/dashboard' && pathname.startsWith(item.href))
        const badge = item.href === '/doctor/murojaatlar' && yangiMurojaat > 0 ? yangiMurojaat : 0
        return (
          <div key={item.href} className="group relative">
            <Link
              href={item.href}
              onClick={onNavigate}
              className="nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
              style={{
                background: active ? 'var(--accent-soft)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--ink-soft)',
                fontWeight: active ? 600 : 500,
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              <span style={{ fontSize: 18, position: 'relative' }}>
                {item.icon}
                {badge > 0 && collapsed && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-6px', minWidth: '16px', height: '16px', background: 'var(--danger)', color: '#fff', borderRadius: '999px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{badge}</span>
                )}
              </span>
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && badge > 0 && (
                <span style={{ minWidth: '20px', height: '20px', background: 'var(--danger)', color: '#fff', borderRadius: '999px', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>{badge}</span>
              )}
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
    </>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [yangiMurojaat, setYangiMurojaat] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCollapsed(localStorage.getItem('urosfera-sidebar') === 'collapsed')

    // yangi murojaatlar sonini hisoblash (navbat + javob berilmagan o'zimnikilar)
    const supabase = createClient()
    const hisobla = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('murojaatlar').select('doctor_id, target_doctor_id, holat, arxiv')
      const son = (data ?? []).filter((m: any) => !m.arxiv && (
        (!m.target_doctor_id && !m.doctor_id && m.holat === 'kutilmoqda') ||
        (m.doctor_id === user.id && m.holat === 'qabul_qilindi')
      )).length
      setYangiMurojaat(son)
    }
    hisobla()
    const interval = setInterval(hisobla, 30000)
    return () => clearInterval(interval)
  }, [pathname])

  // sahifa o'zgarganda mobil menyuni avtomatik yopish
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('urosfera-sidebar', next ? 'collapsed' : 'open')
  }

  const width = collapsed ? 64 : 220

  return (
    <>
      {/* Mobil hamburger tugmasi — faqat kichik ekranlarda ko'rinadi */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Menyuni ochish"
        className="md:hidden fixed flex items-center justify-center rounded-lg btn-animated"
        style={{
          top: 12, left: 12, width: 40, height: 40, zIndex: 110,
          background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)',
          boxShadow: 'var(--shadow)',
        }}
      >
        ☰
      </button>

      {/* Mobil orqa fon (drawer ochiq bo'lganda) */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 fade-in"
          style={{ background: 'rgba(0,0,0,.5)', zIndex: 100 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobil drawer — har doim to'liq (label bilan) ko'rinishda */}
      <aside
        className="md:hidden fixed top-0 left-0 flex h-screen flex-col transition-transform duration-200"
        style={{
          width: 240, background: 'var(--surface)', borderRight: '1px solid var(--line)', zIndex: 101,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="flex items-center justify-between px-3 py-4" style={{ borderBottom: '1px solid var(--line)' }}>
          <span className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Menyuni yopish"
            className="btn-animated flex items-center justify-center rounded-lg"
            style={{ width: 32, height: 32, color: 'var(--muted)' }}
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2.5 overflow-y-auto">
          <NavRoyxati pathname={pathname} yangiMurojaat={yangiMurojaat} collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </nav>
      </aside>

      {/* Desktop sidebar — md va undan katta ekranlarda */}
      <aside
        className="hidden md:flex sticky top-0 h-screen flex-shrink-0 flex-col transition-[width] duration-200"
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
          <NavRoyxati pathname={pathname} yangiMurojaat={yangiMurojaat} collapsed={collapsed} />
        </nav>
      </aside>
    </>
  )
}
