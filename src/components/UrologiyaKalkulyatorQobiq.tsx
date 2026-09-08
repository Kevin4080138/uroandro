'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'

export const uroInput = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
export const uroLabel = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }
export const uroKarta = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }

// Talaba qobig'i: shifokor sahifasidan farqli — bemor-panel, saqlash va
// shifokor navigatsiyasi yo'q; o'quv izohiga joy bor.
export function UrologiyaKalkulyatorQobiq({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const router = useRouter()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/kalkulyatorlar" backLabel="Kalkulyatorlar" />
      <main style={{ maxWidth: '820px', margin: '0 auto', padding: '24px 20px' }}>
        <button onClick={() => router.push('/student/kalkulyatorlar')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, marginBottom: '16px', fontSize: '13px' }}>
          ← Kalkulyatorlarga qaytish
        </button>
        <section className="rise" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: 'white', borderRadius: '18px', padding: '26px 28px', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>{title}</h1>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: .94, lineHeight: 1.6 }}>{subtitle}</p>
        </section>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

// "Nima o'rganasiz" — o'quv izohi (kartada emas, kalkulyator ichida ko'rinadi).
export function NimaOrganasiz({ children }: { children: ReactNode }) {
  return (
    <section className="rise" style={{ ...uroKarta, marginTop: '16px', borderLeft: '3px solid var(--accent)' }}>
      <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '8px' }}>Nima o‘rganasiz</div>
      <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{children}</div>
    </section>
  )
}

export function UroOgohlantirish({ children }: { children: ReactNode }) {
  return <p style={{ margin: '16px 0 0', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.55 }}>{children} Bu kalkulyator o‘quv va klinik yordamchi vosita; yakuniy qarorni mutaxassis qabul qiladi.</p>
}
