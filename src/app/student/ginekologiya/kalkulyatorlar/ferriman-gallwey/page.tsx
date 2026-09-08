'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'

const SOHALAR = ['Yuqori lab', 'Iyak', 'Ko‘krak', 'Yuqori qorin', 'Pastki qorin', 'Yuqori orqa', 'Pastki orqa', 'Qo‘l (yelka)', 'Son']

export default function FerrimanGallweyPage() {
  const [ballar, setBallar] = useState<(number | null)[]>(Array(SOHALAR.length).fill(null))
  const tayyor = ballar.every((b) => b !== null)
  const jami = useMemo(() => (tayyor ? (ballar as number[]).reduce((s, b) => s + b, 0) : null), [ballar, tayyor])
  const yuqori = jami !== null && jami >= 8

  return <GinekologiyaKalkulyatorQobiq title="Modifikatsiyalangan Ferriman–Gallwey shkalasi" subtitle="To‘qqiz androgen-sezgir sohada terminal tuklanish darajasini baholaydi (har biri 0–4).">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {SOHALAR.map((s, i) => (
          <div key={s}>
            <label style={ginLabel}>{s}</label>
            <select style={ginInput} value={ballar[i] ?? ''} onChange={(e) => { const v = e.target.value; setBallar((p) => p.map((x, j) => (j === i ? (v === '' ? null : Number(v)) : x))) }}>
              <option value="">—</option>
              {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        ))}
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {jami === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>To‘qqiz soha bo‘yicha bahoni (0–4) tanlang.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Umumiy ball</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: yuqori ? '#dc2626' : 'var(--gyn)' }}>{jami} <span style={{ fontSize: '20px', color: 'var(--muted)' }}>/ 36</span></div>
        <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: yuqori ? '#dc2626' : '#16a34a' }}>{yuqori ? 'Ko‘p populyatsiyalarda ≥8 girsutizmga mos' : '<8 — girsutizm chegarasidan past'}</div>
      </>}
      <KlinikOgohlantirish>Etnik populyatsiyaga mos chegara ishlatilishi kerak. Kosmetik tuk olib tashlash bahoni buzadi. Shkala biokimyoviy giperandrogenizm tashxisini qo‘ymaydi.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="ferriman-gallwey" />
  </GinekologiyaKalkulyatorQobiq>
}
