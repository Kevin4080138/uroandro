'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla } from '@/lib/kalkulyatorSaqlash'

const SAVOLLAR = [
  {
    matn: 'Jinsiy aloq paytida eyakulyatsiyani kechiktirishni qanchalik qiyin deb bilasiz?',
    variantlar: ['Juda qiyin emas', 'Sal qiyin', "O'rtacha qiyin", 'Qiyin', 'Juda qiyin'],
  },
  {
    matn: 'Jinsiy aloq paytida xohlagan vaqtdan oldin eyakulyatsiya bo\'ladimi?',
    variantlar: ['Deyarli hech qachon', 'Kamdan-kam (yarmidan kamida)', 'Ba\'zan (~yarmida)', "Ko'pincha (yarmidan ko'pida)", 'Deyarli har doim/har doim'],
  },
  {
    matn: 'Jinsiy aloq paytida juda oz qo\'zg\'alish bilan eyakulyatsiya bo\'ladimi?',
    variantlar: ['Deyarli hech qachon', 'Kamdan-kam', 'Ba\'zan', "Ko'pincha", 'Deyarli har doim/har doim'],
  },
  {
    matn: 'Xohlagan vaqtdan oldin eyakulyatsiya bo\'lganligi uchun xafalik sezasizmi?',
    variantlar: ['Umuman yo\'q', 'Ozgina', "O'rtacha", 'Kuchli', 'Juda kuchli'],
  },
  {
    matn: 'Hamkoringiz eyakulyatsiyaning ertaroq bo\'lishidan norozi deb qanchаlik xavotir olasiz?',
    variantlar: ['Umuman yo\'q', 'Ozgina', "O'rtacha", 'Kuchli', 'Juda kuchli'],
  },
]

function daraja(jami: number) {
  if (jami <= 8) return { nom: 'Erta eyakulyatsiya yo\'q', rang: '#16a34a' }
  if (jami <= 10) return { nom: 'Chegaraviy holat', rang: '#eab308' }
  return { nom: 'Erta eyakulyatsiya aniqlanди', rang: '#dc2626' }
}

export default function PEDTPage() {
  return <Suspense fallback={null}><PEDTIchki /></Suspense>
}

function PEDTIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio').eq('id', bemorId).single().then(({ data }) => setBemor(data))
  }, [bemorId])

  const [javoblar, setJavoblar] = useState<(number | null)[]>(Array(5).fill(null))

  const tuldi = javoblar.every(v => v !== null)
  const jami = useMemo(() => javoblar.reduce((s: number, v) => s + (v ?? 0), 0), [javoblar])
  const nat = daraja(jami)

  const javobBer = (i: number, val: number) => setJavoblar(arr => arr.map((v, j) => j === i ? val : v))
  const qaytaBoshla = () => setJavoblar(Array(5).fill(null))

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'pedt', sarlavha: 'PEDT',
      xulosa: `Jami: ${jami} — ${nat.nom}`,
      malumot: { javoblar, jami },
    })
  }

  return (
    <AppShell title="PEDT — Erta eyakulyatsiya diagnostikasi">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemorId={bemorId} bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #0891b2, #6366f1)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>PEDT — Erta Eyakulyatsiya Diagnostik Testi</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>PEDT</strong> (Premature Ejaculation Diagnostic Tool) — 5 savollik validatsiya qilingan anketa.
            EAU qo&apos;llanmasida erta eyakulyatsiyani standartlashtirilgan skrining uchun tavsiya etilgan.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {SAVOLLAR.map((s, i) => (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '7px', background: 'var(--accent-soft)',
                  color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 800, flexShrink: 0,
                }}>{i + 1}</span>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{s.matn}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '34px' }}>
                {s.variantlar.map((v, vi) => (
                  <button
                    key={v}
                    onClick={() => javobBer(i, vi)}
                    className="soft-press"
                    style={{
                      border: javoblar[i] === vi ? 'none' : '1px solid var(--line)',
                      background: javoblar[i] === vi ? 'var(--accent)' : 'var(--surface-2)',
                      color: javoblar[i] === vi ? 'white' : 'var(--ink-soft)',
                      borderRadius: '999px', padding: '6px 13px', fontSize: '12.5px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s',
                    }}
                  >
                    {v} <span style={{ opacity: 0.7 }}>({vi})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{
          marginTop: '22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px 26px',
        }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun barcha 5 savolga javob bering.</p>
          ) : (
            <>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Jami ball (0–20)</div>
              <div style={{ fontSize: '44px', fontWeight: 800, color: nat.rang, lineHeight: 1.1 }}>{jami}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: nat.rang, marginTop: '2px' }}>{nat.nom}</div>

              <div style={{ marginTop: '16px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                  <div style={{ flex: 8, background: '#16a34a22' }} />
                  <div style={{ flex: 2, background: '#eab30822' }} />
                  <div style={{ flex: 10, background: '#dc262622' }} />
                </div>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px',
                  width: `${(jami / 20) * 100}%`, background: nat.rang, transition: 'width .3s',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--muted)', marginTop: '6px' }}>
                <span>0–8 EE yo&apos;q</span><span>9–10 chegaraviy</span><span>11–20 EE bor</span>
              </div>

              {jami >= 9 && (
                <div style={{
                  marginTop: '14px', padding: '12px 16px', borderRadius: '10px',
                  background: nat.rang + '15', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5,
                }}>
                  ⚠️ <strong style={{ color: nat.rang }}>PEDT ≥ 9</strong> — erta eyakulyatsiya ehtimoli yuqori.
                  DSM-5 mezoni bo&apos;yicha klinik baholash va psikoseksologik maslahat tavsiya etiladi.
                </div>
              )}

              <button onClick={qaytaBoshla} className="soft-press" style={{
                marginTop: '14px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px',
                padding: '9px 18px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer',
              }}>
                ↺ Qaytadan boshlash
              </button>
            </>
          )}
        </div>

        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>PEDT</strong> — 2007-yilda Symonds T va boshqlar tomonidan ishlab chiqilgan va validatsiya qilingan.
              5 ta savol, har biri 0–4 ball. Jami 0–20 ball.
            </p>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li><strong style={{ color: '#16a34a' }}>0–8</strong>: Erta eyakulyatsiya yo&apos;q</li>
              <li><strong style={{ color: '#eab308' }}>9–10</strong>: Chegaraviy holat</li>
              <li><strong style={{ color: '#dc2626' }}>≥11</strong>: Erta eyakulyatsiya ehtimoli yuqori</li>
            </ul>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Symonds T et al. J Sex Med 2007; 4:1260. EAU Guidelines on Sexual and Reproductive Health 2023.
              Faqat skrining vositasi — klinik tashxis shifokor tomonidan belgilanadi.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
