'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { KALKULYATORLAR, KALK_KATEGORIYALARI as KATEGORIYALAR } from '@/lib/kalkulyatorlar'

export default function CalculatorsHubPage() {
  const router = useRouter()
  const [filtr, setFiltr] = useState<typeof KATEGORIYALAR[number]>('Hammasi')

  const royxat = filtr === 'Hammasi' ? KALKULYATORLAR : KALKULYATORLAR.filter((k) => k.kategoriya === filtr)
  const faolSoni = KALKULYATORLAR.filter((k) => k.faol).length

  return (
    <AppShell title="Kalkulatorlar">
      <div className="mx-auto max-w-[1080px] px-8 py-8">
        <div className="rise" style={{ marginBottom: '22px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Klinik kalkulyatorlar</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
            Urologiya va andrologiyada xalqaro standart hisoblangan{' '}
            <strong style={{ color: 'var(--ink)' }}>{KALKULYATORLAR.length}</strong> ta vosita —{' '}
            <strong style={{ color: 'var(--good)' }}>{faolSoni}</strong> tasi faol.
          </p>
        </div>

        {/* Kategoriya filtri */}
        <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', animationDelay: '.05s' }}>
          {KATEGORIYALAR.map((kat) => (
            <button
              key={kat}
              onClick={() => setFiltr(kat)}
              className="soft-press"
              style={{
                background: filtr === kat ? 'var(--accent)' : 'var(--surface-2)',
                color: filtr === kat ? 'white' : 'var(--ink-soft)',
                border: filtr === kat ? 'none' : '1px solid var(--line)',
                borderRadius: '999px', padding: '8px 16px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all .18s ease', whiteSpace: 'nowrap',
              }}
            >
              {kat}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {royxat.map((k, i) => (
            <div
              key={k.title}
              onClick={() => k.faol && router.push(`/doctor/calculators/${k.slug}`)}
              className={`rise ${k.faol ? 'lift' : ''}`}
              style={{
                animationDelay: `${Math.min(i * 0.05, 0.5)}s`,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '22px',
                cursor: k.faol ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform .2s ease, box-shadow .2s ease',
              }}
            >
              {!k.faol && (
                <span style={{
                  position: 'absolute', top: '14px', right: '14px', fontSize: '10.5px',
                  color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '999px',
                  padding: '3px 10px', fontWeight: 600, letterSpacing: '.02em',
                }}>
                  tez kunda
                </span>
              )}
              <div style={{
                width: '46px', height: '46px', borderRadius: '13px', background: k.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                marginBottom: '14px', boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                opacity: k.faol ? 1 : 0.65,
              }}>
                {k.icon}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '6px' }}>
                {k.kategoriya}
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15.5px', fontWeight: 700, opacity: k.faol ? 1 : 0.85 }}>{k.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12.5px', lineHeight: 1.5 }}>{k.desc}</p>
              {k.faol && (
                <div style={{ marginTop: '14px', fontSize: '12.5px', fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Ochish →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
