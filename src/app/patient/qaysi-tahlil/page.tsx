'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { SHIKOYATLAR, KATEGORIYALAR, type Tahlil } from '@/lib/qaysiTahlil'
import { TestTube, AlertTriangle, Siren, Stethoscope } from 'lucide-react'

export default function QaysiTahlilPage() {
  const router = useRouter()
  const [tanlangan, setTanlangan] = useState<Set<string>>(new Set())

  const toggle = (id: string) => setTanlangan((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  const tanlanganShikoyatlar = useMemo(() => SHIKOYATLAR.filter((s) => tanlangan.has(s.id)), [tanlangan])

  // Shoshilinch ogohlantirishlar
  const ogohlar = tanlanganShikoyatlar.filter((s) => s.shoshilinch && s.ogohlantirish).map((s) => s.ogohlantirish!) as string[]

  // Tahlillarni birlashtirish (nom bo'yicha takrorlanmasin)
  const tahlillar = useMemo(() => {
    const map = new Map<string, Tahlil>()
    for (const s of tanlanganShikoyatlar) for (const t of s.tahlillar) if (!map.has(t.nom)) map.set(t.nom, t)
    return Array.from(map.values())
  }, [tanlanganShikoyatlar])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}><TestTube size={24} strokeWidth={2} /> Qaysi tahlil kerak?</h2>
        <p className="rise" style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Shikoyatlaringizni belgilang — qanday tahlil topshirishingiz mumkinligi va nima uchun kerakligi ko&apos;rsatiladi.
        </p>

        {/* Ogohlantirish (doimiy) */}
        <div className="rise" style={{
          background: 'var(--warn-soft, #fff7ed)', border: '1px solid var(--warn, #f59e0b)', borderRadius: '12px',
          padding: '12px 14px', marginBottom: '22px', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.55,
          display: 'flex', alignItems: 'flex-start', gap: '8px',
        }}>
          <AlertTriangle size={15} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} /> <span>Bu <strong>tibbiy tashxis emas</strong> — faqat umumiy yo&apos;l-yo&apos;riq. Aniq tashxis va davolash uchun albatta <strong>shifokorga murojaat qiling</strong>.</span>
        </div>

        {/* Shikoyatlarni tanlash */}
        {KATEGORIYALAR.map((kat) => {
          const guruh = SHIKOYATLAR.filter((s) => s.kategoriya === kat)
          if (!guruh.length) return null
          return (
            <div key={kat} className="rise" style={{ marginBottom: '18px' }}>
              <p style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, margin: '0 0 8px' }}>{kat}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {guruh.map((s) => {
                  const faol = tanlangan.has(s.id)
                  return (
                    <button key={s.id} onClick={() => toggle(s.id)} className="soft-press"
                      style={{
                        background: faol ? 'var(--accent)' : 'var(--surface)', color: faol ? 'white' : 'var(--ink-soft)',
                        border: `1.5px solid ${faol ? 'var(--accent)' : 'var(--line)'}`, borderRadius: '999px',
                        padding: '8px 14px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                      }}>
                      {s.shoshilinch && <AlertTriangle size={13} strokeWidth={2} style={{ flexShrink: 0 }} />}{s.matn}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Natija */}
        {tanlangan.size > 0 && (
          <div style={{ marginTop: '26px' }}>
            {/* Shoshilinch ogohlantirishlar */}
            {ogohlar.length > 0 && (
              <div className="rise" style={{
                background: '#fef2f2', border: '1.5px solid #dc2626', borderRadius: '14px',
                padding: '16px 18px', marginBottom: '18px',
              }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#b91c1c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><Siren size={16} strokeWidth={2} /> Shoshilinch e&apos;tibor</div>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ogohlar.map((o, i) => (
                    <li key={i} style={{ fontSize: '13px', color: '#7f1d1d', lineHeight: 1.55 }}>{o}</li>
                  ))}
                </ul>
              </div>
            )}

            <h3 className="rise" style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 12px' }}>Tavsiya etiladigan tahlillar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tahlillar.map((t, i) => (
                <div key={i} className="rise" style={{
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                  padding: '14px 16px', animationDelay: `${Math.min(i * 0.05, 0.3)}s`,
                }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '7px' }}><TestTube size={16} strokeWidth={2} style={{ flexShrink: 0, color: 'var(--accent)' }} /> {t.nom}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{t.nima_uchun}</div>
                </div>
              ))}
            </div>

            {/* Shifokorga murojaat */}
            <div className="rise" style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
              padding: '18px', marginTop: '18px', textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.55 }}>
                Natijalarni to&apos;g&apos;ri talqin qilish va davolash uchun shifokorga murojaat qiling.
              </p>
              <button onClick={() => router.push('/patient/murojaat')} className="btn-animated soft-press" style={{
                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
                padding: '12px 26px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}>
                <Stethoscope size={16} strokeWidth={2} /> Shifokorga murojaat qilish →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
