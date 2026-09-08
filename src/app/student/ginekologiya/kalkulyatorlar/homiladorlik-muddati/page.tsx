'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { bugungiMahalliySana, homiladorlikHisobla, sanaFormat } from '@/lib/ginekologiyaHisoblash'

const bugun = bugungiMahalliySana()

export default function HomiladorlikMuddatiPage() {
  const [ohb, setOhb] = useState('')
  const [sikl, setSikl] = useState('28')
  const [sana, setSana] = useState(bugun)
  const siklN = Number(sikl)
  const natija = useMemo(() => ohb && sana && siklN >= 21 && siklN <= 35 ? homiladorlikHisobla(ohb, siklN, sana) : null, [ohb, siklN, sana])
  const yaroqli = natija && natija.otganKun >= 0 && natija.otganKun <= 308

  return <GinekologiyaKalkulyatorQobiq title="Homiladorlik muddati va taxminiy tug‘ruq sanasi" subtitle="Oxirgi hayzning birinchi kuni va sikl uzunligi asosida gestatsion muddat hamda taxminiy tug‘ruq sanasini hisoblaydi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
        <div><label style={ginLabel}>Oxirgi hayzning birinchi kuni</label><input style={ginInput} type="date" value={ohb} onChange={e => setOhb(e.target.value)} /></div>
        <div><label style={ginLabel}>Sikl uzunligi (21–35 kun)</label><input style={ginInput} type="number" min="21" max="35" value={sikl} onChange={e => setSikl(e.target.value)} /></div>
        <div><label style={ginLabel}>Baholash sanasi</label><input style={ginInput} type="date" value={sana} onChange={e => setSana(e.target.value)} /></div>
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {!yaroqli ? <p style={{ margin: 0, color: 'var(--muted)' }}>To‘g‘ri sanalar va 21–35 kunlik sikl uzunligini kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Gestatsion muddat (hayz yoshi)</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--gyn)' }}>{natija.hafta} hafta {natija.kun} kun</div>
        {natija.embrionBor && (
          <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--ink-soft)', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 12px', lineHeight: 1.5 }}>
            Embrionning taxminiy yoshi (urug‘lanishdan): <strong style={{ color: 'var(--ink)' }}>{natija.embrionHafta} hafta {natija.embrionKunQoldiq} kun</strong>
            <span style={{ display: 'block', color: 'var(--muted)', marginTop: '2px' }}>Gestatsion muddat hayzning 1-kunidan sanaladi, shu sabab embrion yoshidan ~2 hafta katta. Tibbiy hujjatlarda gestatsion muddat ishlatiladi.</span>
          </div>
        )}
        <div style={{ marginTop: '14px', fontSize: '14px', color: 'var(--ink-soft)' }}>Taxminiy tug‘ruq sanasi: <strong style={{ color: 'var(--ink)' }}>{sanaFormat(natija.tts)}</strong></div>
      </>}
      <KlinikOgohlantirish>Hisob 28 kunlik siklda OHS + 280 kun (Naegele qoidasi), boshqa sikllarda sikl farqi bilan tuzatiladi. Birinchi trimestr UTT sanani aniqroq tasdiqlaydi.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="homiladorlik-muddati" />
  </GinekologiyaKalkulyatorQobiq>
}
