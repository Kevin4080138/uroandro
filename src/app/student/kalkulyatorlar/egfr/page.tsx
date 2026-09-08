'use client'

import { useMemo, useState } from 'react'
import { UrologiyaKalkulyatorQobiq, UroOgohlantirish, uroInput, uroKarta, uroLabel } from '@/components/UrologiyaKalkulyatorQobiq'
import { KlinikIzoh, ChegaraviyBelgi, ManbaMeta } from '@/components/KlinikIzoh'
import { ckdEpi2021, egfrBosqich, sonOqi } from '@/lib/urologiyaHisoblash'

export default function EgfrTalabaPage() {
  const [yosh, setYosh] = useState('')
  const [jins, setJins] = useState<'erkak' | 'ayol'>('erkak')
  const [birlik, setBirlik] = useState<'umoll' | 'mgdl'>('umoll')
  const [kreatinin, setKreatinin] = useState('')

  const yoshN = sonOqi(yosh)
  const krN = sonOqi(kreatinin)
  const krMgDl = birlik === 'umoll' ? krN / 88.4 : krN
  const tuldi = Number.isFinite(yoshN) && yoshN > 0 && yoshN < 120 && Number.isFinite(krMgDl) && krMgDl > 0

  const egfr = useMemo(() => (tuldi ? ckdEpi2021(krMgDl, yoshN, jins) : null), [tuldi, krMgDl, yoshN, jins])
  const bosqich = egfr !== null ? egfrBosqich(egfr) : null
  const chegaraviy = egfr !== null && egfr >= 55 && egfr < 65 // G2/G3a (CKD uchun muhim 60 chegarasi atrofida)

  return <UrologiyaKalkulyatorQobiq title="eGFR (CKD-EPI 2021)" subtitle="Kreatinin, yosh va jins asosida koptokchali filtratsiya tezligini (irqsiz CKD-EPI 2021 formulasi) hisoblaydi.">
    <section className="rise" style={{ ...uroKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div><label style={uroLabel}>Yosh (yil)</label><input style={uroInput} type="number" min="18" max="120" value={yosh} onChange={e => setYosh(e.target.value)} placeholder="masalan, 62" /></div>
        <div>
          <label style={uroLabel}>Jins</label>
          <select style={uroInput} value={jins} onChange={e => setJins(e.target.value as 'erkak' | 'ayol')}>
            <option value="erkak">Erkak</option>
            <option value="ayol">Ayol</option>
          </select>
        </div>
        <div>
          <label style={uroLabel}>Kreatinin birligi</label>
          <select style={uroInput} value={birlik} onChange={e => setBirlik(e.target.value as 'umoll' | 'mgdl')}>
            <option value="umoll">µmol/L</option>
            <option value="mgdl">mg/dL</option>
          </select>
        </div>
        <div><label style={uroLabel}>Kreatinin ({birlik === 'umoll' ? 'µmol/L' : 'mg/dL'})</label><input style={uroInput} inputMode="decimal" value={kreatinin} onChange={e => setKreatinin(e.target.value)} placeholder={birlik === 'umoll' ? '90' : '1.0'} /></div>
      </div>
    </section>

    <section className="rise" style={uroKarta}>
      {!bosqich || egfr === null ? <p style={{ margin: 0, color: 'var(--muted)' }}>Yosh, jins va kreatinin qiymatini kiriting.</p> : <>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>eGFR</div>
        <div style={{ fontSize: '38px', fontWeight: 800, color: bosqich.rang }}>{Math.round(egfr)} <span style={{ fontSize: '18px', color: 'var(--muted)' }}>mL/min/1.73m²</span></div>
        <div style={{ marginTop: '4px', fontSize: '15px', fontWeight: 700, color: bosqich.rang }}>{bosqich.nom}</div>
        {chegaraviy && <div><ChegaraviyBelgi matn="Chegaraviy — G2/G3a chegarasida (60)" /></div>}
      </>}
      <UroOgohlantirish>Bitta past eGFR (&lt;60) o‘z-o‘zicha SBK (CKD) tashxisini bermaydi — KDIGO bo‘yicha buzilish kamida 3 oy davom etishi yoki albuminuriya kabi boshqa buyrak shikasti belgisi bo‘lishi kerak. O‘tkir kasallik, degidratatsiya va ayrim dorilar kreatininni vaqtincha oshiradi.</UroOgohlantirish>
    </section>

    <KlinikIzoh
      data={{
        anglatadi: 'eGFR — buyrak koptokchali filtratsiya tezligining asosiy ko‘rsatkichi (CKD-EPI 2021, irqsiz). Natija G1–G5 bosqichga ajratiladi va buyrak funksiyasi qanchalik saqlanganini ko‘rsatadi.',
        anglatmaydi: [
          'Bitta o‘lchov CKD tashxisini qo‘ymaydi — surunkalilik (≥3 oy) yoki boshqa buyrak shikasti belgisi kerak.',
          'Albuminuriyani (A1–A3) o‘lchamaydi — u alohida (ACR) baholanadi va bosqichga qo‘shiladi.',
          'O‘tkir buyrak shikastini surunkalidan ajratmaydi.',
        ],
        keyingiQadam: [
          'Past bo‘lsa: kreatininni takrorlang, oldingi natijalar bilan solishtiring.',
          'Siydik ACR (albumin/kreatinin) va siydik tahlilini qo‘shing.',
          'Barqaror past eGFR + shikast belgisi → to‘liq CKD bosqichlash (G va A birga).',
        ],
        misol: {
          vaziyat: '62 yosh erkak, kreatinin 1.3 mg/dL → eGFR ~58 (G3a).',
          javob: 'Bitta qiymat CKD tasdiqlamaydi. Degidratatsiya/dori kabi o‘tkir sabablarni istisno qilib, ~3 oydan keyin ACR bilan takrorlab baholanadi.',
        },
        kopXato: [
          'Bitta past eGFR asosida darhol «surunkali buyrak kasalligi» deb yozish.',
          'Nefrotoksik dori yoki kontrast oldidan o‘tkir o‘zgarishni hisobga olmaslik.',
        ],
      }}
    />
    <section className="rise" style={{ ...uroKarta, marginTop: '16px' }}>
      <ManbaMeta />
    </section>
  </UrologiyaKalkulyatorQobiq>
}
