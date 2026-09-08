'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'

const B = [
  'B1 — unilokulyar kista',
  'B2 — solid komponent eng katta o‘lchami <7 mm',
  'B3 — akustik soya',
  'B4 — silliq multilokulyar o‘sma, <100 mm',
  'B5 — qon oqimi yo‘q (rang bali 1)',
]
const M = [
  'M1 — noto‘g‘ri (irregular) solid o‘sma',
  'M2 — ascit',
  'M3 — kamida 4 ta papillyar tuzilma',
  'M4 — noto‘g‘ri multilokulyar-solid massa, ≥100 mm',
  'M5 — juda kuchli qon oqimi (rang bali 4)',
]

function Belgilar({ nom, ro, holat, oz }: { nom: string; ro: string[]; holat: boolean[]; oz: (i: number) => void }) {
  return (
    <div>
      <label style={{ ...ginLabel, marginBottom: '10px' }}>{nom}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ro.map((b, i) => (
          <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', cursor: 'pointer' }}>
            <input type="checkbox" checked={holat[i]} onChange={() => oz(i)} style={{ width: '18px', height: '18px', accentColor: 'var(--gyn)' }} />
            {b}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function IotaSimpleRulesPage() {
  const [b, setB] = useState<boolean[]>(Array(5).fill(false))
  const [m, setM] = useState<boolean[]>(Array(5).fill(false))
  const bBor = b.some(Boolean), mBor = m.some(Boolean)
  const natija = useMemo(() => {
    if (bBor && !mBor) return { nom: 'Benign (xavfsiz)', rang: '#16a34a', izoh: 'Faqat B-belgilar aniqlandi.' }
    if (mBor && !bBor) return { nom: 'Malign (xavfli)', rang: '#dc2626', izoh: 'Faqat M-belgilar aniqlandi.' }
    return { nom: 'Aniqlanmadi (inconclusive)', rang: '#eab308', izoh: bBor && mBor ? 'B va M belgilar birga uchradi.' : 'Hech qanday belgi tanlanmadi.' }
  }, [bBor, mBor])

  return <GinekologiyaKalkulyatorQobiq title="IOTA Simple Rules" subtitle="Adneksal massani beshta benign (B) va beshta malign (M) UTT belgisi orqali tasniflaydi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
      <Belgilar nom="Benign belgilar (B)" ro={B} holat={b} oz={(i) => setB((p) => p.map((x, j) => (j === i ? !x : x)))} />
      <Belgilar nom="Malign belgilar (M)" ro={M} holat={m} oz={(i) => setM((p) => p.map((x, j) => (j === i ? !x : x)))} />
    </section>
    <section className="rise" style={ginKarta}>
      <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Natija</div>
      <div style={{ fontSize: '30px', fontWeight: 800, color: natija.rang }}>{natija.nom}</div>
      <div style={{ marginTop: '4px', fontSize: '14px', color: 'var(--ink-soft)' }}>{natija.izoh}</div>
      <KlinikOgohlantirish>Faqat B: benign · faqat M: malign · ikkalasi yoki hech biri: aniqlanmadi. Aniqlanmagan holat ekspert UTT, ADNEX modeli yoki onkoginekologik bahoni talab qiladi. Bu gistologik tashxis emas.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="iota-simple-rules" />
  </GinekologiyaKalkulyatorQobiq>
}
