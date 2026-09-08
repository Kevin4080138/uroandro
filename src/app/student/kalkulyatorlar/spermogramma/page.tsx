'use client'

import { useMemo, useState } from 'react'
import { UrologiyaKalkulyatorQobiq, UroOgohlantirish, uroInput, uroKarta, uroLabel } from '@/components/UrologiyaKalkulyatorQobiq'
import { KlinikIzoh, ManbaMeta } from '@/components/KlinikIzoh'
import { SPERMA_MEZONLARI, spermaTashxis, sonOqi } from '@/lib/urologiyaHisoblash'

export default function SpermogrammaTalabaPage() {
  const [q, setQ] = useState<Record<string, string>>({})
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setQ(p => ({ ...p, [key]: e.target.value }))
  const tuldi = SPERMA_MEZONLARI.every(m => q[m.key] !== undefined && q[m.key] !== '')

  const natija = useMemo(() => {
    const res: Record<string, { qiymat: number; norma: boolean }> = {}
    for (const m of SPERMA_MEZONLARI) {
      const v = sonOqi(q[m.key] ?? '')
      if (Number.isFinite(v)) res[m.key] = { qiymat: v, norma: v >= m.min }
    }
    return res
  }, [q])
  const tashxis = tuldi ? spermaTashxis(natija) : null

  return <UrologiyaKalkulyatorQobiq title="Spermogramma (WHO 2021)" subtitle="Ejakulyat ko‘rsatkichlarini WHO 2021 pastki me’zonlari bilan solishtirib, tavsifiy tashxis beradi.">
    <section className="rise" style={{ ...uroKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {SPERMA_MEZONLARI.map(m => {
          const n = natija[m.key]
          return (
            <div key={m.key}>
              <label style={uroLabel}>{m.label} {m.birlik && <span style={{ color: 'var(--muted)' }}>({m.birlik})</span>}</label>
              <input style={{ ...uroInput, borderColor: n ? (n.norma ? '#16a34a' : '#dc2626') : 'var(--line)' }} inputMode="decimal" value={q[m.key] ?? ''} onChange={set(m.key)} placeholder={`me’zon ≥ ${m.min}`} />
            </div>
          )
        })}
      </div>
    </section>

    <section className="rise" style={uroKarta}>
      {!tashxis ? <p style={{ margin: 0, color: 'var(--muted)' }}>Barcha 8 ko‘rsatkichni kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Tavsifiy tashxis</div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: tashxis.rang, lineHeight: 1.2 }}>{tashxis.nom}</div>
        <p style={{ margin: '8px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{tashxis.tavsif}</p>
        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {SPERMA_MEZONLARI.map(m => natija[m.key] && (
            <span key={m.key} style={{ fontSize: '11px', fontWeight: 700, borderRadius: '999px', padding: '3px 8px', color: natija[m.key].norma ? '#16a34a' : '#dc2626', background: natija[m.key].norma ? '#16a34a18' : '#dc262618' }}>
              {m.label.split(' ')[0]}: {natija[m.key].norma ? '✓' : '↓'}
            </span>
          ))}
        </div>
      </>}
      <UroOgohlantirish>WHO 2021 chegaralari — 5-sentil (pastki me’zon), «normal» kafolati emas. Bir tahlil kam; jinsiy tiyilish 2–7 kun bo‘lishi kerak.</UroOgohlantirish>
    </section>

    <KlinikIzoh
      data={{
        anglatadi: 'Ejakulyat ko‘rsatkichlarini WHO 2021 pastki me’zonlari bilan solishtirib, normo-/oligo-/asteno-/teratozoospermiya, OAT yoki azoospermiya kabi tavsifiy tashxis beradi.',
        anglatmaydi: [
          'Bepushtlik tashxisini yakka o‘zi qo‘ymaydi — juftlik va vaqt muhim.',
          'Me’zonlar 5-sentil — sog‘lom erkakda ham past chiqishi mumkin.',
          'Past natijaning sababini (gormonal/genetik/obstruktiv) aniqlamaydi.',
        ],
        keyingiQadam: [
          'Past natijada 2–3 oydan keyin (bir spermatogenez sikli) qayta tahlil.',
          'Azoospermiyada gormonal profil, genetik tahlil va androlog bahosi.',
          'Juftlikning ayol tomonini ham parallel baholang.',
        ],
        misol: {
          vaziyat: 'Konsentratsiya 10 mln/mL, umumiy harakat 30%, morfologiya 2%.',
          javob: 'Uchala ko‘rsatkich past → OAT. Darhol tashxis emas: 2–3 oydan keyin qayta va androlog konsultatsiyasi.',
        },
        kopXato: [
          'Bitta past natijaga qarab «bepushtlik» deb xulosa qilish.',
          '2–7 kunlik jinsiy tiyilish qoidasiga rioya qilmasdan namuna berish.',
        ],
      }}
    />
    <section className="rise" style={{ ...uroKarta, marginTop: '16px' }}>
      <ManbaMeta litsenziya="WHO 2021 me’zonlari ochiq; laboratoriya hisobot shakli va tarjimasini rasmiy manba bilan solishtiring." />
    </section>
  </UrologiyaKalkulyatorQobiq>
}
