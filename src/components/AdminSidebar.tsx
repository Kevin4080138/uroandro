'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

type NavItem = { href: string; label: string; tezOrada?: boolean }
type NavGroup = { id: string; icon: string; label: string; items: NavItem[] }

const GROUPS: NavGroup[] = [
  {
    id: 'foydalanuvchilar', icon: '👥', label: 'Foydalanuvchilar',
    items: [
      { href: '/admin/users', label: "Ro'yxat va aktivatsiya" },
      { href: '/admin/oquvchilar', label: "O'quvchilar reytingi", tezOrada: true },
      { href: '/admin/oqituvchilar', label: "O'qituvchilar", tezOrada: true },
      { href: '/admin/shifokorlar', label: 'Shifokorlar tasdiqlash', tezOrada: true },
    ],
  },
  {
    id: 'talim', icon: '📚', label: "Ta'lim",
    items: [
      { href: '/admin/darslar', label: 'Darslar tarkibi' },
      { href: '/admin/yonalishlari', label: "Yo'nalishlari", tezOrada: true },
      { href: '/admin/testbank', label: 'Test banki', tezOrada: true },
      { href: '/admin/sertifikatlar', label: 'Sertifikatlar', tezOrada: true },
    ],
  },
  {
    id: 'savdo', icon: '💳', label: "To'lovlar & Savdo",
    items: [
      { href: '/admin/tariflar', label: 'Tariflar', tezOrada: true },
      { href: '/admin/buyurtmalar', label: 'Buyurtmalar', tezOrada: true },
      { href: '/admin/obunalar', label: 'Obunalar', tezOrada: true },
      { href: '/admin/promokodlar', label: 'Promokodlar', tezOrada: true },
    ],
  },
  {
    id: 'kontent', icon: '📄', label: 'Kontent',
    items: [
      { href: '/admin/content', label: 'Protokollar & Kutubxona' },
      { href: '/admin/yangiliklar', label: "E'lonlar", tezOrada: true },
      { href: '/admin/faq', label: 'Savol-Javoblar', tezOrada: true },
      { href: '/admin/biz-haqimizda', label: 'Biz haqimizda', tezOrada: true },
    ],
  },
  {
    id: 'muloqot', icon: '💬', label: 'Muloqot',
    items: [
      { href: '/admin/fikrlar', label: 'Fikrlar' },
      { href: '/admin/push', label: 'Push bildirishnoma', tezOrada: true },
    ],
  },
  {
    id: 'tahlil', icon: '📈', label: 'Tahlil',
    items: [
      { href: '/admin/statistika', label: 'Statistika' },
      { href: '/admin/audit', label: 'Audit log' },
    ],
  },
]

function DropdownGroup({
  group, pathname, collapsed, onExpand,
}: {
  group: NavGroup; pathname: string; collapsed: boolean; onExpand: () => void
}) {
  const hasActive = group.items.some((i) => !i.tezOrada && pathname.startsWith(i.href))
  const [open, setOpen] = useState(false)

  useEffect(() => { if (collapsed) setOpen(false) }, [collapsed])

  const toggle = () => {
    if (collapsed) { onExpand(); setTimeout(() => setOpen(true), 220); return }
    setOpen((v) => !v)
  }

  return (
    <div>
      <button
        onClick={toggle}
        title={collapsed ? group.label : undefined}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: collapsed ? '10px 0' : '10px 14px',
          justifyContent: collapsed ? 'center' : 'space-between',
          background: 'transparent',
          color: hasActive ? 'var(--accent)' : 'var(--ink)',
          fontWeight: hasActive ? 600 : 400,
          border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14,
          transition: 'background .15s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{group.icon}</span>
          {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{group.label}</span>}
        </span>
        {!collapsed && (
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ fontSize: 11, color: 'var(--muted)', display: 'inline-block', flexShrink: 0 }}
          >▶</motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              margin: '2px 0 6px 20px',
              borderLeft: '1.5px solid var(--line)',
              paddingLeft: 14,
              display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              {group.items.map((item, i) => {
                const active = !item.tezOrada && pathname.startsWith(item.href)
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.16 }}
                  >
                    {item.tezOrada ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 10px', borderRadius: 8, fontSize: 12.5,
                        color: 'var(--muted)', opacity: 0.65,
                      }}>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{item.label}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '2px 7px', flexShrink: 0,
                          background: 'var(--line)', color: 'var(--muted)', borderRadius: 20,
                        }}>Tez orada</span>
                      </div>
                    ) : (
                      <Link href={item.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                          padding: '7px 10px', borderRadius: 8, fontSize: 13,
                          background: active ? 'var(--accent-soft)' : 'transparent',
                          color: active ? 'var(--accent)' : 'var(--ink-soft)',
                          fontWeight: active ? 600 : 400,
                          transition: 'background .15s',
                        }}>
                          {item.label}
                        </div>
                      </Link>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

  const W = mounted ? (collapsed ? 64 : 260) : 260

  // Drawer ichidagi kontent
  function DrawerInner() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 14px 13px', borderBottom: '1px solid var(--line)', flexShrink: 0,
        }}>
          <Link href="/admin/dashboard" style={{
            textDecoration: 'none', fontWeight: 800, fontSize: 18,
            color: 'var(--ink)', whiteSpace: 'nowrap', letterSpacing: '-0.3px',
          }}>
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginLeft: 6 }}>Admin</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20, padding: 4, lineHeight: 1 }}
          >✕</button>
        </div>
        <NavContent collapsed={false} />
        <SidebarFooter />
      </div>
    )
  }

  // Desktop sidebar kontent
  function DesktopInner() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          display: 'flex', alignItems: 'center', overflow: 'hidden',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '14px 10px 13px', borderBottom: '1px solid var(--line)', flexShrink: 0, gap: 6,
        }}>
          {!collapsed && (
            <Link href="/admin/dashboard" style={{
              textDecoration: 'none', fontWeight: 800, fontSize: 17,
              color: 'var(--ink)', whiteSpace: 'nowrap', letterSpacing: '-0.3px', minWidth: 0,
            }}>
              Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginLeft: 5 }}>Admin</span>
            </Link>
          )}
          <button
            onClick={toggleCollapse}
            title={collapsed ? 'Kengaytirish' : 'Toraytirish'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', padding: 6, borderRadius: 8, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, lineHeight: 1,
            }}
          >
            {collapsed ? '☰' : '‹'}
          </button>
        </div>
        <NavContent collapsed={collapsed} />
        {!collapsed && <SidebarFooter />}
      </div>
    )
  }

  function NavContent({ collapsed: c }: { collapsed: boolean }) {
    return (
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 8px 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Link href="/admin/dashboard" style={{ textDecoration: 'none' }} title={c ? 'Dashboard' : undefined}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: c ? '10px 0' : '10px 14px',
            justifyContent: c ? 'center' : 'flex-start',
            borderRadius: 10, fontSize: 14,
            background: pathname === '/admin/dashboard' ? 'var(--accent-soft)' : 'transparent',
            color: pathname === '/admin/dashboard' ? 'var(--accent)' : 'var(--ink)',
            fontWeight: pathname === '/admin/dashboard' ? 700 : 400,
            transition: 'background .15s',
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>🏠</span>
            {!c && <span style={{ whiteSpace: 'nowrap' }}>Dashboard</span>}
          </div>
        </Link>

        <div style={{ height: 1, background: 'var(--line)', margin: '6px 4px' }} />

        {GROUPS.map((group) => (
          <DropdownGroup
            key={group.id}
            group={group}
            pathname={pathname}
            collapsed={c}
            onExpand={toggleCollapse}
          />
        ))}
      </nav>
    )
  }

  function SidebarFooter() {
    return (
      <div style={{
        padding: '10px 14px', borderTop: '1px solid var(--line)', flexShrink: 0,
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
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 17, padding: 4, lineHeight: 1 }}
        >⇥</button>
      </div>
    )
  }

  return (
    <>
      {/* Mobil hamburger — drawer yopiq bo'lganda ko'rinadi */}
      {!mobileOpen && (
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          style={{
            position: 'fixed', top: 12, left: 12, zIndex: 110,
            width: 40, height: 40, background: 'var(--surface)',
            border: '1px solid var(--line)', borderRadius: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)', fontSize: 18, boxShadow: 'var(--shadow)',
          }}
        >☰</button>
      )}

      {/* Mobil overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden"
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 100 }}
          />
        )}
      </AnimatePresence>

      {/* Mobil drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            className="md:hidden"
            key="drawer"
            initial={{ x: -270 }} animate={{ x: 0 }} exit={{ x: -270 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', top: 0, left: 0, height: '100vh', width: 270, zIndex: 101,
              background: 'var(--surface)', borderRight: '1px solid var(--line)',
            }}
          >
            <DrawerInner />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        className="hidden md:block"
        animate={{ width: W }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{
          flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
          background: 'var(--surface)', borderRight: '1px solid var(--line)',
          overflow: 'hidden', zIndex: 30,
        }}
      >
        <DesktopInner />
      </motion.aside>
    </>
  )
}
