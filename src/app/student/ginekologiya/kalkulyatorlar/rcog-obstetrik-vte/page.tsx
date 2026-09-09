'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { RCOG_VTE_OMILLAR, rcogVteBaho } from '@/lib/ginekologiyaHisoblash'

export default function RcogVtePage() {
  const [rejim, setRejim] = useState<'ante' | 'post'>('ante')
  const [tanlangan, setTanlangan] = useState<Set<string>>(new Set())
  const toggle = (k: string) => setTanlangan(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n })

  const omillar = RCOG_VTE_OMILLAR.filter(o => (rejim === 'ante' ? o.ante : o.post) > 0)
  const natija = useMemo(() => rcogVteBaho(tanlangan, rejim), [tanlangan, rejim])

  return <GinekologiyaKalkulyatorQobiq title="Homiladorlik/puerperiyda VTE xavfi (RCOG)" subtitle="RCOG Green-top 37a xavf omillarini ballab, antenatal yoki postnatal tromboprofilaktika tavsiyasini ko‘rsatadi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <label style={{ ...ginLabel, marginBottom: '10px' }}>Bosqich</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        {([['ante', 'Antenatal'], ['post', 'Postnatal']] as const).map(([id, nom]) => (
          <button key={id} onClick={() => setRejim(id)} className="soft-press" style={{
            flex: 1, border: `1px solid ${rejim === id ? 'var(--gyn)' : 'var(--line)'}`, background: rejim === id ? 'var(--gyn-soft)' : 'var(--surface)',
            color: rejim === id ? 'var(--gyn)' : 'var(--muted)', borderRadius: '10px', padding: '9px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
          }}>{nom}</button>
        ))}
      </div>
      <label style={{ ...ginLabel, marginBottom: '10px' }}>Xavf omillari (mavjudlarini belgilang)</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {omillar.map(o => (
          <label key={o.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', cursor: 'pointer' }}>
            <input type="checkbox" checked={tanlangan.has(o.key)} onChange={() => toggle(o.key)} style={{ width: '18px', height: '18px', accentColor: 'var(--gyn)', flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{o.label}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', background: 'var(--surface-2)', borderRadius: '6px', padding: '2px 7px' }}>+{rejim === 'ante' ? o.ante : o.post}</span>
          </label>
        ))}
      </div>
    </section>

    <section className="rise" style={ginKarta}>
      <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>{rejim === 'ante' ? 'Antenatal' : 'Postnatal'} jami ball</div>
      <div style={{ fontSize: '38px', fontWeight: 800, color: natija.rang }}>{natija.jami}</div>
      <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: natija.rang, lineHeight: 1.4 }}>{natija.tavsif}</div>
      <KlinikOgohlantirish>Antenatal: ≥4 → 1-trimestrdan, =3 → 28-haftadan profilaktika. Postnatal: ≥2 → kamida 10 kun. Oldingi VTE yoki yuqori xavfli trombofiliyada balldan qat’i nazar mutaxassis rejasi kerak.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="rcog-obstetrik-vte" />
  </GinekologiyaKalkulyatorQobiq>
}
