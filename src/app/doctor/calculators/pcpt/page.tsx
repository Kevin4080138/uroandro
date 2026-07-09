'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla } from '@/lib/kalkulyatorSaqlash'

function hisoblash(yosh: number, aa: boolean, psa: number, dreTog: boolean, oilaTar: boolean, oldinBiopsiya: boolean) {
  const logitHammasi =
    -2.84368 + 0.03059 * yosh + (aa ? 0.68092 : 0) + 0.26758 * Math.log(psa) +
    (dreTog ? 0.83098 : 0) + (oilaTar ? 0.62291 : 0) + (oldinBiopsiya ? -0.83981 : 0)
  const logitYuqori =
    -8.34002 + 0.05837 * yosh + (aa ? 0.5497 : 0) + 1.0818 * Math.log(psa) +
    (dreTog ? 0.4919 : 0) + (oilaTar ? 0.0534 : 0) + (oldinBiopsiya ? -0.0783 : 0)
  return {
    har: Math.min(Math.round(100 / (1 + Math.exp(-logitHammasi))), 99),
    yuq: Math.min(Math.round(100 / (1 + Math.exp(-logitYuqori))), 99),
  }
}

export default function PCPTPage() {
  return <Suspense fallback={null}><PCPTIchki /></Suspense>
}

function PCPTIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio').eq('id', bemorId).single().then(({ data }) => setBemor(data))
  }, [bemorId])

  const [yosh, setYosh] = useState('')
  const [psa, setPsa] = useState('')
  const [aa, setAa] = useState(false)
  const [dreTog, setDreTog] = useState(false)
  const [oilaTar, setOilaTar] = useState(false)
  const [oldinBiopsiya, setOldinBiopsiya] = useState(false)

  const tayyor = yosh !== '' && psa !== '' && +yosh > 0 && +psa > 0
  const natija = tayyor ? hisoblash(+yosh, aa, +psa, dreTog, oilaTar, oldinBiopsiya) : null

  const rang = (foiz: number) => foiz < 15 ? '#16a34a' : foiz < 25 ? '#eab308' : '#dc2626'

  const saqlash = async () => {
    if (!bemorId || !natija) return { error: 'Bemor tanlanmagan yoki ma\'lumotlar to\'liq emas' }
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'pcpt', sarlavha: 'PCPT Risk Kalkulyatori',
      xulosa: `Istalgan saraton: ${natija.har}% | Yuqori daraja (Gleason≥7): ${natija.yuq}%`,
      malumot: { yosh: +yosh, psa: +psa, aa, dreTog, oilaTar, oldinBiopsiya, har: natija.har, yuq: natija.yuq },
    })
  }

  return (
    <AppShell title="PCPT — Prostata saratoni xavfi">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemorId={bemorId} bemor={bemor} tayyor={tayyor} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #b91c1c, #7c3aed)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>PCPT Risk Kalkulyatori</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>PCPT</strong> (Prostate Cancer Prevention Trial) — prostata biopsiyasiga qaror qabul qilishda
            qo&apos;llaniladigan logistik regressiya modeli. Ikkita alohida xavf ko&apos;rsatkich: istalgan saratoni va
            yuqori darajali saratoni (Gleason ≥ 7).
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div className="rise" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Yosh (yil)</label>
              <input type="number" value={yosh} onChange={e => setYosh(e.target.value)} placeholder="55" style={{
                display: 'block', width: '100%', marginTop: '8px', padding: '10px 12px',
                borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--surface-2)',
                fontSize: '16px', fontWeight: 700, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
              }} />
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.04em' }}>PSA (ng/mL)</label>
              <input type="number" value={psa} onChange={e => setPsa(e.target.value)} placeholder="4.0" step="0.1" style={{
                display: 'block', width: '100%', marginTop: '8px', padding: '10px 12px',
                borderRadius: '10px', border: '1px solid var(--line)', background: 'var(--surface-2)',
                fontSize: '16px', fontWeight: 700, color: 'var(--ink)', outline: 'none', boxSizing: 'border-box',
              }} />
            </div>
          </div>

          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px' }}>
            <p style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: 700, color: 'var(--ink-soft)' }}>Qo&apos;shimcha omillar</p>
            {[
              { label: 'Afrika-amerikalik irq (AA)', val: aa, set: setAa },
              { label: 'Rektal tekshiruvda (DRE) patologiya', val: dreTog, set: setDreTog },
              { label: 'Birinchi darajali qarindoshda prostata saratoni', val: oilaTar, set: setOilaTar },
              { label: 'Avval o\'tkazilgan biopsiya — manfiy natija', val: oldinBiopsiya, set: setOldinBiopsiya },
            ].map(({ label, val, set }) => (
              <label key={label} style={{
                display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                padding: '10px 0', borderBottom: '1px solid var(--line)',
              }}>
                <input type="checkbox" checked={val} onChange={e => set(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)', cursor: 'pointer' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 500 }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {natija && (
          <div className="rise" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            {[
              { label: 'Istalgan daraja saratoni xavfi', foiz: natija.har, izoh: 'Gleason 2–10' },
              { label: 'Yuqori daraja saratoni xavfi', foiz: natija.yuq, izoh: 'Gleason ≥ 7' },
            ].map(({ label, foiz, izoh }) => (
              <div key={label} style={{
                background: rang(foiz) + '18', border: `2px solid ${rang(foiz)}`,
                borderRadius: '16px', padding: '22px 24px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, marginBottom: '8px' }}>{label}</div>
                <div style={{ fontSize: '44px', fontWeight: 800, color: rang(foiz), lineHeight: 1 }}>{foiz}%</div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '6px' }}>{izoh}</div>
                <div style={{ marginTop: '10px', height: '8px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${foiz}%`, background: rang(foiz), borderRadius: '999px', transition: 'width .4s ease' }} />
                </div>
                <div style={{ fontSize: '11px', color: rang(foiz), fontWeight: 700, marginTop: '8px' }}>
                  {foiz < 15 ? '🟢 Past xavf' : foiz < 25 ? '🟡 O\'rtacha xavf' : '🔴 Yuqori xavf'}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>PCPT Risk Calculator</strong> — Thompson va boshqlar tomonidan
              2003-yilda NEJM da e&apos;lon qilingan, 2006-yilda yangilangan logistik regressiya modeli.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Thompson IM et al. NEJM 2004; 350:2239. Faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
