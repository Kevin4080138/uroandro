'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { BannerCarousel } from '@/components/BannerCarousel'
import { HeroVisual } from '@/components/landing/HeroVisual'
import { ProductMarquee } from '@/components/landing/ProductMarquee'
import { ScreenshotMarquee, ARALASH_SKRINSHOTLAR } from '@/components/landing/ScreenshotMarquee'
import { Reveal } from '@/components/landing/Reveal'

const ROL_DASHBOARD: Record<string, string> = {
  student: '/student/dashboard',
  doctor: '/doctor/dashboard',
  patient: '/patient/dashboard',
  admin: '/admin/dashboard',
}

type Eshik = {
  kalit: string
  belgi: string
  sarlavha: string
  izoh: string
  nima: string[]
  href: string
  asosiy: boolean
}

const ESHIKLAR: Eshik[] = [
  {
    kalit: 'bemor',
    belgi: '🧑',
    sarlavha: 'Men bemorman',
    izoh: 'Shifokor topaman, navbatga yozilaman',
    nima: ['Shifokorlar katalogi', 'Onlayn navbat', 'Operatsiyalar haqida oddiy tilda'],
    href: '/bemor',
    asosiy: true,
  },
  {
    kalit: 'shifokor',
    belgi: '👨‍⚕️',
    sarlavha: 'Men shifokorman',
    izoh: 'Bemorlar, protokollar, kasbiy vositalar',
    nima: ['Bemorlar reestri', 'Kasallik tarixi shablonlari', 'Kalkulyatorlar va protokollar'],
    href: '/kasbiy?rol=shifokor',
    asosiy: false,
  },
  {
    kalit: 'talaba',
    belgi: '🎓',
    sarlavha: 'Men talabaman',
    izoh: 'Darslar, testlar, sertifikat',
    nima: ['Bosqichli darslar', 'Flashcard va testlar', 'Sertifikat va reyting'],
    href: '/kasbiy?rol=talaba',
    asosiy: false,
  },
]

const SABABLAR = [
  {
    belgi: '🇺🇿',
    nom: "O'zbek tilida",
    izoh: "Urologiya bo'yicha to'liq kurs ona tilida — tarjimaga vaqt sarflamaysiz.",
  },
  {
    belgi: '🪜',
    nom: 'Bosqichma-bosqich',
    izoh: "Oson → o'rta → qiyin. Har bosqich oldingisini takrorlamaydi, ustiga quradi.",
  },
  {
    belgi: '🏥',
    nom: 'Amaliyotdan',
    izoh: "Materiallar Farg'ona urologlari amaliyotidan — kitobdan ko'chirilgan quruq nazariya emas.",
  },
  {
    belgi: '✍️',
    nom: 'Faqat o\'qish emas',
    izoh: "Har dars ichida flashcard, amaliy test va USMLE savollari — bilim darrov mustahkamlanadi.",
  },
  {
    belgi: '🧩',
    nom: 'Klinik qaror mashqi',
    izoh: "Qiyin bosqichda interaktiv case va vaziyatli masalalar: qaror qabul qilasiz, oqibatini ko'rasiz.",
  },
  {
    belgi: '🔍',
    nom: 'Xatolar ustida ish',
    izoh: "Amaliyotdagi tipik xatolar alohida tahlil qilinadi — ularni bemorda emas, darsda uchratasiz.",
  },
  {
    belgi: '🏅',
    nom: 'Sertifikat — tekin emas',
    izoh: "Bosqich sertifikati faqat barcha nazorat testlaridan o'tgandan keyin ochiladi.",
  },
  {
    belgi: '🔒',
    nom: 'Ma\'lumot himoyada',
    izoh: "Har foydalanuvchi faqat o'ziga tegishli ma'lumotni ko'radi.",
  },
]

function Landing() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const [saqlangan, setSaqlangan] = useState<Eshik | null>(null)

  // "Boshqa bo'lim" tugmasi orqali kelgan bo'lsa — davom etish tasmasi ko'rsatilmaydi,
  // chunki odam aynan boshqa bo'limni qidirib kelgan.
  const qaytaTanla = params.get('tanla') === '1'

  useEffect(() => {
    const tekshir = async () => {
      // Login qilgan foydalanuvchi landing'da ushlanib qolmaydi — o'z paneliga
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        const yol = ROL_DASHBOARD[data?.role ?? '']
        if (yol) { router.replace(yol); return }
      }
      // Mehmon — landing ko'rsatiladi. Oldingi tanlov bo'lsa, majburiy
      // yo'naltirish emas, faqat tepada bir bosishlik tasma.
      if (!qaytaTanla) {
        try {
          const kalit = localStorage.getItem('urosfera_rol')
          const e = ESHIKLAR.find((x) => x.kalit === kalit)
          if (e) setSaqlangan(e)
        } catch { /* localStorage yopiq bo'lishi mumkin */ }
      }
    }
    tekshir()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const eshikka = (e: Eshik) => {
    try { localStorage.setItem('urosfera_rol', e.kalit) } catch {}
    router.push(e.href)
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--ink)', minHeight: '100dvh' }}>

      {/* ══ Navigatsiya ══ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'color-mix(in srgb, var(--bg) 82%, transparent)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
      }}>
        <nav style={{
          maxWidth: 1140, margin: '0 auto', padding: '13px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <a
            href="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0,
              textDecoration: 'none', color: 'var(--ink)',
            }}
          >
            <img
              src="/landing/logo.webp"
              alt=""
              width={34}
              height={34}
              style={{ borderRadius: 9, display: 'block' }}
            />
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-.02em' }}>
              Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
            </span>
          </a>

          <div className="nav-havolalar" style={{ gap: 26, alignItems: 'center' }}>
            <a href="#imkoniyatlar" style={{ fontSize: 13.5, color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>Imkoniyatlar</a>
            <a href="#bolimlar" style={{ fontSize: 13.5, color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>Bo&apos;limlar</a>
            <a href="/shifokorlar" style={{ fontSize: 13.5, color: 'var(--ink-soft)', textDecoration: 'none', fontWeight: 600 }}>Shifokorlar</a>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => router.push('/auth/login')} className="soft-press" style={{
              background: 'none', border: '1px solid var(--line)', color: 'var(--ink)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 999, padding: '8px 16px',
            }}>Kirish</button>
            <button onClick={() => router.push('/auth/register')} className="soft-press" style={{
              background: 'var(--accent)', border: 'none', color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', borderRadius: 999, padding: '8px 16px',
            }}>Boshlash</button>
          </div>
        </nav>
      </header>

      {/* ══ Davom etish tasmasi (oldin tanlagan mehmon uchun) ══ */}
      {saqlangan && (
        <button
          onClick={() => eshikka(saqlangan)}
          className="fade-in"
          style={{
            width: '100%', border: 'none', cursor: 'pointer', textAlign: 'center',
            background: 'var(--accent-soft)',
            borderBottom: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            color: 'var(--accent)', fontSize: 13.5, fontWeight: 700, padding: '11px 20px',
          }}
        >
          {saqlangan.belgi} {saqlangan.sarlavha.replace('Men ', '').replace(/man$/, '')} bo&apos;limiga davom etish →
        </button>
      )}

      {/* ══ Hero ══ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-nur" />
        <div style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: '64px 20px 56px' }}>
          <div className="hero-grid">
            {/* Chap: matn */}
            <div className="hero-matn" style={{ textAlign: 'center' }}>
              <span className="rise" style={{
                display: 'inline-block', fontSize: 12.5, fontWeight: 700, color: 'var(--accent)',
                background: 'var(--accent-soft)', border: '1px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                borderRadius: 999, padding: '6px 15px', marginBottom: 20,
              }}>
                Farg&apos;ona urologiya ekotizimi
              </span>

              <h1 className="rise" style={{
                fontSize: 'clamp(30px, 5.2vw, 52px)', fontWeight: 900, lineHeight: 1.08,
                letterSpacing: '-.03em', margin: '0 0 18px', animationDelay: '.05s',
                fontFamily: 'var(--font-display), sans-serif',
              }}>
                Urologiya — <span style={{ color: 'var(--accent)' }}>o&apos;zbek tilida</span>,<br />
                bir platformada
              </h1>

              <p className="rise" style={{
                fontSize: 'clamp(15px, 1.6vw, 17.5px)', color: 'var(--ink-soft)', lineHeight: 1.6,
                margin: '0 0 30px', maxWidth: 520, marginInline: 'auto', animationDelay: '.1s',
              }}>
                Talabalar uchun bosqichli darslar va testlar, shifokorlar uchun kasbiy
                vositalar, bemorlar uchun ishonchli javob — hammasi bitta joyda.
              </p>

              <div className="rise hero-tugmalar" style={{
                display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '.15s',
              }}>
                <button onClick={() => router.push('/auth/register')} className="lift" style={{
                  background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 14,
                  padding: '15px 30px', fontSize: 15.5, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 10px 28px rgba(37,99,235,.28)',
                }}>Bepul boshlash →</button>
                <button onClick={() => router.push('/shifokorlar')} className="lift" style={{
                  background: 'var(--surface)', color: 'var(--ink)', border: '1.5px solid var(--line)',
                  borderRadius: 14, padding: '15px 30px', fontSize: 15.5, fontWeight: 700, cursor: 'pointer',
                }}>Shifokor topish</button>
              </div>

              <p className="rise" style={{
                marginTop: 18, fontSize: 12.5, color: 'var(--muted)', animationDelay: '.2s',
              }}>
                Shifokor topish uchun ro&apos;yxatdan o&apos;tish shart emas
              </p>
            </div>

            {/* O'ng: e'lon/reklama joyi — admin boshqaradi.
                Telefonda ham ko'rinadi (matn ostida) — trafikning katta qismi
                telefondan keladi, e'lonni u yerda yashirish ma'nosiz. */}
            <div className="rise" style={{ animationDelay: '.2s' }}>
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ══ Imkoniyatlar tasmasi ══ */}
      <section id="imkoniyatlar" style={{ padding: '18px 0 56px' }}>
        <Reveal>
          <p style={{
            textAlign: 'center', fontSize: 12.5, fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 22px',
          }}>
            Platforma ichida nima bor
          </p>
        </Reveal>

        {/* Tepada haqiqiy ekranlar, pastda imkoniyat nomlari — qarama-qarshi yo'nalishda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <ScreenshotMarquee rasmlar={ARALASH_SKRINSHOTLAR} tezlik="76s" />
          <ProductMarquee />
        </div>
      </section>

      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 20px' }}>

        {/* ══ Bo'limlar (rol tanlash) ══ */}
        <section id="bolimlar" style={{ padding: '40px 0 20px' }}>
          <Reveal>
            <h2 style={{
              fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 900, textAlign: 'center',
              margin: '0 0 10px', letterSpacing: '-.02em', fontFamily: 'var(--font-display), sans-serif',
            }}>
              Qayerdan boshlaysiz?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', textAlign: 'center', margin: '0 0 34px' }}>
              O&apos;zingizga mos bo&apos;limni tanlang — keyin ham o&apos;zgartira olasiz
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {ESHIKLAR.map((e, i) => (
              <Reveal key={e.kalit} kechikish={i * 90}>
                <button
                  onClick={() => eshikka(e)}
                  className="lift soft-press"
                  style={{
                    width: '100%', height: '100%', textAlign: 'left', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: 14,
                    background: e.asosiy ? 'var(--accent)' : 'var(--surface)',
                    color: e.asosiy ? '#fff' : 'var(--ink)',
                    border: e.asosiy ? '1.5px solid var(--accent)' : '1.5px solid var(--line)',
                    borderRadius: 20, padding: '26px 24px',
                    boxShadow: e.asosiy ? '0 12px 32px rgba(37,99,235,.26)' : 'none',
                  }}
                >
                  <span style={{
                    fontSize: 28, width: 56, height: 56, borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: e.asosiy ? 'rgba(255,255,255,.18)' : 'var(--surface-2)',
                  }}>{e.belgi}</span>

                  <span>
                    <span style={{ display: 'block', fontSize: 19, fontWeight: 800, lineHeight: 1.2 }}>
                      {e.sarlavha}
                    </span>
                    <span style={{
                      display: 'block', fontSize: 13.5, marginTop: 5, lineHeight: 1.45,
                      color: e.asosiy ? 'rgba(255,255,255,.88)' : 'var(--muted)',
                    }}>{e.izoh}</span>
                  </span>

                  <span style={{
                    display: 'flex', flexDirection: 'column', gap: 7, marginTop: 'auto',
                    paddingTop: 14,
                    borderTop: `1px solid ${e.asosiy ? 'rgba(255,255,255,.22)' : 'var(--line)'}`,
                  }}>
                    {e.nima.map((n) => (
                      <span key={n} style={{
                        display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5,
                        color: e.asosiy ? 'rgba(255,255,255,.92)' : 'var(--ink-soft)',
                      }}>
                        <span style={{ color: e.asosiy ? '#fff' : 'var(--good)', fontWeight: 800 }}>✓</span>
                        {n}
                      </span>
                    ))}
                  </span>

                  <span style={{
                    fontSize: 13.5, fontWeight: 700, marginTop: 4,
                    color: e.asosiy ? '#fff' : 'var(--accent)',
                  }}>
                    Ochish →
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ E'lonlar (admin panelidan boshqariladi) ══ */}
        <section style={{ padding: '36px 0 0' }}>
          <BannerCarousel role="landing" faqatShuRol />
        </section>

        {/* ══ Nega Urosfera ══ */}
        <section style={{ padding: '56px 0 20px' }}>
          <Reveal>
            <h2 style={{
              fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 900, textAlign: 'center',
              margin: '0 0 34px', letterSpacing: '-.02em', fontFamily: 'var(--font-display), sans-serif',
            }}>
              Nega Urosfera?
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {SABABLAR.map((s, i) => (
              <Reveal key={s.nom} kechikish={i * 80}>
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 18, padding: '24px 22px', height: '100%',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{s.belgi}</div>
                  <div style={{ fontSize: 16.5, fontWeight: 800, marginBottom: 6 }}>{s.nom}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55 }}>{s.izoh}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ Yakuniy CTA ══ */}
        <section style={{ padding: '48px 0 56px' }}>
          <Reveal>
            <div style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              borderRadius: 26, padding: 'clamp(34px, 5vw, 56px) 28px', textAlign: 'center',
            }}>
              <h2 style={{
                fontSize: 'clamp(24px, 3.4vw, 36px)', fontWeight: 900, color: '#fff',
                margin: '0 0 12px', lineHeight: 1.15, letterSpacing: '-.02em',
                fontFamily: 'var(--font-display), sans-serif',
              }}>
                Bugun boshlang
              </h2>
              <p style={{
                fontSize: 15.5, color: 'rgba(255,255,255,.9)', margin: '0 0 26px',
                lineHeight: 1.55, maxWidth: 480, marginInline: 'auto',
              }}>
                Ro&apos;yxatdan o&apos;tish bepul va bir daqiqa vaqt oladi.
                Telefon raqamingiz yetarli.
              </p>
              <button onClick={() => router.push('/auth/register')} className="lift" style={{
                background: '#fff', color: 'var(--accent)', border: 'none', borderRadius: 14,
                padding: '15px 36px', fontSize: 15.5, fontWeight: 800, cursor: 'pointer',
              }}>Ro&apos;yxatdan o&apos;tish →</button>
            </div>
          </Reveal>
        </section>
      </div>

      {/* ══ Footer ══ */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '38px 20px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 21, fontWeight: 900, marginBottom: 8, letterSpacing: '-.02em' }}>
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 18px', lineHeight: 1.5 }}>
            Farg&apos;ona urologiya ekotizimi — shifokor, talaba va bemor bir platformada.
          </p>
          <div style={{ display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/shifokorlar" style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none' }}>Shifokorlar katalogi</a>
            <a href="/auth/login" style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none' }}>Kirish</a>
            <a href="/auth/register" style={{ fontSize: 13, color: 'var(--ink-soft)', textDecoration: 'none' }}>Ro&apos;yxatdan o&apos;tish</a>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 22 }}>
            © 2026 Urosfera. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function BoshSahifa() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', background: 'var(--bg)' }} />}>
      <Landing />
    </Suspense>
  )
}
