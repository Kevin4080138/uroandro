'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

// Savol matnlari — har biri 0–5 ball, "1-haftalik" tajriba bo'yicha javob beriladi.
const SAVOLLAR = [
  {
    key: 'tuliq_bosalmaslik',
    matn: "So'nggi 1 oy ichida siydikni chiqarib bo'lgandan keyin siydik pufagi to'liq bo'shamagandek tuyulgan holatlar qanchalik tez-tez bo'lgan?",
    variantlar: ['Hech qachon', "5 martadan kamida 1 marta", 'Yarmidan kamida', 'Taxminan yarmida', 'Yarmidan ko\'pida', 'Deyarli har doim'],
  },
  {
    key: 'tezlik',
    matn: "So'nggi 1 oy ichida siydikni chiqargandan 2 soat o'tmay yana siyishga ehtiyoj qanchalik tez-tez bo'lgan?",
    variantlar: ['Hech qachon', "5 martadan kamida 1 marta", 'Yarmidan kamida', 'Taxminan yarmida', 'Yarmidan ko\'pida', 'Deyarli har doim'],
  },
  {
    key: 'uzilib_uzilib',
    matn: "So'nggi 1 oy ichida siyish vaqtida oqim bir necha marta to'xtab-to'xtab davom etgan holatlar qanchalik tez-tez bo'lgan?",
    variantlar: ['Hech qachon', "5 martadan kamida 1 marta", 'Yarmidan kamida', 'Taxminan yarmida', 'Yarmidan ko\'pida', 'Deyarli har doim'],
  },
  {
    key: 'toxtatolmaslik',
    matn: "So'nggi 1 oy ichida siyishni kechiktirish qiyin bo'lgan (zudlik bilan siyishga majbur bo'lgan) holatlar qanchalik tez-tez bo'lgan?",
    variantlar: ['Hech qachon', "5 martadan kamida 1 marta", 'Yarmidan kamida', 'Taxminan yarmida', 'Yarmidan ko\'pida', 'Deyarli har doim'],
  },
  {
    key: 'kuchsiz_oqim',
    matn: "So'nggi 1 oy ichida siydik oqimi kuchsiz bo'lgan holatlar qanchalik tez-tez bo'lgan?",
    variantlar: ['Hech qachon', "5 martadan kamida 1 marta", 'Yarmidan kamida', 'Taxminan yarmida', 'Yarmidan ko\'pida', 'Deyarli har doim'],
  },
  {
    key: 'kuchanish',
    matn: "So'nggi 1 oy ichida siyishni boshlash uchun kuchanishga (zo'riqishga) to'g'ri kelgan holatlar qanchalik tez-tez bo'lgan?",
    variantlar: ['Hech qachon', "5 martadan kamida 1 marta", 'Yarmidan kamida', 'Taxminan yarmida', 'Yarmidan ko\'pida', 'Deyarli har doim'],
  },
  {
    key: 'tungi_siyish',
    matn: "So'nggi 1 oy ichida, odatda, kechasi uxlab yotganda necha marta siyish uchun turishga to'g'ri kelgan?",
    variantlar: ['Hech qachon', '1 marta', '2 marta', '3 marta', '4 marta', '5 va undan ko\'p marta'],
  },
] as const

const QOL_VARIANTLAR = [
  'Juda mamnunman', 'Mamnunman', 'Asosan qoniqarli',
  'Aralash (taxminan baravar qoniqarli/noqoniqarli)', 'Asosan noqoniqarli', 'Noxush', 'Juda yomon',
]

function daraja(jami: number) {
  if (jami <= 7) return { nom: 'Yengil simptomlar', rang: '#16a34a', tavsif: 'Faol kuzatuv (watchful waiting) tavsiya etiladi, hayot tarzini o\'zgartirish yetarli bo\'lishi mumkin.' }
  if (jami <= 19) return { nom: "O'rtacha simptomlar", rang: '#d97706', tavsif: "Dorivor davolash (alfa-blokatorlar, 5-alfa-reduktaza inhibitorlari) ko'rib chiqilishi kerak." }
  return { nom: "Og'ir simptomlar", rang: '#dc2626', tavsif: 'Urolog konsultatsiyasi va keng tekshiruv, ko\'pincha jarrohlik davolanishi ko\'rib chiqiladi.' }
}

export default function IPSSPage() {
  const router = useRouter()
  const [javoblar, setJavoblar] = useState<(number | null)[]>(Array(7).fill(null))
  const [qol, setQol] = useState<number | null>(null)

  const tuldi = javoblar.every((v) => v !== null)
  const jami = useMemo(() => javoblar.reduce((s: number, v) => s + (v ?? 0), 0), [javoblar])
  const natija = daraja(jami)

  const javobBer = (i: number, val: number) => setJavoblar((arr) => arr.map((v, j) => (j === i ? val : v)))
  const qaytaBoshla = () => { setJavoblar(Array(7).fill(null)); setQol(null) }

  return (
    <AppShell title="IPSS / AUA-SS kalkulyatori">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        {/* Sarlavha va ma'lumot */}
        <div className="rise" style={{
          background: 'linear-gradient(135deg, #2563eb, #0891b2)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>IPSS / AUA-SS</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>IPSS</strong> — <em>International Prostate Symptom Score</em> (Xalqaro prostata simptomlari indeksi).
            U <strong>AUA-SS</strong> (<em>American Urological Association Symptom Score</em>) bilan savollari bo&apos;yicha bir xil —
            farqi shundaki, IPSS qo&apos;shimcha 8-savol — <strong>hayot sifati (QoL, Quality of Life)</strong> indeksini ham o&apos;z ichiga oladi.
            Benign prostata giperplaziyasi (BPH) bo&apos;lgan erkaklarda siydik chiqarish simptomlarining
            og&apos;irlik darajasini standartlashtirilgan tarzda baholash uchun ishlatiladi — EAU va AUA qo&apos;llanmalarida tavsiya etilgan asosiy vosita.
          </p>
        </div>

        {/* Savollar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {SAVOLLAR.map((s, i) => (
            <div key={s.key} className="rise" style={{
              animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '7px', background: 'var(--accent-soft)', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0,
                }}>{i + 1}</span>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{s.matn}</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '34px' }}>
                {s.variantlar.map((v, vi) => (
                  <button
                    key={v}
                    onClick={() => javobBer(i, vi)}
                    className="soft-press"
                    style={{
                      border: javoblar[i] === vi ? 'none' : '1px solid var(--line)',
                      background: javoblar[i] === vi ? 'var(--accent)' : 'var(--surface-2)',
                      color: javoblar[i] === vi ? 'white' : 'var(--ink-soft)',
                      borderRadius: '999px', padding: '6px 13px', fontSize: '12.5px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s ease',
                    }}
                  >
                    {v} <span style={{ opacity: 0.7 }}>({vi})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* QoL savoli — jamiga qo'shilmaydi, alohida ko'rsatiladi */}
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px dashed var(--line)', borderRadius: '14px', padding: '18px 20px',
            animationDelay: '.4s',
          }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <span style={{
                width: '24px', height: '24px', borderRadius: '7px', background: 'var(--surface-2)', color: 'var(--muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0,
              }}>QoL</span>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>
                Agar qolgan umringizni hozirgi siydik chiqarish holatingiz bilan o&apos;tkazishga to&apos;g&apos;ri kelsa, buni qanday baholardingiz? <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(jamiga qo&apos;shilmaydi, qo&apos;shimcha ko&apos;rsatkich)</span>
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '34px' }}>
              {QOL_VARIANTLAR.map((v, vi) => (
                <button
                  key={v}
                  onClick={() => setQol(vi)}
                  className="soft-press"
                  style={{
                    border: qol === vi ? 'none' : '1px solid var(--line)',
                    background: qol === vi ? 'var(--ink)' : 'var(--surface-2)',
                    color: qol === vi ? 'var(--surface)' : 'var(--ink-soft)',
                    borderRadius: '999px', padding: '6px 13px', fontSize: '12.5px', fontWeight: 600,
                    cursor: 'pointer', transition: 'all .15s ease',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Natija */}
        <div className="rise" style={{
          marginTop: '22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '24px 26px', animationDelay: '.45s',
        }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
              Natijani ko&apos;rish uchun yuqoridagi 7 ta savolga javob bering.
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Jami ball (0–35)</div>
                  <div style={{ fontSize: '40px', fontWeight: 800, color: natija.rang, lineHeight: 1.1 }}>{jami}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: natija.rang, marginTop: '2px' }}>{natija.nom}</div>
                </div>
                {qol !== null && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>QoL indeksi (0–6)</div>
                    <div style={{ fontSize: '26px', fontWeight: 800 }}>{qol}</div>
                  </div>
                )}
              </div>

              {/* Progress bar — 3 zonali */}
              <div style={{ marginTop: '16px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                  <div style={{ width: `${(7 / 35) * 100}%`, background: '#16a34a22' }} />
                  <div style={{ width: `${(12 / 35) * 100}%`, background: '#d9770622' }} />
                  <div style={{ width: `${(16 / 35) * 100}%`, background: '#dc262622' }} />
                </div>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px',
                  width: `${(jami / 35) * 100}%`, background: natija.rang, transition: 'width .3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
                <span>0–7 yengil</span>
                <span>8–19 o&apos;rtacha</span>
                <span>20–35 og&apos;ir</span>
              </div>

              <p style={{ marginTop: '16px', marginBottom: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                {natija.tavsif}
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

        {/* Standart haqida batafsil */}
        <div className="rise" style={{
          marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '22px 24px', animationDelay: '.5s',
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>IPSS</strong> (International Prostate Symptom Score) — 1992-yilda AUA (American Urological Association)
              tomonidan ishlab chiqilgan va keyinchalik Xalqaro Urologiya Konsultatsiyasi (International Consultation on Urological Diseases)
              tomonidan qabul qilingan, dunyoda eng keng tarqalgan pastki siydik yo&apos;llari simptomlari (LUTS — Lower Urinary Tract Symptoms) baholash anketasi.
            </p>
            <p style={{ margin: 0 }}>
              Har bir savol <strong style={{ color: 'var(--ink)' }}>0 dan 5 ballgacha</strong> baholanadi (0 — hech qachon, 5 — deyarli har doim/5 marta va undan ko&apos;p),
              jami <strong style={{ color: 'var(--ink)' }}>0–35 ball</strong> oralig&apos;ida natija beradi:
            </p>
            <ul style={{ margin: '0 0 0 18px', padding: 0 }}>
              <li><strong style={{ color: '#16a34a' }}>0–7</strong> — yengil simptomlar (mild)</li>
              <li><strong style={{ color: '#d97706' }}>8–19</strong> — o&apos;rtacha simptomlar (moderate)</li>
              <li><strong style={{ color: '#dc2626' }}>20–35</strong> — og&apos;ir simptomlar (severe)</li>
            </ul>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>QoL</strong> (Quality of Life) — 8-savol, jamiga qo&apos;shilmaydi, lekin simptomlarning bemor
              hayotiga ta&apos;sirini (0 — juda mamnun, 6 — juda yomon) alohida ko&apos;rsatadi va davolash qaroriga ta&apos;sir qiladi.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>BPH</strong> (Benign Prostatic Hyperplasia) — prostata bezining xavfsiz (saratonsiz) kattalashishi,
              IPSS asosan shu holatdagi simptomlarni kuzatish va davolash samarasini baholash uchun qo&apos;llaniladi (masalan, davolanishdan oldin va keyin solishtirish).
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: EAU (European Association of Urology) va AUA klinik qo&apos;llanmalari. Bu kalkulyator faqat klinik yordamchi vosita, yakuniy tashxis va davolash qarori shifokor tomonidan qabul qilinadi.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
