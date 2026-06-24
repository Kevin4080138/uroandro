'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla } from '@/lib/kalkulyatorSaqlash'

const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }

// R.E.N.A.L. Nephrometry Score (Kutikov & Uzzo, 2009)
const SAVOLLAR = [
  {
    key: 'R', sarlavha: 'R — Radius (o\'sma o\'lchami, eng katta diametri)',
    izoh: 'Santimetrda o\'lchanadi',
    variantlar: [{ l: '≤4 sm', b: 1 }, { l: '>4 va <7 sm', b: 2 }, { l: '≥7 sm', b: 3 }],
  },
  {
    key: 'E', sarlavha: 'E — Exophytic/endophytic (tashqi/ichki joylashish)',
    izoh: 'O\'smaning buyrak yuzasidan chiqib turish darajasi',
    variantlar: [{ l: '≥50% tashqarida', b: 1 }, { l: '<50% tashqarida', b: 2 }, { l: 'Butunlay ichkarida (endofitik)', b: 3 }],
  },
  {
    key: 'N', sarlavha: 'N — Nearness (kosacha-jom tizimiga yaqinligi)',
    izoh: 'Eng yaqin masofa, mm',
    variantlar: [{ l: '≥7 mm', b: 1 }, { l: '>4 va <7 mm', b: 2 }, { l: '≤4 mm', b: 3 }],
  },
  {
    key: 'A', sarlavha: 'A — Anterior/posterior (oldingi/orqa joylashish)',
    izoh: 'Faqat tasniflash uchun, balga ta\'sir qilmaydi',
    variantlar: [{ l: 'Aniqlanmagan', b: 0 }, { l: 'Oldingi (anterior)', b: 0 }, { l: 'Orqa (posterior)', b: 0 }],
  },
  {
    key: 'L', sarlavha: 'L — Location (qutb chizig\'iga nisbatan joylashishi)',
    izoh: 'Yuqori/quyi qutb chiziqlariga nisbatan',
    variantlar: [{ l: 'Qutbdan tashqarida', b: 1 }, { l: 'Qutb chizig\'ini kesib o\'tadi', b: 2 }, { l: '>50% o\'rta zonada / chiziqni kesadi', b: 3 }],
  },
] as const

function natijaDarajasi(jami: number) {
  if (jami <= 6) return { nom: 'Past murakkablik', rang: '#16a34a', tavsif: 'Partial nefrektomiya (organ saqlovchi jarrohlik) texnik jihatdan kamroq murakkab.' }
  if (jami <= 9) return { nom: "O'rtacha murakkablik", rang: '#d97706', tavsif: 'Jarrohlik rejasini diqqat bilan tuzish, ko\'pincha tajribali jarrohlik markazida bajarish tavsiya etiladi.' }
  return { nom: "Yuqori murakkablik", rang: '#dc2626', tavsif: 'Partial nefrektomiya texnik jihatdan yuqori murakkab, asoratlar xavfi oshgan — radikal nefrektomiya yoki yuqori malakali jarroh tavsiya etiladi.' }
}

export default function RenalKalkulyator() {
  return (
    <Suspense fallback={null}>
      <RenalIchki />
    </Suspense>
  )
}

function RenalIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio').eq('id', bemorId).single().then(({ data }) => setBemor(data))
  }, [bemorId])

  const [javoblar, setJavoblar] = useState<Record<string, number | null>>({})
  const [qism, setQism] = useState<string>('')

  const baliQilinadiganlar = SAVOLLAR.filter((s) => s.key !== 'A')
  const tuldi = baliQilinadiganlar.every((s) => javoblar[s.key] !== undefined && javoblar[s.key] !== null)
  const jami = useMemo(() => baliQilinadiganlar.reduce((sum, s) => sum + (javoblar[s.key] ?? 0), 0), [javoblar])
  const natija = tuldi ? natijaDarajasi(jami) : null

  const javobBer = (key: string, b: number) => setJavoblar((j) => ({ ...j, [key]: b }))

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'renal', sarlavha: 'R.E.N.A.L. nefrometriya',
      xulosa: `Jami: ${jami}${qism === 'Orqa (posterior)' ? 'p' : qism === 'Oldingi (anterior)' ? 'a' : ''} — ${natija!.nom}`,
      malumot: { javoblar, qism, jami },
    })
  }

  return (
    <AppShell title="R.E.N.A.L. nefrometriya">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemorId={bemorId} bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #15803d, #84cc16)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>R.E.N.A.L. nefrometriya skori</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            Buyrak o&apos;smasining USI/KT/MRT tasviriga asoslangan, standartlashtirilgan tarzda
            <strong> jarrohlik murakkabligini</strong> baholash tizimi. Har bir harf o&apos;sma anatomiyasining bir jihatini ifodalaydi:
            <strong> R</strong>adius, <strong>E</strong>xophytic/endophytic, <strong>N</strong>earness, <strong>A</strong>nterior/posterior, <strong>L</strong>ocation.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SAVOLLAR.map((s, i) => (
            <div key={s.key} className="rise" style={{
              animationDelay: `${i * 0.06}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700 }}>{s.sarlavha}</p>
              <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--muted)' }}>{s.izoh}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {s.variantlar.map((v) => (
                  <button
                    key={v.l}
                    onClick={() => { javobBer(s.key, v.b); if (s.key === 'A') setQism(v.l) }}
                    className="soft-press"
                    style={{
                      border: javoblar[s.key] === v.b && (s.key !== 'A' || qism === v.l) ? 'none' : '1px solid var(--line)',
                      background: javoblar[s.key] === v.b && (s.key !== 'A' || qism === v.l) ? 'var(--accent)' : 'var(--surface-2)',
                      color: javoblar[s.key] === v.b && (s.key !== 'A' || qism === v.l) ? 'white' : 'var(--ink-soft)',
                      borderRadius: '999px', padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s ease',
                    }}
                  >
                    {v.l}{s.key !== 'A' && <span style={{ opacity: 0.7 }}> (+{v.b})</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{ marginTop: '22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px 26px' }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun R, E, N, L parametrlarini belgilang (A — faqat tasniflash, balga ta&apos;sir qilmaydi).</p>
          ) : (
            <>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>
                Jami ball (4–12){qism && ` · ${qism}`}
              </div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: natija!.rang, lineHeight: 1.1 }}>{jami}{qism === 'Orqa (posterior)' ? 'p' : qism === 'Oldingi (anterior)' ? 'a' : ''}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: natija!.rang, marginTop: '2px' }}>{natija!.nom}</div>
              <p style={{ margin: '12px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{natija!.tavsif}</p>
            </>
          )}
        </div>

        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>R.E.N.A.L. nefrometriya skori</strong>ni Kutikov va Uzzo 2009-yilda taklif qilgan —
              buyrak hujayrali saraton (RCC — Renal Cell Carcinoma) yoki boshqa buyrak o&apos;smalari uchun <strong>partial nefrektomiya</strong>
              (faqat o&apos;smani olib tashlash, organ saqlovchi jarrohlik) qanchalik texnik murakkab bo&apos;lishini oldindan bashorat qilish uchun ishlatiladi.
            </p>
            <p style={{ margin: 0 }}>Har bir harf quyidagini bildiradi (1–3 ball, jami 4–12 ball):</p>
            <ul style={{ margin: '0 0 0 18px', padding: 0 }}>
              <li><strong>R</strong> — Radius: o&apos;smaning eng katta diametri (sm)</li>
              <li><strong>E</strong> — Exophytic/Endophytic: o&apos;sma qanchalik buyrak yuzasidan tashqarida (ekzofitik) yoki ichida (endofitik) joylashganligi</li>
              <li><strong>N</strong> — Nearness: o&apos;smaning kosacha-jom tizimi yoki sinusga yaqinligi (mm)</li>
              <li><strong>A</strong> — Anterior/posterior: o&apos;smaning buyrakning oldingi yoki orqa yuzasida joylashishi (ballga ta&apos;sir qilmaydi, faqat qo&apos;shimcha tasnif — natija oxiriga &quot;a&quot; yoki &quot;p&quot; qo&apos;shiladi)</li>
              <li><strong>L</strong> — Location: o&apos;smaning yuqori/quyi qutb chizig&apos;iga nisbatan joylashishi</li>
            </ul>
            <p style={{ margin: 0 }}>
              Yakuniy ball <strong style={{ color: 'var(--ink)' }}>4–6</strong> — past, <strong style={{ color: 'var(--ink)' }}>7–9</strong> — o&apos;rtacha,
              <strong style={{ color: 'var(--ink)' }}> 10–12</strong> — yuqori murakkablik darajasini bildiradi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Kutikov A, Uzzo RG. The R.E.N.A.L. nephrometry score. J Urol. 2009. EAU buyrak hujayrali saraton qo&apos;llanmasi. Bu kalkulyator faqat klinik yordamchi vosita — jarrohlik rejasi mas\'ul jarroh tomonidan belgilanadi.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
