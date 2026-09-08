'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { faiHisob } from '@/lib/ginekologiyaHisoblash'

export default function FaiPage() {
  const [t, setT] = useState('')
  const [shbg, setShbg] = useState('')
  const tn = Number(t), sn = Number(shbg)
  const fai = useMemo(() => (tn > 0 && sn > 0 ? faiHisob(tn, sn) : null), [tn, sn])

  return <GinekologiyaKalkulyatorQobiq title="Erkin androgen indeksi (FAI)" subtitle="Umumiy testosteron va SHBG orqali biologik faol androgen ulushini taxmin qiladi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div><label style={ginLabel}>Umumiy testosteron (nmol/L)</label><input style={ginInput} type="number" min="0" step="0.1" value={t} onChange={(e) => setT(e.target.value)} placeholder="masalan, 2.5" /></div>
        <div><label style={ginLabel}>SHBG (nmol/L)</label><input style={ginInput} type="number" min="0" step="0.1" value={shbg} onChange={(e) => setShbg(e.target.value)} placeholder="masalan, 40" /></div>
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {fai === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>Testosteron va SHBG qiymatlarini nmol/L da kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>FAI</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--gyn)' }}>{fai.toFixed(1)}<span style={{ fontSize: '20px', color: 'var(--muted)' }}> %</span></div>
        <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--ink-soft)' }}>Natijani laboratoriyaning ayollar uchun referens intervali bilan solishtiring.</div>
      </>}
      <KlinikOgohlantirish>Universal bitta chegara yo‘q — assay va laboratoriyaga bog‘liq. SHBG juda past bo‘lsa FAI erkin testosteronni ortiqcha baholashi mumkin.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="free-androgen-index" />
  </GinekologiyaKalkulyatorQobiq>
}
