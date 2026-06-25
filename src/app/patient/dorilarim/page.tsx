'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { vaqtJadvali, faolKunMi, qolganKunlar } from '@/lib/doriEslatma'
import { pushDastagiHolati, pushYoqish, pushOchirish } from '@/lib/pushClient'

type Retsept = {
  id: string
  nomi: string
  dozasi: string | null
  kuniga_marta: number
  muddat_kun: number
  boshlanish_sanasi: string
  izoh: string | null
  faol: boolean
}

export default function DorilarimPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [retseptlar, setRetseptlar] = useState<Retsept[]>([])
  const [qabullar, setQabullar] = useState<Record<string, true>>({}) // key: `${retsept_id}_${vaqt_tartibi}`
  const [loading, setLoading] = useState(true)
  const [pushHolati, setPushHolati] = useState<'qollab-bolmaydi' | 'ruxsat-berilmagan' | 'rad-etilgan' | 'yoqilgan' | 'tekshirilmoqda'>('tekshirilmoqda')
  const [pushSaving, setPushSaving] = useState(false)
  const [pushXato, setPushXato] = useState<string | null>(null)

  const bugun = new Date().toISOString().slice(0, 10)

  useEffect(() => { pushDastagiHolati().then(setPushHolati) }, [])

  const pushTugmaBosildi = async () => {
    setPushXato(null)
    setPushSaving(true)
    if (pushHolati === 'yoqilgan') {
      await pushOchirish()
      setPushHolati('ruxsat-berilmagan')
    } else {
      const res = await pushYoqish()
      if (res.ok) setPushHolati('yoqilgan')
      else setPushXato(res.error ?? "Yoqib bo'lmadi")
    }
    setPushSaving(false)
  }

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    setUserId(user.id)

    const { data: retseptData } = await supabase
      .from('dori_retseptlari')
      .select('*')
      .eq('bemor_user_id', user.id)
      .eq('faol', true)
      .order('created_at', { ascending: false })
    const royxat = (retseptData as Retsept[]) ?? []
    setRetseptlar(royxat)

    const { data: qabulData } = await supabase
      .from('dori_qabullari')
      .select('retsept_id, vaqt_tartibi')
      .eq('sana', bugun)
      .in('retsept_id', royxat.map((r) => r.id).length ? royxat.map((r) => r.id) : ['00000000-0000-0000-0000-000000000000'])
    const xarita: Record<string, true> = {}
    for (const q of qabulData ?? []) xarita[`${q.retsept_id}_${q.vaqt_tartibi}`] = true
    setQabullar(xarita)

    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const faolRetseptlar = useMemo(() => retseptlar.filter((r) => faolKunMi(r.boshlanish_sanasi, r.muddat_kun)), [retseptlar])
  const tugaganRetseptlar = useMemo(() => retseptlar.filter((r) => !faolKunMi(r.boshlanish_sanasi, r.muddat_kun)), [retseptlar])

  const belgila = async (retseptId: string, vaqtTartibi: number) => {
    if (!userId) return
    const kalit = `${retseptId}_${vaqtTartibi}`
    if (qabullar[kalit]) return
    setQabullar((q) => ({ ...q, [kalit]: true }))
    await supabase.from('dori_qabullari').insert({
      retsept_id: retseptId, bemor_user_id: userId, sana: bugun, vaqt_tartibi: vaqtTartibi,
    })
  }

  const jamiDozalarBugun = faolRetseptlar.reduce((s, r) => s + r.kuniga_marta, 0)
  const qabulQilinganBugun = faolRetseptlar.reduce((s, r) => {
    let count = 0
    for (let v = 1; v <= r.kuniga_marta; v++) if (qabullar[`${r.id}_${v}`]) count++
    return s + count
  }, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[700px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>💊 Dorilarim</h2>
        <p className="rise" style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Shifokoringiz yozgan retseptlar va bugungi qabul eslatmalari.
        </p>

        {pushHolati !== 'tekshirilmoqda' && pushHolati !== 'qollab-bolmaydi' && (
          <div className="rise" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
            background: pushHolati === 'yoqilgan' ? 'color-mix(in srgb, var(--good) 10%, var(--surface))' : 'var(--accent-soft)',
            border: `1px solid ${pushHolati === 'yoqilgan' ? 'var(--good)' : 'var(--accent)'}`,
            borderRadius: '14px', padding: '14px 18px', marginBottom: '18px', animationDelay: '.07s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>{pushHolati === 'yoqilgan' ? '🔔' : pushHolati === 'rad-etilgan' ? '🔕' : '🔔'}</span>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
                  {pushHolati === 'yoqilgan' ? 'Push-bildirishnomalar yoqilgan' : pushHolati === 'rad-etilgan' ? 'Bildirishnomalar bloklangan' : 'Qabul vaqti kelganda eslatma olish'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                  {pushHolati === 'rad-etilgan'
                    ? "Brauzer sozlamalaridan ushbu sayt uchun bildirishnomaga ruxsat bering"
                    : pushHolati === 'yoqilgan'
                      ? "Dori vaqti kelganda telefon/brauzeringizga bildirishnoma keladi"
                      : "Dori ichish vaqti kelganda avtomatik bildirishnoma olish uchun yoqing"}
                </div>
              </div>
            </div>
            {pushHolati !== 'rad-etilgan' && (
              <button onClick={pushTugmaBosildi} disabled={pushSaving} className="soft-press" style={{
                background: pushHolati === 'yoqilgan' ? 'var(--surface-2)' : 'var(--accent)',
                color: pushHolati === 'yoqilgan' ? 'var(--ink-soft)' : 'white',
                border: pushHolati === 'yoqilgan' ? '1px solid var(--line)' : 'none',
                borderRadius: '999px', padding: '8px 18px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
                {pushSaving ? '...' : pushHolati === 'yoqilgan' ? "O'chirish" : '🔔 Yoqish'}
              </button>
            )}
            {pushXato && <span style={{ color: 'var(--danger)', fontSize: '12px', width: '100%' }}>{pushXato}</span>}
          </div>
        )}

        {!loading && faolRetseptlar.length > 0 && (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
            padding: '16px 20px', marginBottom: '22px', animationDelay: '.08s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-soft)' }}>Bugungi qabullar</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>{qabulQilinganBugun}/{jamiDozalarBugun}</span>
            </div>
            <div style={{ height: '8px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                width: `${jamiDozalarBugun ? (qabulQilinganBugun / jamiDozalarBugun) * 100 : 0}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width .3s ease',
              }} />
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : retseptlar.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>💊</div>
            <p style={{ margin: 0 }}>Hozircha sizga retsept yozilmagan.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faolRetseptlar.map((r, i) => {
                const vaqtlar = vaqtJadvali(r.kuniga_marta)
                const qolgan = qolganKunlar(r.boshlanish_sanasi, r.muddat_kun)
                return (
                  <div key={r.id} className="rise" style={{
                    animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
                    background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px 22px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{r.nomi}</h3>
                        {r.dozasi && <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--ink-soft)' }}>{r.dozasi}</p>}
                      </div>
                      <span style={{
                        fontSize: '11px', color: 'var(--accent)', background: 'var(--accent-soft)', borderRadius: '999px',
                        padding: '3px 10px', fontWeight: 700, whiteSpace: 'nowrap',
                      }}>
                        {qolgan} kun qoldi
                      </span>
                    </div>
                    {r.izoh && <p style={{ margin: '8px 0 0', fontSize: '12.5px', color: 'var(--muted)' }}>📝 {r.izoh}</p>}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                      {vaqtlar.map((vaqt, vi) => {
                        const tartibRaqami = vi + 1
                        const qabulQilingan = !!qabullar[`${r.id}_${tartibRaqami}`]
                        return (
                          <button
                            key={vaqt}
                            onClick={() => belgila(r.id, tartibRaqami)}
                            disabled={qabulQilingan}
                            className="soft-press"
                            style={{
                              border: qabulQilingan ? 'none' : '1px solid var(--line)',
                              background: qabulQilingan ? 'var(--good)' : 'var(--surface-2)',
                              color: qabulQilingan ? 'white' : 'var(--ink-soft)',
                              borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: 700,
                              cursor: qabulQilingan ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                            }}
                          >
                            {qabulQilingan ? '✓' : '🕒'} {vaqt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {tugaganRetseptlar.length > 0 && (
              <div style={{ marginTop: '26px' }}>
                <h3 style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em', marginBottom: '10px' }}>
                  Yakunlangan kurslar
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tugaganRetseptlar.map((r) => (
                    <div key={r.id} style={{
                      background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 14px',
                      fontSize: '13px', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between',
                    }}>
                      <span>{r.nomi} {r.dozasi}</span>
                      <span>tugagan</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
