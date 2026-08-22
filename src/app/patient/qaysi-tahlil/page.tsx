'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { SHIKOYATLAR, KATEGORIYALAR } from '@/lib/qaysiTahlil'
import { TestTube, AlertTriangle, Siren, Stethoscope, Info } from 'lucide-react'

type NatijaTahlil = { nom: string; nima_uchun: string; birlamchi: boolean }

export default function QaysiTahlilPage() {
  const router = useRouter()
  const [tanlangan, setTanlangan] = useState<Set<string>>(new Set())
  const [ochiqIzoh, setOchiqIzoh] = useState<Set<string>>(new Set())

  const toggle = (id: string) => setTanlangan((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  const izohToggle = (nom: string) => setOchiqIzoh((p) => { const n = new Set(p); n.has(nom) ? n.delete(nom) : n.add(nom); return n })

  const tanlanganShikoyatlar = useMemo(() => SHIKOYATLAR.filter((s) => tanlangan.has(s.id)), [tanlangan])

  const ogohlar = tanlanganShikoyatlar.filter((s) => s.shoshilinch && s.ogohlantirish).map((s) => s.ogohlantirish!) as string[]

  // Tahlillarni birlashtirish. Har shikoyatning BIRINCHI tahlili — birlamchi (asosiy).
  // Bir tahlil biror shikoyatda birlamchi bo'lsa — birlamchi hisoblanadi. Birlamchilar oldinda.
  const tahlillar = useMemo<NatijaTahlil[]>(() => {
    const map = new Map<string, NatijaTahlil>()
    for (const s of tanlanganShikoyatlar) {
      s.tahlillar.forEach((t, idx) => {
        const bor = map.get(t.nom)
        if (!bor) map.set(t.nom, { ...t, birlamchi: idx === 0 })
        else if (idx === 0) bor.birlamchi = true
      })
    }
    return Array.from(map.values()).sort((a, b) => Number(b.birlamchi) - Number(a.birlamchi))
  }, [tanlanganShikoyatlar])

  const birlamchiSoni = tahlillar.filter((t) => t.birlamchi).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[640px] px-4 py-5">
        <h2 className="rise" style={{ margin: '0 0 5px', fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}><TestTube size={20} strokeWidth={2} /> Qaysi tahlil kerak?</h2>
        <p className="rise" style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: '12.5px', lineHeight: 1.5, animationDelay: '.05s' }}>
          Shikoyatingizni belgilang — mos tahlillar va har biri nima uchun kerakligi chiqadi.
        </p>

        {/* Ogohlantirish */}
        <div className="rise" style={{
          background: 'var(--warn-soft, #fff7ed)', border: '1px solid var(--warn, #f59e0b)', borderRadius: '10px',
          padding: '10px 12px', marginBottom: '18px', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5,
          display: 'flex', alignItems: 'flex-start', gap: '7px',
        }}>
          <AlertTriangle size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} /> <span>Bu <strong>tashxis emas</strong> — umumiy yo&apos;l-yo&apos;riq. Aniq tashxis uchun <strong>shifokorga murojaat qiling</strong>.</span>
        </div>

        {/* Shikoyatlarni tanlash */}
        {KATEGORIYALAR.map((kat) => {
          const guruh = SHIKOYATLAR.filter((s) => s.kategoriya === kat)
          if (!guruh.length) return null
          return (
            <div key={kat} className="rise" style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '10.5px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, margin: '0 0 7px' }}>{kat}</p>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                {guruh.map((s) => {
                  const faol = tanlangan.has(s.id)
                  return (
                    <button key={s.id} onClick={() => toggle(s.id)} className="soft-press"
                      style={{
                        background: faol ? 'var(--accent)' : 'var(--surface)', color: faol ? 'white' : 'var(--ink-soft)',
                        border: `1.5px solid ${faol ? 'var(--accent)' : 'var(--line)'}`, borderRadius: '999px',
                        padding: '7px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                        display: 'inline-flex', alignItems: 'center', gap: '5px', lineHeight: 1.3,
                      }}>
                      {s.shoshilinch && <AlertTriangle size={12} strokeWidth={2} style={{ flexShrink: 0 }} />}{s.matn}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Natija */}
        {tanlangan.size > 0 && (
          <div style={{ marginTop: '22px' }}>
            {/* Shoshilinch ogohlantirishlar */}
            {ogohlar.length > 0 && (
              <div className="rise" style={{
                background: '#fef2f2', border: '1.5px solid #dc2626', borderRadius: '12px',
                padding: '14px 16px', marginBottom: '16px',
              }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#b91c1c', marginBottom: '7px', display: 'flex', alignItems: 'center', gap: '6px' }}><Siren size={15} strokeWidth={2} /> Shoshilinch e&apos;tibor</div>
                <ul style={{ margin: 0, paddingLeft: '17px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {ogohlar.map((o, i) => (
                    <li key={i} style={{ fontSize: '12.5px', color: '#7f1d1d', lineHeight: 1.5 }}>{o}</li>
                  ))}
                </ul>
              </div>
            )}

            <h3 className="rise" style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px' }}>Tavsiya etiladigan tahlillar</h3>
            <p className="rise" style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 12px', lineHeight: 1.5 }}>
              {birlamchiSoni > 0 ? <><strong style={{ color: 'var(--accent)' }}>Asosiy</strong> tahlillardan boshlang. </> : null}
              Izoh uchun <Info size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: '-1px' }} /> tugmasini bosing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {tahlillar.map((t, i) => {
                const ochiq = ochiqIzoh.has(t.nom)
                return (
                  <div key={i} className="rise" style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderLeft: `3px solid ${t.birlamchi ? 'var(--accent)' : 'var(--line)'}`,
                    borderRadius: '12px', padding: '12px 14px', animationDelay: `${Math.min(i * 0.04, 0.3)}s`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <TestTube size={15} strokeWidth={2} style={{ flexShrink: 0, color: t.birlamchi ? 'var(--accent)' : 'var(--muted)' }} />
                          <span>{t.nom}</span>
                          <span style={{
                            fontSize: '10px', fontWeight: 700, padding: '1px 7px', borderRadius: '6px',
                            background: t.birlamchi ? 'var(--accent-soft, rgba(37,99,235,0.12))' : 'var(--surface-2)',
                            color: t.birlamchi ? 'var(--accent)' : 'var(--muted)',
                          }}>{t.birlamchi ? 'Asosiy' : 'Qo\'shimcha'}</span>
                        </div>
                      </div>
                      <button onClick={() => izohToggle(t.nom)} aria-label="Izoh" className="soft-press" style={{
                        flexShrink: 0, background: ochiq ? 'var(--accent)' : 'var(--surface-2)',
                        border: '1px solid var(--line)', borderRadius: '8px', width: '30px', height: '30px',
                        cursor: 'pointer', color: ochiq ? 'white' : 'var(--muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Info size={15} strokeWidth={2} />
                      </button>
                    </div>
                    {ochiq && (
                      <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: '9px', paddingTop: '9px', borderTop: '1px dashed var(--line)' }}>
                        {t.nima_uchun}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Shifokorga murojaat */}
            <div className="rise" style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
              padding: '16px', marginTop: '16px', textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 11px', fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>
                Natijalarni to&apos;g&apos;ri talqin qilish va davolash uchun shifokorga murojaat qiling.
              </p>
              <button onClick={() => router.push('/patient/murojaat')} className="btn-animated soft-press" style={{
                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
                padding: '12px 24px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}>
                <Stethoscope size={15} strokeWidth={2} /> Shifokorga murojaat qilish →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
