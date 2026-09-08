'use client'

import { useMemo, useState } from 'react'
import { UrologiyaKalkulyatorQobiq, UroOgohlantirish, uroInput, uroKarta, uroLabel } from '@/components/UrologiyaKalkulyatorQobiq'
import { KlinikIzoh, ChegaraviyBelgi } from '@/components/KlinikIzoh'
import { qmaxIzoh, sonOqi } from '@/lib/urologiyaHisoblash'

export default function UroflowTalabaPage() {
  const [yosh, setYosh] = useState('60')
  const [hajm, setHajm] = useState('')
  const [qmax, setQmax] = useState('')
  const [vaqt, setVaqt] = useState('')
  const [qoldiq, setQoldiq] = useState('')

  const yoshN = sonOqi(yosh) || 60
  const hajmN = sonOqi(hajm), qmaxN = sonOqi(qmax), vaqtN = sonOqi(vaqt), qoldiqN = sonOqi(qoldiq)
  const tuldi = Number.isFinite(qmaxN) && qmaxN > 0
  const hajmYetarli = Number.isFinite(hajmN) && hajmN >= 150
  const ortacha = Number.isFinite(hajmN) && Number.isFinite(vaqtN) && vaqtN > 0 ? hajmN / vaqtN : null
  const natija = useMemo(() => (tuldi ? qmaxIzoh(qmaxN, yoshN) : null), [tuldi, qmaxN, yoshN])
  const chegaraviy = natija?.nom === 'Chegara holat'

  return <UrologiyaKalkulyatorQobiq title="Uroflowmetriya — Qmax baholash" subtitle="Maksimal oqim tezligini (Qmax) yosh me’zoni bilan solishtiradi; siyilgan hajm va vaqt berilsa o‘rtacha oqimni ham hisoblaydi.">
    <section className="rise" style={{ ...uroKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        <div><label style={uroLabel}>Yosh (yil)</label><input style={uroInput} type="number" value={yosh} onChange={e => setYosh(e.target.value)} placeholder="60" /></div>
        <div><label style={uroLabel}>Qmax (mL/s)</label><input style={uroInput} inputMode="decimal" value={qmax} onChange={e => setQmax(e.target.value)} placeholder="masalan, 12" /></div>
        <div><label style={uroLabel}>Siyilgan hajm (mL)</label><input style={uroInput} inputMode="decimal" value={hajm} onChange={e => setHajm(e.target.value)} placeholder="masalan, 220" /></div>
        <div><label style={uroLabel}>Siyish vaqti (s) — ixtiyoriy</label><input style={uroInput} inputMode="decimal" value={vaqt} onChange={e => setVaqt(e.target.value)} placeholder="o‘rtacha oqim uchun" /></div>
        <div><label style={uroLabel}>Qoldiq siydik (mL) — ixtiyoriy</label><input style={uroInput} inputMode="decimal" value={qoldiq} onChange={e => setQoldiq(e.target.value)} placeholder="PVR" /></div>
      </div>
    </section>

    <section className="rise" style={uroKarta}>
      {!natija ? <p style={{ margin: 0, color: 'var(--muted)' }}>Kamida Qmax va yoshni kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Qmax baholash</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: natija.rang }}>{qmaxN} <span style={{ fontSize: '18px', color: 'var(--muted)' }}>mL/s</span></div>
        <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: natija.rang }}>{natija.nom}</div>
        {ortacha !== null && <div style={{ marginTop: '10px', fontSize: '14px', color: 'var(--ink-soft)' }}>O‘rtacha oqim: <strong>{ortacha.toFixed(1)} mL/s</strong>{Number.isFinite(qoldiqN) && qoldiqN >= 0 ? ` · Qoldiq: ${qoldiqN} mL` : ''}</div>}
        {chegaraviy && <div><ChegaraviyBelgi matn="Chegara holat — takror va boshqa tekshiruvlar bilan baholang" /></div>}
        {!hajmYetarli && <div style={{ marginTop: '10px', fontSize: '12.5px', color: 'var(--warn)' }}>⚠ Siyilgan hajm &lt;150 mL — natija ishonchsiz, takrorlang.</div>}
      </>}
      <UroOgohlantirish>Yosh me’zoni: &lt;60 yoshda ~15 mL/s, ≥60 yoshda ~10 mL/s. Qmax yosh, jins, siyilgan hajm va oqim egri chizig‘isiz yakuniy tashxis bermaydi.</UroOgohlantirish>
    </section>

    <KlinikIzoh
      data={{
        anglatadi: 'Qmax (maksimal oqim tezligi) ni yoshga mos me’zon bilan solishtirib, pasaygan/obstruktiv oqim belgisini beradi; hajm va vaqt bilan o‘rtacha oqim ham chiqadi.',
        anglatmaydi: [
          'Obstruksiya sababini (BPH, striktura, sust detruzor) aniqlamaydi.',
          'Bosim-oqim tekshiruvining (urodinamika) o‘rnini bosmaydi.',
          'Bitta o‘lchov yakuniy tashxis emas.',
        ],
        keyingiQadam: [
          'Siyilgan hajm ≥150 mL ekanini tekshiring — aks holda takrorlang.',
          'IPSS, qoldiq siydik (PVR) va prostata hajmi bilan birga baholang.',
          'Noaniq holatda bosim-oqim (urodinamika) tekshiruvini ko‘rib chiqing.',
        ],
        misol: {
          vaziyat: '65 yosh, Qmax 8 mL/s, siyilgan hajm 220 mL.',
          javob: 'Yoshda chegara ~10 — pasaygan oqim, obstruksiyaga mos. Ammo sababni urodinamika va klinika aniqlaydi.',
        },
        kopXato: [
          'Siyilgan hajm <150 mL bo‘lgan natijaga ishonish.',
          'Qmax ni yakka o‘zi tashxis deb qabul qilish.',
        ],
      }}
    />
  </UrologiyaKalkulyatorQobiq>
}
