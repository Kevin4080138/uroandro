'use client'

// Umumiy test mexanizmi — amaliy/USMLE/nazorat shu komponent ustida quriladi.
// Qattiq rejim (nazorat) fullscreen majburlaydi va oyna/tab almashtirishni aniqlaydi.
// Eslatma: brauzer OS darajasidagi almashtirishni bloklay olmaydi — bu jiddiy
// imtihon kafolati emas, faqat vijdonli talabani ushlab turadigan to'siq (T5).

import { useEffect, useMemo, useState } from 'react'
import { type TestSavoli, type UsmleSavoli } from '@/lib/talim/darslar'
import { type TestNatija } from './types'
import { BoshUlash } from './BoshUlash'

export function TestBlok({
  savollar,
  izohKorsat,
  vaqtDaqiqa,
  qaytaUrinishKorinsin,
  qattiqRejim,
  boshlashSarlavha,
  boshlashTugma,
  onTopshirish,
}: {
  savollar: (TestSavoli | UsmleSavoli)[]
  izohKorsat: boolean
  vaqtDaqiqa?: number
  qaytaUrinishKorinsin: boolean
  qattiqRejim?: boolean
  boshlashSarlavha: React.ReactNode
  boshlashTugma: string
  onTopshirish: (natija: TestNatija) => void | Promise<void>
}) {
  const [boshlandi, setBoshlandi] = useState(false)
  const [javoblar, setJavoblar] = useState<(number | null)[]>(Array(savollar.length).fill(null))
  const [topshirildi, setTopshirildi] = useState(false)
  const [qoldiSoniya, setQoldiSoniya] = useState(vaqtDaqiqa ? vaqtDaqiqa * 60 : 0)
  const [buzilishSoni, setBuzilishSoni] = useState(0)
  const [buzilishSababliYakunlandi, setBuzilishSababliYakunlandi] = useState(false)

  const tuldi = javoblar.every((v) => v !== null)
  const togriSon = useMemo(
    () => javoblar.reduce((s: number, v, i) => s + (v === savollar[i].togri ? 1 : 0), 0),
    [javoblar, savollar]
  )

  useEffect(() => {
    if (!boshlandi || topshirildi || !vaqtDaqiqa) return
    const interval = setInterval(() => {
      setQoldiSoniya((s) => {
        if (s <= 1) {
          clearInterval(interval)
          setTopshirildi(true)
          onTopshirish({ togriSon, jami: savollar.length })
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [boshlandi, topshirildi, vaqtDaqiqa, togriSon, savollar.length, onTopshirish])

  const javobBer = (i: number, val: number) => {
    if (topshirildi) return
    setJavoblar((arr) => arr.map((v, j) => (j === i ? val : v)))
  }

  const topshir = () => {
    setTopshirildi(true)
    onTopshirish({ togriSon, jami: savollar.length })
  }

  // Qattiq rejim — fullscreen majburlash va oyna/tab almashtirishni aniqlash.
  // Brauzer OS darajasida boshqa ilovaga o'tishni "bloklay" olmaydi, shu sabab
  // aniqlab, 1-marta ogohlantirib, 2-marta avtomatik yakunlaymiz.
  useEffect(() => {
    if (!qattiqRejim || !boshlandi || topshirildi) return

    const buzilish = () => {
      setBuzilishSoni((prev) => {
        const yangi = prev + 1
        if (yangi >= 2) {
          setBuzilishSababliYakunlandi(true)
          setTopshirildi(true)
          onTopshirish({ togriSon, jami: savollar.length, qoidabuzarlik: true })
        }
        return yangi
      })
    }

    const korinishOzgardi = () => { if (document.hidden) buzilish() }
    const fullscreenOzgardi = () => { if (!document.fullscreenElement) buzilish() }

    document.addEventListener('visibilitychange', korinishOzgardi)
    document.addEventListener('fullscreenchange', fullscreenOzgardi)
    return () => {
      document.removeEventListener('visibilitychange', korinishOzgardi)
      document.removeEventListener('fullscreenchange', fullscreenOzgardi)
    }
  }, [qattiqRejim, boshlandi, topshirildi, togriSon, savollar.length, onTopshirish])

  // Test tugagach (yoki sahifadan chiqilganda) fullscreen rejimidan chiqamiz.
  useEffect(() => {
    if (qattiqRejim && topshirildi && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
  }, [qattiqRejim, topshirildi])

  const boshla = () => {
    setBoshlandi(true)
    if (qattiqRejim) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    }
  }

  const qaytaUrinish = () => {
    setJavoblar(Array(savollar.length).fill(null))
    setTopshirildi(false)
    setQoldiSoniya(vaqtDaqiqa ? vaqtDaqiqa * 60 : 0)
    setBoshlandi(false)
    setBuzilishSoni(0)
    setBuzilishSababliYakunlandi(false)
  }

  if (savollar.length === 0) {
    return <BoshUlash matn="Bu bo'lim savollari tez orada qo'shiladi." />
  }

  if (!boshlandi) {
    return (
      <div className="rise" style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
        padding: '26px 28px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '18px' }}>{boshlashSarlavha}</div>
        <button onClick={boshla} className="btn-animated soft-press" style={{
          background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
          padding: '14px 26px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer',
        }}>
          {boshlashTugma}
        </button>
      </div>
    )
  }

  const foiz = Math.round((togriSon / savollar.length) * 100)
  const natijaRang = foiz >= 80 ? '#16a34a' : foiz >= 60 ? '#d97706' : '#dc2626'
  const daqiqa = Math.floor(qoldiSoniya / 60)
  const soniya = qoldiSoniya % 60

  return (
    <>
      {vaqtDaqiqa && !topshirildi && (
        <div className="rise" style={{
          marginBottom: '16px', textAlign: 'center', fontSize: '15px', fontWeight: 800,
          color: qoldiSoniya <= 60 ? '#dc2626' : 'var(--ink)',
        }}>
          ⏱ Qolgan vaqt: {daqiqa}:{soniya.toString().padStart(2, '0')}
        </div>
      )}

      {qattiqRejim && buzilishSoni === 1 && !topshirildi && (
        <div className="rise" style={{
          marginBottom: '16px', background: '#fff4e0', border: '1px solid #f5c069', borderRadius: '12px',
          padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#a86200', textAlign: 'center',
        }}>
          ⚠️ Diqqat! Siz testdan chiqib ketdingiz (oyna/tab almashtirildi yoki fullscreendan chiqildi).
          Yana takrorlansa, test avtomatik yakunlanadi.
        </div>
      )}

      {!topshirildi && (
        <div className="rise" style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 600 }}>
            <span>Javob berilgan: {javoblar.filter((v) => v !== null).length}/{savollar.length}</span>
            <span>{Math.round((javoblar.filter((v) => v !== null).length / savollar.length) * 100)}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '999px', background: 'var(--accent)', transition: 'width .25s ease',
              width: `${(javoblar.filter((v) => v !== null).length / savollar.length) * 100}%`,
            }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {savollar.map((s, i) => {
          const vinyetka = (s as UsmleSavoli).vinyetka
          return (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
            }}>
              {vinyetka && (
                <p style={{
                  margin: '0 0 12px', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-soft)',
                  background: 'var(--surface-2)', borderRadius: '8px', padding: '10px 12px', lineHeight: 1.6,
                }}>
                  {vinyetka}
                </p>
              )}
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
                  const togriJavob = izohKorsat && topshirildi && vi === s.togri
                  const notogriTanlandi = izohKorsat && topshirildi && tanlandi && vi !== s.togri
                  return (
                    <button
                      key={v}
                      onClick={() => javobBer(i, vi)}
                      disabled={topshirildi}
                      aria-pressed={tanlandi}
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
              {izohKorsat && topshirildi && (
                <p style={{
                  margin: '10px 0 0 34px', fontSize: '12.5px', color: 'var(--ink-soft)',
                  background: 'var(--surface-2)', borderRadius: '8px', padding: '8px 12px', lineHeight: 1.5,
                }}>
                  💡 {s.izoh}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {!topshirildi ? (
        <button
          onClick={topshir}
          disabled={!tuldi}
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
          {buzilishSababliYakunlandi && (
            <p style={{ margin: '0 0 12px', fontSize: '12.5px', fontWeight: 700, color: '#dc2626' }}>
              ⚠️ Test qoidabuzarlik (oyna/tab almashtirish) tufayli avtomatik yakunlandi.
            </p>
          )}
          <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Natijangiz</div>
          <div style={{ fontSize: '40px', fontWeight: 800, color: natijaRang, margin: '4px 0' }}>{togriSon} / {savollar.length}</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: natijaRang }}>{foiz}% to&apos;g&apos;ri</div>
          {qaytaUrinishKorinsin && (
            <button onClick={qaytaUrinish} className="soft-press" style={{
              marginTop: '18px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px',
              padding: '10px 18px', fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer',
            }}>
              ↺ Qayta urinish
            </button>
          )}
        </div>
      )}
    </>
  )
}
