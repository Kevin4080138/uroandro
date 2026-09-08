'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'

// Har bir belgi uchun [label, ball] variantlari (klassik Bishop 0–13).
const MAYDONLAR: { nom: string; variant: [string, number][] }[] = [
  { nom: 'Ochilish (dilatatsiya)', variant: [['Yopiq (0 sm)', 0], ['1–2 sm', 1], ['3–4 sm', 2], ['≥5 sm', 3]] },
  { nom: 'Silliqlanish (effacement)', variant: [['0–30%', 0], ['40–50%', 1], ['60–70%', 2], ['≥80%', 3]] },
  { nom: 'Homila boshi stansiyasi', variant: [['−3', 0], ['−2', 1], ['−1 / 0', 2], ['+1 / +2', 3]] },
  { nom: 'Serviks konsistensiyasi', variant: [['Qattiq', 0], ["O'rtacha", 1], ['Yumshoq', 2]] },
  { nom: 'Serviks holati', variant: [['Orqada', 0], ["O'rtada", 1], ['Oldinda', 2]] },
]

function talqin(ball: number) {
  if (ball >= 8) return { nom: 'Yetilgan serviks — induksiyaga qulay', rang: '#16a34a' }
  if (ball <= 5) return { nom: 'Yetilmagan serviks — servikal tayyorlash ko‘rib chiqiladi', rang: '#dc2626' }
  return { nom: 'Oraliq holat', rang: '#eab308' }
}

export default function BishopPage() {
  const [ballar, setBallar] = useState<(number | null)[]>(Array(MAYDONLAR.length).fill(null))
  const tayyor = ballar.every((b) => b !== null)
  const jami = useMemo(() => (tayyor ? (ballar as number[]).reduce((s, b) => s + b, 0) : null), [ballar, tayyor])
  const natija = jami !== null ? talqin(jami) : null

  return <GinekologiyaKalkulyatorQobiq title="Bishop shkalasi" subtitle="Bachadon bo‘ynining tug‘ruq induksiyasiga tayyorligini beshta belgi bo‘yicha baholaydi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {MAYDONLAR.map((m, i) => (
          <div key={m.nom}>
            <label style={ginLabel}>{m.nom}</label>
            <select style={ginInput} value={ballar[i] ?? ''} onChange={(e) => { const v = e.target.value; setBallar((p) => p.map((x, j) => (j === i ? (v === '' ? null : Number(v)) : x))) }}>
              <option value="">Tanlang…</option>
              {m.variant.map(([label, ball]) => <option key={label} value={ball}>{label} ({ball} ball)</option>)}
            </select>
          </div>
        ))}
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {!natija || jami === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>Beshta belgi bo‘yicha bahoni tanlang.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Bishop bali</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: natija.rang }}>{jami} <span style={{ fontSize: '20px', color: 'var(--muted)' }}>/ 13</span></div>
        <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: natija.rang }}>{natija.nom}</div>
      </>}
      <KlinikOgohlantirish>8 va undan yuqori ball odatda induksiyaga qulay, 5 va undan past ball yetilmagan serviksga mos. Turli muassasalarda modifikatsiyalangan mezon ishlatiladi.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="bishop" />
  </GinekologiyaKalkulyatorQobiq>
}
