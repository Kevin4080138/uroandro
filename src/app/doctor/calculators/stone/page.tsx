'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

// STONE skori — 5 ta klinik parametr (Moore va boshq., 2014)
// S — Sex (jins), T — Time (boshlanish vaqti), O — Origin (irq), N — Nausea (ko'ngil aynishi), E — Erythrocytes (eritrotsiturya)

const SAVOLLAR = [
  {
    key: 'jins', sarlavha: 'S — Sex (jins)',
    variantlar: [{ l: 'Ayol', b: 0 }, { l: 'Erkak', b: 2 }],
  },
  {
    key: 'vaqt', sarlavha: 'T — Time (og\'riq boshlanganidan beri o\'tgan vaqt)',
    variantlar: [{ l: '>24 soat', b: 0 }, { l: '<24 soat', b: 3 }],
  },
  {
    key: 'kelibChiqish', sarlavha: 'O — Origin (kelib chiqishi/irqi)',
    variantlar: [{ l: 'Afroamerikalik', b: 0 }, { l: 'Boshqa', b: 3 }],
  },
  {
    key: 'ko_ngilAynishi', sarlavha: 'N — Nausea (ko\'ngil aynishi/qusish)',
    variantlar: [{ l: "Yo'q", b: 0 }, { l: 'Faqat ko\'ngil aynishi', b: 1 }, { l: 'Qusish', b: 2 }],
  },
  {
    key: 'eritrotsiturya', sarlavha: 'E — Erythrocytes (siydikda eritrotsitlar)',
    variantlar: [{ l: "Yo'q", b: 0 }, { l: 'Bor (mikro/makrogematuriya)', b: 3 }],
  },
] as const

function natijaDarajasi(jami: number) {
  if (jami <= 5) return { nom: 'Past ehtimol', ehtimol: '~9.2%', rang: '#16a34a', tavsif: 'Toshning katta (≥5mm) bo\'lishi va obstruktiv toshlik ehtimoli past. Boshqa tashxislarni ham ko\'rib chiqish kerak.' }
  if (jami <= 9) return { nom: "O'rtacha ehtimol", ehtimol: '~51.6%', rang: '#d97706', tavsif: "Klinik baholash va tasvirlash (USI/KT) bilan tasdiqlash tavsiya etiladi." }
  return { nom: 'Yuqori ehtimol', ehtimol: '~89.6%', rang: '#dc2626', tavsif: 'Katta klinikaga muvofiq siydik yo\'li toshi ehtimoli yuqori. KT tasdiqlash tavsiya etiladi.' }
}

export default function StoneSkorKalkulyator() {
  const router = useRouter()
  const [javoblar, setJavoblar] = useState<Record<string, number | null>>({})

  const tuldi = SAVOLLAR.every((s) => javoblar[s.key] !== undefined && javoblar[s.key] !== null)
  const jami = useMemo(() => SAVOLLAR.reduce((sum, s) => sum + (javoblar[s.key] ?? 0), 0), [javoblar])
  const natija = tuldi ? natijaDarajasi(jami) : null

  const javobBer = (key: string, b: number) => setJavoblar((j) => ({ ...j, [key]: b }))
  const qaytaBoshla = () => setJavoblar({})

  return (
    <AppShell title="STONE skori">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #57534e, #a8a29e)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>STONE skori</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            O&apos;tkir tomon og&apos;rig&apos;i bilan murojaat qilgan bemorda <strong>siydik yo&apos;li toshi</strong> (urolitiaz) ehtimolini
            5 ta oddiy klinik parametr asosida bashorat qiladigan skor. <strong>STONE</strong> — har bir harf baholanadigan
            parametrni bildiradi: <em>Sex, Time, Origin, Nausea, Erythrocytes</em>.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SAVOLLAR.map((s, i) => (
            <div key={s.key} className="rise" style={{
              animationDelay: `${i * 0.06}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px',
            }}>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>{s.sarlavha}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {s.variantlar.map((v) => (
                  <button
                    key={v.l}
                    onClick={() => javobBer(s.key, v.b)}
                    className="soft-press"
                    style={{
                      border: javoblar[s.key] === v.b ? 'none' : '1px solid var(--line)',
                      background: javoblar[s.key] === v.b ? 'var(--accent)' : 'var(--surface-2)',
                      color: javoblar[s.key] === v.b ? 'white' : 'var(--ink-soft)',
                      borderRadius: '999px', padding: '7px 14px', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s ease',
                    }}
                  >
                    {v.l} <span style={{ opacity: 0.7 }}>(+{v.b})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{ marginTop: '22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px 26px' }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun barcha 5 parametrni belgilang.</p>
          ) : (
            <>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Jami ball (0–13)</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: natija!.rang, lineHeight: 1.1 }}>{jami}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: natija!.rang, marginTop: '2px' }}>{natija!.nom} <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--muted)' }}>({natija!.ehtimol})</span></div>
              <p style={{ margin: '12px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{natija!.tavsif}</p>
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
              <strong style={{ color: 'var(--ink)' }}>STONE skori</strong>ni Moore va hammualliflari 2014-yilda nashr etgan —
              o&apos;tkir tomon og&apos;rig&apos;i (renal kolika belgisi) bilan kelgan bemorlarda <strong>kompyuter tomografiyasi (KT)</strong>
              zarurligini kamaytirish maqsadida, klinik belgilar asosida toshning ehtimolini oldindan baholash uchun ishlab chiqilgan.
            </p>
            <p style={{ margin: 0 }}>Har bir harf quyidagini bildiradi:</p>
            <ul style={{ margin: '0 0 0 18px', padding: 0 }}>
              <li><strong>S</strong> — Sex (jins): erkaklarda toshlik ehtimoli statistik yuqoriroq</li>
              <li><strong>T</strong> — Time (vaqt): og&apos;riq 24 soatdan kam vaqt oldin boshlangan bo&apos;lsa, o&apos;tkir toshlikka xosroq</li>
              <li><strong>O</strong> — Origin (kelib chiqishi): original tadqiqotda irq omili kiritilgan (epidemiologik farq)</li>
              <li><strong>N</strong> — Nausea (ko&apos;ngil aynishi/qusish): siydik yo&apos;li toshiga xos refleks simptom</li>
              <li><strong>E</strong> — Erythrocytes (eritrotsiturya): siydikda qon zarrachalari — toshning shilliq qavatga shikast yetkazishi belgisi</li>
            </ul>
            <p style={{ margin: 0 }}>
              Jami ball <strong style={{ color: 'var(--ink)' }}>0–13</strong> oralig&apos;ida bo&apos;ladi: <strong style={{ color: '#16a34a' }}>0–5</strong> past,
              <strong style={{ color: '#d97706' }}> 6–9</strong> o&apos;rtacha, <strong style={{ color: '#dc2626' }}>10–13</strong> yuqori ehtimol toifalariga bo&apos;linadi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Moore CL va boshq. (2014) Development and external validation of the STONE score. BMJ. Bu kalkulyator faqat klinik yordamchi vosita — KT/USI tasdiqlash ehtiyojini shifokor belgilaydi.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
