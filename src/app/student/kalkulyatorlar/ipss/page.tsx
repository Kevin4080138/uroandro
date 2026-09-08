'use client'

import { useMemo, useState } from 'react'
import { UrologiyaKalkulyatorQobiq, UroOgohlantirish, uroInput, uroKarta, uroLabel } from '@/components/UrologiyaKalkulyatorQobiq'
import { KlinikIzoh, ChegaraviyBelgi } from '@/components/KlinikIzoh'
import { IPSS_SAVOLLAR, IPSS_QOL_VARIANTLAR, ipssDaraja } from '@/lib/urologiyaHisoblash'

export default function IpssTalabaPage() {
  const [javob, setJavob] = useState<(number | null)[]>(Array(IPSS_SAVOLLAR.length).fill(null))
  const [qol, setQol] = useState<number | null>(null)
  const tayyor = javob.every(v => v !== null)
  const jami = useMemo(() => (tayyor ? (javob as number[]).reduce((s, v) => s + v, 0) : null), [javob, tayyor])
  const natija = jami !== null ? ipssDaraja(jami) : null
  const chegaraviy = jami === 7 || jami === 8 || jami === 19 || jami === 20 // yengil/o'rta yoki o'rta/og'ir chegarasi

  return <UrologiyaKalkulyatorQobiq title="IPSS / AUA-SS" subtitle="Prostata bezi (LUTS) simptomlarining og‘irligini 7 savol bo‘yicha 0–35 ballda va hayot sifati (QoL) indeksini baholaydi.">
    <section className="rise" style={{ ...uroKarta, marginBottom: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {IPSS_SAVOLLAR.map((s, i) => (
          <div key={s.key}>
            <label style={{ ...uroLabel, lineHeight: 1.5 }}>{i + 1}. {s.matn}</label>
            <select style={uroInput} value={javob[i] ?? ''} onChange={e => { const v = e.target.value; setJavob(p => p.map((x, j) => j === i ? (v === '' ? null : Number(v)) : x)) }}>
              <option value="">Tanlang…</option>
              {s.variantlar.map((v, b) => <option key={b} value={b}>{b} — {v}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label style={{ ...uroLabel, lineHeight: 1.5 }}>Hayot sifati (QoL): Agar hozirgi siydik holatingiz umringiz oxirigacha shunday qolsa, o‘zingizni qanday his qilardingiz?</label>
          <select style={uroInput} value={qol ?? ''} onChange={e => { const v = e.target.value; setQol(v === '' ? null : Number(v)) }}>
            <option value="">Tanlang…</option>
            {IPSS_QOL_VARIANTLAR.map((v, b) => <option key={b} value={b}>{b} — {v}</option>)}
          </select>
        </div>
      </div>
    </section>

    <section className="rise" style={uroKarta}>
      {!natija || jami === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>7 savol bo‘yicha javob tanlang.</p> : <>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>IPSS bali</div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: natija.rang }}>{jami} <span style={{ fontSize: '18px', color: 'var(--muted)' }}>/ 35</span></div>
          </div>
          {qol !== null && <div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>QoL</div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--ink)' }}>{qol} <span style={{ fontSize: '18px', color: 'var(--muted)' }}>/ 6</span></div>
          </div>}
        </div>
        <div style={{ marginTop: '6px', fontSize: '15px', fontWeight: 700, color: natija.rang }}>{natija.nom}</div>
        <p style={{ margin: '8px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{natija.tavsif}</p>
        {chegaraviy && <div><ChegaraviyBelgi matn="Chegaraviy ball — bezovtalik (QoL) bilan birga hal qiling" /></div>}
      </>}
      <UroOgohlantirish>Ballar: 0–7 yengil · 8–19 o‘rtacha · 20–35 og‘ir. QoL (8-savol) jamiga qo‘shilmaydi, lekin davolash qaroriga kuchli ta’sir qiladi.</UroOgohlantirish>
    </section>

    <KlinikIzoh
      data={{
        anglatadi: 'IPSS pastki siydik yo‘llari simptomlarining (LUTS) og‘irligini 0–35 ballda o‘lchaydi; QoL (8-savol) esa bemor bu holatdan qanchalik bezovta ekanini alohida ko‘rsatadi.',
        anglatmaydi: [
          'Sabab tashxisini qo‘ymaydi — bir xil ball BPH, giperaktiv qovuq yoki prostatitda bo‘lishi mumkin.',
          'Prostata hajmini yoki saraton xavfini o‘lchamaydi.',
          'Ball o‘zi dori yoki jarrohlik ko‘rsatmasini bermaydi.',
        ],
        keyingiQadam: [
          'Bezovtalik (QoL), tungi siyish, oqim va qoldiq siydikni birga baholang.',
          'Kerak bo‘lsa: siydik tahlili, PSA, uroflowmetriya, qoldiq hajm UTT.',
          'O‘rta–og‘irda urolog bilan davolash variantlarini muhokama qiling.',
        ],
        misol: {
          vaziyat: '68 yosh, IPSS 12 (o‘rtacha), lekin QoL 5 — juda bezovta.',
          javob: 'Ball o‘rtacha bo‘lsa-da, yuqori bezovtalik tufayli hayot tarzini o‘zgartirish + alfa-blokator muhokama qilinadi. Ball emas, bezovtalik yetakchi.',
        },
        kopXato: [
          'Ballni bezovtalikdan ustun qo‘yish — past ball ham bemorni juda bezovta qilishi mumkin.',
          'QoL (8-savol)ni umumiy jamiga qo‘shib yuborish.',
        ],
      }}
    />
  </UrologiyaKalkulyatorQobiq>
}
