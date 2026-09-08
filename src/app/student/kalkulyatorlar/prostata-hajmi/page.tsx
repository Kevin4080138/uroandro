'use client'

import { useMemo, useState } from 'react'
import { UrologiyaKalkulyatorQobiq, UroOgohlantirish, uroInput, uroKarta, uroLabel } from '@/components/UrologiyaKalkulyatorQobiq'
import { KlinikIzoh, ChegaraviyBelgi, ManbaMeta } from '@/components/KlinikIzoh'
import { prostataHajm, prostataHajmDarajasi, PSAD_CHEGARA, sonOqi } from '@/lib/urologiyaHisoblash'

export default function ProstataHajmiTalabaPage() {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [psa, setPsa] = useState('')

  const aN = sonOqi(a), bN = sonOqi(b), cN = sonOqi(c), psaN = sonOqi(psa)
  const tuldi = [aN, bN, cN].every(v => Number.isFinite(v) && v > 0)
  const hajm = useMemo(() => (tuldi ? prostataHajm(aN, bN, cN) : null), [aN, bN, cN, tuldi])
  const daraja = hajm !== null ? prostataHajmDarajasi(hajm) : null
  const psad = hajm && Number.isFinite(psaN) && psaN > 0 ? psaN / hajm : null
  const psadChegaraviy = psad !== null && Math.abs(psad - PSAD_CHEGARA) < 0.03

  const maydonlar = [
    ['Uzunlik / a (mm)', a, setA, '40'], ['Kenglik / b (mm)', b, setB, '35'],
    ['Balandlik / c (mm)', c, setC, '32'], ['Umumiy PSA (ng/mL) — ixtiyoriy', psa, setPsa, 'PSAD uchun'],
  ] as const

  return <UrologiyaKalkulyatorQobiq title="Prostata hajmi (ellipsoid formula)" subtitle="USI dagi uch o‘lcham asosida prostata hajmini va (PSA berilsa) PSA zichligini hisoblaydi.">
    <section className="rise" style={{ ...uroKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {maydonlar.map(([label, value, setter, ph]) => (
          <div key={label}><label style={uroLabel}>{label}</label><input style={uroInput} inputMode="decimal" value={value} onChange={e => setter(e.target.value)} placeholder={ph} /></div>
        ))}
      </div>
    </section>

    <section className="rise" style={uroKarta}>
      {!daraja || hajm === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>Uchala o‘lchamni millimetrda kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Prostata hajmi</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: daraja.rang }}>{hajm.toFixed(1)} <span style={{ fontSize: '18px', color: 'var(--muted)' }}>sm³</span></div>
        <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: daraja.rang }}>{daraja.nom}</div>
        {psad !== null && <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--ink-soft)' }}>
          PSA zichligi (PSAD): <strong style={{ color: psad > PSAD_CHEGARA ? '#dc2626' : '#16a34a' }}>{psad.toFixed(3)} ng/mL/sm³</strong> <span style={{ color: 'var(--muted)' }}>(chegara 0.15)</span>
        </div>}
        {psadChegaraviy && <div><ChegaraviyBelgi matn="PSAD 0.15 chegarasiga yaqin — MRT/klinika bilan baholang" /></div>}
      </>}
      <UroOgohlantirish>Ellipsoid formula: V = 0.52 × uzunlik × kenglik × balandlik (sm). O‘lchamlar mm da bo‘lsa 10 ga bo‘linadi. Normal ~20–25 sm³; yosh bilan BPH tufayli kattalashishi tabiiy.</UroOgohlantirish>
    </section>

    <KlinikIzoh
      data={{
        anglatadi: 'USI dagi uch o‘lcham asosida prostata hajmini beradi. Hajm BPH ni kuzatish va PSA zichligini (PSAD = PSA ÷ hajm) hisoblashda ishlatiladi.',
        anglatmaydi: [
          'Saratonni aniqlamaydi yoki istisno qilmaydi.',
          'Simptom og‘irligini (IPSS) o‘lchamaydi.',
          'Kattalashgan hajm «operatsiya kerak» degani emas.',
        ],
        keyingiQadam: [
          'PSA berilsa PSAD ni hisoblang va 0.15 atrofida ehtiyot bilan talqin qiling.',
          'Simptom (IPSS/QoL), oqim va qoldiq siydik bilan birga baholang.',
          'PSAD yuqori yoki shubhali bo‘lsa MRT/urolog bahosi.',
        ],
        misol: {
          vaziyat: '40×35×32 mm, PSA 3.0 → hajm ~23 sm³, PSAD ~0.13.',
          javob: 'Hajm normaga yaqin; PSAD chegaraga yaqin — darhol biopsiya emas, MRT va klinik kontekst bilan baholanadi.',
        },
        kopXato: [
          'mm ni sm ga o‘tkazmaslik (10 barobar xato).',
          'Prostata hajmini bevosita saraton xavfi bilan tenglashtirish.',
        ],
      }}
    />
    <section className="rise" style={{ ...uroKarta, marginTop: '16px' }}>
      <ManbaMeta />
    </section>
  </UrologiyaKalkulyatorQobiq>
}
