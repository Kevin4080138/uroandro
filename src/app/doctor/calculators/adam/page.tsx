'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla } from '@/lib/kalkulyatorSaqlash'

// ADAM (Androgen Deficiency in Aging Males) anketasi — 10 ha/yo'q savol
const SAVOLLAR = [
  "Jinsiy mayl (libido) pasaygan deb his qilasizmi?",
  "Quvvatsizlik/energiya kamayganini his qilasizmi?",
  "Jismoniy kuch va chidamlilik pasaygan deb his qilasizmi?",
  "Bo'yingiz pasaygan deb his qilasizmi (qad-qomatda)?",
  "Hayotdan zavqlanish kamaygan deb his qilasizmi?",
  "G'amgin yoki asabiy his qilasizmi?",
  "Erektsiyalaringiz oldingidan zaifroq deb his qilasizmi?",
  "Sportda (jismoniy yuklamada) ko'rsatkichlaringiz pasaygan deb his qilasizmi?",
  "Kechqurun ovqatdan keyin uxlab qolasizmi?",
  "Ish faoliyatingiz (samaradorligingiz) pasaygan deb his qilasizmi?",
] as const

export default function ADAMPage() {
  return (
    <Suspense fallback={null}>
      <ADAMIchki />
    </Suspense>
  )
}

function ADAMIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio').eq('id', bemorId).single().then(({ data }) => setBemor(data))
  }, [bemorId])

  const [javoblar, setJavoblar] = useState<(boolean | null)[]>(Array(10).fill(null))

  const tuldi = javoblar.every((v) => v !== null)
  // ADAM anketasi musbat hisoblanadi: 1-savol HA, YOKI 7-savol HA, YOKI boshqa har qanday 3 ta savolga HA
  const musbat = useMemo(() => {
    if (!tuldi) return null
    const libido = javoblar[0]
    const erektsiya = javoblar[6]
    const haSoni = javoblar.filter(Boolean).length
    return libido || erektsiya || haSoni >= 3
  }, [javoblar, tuldi])

  const javobBer = (i: number, val: boolean) => setJavoblar((arr) => arr.map((v, j) => (j === i ? val : v)))
  const qaytaBoshla = () => setJavoblar(Array(10).fill(null))
  const haSoni = javoblar.filter(Boolean).length

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'adam', sarlavha: 'Testosteron tanqisligi (ADAM)',
      xulosa: `${haSoni}/10 "Ha" — ${musbat ? 'Test musbat' : 'Test manfiy'}`,
      malumot: { javoblar, haSoni, musbat },
    })
  }

  return (
    <AppShell title="Testosteron tanqisligi (ADAM)">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemorId={bemorId} bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #4338ca, #6366f1)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>Testosteron tanqisligi (ADAM)</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>ADAM</strong> — <em>Androgen Deficiency in the Aging Male</em> (Yoshi ulg&apos;aygan erkaklarda androgen tanqisligi) —
            erkaklarda testosteron darajasi pasayishi (gipogonadizm) belgilarini tezkor skrining qilish uchun ishlatiladigan
            10 savollik anketa. Diagnostik test emas, balki <strong>kim laboratoriya tekshiruvi (umumiy testosteron)
            qilishi kerakligini</strong> aniqlashga yordam beradi.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SAVOLLAR.map((matn, i) => (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.04, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
              padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '220px' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '6px', background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0,
                }}>{i + 1}</span>
                <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, lineHeight: 1.4 }}>{matn}</p>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[{ v: true, label: 'Ha' }, { v: false, label: "Yo'q" }].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => javobBer(i, opt.v)}
                    className="soft-press"
                    style={{
                      border: javoblar[i] === opt.v ? 'none' : '1px solid var(--line)',
                      background: javoblar[i] === opt.v ? (opt.v ? '#dc2626' : 'var(--accent)') : 'var(--surface-2)',
                      color: javoblar[i] === opt.v ? 'white' : 'var(--ink-soft)',
                      borderRadius: '999px', padding: '6px 16px', fontSize: '12.5px', fontWeight: 700,
                      cursor: 'pointer', transition: 'all .15s ease', minWidth: '56px',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{
          marginTop: '22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '24px 26px',
        }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
              Natijani ko&apos;rish uchun barcha 10 savolga &quot;Ha&quot; yoki &quot;Yo&apos;q&quot; bilan javob bering.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>&quot;Ha&quot; javoblar soni</div>
                  <div style={{ fontSize: '34px', fontWeight: 800, lineHeight: 1.1 }}>{haSoni} / 10</div>
                </div>
                <div style={{
                  fontSize: '15px', fontWeight: 800, color: musbat ? '#dc2626' : '#16a34a',
                  background: musbat ? '#dc26261a' : '#16a34a1a', borderRadius: '12px', padding: '10px 18px',
                }}>
                  {musbat ? '⚠ Test musbat' : '✓ Test manfiy'}
                </div>
              </div>
              <p style={{ margin: '14px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                {musbat
                  ? "Anketa musbat hisoblanadi — bu androgen tanqisligi ehtimolini bildiradi. Tasdiqlash uchun ertalabki umumiy testosteron (va zarur bo'lsa erkin testosteron, LH) laboratoriya tahlili tavsiya etiladi."
                  : "Anketa manfiy — androgen tanqisligi ehtimoli past, lekin klinik shubha bo'lsa baribir laboratoriya tekshiruvi rad etilmaydi."}
              </p>

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
              <strong style={{ color: 'var(--ink)' }}>ADAM</strong> anketasini Morley va hammualliflari (Saint Louis universiteti) 2000-yilda
              yoshi ulg&apos;aygan erkaklarda <strong>gipogonadizm</strong> (jinsiy bezlar funksiyasi pasayishi, testosteron yetishmovchiligi)
              belgilarini tezkor skrining qilish uchun ishlab chiqqan.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Hisoblash qoidasi:</strong> anketa quyidagi hollarda <strong>musbat</strong> (testosteron pasayishi ehtimoli yuqori) deb hisoblanadi:
            </p>
            <ul style={{ margin: '0 0 0 18px', padding: 0 }}>
              <li>1-savolga (libido pasayishi) <strong>&quot;Ha&quot;</strong> javob berilgan, YOKI</li>
              <li>7-savolga (erektsiya zaiflashishi) <strong>&quot;Ha&quot;</strong> javob berilgan, YOKI</li>
              <li>boshqa istalgan <strong>3 ta yoki undan ko&apos;p</strong> savolga &quot;Ha&quot; javob berilgan</li>
            </ul>
            <p style={{ margin: 0 }}>
              Test yuqori sezuvchanlikka (sensitivity), lekin nisbatan past xususiyatlilikka (specificity) ega — ya&apos;ni
              musbat natija ko&apos;pincha boshqa sabablar (stress, depressiya, qarish) bilan ham bog&apos;liq bo&apos;lishi mumkin,
              shuning uchun <strong style={{ color: 'var(--ink)' }}>faqat skrining vositasi</strong> hisoblanadi va laboratoriya
              tasdiqlanishini talab qiladi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Morley JE va boshq. (2000) ADAM anketasi validatsiya tadqiqoti, Saint Louis University. EAU/AUA erkaklar gipogonadizmi qo&apos;llanmalari. Bu kalkulyator faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
