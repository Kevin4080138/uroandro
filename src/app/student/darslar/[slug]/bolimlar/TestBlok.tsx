'use client'

// Umumiy test mexanizmi — amaliy/USMLE/nazorat shu komponent ustida quriladi.
// Qattiq rejim (nazorat) fullscreen majburlaydi va oyna/tab almashtirishni aniqlaydi.
// Eslatma: brauzer OS darajasidagi almashtirishni bloklay olmaydi — bu jiddiy
// imtihon kafolati emas, faqat vijdonli talabani ushlab turadigan to'siq (T5).

import { useEffect, useMemo, useState } from 'react'
import { type TestSavoli, type UsmleSavoli } from '@/lib/talim/darslar'
import { type TestNatija } from './types'
import { BoshUlash } from './BoshUlash'
import { Sheet } from '@/components/Sheet'

// Izoh: pastdan chiquvchi Sheet (true) yoki har savol tagida inline matn (false).
const SHEET_IZOH = true

export function TestBlok({
  savollar,
  izohKorsat,
  vaqtDaqiqa,
  qaytaUrinishKorinsin,
  qattiqRejim,
  boshlashSarlavha,
  boshlashTugma,
  onTopshirish,
  avtomatikBoshla,
}: {
  savollar: (TestSavoli | UsmleSavoli)[]
  izohKorsat: boolean
  vaqtDaqiqa?: number
  qaytaUrinishKorinsin: boolean
  qattiqRejim?: boolean
  boshlashSarlavha: React.ReactNode
  boshlashTugma: string
  onTopshirish: (natija: TestNatija) => void | Promise<void>
  avtomatikBoshla?: boolean
}) {
  const [boshlandi, setBoshlandi] = useState(!!avtomatikBoshla)
  const [javoblar, setJavoblar] = useState<(number | null)[]>(Array(savollar.length).fill(null))
  const [topshirildi, setTopshirildi] = useState(false)
  const [qoldiSoniya, setQoldiSoniya] = useState(vaqtDaqiqa ? vaqtDaqiqa * 60 : 0)
  const [buzilishSoni, setBuzilishSoni] = useState(0)
  const [buzilishSababliYakunlandi, setBuzilishSababliYakunlandi] = useState(false)
  const [izohSavol, setIzohSavol] = useState<number | null>(null)

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
          onTopshirish({ togriSon, jami: savollar.length, javoblar })
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [boshlandi, topshirildi, vaqtDaqiqa, togriSon, savollar.length, onTopshirish, javoblar])

  const javobBer = (i: number, val: number) => {
    if (topshirildi) return
    setJavoblar((arr) => arr.map((v, j) => (j === i ? val : v)))
  }

  const topshir = () => {
    setTopshirildi(true)
    onTopshirish({ togriSon, jami: savollar.length, javoblar })
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
          onTopshirish({ togriSon, jami: savollar.length, qoidabuzarlik: true, javoblar })
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
  }, [qattiqRejim, boshlandi, topshirildi, togriSon, savollar.length, onTopshirish, javoblar])

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
  const natijaRang = foiz >= 80 ? 'var(--good)' : foiz >= 60 ? 'var(--warn)' : 'var(--danger)'
  const daqiqa = Math.floor(qoldiSoniya / 60)
  const soniya = qoldiSoniya % 60

  return (
    <>
      {vaqtDaqiqa && !topshirildi && (
        <div className="rise" style={{
          marginBottom: '16px', textAlign: 'center', fontSize: '15px', fontWeight: 800,
          color: qoldiSoniya <= 60 ? 'var(--danger)' : 'var(--ink)',
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
                        border: togriJavob ? '1px solid var(--good)' : notogriTanlandi ? '1px solid var(--danger)' : tanlandi ? '1px solid var(--accent)' : '1px solid var(--line)',
                        background: togriJavob ? 'color-mix(in srgb, var(--good) 10%, transparent)' : notogriTanlandi ? 'color-mix(in srgb, var(--danger) 10%, transparent)' : tanlandi ? 'var(--accent-soft)' : 'var(--surface-2)',
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
                SHEET_IZOH ? (
                  <button
                    onClick={() => setIzohSavol(i)}
                    className="soft-press"
                    style={{
                      margin: '10px 0 0 34px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                      fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                      color: javoblar[i] === s.togri ? 'var(--good)' : 'var(--accent)',
                      background: 'var(--surface-2)', border: '1px solid var(--line)',
                      borderRadius: '999px', padding: '6px 13px',
                    }}
                  >
                    💡 Izohni ko&apos;rish
                  </button>
                ) : (
                  <p style={{
                    margin: '10px 0 0 34px', fontSize: '12.5px', color: 'var(--ink-soft)',
                    background: 'var(--surface-2)', borderRadius: '8px', padding: '8px 12px', lineHeight: 1.5,
                  }}>
                    💡 {s.izoh}
                  </p>
                )
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
            <p style={{ margin: '0 0 12px', fontSize: '12.5px', fontWeight: 700, color: 'var(--danger)' }}>
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

      {SHEET_IZOH && (
        <Sheet
          ochiq={izohSavol !== null}
          onYopish={() => setIzohSavol(null)}
          sarlavha={izohSavol !== null ? `Savol ${izohSavol + 1} · izoh` : undefined}
        >
          {izohSavol !== null && (() => {
            const s = savollar[izohSavol]
            const javob = javoblar[izohSavol]
            const togriMi = javob === s.togri
            const vinyetka = (s as UsmleSavoli).vinyetka
            return (
              <>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '12px',
                  fontSize: '11px', fontWeight: 800, borderRadius: '999px', padding: '4px 11px',
                  color: togriMi ? 'var(--good)' : 'var(--danger)',
                  background: togriMi ? 'color-mix(in srgb, var(--good) 10%, transparent)' : 'color-mix(in srgb, var(--danger) 10%, transparent)',
                }}>
                  {togriMi ? '✓ To‘g‘ri javob berdingiz' : '✗ Xato javob berdingiz'}
                </span>

                {vinyetka && (
                  <p style={{
                    margin: '0 0 12px', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-soft)',
                    background: 'var(--surface-2)', borderRadius: '10px', padding: '11px 13px', lineHeight: 1.6,
                  }}>
                    {vinyetka}
                  </p>
                )}

                <p style={{ margin: '0 0 14px', fontSize: '14.5px', fontWeight: 700, lineHeight: 1.45, color: 'var(--ink)' }}>
                  {s.savol}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '13px', fontWeight: 600, lineHeight: 1.4, color: 'var(--ink)',
                    background: 'color-mix(in srgb, var(--good) 10%, transparent)', border: '1px solid var(--good)', borderRadius: '10px', padding: '10px 13px',
                  }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--good)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: '3px' }}>To‘g‘ri javob</span>
                    {s.variantlar[s.togri]}
                  </div>
                  {!togriMi && javob !== null && (
                    <div style={{
                      fontSize: '13px', fontWeight: 600, lineHeight: 1.4, color: 'var(--ink)',
                      background: 'color-mix(in srgb, var(--danger) 10%, transparent)', border: '1px solid var(--danger)', borderRadius: '10px', padding: '10px 13px',
                    }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: '3px' }}>Sizning javobingiz</span>
                      {s.variantlar[javob]}
                    </div>
                  )}
                </div>

                <div style={{
                  fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.65,
                  background: 'var(--surface-2)', borderRadius: '12px', padding: '13px 15px',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em', display: 'block', marginBottom: '5px' }}>💡 Izoh</span>
                  {s.izoh}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                  <button
                    onClick={() => setIzohSavol(izohSavol - 1)}
                    disabled={izohSavol === 0}
                    className="soft-press"
                    style={{
                      flex: 1, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '11px',
                      padding: '11px', fontSize: '13px', fontWeight: 800, cursor: izohSavol === 0 ? 'default' : 'pointer',
                      color: izohSavol === 0 ? 'var(--muted)' : 'var(--ink)', opacity: izohSavol === 0 ? 0.5 : 1,
                    }}
                  >← Oldingi</button>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', flexShrink: 0 }}>
                    {izohSavol + 1} / {savollar.length}
                  </span>
                  <button
                    onClick={() => setIzohSavol(izohSavol + 1)}
                    disabled={izohSavol === savollar.length - 1}
                    className="soft-press"
                    style={{
                      flex: 1, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '11px',
                      padding: '11px', fontSize: '13px', fontWeight: 800, cursor: izohSavol === savollar.length - 1 ? 'default' : 'pointer',
                      color: izohSavol === savollar.length - 1 ? 'var(--muted)' : 'var(--ink)', opacity: izohSavol === savollar.length - 1 ? 0.5 : 1,
                    }}
                  >Keyingi →</button>
                </div>
              </>
            )
          })()}
        </Sheet>
      )}
    </>
  )
}
