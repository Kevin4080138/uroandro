'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }

// CKD-EPI 2021 (irqsiz versiya) — kreatinin mg/dL da
function ckdEpi2021(kreatininMgDl: number, yosh: number, jins: 'erkak' | 'ayol') {
  const k = jins === 'ayol' ? 0.7 : 0.9
  const a = jins === 'ayol' ? -0.241 : -0.302
  const minScr = Math.min(kreatininMgDl / k, 1)
  const maxScr = Math.max(kreatininMgDl / k, 1)
  let egfr = 142 * Math.pow(minScr, a) * Math.pow(maxScr, -1.2) * Math.pow(0.9938, yosh)
  if (jins === 'ayol') egfr *= 1.012
  return egfr
}

function bosqich(egfr: number) {
  if (egfr >= 90) return { nom: 'G1 — Normal yoki yuqori', rang: '#16a34a' }
  if (egfr >= 60) return { nom: 'G2 — Yengil pasaygan', rang: '#65a30d' }
  if (egfr >= 45) return { nom: "G3a — O'rtacha pasaygan", rang: '#d97706' }
  if (egfr >= 30) return { nom: "G3b — O'rtacha-og'ir pasaygan", rang: '#ea580c' }
  if (egfr >= 15) return { nom: "G4 — Og'ir pasaygan", rang: '#dc2626' }
  return { nom: 'G5 — Buyrak yetishmovchiligi', rang: '#991b1b' }
}

export default function EGFRKalkulyator() {
  const router = useRouter()
  const [yosh, setYosh] = useState('')
  const [jins, setJins] = useState<'erkak' | 'ayol'>('erkak')
  const [kreatininBirlik, setKreatininBirlik] = useState<'mgdl' | 'umoll'>('umoll')
  const [kreatinin, setKreatinin] = useState('')

  const yoshN = parseFloat(yosh)
  const kreatininN = parseFloat(kreatinin)
  const kreatininMgDl = kreatininBirlik === 'umoll' ? kreatininN / 88.4 : kreatininN

  const tuldi = Number.isFinite(yoshN) && yoshN > 0 && Number.isFinite(kreatininMgDl) && kreatininMgDl > 0

  const egfr = useMemo(() => (tuldi ? ckdEpi2021(kreatininMgDl, yoshN, jins) : null), [tuldi, kreatininMgDl, yoshN, jins])
  const natija = egfr !== null ? bosqich(egfr) : null

  return (
    <AppShell title="eGFR (CKD-EPI)">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #0369a1, #38bdf8)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>eGFR (CKD-EPI)</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>eGFR</strong> — <em>estimated Glomerular Filtration Rate</em> (taxminiy glomerulyar filtratsiya tezligi) —
            buyraklarning qonni tozalash qobiliyatini baholaydigan asosiy ko&apos;rsatkich.
            <strong> CKD-EPI</strong> (Chronic Kidney Disease Epidemiology Collaboration) 2021-yilgi irqdan mustaqil formulasi bo&apos;yicha hisoblanadi —
            hozirda KDIGO qo&apos;llanmasida tavsiya etilgan eng aniq formula.
          </p>
        </div>

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px', marginBottom: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Yosh</label>
              <input style={inputStyle} type="number" value={yosh} onChange={(e) => setYosh(e.target.value)} placeholder="masalan, 55" />
            </div>
            <div>
              <label style={labelStyle}>Jinsi</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['erkak', 'ayol'] as const).map((j) => (
                  <button key={j} onClick={() => setJins(j)} className="soft-press" style={{
                    flex: 1, border: jins === j ? 'none' : '1px solid var(--line)',
                    background: jins === j ? 'var(--accent)' : 'var(--surface-2)', color: jins === j ? 'white' : 'var(--ink-soft)',
                    borderRadius: '10px', padding: '10px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                  }}>{j === 'erkak' ? 'Erkak' : 'Ayol'}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Kreatinin birligi</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {([{ k: 'umoll' as const, l: 'µmol/L' }, { k: 'mgdl' as const, l: 'mg/dL' }]).map((opt) => (
                  <button key={opt.k} onClick={() => setKreatininBirlik(opt.k)} className="soft-press" style={{
                    flex: 1, border: kreatininBirlik === opt.k ? 'none' : '1px solid var(--line)',
                    background: kreatininBirlik === opt.k ? 'var(--accent)' : 'var(--surface-2)', color: kreatininBirlik === opt.k ? 'white' : 'var(--ink-soft)',
                    borderRadius: '10px', padding: '10px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                  }}>{opt.l}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Zardob kreatinini ({kreatininBirlik === 'umoll' ? 'µmol/L' : 'mg/dL'})</label>
              <input style={inputStyle} type="number" step="0.01" value={kreatinin} onChange={(e) => setKreatinin(e.target.value)} placeholder={kreatininBirlik === 'umoll' ? 'masalan, 88' : 'masalan, 1.0'} />
            </div>
          </div>
        </div>

        {!tuldi ? (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun yosh va kreatinin qiymatini kiriting.</p>
          </div>
        ) : (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>eGFR</div>
                <div style={{ fontSize: '40px', fontWeight: 800, color: natija!.rang, lineHeight: 1.1 }}>{egfr!.toFixed(0)} <span style={{ fontSize: '16px' }}>mL/min/1.73m²</span></div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: natija!.rang, marginTop: '2px' }}>{natija!.nom}</div>
              </div>
            </div>

            <div style={{ marginTop: '18px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                <div style={{ flex: 15, background: '#dc262622' }} />
                <div style={{ flex: 15, background: '#ea580c22' }} />
                <div style={{ flex: 15, background: '#d9770622' }} />
                <div style={{ flex: 15, background: '#65a30d22' }} />
                <div style={{ flex: 40, background: '#16a34a22' }} />
              </div>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px',
                width: `${Math.min((egfr! / 120) * 100, 100)}%`, background: natija!.rang, transition: 'width .3s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--muted)', marginTop: '6px' }}>
              <span>G5 &lt;15</span><span>G4</span><span>G3b</span><span>G3a</span><span>G2-G1 ≥60</span>
            </div>
          </div>
        )}

        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>CKD-EPI</strong> (Chronic Kidney Disease Epidemiology Collaboration) formulasi 2009-yilda ishlab chiqilgan
              va 2021-yilda <strong>irqdan mustaqil</strong> versiyaga yangilangan (oldingi formulada irq koeffitsiyenti bo&apos;lib, bu klinik amaliyotda muhokama qilingan).
              Hozirda <strong>KDIGO</strong> (Kidney Disease: Improving Global Outcomes) xalqaro qo&apos;llanmasida tavsiya etilgan asosiy formula.
            </p>
            <p style={{ margin: 0 }}>
              Formula yosh, jins va zardob kreatinin darajasidan foydalanadi (tana vazni talab qilinmaydi — bu Cockcroft-Gault formulasidan asosiy farqi).
              Natija <strong>mL/min/1.73m²</strong> birligida — standart tana yuzasiga moslashtirilgan ko&apos;rsatkich.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>CKD bosqichlari</strong> (Chronic Kidney Disease — surunkali buyrak kasalligi, KDIGO bo&apos;yicha):
            </p>
            <ul style={{ margin: '0 0 0 18px', padding: 0 }}>
              <li><strong style={{ color: '#16a34a' }}>G1</strong> (≥90) — normal yoki yuqori filtratsiya</li>
              <li><strong style={{ color: '#65a30d' }}>G2</strong> (60–89) — yengil pasaygan</li>
              <li><strong style={{ color: '#d97706' }}>G3a</strong> (45–59) — o&apos;rtacha pasaygan</li>
              <li><strong style={{ color: '#ea580c' }}>G3b</strong> (30–44) — o&apos;rtacha-og&apos;ir pasaygan</li>
              <li><strong style={{ color: '#dc2626' }}>G4</strong> (15–29) — og&apos;ir pasaygan</li>
              <li><strong style={{ color: '#991b1b' }}>G5</strong> (&lt;15) — buyrak yetishmovchiligi (dializ/transplantatsiya ehtiyoji)</li>
            </ul>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Inker LA va boshq. (2021) New Creatinine- and Cystatin C–Based Equations to Estimate GFR without Race. NEJM. KDIGO 2024 CKD qo&apos;llanmasi. Bu kalkulyator faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
