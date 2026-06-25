'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { darsTop } from '@/lib/talim/darslar'

export default function DarsDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const supabase = createClient()
  const dars = darsTop(slug)

  const [testBoshlandi, setTestBoshlandi] = useState(false)
  const [javoblar, setJavoblar] = useState<(number | null)[]>(dars ? Array(dars.test.length).fill(null) : [])
  const [topshirildi, setTopshirildi] = useState(false)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)

  const tuldi = javoblar.every((v) => v !== null)
  const togriSon = useMemo(() => {
    if (!dars) return 0
    return javoblar.reduce((s: number, v, i) => s + (v === dars.test[i].togri ? 1 : 0), 0)
  }, [javoblar, dars])

  if (!dars) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/student/darslar" backLabel="Darslar" />
        <div className="mx-auto max-w-[760px] px-8 py-12">
          <p>Dars topilmadi.</p>
        </div>
      </div>
    )
  }

  const javobBer = (i: number, val: number) => {
    if (topshirildi) return
    setJavoblar((arr) => arr.map((v, j) => (j === i ? val : v)))
  }

  const topshir = async () => {
    setTopshirildi(true)
    setSaqlanmoqda(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('talim_natijalari').insert({
        student_id: user.id,
        dars_slug: dars.slug,
        dars_nomi: dars.sarlavha,
        togri_son: togriSon,
        jami_savol: dars.test.length,
        foiz: Math.round((togriSon / dars.test.length) * 100),
      })
    }
    setSaqlanmoqda(false)
  }

  const qaytaUrinish = () => {
    setJavoblar(Array(dars.test.length).fill(null))
    setTopshirildi(false)
  }

  const foiz = Math.round((togriSon / dars.test.length) * 100)
  const natijaRang = foiz >= 80 ? '#16a34a' : foiz >= 60 ? '#d97706' : '#dc2626'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/darslar" backLabel="Darslar" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <div className="rise" style={{
          background: 'linear-gradient(135deg, #2563eb, #0891b2)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '24px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '.04em' }}>{dars.kategoriya}</span>
          <h1 style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: 800, lineHeight: 1.3 }}>{dars.sarlavha}</h1>
          <p style={{ margin: '10px 0 0', fontSize: '13.5px', opacity: 0.92 }}>⏱ {dars.daqiqa} daqiqa o&apos;qish · {dars.test.length} savollik test</p>
        </div>

        {!testBoshlandi ? (
          <>
            {dars.bolimlar.map((b, i) => (
              <div key={i} className="rise" style={{
                animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                padding: '20px 24px', marginBottom: '14px',
              }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: 'var(--accent)' }}>{b.sarlavha}</h3>
                {b.matn.map((p, pi) => (
                  <p key={pi} style={{ margin: pi === 0 ? 0 : '10px 0 0', fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-soft)' }}>{p}</p>
                ))}
              </div>
            ))}

            <div className="rise" style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
              padding: '18px 22px', marginBottom: '20px',
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Manbalar</h3>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dars.manbalar.map((m) => (
                  <li key={m} style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>{m}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setTestBoshlandi(true)}
              className="btn-animated soft-press"
              style={{
                width: '100%', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
                padding: '16px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              ✓ Darsni o&apos;qib bo&apos;ldim — Testni boshlash →
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {dars.test.map((s, i) => (
                <div key={i} className="rise" style={{
                  animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
                }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '7px', background: 'var(--accent-soft)', color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0,
                    }}>{i + 1}</span>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{s.savol}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '34px' }}>
                    {s.variantlar.map((v, vi) => {
                      const tanlandi = javoblar[i] === vi
                      const togriJavob = topshirildi && vi === s.togri
                      const notogriTanlandi = topshirildi && tanlandi && vi !== s.togri
                      return (
                        <button
                          key={v}
                          onClick={() => javobBer(i, vi)}
                          disabled={topshirildi}
                          style={{
                            textAlign: 'left',
                            border: togriJavob ? '1px solid #16a34a' : notogriTanlandi ? '1px solid #dc2626' : tanlandi ? '1px solid var(--accent)' : '1px solid var(--line)',
                            background: togriJavob ? '#16a34a1a' : notogriTanlandi ? '#dc26261a' : tanlandi ? 'var(--accent-soft)' : 'var(--surface-2)',
                            color: 'var(--ink)',
                            borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontWeight: 600,
                            cursor: topshirildi ? 'default' : 'pointer',
                          }}
                        >
                          {v} {togriJavob && ' ✓'} {notogriTanlandi && ' ✗'}
                        </button>
                      )
                    })}
                  </div>
                  {topshirildi && (
                    <p style={{
                      margin: '10px 0 0 34px', fontSize: '12.5px', color: 'var(--ink-soft)',
                      background: 'var(--surface-2)', borderRadius: '8px', padding: '8px 12px', lineHeight: 1.5,
                    }}>
                      💡 {s.izoh}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {!topshirildi ? (
              <button
                onClick={topshir}
                disabled={!tuldi || saqlanmoqda}
                className="btn-animated soft-press"
                style={{
                  width: '100%', marginTop: '20px', background: tuldi ? 'var(--accent)' : 'var(--surface-2)',
                  color: tuldi ? 'white' : 'var(--muted)', border: 'none', borderRadius: '12px',
                  padding: '16px', fontSize: '15px', fontWeight: 700, cursor: tuldi ? 'pointer' : 'not-allowed',
                }}
              >
                Javoblarni topshirish
              </button>
            ) : (
              <div className="rise" style={{
                marginTop: '20px', background: 'var(--surface)', border: `2px solid ${natijaRang}33`, borderRadius: '16px',
                padding: '24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Natijangiz</div>
                <div style={{ fontSize: '40px', fontWeight: 800, color: natijaRang, margin: '4px 0' }}>{togriSon} / {dars.test.length}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: natijaRang }}>{foiz}% to&apos;g&apos;ri</div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '18px', flexWrap: 'wrap' }}>
                  <button onClick={qaytaUrinish} className="soft-press" style={{
                    background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px',
                    padding: '10px 18px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer',
                  }}>
                    ↺ Qayta urinish
                  </button>
                  <button onClick={() => router.push('/student/darslar')} className="soft-press" style={{
                    background: 'var(--accent)', border: 'none', borderRadius: '10px', color: 'white',
                    padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                  }}>
                    Boshqa dars →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
