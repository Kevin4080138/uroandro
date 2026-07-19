'use client'

import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'

// Yangi ochilgan, mazmuni hali to'ldirilmagan bo'limlar uchun umumiy ko'rinish.
//
// Bo'sh sahifa o'rniga rejalashtirilgan mavzular ro'yxati ko'rsatiladi: talaba
// bo'limda nima bo'lishini oldindan biladi va qaytib kelishga sabab bo'ladi.
// Mazmun tayyor bo'lgach bu komponent o'rniga haqiqiy sahifa qo'yiladi.

export type RejaBolim = {
  sarlavha: string
  punktlar: string[]
}

export function BolimTayyorlanmoqda({
  emoji, nom, tavsif, reja, izoh,
}: {
  emoji: string
  nom: string
  tavsif: string
  reja: RejaBolim[]
  izoh?: string
}) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px' }}>
        <div className="rise" style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>{emoji} {nom}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}>{tavsif}</p>
        </div>

        <div
          className="rise"
          style={{
            background: 'var(--surface)', border: '1px dashed var(--line)', borderRadius: '14px',
            padding: '16px 18px', marginBottom: '22px', animationDelay: '.05s',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.65 }}>
            <strong>⏳ Bo&apos;lim tayyorlanmoqda.</strong>{' '}
            {izoh ?? "Quyidagi mavzular ustida ish ketmoqda — tayyor bo'lgani sari shu yerda ochiladi."}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reja.map((b, i) => (
            <div
              key={b.sarlavha}
              className="rise"
              style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: '14px', padding: '16px 18px', animationDelay: `${0.08 + i * 0.04}s`,
              }}
            >
              <h2 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800 }}>{b.sarlavha}</h2>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {b.punktlar.map((p) => (
                  <li key={p} style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.55 }}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
