'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { getCamuDars, type CamuDars } from '@/lib/camu/darslar'
import { BookOpen, Library, Target, type LucideIcon } from 'lucide-react'

type Tab = 'nazariya' | 'adabiyot' | 'testlar'

export default function CamuDarsPage() {
  const params = useParams()
  const router = useRouter()
  const [dars, setDars] = useState<CamuDars | null>(null)
  const [tab, setTab] = useState<Tab>('nazariya')
  const [testHolat, setTestHolat] = useState<'savol' | 'natija'>('savol')
  const [joriyTest, setJoriyTest] = useState(0)
  const [tanlangan, setTanlangan] = useState<number | null>(null)
  const [togrilar, setTogrilar] = useState(0)
  const [xatolar, setXatolar] = useState<{ savol: string; tanlagan: string; togri: string }[]>([])

  useEffect(() => {
    const slug = params.slug as string
    const topildi = getCamuDars(slug)
    if (!topildi) { router.replace('/student/camu'); return }
    setDars(topildi)
  }, [params.slug])

  if (!dars) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
    </div>
  )

  const TABS: { key: Tab; label: string; Icon: LucideIcon }[] = [
    { key: 'nazariya', label: 'Nazariya', Icon: BookOpen },
    { key: 'adabiyot', label: 'Adabiyot', Icon: Library },
    { key: 'testlar', label: 'Testlar', Icon: Target },
  ]

  const semestrRang = dars.semestr === 7 ? 'var(--accent)' : '#7c3aed'

  // Test logikasi
  const testlar = dars.testlar
  const joriy = testlar[joriyTest]
  const tugatildi = joriyTest >= testlar.length

  const javobBerish = (idx: number) => {
    if (tanlangan !== null) return
    setTanlangan(idx)
    if (idx === joriy.togri) {
      setTogrilar(t => t + 1)
    } else {
      setXatolar(x => [...x, {
        savol: joriy.savol,
        tanlagan: joriy.variantlar[idx],
        togri: joriy.variantlar[joriy.togri],
      }])
    }
  }

  const keyingisi = () => {
    setTanlangan(null)
    setJoriyTest(j => j + 1)
  }

  const qaytaBoshlash = () => {
    setJoriyTest(0)
    setTanlangan(null)
    setTogrilar(0)
    setXatolar([])
    setTestHolat('savol')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/camu" backLabel="CAMU bo'limi" />

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px 20px' }}>

        {/* Sarlavha */}
        <div className="rise" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
              background: semestrRang + '22', color: semestrRang,
            }}>
              {dars.semestr}-semestr · {dars.n}-mavzu
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              🏥 {dars.klinik}s + 🔬 {dars.amaliy}s = {dars.klinik + dars.amaliy} soat
            </span>
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.35, margin: 0 }}>
            {dars.icon} {dars.sarlavha}
          </h1>
        </div>

        {/* Tab navigatsiya */}
        <div className="rise" style={{
          display: 'flex', gap: '6px', marginBottom: '20px',
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '12px', padding: '4px', animationDelay: '.04s',
        }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '9px 6px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '12.5px', transition: 'all .18s',
                background: tab === t.key ? semestrRang : 'transparent',
                color: tab === t.key ? '#fff' : 'var(--muted)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              <t.Icon size={14} strokeWidth={2} /> {t.label}
            </button>
          ))}
        </div>

        {/* NAZARIYA */}
        {tab === 'nazariya' && (
          <div
            className="rise prose"
            style={{ animationDelay: '.06s', lineHeight: 1.75 }}
            dangerouslySetInnerHTML={{ __html: dars.nazariya }}
          />
        )}

        {/* ADABIYOT */}
        {tab === 'adabiyot' && (
          <div className="rise" style={{ display: 'flex', flexDirection: 'column', gap: '10px', animationDelay: '.06s' }}>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 6px' }}>
              Bu mavzu bo&apos;yicha tavsiya etilgan asosiy adabiyotlar:
            </p>
            {dars.adabiyot.map((a, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                  background: semestrRang + '20', color: semestrRang,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                }}>
                  📗
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '4px' }}>{a.sarlavha}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    {a.muallif}{a.yil ? ` · ${a.yil}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TESTLAR */}
        {tab === 'testlar' && (
          <div className="rise" style={{ animationDelay: '.06s' }}>
            {!tugatildi ? (
              <>
                {/* Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                    Savol {joriyTest + 1} / {testlar.length}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--good)', fontWeight: 700 }}>
                    ✓ {togrilar}
                  </span>
                </div>
                <div style={{ height: '6px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', marginBottom: '20px' }}>
                  <div style={{
                    height: '100%', borderRadius: '999px', transition: 'width .3s',
                    width: `${(joriyTest / testlar.length) * 100}%`,
                    background: semestrRang,
                  }} />
                </div>

                {/* Savol */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                  padding: '20px', marginBottom: '14px',
                }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                    {joriy.savol}
                  </p>
                </div>

                {/* Variantlar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {joriy.variantlar.map((v, i) => {
                    const togri = i === joriy.togri
                    const tanladi = i === tanlangan
                    let bg = 'var(--surface)'
                    let border = '1px solid var(--line)'
                    let rang = 'var(--ink)'
                    if (tanlangan !== null) {
                      if (togri) { bg = 'var(--good)18'; border = '2px solid var(--good)'; rang = 'var(--good)' }
                      else if (tanladi) { bg = 'var(--danger)18'; border = '2px solid var(--danger)'; rang = 'var(--danger)' }
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => javobBerish(i)}
                        style={{
                          background: bg, border, borderRadius: '12px', padding: '14px 16px',
                          cursor: tanlangan !== null ? 'default' : 'pointer',
                          textAlign: 'left', fontSize: '13.5px', fontWeight: 600, color: rang,
                          display: 'flex', gap: '10px', alignItems: 'center', transition: 'all .15s',
                        }}
                      >
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                          background: tanlangan !== null && togri ? 'var(--good)' : tanladi ? 'var(--danger)' : 'var(--surface-2)',
                          color: tanlangan !== null && (togri || tanladi) ? '#fff' : 'var(--muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '11px', fontWeight: 800,
                        }}>
                          {['A', 'B', 'C', 'D'][i]}
                        </span>
                        {v}
                      </button>
                    )
                  })}
                </div>

                {/* Izoh + Keyingi */}
                {tanlangan !== null && (
                  <div>
                    <div style={{
                      background: 'var(--accent)12', border: '1px solid var(--accent)44',
                      borderRadius: '12px', padding: '14px 16px', marginBottom: '12px',
                    }}>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                        💡 <strong>Izoh:</strong> {joriy.izoh}
                      </p>
                    </div>
                    <button
                      onClick={keyingisi}
                      style={{
                        width: '100%', background: semestrRang, color: '#fff', border: 'none',
                        borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Keyingisi →
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Natija */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>
                  {togrilar === testlar.length ? '🏆' : togrilar >= testlar.length * 0.7 ? '✅' : '📝'}
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
                  {togrilar}/{testlar.length} to&apos;g&apos;ri
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>
                  {togrilar === testlar.length ? 'Mukammal natija! 🎉' : togrilar >= testlar.length * 0.7 ? 'Yaxshi natija!' : 'Yana bir bor takrorlang'}
                </p>

                {xatolar.length > 0 && (
                  <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--danger)', marginBottom: '10px' }}>
                      ❌ Xato berilgan savollar:
                    </p>
                    {xatolar.map((x, i) => (
                      <div key={i} style={{
                        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                        padding: '12px 14px', marginBottom: '8px', textAlign: 'left',
                      }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 6px' }}>{x.savol}</p>
                        <p style={{ fontSize: '12px', color: 'var(--danger)', margin: '0 0 3px' }}>❌ Siz: {x.tanlagan}</p>
                        <p style={{ fontSize: '12px', color: 'var(--good)', margin: 0 }}>✓ To&apos;g&apos;ri: {x.togri}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={qaytaBoshlash}
                  style={{
                    background: semestrRang, color: '#fff', border: 'none', borderRadius: '12px',
                    padding: '13px 32px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  🔄 Qayta boshlash
                </button>
              </div>
            )}
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  )
}
