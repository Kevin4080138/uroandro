'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, GraduationCap, Wallet, FileText, MessageCircle, TrendingUp,
  UserCheck, School, Stethoscope, Video, LineChart, FolderTree, ListChecks, Award,
  Gem, ShoppingCart, CreditCard, Ticket, ClipboardList, Images, Newspaper,
  BookMarked, HelpCircle, Building2, MessageSquareText, Bell, BarChart3, Shield,
  LayoutDashboard, LogOut, X, Menu, ChevronRight, ChevronLeft, Flower2, Layers, type LucideIcon,
} from 'lucide-react'

type NavItem = { href: string; Icon: LucideIcon; label: string; tezOrada?: boolean }
type NavGroup = { id: string; Icon: LucideIcon; label: string; items: NavItem[] }

const GROUPS: NavGroup[] = [
  {
    id: 'foydalanuvchilar', Icon: Users, label: 'Foydalanuvchilar',
    items: [
      { href: '/admin/users', Icon: UserCheck, label: "Ro'yxat va aktivatsiya" },
      { href: '/admin/oquvchilar', Icon: GraduationCap, label: "O'quvchilar reytingi" },
      { href: '/admin/oqituvchilar', Icon: School, label: "O'qituvchilar", tezOrada: true },
      { href: '/admin/shifokorlar', Icon: Stethoscope, label: 'Shifokorlar tasdiqlash' },
    ],
  },
  {
    id: 'talim', Icon: GraduationCap, label: "Ta'lim",
    items: [
      { href: '/admin/darslar', Icon: Video, label: 'Darslar tarkibi (eski)' },
      { href: '/admin/urologiya-darslar', Icon: Layers, label: 'Urologiya darslari (3-Level)' },
      { href: '/admin/ginekologiya-darslar', Icon: Flower2, label: 'Ginekologiya darslari' },
      { href: '/admin/talabalar-nazorati', Icon: LineChart, label: 'Talabalar nazorati' },
      { href: '/admin/yonalishlari', Icon: FolderTree, label: "Yo'nalishlari", tezOrada: true },
      { href: '/admin/testbank', Icon: ListChecks, label: 'Test banki' },
      { href: '/admin/sertifikatlar', Icon: Award, label: 'Sertifikatlar' },
    ],
  },
  {
    id: 'savdo', Icon: Wallet, label: "To'lovlar & Savdo",
    items: [
      { href: '/admin/tariflar', Icon: Gem, label: 'Tariflar' },
      { href: '/admin/buyurtmalar', Icon: ShoppingCart, label: 'Buyurtmalar', tezOrada: true },
      { href: '/admin/obunalar', Icon: CreditCard, label: 'Obunalar' },
      { href: '/admin/promokodlar', Icon: Ticket, label: 'Promokodlar', tezOrada: true },
    ],
  },
  {
    id: 'kontent', Icon: FileText, label: 'Kontent',
    items: [
      { href: '/admin/content', Icon: ClipboardList, label: 'Protokollar & Kutubxona' },
      { href: '/admin/bannerlar', Icon: Images, label: 'Bannerlar & E\'lonlar' },
      { href: '/admin/maqolalar', Icon: Newspaper, label: 'Maqolalar' },
      { href: '/admin/adabiyotlar', Icon: BookMarked, label: 'Adabiyotlar & Darsliklar' },
      { href: '/admin/faq', Icon: HelpCircle, label: 'Savol-Javoblar' },
      { href: '/admin/biz-haqimizda', Icon: Building2, label: 'Biz haqimizda' },
    ],
  },
  {
    id: 'muloqot', Icon: MessageCircle, label: 'Muloqot',
    items: [
      { href: '/admin/fikrlar', Icon: MessageSquareText, label: 'Fikrlar' },
      { href: '/admin/push', Icon: Bell, label: 'Push bildirishnoma' },
    ],
  },
  {
    id: 'tahlil', Icon: TrendingUp, label: 'Tahlil',
    items: [
      { href: '/admin/statistika', Icon: BarChart3, label: 'Statistika' },
      { href: '/admin/audit', Icon: Shield, label: 'Audit log' },
    ],
  },
]

function DropdownGroup({ group, pathname, collapsed, open, onToggle, onExpand, badges = {} }: {
  group: NavGroup; pathname: string; collapsed: boolean
  open: boolean; onToggle: () => void; onExpand: () => void
  badges?: Record<string, number>
}) {
  const hasActive = group.items.some((i) => !i.tezOrada && pathname.startsWith(i.href))
  const groupBadge = group.items.reduce((sum, i) => sum + (badges[i.href] ?? 0), 0)

  const toggle = () => {
    if (collapsed) { onExpand(); setTimeout(() => onToggle(), 220); return }
    onToggle()
  }

  return (
    <div>
      <button onClick={toggle} title={collapsed ? group.label : undefined} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: collapsed ? '10px 0' : '10px 14px',
        justifyContent: collapsed ? 'center' : 'space-between',
        background: 'transparent',
        color: hasActive ? 'var(--accent)' : 'var(--ink)',
        fontWeight: hasActive ? 600 : 400,
        border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14,
        transition: 'background .15s',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <span style={{ display: 'flex', flexShrink: 0, position: 'relative' }}>
            <group.Icon size={20} strokeWidth={2} />
            {collapsed && groupBadge > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16,
                background: 'var(--danger)', color: '#fff', borderRadius: 10,
                fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
              }}>{groupBadge}</span>
            )}
          </span>
          {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{group.label}</span>}
        </span>
        {!collapsed && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {groupBadge > 0 && (
              <span style={{
                minWidth: 18, height: 18, background: 'var(--danger)', color: '#fff',
                borderRadius: 10, fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
              }}>{groupBadge}</span>
            )}
            <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}
              style={{ color: 'var(--muted)', display: 'inline-flex' }}><ChevronRight size={15} strokeWidth={2.4} /></motion.span>
          </span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && open && (
          <motion.div key="content"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ margin: '2px 0 6px 20px', borderLeft: '1.5px solid var(--line)', paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {group.items.map((item, i) => {
                const active = !item.tezOrada && pathname.startsWith(item.href)
                return (
                  <motion.div key={item.href}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.16 }}
                  >
                    {item.tezOrada ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', borderRadius: 8, fontSize: 12.5,
                        color: 'var(--muted)', opacity: 0.65,
                      }}>
                        <span style={{ display: 'flex', flexShrink: 0 }}><item.Icon size={15} strokeWidth={2} /></span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{item.label}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', flexShrink: 0, background: 'var(--line)', color: 'var(--muted)', borderRadius: 20 }}>Tez orada</span>
                      </div>
                    ) : (
                      <Link href={item.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '7px 10px', borderRadius: 8, fontSize: 13,
                          background: active ? 'var(--accent-soft)' : 'transparent',
                          color: active ? 'var(--accent)' : 'var(--ink-soft)',
                          fontWeight: active ? 600 : 400,
                          transition: 'background .15s',
                        }}>
                          <span style={{ display: 'flex', flexShrink: 0 }}><item.Icon size={15} strokeWidth={2} /></span>
                          <span style={{ flex: 1 }}>{item.label}</span>
                          {(badges[item.href] ?? 0) > 0 && (
                            <span style={{
                              minWidth: 18, height: 18, background: 'var(--danger)', color: '#fff',
                              borderRadius: 10, fontSize: 10, fontWeight: 700,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', flexShrink: 0,
                            }}>{badges[item.href]}</span>
                          )}
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
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [korilmaganFikrlar, setKorilmaganFikrlar] = useState(0)

  const toggleGroup = (id: string) => setOpenGroup((prev) => prev === id ? null : id)

  useEffect(() => {
    setMounted(true)
    setCollapsed(localStorage.getItem('admin-sidebar-collapsed') === '1')
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('full_name').eq('id', user.id).single()
        .then(({ data }) => { if (data) setAdminNom(data.full_name ?? '') })
    })
    supabase.from('fikrlar').select('id', { count: 'exact', head: true }).eq('korildi', false)
      .then(({ count }) => setKorilmaganFikrlar(count ?? 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const toggleCollapse = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem('admin-sidebar-collapsed', next ? '1' : '0')
  }

  const W = mounted ? (collapsed ? 64 : 260) : 260

  function NavContent({ collapsed: c }: { collapsed: boolean }) {
    return (
      <nav style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '8px 8px 4px', display: 'flex', flexDirection: 'column', gap: 2,
        scrollbarWidth: 'thin', scrollbarColor: 'var(--line) transparent',
      }}>
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
            <span style={{ display: 'flex', flexShrink: 0 }}><LayoutDashboard size={20} strokeWidth={2} /></span>
            {!c && <span style={{ whiteSpace: 'nowrap' }}>Dashboard</span>}
          </div>
        </Link>
        <div style={{ height: 1, background: 'var(--line)', margin: '6px 4px' }} />
        {GROUPS.map((group) => (
          <DropdownGroup
            key={group.id} group={group} pathname={pathname} collapsed={c}
            open={openGroup === group.id}
            onToggle={() => toggleGroup(group.id)}
            onExpand={toggleCollapse}
            badges={{ '/admin/fikrlar': korilmaganFikrlar }}
          />
        ))}
      </nav>
    )
  }

  function Footer({ c }: { c: boolean }) {
    return (
      <div style={{
        padding: c ? '10px 0' : '10px 14px',
        borderTop: '1px solid var(--line)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: c ? 'center' : 'flex-start', gap: 10,
      }}>
        <div title={c ? (adminNom || 'Admin') : undefined} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
          {adminNom ? adminNom[0].toUpperCase() : 'A'}
        </div>
        <AnimatePresence>
          {!c && (
            <motion.div key="footer-text"
              initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.16 }}
              style={{ flex: 1, overflow: 'hidden' }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminNom || 'Admin'}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Admin</div>
            </motion.div>
          )}
        </AnimatePresence>
        {!c && (
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/auth/login') }}
            title="Chiqish" style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, lineHeight: 1 }}><LogOut size={17} strokeWidth={2} /></button>
        )}
      </div>
    )
  }

  // Mobil drawer
  function DrawerInner() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 14px 13px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 18, color: 'var(--ink)', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginLeft: 6 }}>Admin</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, lineHeight: 1 }}><X size={20} strokeWidth={2} /></button>
        </div>
        <NavContent collapsed={false} />
        <Footer c={false} />
      </div>
    )
  }

  return (
    <>
      {/* Mobil hamburger */}
      {!mobileOpen && (
        <button className="md:hidden" onClick={() => setMobileOpen(true)} style={{
          position: 'fixed', top: 12, left: 12, zIndex: 110,
          width: 40, height: 40, background: 'var(--surface)',
          border: '1px solid var(--line)', borderRadius: 10, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--ink)', boxShadow: 'var(--shadow)',
        }}><Menu size={18} strokeWidth={2} /></button>
      )}

      {/* Mobil overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="md:hidden" key="overlay"
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
          <motion.aside className="md:hidden" key="drawer"
            initial={{ x: -270 }} animate={{ x: 0 }} exit={{ x: -270 }}
            transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
            style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: 270, zIndex: 101, background: 'var(--surface)', borderRight: '1px solid var(--line)' }}
          >
            <DrawerInner />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        className="hidden md:flex"
        animate={{ width: W }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{
          flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
          background: 'var(--surface)', borderRight: '1px solid var(--line)',
          overflow: 'hidden', zIndex: 30, flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Link href="/admin/dashboard" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            padding: collapsed ? '12px 0' : '12px 14px',
            borderBottom: '1px solid var(--line)',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start', gap: 10,
            transition: 'padding .22s',
          }}>
            <img src="/urosfera-logo.png" alt="Urosfera" style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  key="logo-text"
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18 }}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
                    Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500, marginLeft: 5, display: 'block', lineHeight: 1 }}>Admin</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        {/* Collapse tugmasi — logo ostida, markazda */}
        <button
          onClick={toggleCollapse}
          title={collapsed ? 'Kengaytirish' : 'Toraytirish'}
          style={{
            width: '100%', padding: '5px 0', flexShrink: 0,
            background: 'transparent', border: 'none',
            borderBottom: '1px solid var(--line)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--muted)', fontSize: 12,
            transition: 'background .15s',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {collapsed ? (
              <ChevronRight size={16} strokeWidth={2.2} />
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11 }}><ChevronLeft size={13} strokeWidth={2.2} /> Yopish</span>
            )}
          </span>
        </button>

        <NavContent collapsed={collapsed} />
        <Footer c={collapsed} />
      </motion.aside>
    </>
  )
}
