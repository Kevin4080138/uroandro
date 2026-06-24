'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla, yoshHisobla } from '@/lib/kalkulyatorSaqlash'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }

// Cockcroft-Gault: CrCl (mL/min) = [(140 - yosh) × vazn (kg) × (0.85 agar ayol)] / (72 × kreatinin mg/dL)
function cockcroftGault(yosh: number, vazn: number, kreatininMgDl: number, jins: 'erkak' | 'ayol') {
  const koeff = jins === 'ayol' ? 0.85 : 1
  return ((140 - yosh) * vazn * koeff) / (72 * kreatininMgDl)
}

function daraja(klirens: number) {
  if (klirens >= 90) return { nom: 'Normal funksiya', rang: '#16a34a' }
  if (klirens >= 60) return { nom: 'Yengil pasaygan', rang: '#65a30d' }
  if (klirens >= 30) return { nom: "O'rtacha pasaygan — doza moslashtirish kerak", rang: '#d97706' }
  if (klirens >= 15) return { nom: "Og'ir pasaygan — ehtiyotkorlik bilan dozalash", rang: '#dc2626' }
  return { nom: 'Buyrak yetishmovchiligi', rang: '#991b1b' }
}

export default function CockcroftGaultKalkulyator() {
  return (
    <Suspense fallback={null}>
      <CockcroftGaultIchki />
    </Suspense>
  )
}

function CockcroftGaultIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  const [yosh, setYosh] = useState('')
  const [vazn, setVazn] = useState('')
  const [jins, setJins] = useState<'erkak' | 'ayol'>('erkak')
  const [kreatininBirlik, setKreatininBirlik] = useState<'mgdl' | 'umoll'>('umoll')
  const [kreatinin, setKreatinin] = useState('')

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio, tugilgan_sana').eq('id', bemorId).single().then(({ data }) => {
      setBemor(data)
      const y = yoshHisobla(data?.tugilgan_sana)
      if (y !== null) setYosh(String(y))
    })
  }, [bemorId])

  const yoshN = parseFloat(yosh)
  const vaznN = parseFloat(vazn)
  const kreatininN = parseFloat(kreatinin)
  const kreatininMgDl = kreatininBirlik === 'umoll' ? kreatininN / 88.4 : kreatininN

  const tuldi = [yoshN, vaznN, kreatininMgDl].every((v) => Number.isFinite(v) && v > 0)

  const klirens = useMemo(() => (tuldi ? cockcroftGault(yoshN, vaznN, kreatininMgDl, jins) : null), [tuldi, yoshN, vaznN, kreatininMgDl, jins])
  const natija = klirens !== null ? daraja(klirens) : null

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'cockcroft-gault', sarlavha: 'Kreatinin klirensi (Cockcroft-Gault)',
      xulosa: `CrCl: ${klirens!.toFixed(0)} mL/min — ${natija!.nom}`,
      malumot: { yosh: yoshN, vazn: vaznN, jins, kreatinin: kreatininN, kreatininBirlik, klirens },
    })
  }

  return (
    <AppShell title="Kreatinin klirensi (Cockcroft-Gault)">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemorId={bemorId} bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #0e7490, #06b6d4)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>Kreatinin klirensi (Cockcroft-Gault)</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>CrCl</strong> — <em>Creatinine Clearance</em> (kreatinin klirensi) — buyraklarning kreatininni qondan tozalash tezligi.
            <strong> Cockcroft-Gault</strong> formulasi 1976-yilda taklif qilingan va hozirgача ko&apos;plab dori vositalarini
            (masalan, antibiotiklar, antikoagulyantlar) <strong>dozalashda</strong> rasmiy tavsiya etilgan formula — chunki dori
            sinovlarining ko&apos;pchiligi shu formula asosida o&apos;tkazilgan.
          </p>
        </div>

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px', marginBottom: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Yosh</label>
              <input style={inputStyle} type="number" value={yosh} onChange={(e) => setYosh(e.target.value)} placeholder="masalan, 60" />
            </div>
            <div>
              <label style={labelStyle}>Tana vazni (kg)</label>
              <input style={inputStyle} type="number" value={vazn} onChange={(e) => setVazn(e.target.value)} placeholder="masalan, 78" />
            </div>
            <div>
              <label style={labelStyle}>Jinsi</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['erkak', 'ayol'] as const).map((j) => (
                  <button key={j} onClick={() => setJins(j)} className="soft-press" style={{
                    flex: 1, border: jins === j ? 'none' : '1px solid var(--line)',
                    background: jins === j ? 'var(--accent)' : 'var(--surface-2)', color: jins === j ? 'white' : 'var(--ink-soft)',
                    borderRadius: '10px', padding: '10px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
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
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Zardob kreatinini ({kreatininBirlik === 'umoll' ? 'µmol/L' : 'mg/dL'})</label>
              <input style={inputStyle} type="number" step="0.01" value={kreatinin} onChange={(e) => setKreatinin(e.target.value)} placeholder={kreatininBirlik === 'umoll' ? 'masalan, 88' : 'masalan, 1.0'} />
            </div>
          </div>
        </div>

        {!tuldi ? (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun yosh, vazn va kreatinin qiymatlarini kiriting.</p>
          </div>
        ) : (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Kreatinin klirensi (CrCl)</div>
            <div style={{ fontSize: '40px', fontWeight: 800, color: natija!.rang, lineHeight: 1.1 }}>{klirens!.toFixed(0)} <span style={{ fontSize: '16px' }}>mL/min</span></div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: natija!.rang, marginTop: '2px' }}>{natija!.nom}</div>

            <div style={{ marginTop: '18px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                <div style={{ flex: 15, background: '#991b1b22' }} />
                <div style={{ flex: 15, background: '#dc262622' }} />
                <div style={{ flex: 30, background: '#d9770622' }} />
                <div style={{ flex: 30, background: '#65a30d22' }} />
                <div style={{ flex: 30, background: '#16a34a22' }} />
              </div>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px',
                width: `${Math.min((klirens! / 120) * 100, 100)}%`, background: natija!.rang, transition: 'width .3s ease',
              }} />
            </div>
          </div>
        )}

        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Cockcroft-Gault</strong> formulasi (1976) — kreatinin klirensini (CrCl) hisoblash uchun ishlatiladi:
            </p>
            <p style={{
              margin: '4px 0', fontFamily: 'monospace', fontSize: '13.5px', background: 'var(--surface-2)',
              borderRadius: '8px', padding: '10px 14px', color: 'var(--ink)',
            }}>
              CrCl (mL/min) = [(140 − yosh) × vazn (kg) × (0.85 agar ayol)] ÷ (72 × kreatinin mg/dL)
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>eGFR (CKD-EPI)</strong> dan asosiy farqi — bu formula <strong>tana vazni</strong>ni hisobga oladi va
              natijani standart 1.73m² tana yuzasiga moslashtirmaydi. Shu sababli semiz yoki juda ozg&apos;in bemorlarda CKD-EPI&apos;dan farqli natija berishi mumkin.
            </p>
            <p style={{ margin: 0 }}>
              Klinik amaliyotda <strong style={{ color: 'var(--ink)' }}>dori dozasini buyrak funksiyasiga moslashtirishda</strong> (masalan, kontrast moddalar,
              antibiotiklar, kimyoterapiya preparatlari) ko&apos;pincha aynan shu formula ishlatiladi, chunki dori yo&apos;riqnomalarida
              keltirilgan tavsiyalar tarixan Cockcroft-Gault asosida ishlab chiqilgan.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976. KDIGO va dori dozalash bo&apos;yicha klinik qo&apos;llanmalar. Bu kalkulyator faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
