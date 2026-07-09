'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { KalkulyatorBemorPaneli } from '@/components/KalkulyatorBemorPaneli'
import { kalkulyatorNatijasiniSaqla } from '@/lib/kalkulyatorSaqlash'

const SAVOLLAR = [
  { matn: 'Umumiy holat yomonlashuvi (holsizlik, kasallanish sezgisi)', guruh: 'Somatik' },
  { matn: 'Bo\'g\'im va mushaklardagi og\'riq (bel og\'rig\'i, qo\'l va oyoq og\'rig\'i)', guruh: 'Somatik' },
  { matn: 'Haddan tashqari terlash (kecha yoki kunduz)', guruh: 'Somatik' },
  { matn: 'Uyqu muammolari (uxlab bo\'lmaslik, erta uyg\'onish)', guruh: 'Somatik' },
  { matn: 'Ko\'proq uxlash ehtiyoji, tez-tez charchash', guruh: 'Somatik' },
  { matn: 'Asabiylik (atrofdagilarga tez g\'azablanish)', guruh: 'Psixologik' },
  { matn: 'Asabiylashuv (ichki zo\'riqish, huzursizlik)', guruh: 'Psixologik' },
  { matn: 'Xavotirlanish (panic attacks)', guruh: 'Psixologik' },
  { matn: 'Jismoniy holsizlik / hayotiy kuch yo\'qligi', guruh: 'Psixologik' },
  { matn: 'Mushaк kuchining pasayishi', guruh: 'Psixologik' },
  { matn: 'Depressiv kayfiyat (cho\'kkunlik, g\'amginlik, ko\'z yoshi)', guruh: 'Psixologik' },
  { matn: 'Avvalgi cho\'qqingizdan o\'tib bo\'lganingizni his qilish', guruh: 'Psixologik' },
  { matn: 'Kuchdan qolganlik, zerikarli kayfiyat', guruh: 'Psixologik' },
  { matn: 'Soqol o\'sishining susayishi', guruh: 'Somatik' },
  { matn: 'Jinsiy aloqa qobiliyati va chastotasining pasayishi', guruh: 'Jinsiy' },
  { matn: 'Ertalabki ereksiyalar soni va kuchining pasayishi', guruh: 'Jinsiy' },
  { matn: 'Jinsiy ishtiyoq / libidoning pasayishi', guruh: 'Jinsiy' },
]

const VARIANTLAR = ['Yo\'q', 'Yengil', "O'rtacha", 'Og\'ir', 'Juda og\'ir']

function daraja(jami: number) {
  if (jami <= 26) return { nom: 'Simptomsiz', rang: '#16a34a' }
  if (jami <= 36) return { nom: 'Yengil simpomlar', rang: '#84cc16' }
  if (jami <= 49) return { nom: "O'rtacha simpomlar", rang: '#eab308' }
  return { nom: "Og'ir simpomlar", rang: '#dc2626' }
}

export default function AMSPage() {
  return <Suspense fallback={null}><AMSIchki /></Suspense>
}

function AMSIchki() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bemorId = searchParams.get('bemorId')
  const supabase = createClient()
  const [bemor, setBemor] = useState<{ fio: string } | null>(null)

  useEffect(() => {
    if (!bemorId) return
    supabase.from('bemorlar').select('fio').eq('id', bemorId).single().then(({ data }) => setBemor(data))
  }, [bemorId])

  const [javoblar, setJavoblar] = useState<(number | null)[]>(Array(17).fill(null))

  const tuldi = javoblar.every(v => v !== null)
  const jami = useMemo(() => javoblar.reduce((s: number, v) => s + (v ?? 0) + 1, 0), [javoblar])
  const somatikBal = useMemo(() => [0,1,2,3,4,13].reduce((s, i) => s + ((javoblar[i] ?? 0) + 1), 0), [javoblar])
  const psixBal = useMemo(() => [5,6,7,8,9,10,11,12].reduce((s, i) => s + ((javoblar[i] ?? 0) + 1), 0), [javoblar])
  const jinsiyBal = useMemo(() => [14,15,16].reduce((s, i) => s + ((javoblar[i] ?? 0) + 1), 0), [javoblar])

  const nat = daraja(tuldi ? jami : 0)

  const javobBer = (i: number, val: number) => setJavoblar(arr => arr.map((v, j) => j === i ? val : v))
  const qaytaBoshla = () => setJavoblar(Array(17).fill(null))

  const saqlash = async () => {
    if (!bemorId) return { error: 'Bemor tanlanmagan' }
    return kalkulyatorNatijasiniSaqla({
      bemorId, kalkulyator: 'ams', sarlavha: 'AMS Score',
      xulosa: `Jami: ${jami} — ${nat.nom}`,
      malumot: { javoblar, jami, somatikBal, psixBal, jinsiyBal },
    })
  }

  const guruhRang: Record<string, string> = {
    Somatik: '#0369a1',
    Psixologik: '#7c3aed',
    Jinsiy: '#db2777',
  }

  return (
    <AppShell title="AMS Score — Erkak qarilik simptomlari">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <KalkulyatorBemorPaneli bemorId={bemorId} bemor={bemor} tayyor={tuldi} saqlash={saqlash} />

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>AMS Score</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>AMS</strong> (Aging Males&apos; Symptoms) — erkaklar qarilik simptomlari shkala.
            Testosteron yetishmovchiligi bilan bog&apos;liq 17 ta somatik, psixologik va jinsiy simptomni baholaydi.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {SAVOLLAR.map((s, i) => (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.03, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '7px',
                  background: guruhRang[s.guruh] + '22', color: guruhRang[s.guruh],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 800, flexShrink: 0, marginTop: '1px',
                }}>{i + 1}</span>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: '13.5px', fontWeight: 600, lineHeight: 1.4 }}>{s.matn}</p>
                  <span style={{ fontSize: '10.5px', color: guruhRang[s.guruh], fontWeight: 700 }}>{s.guruh}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingLeft: '34px' }}>
                {VARIANTLAR.map((v, vi) => (
                  <button
                    key={v}
                    onClick={() => javobBer(i, vi)}
                    className="soft-press"
                    style={{
                      border: javoblar[i] === vi ? 'none' : '1px solid var(--line)',
                      background: javoblar[i] === vi ? 'var(--accent)' : 'var(--surface-2)',
                      color: javoblar[i] === vi ? 'white' : 'var(--ink-soft)',
                      borderRadius: '999px', padding: '6px 12px', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all .15s',
                    }}
                  >
                    {v} <span style={{ opacity: 0.6 }}>({vi + 1})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{
          marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '24px 26px',
        }}>
          {!tuldi ? (
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>Natijani ko&apos;rish uchun barcha 17 ta savolga javob bering.</p>
          ) : (
            <>
              <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Jami ball (17–85)</div>
              <div style={{ fontSize: '44px', fontWeight: 800, color: nat.rang, lineHeight: 1.1 }}>{jami}</div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: nat.rang }}>{nat.nom}</div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Somatik', bal: somatikBal, rang: '#0369a1' },
                  { label: 'Psixologik', bal: psixBal, rang: '#7c3aed' },
                  { label: 'Jinsiy', bal: jinsiyBal, rang: '#db2777' },
                ].map(d => (
                  <div key={d.label} style={{
                    flex: 1, minWidth: '90px', background: 'var(--surface-2)', borderRadius: '10px',
                    padding: '10px 14px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: d.rang }}>{d.bal}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{d.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '14px', height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '999px', background: nat.rang,
                  width: `${((jami - 17) / (85 - 17)) * 100}%`, transition: 'width .4s',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--muted)', marginTop: '4px' }}>
                <span>17–26 normal</span><span>27–36 yengil</span><span>37–49 o&apos;rtacha</span><span>≥50 og&apos;ir</span>
              </div>

              <button onClick={qaytaBoshla} className="soft-press" style={{
                marginTop: '14px', background: 'var(--surface-2)', border: '1px solid var(--line)',
                borderRadius: '10px', padding: '9px 18px', fontSize: '13px', fontWeight: 600,
                color: 'var(--ink-soft)', cursor: 'pointer',
              }}>
                ↺ Qaytadan boshlash
              </button>
            </>
          )}
        </div>

        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>AMS Score</strong> — 1999-yilda Heinemann va boshqalar tomonidan ishlab chiqilgan.
              17 ta savolning har biri 1–5 ball, jami 17–85 ball oralig&apos;ida. ADAM dan farqli ravishda miqdoriy baholash imkonini beradi.
            </p>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              <li><strong style={{ color: '#16a34a' }}>17–26</strong>: Simptomlar yo&apos;q</li>
              <li><strong style={{ color: '#84cc16' }}>27–36</strong>: Yengil simpomlar</li>
              <li><strong style={{ color: '#eab308' }}>37–49</strong>: O&apos;rtacha simpomlar</li>
              <li><strong style={{ color: '#dc2626' }}>≥50</strong>: Og&apos;ir simpomlar — testosteron tekshirish tavsiya etiladi</li>
            </ul>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Heinemann LA et al. Aging Male 1999; 2:105. EAU Guidelines on Male Hypogonadism 2023.
              Faqat skrining vositasi — testosteron darajasi laboratoriya tahlili bilan tasdiqlanishi shart.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
