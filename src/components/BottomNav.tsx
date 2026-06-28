'use client'

import { usePathname, useRouter } from 'next/navigation'

const BANDLAR = [
  { icon: '🏠', label: 'Bosh sahifa', href: '/student/dashboard' },
  { icon: '🎓', label: 'Talim', href: '/student/darslar' },
  { icon: '🏆', label: 'Reyting', href: '/student/reyting' },
  { icon: '👤', label: 'Profil', href: '/student/profil' },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        background: 'var(--surface)', borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-around',
        padding: '8px 6px calc(8px + env(safe-area-inset-bottom))',
        boxShadow: '0 -2px 16px rgba(0,0,0,.08)',
      }}
    >
      {BANDLAR.map((b) => {
        const faol = pathname?.startsWith(b.href)
        return (
          <button
            key={b.href}
            onClick={() => router.push(b.href)}
            className="soft-press"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              background: 'none', border: 'none', cursor: 'pointer', flex: 1, padding: '5px 0',
              color: faol ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>{b.icon}</span>
            <span style={{ fontSize: '10.5px', fontWeight: faol ? 700 : 500 }}>{b.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
