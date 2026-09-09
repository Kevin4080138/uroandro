'use client'

import { useMemo, useState } from 'react'
import { GinekologiyaKalkulyatorQobiq, KalkulyatorKontent, KlinikOgohlantirish, ginKarta, ginLabel } from '@/components/GinekologiyaKalkulyatorQobiq'
import { PREEK_YUQORI_OMILLAR, PREEK_ORTA_OMILLAR, preekAspirinBaho } from '@/lib/ginekologiyaHisoblash'

export default function PreeklampsiyaPage() {
  const [yuqori, setYuqori] = useState<Set<string>>(new Set())
  const [orta, setOrta] = useState<Set<string>>(new Set())
  const toggle = (setFn: React.Dispatch<React.SetStateAction<Set<string>>>) => (k: string) =>
    setFn(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n })

  const natija = useMemo(() => preekAspirinBaho(yuqori.size, orta.size), [yuqori, orta])

  const Guruh = ({ nom, omillar, holat, oz, rang }: { nom: string; omillar: string[]; holat: Set<string>; oz: (k: string) => void; rang: string }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ ...ginLabel, color: rang, marginBottom: '10px' }}>{nom}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {omillar.map(o => (
          <label key={o} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', cursor: 'pointer' }}>
            <input type="checkbox" checked={holat.has(o)} onChange={() => oz(o)} style={{ width: '18px', height: '18px', accentColor: 'var(--gyn)', flexShrink: 0 }} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </div>
  )

  return <GinekologiyaKalkulyatorQobiq title="Preeklampsiya — aspirin profilaktikasi" subtitle="ACOG/USPSTF yuqori va o‘rta xavf omillari asosida past dozali aspirin ko‘rsatmasini baholaydi.">
    <section className="rise" style={{ ...ginKarta, marginBottom: '16px' }}>
      <Guruh nom={`Yuqori xavf omillari — bittasi ham aspirin uchun yetarli (belgilangan: ${yuqori.size})`} omillar={PREEK_YUQORI_OMILLAR} holat={yuqori} oz={toggle(setYuqori)} rang="#dc2626" />
      <Guruh nom={`O‘rta xavf omillari — ikkitasi va undan ko‘pi (belgilangan: ${orta.size})`} omillar={PREEK_ORTA_OMILLAR} holat={orta} oz={toggle(setOrta)} rang="#d97706" />
    </section>

    <section className="rise" style={ginKarta}>
      <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Aspirin profilaktikasi</div>
      <div style={{ fontSize: '22px', fontWeight: 800, color: natija.rang, lineHeight: 1.35, marginTop: '4px' }}>{natija.matn}</div>
      <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--muted)' }}>Yuqori: {yuqori.size} · O‘rta: {orta.size}</div>
      <KlinikOgohlantirish>Tavsiya etilganda past dozali aspirin (odatda 81–162 mg) 12–28 haftadan tug‘ruqqacha beriladi. Bu skrining — preeklampsiya tashxisi emas; qon bosimi va simptomlar alohida kuzatiladi.</KlinikOgohlantirish>
    </section>
    <KalkulyatorKontent slug="preeklampsiya-xavfi" />
  </GinekologiyaKalkulyatorQobiq>
}
