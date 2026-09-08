'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { hadlockVazn } from '@/lib/ginekologiyaHisoblash'

export default function HomilaVazniPage() {
  const [bpd, setBpd] = useState(''), [hc, setHc] = useState(''), [ac, setAc] = useState(''), [fl, setFl] = useState('')
  const sonlar = [bpd, hc, ac, fl].map(Number)
  const yaroqli = sonlar.every(v => Number.isFinite(v) && v > 0) && sonlar[0] >= 20 && sonlar[0] <= 110 && sonlar[1] >= 80 && sonlar[1] <= 400 && sonlar[2] >= 80 && sonlar[2] <= 450 && sonlar[3] >= 10 && sonlar[3] <= 90
  const vazn = useMemo(() => yaroqli ? hadlockVazn(sonlar[0], sonlar[1], sonlar[2], sonlar[3]) : null, [bpd, hc, ac, fl, yaroqli])
  const maydonlar = [
    ['BPD — biparietal diametr (mm)', bpd, setBpd, 'masalan, 82'], ['HC — bosh aylanasi (mm)', hc, setHc, 'masalan, 300'],
    ['AC — qorin aylanasi (mm)', ac, setAc, 'masalan, 285'], ['FL — son suyagi uzunligi (mm)', fl, setFl, 'masalan, 64'],
  ] as const

  return <GinekologiyaKalkulyatorQobiq title="Homilaning taxminiy vazni (Hadlock)" subtitle="BPD, HC, AC va FL biometrik o‘lchamlari asosida Hadlock formulasida homilaning taxminiy vaznini hisoblaydi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {maydonlar.map(([label, value, setter, placeholder]) => <div key={label}><label style={ginLabel}>{label}</label><input style={ginInput} type="number" step="0.1" value={value} onChange={e => setter(e.target.value)} placeholder={placeholder} /></div>)}
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {!vazn ? <p style={{ margin: 0, color: 'var(--muted)' }}>To‘rtta UTT biometrik o‘lchamini millimetrda kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Taxminiy homila vazni</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--gyn)' }}>{Math.round(vazn).toLocaleString('uz-UZ')} <span style={{ fontSize: '20px' }}>g</span></div>
        <div style={{ marginTop: '8px', color: 'var(--ink-soft)', fontSize: '14px' }}>Taxminiy diapazon (±10%): {Math.round(vazn * .9).toLocaleString('uz-UZ')}–{Math.round(vazn * 1.1).toLocaleString('uz-UZ')} g</div>
      </>}
      <KlinikOgohlantirish>Hadlock IV formulasi ishlatiladi. Natija haqiqiy vazn emas va xatolik ko‘pincha taxminan ±10% bo‘lishi mumkin; o‘sishni baholash uchun gestatsion yoshga mos percentil va ketma-ket UTT zarur.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="homila-vazni" />
  </GinekologiyaKalkulyatorQobiq>
}
