'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

function ballHisob(psa: number, gleason1: number, gleason2: number, bosqich: string, pozitivYuz: number, yosh: number) {
  let ball = 0

  // PSA bali
  if (psa < 6) ball += 0
  else if (psa < 10) ball += 1
  else if (psa < 20) ball += 2
  else if (psa < 36) ball += 3
  else ball += 4

  // Gleason bali — primary pattern
  if (gleason1 >= 4) ball += 3
  else if (gleason2 === 5 || gleason1 === 3 && gleason2 >= 4) ball += 1

  // Klinik bosqich
  if (bosqich === 'T3a+') ball += 3
  else if (bosqich === 'T2b' || bosqich === 'T2c') ball += 1

  // Pozitiv biyopsiya natijalari %
  if (pozitivYuz >= 34) ball += 1

  // Yosh
  if (yosh >= 50) ball += 1

  return Math.min(ball, 10)
}

const xavfDaraja = (ball: number) => {
  if (ball <= 2) return { nom: 'Past xavf', rang: '#16a34a', bcr: '85%', meta: '95%' }
  if (ball <= 5) return { nom: "O'rtacha xavf", rang: '#eab308', bcr: '67%', meta: '82%' }
  return { nom: 'Yuqori xavf', rang: '#dc2626', bcr: '38%', meta: '56%' }
}

export default function CAPRAPage() {
  const router = useRouter()
  const [psa, setPsa] = useState('')
  const [gl1, setGl1] = useState('')
  const [gl2, setGl2] = useState('')
  const [bosqich, setBosqich] = useState('')
  const [pozitiv, setPozitiv] = useState('')
  const [yosh, setYosh] = useState('')

  const tayyor = psa && gl1 && gl2 && bosqich && pozitiv && yosh
  const jami = tayyor ? ballHisob(+psa, +gl1, +gl2, bosqich, +pozitiv, +yosh) : null
  const natija = jami !== null ? xavfDaraja(jami) : null

  const inp = {
    display: 'block', width: '100%', marginTop: '8px', padding: '10px 12px',
    borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--surface-2)',
    fontSize: '15px', fontWeight: 700, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box' as const,
  }

  return (
    <AppShell title="CAPRA Score — Prostata saratoni prognozi">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #dc2626, #9333ea)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>CAPRA Score</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>CAPRA</strong> (Cancer of the Prostate Risk Assessment) — radikal prostatektomiya yoki nurlanish
            terapiyasidan keyin biokimyoviy relapsni bashorat qilish uchun ishlatiladigan 0–10 ballik klinik model.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              PSA tashxis vaqtida (ng/mL)
            </label>
            <input type="number" value={psa} onChange={e => setPsa(e.target.value)} placeholder="8.5" step="0.1" style={inp} />
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
              &lt;6=0б | 6–9=1б | 10–19=2б | 20–35=3б | ≥36=4б
            </div>
          </div>

          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Yosh (yil)
            </label>
            <input type="number" value={yosh} onChange={e => setYosh(e.target.value)} placeholder="62" style={inp} />
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>≥50 yosh = +1 ball</div>
          </div>

          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Gleason — asosiy pattern (1-5)
            </label>
            <input type="number" value={gl1} onChange={e => setGl1(e.target.value)} placeholder="3" min="1" max="5" style={inp} />
          </div>

          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Gleason — ikkinchi pattern (1-5)
            </label>
            <input type="number" value={gl2} onChange={e => setGl2(e.target.value)} placeholder="4" min="1" max="5" style={inp} />
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
              Asosiy ≥4 = +3б | asosiy 3 + ikk. ≥4 = +1б
            </div>
          </div>

          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Klinik bosqich (T)
            </label>
            <select value={bosqich} onChange={e => setBosqich(e.target.value)} style={{ ...inp, fontSize: '13.5px' }}>
              <option value="">Tanlang...</option>
              <option value="T1-T2a">T1–T2a (0 ball)</option>
              <option value="T2b">T2b (+1 ball)</option>
              <option value="T2c">T2c (+1 ball)</option>
              <option value="T3a+">T3a va undan yuqori (+3 ball)</option>
            </select>
          </div>

          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              Ijobiy biyopsiya yadrolarining ulushi (%)
            </label>
            <input type="number" value={pozitiv} onChange={e => setPozitiv(e.target.value)} placeholder="40" min="0" max="100" style={inp} />
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>≥34% = +1 ball</div>
          </div>
        </div>

        {natija && jami !== null && (
          <div className="rise" style={{
            background: natija.rang + '18', border: `2px solid ${natija.rang}`,
            borderRadius: '16px', padding: '24px 26px', marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: natija.rang, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '.04em', marginBottom: '6px' }}>
                  CAPRA Score
                </div>
                <div style={{ fontSize: '52px', fontWeight: 800, color: natija.rang, lineHeight: 1 }}>{jami}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: natija.rang, marginTop: '4px' }}>{natija.nom}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '14px 18px', textAlign: 'center', minWidth: '110px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '4px' }}>BCR-dan holi bo&apos;lish</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: natija.rang }}>{natija.bcr}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>3 yil</div>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '14px 18px', textAlign: 'center', minWidth: '110px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginBottom: '4px' }}>Metastaz-dan holi</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: natija.rang }}>{natija.meta}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>5 yil</div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '16px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(jami / 10) * 100}%`, background: natija.rang, borderRadius: '999px', transition: 'width .4s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
              <span>0 — Past</span><span>3 — O&apos;rtacha</span><span>6 — Yuqori</span><span>10</span>
            </div>
          </div>
        )}

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>CAPRA</strong> — UCSF (University of California, San Francisco) tomonidan
              ishlab chiqilgan. 5 klinik o&apos;zgaruvchi asosida biokimyoviy relaps (BCR), metastaz va kasallikka oid o&apos;limni bashorat qiladi.
            </p>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li><strong style={{ color: '#16a34a' }}>0–2 ball</strong>: Past xavf — aktiv kuzatuv yoki lokal davolash</li>
              <li><strong style={{ color: '#eab308' }}>3–5 ball</strong>: O&apos;rtacha xavf — ko&apos;proq agresiv davolash</li>
              <li><strong style={{ color: '#dc2626' }}>6–10 ball</strong>: Yuqori xavf — kombinatsiya davolash</li>
            </ul>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              BCR = biokimyoviy relaps (PSA qaytishi). Manba: Cooperberg MR et al. J Urol 2005; 173:1938.
              EAU Prostata Saratoni Qo&apos;llanmasi 2023. Faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
