'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

type Kasallik = { id: string; nom: string; izoh: string; ball: number }

const KASALLIKLAR: Kasallik[] = [
  // 1 ball
  { id: 'mi', nom: 'Miokard infarkti', izoh: 'Anamnezda EKG o\'zgarishlari bilan tasdiqlanган', ball: 1 },
  { id: 'chf', nom: 'Yurak yetishmovchiligi (YuY)', izoh: 'Simptomatik, davolash talab qiladi', ball: 1 },
  { id: 'pvd', nom: 'Periferik tomirlar kasalligi', izoh: 'Klaudikatsiya, aorta anevrizmasi yoki revaskularizatsiya', ball: 1 },
  { id: 'cvd', nom: 'Serebrovaskulyar kasallik', izoh: 'Insult yoki TIA anamnezda', ball: 1 },
  { id: 'dem', nom: 'Demensiya', izoh: 'Kognitiv buzilish, kundalik faoliyatga ta\'sir', ball: 1 },
  { id: 'copd', nom: 'Surunkali o\'pka kasalligi (SOK)', izoh: 'YOOO, asthma, emfizema', ball: 1 },
  { id: 'ctd', nom: 'Biriktiruvchi to\'qima kasalligi', izoh: 'SLE, RA, polimiozit va boshqalar', ball: 1 },
  { id: 'pu', nom: 'Peptik yarа', izoh: 'Anamnezdagi gastrik/duodenal yara', ball: 1 },
  { id: 'mld', nom: 'Yengil jigar kasalligi', izoh: 'Sariqliksiz gepatit, sirroz', ball: 1 },
  { id: 'dm', nom: 'Qandli diabet (asoratsiz)', izoh: 'Insulin yoki og\'iz preparatlarida, organ shikastlanishisiz', ball: 1 },
  // 2 ball
  { id: 'hemi', nom: 'Gemiplegiya', izoh: 'Insult yoki boshqa sababdan', ball: 2 },
  { id: 'ckd', nom: 'O\'rtacha/og\'ir buyrak kasalligi', izoh: 'Kreatinin > 3 mg/dL yoki dializ', ball: 2 },
  { id: 'dmeo', nom: 'Qandli diabet (organ shikastlanishi bilan)', izoh: 'Retinopatiya, nefropatiya, neyropatiya', ball: 2 },
  { id: 'tumor', nom: 'Saraton (metastazsiz)', izoh: 'So\'nggi 5 yilda aniqlangan, metastazsiz', ball: 2 },
  { id: 'leuk', nom: 'Leykemiya', izoh: 'O\'tkir yoki surunkali leykemiya', ball: 2 },
  { id: 'lymp', nom: 'Limfoma', izoh: 'Limfoma, Xodzhkin kasalligi, ko\'p myeloma', ball: 2 },
  // 3 ball
  { id: 'sld', nom: 'O\'rtacha/og\'ir jigar kasalligi', izoh: 'Portal gipertenziya, sariqlik bilan sirroz', ball: 3 },
  // 6 ball
  { id: 'meta', nom: 'Metastatik saraton', izoh: 'Uzoq a\'zolarga metastaz', ball: 6 },
  { id: 'aids', nom: 'AIDS', izoh: 'Klinik jihatdan yaqqol AIDS (faqat HIV emas)', ball: 6 },
]

const YOSh_BALI = [
  { label: '< 50 yosh', ball: 0 },
  { label: '50–59 yosh', ball: 1 },
  { label: '60–69 yosh', ball: 2 },
  { label: '70–79 yosh', ball: 3 },
  { label: '≥ 80 yosh', ball: 4 },
]

function tiriklik10Yil(cci: number): string {
  if (cci === 0) return '98%'
  if (cci <= 2) return '89%'
  if (cci <= 4) return '76%'
  if (cci <= 5) return '49%'
  return '21%'
}

function xavf(cci: number) {
  if (cci <= 1) return { nom: 'Past', rang: '#16a34a' }
  if (cci <= 3) return { nom: "O'rtacha", rang: '#eab308' }
  if (cci <= 5) return { nom: 'Yuqori', rang: '#f97316' }
  return { nom: "Juda yuqori", rang: '#dc2626' }
}

export default function CharlsonPage() {
  const router = useRouter()
  const [tanlangan, setTanlangan] = useState<Set<string>>(new Set())
  const [yoshBal, setYoshBal] = useState(0)

  const toggle = (id: string) => setTanlangan(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const kasallikBali = KASALLIKLAR.filter(k => tanlangan.has(k.id)).reduce((s, k) => s + k.ball, 0)
  const jami = kasallikBali + yoshBal
  const nat = xavf(jami)

  const gruplar = [
    { sarlavha: '1 balllik kasalliklar', kasalliklar: KASALLIKLAR.filter(k => k.ball === 1) },
    { sarlavha: '2 balllik kasalliklar', kasalliklar: KASALLIKLAR.filter(k => k.ball === 2) },
    { sarlavha: '3 balllik kasalliklar', kasalliklar: KASALLIKLAR.filter(k => k.ball === 3) },
    { sarlavha: '6 balllik kasalliklar', kasalliklar: KASALLIKLAR.filter(k => k.ball === 6) },
  ]

  return (
    <AppShell title="Charlson Comorbidity Index">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #0369a1, #6366f1)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>Charlson Comorbidity Index (CCI)</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            Operatsiya va davolash xavfini baholash uchun 19 komorbiditеt va yosh asosida 10 yillik tiriklik ehtimolini hisoblash.
            Urologik operatsiyalardan oldin keng qo&apos;llaniladi.
          </p>
        </div>

        {/* Yosh */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '14px' }}>
          <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700 }}>Yosh guruhi</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {YOSh_BALI.map(y => (
              <button
                key={y.label}
                onClick={() => setYoshBal(y.ball)}
                className="soft-press"
                style={{
                  padding: '8px 16px', borderRadius: '999px', border: yoshBal === y.ball ? 'none' : '1px solid var(--line)',
                  background: yoshBal === y.ball ? 'var(--accent)' : 'var(--surface-2)',
                  color: yoshBal === y.ball ? 'white' : 'var(--ink-soft)',
                  fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
                }}
              >
                {y.label} {y.ball > 0 && `(+${y.ball})`}
              </button>
            ))}
          </div>
        </div>

        {/* Kasalliklar */}
        {gruplar.map(g => (
          <div key={g.sarlavha} className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 20px', marginBottom: '14px' }}>
            <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{g.sarlavha}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {g.kasalliklar.map(k => (
                <label key={k.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
                  padding: '9px 12px', borderRadius: '10px',
                  background: tanlangan.has(k.id) ? 'var(--accent-soft)' : 'transparent',
                  transition: 'background .15s',
                }}>
                  <input
                    type="checkbox"
                    checked={tanlangan.has(k.id)}
                    onChange={() => toggle(k.id)}
                    style={{ marginTop: '2px', width: '17px', height: '17px', accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: tanlangan.has(k.id) ? 700 : 500 }}>{k.nom}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{k.izoh}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Natija */}
        <div className="rise" style={{
          background: nat.rang + '18', border: `2px solid ${nat.rang}`,
          borderRadius: '16px', padding: '24px 26px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: nat.rang, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '.04em', marginBottom: '6px' }}>
                CCI Ball (yosh bilan)
              </div>
              <div style={{ fontSize: '52px', fontWeight: 800, color: nat.rang, lineHeight: 1 }}>{jami}</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: nat.rang, marginTop: '4px' }}>{nat.nom} komorbidlik xavfi</div>
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '16px 20px', textAlign: 'center', minWidth: '130px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '4px' }}>
                10 yillik tiriklik (taxminiy)
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: nat.rang }}>{tiriklik10Yil(jami)}</div>
            </div>
          </div>
          {tanlangan.size > 0 && (
            <div style={{ marginTop: '12px', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
              Kasalliklar bali: {kasallikBali} | Yosh bali: {yoshBal} | Jami: {jami}
            </div>
          )}
        </div>

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Charlson Comorbidity Index (CCI)</strong> — 1987-yilda ME Charlson tomonidan ishlab
              chiqilgan, 19 ta kasallik va yosh omilini hisobga oluvchi komorbidlik indeksi. Urologiyada radikal prostatektomiya,
              nefrektomiya va boshqa operatsiyalar oldidan xavfni baholashda standart vosita.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Charlson ME et al. J Chronic Dis 1987; 40:373. Deyo RA et al. J Clin Epidemiol 1992.
              Faqat klinik yordamchi vosita — yakuniy qaror shifokor tomonidan qabul qilinadi.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
