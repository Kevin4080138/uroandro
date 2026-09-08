'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { bugungiMahalliySana, ovulyatsiyaHisob, sanaFormat } from '@/lib/ginekologiyaHisoblash'

export default function OvulyatsiyaPage() {
  const [ohb, setOhb] = useState(bugungiMahalliySana())
  const [sikl, setSikl] = useState('28')
  const siklN = Number(sikl)
  const natija = useMemo(() => (ohb && siklN >= 21 && siklN <= 35 ? ovulyatsiyaHisob(ohb, siklN) : null), [ohb, siklN])

  return <GinekologiyaKalkulyatorQobiq title="Ovulyatsiya kunini taxminlash" subtitle="Sikl sanalari asosida taxminiy ovulyatsiya kuni va fertil oynani ko‘rsatadi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div><label style={ginLabel}>Oxirgi hayzning birinchi kuni</label><input style={ginInput} type="date" value={ohb} onChange={(e) => setOhb(e.target.value)} /></div>
        <div><label style={ginLabel}>O‘rtacha sikl uzunligi (21–35 kun)</label><input style={ginInput} type="number" min="21" max="35" value={sikl} onChange={(e) => setSikl(e.target.value)} /></div>
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {!natija ? <p style={{ margin: 0, color: 'var(--muted)' }}>Sana va 21–35 kunlik sikl uzunligini kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Fertil oyna</div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gyn)', lineHeight: 1.3 }}>{sanaFormat(natija.fertilBosh)} — {sanaFormat(natija.fertilTugash)}</div>
        <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--ink-soft)' }}>Taxminiy ovulyatsiya: <strong style={{ color: 'var(--ink)' }}>{sanaFormat(natija.ovulyatsiya)}</strong></div>
        <div style={{ marginTop: '4px', fontSize: '14px', color: 'var(--ink-soft)' }}>Keyingi kutilayotgan hayz: <strong style={{ color: 'var(--ink)' }}>{sanaFormat(natija.keyingiHayz)}</strong></div>
      </>}
      <KlinikOgohlantirish>Ovulyatsiya ko‘pincha keyingi hayzdan ~14 kun oldin bo‘ladi, siklning 14-kunida emas. Notekis sikl, laktatsiya, perimenopauza va PCOSda kalendar usuli ishonchsiz; homiladorlikdan saqlanishning yakka usuli sifatida tavsiya qilinmaydi.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="ovulyatsiya-kuni" />
  </GinekologiyaKalkulyatorQobiq>
}
