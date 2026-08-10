'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { vaqtJadvali, faolKunMi, qolganKunlar, tugashSanasi, vaqtKelmadiMi } from '@/lib/doriEslatma'
import { pushDastagiHolati, pushYoqish, pushOchirish } from '@/lib/pushClient'
import { HaftalikIntizom } from '@/components/HaftalikIntizom'
import { Pill, CalendarDays, Bell, BellOff, CheckCircle2, Lock, RefreshCw, StickyNote, Clock, Hourglass } from 'lucide-react'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

const HAFTA_KUNLARI = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
const OYLAR = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr']

function bugungiSanaMatni() {
  const d = new Date()
  return `${HAFTA_KUNLARI[d.getDay()]}, ${d.getDate()}-${OYLAR[d.getMonth()]}`
}

type Retsept = {
  id: string
  nomi: string
  dozasi: string | null
  kuniga_marta: number
  muddat_kun: number
  boshlanish_sanasi: string
  izoh: string | null
  faol: boolean
  davom_sorovi_yuborilgan: boolean
}
type Doza = { retsept: Retsept; vaqt: string; tartibi: number; qabulQilingan: boolean }

export default function DorilarimPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [retseptlar, setRetseptlar] = useState<Retsept[]>([])
  const [qabullar, setQabullar] = useState<Record<string, true>>({}) // key: `${retsept_id}_${vaqt_tartibi}`
  const [loading, setLoading] = useState(true)
  const [belgilanmoqda, setBelgilanmoqda] = useState<string | null>(null)
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

  // Bugungi barcha dozalarni bitta ro'yxatga yig'ib, vaqti bo'yicha tartiblash
  const bugungiDozalar = useMemo(() => {
    const royxat: Doza[] = []
    for (const r of faolRetseptlar) {
      vaqtJadvali(r.kuniga_marta).forEach((vaqt, vi) => {
        const tartibi = vi + 1
        royxat.push({ retsept: r, vaqt, tartibi, qabulQilingan: !!qabullar[`${r.id}_${tartibi}`] })
      })
    }
    royxat.sort((a, b) => a.vaqt.localeCompare(b.vaqt))
    return royxat
  }, [faolRetseptlar, qabullar])

  const ichilmagan = bugungiDozalar.filter((d) => !d.qabulQilingan)
  const ichilgan = bugungiDozalar.filter((d) => d.qabulQilingan)

  // Bir vaqtda ichiladigan dorilarni bitta guruhga (katakka) yig'amiz
  const ichilmaganGuruhlar = useMemo(() => {
    const xarita = new Map<string, Doza[]>()
    for (const d of ichilmagan) {
      if (!xarita.has(d.vaqt)) xarita.set(d.vaqt, [])
      xarita.get(d.vaqt)!.push(d)
    }
    return Array.from(xarita.entries()).map(([vaqt, dozalar]) => ({ vaqt, dozalar }))
  }, [ichilmagan])

  const belgila = async (d: Doza) => {
    if (!userId) return
    const kalit = `${d.retsept.id}_${d.tartibi}`
    if (qabullar[kalit]) return
    if (vaqtKelmadiMi(d.vaqt)) { alert(`Bu doza vaqti hali kelmadi (${d.vaqt}). Vaqti kelganda belgilashingiz mumkin.`); return }
    setBelgilanmoqda(kalit)
    setQabullar((q) => ({ ...q, [kalit]: true }))
    await supabase.from('dori_qabullari').insert({
      retsept_id: d.retsept.id, bemor_user_id: userId, sana: bugun, vaqt_tartibi: d.tartibi,
    })
    setBelgilanmoqda(null)
  }

  const sorovYubor = async (retseptId: string) => {
    setRetseptlar((arr) => arr.map((r) => (r.id === retseptId ? { ...r, davom_sorovi_yuborilgan: true } : r)))
    await supabase.rpc('dori_davom_sorovi', { retsept_id: retseptId })
  }

  const jamiDozalarBugun = bugungiDozalar.length
  const qabulQilinganBugun = ichilgan.length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[700px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}><Pill size={24} strokeWidth={2} /> Dorilarim</h2>
        <p className="rise" style={{ margin: '0 0 20px', color: 'var(--accent)', fontSize: '13.5px', fontWeight: 700, animationDelay: '.03s', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CalendarDays size={15} strokeWidth={2} /> Bugun — {bugungiSanaMatni()}
        </p>

        {pushHolati !== 'tekshirilmoqda' && pushHolati !== 'qollab-bolmaydi' && (
          <div className="rise" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
            background: pushHolati === 'yoqilgan' ? 'color-mix(in srgb, var(--good) 10%, var(--surface))' : 'var(--accent-soft)',
            border: `1px solid ${pushHolati === 'yoqilgan' ? 'var(--good)' : 'var(--accent)'}`,
            borderRadius: '14px', padding: '14px 18px', marginBottom: '18px', animationDelay: '.07s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'flex', color: pushHolati === 'yoqilgan' ? 'var(--good)' : 'var(--accent)' }}>{pushHolati === 'rad-etilgan' ? <BellOff size={18} strokeWidth={2} /> : <Bell size={18} strokeWidth={2} />}</span>
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
                {pushSaving ? '...' : pushHolati === 'yoqilgan' ? "O'chirish" : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Bell size={14} strokeWidth={2} /> Yoqish</span>}
              </button>
            )}
            {pushXato && <span style={{ color: 'var(--danger)', fontSize: '12px', width: '100%' }}>{pushXato}</span>}
          </div>
        )}

        {!loading && <HaftalikIntizom />}

        {!loading && jamiDozalarBugun > 0 && (
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
          <UrosferaLoaderMini />
        ) : retseptlar.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'var(--muted)' }}><Pill size={38} strokeWidth={1.5} /></div>
            <p style={{ margin: 0 }}>Hozircha sizga retsept yozilmagan.</p>
          </div>
        ) : (
          <>
            {/* Bugungi reja — ichilmagan va ichilgan deb guruhlangan */}
            {jamiDozalarBugun > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Hourglass size={14} strokeWidth={2} /> Hali ichilmagan ({ichilmagan.length})
                </h3>
                {ichilmagan.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--good)', fontWeight: 700, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={15} strokeWidth={2} /> Bugungi barcha dozalar qabul qilindi!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                    {ichilmaganGuruhlar.map((g) => {
                      const kelmadi = vaqtKelmadiMi(g.vaqt)
                      return (
                        <div key={g.vaqt} className="rise" style={{
                          background: 'var(--surface)', border: `1px solid ${kelmadi ? 'var(--line)' : 'var(--accent)'}`,
                          borderRadius: '14px', padding: '12px 16px', opacity: kelmadi ? 0.75 : 1,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{
                              fontSize: '13px', fontWeight: 800, color: kelmadi ? 'var(--muted)' : 'var(--accent)',
                              background: kelmadi ? 'var(--surface-2)' : 'var(--accent-soft)',
                              borderRadius: '8px', padding: '4px 9px',
                            }}>
                              {g.vaqt}
                            </span>
                            {kelmadi && (
                              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} strokeWidth={2} /> Vaqti hali kelmadi</span>
                            )}
                            {g.dozalar.length > 1 && (
                              <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto' }}>{g.dozalar.length} ta dori</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {g.dozalar.map((d) => {
                              const kalit = `${d.retsept.id}_${d.tartibi}`
                              return (
                                <div key={kalit} style={{
                                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
                                  background: 'var(--surface-2)', borderRadius: '10px', padding: '8px 12px',
                                }}>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{d.retsept.nomi}</div>
                                    {d.retsept.dozasi && <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{d.retsept.dozasi}</div>}
                                  </div>
                                  <button
                                    onClick={() => belgila(d)}
                                    disabled={belgilanmoqda === kalit || kelmadi}
                                    title={kelmadi ? `Vaqti ${g.vaqt}da keladi` : undefined}
                                    className="soft-press"
                                    style={{
                                      background: kelmadi ? 'var(--surface)' : 'var(--accent)',
                                      color: kelmadi ? 'var(--muted)' : 'white',
                                      border: kelmadi ? '1px solid var(--line)' : 'none', borderRadius: '999px',
                                      padding: '7px 14px', cursor: kelmadi ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 700, flexShrink: 0,
                                    }}
                                  >
                                    {belgilanmoqda === kalit ? '...' : kelmadi ? <Lock size={14} strokeWidth={2} /> : '✓ Ichdim'}
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {ichilgan.length > 0 && (
                  <>
                    <h3 style={{ fontSize: '13px', color: 'var(--good)', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} strokeWidth={2} /> Ichilgan ({ichilgan.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {ichilgan.map((d) => (
                        <div key={`${d.retsept.id}_${d.tartibi}`} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          background: 'var(--surface-2)', borderRadius: '10px', padding: '9px 14px', opacity: 0.7,
                        }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', flexShrink: 0 }}>{d.vaqt}</span>
                          <span style={{ fontSize: '13px', textDecoration: 'line-through' }}>{d.retsept.nomi}</span>
                          <span style={{ marginLeft: 'auto', color: 'var(--good)', fontWeight: 800, fontSize: '13px' }}>✓</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Dorilar haqida umumiy ma'lumot (faqat ma'lumot, harakat bugungi reja orqali) */}
            <h3 style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em', marginBottom: '10px' }}>
              Faol retseptlar
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {faolRetseptlar.map((r, i) => {
                const qolgan = qolganKunlar(r.boshlanish_sanasi, r.muddat_kun)
                return (
                  <div key={r.id} className="rise" style={{
                    animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
                    background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '14px 18px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700 }}>{r.nomi}</h4>
                        {r.dozasi && <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--ink-soft)' }}>{r.dozasi}</p>}
                      </div>
                      <span style={{
                        fontSize: '10.5px', color: 'var(--accent)', background: 'var(--accent-soft)', borderRadius: '999px',
                        padding: '3px 10px', fontWeight: 700, whiteSpace: 'nowrap',
                      }}>
                        {qolgan} kun qoldi
                      </span>
                    </div>
                    {r.izoh && <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}><StickyNote size={13} strokeWidth={2} style={{ flexShrink: 0 }} /> {r.izoh}</p>}
                    <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CalendarDays size={13} strokeWidth={2} style={{ flexShrink: 0 }} /> {r.boshlanish_sanasi} — {tugashSanasi(r.boshlanish_sanasi, r.muddat_kun)} · kuniga {r.kuniga_marta} marta
                    </p>

                    {qolgan <= 1 && (
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--line)' }}>
                        {r.davom_sorovi_yuborilgan ? (
                          <span style={{ fontSize: '12px', color: 'var(--good)', fontWeight: 700 }}>✓ Davom ettirish so&apos;rovi yuborildi</span>
                        ) : (
                          <button onClick={() => sorovYubor(r.id)} className="soft-press" style={{
                            background: 'var(--warn)', color: 'white', border: 'none', borderRadius: '999px',
                            padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                          }}>
                            <RefreshCw size={13} strokeWidth={2} /> {qolgan === 0 ? 'Kurs tugadi' : 'Kurs ertaga tugaydi'} — davom ettirishni so&apos;rash
                          </button>
                        )}
                      </div>
                    )}
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
                      alignItems: 'center', gap: '10px', flexWrap: 'wrap',
                    }}>
                      <span>{r.nomi} {r.dozasi}</span>
                      {r.davom_sorovi_yuborilgan ? (
                        <span style={{ color: 'var(--good)', fontWeight: 700, fontSize: '11.5px' }}>✓ So&apos;rov yuborildi</span>
                      ) : (
                        <button onClick={() => sorovYubor(r.id)} className="soft-press" style={{
                          background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: '999px',
                          padding: '4px 12px', cursor: 'pointer', fontSize: '11.5px', fontWeight: 700,
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                        }}>
                          <RefreshCw size={12} strokeWidth={2} /> Davom ettirishni so&apos;rash
                        </button>
                      )}
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
