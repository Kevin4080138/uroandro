'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { BOSQICHLAR, BOSQICH_KATEGORIYA_TARTIBI, BOSQICH_RANG, type Bosqich } from '@/lib/talim/darslar'
import type { BobHolati, BosqichHolati } from '@/lib/talim/sertifikat'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

// Sertifikat — bosqichga bitta (AGENTS.md qoidasi), nishon — har bob uchun.
// Ilgari bu sahifa har bir dars uchun alohida "sertifikat" ko'rsatardi; u qoidaga
// zid edi va hujjatning qadrini tushirardi.

type Mavjud = {
  kod: string
  turi: 'bosqich' | 'bob'
  bosqich: Bosqich
  kategoriya: string | null
  created_at: string
  bekor_qilingan: boolean
}

type Holat = {
  bosqichlar: BosqichHolati[]
  boblar: BobHolati[]
  mavjud: Mavjud[]
  ism: string
  ismQulflangan: boolean
}

export default function SertifikatlarPage() {
  const router = useRouter()
  const [holat, setHolat] = useState<Holat | null>(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xato, setXato] = useState<string | null>(null)
  const [sorayapti, setSorayapti] = useState<string | null>(null)
  const [tasdiq, setTasdiq] = useState<{ turi: 'bosqich' | 'bob'; bosqich: Bosqich; kategoriya?: string } | null>(null)

  useEffect(() => {
    const yukla = async () => {
      const res = await fetch('/api/sertifikat/holat')
      if (res.status === 401) { router.push('/auth/login'); return }
      if (!res.ok) { setXato("Ma'lumot yuklanmadi"); setYuklanmoqda(false); return }
      setHolat(await res.json())
      setYuklanmoqda(false)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ber = async (sorov: { turi: 'bosqich' | 'bob'; bosqich: Bosqich; kategoriya?: string }) => {
    const kalit = `${sorov.turi}|${sorov.bosqich}|${sorov.kategoriya ?? ''}`
    setSorayapti(kalit)
    setXato(null)
    try {
      const res = await fetch('/api/sertifikat/ber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sorov),
      })
      const javob = await res.json()
      if (!res.ok) { setXato(javob.error ?? 'Sertifikat berilmadi'); return }
      router.push(`/student/sertifikat/${javob.kod}`)
    } catch {
      setXato('Tarmoq xatosi — qayta urinib ko\'ring')
    } finally {
      setSorayapti(null)
      setTasdiq(null)
    }
  }

  if (yuklanmoqda) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <UrosferaLoaderMini />
      </div>
    )
  }

  const mavjudTop = (turi: 'bosqich' | 'bob', bosqich: string, kategoriya?: string) =>
    holat?.mavjud.find((m) =>
      m.turi === turi && m.bosqich === bosqich && (m.kategoriya ?? undefined) === kategoriya
    )

  const sertifikatliBosqichlar = holat?.bosqichlar ?? []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '48px' }}>
      <Header backHref="/student/profil" backLabel="Profil" />

      <div className="mx-auto max-w-[620px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div>
          <h2 style={{ margin: '0 0 6px', fontSize: '21px', fontWeight: 800 }}>🎓 Sertifikat va nishonlar</h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)', lineHeight: 1.65 }}>
            Bosqichni to&apos;liq yakunlaganingizda — QR bilan tekshiriladigan rasmiy sertifikat.
            Har bir bo&apos;limni tugatganingizda esa ulashish uchun nishon.
          </p>
        </div>

        {xato && (
          <div style={{
            background: 'rgba(220,38,38,.1)', border: '1px solid var(--danger)', color: 'var(--danger)',
            borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontWeight: 600,
          }}>
            {xato}
          </div>
        )}

        {/* Bosqich sertifikatlari */}
        <section>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>Bosqich sertifikatlari</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sertifikatliBosqichlar.map((b) => {
              const meta = BOSQICHLAR.find((x) => x.id === b.bosqich)
              const rang = BOSQICH_RANG[b.bosqich as Bosqich]?.token ?? 'var(--accent)'
              const bor = mavjudTop('bosqich', b.bosqich)
              const foiz = b.jami > 0 ? Math.round((b.otgan / b.jami) * 100) : 0
              const kalit = `bosqich|${b.bosqich}|`

              return (
                <div key={b.bosqich} style={{
                  background: 'var(--surface)', border: `1px solid ${bor ? rang : 'var(--line)'}`,
                  borderRadius: '16px', overflow: 'hidden',
                }}>
                  <div style={{ height: '4px', background: bor ? rang : 'var(--line)' }} />
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '19px' }}>{meta?.emoji}</span>
                      <span style={{ fontWeight: 800, fontSize: '14.5px', flex: 1 }}>{meta?.nom}</span>
                      <span style={{ fontSize: '12.5px', color: 'var(--muted)', fontWeight: 700 }}>
                        {b.otgan}/{b.jami}
                      </span>
                    </div>

                    <div style={{ height: '6px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }}>
                      <div style={{ height: '100%', width: `${foiz}%`, background: rang, borderRadius: '999px' }} />
                    </div>

                    {bor ? (
                      <Link
                        href={`/student/sertifikat/${bor.kod}`}
                        style={{
                          display: 'inline-block', background: rang, color: 'white', textDecoration: 'none',
                          borderRadius: '10px', padding: '10px 16px', fontWeight: 800, fontSize: '13px',
                        }}
                      >
                        🎓 Sertifikatni ochish
                      </Link>
                    ) : b.loyiqmi ? (
                      <button
                        onClick={() => setTasdiq({ turi: 'bosqich', bosqich: b.bosqich })}
                        disabled={sorayapti === kalit}
                        style={{
                          background: `linear-gradient(120deg, ${rang}, var(--accent-2))`, color: 'white',
                          border: 'none', borderRadius: '10px', padding: '10px 16px',
                          fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                        }}
                      >
                        {sorayapti === kalit ? 'Beriladi...' : '🎉 Sertifikatni olish'}
                      </button>
                    ) : b.tayyorlanmoqda ? (
                      <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
                        ⏳ Bu bosqich sertifikati tayyorlanmoqda — {b.nazoratsizSoni} ta darsning
                        nazorat testi hali qo&apos;shilmagan. Tayyor bo&apos;lgach shu yerda ochiladi.
                      </p>
                    ) : (
                      <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
                        Barcha {b.jami} ta darsning nazorat testidan o&apos;tganingizda ochiladi.
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Bob nishonlari */}
        <section>
          <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 800 }}>Bo&apos;lim nishonlari</h3>
          <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.6 }}>
            Bo&apos;limdagi barcha darslarni tugatganingizda ochiladi — Instagram yoki Telegramga joylash uchun.
          </p>

          {BOSQICHLAR.map((meta) => {
            const tartib = BOSQICH_KATEGORIYA_TARTIBI[meta.id as Bosqich] ?? []
            const boblar = (holat?.boblar ?? [])
              .filter((b) => b.bosqich === meta.id)
              .sort((a, c) => tartib.indexOf(a.kategoriya) - tartib.indexOf(c.kategoriya))
            if (boblar.length === 0) return null
            const rang = BOSQICH_RANG[meta.id as Bosqich]?.token ?? 'var(--accent)'

            return (
              <div key={meta.id} style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--muted)', marginBottom: '8px' }}>
                  {meta.emoji} {meta.nom}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {boblar.map((b) => {
                    const bor = mavjudTop('bob', b.bosqich, b.kategoriya)
                    const kalit = `bob|${b.bosqich}|${b.kategoriya}`
                    return (
                      <div key={b.kategoriya} style={{
                        background: 'var(--surface)', border: '1px solid var(--line)',
                        borderRadius: '12px', padding: '12px 14px',
                        display: 'flex', alignItems: 'center', gap: '11px',
                      }}>
                        <span style={{
                          fontSize: '19px', opacity: bor || b.loyiqmi ? 1 : .35,
                          filter: bor || b.loyiqmi ? 'none' : 'grayscale(1)',
                        }}>
                          {bor ? '🏅' : b.loyiqmi ? '✨' : '🔒'}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.4 }}>{b.kategoriya}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '1px' }}>
                            {b.tugagan}/{b.jami} dars tugallandi
                          </div>
                        </div>
                        {bor ? (
                          <Link
                            href={`/student/sertifikat/${bor.kod}`}
                            style={{
                              fontSize: '12px', fontWeight: 800, color: rang,
                              textDecoration: 'none', flexShrink: 0,
                            }}
                          >
                            Ochish →
                          </Link>
                        ) : b.loyiqmi ? (
                          <button
                            onClick={() => ber({ turi: 'bob', bosqich: b.bosqich, kategoriya: b.kategoriya })}
                            disabled={sorayapti === kalit}
                            style={{
                              background: rang, color: 'white', border: 'none', borderRadius: '9px',
                              padding: '7px 13px', fontWeight: 800, fontSize: '12px', cursor: 'pointer', flexShrink: 0,
                            }}
                          >
                            {sorayapti === kalit ? '...' : 'Olish'}
                          </button>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>
      </div>

      {/* Ism tasdig'i — sertifikatga tushgan ism keyin qulflanadi */}
      {tasdiq && holat && (
        <div
          onClick={() => setTasdiq(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--surface)', borderRadius: '18px', padding: '22px',
              maxWidth: '400px', width: '100%', border: '1px solid var(--line)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 800 }}>Ismingiz to&apos;g&apos;rimi?</h3>
            <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.65 }}>
              Sertifikatga quyidagi ism yoziladi va u <strong>keyin o&apos;zgartirilmaydi</strong>.
              Hujjatlaringizdagidek to&apos;g&apos;ri yozilganini tekshiring.
            </p>

            <div style={{
              background: 'var(--surface-2)', borderRadius: '12px', padding: '14px 16px',
              textAlign: 'center', marginBottom: '16px',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 800 }}>{holat.ism || '—'}</div>
            </div>

            <div style={{ display: 'flex', gap: '9px' }}>
              <Link
                href="/student/profil/tahrirlash"
                style={{
                  flex: 1, textAlign: 'center', background: 'var(--surface-2)', color: 'var(--ink)',
                  borderRadius: '11px', padding: '11px', fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                }}
              >
                Ismni tuzatish
              </Link>
              <button
                onClick={() => ber(tasdiq)}
                disabled={sorayapti !== null || holat.ism.trim().length < 3}
                style={{
                  flex: 1, background: 'linear-gradient(120deg, var(--accent), var(--accent-2))',
                  color: 'white', border: 'none', borderRadius: '11px', padding: '11px',
                  fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                }}
              >
                {sorayapti ? 'Beriladi...' : "To'g'ri, davom etish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
