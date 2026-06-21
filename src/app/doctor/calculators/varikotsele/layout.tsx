'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { T } from './_theme'

const BASE = '/doctor/calculators/varikotsele'

const NAV = [
  { href: BASE, label: 'Bosh sahifa', icon: '🏠' },
  { href: `${BASE}/talim`, label: "Ta'lim moduli", icon: '🎓' },
  { href: `${BASE}/klinik-qaror`, label: 'Klinik qaror', icon: '🎯' },
  { href: `${BASE}/bemorlar-bazasi`, label: 'Bemorlar bazasi', icon: '🗄️' },
  { href: `${BASE}/statistika`, label: 'Statistik tahlil', icon: '📊' },
]

export default function VariCompareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <aside style={{
        width: 248, flexShrink: 0, background: T.deep, color: '#CFE3E4',
        display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '22px 22px 18px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="9" fill="#127C8A" />
              <path d="M13 9v9a7 7 0 0 0 14 0V9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="20" cy="30" r="4.5" stroke="#fff" strokeWidth="2.4" />
              <path d="M20 25.5V22" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>VariCompare</span>
          </div>
          <div style={{ fontSize: 11, color: '#7FA8AB', marginTop: 6, fontFamily: 'monospace', lineHeight: 1.4 }}>
            Varikotsele usullarini qiyosiy tahlil moduli
          </div>
        </div>

        <nav style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px',
                borderRadius: 10, fontSize: 14.5, fontWeight: active ? 600 : 500,
                background: active ? T.teal : 'transparent', color: active ? '#fff' : '#B5D0D2',
                textDecoration: 'none',
              }}>
                <span>{item.icon}</span><span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <button onClick={() => router.push('/doctor/dashboard')} style={{
            width: '100%', background: 'rgba(255,255,255,.08)', color: '#CFE3E4', border: 'none',
            borderRadius: 8, padding: '9px 12px', fontSize: 13, cursor: 'pointer',
          }}>
            ← Urosfera bosh sahifasi
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <main style={{ padding: '28px 26px 64px', maxWidth: 1080, margin: '0 auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
