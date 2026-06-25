'use client'

import { useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { SAVOLLAR, SAVOL_KATEGORIYALARI, savolQidir } from '@/lib/savollar'

const KATEGORIYA_IKON: Record<string, string> = {
  Umumiy: '🩺', Prostata: '🍈', 'Erkak salomatligi': '🧬', Tekshiruvlar: '🔬', Operatsiya: '🏥', 'Ilova haqida': '📱',
}

export default function SavollarPage() {
  const [filtr, setFiltr] = useState<string>('Hammasi')
  const [qidiruv, setQidiruv] = useState('')
  const [ochiq, setOchiq] = useState<number | null>(null)

  const royxat = useMemo(() => {
    const asosiy = filtr === 'Hammasi' ? SAVOLLAR : SAVOLLAR.filter((s) => s.kategoriya === filtr)
    return savolQidir(qidiruv, asosiy)
  }, [filtr, qidiruv])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>❓ Ko&apos;p beriladigan savollar</h2>
        <p className="rise" style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Urologik shikoyatlar, tekshiruvlar va davolanish bo&apos;yicha tez-tez so&apos;raladigan savollarga aniq javoblar.
        </p>

        <div className="rise" style={{ marginBottom: '16px', animationDelay: '.08s' }}>
          <input
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="Savol bo'yicha qidirish..."
            style={{
              width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
              borderRadius: '999px', padding: '11px 18px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap', animationDelay: '.1s' }}>
          {SAVOL_KATEGORIYALARI.map((kat) => (
            <button
              key={kat}
              onClick={() => setFiltr(kat)}
              className="soft-press"
              style={{
                background: filtr === kat ? 'var(--accent)' : 'var(--surface-2)',
                color: filtr === kat ? 'white' : 'var(--ink-soft)',
                border: filtr === kat ? 'none' : '1px solid var(--line)',
                borderRadius: '999px', padding: '7px 15px', fontSize: '12.5px', fontWeight: 600,
                cursor: 'pointer', transition: 'all .18s ease', whiteSpace: 'nowrap',
              }}
            >
              {kat !== 'Hammasi' && KATEGORIYA_IKON[kat]} {kat}
            </button>
          ))}
        </div>

        {royxat.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
            <p style={{ margin: 0 }}>Hech narsa topilmadi.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {royxat.map((s, i) => {
              const ochilgan = ochiq === i
              return (
                <div key={s.savol} className="rise" style={{
                  animationDelay: `${Math.min(i * 0.04, 0.3)}s`,
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setOchiq(ochilgan ? null : i)}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                      background: 'none', border: 'none', padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <span style={{ fontSize: '16px', flexShrink: 0 }}>{KATEGORIYA_IKON[s.kategoriya]}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{s.savol}</span>
                    </div>
                    <span className="chevron" style={{
                      flexShrink: 0, color: 'var(--muted)', fontSize: '13px',
                      transform: ochilgan ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease',
                    }}>▾</span>
                  </button>
                  {ochilgan && (
                    <div className="fade-in" style={{ padding: '0 18px 18px 18px' }}>
                      {s.javob.map((p, pi) => (
                        <p key={pi} style={{ margin: pi === 0 ? 0 : '10px 0 0', fontSize: '13.5px', lineHeight: 1.65, color: 'var(--ink-soft)' }}>{p}</p>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="rise" style={{
          marginTop: '24px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
          padding: '16px 20px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          ℹ️ Bu javoblar faqat umumiy ma&apos;lumot beradi va shaxsiy tashxis o&apos;rnini bosa olmaydi. Sizning aniq holatingiz bo&apos;yicha
          har doim shifokoringizga murojaat qiling.
        </div>
      </div>
    </div>
  )
}
