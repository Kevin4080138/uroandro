'use client'

import { useMemo, useState } from 'react'
import { UrologiyaKalkulyatorQobiq, UroOgohlantirish, uroInput, uroKarta, uroLabel } from '@/components/UrologiyaKalkulyatorQobiq'
import { KlinikIzoh, ChegaraviyBelgi, ManbaMeta } from '@/components/KlinikIzoh'
import { psaYoshMezoni, fpsaXavf, PSAD_CHEGARA, sonOqi } from '@/lib/urologiyaHisoblash'

export default function PsaTalabaPage() {
  const [yosh, setYosh] = useState('')
  const [psa, setPsa] = useState('')
  const [erkin, setErkin] = useState('')
  const [hajm, setHajm] = useState('')

  const yoshN = sonOqi(yosh), psaN = sonOqi(psa), erkinN = sonOqi(erkin), hajmN = sonOqi(hajm)
  const mezon = useMemo(() => (Number.isFinite(yoshN) && yoshN >= 18 ? psaYoshMezoni(yoshN) : null), [yoshN])
  const yuqori = Number.isFinite(psaN) && mezon ? psaN > mezon.maxPSA : null
  const psad = Number.isFinite(psaN) && Number.isFinite(hajmN) && hajmN > 0 ? psaN / hajmN : null
  const fpsaFoiz = Number.isFinite(psaN) && Number.isFinite(erkinN) && psaN > 0 ? (erkinN / psaN) * 100 : null
  const xavf = fpsaFoiz !== null ? fpsaXavf(fpsaFoiz) : null
  const kulrangZona = Number.isFinite(psaN) && psaN >= 4 && psaN <= 10 // 4–10 ng/mL kulrang zona

  const Qator = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', padding: '10px 0', borderTop: '1px solid var(--line)' }}>
      <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: 700, textAlign: 'right' }}>{children}</span>
    </div>
  )

  return <UrologiyaKalkulyatorQobiq title="PSA tahlili — yoshga mos me’zon, zichlik, %fPSA" subtitle="Umumiy PSA ni yoshga mos me’zon bilan solishtiradi; prostata hajmi va erkin PSA berilsa zichlik va %fPSA ni ham hisoblaydi.">
    <section className="rise" style={{ ...uroKarta, marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div><label style={uroLabel}>Yosh (yil)</label><input style={uroInput} type="number" min="18" max="120" value={yosh} onChange={e => setYosh(e.target.value)} placeholder="masalan, 65" /></div>
        <div><label style={uroLabel}>Umumiy PSA (ng/mL)</label><input style={uroInput} inputMode="decimal" value={psa} onChange={e => setPsa(e.target.value)} placeholder="masalan, 6.5" /></div>
        <div><label style={uroLabel}>Erkin PSA (ng/mL) — ixtiyoriy</label><input style={uroInput} inputMode="decimal" value={erkin} onChange={e => setErkin(e.target.value)} placeholder="masalan, 0.9" /></div>
        <div><label style={uroLabel}>Prostata hajmi (sm³) — ixtiyoriy</label><input style={uroInput} inputMode="decimal" value={hajm} onChange={e => setHajm(e.target.value)} placeholder="masalan, 45" /></div>
      </div>
    </section>

    <section className="rise" style={uroKarta}>
      {!mezon || !Number.isFinite(psaN) ? <p style={{ margin: 0, color: 'var(--muted)' }}>Yosh va umumiy PSA qiymatini kiriting.</p> : <>
        <Qator label={`Yoshga mos me’zon (${mezon.oraliq[0]}–${mezon.oraliq[1]} yosh)`}>≤ {mezon.maxPSA} ng/mL</Qator>
        <Qator label="Umumiy PSA holati">
          <span style={{ color: yuqori ? '#dc2626' : '#16a34a' }}>{yuqori ? 'Me’zondan yuqori' : 'Me’zon doirasida'}</span>
        </Qator>
        {psad !== null && <Qator label="PSA zichligi (PSAD)">
          <span style={{ color: psad > PSAD_CHEGARA ? '#dc2626' : '#16a34a' }}>{psad.toFixed(3)} ng/mL/sm³</span>
        </Qator>}
        {xavf && fpsaFoiz !== null && <Qator label={`%fPSA (${fpsaFoiz.toFixed(0)}%)`}>
          <span style={{ color: xavf.rang }}>{xavf.daraja} · {xavf.ehtimol}</span>
        </Qator>}
        {kulrangZona && <ChegaraviyBelgi matn="Kulrang zona (PSA 4–10) — %fPSA va MRT bilan aniqlashtiring" />}
      </>}
      <UroOgohlantirish>PSA zichligi 0.15 mutlaq biopsiya chegarasi emas; MRT (PI-RADS), prostata hajmi, yosh, anamnez va umumiy xavf bilan birga baholanadi. %fPSA ayniqsa PSA 4–10 ng/mL «kulrang zona»da foydali.</UroOgohlantirish>
    </section>

    <KlinikIzoh
      data={{
        anglatadi: 'PSA ni yoshga mos me’zon bilan solishtiradi; prostata hajmi berilsa zichlik (PSAD), erkin PSA berilsa %fPSA orqali saraton xavfini aniqlashtiradi. Bu — biopsiya zaruratini baholashga yordamchi xavf ko‘rsatkichlari.',
        anglatmaydi: [
          'Saraton tashxisini qo‘ymaydi — faqat xavfni baholaydi.',
          'Yuqori PSA «biopsiya kerak» degani emas.',
          'BPH, prostatit, kateter, ejakulyatsiya va velosiped ham PSA ni oshiradi.',
        ],
        keyingiQadam: [
          'Yaqinda infeksiya/ejakulyatsiya bo‘lgan bo‘lsa, PSA ni takrorlang.',
          'MRT (PI-RADS), zichlik va umumiy klinik xavf bilan birga baholang.',
          'Biopsiya qarorini urolog qabul qiladi — ball o‘zi emas.',
        ],
        misol: {
          vaziyat: '65 yosh, PSA 6.2, prostata hajmi 60 sm³, %fPSA 22%.',
          javob: 'Yoshga mos me’zon (4.5) dan yuqori, lekin katta hajmda PSAD ~0.10 (<0.15) va %fPSA yuqori — past-o‘rta xavf. Darhol biopsiya emas: MRT va takroriy PSA.',
        },
        kopXato: [
          'Yosh va hajmga qaramay bitta «4.0» chegarasini qo‘llash.',
          'Bitta yuqori PSA asosida darhol biopsiyaga yo‘naltirish.',
        ],
      }}
    />
    <section className="rise" style={{ ...uroKarta, marginTop: '16px' }}>
      <ManbaMeta />
    </section>
  </UrologiyaKalkulyatorQobiq>
}
