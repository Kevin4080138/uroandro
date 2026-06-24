'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla } from '@/lib/kalkulyatorSaqlash'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }

function hajmDarajasi(hajm: number) {
  if (hajm < 25) return { nom: 'Normal hajm', rang: '#16a34a' }
  if (hajm < 40) return { nom: "Yengil kattalashgan", rang: '#65a30d' }
  if (hajm < 60) return { nom: "O'rtacha kattalashgan", rang: '#d97706' }
  if (hajm < 100) return { nom: "Sezilarli kattalashgan", rang: '#ea580c' }
  return { nom: 'Juda katta', rang: '#dc2626' }
}

export default function ProstataHajmiKalkulyator() {
  return (
    <Suspense fallback={null}>
      <ProstataHajmiIchki />
    </Suspense>
  )
}

function ProstataHajmiIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio').eq('id', bemorId).single().then(({ data }) => setBemor(data))
  }, [bemorId])

  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [psa, setPsa] = useState('')

  const aN = parseFloat(a), bN = parseFloat(b), cN = parseFloat(c)
  const tuldi = [aN, bN, cN].every((v) => Number.isFinite(v) && v > 0)

  // Ellipsoid formula: V = 0.52 × uzunlik × kenglik × balandlik (sm), o'lchamlar mm dan sm ga o'tkaziladi
  const hajm = useMemo(() => (tuldi ? (aN / 10) * (bN / 10) * (cN / 10) * 0.52 : null), [aN, bN, cN, tuldi])
  const daraja = hajm !== null ? hajmDarajasi(hajm) : null

  const psaN = parseFloat(psa)
  const psad = hajm && Number.isFinite(psaN) && hajm > 0 ? psaN / hajm : null

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    const qismlar = [`Hajm: ${hajm!.toFixed(1)} sm³ (${daraja!.nom})`]
    if (psad !== null) qismlar.push(`PSAD: ${psad.toFixed(3)}`)
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'prostata-hajmi', sarlavha: 'Prostata hajmi',
      xulosa: qismlar.join(', '),
      malumot: { a: aN, b: bN, c: cN, hajm, psa: psaN, psad },
    })
  }

  return (
    <AppShell title="Prostata hajmi kalkulyatori">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #ea580c, #facc15)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>Prostata hajmi</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            Transrektal yoki abdominal <strong>USI (ultratovush sonografiyasi)</strong> orqali o&apos;lchangan prostatanning
            uch o&apos;lchami (uzunlik, kenglik, balandlik) asosida <strong>ellipsoid formula</strong> yordamida hajmni hisoblaydi.
            Bu BPH (Benign Prostatic Hyperplasia — prostatanning xavfsiz kattalashishi) monitoringi va <strong>PSAD</strong> (PSA zichligi) hisoblash uchun asosiy ko&apos;rsatkich.
          </p>
        </div>

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px', marginBottom: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Uzunlik / a (mm)</label>
              <input style={inputStyle} type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="masalan, 40" />
            </div>
            <div>
              <label style={labelStyle}>Kenglik / b (mm)</label>
              <input style={inputStyle} type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="masalan, 35" />
            </div>
            <div>
              <label style={labelStyle}>Balandlik / c (mm)</label>
              <input style={inputStyle} type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="masalan, 32" />
            </div>
            <div>
              <label style={labelStyle}>Umumiy PSA (ng/mL) — ixtiyoriy</label>
              <input style={inputStyle} type="number" step="0.01" value={psa} onChange={(e) => setPsa(e.target.value)} placeholder="PSAD hisoblash uchun" />
            </div>
          </div>
        </div>

        {!tuldi ? (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun uchala o&apos;lchamni kiriting.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Prostata hajmi</div>
                  <div style={{ fontSize: '40px', fontWeight: 800, color: daraja!.rang, lineHeight: 1.1 }}>{hajm!.toFixed(1)} <span style={{ fontSize: '20px' }}>sm³</span></div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: daraja!.rang, marginTop: '2px' }}>{daraja!.nom}</div>
                </div>
                <div style={{
                  fontFamily: 'monospace', fontSize: '12px', color: 'var(--muted)', background: 'var(--surface-2)',
                  borderRadius: '10px', padding: '10px 14px', textAlign: 'center',
                }}>
                  V = 0.52 × {(aN / 10).toFixed(1)} × {(bN / 10).toFixed(1)} × {(cN / 10).toFixed(1)}<br />
                  <span style={{ opacity: 0.7 }}>(sm da)</span>
                </div>
              </div>

              {/* Vizual zona ko'rsatkich */}
              <div style={{ marginTop: '18px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                  <div style={{ flex: 25, background: '#16a34a22' }} />
                  <div style={{ flex: 15, background: '#65a30d22' }} />
                  <div style={{ flex: 20, background: '#d9770622' }} />
                  <div style={{ flex: 40, background: '#ea580c22' }} />
                </div>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%', borderRadius: '999px',
                  width: `${Math.min((hajm! / 100) * 100, 100)}%`, background: daraja!.rang, transition: 'width .3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
                <span>0–25</span><span>40</span><span>60</span><span>100+ sm³</span>
              </div>
            </div>

            {psad !== null && (
              <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                  PSA zichligi (PSAD)
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '28px', fontWeight: 800, color: psad > 0.15 ? '#dc2626' : '#16a34a' }}>{psad.toFixed(3)}</span>
                  <span style={{ fontSize: '13.5px', color: 'var(--ink-soft)' }}>ng/mL/sm³ — chegara: 0.15</span>
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '13.5px', fontWeight: 700, color: psad > 0.15 ? '#dc2626' : '#16a34a' }}>
                  {psad > 0.15 ? '⚠ PSAD chegaradan yuqori — qo\'shimcha tekshiruv tavsiya etiladi.' : "✓ PSAD me'zon doirasida."}
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
              Prostata hajmini hisoblashda eng keng qo&apos;llaniladigan usul — <strong style={{ color: 'var(--ink)' }}>ellipsoid formula</strong>:
              prostata taxminan ellipsoid (cho&apos;ziq sharsimon) shaklga ega deb qabul qilinadi va hajm
            </p>
            <p style={{
              margin: '4px 0', fontFamily: 'monospace', fontSize: '14px', background: 'var(--surface-2)',
              borderRadius: '8px', padding: '10px 14px', color: 'var(--ink)',
            }}>
              V (sm³) = 0.52 × uzunlik × kenglik × balandlik (sm da)
            </p>
            <p style={{ margin: 0 }}>
              0.52 koeffitsiyenti — ellipsoid hajm formulasi (π/6 ≈ 0.5236) dan kelib chiqadi. O&apos;lchamlar odatda USI&apos;da
              millimetrlarda (mm) ko&apos;rsatiladi, shuning uchun hisoblashdan oldin 10&apos;ga bo&apos;linib santimetrga (sm) o&apos;tkaziladi.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Normal hajm:</strong> yosh erkaklarda taxminan <strong>20–25 sm³</strong>.
              Yosh ulg&apos;ayishi bilan BPH (Benign Prostatic Hyperplasia) tufayli prostata kattalashishi tabiiy hisoblanadi —
              60 yoshdan keyin 30–40 sm³, ba&apos;zan 60–100 sm³ va undan ortiq bo&apos;lishi mumkin.
            </p>
            <p style={{ margin: 0 }}>
              Prostata hajmi <strong style={{ color: 'var(--ink)' }}>PSAD</strong> (PSA Density — PSA zichligi) hisoblashda
              maxraj sifatida ishlatiladi: PSAD = umumiy PSA ÷ prostata hajmi. Bu PSA darajasini prostatanning o&apos;lchamiga
              nisbatan baholab, faqat katta prostata tufayli yuqori PSA bilan saraton tufayli yuqori PSA&apos;ni farqlashga yordam beradi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: AUA/EAU klinik qo&apos;llanmalari, Terris &amp; Stamey (1991) prostata hajmini USI orqali o&apos;lchash uslubiyoti. Bu kalkulyator faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
