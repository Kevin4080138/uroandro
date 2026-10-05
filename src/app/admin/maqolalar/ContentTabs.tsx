'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  ['/admin/maqolalar', 'Maqolalar'],
  ['/admin/maqolalar/telegram', 'Telegram postlar'],
  ['/admin/maqolalar/quizlar', 'Quizlar'],
  ['/admin/maqolalar/rejalar', 'Rejalashtirish'],
] as const

export function ContentTabs() {
  const pathname = usePathname()
  return <nav aria-label="Kontent bo‘limlari" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
    {tabs.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}
      style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', fontSize: 13, fontWeight: 700,
        textDecoration: 'none', background: pathname === href ? 'var(--accent)' : 'var(--surface)',
        color: pathname === href ? '#fff' : 'var(--ink)' }}>{label}</Link>)}
  </nav>
}
