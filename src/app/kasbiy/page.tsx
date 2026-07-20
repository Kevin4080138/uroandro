'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ScreenshotMarquee, TALABA_SKRINSHOTLAR } from '@/components/landing/ScreenshotMarquee'

type Rol = 'shifokor' | 'talaba'

const HERO: Record<Rol, { chip: string; h1: string; sub: string }> = {
  shifokor: {
    chip: 'Shifokorlar uchun',
    h1: 'Bemor ishini bir joyda boshqaring',
    sub: "Bemorlar reestri, murojaatlar, kasallik tarixi shablonlari, onlayn navbat, kalkulyatorlar va faoliyat tahlili — barchasi Urosfera'da.",
  },
  talaba: {
    chip: 'Talabalar uchun',
    h1: 'Urologiyani chuqur va tartibli o\'rganing',
    sub: 'Video darslar, flashcardlar, amaliy testlar, USMLE savollari, sertifikat va reyting tizimi bilan bosqichma-bosqich rivojlaning.',
  },
}

const IMKONIYATLAR: Record<Rol, { belgi: string; nom: string; izoh: string }[]> = {
  shifokor: [
    { belgi: '🧑‍🤝‍🧑', nom: 'Bemorlar reestri', izoh: 'Barcha bemorlar va tashriflar tartibli' },
    { belgi: '📝', nom: 'Mening shablonlarim', izoh: 'Shaxsiy kasallik tarixi shablonlari' },
    { belgi: '🗓', nom: 'Onlayn navbat', izoh: 'Bemorlar o\'zi qulay vaqtga yoziladi' },
    { belgi: '🩹', nom: 'Operatsiya kuzatuvi', izoh: 'Operatsiyadan keyingi avtomatik eslatmalar' },
    { belgi: '🧮', nom: 'Kalkulyatorlar', izoh: 'IPSS, PSA, varikotsele va boshqalar' },
    { belgi: '📈', nom: 'Faoliyat paneli', izoh: 'Murojaat, navbat va reyting statistikasi' },
  ],
  talaba: [
    { belgi: '🎬', nom: 'Video darslar', izoh: 'Himoyalangan, bosqichli darslar' },
    { belgi: '🃏', nom: 'Flashcardlar', izoh: 'Tez yodlash uchun kartochkalar' },
    { belgi: '✍️', nom: 'Amaliy testlar', izoh: 'Har mavzu bo\'yicha savol banki' },
    { belgi: '🌐', nom: 'USMLE savollari', izoh: 'O\'rta bosqichdan — xalqaro format' },
    { belgi: '🧩', nom: 'Interaktiv case', izoh: 'Qiyin bosqichda — qaror qabul qilasiz' },
    { belgi: '🏥', nom: 'Vaziyatli masalalar', izoh: 'Qiyin bosqichda — real klinik holatlar' },
    { belgi: '🔍', nom: 'Xatolar tahlili', izoh: 'Qiyin bosqichda — tipik xatolar va sabablari' },
    { belgi: '📋', nom: 'Nazorat testi', izoh: 'O\'rta bosqichdan — bosqichni yopish uchun' },
    { belgi: '🏅', nom: 'Sertifikat', izoh: 'Bosqich nazoratidan o\'tgach beriladi' },
    { belgi: '🗂', nom: 'Klassifikatsiyalar', izoh: 'Urologik tasniflar bir joyda' },
    { belgi: '🧮', nom: 'Kalkulyatorlar', izoh: 'IPSS, PSA, eGFR va boshqalar' },
    { belgi: '📊', nom: 'Reyting', izoh: 'O\'z natijangizni kuzating' },
  ],
}

const SEGMENTLAR = [
  { belgi: '👨‍⚕️', nom: 'Shifokorlar', izoh: 'Bemorlar bilan ishlashni raqamlashtiring, kasbiy vositalardan foydalaning.' },
  { belgi: '🎓', nom: 'Talabalar', izoh: 'Urologiya yo\'nalishini nazariya va amaliyot bilan chuqur o\'rganing.' },
  { belgi: '🏥', nom: 'Klinikalar', izoh: 'Shifokorlaringizni katalogda ko\'rsating, bemor oqimini oshiring.' },
]

const FAQ = [
  { s: 'Urosfera nima?', j: "Farg'ona urologlari va bemorlarini bog'lovchi, shifokor ishini va ta'limni bir joyga jamlagan urologiya ekotizimi." },
  { s: 'Foydalanish pullikmi?', j: "Hozircha barcha asosiy imkoniyatlar bepul. Kelajakda faqat yangi qo'shimcha xizmatlar pullik bo'lishi mumkin, mavjudlari bepul qoladi." },
  { s: 'Ro\'yxatdan o\'tish qanday?', j: "Telefon raqamingiz orqali bir daqiqada ro'yxatdan o'tasiz — shifokor yoki talaba sifatida bo'limingizni tanlaysiz." },
  { s: 'Ma\'lumotlarim xavfsizmi?', j: "Ha. Har bir foydalanuvchi faqat o'ziga tegishli ma'lumotni ko'radi, tibbiy ma'lumotlar himoyalangan." },
]

function KasbiyLanding() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()
  const rol: Rol = params.get('rol') === 'talaba' ? 'talaba' : 'shifokor'

  const [topShifokorlar, setTopShifokorlar] = useState<{ nom: string; mutaxassislik: string | null; tajriba: number | null; reyting: number | null }[]>([])

  useEffect(() => {
    const yukla = async () => {
      const [{ data: profillar }, { data: baholar }] = await Promise.all([
        supabase.from('shifokor_profillari').select('doctor_id, full_name, mutaxassislik, tajriba_yil').eq('ochiq', true),
        supabase.from('baholar').select('doctor_id, muomala, samara, tushuntirish, kutish'),
      ])

      const bh = baholar ?? []
      // Reyting bo'yicha top shifokorlar
      const reytingMap: Record<string, number[]> = {}
      for (const b of bh as any[]) {
        (reytingMap[b.doctor_id] ??= []).push((b.muomala + b.samara + b.tushuntirish + b.kutish) / 4)
      }
      const top = (profillar ?? [])
        .map((p: any) => {
          const r = reytingMap[p.doctor_id]
          return {
            nom: p.full_name,
            mutaxassislik: p.mutaxassislik,
            tajriba: p.tajriba_yil,
            reyting: r ? r.reduce((a, b) => a + b, 0) / r.length : null,
          }
        })
        .sort((a, b) => (b.reyting ?? 0) - (a.reyting ?? 0))
        .slice(0, 4)
      setTopShifokorlar(top)
    }
    yukla()
  }, [])

  const hero = HERO[rol]
  const imkoniyatlar = IMKONIYATLAR[rol]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Top nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', maxWidth: 960, margin: '0 auto' }}>
          <button onClick={() => router.push('/?tanla=1')} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer' }}>‹ Boshqa bo&apos;lim</button>
          <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: '-.02em' }}>Uro<span style={{ color: 'var(--accent)' }}>sfera</span></span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => router.push('/auth/login')} style={{ background: 'none', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', borderRadius: 999, padding: '7px 14px' }}>Kirish</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>

        {/* Hero */}
        <section style={{ padding: '48px 0 40px', textAlign: 'center', maxWidth: 620, marginInline: 'auto' }}>
          <span className="rise" style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 999, padding: '5px 14px', marginBottom: 18 }}>{hero.chip}</span>
          <h1 className="rise" style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-.02em', animationDelay: '.05s' }}>{hero.h1}</h1>
          <p className="rise" style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 28px', animationDelay: '.1s' }}>{hero.sub}</p>
          <div className="rise" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '.15s' }}>
            <button onClick={() => router.push(`/auth/register?rol=${rol}`)} className="lift" style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 28px rgba(37,99,235,.28)' }}>Ro&apos;yxatdan o&apos;tish →</button>
            <button onClick={() => router.push('/auth/login')} className="lift" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1.5px solid var(--line)', borderRadius: 14, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Kirish</button>
          </div>
        </section>

      </div>

      {/* Ilova ko'rinishi — hozircha faqat talaba bo'limining skrinshotlari bor.
          Shifokor bo'limi uchun rasm tayyorlangach, shu yerga qo'shiladi. */}
      {rol === 'talaba' && (
        <section style={{ padding: '20px 0 8px' }}>
          <p style={{
            textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 16px',
          }}>
            Ilova ichida shunday
          </p>
          <ScreenshotMarquee rasmlar={TALABA_SKRINSHOTLAR} tezlik="58s" />
        </section>
      )}

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>

        {/* Imkoniyatlar */}
        <section style={{ padding: '44px 0 12px' }}>
          <h2 style={{ fontSize: 23, fontWeight: 800, textAlign: 'center', margin: '0 0 6px' }}>Imkoniyatlar</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', margin: '0 0 26px' }}>
            {rol === 'shifokor' ? 'Kundalik ishingizni yengillashtiruvchi vositalar' : "O'rganishni tartibli va samarali qiladigan vositalar"}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {imkoniyatlar.map((f, i) => (
              <div key={f.nom} className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px', display: 'flex', gap: 14, alignItems: 'flex-start', animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}>
                <span style={{ fontSize: 24, width: 46, height: 46, flexShrink: 0, borderRadius: 12, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.belgi}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{f.nom}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 }}>{f.izoh}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Kimlar uchun */}
        <section style={{ padding: '44px 0 12px' }}>
          <h2 style={{ fontSize: 23, fontWeight: 800, textAlign: 'center', margin: '0 0 26px' }}>Platforma kimlar uchun</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {SEGMENTLAR.map((s) => (
              <div key={s.nom} className="rise" style={{ background: 'var(--surface)', borderLeft: '3px solid var(--accent)', border: '1px solid var(--line)', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{s.belgi}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{s.nom}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{s.izoh}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Top shifokorlar */}
        {topShifokorlar.length > 0 && (
          <section style={{ padding: '44px 0 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <h2 style={{ fontSize: 23, fontWeight: 800, margin: 0 }}>Katalogdagi shifokorlar</h2>
              <button onClick={() => router.push('/shifokorlar')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }}>Barchasi →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {topShifokorlar.map((d, i) => (
                <div key={i} className="rise lift" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: '18px 20px', cursor: 'pointer' }} onClick={() => router.push('/shifokorlar')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                      {d.nom.trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.nom}</div>
                      {d.mutaxassislik && <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.mutaxassislik}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
                    <span>{d.tajriba != null ? `${d.tajriba} yil tajriba` : ''}</span>
                    {d.reyting != null && <span style={{ color: 'var(--warn)', fontWeight: 700 }}>★ {d.reyting.toFixed(1)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section style={{ padding: '44px 0 12px' }}>
          <h2 style={{ fontSize: 23, fontWeight: 800, textAlign: 'center', margin: '0 0 26px' }}>Ko&apos;p beriladigan savollar</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 680, marginInline: 'auto' }}>
            {FAQ.map((f) => (
              <details key={f.s} className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, padding: '16px 20px' }}>
                <summary style={{ fontSize: 15, fontWeight: 700, cursor: 'pointer', listStyle: 'none' }}>{f.s}</summary>
                <p style={{ margin: '10px 0 0', fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{f.j}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Yakuniy CTA */}
        <section style={{ padding: '30px 0 48px' }}>
          <div style={{ background: 'var(--accent)', borderRadius: 24, padding: '40px 28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 10px', lineHeight: 1.2 }}>
              {rol === 'shifokor' ? 'Ishingizni bugundan tartibga soling' : "Bugun o'rganishni boshlang"}
            </h2>
            <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,.85)', margin: '0 0 24px', lineHeight: 1.5 }}>Ro&apos;yxatdan o&apos;tish bepul va bir daqiqa vaqt oladi.</p>
            <button onClick={() => router.push(`/auth/register?rol=${rol}`)} className="lift" style={{ background: '#fff', color: 'var(--accent)', border: 'none', borderRadius: 14, padding: '14px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Boshlash →</button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '32px 20px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>Uro<span style={{ color: 'var(--accent)' }}>sfera</span></div>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.5 }}>Farg&apos;ona urologiya ekotizimi — shifokor, talaba va bemor bir platformada.</p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', fontSize: 13, flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/shifokorlar')} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: 13 }}>Shifokorlar katalogi</button>
            <button onClick={() => router.push('/auth/login')} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: 13 }}>Kirish</button>
            <button onClick={() => router.push('/?tanla=1')} style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: 13 }}>Bosh sahifa</button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>© 2026 Urosfera. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  )
}

export default function KasbiyPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', background: 'var(--bg)' }} />}>
      <KasbiyLanding />
    </Suspense>
  )
}
