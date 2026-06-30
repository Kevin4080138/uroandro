'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type NavItem = {
  href: string
  icon: string
  label: string
  tezOrada?: boolean
}

type NavGroup = {
  id: string
  icon: string
  label: string
  items: NavItem[]
}

const GROUPS: NavGroup[] = [
  {
    id: 'foydalanuvchilar',
    icon: '👥',
    label: 'Foydalanuvchilar',
    items: [
      { href: '/admin/users', icon: '👤', label: "Ro'yxat va aktivatsiya" },
      { href: '/admin/oquvchilar', icon: '🎓', label: "O'quvchilar reytingi", tezOrada: true },
      { href: '/admin/oqituvchilar', icon: '👨‍🏫', label: "O'qituvchilar", tezOrada: true },
      { href: '/admin/shifokorlar', icon: '👨‍⚕️', label: 'Shifokorlar tasdiqlash', tezOrada: true },
    ],
  },
  {
    id: 'talim',
    icon: '📚',
    label: "Ta'lim",
    items: [
      { href: '/admin/darslar', icon: '🎥', label: 'Darslar tarkibi' },
      { href: '/admin/yonalishlari', icon: '🗂️', label: "Yo'nalishlari", tezOrada: true },
      { href: '/admin/testbank', icon: '❓', label: 'Test banki', tezOrada: true },
      { href: '/admin/sertifikatlar', icon: '🏅', label: 'Sertifikatlar', tezOrada: true },
    ],
  },
  {
    id: 'savdo',
    icon: '💰',
    label: "To'lovlar & Savdo",
    items: [
      { href: '/admin/tariflar', icon: '💎', label: 'Tariflar', tezOrada: true },
      { href: '/admin/buyurtmalar', icon: '🛒', label: 'Buyurtmalar', tezOrada: true },
      { href: '/admin/obunalar', icon: '💳', label: 'Obunalar', tezOrada: true },
      { href: '/admin/promokodlar', icon: '🎟️', label: 'Promokodlar', tezOrada: true },
    ],
  },
  {
    id: 'kontent',
    icon: '📄',
    label: 'Kontent',
    items: [
      { href: '/admin/content', icon: '📋', label: 'Protokollar & Kutubxona' },
      { href: '/admin/yangiliklar', icon: '📢', label: "E'lonlar", tezOrada: true },
      { href: '/admin/faq', icon: '❔', label: 'Savol-Javoblar (FAQ)', tezOrada: true },
      { href: '/admin/biz-haqimizda', icon: '🏥', label: 'Biz haqimizda', tezOrada: true },
    ],
  },
  {
    id: 'muloqot',
    icon: '💬',
    label: 'Muloqot',
    items: [
      { href: '/admin/fikrlar', icon: '💭', label: 'Fikrlar' },
      { href: '/admin/push', icon: '🔔', label: 'Push bildirishnoma', tezOrada: true },
    ],
  },
  {
    id: 'tahlil',
    icon: '📈',
    label: 'Tahlil',
    items: [
      { href: '/admin/statistika', icon: '📊', label: 'Statistika' },
      { href: '/admin/audit', icon: '🛡️', label: 'Audit log' },
    ],
  },
]

function groupHasActive(group: NavGroup, pathname: string) {
  return group.items.some((item) => pathname.startsWith(item.href))
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const [adminNom, setAdminNom] = useState('')

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved) setCollapsed(saved === '1')

    // Har bir guruhni avtomatik ochish — agar ichida aktiv link bo'lsa
    const auto: Record<string, boolean> = {}
    GROUPS.forEach((g) => { auto[g.id] = groupHasActive(g, pathname) })
    setOpenGroups(auto)

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
    if (next) setOpenGroups({})
  }

  const toggleGroup = (id: string) => {
    if (collapsed) { setCollapsed(false); localStorage.setItem('admin-sidebar-collapsed', '0') }
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const width = mounted ? (collapsed ? 64 : 240) : 240

  function SidebarContent({ mobile = false }: { mobile?: boolean }) {
    const isCollapsed = mobile ? false : collapsed
    return (
      <>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: '14px 12px', borderBottom: '1px solid var(--line)', flexShrink: 0,
        }}>
          {!isCollapsed && (
            <Link href="/admin/dashboard" style={{ textDecoration: 'none', fontSize: '17px', fontWeight: 800, color: 'var(--ink)' }}>
              Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, marginLeft: '6px' }}>Admin</span>
            </Link>
          )}
          {!mobile && (
            <button onClick={toggleCollapse} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
              fontSize: '16px', padding: '4px', borderRadius: '6px', lineHeight: 1,
            }}>
              {isCollapsed ? '☰' : '⮜'}
            </button>
          )}
          {mobile && (
            <button onClick={() => setMobileOpen(false)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
              fontSize: '16px', padding: '4px', borderRadius: '6px', marginLeft: 'auto',
            }}>✕</button>
          )}
        </div>

        {/* Dashboard tugmasi */}
        <div style={{ padding: '8px 8px 4px' }}>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: isCollapsed ? '10px' : '10px 12px',
              borderRadius: '10px', justifyContent: isCollapsed ? 'center' : 'flex-start',
              background: pathname === '/admin/dashboard' ? 'var(--accent-soft)' : 'transparent',
              color: pathname === '/admin/dashboard' ? 'var(--accent)' : 'var(--ink-soft)',
              fontWeight: pathname === '/admin/dashboard' ? 700 : 500,
              fontSize: '14px', transition: 'background .15s',
            }}>
              <span style={{ fontSize: '18px' }}>🏠</span>
              {!isCollapsed && <span>Dashboard</span>}
            </div>
          </Link>
        </div>

        {/* Guruhlar */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {GROUPS.map((group) => {
            const open = openGroups[group.id] ?? false
            const hasActive = groupHasActive(group, pathname)
            return (
              <div key={group.id}>
                {/* Guruh sarlavhasi */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    gap: '10px', padding: isCollapsed ? '10px' : '9px 12px',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    background: hasActive && !open ? 'var(--accent-soft)' : 'transparent',
                    color: hasActive ? 'var(--accent)' : 'var(--ink-soft)',
                    fontWeight: hasActive ? 700 : 500,
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    fontSize: '14px', transition: 'background .15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>{group.icon}</span>
                    {!isCollapsed && <span>{group.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <span style={{ fontSize: '11px', color: 'var(--muted)', transition: 'transform .2s', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                  )}
                </button>

                {/* Dropdown items */}
                {!isCollapsed && open && (
                  <div style={{ marginLeft: '12px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '2px solid var(--line)', paddingLeft: '12px' }}>
                    {group.items.map((item) => (
                      item.tezOrada ? (
                        <div key={item.href} style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '7px 10px', borderRadius: '8px',
                          color: 'var(--muted)', fontSize: '13px', opacity: 0.6,
                        }}>
                          <span style={{ fontSize: '14px' }}>{item.icon}</span>
                          <span style={{ flex: 1 }}>{item.label}</span>
                          <span style={{ fontSize: '10px', background: 'var(--line)', padding: '2px 6px', borderRadius: '20px', fontWeight: 600, color: 'var(--muted)' }}>Tez orada</span>
                        </div>
                      ) : (
                        <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '7px 10px', borderRadius: '8px',
                            background: isActive(item.href) ? 'var(--accent-soft)' : 'transparent',
                            color: isActive(item.href) ? 'var(--accent)' : 'var(--ink-soft)',
                            fontWeight: isActive(item.href) ? 700 : 400,
                            fontSize: '13px', transition: 'background .15s',
                          }}>
                            <span style={{ fontSize: '14px' }}>{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Admin profil */}
        {!isCollapsed && adminNom && (
          <div style={{
            padding: '12px 14px', borderTop: '1px solid var(--line)',
            display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0,
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--accent-soft)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '13px', flexShrink: 0,
            }}>
              {adminNom[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminNom}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Admin</div>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/auth/login') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '16px', padding: '4px' }}
              title="Chiqish"
            >⇥</button>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {/* Mobil hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden"
        style={{
          position: 'fixed', top: 12, left: 12, zIndex: 110,
          width: 40, height: 40, background: 'var(--surface)',
          border: '1px solid var(--line)', borderRadius: '10px',
          color: 'var(--ink)', fontSize: '18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow)',
        }}
      >☰</button>

      {/* Mobil overlay */}
      {mobileOpen && (
        <div
          className="md:hidden"
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 100 }}
        />
      )}

      {/* Mobil drawer */}
      <aside
        className="md:hidden"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100vh', width: 260,
          background: 'var(--surface)', borderRight: '1px solid var(--line)',
          zIndex: 101, display: 'flex', flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .2s ease',
        }}
      >
        <SidebarContent mobile />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex"
        style={{
          width, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
          background: 'var(--surface)', borderRight: '1px solid var(--line)',
          flexDirection: 'column', transition: 'width .2s ease', overflow: 'hidden', zIndex: 30,
        }}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
