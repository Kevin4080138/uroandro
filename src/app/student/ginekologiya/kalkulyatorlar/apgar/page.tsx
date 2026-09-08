'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'

const MAYDONLAR: { nom: string; variant: [string, number][] }[] = [
  { nom: 'Appearance — teri rangi', variant: [['Ko‘kimtir / oqargan', 0], ['Tana pushti, oyoq-qo‘l ko‘kimtir', 1], ['To‘liq pushti', 2]] },
  { nom: 'Pulse — yurak urishi', variant: [['Yo‘q', 0], ['<100/daq', 1], ['≥100/daq', 2]] },
  { nom: 'Grimace — reflektor javob', variant: [['Javob yo‘q', 0], ['Yuz burishtiradi', 1], ['Yig‘lash / yo‘tal / aksirish', 2]] },
  { nom: 'Activity — mushak tonusi', variant: [['Bo‘shashgan', 0], ['Qo‘l-oyoq biroz bukilgan', 1], ['Faol harakat', 2]] },
  { nom: 'Respiration — nafas', variant: [['Yo‘q', 0], ['Sust, notekis', 1], ['Kuchli yig‘lash', 2]] },
]

function talqin(ball: number) {
  if (ball >= 7) return { nom: 'Yaxshi moslashuv', rang: '#16a34a' }
  if (ball >= 4) return { nom: "O'rtacha buzilish — kuzatuv va yordam", rang: '#eab308' }
  return { nom: 'Og‘ir holat — zudlik bilan reanimatsion baholash', rang: '#dc2626' }
}

export default function ApgarPage() {
  const [ballar, setBallar] = useState<(number | null)[]>(Array(MAYDONLAR.length).fill(null))
  const tayyor = ballar.every((b) => b !== null)
  const jami = useMemo(() => (tayyor ? (ballar as number[]).reduce((s, b) => s + b, 0) : null), [ballar, tayyor])
  const natija = jami !== null ? talqin(jami) : null

  return <GinekologiyaKalkulyatorQobiq title="Apgar shkalasi" subtitle="Yangi tug‘ilgan chaqaloqning holatini beshta belgi bo‘yicha standart qayd etadi (odatda 1 va 5-daqiqada).">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
        {MAYDONLAR.map((m, i) => (
          <div key={m.nom}>
            <label style={ginLabel}>{m.nom}</label>
            <select style={ginInput} value={ballar[i] ?? ''} onChange={(e) => { const v = e.target.value; setBallar((p) => p.map((x, j) => (j === i ? (v === '' ? null : Number(v)) : x))) }}>
              <option value="">Tanlang…</option>
              {m.variant.map(([label, ball]) => <option key={label} value={ball}>{label} ({ball})</option>)}
            </select>
          </div>
        ))}
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {!natija || jami === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>Beshta belgi bo‘yicha bahoni tanlang.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Apgar bali</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: natija.rang }}>{jami} <span style={{ fontSize: '20px', color: 'var(--muted)' }}>/ 10</span></div>
        <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: natija.rang }}>{natija.nom}</div>
      </>}
      <KlinikOgohlantirish>Reanimatsiyani boshlash uchun 1-daqiqa balini kutish mumkin emas. Apgar asfiksiya tashxisini yoki uzoq muddatli prognozni yakka o‘zi belgilamaydi.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="apgar" />
  </GinekologiyaKalkulyatorQobiq>
}
