'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'

export default function QonYoqotishPage() {
  const [nam, setNam] = useState('')      // nam materiallar umumiy vazni, g
  const [quruq, setQuruq] = useState('')  // o'sha materiallarning quruq vazni, g
  const [suyuq, setSuyuq] = useState('')  // kalibrlangan idishdagi umumiy suyuqlik, ml
  const [boshqa, setBoshqa] = useState('') // amniotik/irrigatsion (qon bo'lmagan), ml

  const maydonlar = [
    ['Nam materiallar vazni (g)', nam, setNam, 'masalan, 850'],
    ['O‘sha materiallarning quruq vazni (g)', quruq, setQuruq, 'masalan, 300'],
    ['Idishdagi umumiy suyuqlik (ml)', suyuq, setSuyuq, 'masalan, 600'],
    ['Amniotik / irrigatsion suyuqlik (ml)', boshqa, setBoshqa, 'masalan, 200'],
  ] as const

  const n = [nam, quruq, suyuq, boshqa].map(Number)
  const tayyor = n.every((v) => Number.isFinite(v) && v >= 0) && (nam !== '' || suyuq !== '')
  const qbl = useMemo(() => {
    if (!tayyor) return null
    const materialQon = Math.max(0, n[0] - n[1]) // 1 g ≈ 1 ml
    const idishQon = Math.max(0, n[2] - n[3])
    return Math.round(materialQon + idishQon)
  }, [nam, quruq, suyuq, boshqa, tayyor])
  const yuqori = qbl !== null && qbl >= 1000

  return <GinekologiyaKalkulyatorQobiq title="Tug‘ruqdan keyingi qon yo‘qotishni miqdoriy baholash" subtitle="Nam va quruq material vazni farqi hamda yig‘ilgan suyuqlik hajmi bo‘yicha umumiy qon yo‘qotishni hisoblaydi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {maydonlar.map(([label, value, setter, ph]) => (
          <div key={label}><label style={ginLabel}>{label}</label><input style={ginInput} type="number" min="0" step="1" value={value} onChange={(e) => setter(e.target.value)} placeholder={ph} /></div>
        ))}
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {qbl === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>Material vazni va/yoki idishdagi suyuqlik qiymatlarini kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Taxminiy umumiy qon yo‘qotish</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: yuqori ? '#dc2626' : 'var(--gyn)' }}>{qbl.toLocaleString('uz-UZ')} <span style={{ fontSize: '20px' }}>ml</span></div>
        {yuqori && <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: '#dc2626' }}>≥1000 ml — obstetrik qon ketish mezoni</div>}
      </>}
      <KlinikOgohlantirish>1 g nam material ≈ 1 ml qon. Hisob reanimatsiya va qon ketish sababini aniqlashni kechiktirmasligi kerak; bemorning gemodinamik holati raqamdan muhimroq bo‘lishi mumkin.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="qon-yoqotish" />
  </GinekologiyaKalkulyatorQobiq>
}
