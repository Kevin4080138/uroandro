'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { homaIr } from '@/lib/ginekologiyaHisoblash'

export default function HomaIrPage() {
  const [glukoza, setGlukoza] = useState('')
  const [insulin, setInsulin] = useState('')
  const [birlik, setBirlik] = useState<'mmol' | 'mgdl'>('mmol')
  const gn = Number(glukoza), inN = Number(insulin)
  const homa = useMemo(() => (gn > 0 && inN > 0 ? homaIr(gn, inN, birlik) : null), [gn, inN, birlik])

  return <GinekologiyaKalkulyatorQobiq title="HOMA-IR indeksi" subtitle="Och qoringa glyukoza va insulin orqali insulin rezistentligini taxmin qiladi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div>
          <label style={ginLabel}>Glyukoza birligi</label>
          <select style={ginInput} value={birlik} onChange={(e) => setBirlik(e.target.value as 'mmol' | 'mgdl')}>
            <option value="mmol">mmol/L</option>
            <option value="mgdl">mg/dL</option>
          </select>
        </div>
        <div><label style={ginLabel}>Och qoringa glyukoza ({birlik === 'mmol' ? 'mmol/L' : 'mg/dL'})</label><input style={ginInput} type="number" min="0" step="0.1" value={glukoza} onChange={(e) => setGlukoza(e.target.value)} placeholder={birlik === 'mmol' ? '5.0' : '90'} /></div>
        <div><label style={ginLabel}>Och qoringa insulin (µIU/mL)</label><input style={ginInput} type="number" min="0" step="0.1" value={insulin} onChange={(e) => setInsulin(e.target.value)} placeholder="masalan, 8" /></div>
      </div>
    </section>
    <section className="rise" style={ginKarta}>
      {homa === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>Och qoringa glyukoza va insulin qiymatlarini kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>HOMA-IR</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--gyn)' }}>{homa.toFixed(2)}</div>
        <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--ink-soft)' }}>Natijani laboratoriya va populyatsiyaga mos chegara bilan talqin qiling — universal cutoff yo‘q.</div>
      </>}
      <KlinikOgohlantirish>O‘tkir kasallik, steroidlar va och qolmaslik natijani buzadi. Homiladorlikda fiziologik insulin rezistentligi oshadi. Diabet yoki gestatsion diabet tashxisini almashtirmaydi.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="homa-ir" />
  </GinekologiyaKalkulyatorQobiq>
}
