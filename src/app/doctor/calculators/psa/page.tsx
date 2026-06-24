'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla, yoshHisobla } from '@/lib/kalkulyatorSaqlash'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }

// Yoshga moslashgan PSA me'zonlari (Oesterling va boshq., AUA qo'llanmasi)
const YOSH_MEZONLARI = [
  { oraliq: [40, 49], maxPSA: 2.5 },
  { oraliq: [50, 59], maxPSA: 3.5 },
  { oraliq: [60, 69], maxPSA: 4.5 },
  { oraliq: [70, 120], maxPSA: 6.5 },
]

function yoshMezoni(yosh: number) {
  return YOSH_MEZONLARI.find((m) => yosh >= m.oraliq[0] && yosh <= m.oraliq[1]) ?? YOSH_MEZONLARI[YOSH_MEZONLARI.length - 1]
}

// 4-10 ng/mL "kulrang zona"dagi erkin/umumiy PSA nisbati bo'yicha prostata saratoni ehtimoli (taxminiy, adabiyot asosida)
function fpsaXavf(foiz: number) {
  if (foiz < 10) return { daraja: 'Yuqori xavf', ehtimol: '~56%', rang: '#dc2626' }
  if (foiz < 15) return { daraja: "O'rtacha-yuqori xavf", ehtimol: '~28%', rang: '#ea580c' }
  if (foiz < 20) return { daraja: "O'rtacha xavf", ehtimol: '~20%', rang: '#d97706' }
  if (foiz < 25) return { daraja: 'Past-o\'rtacha xavf', ehtimol: '~16%', rang: '#65a30d' }
  return { daraja: 'Past xavf', ehtimol: '~8%', rang: '#16a34a' }
}

export default function PSAKalkulyator() {
  return (
    <Suspense fallback={null}>
      <PSAIchki />
    </Suspense>
  )
}

function PSAIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  const [yosh, setYosh] = useState('')
  const [psa, setPsa] = useState('')
  const [erkinPsa, setErkinPsa] = useState('')
  const [hajm, setHajm] = useState('')

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio, tugilgan_sana').eq('id', bemorId).single().then(({ data }) => {
      setBemor(data)
      const y = yoshHisobla(data?.tugilgan_sana)
      if (y !== null) setYosh(String(y))
    })
  }, [bemorId])

  const yoshN = parseFloat(yosh)
  const psaN = parseFloat(psa)
  const erkinN = parseFloat(erkinPsa)
  const hajmN = parseFloat(hajm)

  const mezon = useMemo(() => (Number.isFinite(yoshN) && yoshN >= 18 ? yoshMezoni(yoshN) : null), [yoshN])
  const yuqoriChegaradan = Number.isFinite(psaN) && mezon ? psaN > mezon.maxPSA : null

  const psad = Number.isFinite(psaN) && Number.isFinite(hajmN) && hajmN > 0 ? psaN / hajmN : null
  const fpsaFoiz = Number.isFinite(psaN) && Number.isFinite(erkinN) && psaN > 0 ? (erkinN / psaN) * 100 : null

  const tuldi = Number.isFinite(psaN)

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    const qismlar = [`PSA: ${psaN} ng/mL`]
    if (mezon) qismlar.push(yuqoriChegaradan ? "yoshga moslashgan chegaradan yuqori" : "me'zon doirasida")
    if (psad !== null) qismlar.push(`PSAD: ${psad.toFixed(3)}`)
    if (fpsaFoiz !== null) qismlar.push(`%fPSA: ${fpsaFoiz.toFixed(1)}%`)
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'psa', sarlavha: 'PSA kalkulyatori',
      xulosa: qismlar.join(', '),
      malumot: { yosh: yoshN, psa: psaN, erkinPsa: erkinN, hajm: hajmN, psad, fpsaFoiz },
    })
  }

  return (
    <AppShell title="PSA kalkulyatori">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #dc2626, #f97316)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>PSA kalkulyatori</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>PSA</strong> — <em>Prostate-Specific Antigen</em> (prostataga xos antigen) — qonda aniqlanadigan,
            prostata to&apos;qimasi tomonidan ishlab chiqariladigan oqsil. Uning darajasi yoshga moslashgan me&apos;zonlar,
            <strong> PSA zichligi (PSAD)</strong> va <strong>erkin/umumiy PSA nisbati (%fPSA)</strong> bilan birga baholanganda
            prostata saratoni xavfini aniqroq tasavvur qiladi.
          </p>
        </div>

        {/* Kiritish formasi */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px', marginBottom: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Bemor yoshi</label>
              <input style={inputStyle} type="number" value={yosh} onChange={(e) => setYosh(e.target.value)} placeholder="masalan, 62" />
            </div>
            <div>
              <label style={labelStyle}>Umumiy PSA (ng/mL) *</label>
              <input style={inputStyle} type="number" step="0.01" value={psa} onChange={(e) => setPsa(e.target.value)} placeholder="masalan, 5.2" />
            </div>
            <div>
              <label style={labelStyle}>Erkin PSA (ng/mL) — ixtiyoriy</label>
              <input style={inputStyle} type="number" step="0.01" value={erkinPsa} onChange={(e) => setErkinPsa(e.target.value)} placeholder="masalan, 0.9" />
            </div>
            <div>
              <label style={labelStyle}>Prostata hajmi (sm³) — ixtiyoriy</label>
              <input style={inputStyle} type="number" step="0.1" value={hajm} onChange={(e) => setHajm(e.target.value)} placeholder="masalan, 35" />
            </div>
          </div>
        </div>

        {/* Natijalar */}
        {!tuldi ? (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun umumiy PSA qiymatini kiriting.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Yoshga moslashgan me'zon */}
            {mezon && (
              <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Yoshga moslashgan me&apos;zon
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: yuqoriChegaradan ? '#dc2626' : '#16a34a' }}>{psaN}</span>
                    <span style={{ fontSize: '14px', color: 'var(--muted)' }}> ng/mL</span>
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)' }}>
                    {mezon.oraliq[0]}–{mezon.oraliq[1] === 120 ? '70+' : mezon.oraliq[1]} yosh uchun me&apos;zon: ≤ {mezon.maxPSA} ng/mL
                  </div>
                </div>
                <p style={{
                  margin: '10px 0 0', fontSize: '13.5px', fontWeight: 700,
                  color: yuqoriChegaradan ? '#dc2626' : '#16a34a',
                }}>
                  {yuqoriChegaradan ? "⚠ Yoshga moslashgan chegaradan yuqori — qo'shimcha tekshiruv tavsiya etiladi." : "✓ Yoshga moslashgan me'zon doirasida."}
                </p>
              </div>
            )}

            {/* 2. PSAD */}
            {psad !== null && (
              <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  PSA zichligi (PSAD)
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: psad > 0.15 ? '#dc2626' : '#16a34a' }}>{psad.toFixed(3)}</span>
                  <span style={{ fontSize: '13.5px', color: 'var(--ink-soft)' }}>ng/mL/sm³ — chegara: 0.15</span>
                </div>
                <p style={{ margin: '10px 0 0', fontSize: '13.5px', fontWeight: 700, color: psad > 0.15 ? '#dc2626' : '#16a34a' }}>
                  {psad > 0.15 ? '⚠ PSAD 0.15 dan yuqori — biopsiya ehtimolini ko\'rib chiqish tavsiya etiladi.' : "✓ PSAD me'zon doirasida."}
                </p>
              </div>
            )}

            {/* 3. %fPSA */}
            {fpsaFoiz !== null && (
              <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Erkin/umumiy PSA nisbati (%fPSA)
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '32px', fontWeight: 800, color: fpsaXavf(fpsaFoiz).rang }}>{fpsaFoiz.toFixed(1)}%</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: fpsaXavf(fpsaFoiz).rang }}>{fpsaXavf(fpsaFoiz).daraja}</span>
                </div>
                <p style={{ margin: '10px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)' }}>
                  PSA 4–10 ng/mL &quot;kulrang zona&quot;sidagi bemorlarda taxminiy prostata saratoni ehtimoli: <strong>{fpsaXavf(fpsaFoiz).ehtimol}</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Standart haqida */}
        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>PSA</strong> (Prostate-Specific Antigen) — prostata bezi hujayralari ishlab chiqaradigan serin proteaza fermenti.
              U prostata saratoniga xos emas — BPH, prostatit, jinsiy aloqa va boshqa sabablardan ham ko&apos;tarilishi mumkin, shu sabab uni boshqa ko&apos;rsatkichlar bilan birga baholash zarur.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Yoshga moslashgan me&apos;zonlar</strong> — yosh ulg&apos;ayishi bilan prostata fiziologik kattalashadi va PSA ham asta-sekin oshadi,
              shuning uchun bitta umumiy "4.0 ng/mL" chegarasi o&apos;rniga yosh guruhlari bo&apos;yicha alohida me&apos;zonlar qo&apos;llaniladi (Oesterling va boshq., AUA qo&apos;llanmasi).
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>PSAD</strong> (PSA Density — PSA zichligi) = umumiy PSA ÷ prostata hajmi (sm³). Katta prostatali bemorlarda PSA tabiiy ravishda yuqoriroq bo&apos;lishi mumkin,
              PSAD shu omilni hisobga oladi. <strong>0.15 ng/mL/sm³</strong> dan yuqori qiymat saraton xavfini oshiradi deb hisoblanadi.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>%fPSA</strong> (Free PSA foizi) — qondagi PSA ikki shaklda bo&apos;ladi: erkin (free) va oqsillarga bog&apos;langan (bound).
              Saraton hujayralari odatda ko&apos;proq bog&apos;langan PSA ishlab chiqaradi, shu sabab <strong>past %fPSA — yuqori xavf</strong>, <strong>yuqori %fPSA — past xavf</strong> belgisi hisoblanadi.
              Bu ko&apos;rsatkich ayniqsa PSA <strong>4–10 ng/mL</strong> oralig&apos;idagi (&quot;kulrang zona&quot;) bemorlarda biopsiya kerakligini aniqlashtirishda foydali.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: AUA va EAU klinik qo&apos;llanmalari, Oesterling JE va boshq. (1993) yoshga moslashgan PSA me&apos;zonlari bo&apos;yicha tadqiqoti. Bu kalkulyator faqat klinik yordamchi vosita — yakuniy qaror (biopsiya, MRT va h.k.) shifokor tomonidan qabul qilinadi.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
