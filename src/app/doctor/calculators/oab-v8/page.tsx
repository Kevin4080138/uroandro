'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla } from '@/lib/kalkulyatorSaqlash'

// OAB-V8 — 8 savol, har biri 0-5 ball ("so'nggi 4 hafta ichida qanchalik bezovta qildi")
const SAVOLLAR = [
  "Tez-tez siyishni his qilish",
  "Siyish ehtiyojini his qilib, uni ushlab turishga harakat qilish, ammo siydikni tushirib qo'yishdan qo'rqish",
  "Kutilmagan/to'satdan siyish ehtiyojining paydo bo'lishi, bu sizni biroz hayajonlantiradi",
  "Kutilmagan/to'satdan siyish ehtiyojining paydo bo'lishi, va siydikni tushirib qo'yishdan qo'rqish",
  "Siyishga harakat qilayotganda kutilmaganda kichik miqdorda siydik tushib ketishi",
  "Tunda uyqudan turib siyishga ehtiyoj sezish",
  "Tushirib qo'yish (inkontinensiya) tufayli uyg'onish",
  "Tunda uxlayotganda kutilmaganda siydik tushib ketishi",
] as const

const VARIANTLAR = ['Hech bezovta qilmaydi', 'Juda yengil', 'Yengil', "O'rtacha", "Og'ir", "Juda og'ir"]

function natijaDarajasi(jami: number) {
  if (jami < 8) return { nom: "Siydik pufagi giperaktivligi ehtimoli past", rang: '#16a34a' }
  return { nom: "Siydik pufagi giperaktivligi (OAB) ehtimoli yuqori", rang: '#dc2626' }
}

export default function OABV8Page() {
  return (
    <Suspense fallback={null}>
      <OABV8Ichki />
    </Suspense>
  )
}

function OABV8Ichki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio').eq('id', bemorId).single().then(({ data }) => setBemor(data))
  }, [bemorId])

  const [javoblar, setJavoblar] = useState<(number | null)[]>(Array(8).fill(null))

  const tuldi = javoblar.every((v) => v !== null)
  const jami = useMemo(() => javoblar.reduce((s: number, v) => s + (v ?? 0), 0), [javoblar])
  const natija = daraja(jami)

  function daraja(j: number) { return natijaDarajasi(j) }

  const javobBer = (i: number, val: number) => setJavoblar((arr) => arr.map((v, j) => (j === i ? val : v)))
  const qaytaBoshla = () => setJavoblar(Array(8).fill(null))

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'oab-v8', sarlavha: 'OAB-V8',
      xulosa: `Jami: ${jami} — ${natija.nom}`,
      malumot: { javoblar, jami },
    })
  }

  return (
    <AppShell title="OAB-V8">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemorId={bemorId} bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #9333ea, #d946ef)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>OAB-V8</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>OAB-V8</strong> — <em>Overactive Bladder Awareness Tool, 8 savollik versiya</em> (Giperaktiv siydik pufagi
            skrining anketasi). <strong>OAB</strong> (Overactive Bladder — giperaktiv siydik pufagi) — to&apos;satdan siyishga
            kuchli ehtiyoj (urgency), tez-tez siyish va ba&apos;zan inkontinensiya bilan kechadigan simptomlar majmuasi.
            Bu qisqa anketa OAB ehtimolini tez skrining qilish uchun ishlatiladi.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SAVOLLAR.map((matn, i) => (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '6px', background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0,
                }}>{i + 1}</span>
                <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, lineHeight: 1.4 }}>{matn}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '32px' }}>
                {VARIANTLAR.map((v, vi) => (
                  <button
                    key={v}
                    onClick={() => javobBer(i, vi)}
                    className="soft-press"
                    style={{
                      border: javoblar[i] === vi ? 'none' : '1px solid var(--line)',
                      background: javoblar[i] === vi ? 'var(--accent)' : 'var(--surface-2)',
                      color: javoblar[i] === vi ? 'white' : 'var(--ink-soft)',
                      borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s ease',
                    }}
                  >
                    {v} <span style={{ opacity: 0.7 }}>({vi})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{ marginTop: '22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px 26px' }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun barcha 8 savolga javob bering.</p>
          ) : (
            <>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Jami ball (0–40)</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: natija.rang, lineHeight: 1.1 }}>{jami}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: natija.rang, marginTop: '2px' }}>{natija.nom}</div>

              <div style={{ marginTop: '16px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                  <div style={{ flex: 8, background: '#16a34a22' }} />
                  <div style={{ flex: 32, background: '#dc262622' }} />
                </div>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px',
                  width: `${(jami / 40) * 100}%`, background: natija.rang, transition: 'width .3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--muted)', marginTop: '6px' }}>
                <span>0–7 past ehtimol</span><span>8–40 yuqori ehtimol</span>
              </div>

              <button onClick={qaytaBoshla} className="soft-press" style={{
                marginTop: '16px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>OAB</strong> (Overactive Bladder — giperaktiv siydik pufagi) — ICS (International Continence
              Society) ta&apos;rifiga ko&apos;ra, <strong>urgency</strong> (to&apos;satdan kuchli siyish ehtiyoji, ushlab turish qiyin) belgisi bilan
              kechadigan, ko&apos;pincha tez-tez siyish va nokturiya (tungi siyish) bilan birga uchraydigan, infeksiya yoki boshqa aniq
              patologiya bo&apos;lmagan holatda qo&apos;yiladigan klinik sindrom.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>OAB-V8</strong> anketasi 8 savoldan iborat, har biri so&apos;nggi 4 hafta ichida
              simptom qanchalik bezovta qilganini 0 (umuman bezovta qilmaydi) dan 5 (juda qattiq bezovta qiladi) ballgacha baholaydi.
              Jami ball <strong>0–40</strong> oralig&apos;ida bo&apos;ladi.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Chegara qiymat (cut-off):</strong> jami ball <strong>8 va undan yuqori</strong> bo&apos;lsa,
              OAB tashxisi ehtimoli yuqori deb hisoblanadi va qo&apos;shimcha urologik baholash (siydik tahlili, uroflowmetriya,
              dnevnik yuritish) tavsiya etiladi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Coyne KS va boshq. (2005) OAB-V8 validatsiya tadqiqoti. AUA/EAU OAB klinik qo&apos;llanmalari. Bu kalkulyator faqat klinik yordamchi vosita — yakuniy tashxis qo&apos;shimcha tekshiruvlar bilan tasdiqlanishi kerak.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
