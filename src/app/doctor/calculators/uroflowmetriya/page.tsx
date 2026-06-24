'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }

// Qmax (mL/s) bo'yicha taxminiy izoh (erkaklar uchun, hajm ≥150 mL bo'lganda eng ishonchli)
function qmaxIzoh(qmax: number, yosh: number) {
  const chegara = yosh >= 60 ? 10 : 15
  if (qmax >= chegara + 5) return { nom: 'Normal oqim', rang: '#16a34a' }
  if (qmax >= chegara) return { nom: "Chegara holat", rang: '#d97706' }
  return { nom: 'Pasaygan oqim (obstruktiv)', rang: '#dc2626' }
}

export default function UroflowmetriyaKalkulyator() {
  const router = useRouter()
  const [hajm, setHajm] = useState('')
  const [qmax, setQmax] = useState('')
  const [vaqt, setVaqt] = useState('')
  const [qoldiq, setQoldiq] = useState('')
  const [yosh, setYosh] = useState('60')

  const hajmN = parseFloat(hajm)
  const qmaxN = parseFloat(qmax)
  const vaqtN = parseFloat(vaqt)
  const qoldiqN = parseFloat(qoldiq)
  const yoshN = parseFloat(yosh) || 60

  const hajmYetarli = Number.isFinite(hajmN) && hajmN >= 150
  const tuldi = Number.isFinite(qmaxN) && qmaxN > 0

  const qoFlow = Number.isFinite(hajmN) && Number.isFinite(vaqtN) && vaqtN > 0 ? hajmN / vaqtN : null
  const natija = tuldi ? qmaxIzoh(qmaxN, yoshN) : null

  return (
    <AppShell title="Uroflowmetriya baholash">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #1d4ed8, #06b6d4)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>Uroflowmetriya baholash</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>Uroflowmetriya</strong> — siydik oqimi tezligini grafik tarzda o&apos;lchaydigan noinvaziv tekshiruv.
            Eng muhim ko&apos;rsatkich — <strong>Qmax</strong> (maksimal oqim tezligi, mL/s) — pastki siydik yo&apos;llari
            obstruksiyasi (BPH, siydik chiqarish kanali tor­ayishi va h.k.) borligini taxminiy baholashga yordam beradi.
          </p>
        </div>

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px', marginBottom: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Bemor yoshi</label>
              <input style={inputStyle} type="number" value={yosh} onChange={(e) => setYosh(e.target.value)} placeholder="masalan, 60" />
            </div>
            <div>
              <label style={labelStyle}>Siydikni umumiy hajmi (mL)</label>
              <input style={inputStyle} type="number" value={hajm} onChange={(e) => setHajm(e.target.value)} placeholder="masalan, 280" />
            </div>
            <div>
              <label style={labelStyle}>Qmax — maksimal oqim tezligi (mL/s) *</label>
              <input style={inputStyle} type="number" step="0.1" value={qmax} onChange={(e) => setQmax(e.target.value)} placeholder="masalan, 12" />
            </div>
            <div>
              <label style={labelStyle}>Siyish davomiyligi (soniya)</label>
              <input style={inputStyle} type="number" value={vaqt} onChange={(e) => setVaqt(e.target.value)} placeholder="masalan, 35" />
            </div>
            <div>
              <label style={labelStyle}>Qovuqda qolgan siydik (PVR, mL) — ixtiyoriy</label>
              <input style={inputStyle} type="number" value={qoldiq} onChange={(e) => setQoldiq(e.target.value)} placeholder="masalan, 30" />
            </div>
          </div>
        </div>

        {!tuldi ? (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun Qmax qiymatini kiriting.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Qmax</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: natija!.rang, lineHeight: 1.1 }}>{qmaxN} <span style={{ fontSize: '16px' }}>mL/s</span></div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: natija!.rang, marginTop: '2px' }}>{natija!.nom}</div>

              {!hajmYetarli && (
                <p style={{ margin: '12px 0 0', fontSize: '12.5px', color: '#d97706', background: '#d977061a', borderRadius: '8px', padding: '8px 12px' }}>
                  ⚠ Eng ishonchli natija uchun siydik hajmi kamida 150 mL bo&apos;lishi tavsiya etiladi (hozir: {hajm || '—'} mL).
                </p>
              )}

              <p style={{ margin: '12px 0 0', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                {yoshN >= 60
                  ? "60 yoshdan katta erkaklarda Qmax ≥15 mL/s — normal, 10–15 mL/s — chegara, <10 mL/s — obstruktiv tipga xos."
                  : "60 yoshgacha erkaklarda Qmax ≥20 mL/s — normal, 15–20 mL/s — chegara, <15 mL/s — obstruktiv tipga xos."}
              </p>
            </div>

            {qoFlow !== null && (
              <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  O&apos;rtacha oqim tezligi (Qave)
                </h3>
                <div style={{ fontSize: '26px', fontWeight: 800 }}>{qoFlow.toFixed(1)} <span style={{ fontSize: '14px', color: 'var(--muted)' }}>mL/s</span></div>
              </div>
            )}

            {Number.isFinite(qoldiqN) && (
              <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  Qovuqda qolgan siydik (PVR)
                </h3>
                <div style={{ fontSize: '26px', fontWeight: 800, color: qoldiqN > 100 ? '#dc2626' : qoldiqN > 50 ? '#d97706' : '#16a34a' }}>
                  {qoldiqN} <span style={{ fontSize: '14px', color: 'var(--muted)' }}>mL</span>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--ink-soft)' }}>
                  {qoldiqN > 100 ? "100 mL'dan katta — siydik pufagi to'liq bo'shamasligi (retensiya) belgisi, qo'shimcha tekshiruv tavsiya etiladi." : qoldiqN > 50 ? "50–100 mL — chegara holat, dinamikada kuzatish tavsiya etiladi." : "50 mL'dan kam — normal qabul qilinadi."}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Uroflowmetriya</strong> — bemor tabiiy ravishda siyishi vaqtida siydik oqimi tezligini
              vaqt bo&apos;yicha grafik tarzda qayd qiluvchi noinvaziv (asbob kiritilmaydigan) urodinamik tekshiruv.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Qmax</strong> (Maximum flow rate — maksimal oqim tezligi) — eng muhim ko&apos;rsatkich,
              mL/s birligida o&apos;lchanadi. Natija <strong>siydik hajmiga bog&apos;liq</strong> — ICS (International Continence Society)
              tavsiyasiga ko&apos;ra, ishonchli natija uchun siyish hajmi kamida <strong>150 mL</strong> bo&apos;lishi kerak.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Qave</strong> (Average/mean flow rate — o&apos;rtacha oqim tezligi) = umumiy hajm ÷ siyish davomiyligi.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>PVR</strong> (Post-Void Residual — siyishdan keyin qovuqda qolgan siydik) — odatda USI orqali o&apos;lchanadi,
              qovuqning to&apos;liq bo&apos;shamasligini (detruzor zaifligi yoki obstruksiya) ko&apos;rsatadi.
            </p>
            <p style={{ margin: 0 }}>
              Taxminiy me&apos;zonlar (yoshga bog&apos;liq, erkaklar uchun): yoshroq erkaklarda Qmax ≥20 mL/s, 60 yoshdan katta erkaklarda
              ≥15 mL/s normal hisoblanadi. <strong style={{ color: 'var(--ink)' }}>&lt;10 mL/s</strong> ko&apos;pincha obstruktiv tipga (masalan, BPH) xos deb baholanadi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: ICS (International Continence Society) urodinamik tekshiruv standartlari, AUA/EAU BPH qo&apos;llanmalari. Uroflowmetriya yagona tashxis vositasi emas — bosim-oqim tekshiruvi (pressure-flow study) bilan birga baholash tavsiya etiladi. Bu kalkulyator faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
