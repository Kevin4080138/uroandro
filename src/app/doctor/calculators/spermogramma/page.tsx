'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla } from '@/lib/kalkulyatorSaqlash'
import { SPERMA_MEZONLARI as MEZONLAR, spermaTashxis as tashxisAniqla } from '@/lib/urologiyaHisoblash'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }

export default function SpermogrammaKalkulyator() {
  return (
    <Suspense fallback={null}>
      <SpermogrammaIchki />
    </Suspense>
  )
}

function SpermogrammaIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio').eq('id', bemorId).single().then(({ data }) => setBemor(data))
  }, [bemorId])

  const [qiymatlar, setQiymatlar] = useState<Record<string, string>>({})

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setQiymatlar((q) => ({ ...q, [key]: e.target.value }))

  const tuldi = MEZONLAR.every((m) => qiymatlar[m.key] !== undefined && qiymatlar[m.key] !== '')

  const natija = useMemo(() => {
    const res: Record<string, { qiymat: number; norma: boolean }> = {}
    for (const m of MEZONLAR) {
      const v = parseFloat(qiymatlar[m.key])
      if (Number.isFinite(v)) res[m.key] = { qiymat: v, norma: v >= m.min }
    }
    return res
  }, [qiymatlar])

  const tashxis = tuldi ? tashxisAniqla(natija) : null

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'spermogramma', sarlavha: 'WHO 2021 spermogramma',
      xulosa: tashxis ? tashxis.nom : '—',
      malumot: { qiymatlar, tashxis: tashxis?.nom },
    })
  }

  return (
    <AppShell title="WHO 2021 spermogramma">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemorId={bemorId} bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #0d9488, #22c55e)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>WHO 2021 spermogramma</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            Jahon sog&apos;liqni saqlash tashkiloti (<strong>WHO — World Health Organization</strong>) 2021-yilda nashr etilgan
            6-nashr qo&apos;llanmasiga (<em>WHO Laboratory Manual for the Examination and Processing of Human Semen</em>) asoslangan
            spermogramma ko&apos;rsatkichlarini baholash vositasi.
          </p>
        </div>

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px', marginBottom: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {MEZONLAR.map((m) => (
              <div key={m.key}>
                <label style={labelStyle}>{m.label} {m.birlik && `(${m.birlik})`}</label>
                <input style={inputStyle} type="number" step="0.1" value={qiymatlar[m.key] ?? ''} onChange={set(m.key)} placeholder={`min. ${m.min}`} />
              </div>
            ))}
          </div>
        </div>

        {!tuldi ? (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun barcha ko&apos;rsatkichlarni kiriting.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Har bir ko'rsatkich uchun karta */}
            <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px 20px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                Ko&apos;rsatkichlar tahlili
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {MEZONLAR.map((m) => {
                  const n = natija[m.key]
                  if (!n) return null
                  return (
                    <div key={m.key} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 12px', borderRadius: '10px', background: n.norma ? '#16a34a0d' : '#dc26260d',
                    }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600 }}>{m.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: n.norma ? '#16a34a' : '#dc2626' }}>
                          {n.qiymat} {m.birlik}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>(min. {m.min})</span>
                        <span style={{ fontSize: '14px' }}>{n.norma ? '✓' : '⚠'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Yakuniy taxminiy tashxis */}
            {tashxis && (
              <div className="rise" style={{
                background: 'var(--surface)', border: `2px solid ${tashxis.rang}33`, borderRadius: '16px', padding: '20px 24px',
              }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Taxminiy xulosa</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: tashxis.rang, margin: '4px 0 8px' }}>{tashxis.nom}</div>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{tashxis.tavsif}</p>
              </div>
            )}
          </div>
        )}

        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>WHO</strong> (World Health Organization — Jahon sog&apos;liqni saqlash tashkiloti) spermogramma me&apos;zonlarining
              eng so&apos;nggi nashri — 2021-yilda chiqqan 6-nashr. Bu nashrda ko&apos;rsatkichlarning pastki chegaralari (5-sentil) dunyo bo&apos;yicha fertil erkaklardan
              olingan keng tadqiqotlar asosida belgilangan.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>PR</strong> (Progressive motility — progressiv harakatchanlik) — to&apos;g&apos;ri chiziq yoki katta radiusli aylana bo&apos;yicha faol harakatlanuvchi spermatozoidlar.
              <strong style={{ color: 'var(--ink)' }}> NP</strong> (Non-progressive motility) — harakatlanadigan, lekin progressiv emas (joyida aylanadigan) spermatozoidlar.
            </p>
            <ul style={{ margin: '0 0 0 18px', padding: 0 }}>
              <li><strong>Oligozoospermiya</strong> — sperma konsentratsiyasi me&apos;yordan past (&lt;16 mln/mL)</li>
              <li><strong>Astenozoospermiya</strong> — harakatchanlik me&apos;yordan past (&lt;42%)</li>
              <li><strong>Teratozoospermiya</strong> — normal morfologiyali spermatozoidlar ulushi past (&lt;4%)</li>
              <li><strong>Azoospermiya</strong> — ejakulyatda sperma hujayralari umuman aniqlanmaydi</li>
              <li><strong>OAT-sindromi</strong> (Oligo-Astheno-Teratozoospermia) — uchala ko&apos;rsatkich birgalikda past</li>
            </ul>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: WHO Laboratory Manual for the Examination and Processing of Human Semen, 6th edition (2021). Bitta tahlil natijasi yakuniy xulosa uchun yetarli emas — odatda 2–3 oy ichida qayta tahlil tavsiya etiladi. Bu kalkulyator faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
