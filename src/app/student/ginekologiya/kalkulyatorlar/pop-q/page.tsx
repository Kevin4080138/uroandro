'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginInput, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'

// Asosiy nuqtalar (santimetr, gimen tekisligiga nisbatan; − yuqori, + past).
const NUQTALAR: { kalit: string; nom: string; ph: string }[] = [
  { kalit: 'Aa', nom: 'Aa (oldingi devor, −3…+3)', ph: '-3' },
  { kalit: 'Ba', nom: 'Ba (oldingi devor, ≥ Aa)', ph: '-3' },
  { kalit: 'C', nom: 'C (serviks/kult)', ph: '-6' },
  { kalit: 'Ap', nom: 'Ap (orqa devor, −3…+3)', ph: '-3' },
  { kalit: 'Bp', nom: 'Bp (orqa devor, ≥ Ap)', ph: '-3' },
  { kalit: 'TVL', nom: 'TVL (umumiy vaginal uzunlik)', ph: '9' },
]

export default function PopQPage() {
  const [q, setQ] = useState<Record<string, string>>({})
  const oz = (k: string, v: string) => setQ((p) => ({ ...p, [k]: v }))
  const bor = (k: string) => q[k] !== undefined && q[k] !== '' && Number.isFinite(Number(q[k]))
  const tayyor = ['Aa', 'Ba', 'C', 'Ap', 'Bp', 'TVL'].every(bor)

  const natija = useMemo(() => {
    if (!tayyor) return null
    const Aa = +q.Aa, Ba = +q.Ba, C = +q.C, Ap = +q.Ap, Bp = +q.Bp, TVL = +q.TVL
    const yetakchi = Math.max(Aa, Ba, C, Ap, Bp) // eng distal (eng musbat) nuqta
    const tvlChegara = TVL - 2
    let bosqich: number
    if (Aa === -3 && Ba === -3 && Ap === -3 && Bp === -3 && C <= -tvlChegara) bosqich = 0
    else if (yetakchi >= tvlChegara) bosqich = 4
    else if (yetakchi > 1) bosqich = 3
    else if (yetakchi >= -1) bosqich = 2
    else bosqich = 1
    return { bosqich, yetakchi }
  }, [q, tayyor])

  const IZOH = ['Prolaps aniqlanmadi', 'Yengil — yetakchi nuqta gimendan >1 sm yuqori', 'Yetakchi nuqta gimen atrofida (−1…+1 sm)', 'Yetakchi nuqta gimendan >1 sm past', 'Deyarli to‘liq eversiya']

  return <GinekologiyaKalkulyatorQobiq title="POP-Q klassifikatsiyasi" subtitle="Tos a‘zolari prolapsini standart nuqtalar bo‘yicha ICS mezonlari bilan bosqichlaydi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {NUQTALAR.map((n) => (
          <div key={n.kalit}><label style={ginLabel}>{n.nom}</label><input style={ginInput} type="number" step="0.5" value={q[n.kalit] ?? ''} onChange={(e) => oz(n.kalit, e.target.value)} placeholder={n.ph} /></div>
        ))}
      </div>
      <p style={{ margin: '12px 0 0', fontSize: '12px', color: 'var(--muted)' }}>Nuqtalar Valsalva (maksimal zo‘riqish)da o‘lchanadi. − belgi gimendan yuqorini, + belgi pastni bildiradi.</p>
    </section>
    <section className="rise" style={ginKarta}>
      {!natija ? <p style={{ margin: 0, color: 'var(--muted)' }}>Aa, Ba, C, Ap, Bp va TVL qiymatlarini kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>POP-Q bosqichi</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--gyn)' }}>{natija.bosqich}-bosqich</div>
        <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: 'var(--ink-soft)' }}>{IZOH[natija.bosqich]}</div>
        <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted)' }}>Yetakchi nuqta: {natija.yetakchi > 0 ? '+' : ''}{natija.yetakchi} sm</div>
      </>}
      <KlinikOgohlantirish>Anatomik bosqich simptom og‘irligi bilan har doim mos kelmaydi. Bosqichlash yetakchi nuqta bo‘yicha soddalashtirilgan — to‘liq POP-Q hujjatlashtirish barcha nuqtalarni talab qiladi.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="pop-q" />
  </GinekologiyaKalkulyatorQobiq>
}
