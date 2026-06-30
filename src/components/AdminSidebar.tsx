'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type NavItem = { href: string; label: string; tezOrada?: boolean }
type NavGroup = { id: string; svg: string; label: string; items: NavItem[] }

const GROUPS: NavGroup[] = [
  {
    id: 'foydalanuvchilar', label: 'Foydalanuvchilar',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    items: [
      { href: '/admin/users', label: "Ro'yxat va aktivatsiya" },
      { href: '/admin/oquvchilar', label: "O'quvchilar reytingi", tezOrada: true },
      { href: '/admin/oqituvchilar', label: "O'qituvchilar", tezOrada: true },
      { href: '/admin/shifokorlar', label: 'Shifokorlar tasdiqlash', tezOrada: true },
    ],
  },
  {
    id: 'talim', label: "Ta'lim",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    items: [
      { href: '/admin/darslar', label: 'Darslar tarkibi' },
      { href: '/admin/yonalishlari', label: "Yo'nalishlari", tezOrada: true },
      { href: '/admin/testbank', label: 'Test banki', tezOrada: true },
      { href: '/admin/sertifikatlar', label: 'Sertifikatlar', tezOrada: true },
    ],
  },
  {
    id: 'savdo', label: "To'lovlar & Savdo",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    items: [
      { href: '/admin/tariflar', label: 'Tariflar', tezOrada: true },
      { href: '/admin/buyurtmalar', label: 'Buyurtmalar', tezOrada: true },
      { href: '/admin/obunalar', label: 'Obunalar', tezOrada: true },
      { href: '/admin/promokodlar', label: 'Promokodlar', tezOrada: true },
    ],
  },
  {
    id: 'kontent', label: 'Kontent',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    items: [
      { href: '/admin/content', label: 'Protokollar & Kutubxona' },
      { href: '/admin/yangiliklar', label: "E'lonlar", tezOrada: true },
      { href: '/admin/faq', label: 'Savol-Javoblar', tezOrada: true },
      { href: '/admin/biz-haqimizda', label: 'Biz haqimizda', tezOrada: true },
    ],
  },
  {
    id: 'muloqot', label: 'Muloqot',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    items: [
      { href: '/admin/fikrlar', label: 'Fikrlar' },
      { href: '/admin/push', label: 'Push bildirishnoma', tezOrada: true },
    ],
  },
  {
    id: 'tahlil', label: 'Tahlil',
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    items: [
      { href: '/admin/statistika', label: 'Statistika' },
      { href: '/admin/audit', label: 'Audit log' },
    ],
  },
]

function SvgIcon({ svg, size = 18 }: { svg: string; size?: number }) {
  return (
    <span
      style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

function DropdownGroup({
  group, pathname, collapsed, onExpand,
}: {
  group: NavGroup; pathname: string; collapsed: boolean; onExpand: () => void
}) {
  const hasActive = group.items.some((i) => !i.tezOrada && pathname.startsWith(i.href))
  const [open, setOpen] = useState(hasActive)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>(hasActive ? 'auto' : 0)

  useEffect(() => {
    if (collapsed) { setOpen(false); setHeight(0) }
  }, [collapsed])

  const expand = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      setHeight(contentRef.current?.scrollHeight ?? 0)
      setTimeout(() => setHeight('auto'), 260)
    } else {
      setHeight(contentRef.current?.scrollHeight ?? 0)
      requestAnimationFrame(() => requestAnimationFrame(() => setHeight(0)))
    }
  }

  const toggle = () => {
    if (collapsed) {
      onExpand()
      setTimeout(() => expand(true), 240)
      return
    }
    expand(!open)
  }

  return (
    <div>
      <button
        onClick={toggle}
        title={collapsed ? group.label : undefined}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: 10, padding: collapsed ? '10px 0' : '9px 12px',
          justifyContent: collapsed ? 'center' : 'space-between',
          background: hasActive && !open ? 'var(--accent-soft)' : 'transparent',
          color: hasActive ? 'var(--accent)' : 'var(--ink-soft)',
          fontWeight: hasActive ? 600 : 400,
          border: 'none', borderRadius: 10, cursor: 'pointer',
          fontSize: 13.5, transition: 'background .15s, color .15s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <SvgIcon svg={group.svg} />
          {!collapsed && group.label}
        </span>
        {!collapsed && (
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            style={{ width: 13, height: 13, flexShrink: 0, transition: 'transform .22s ease', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', color: 'var(--muted)' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>

      {!collapsed && (
        <div
          ref={contentRef}
          style={{
            overflow: 'hidden',
            height: height === 'auto' ? 'auto' : height,
            transition: 'height .24s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <div style={{ margin: '2px 0 4px 18px', borderLeft: '1.5px solid var(--line)', paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {group.items.map((item) => {
              const active = !item.tezOrada && pathname.startsWith(item.href)
              return item.tezOrada ? (
                <div key={item.href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 10px', borderRadius: 8,
                  fontSize: 12.5, color: 'var(--muted)', opacity: 0.65,
                }}>
                  <span>{item.label}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px',
                    background: 'var(--line)', color: 'var(--muted)', borderRadius: 20,
                  }}>Tez orada</span>
                </div>
              ) : (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '7px 10px', borderRadius: 8, fontSize: 12.5,
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--ink-soft)',
                    fontWeight: active ? 600 : 400,
                    transition: 'background .15s, color .15s',
                  }}>
                    {item.label}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminNom, setAdminNom] = useState('')

  useEffect(() => {
    setMounted(true)
    setCollapsed(localStorage.getItem('admin-sidebar-collapsed') === '1')
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name').eq('id', user.id).single()
        .then(({ data }) => { if (data) setAdminNom(data.full_name ?? '') })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('admin-sidebar-collapsed', next ? '1' : '0')
  }

  const width = mounted ? (collapsed ? 64 : 248) : 248

  function Inner({ mobile = false }: { mobile?: boolean }) {
    const isCollapsed = mobile ? false : collapsed
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: '14px 12px 13px', borderBottom: '1px solid var(--line)', flexShrink: 0,
        }}>
          {!isCollapsed && (
            <Link href="/admin/dashboard" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 17, color: 'var(--ink)', letterSpacing: '-.3px' }}>
              Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginLeft: 6 }}>Admin</span>
            </Link>
          )}
          <button
            onClick={mobile ? () => setMobileOpen(false) : toggleCollapse}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', padding: 6, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'color .15s',
            }}
          >
            {mobile ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : isCollapsed ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Dashboard */}
          <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: isCollapsed ? '10px 0' : '9px 12px',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              borderRadius: 10, fontSize: 13.5,
              background: pathname === '/admin/dashboard' ? 'var(--accent-soft)' : 'transparent',
              color: pathname === '/admin/dashboard' ? 'var(--accent)' : 'var(--ink-soft)',
              fontWeight: pathname === '/admin/dashboard' ? 600 : 400,
              transition: 'background .15s, color .15s',
            }}
              title={isCollapsed ? 'Dashboard' : undefined}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18, flexShrink: 0 }}>
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              {!isCollapsed && 'Dashboard'}
            </div>
          </Link>

          {/* Separator */}
          <div style={{ height: 1, background: 'var(--line)', margin: '6px 4px' }} />

          {GROUPS.map((group) => (
            <DropdownGroup key={group.id} group={group} pathname={pathname} collapsed={isCollapsed} onExpand={toggleCollapse} />
          ))}
        </nav>

        {/* Footer — admin profil */}
        {!isCollapsed && (
          <div style={{
            padding: '10px 12px', borderTop: '1px solid var(--line)', flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--accent-soft)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>
              {adminNom ? adminNom[0].toUpperCase() : 'A'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {adminNom || 'Admin'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Admin</div>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/auth/login') }}
              title="Chiqish"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', padding: 6, borderRadius: 8,
                display: 'flex', alignItems: 'center', transition: 'color .15s',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 17, height: 17 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobil hamburger */}
      <button
        className="md:hidden"
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'fixed', top: 12, left: 12, zIndex: 110,
          width: 40, height: 40, background: 'var(--surface)',
          border: '1px solid var(--line)', borderRadius: 10, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)', boxShadow: 'var(--shadow)',
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 18, height: 18 }}>
          <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobil overlay */}
      <div
        className="md:hidden"
        onClick={() => setMobileOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 100,
          opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity .22s ease',
        }}
      />

      {/* Mobil drawer */}
      <aside
        className="md:hidden"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100vh', width: 260, zIndex: 101,
          background: 'var(--surface)', borderRight: '1px solid var(--line)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .24s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <Inner mobile />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:block"
        style={{
          width, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
          background: 'var(--surface)', borderRight: '1px solid var(--line)',
          transition: 'width .22s cubic-bezier(.4,0,.2,1)', overflow: 'hidden', zIndex: 30,
        }}
      >
        <Inner />
      </aside>
    </>
  )
}
