'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { bugungiMahalliySana, crlGestatsionYosh, sanaFormat, sanaQosh, utcSana } from '@/lib/ginekologiyaHisoblash'

const bugun = bugungiMahalliySana()

export default function GestatsionYoshUttPage() {
  const [crl, setCrl] = useState('')
  const [uttSana, setUttSana] = useState(bugun)
  const crlN = Number(crl)
  const natija = useMemo(() => crlN >= 15 && crlN <= 95 ? crlGestatsionYosh(crlN) : null, [crlN])
  const tts = natija && uttSana ? sanaQosh(utcSana(uttSana), 280 - natija.jamiKun) : null

  return <GinekologiyaKalkulyatorQobiq title="UTT bo‘yicha gestatsion yosh" subtitle="Birinchi trimestrda CRL — bosh-dumg‘aza uzunligi asosida homiladorlik muddatini INTERGROWTH-21st formulasi bilan baholaydi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
        <div><label style={ginLabel}>CRL (15–95 mm)</label><input style={ginInput} type="number" min="15" max="95" step="0.1" value={crl} onChange={e => setCrl(e.target.value)} placeholder="masalan, 52" /></div>
        <div><label style={ginLabel}>UTT o‘tkazilgan sana</label><input style={ginInput} type="date" value={uttSana} onChange={e => setUttSana(e.target.value)} /></div>
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {!natija ? <p style={{ margin: 0, color: 'var(--muted)' }}>CRL qiymatini 15–95 mm oralig‘ida kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>UTT bo‘yicha gestatsion yosh</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--gyn)' }}>{natija.hafta} hafta {natija.kun} kun</div>
        {tts && <div style={{ marginTop: '14px', fontSize: '14px' }}>Taxminiy tug‘ruq sanasi: <strong>{sanaFormat(tts)}</strong></div>}
      </>}
      <KlinikOgohlantirish>CRL bo‘yicha birinchi trimestr sanalashi eng aniq usul hisoblanadi. Formula 9–13+6 haftalik davr uchun ishlab chiqilgan; CRL 84 mm dan oshganda kompozit biometriya afzal.</KlinikOgohlantirish>
    </section>
  </GinekologiyaKalkulyatorQobiq>
}
