'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { QOLLANMALAR, QOLLANMA_KATEGORIYALARI } from '@/lib/qollanmalar'

const KATEGORIYA_RANGI: Record<string, string> = {
  Umumiy: 'linear-gradient(135deg, #475569, #94a3b8)',
  Andrologiya: 'linear-gradient(135deg, #7c3aed, #c026d3)',
  Prostata: 'linear-gradient(135deg, #2563eb, #0891b2)',
  Onkourologiya: 'linear-gradient(135deg, #dc2626, #f97316)',
  Urolitiaz: 'linear-gradient(135deg, #57534e, #a8a29e)',
  'Siydik pufagi': 'linear-gradient(135deg, #1d4ed8, #06b6d4)',
  Buyrak: 'linear-gradient(135deg, #0369a1, #38bdf8)',
  Pediatrik: 'linear-gradient(135deg, #16a34a, #84cc16)',
}

export default function QollanmalarPage() {
  const router = useRouter()
  const [filtr, setFiltr] = useState<string>('Hammasi')

  const royxat = filtr === 'Hammasi' ? QOLLANMALAR : QOLLANMALAR.filter((q) => q.kategoriya === filtr)

  return (
    <AppShell title="Qo'llanmalar">
      <div className="mx-auto max-w-[980px] px-8 py-8">
        <div className="rise" style={{ marginBottom: '22px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Klinik qo&apos;llanmalar</h2>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '13.5px' }}>
            Rasmiy xalqaro urologiya/andrologiya tashkilotlarining klinik qo&apos;llanmalariga havolalar —{' '}
            <strong style={{ color: 'var(--ink)' }}>{QOLLANMALAR.length}</strong> ta manba, kategoriyalar bo&apos;yicha tartiblangan.
          </p>
        </div>

        <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', animationDelay: '.05s' }}>
          {QOLLANMA_KATEGORIYALARI.map((kat) => (
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {royxat.map((q, i) => (
            <div
              key={q.nom}
              className="rise lift"
              style={{
                animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '11px',
                  background: KATEGORIYA_RANGI[q.kategoriya] ?? 'var(--accent)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800,
                  flexShrink: 0,
                }}>
                  {q.tashkilot.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <span style={{
                  fontSize: '10.5px', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '999px',
                  padding: '3px 10px', fontWeight: 600, whiteSpace: 'nowrap',
                }}>
                  {q.kategoriya}
                </span>
              </div>

              <div>
                <h3 style={{ margin: '0 0 3px 0', fontSize: '15px', fontWeight: 700 }}>{q.nom}</h3>
                <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--accent-2)', fontWeight: 600 }}>{q.tashkilot}</p>
              </div>

              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, flex: 1 }}>{q.tavsif}</p>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                <a
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="soft-press"
                  style={{
                    flex: 1, textAlign: 'center', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
                    borderRadius: '10px', padding: '8px 12px', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none',
                  }}
                >
                  Manbaga o&apos;tish ↗
                </a>
                {q.kalkulyator && (
                  <button
                    onClick={() => router.push(`/doctor/calculators/${q.kalkulyator}`)}
                    className="soft-press"
                    style={{
                      flex: 1, background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)',
                      borderRadius: '10px', padding: '8px 12px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    🧮 Kalkulyator
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
