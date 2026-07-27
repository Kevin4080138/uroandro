'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import {
  HAFTA_KUNLARI, haftaKuni, kunSlotlari, otganSlotmi, qabulKunlari, sanaISO,
  type IshJadvali,
} from '@/lib/navbatSlotlar'
import { CalendarCheck, CalendarClock, Stethoscope, Building2, CreditCard, AlertTriangle } from 'lucide-react'

type Shifokor = IshJadvali & {
  doctor_id: string; full_name: string; mutaxassislik: string | null
  qabul_narxi: string | null; klinika_id: string | null
}
type Klinika = { id: string; nom: string; manzil: string | null }
type Navbat = {
  id: string; doctor_id: string; sana: string; vaqt: string; holat: string; izoh: string | null
}

const card = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px 22px',
} as React.CSSProperties

const NAVBAT_HOLATI: Record<string, { text: string; color: string }> = {
  kutilmoqda: { text: 'Kutilmoqda', color: 'var(--warn)' },
  tasdiqlandi: { text: 'Tasdiqlandi', color: 'var(--good)' },
  bekor: { text: 'Bekor qilindi', color: 'var(--danger)' },
  yakunlandi: { text: 'Yakunlandi', color: 'var(--muted)' },
}

export default function NavbatOlishPage() {
  const router = useRouter()
  const supabase = createClient()

  const [shifokorlar, setShifokorlar] = useState<Shifokor[]>([])
  const [klinikalar, setKlinikalar] = useState<Record<string, Klinika>>({})
  const [tanlangan, setTanlangan] = useState<Shifokor | null>(null)
  const [kun, setKun] = useState<Date | null>(null)
  const [bandlar, setBandlar] = useState<string[]>([])
  const [slot, setSlot] = useState<string | null>(null)
  const [izoh, setIzoh] = useState('')
  const [saving, setSaving] = useState(false)
  const [xato, setXato] = useState('')
  const [olindi, setOlindi] = useState(false)
  const [meningNavbatlarim, setMeningNavbatlarim] = useState<Navbat[]>([])
  const [shifokorNomlari, setShifokorNomlari] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const yukla = async () => {
    const [{ data: prof }, { data: kl }, { data: navb }] = await Promise.all([
      supabase.from('shifokor_profillari')
        .select('doctor_id, full_name, mutaxassislik, qabul_narxi, klinika_id, qabul_kunlari, qabul_boshlanish, qabul_tugash, slot_daqiqa')
        .eq('ochiq', true).order('full_name'),
      supabase.from('klinikalar').select('id, nom, manzil'),
      supabase.from('navbatlar').select('id, doctor_id, sana, vaqt, holat, izoh')
        .gte('sana', sanaISO(new Date())).order('sana').order('vaqt'),
    ])
    const slar = (prof as Shifokor[]) ?? []
    setShifokorlar(slar)
    const kmap: Record<string, Klinika> = {}
    for (const k of (kl as Klinika[]) ?? []) kmap[k.id] = k
    setKlinikalar(kmap)
    setMeningNavbatlarim((navb as Navbat[]) ?? [])
    const nmap: Record<string, string> = {}
    for (const s of slar) nmap[s.doctor_id] = s.full_name
    setShifokorNomlari(nmap)

    // katalogdan kelganda ?doctor= bilan oldindan tanlash
    const doctorParam = new URLSearchParams(window.location.search).get('doctor')
    if (doctorParam) {
      const s = slar.find((x) => x.doctor_id === doctorParam)
      if (s) setTanlangan(s)
    }
    setLoading(false)
  }

  useEffect(() => { yukla() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [])

  // kun tanlanganda band slotlarni olish
  useEffect(() => {
    if (!tanlangan || !kun) return
    setBandlar([])
    setSlot(null)
    supabase.rpc('band_slotlar', { d_id: tanlangan.doctor_id, s: sanaISO(kun) }).then(({ data }) => {
      setBandlar(((data as { vaqt: string }[]) ?? []).map((x) => x.vaqt))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tanlangan, kun])

  const bandQil = async () => {
    if (!tanlangan || !kun || !slot) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    setSaving(true)
    setXato('')
    const { error } = await supabase.from('navbatlar').insert({
      doctor_id: tanlangan.doctor_id, patient_id: user.id,
      sana: sanaISO(kun), vaqt: slot, izoh: izoh.trim() || null,
    })
    setSaving(false)
    if (error) {
      // unique index — slot shu orada band bo'lib qolgan
      setXato("Bu vaqt hozirgina band bo'ldi. Boshqa vaqtni tanlang.")
      const { data } = await supabase.rpc('band_slotlar', { d_id: tanlangan.doctor_id, s: sanaISO(kun) })
      setBandlar(((data as { vaqt: string }[]) ?? []).map((x) => x.vaqt))
      setSlot(null)
      return
    }
    setOlindi(true)
    yukla()
  }

  const bekorQil = async (n: Navbat) => {
    await supabase.from('navbatlar').update({ holat: 'bekor' }).eq('id', n.id)
    yukla()
  }

  const sanaChiroyli = (s: Date) =>
    `${s.getDate()}.${String(s.getMonth() + 1).padStart(2, '0')} ${HAFTA_KUNLARI[haftaKuni(s) - 1]}`

  if (olindi && tanlangan && kun && slot) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="fade-in mx-auto max-w-[560px] px-8 py-16 text-center">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--good)' }}><CalendarCheck size={56} strokeWidth={1.5} /></div>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Navbatingiz band qilindi</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          {tanlangan.full_name} — {sanaChiroyli(kun)}, soat <strong style={{ color: 'var(--ink)' }}>{slot}</strong>.
          Shifokor tasdiqlagach holati yangilanadi.
        </p>
        <button onClick={() => { setOlindi(false); setTanlangan(null); setKun(null); setSlot(null); setIzoh('') }} className="btn-animated" style={{
          marginTop: '20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
          padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
        }}>
          Navbatlarimni ko&apos;rish
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />

      <div className="fade-in mx-auto max-w-[640px] px-4 py-8 sm:px-8">
        <h2 style={{ margin: '0 0 4px', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '9px' }}><CalendarClock size={24} strokeWidth={2} /> Navbat olish</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
          Shifokorni tanlang, qulay kun va vaqtni band qiling.
        </p>

        {loading ? <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p> : (
          <>
            {/* Mening navbatlarim */}
            {meningNavbatlarim.filter((n) => n.holat !== 'bekor').length > 0 && (
              <div style={{ ...card, marginBottom: '16px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Mening navbatlarim</p>
                {meningNavbatlarim.filter((n) => n.holat !== 'bekor').map((n) => {
                  const h = NAVBAT_HOLATI[n.holat] ?? NAVBAT_HOLATI.kutilmoqda
                  return (
                    <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px dashed var(--line)', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '13.5px' }}>
                        <strong>{n.sana}</strong> · {n.vaqt} — {shifokorNomlari[n.doctor_id] ?? 'Shifokor'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: h.color, fontSize: '12px', fontWeight: 700 }}>{h.text}</span>
                        {n.holat === 'kutilmoqda' && (
                          <button onClick={() => bekorQil(n)} style={{
                            background: 'none', border: '1px solid var(--line)', borderRadius: '999px',
                            padding: '4px 12px', cursor: 'pointer', fontSize: '11.5px', color: 'var(--danger)',
                          }}>Bekor qilish</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* 1. Shifokor tanlash */}
            <div style={{ ...card, marginBottom: '16px' }}>
              <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>1. Shifokorni tanlang</p>
              {shifokorlar.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>Hozircha navbat oladigan shifokor yo&apos;q.</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {shifokorlar.map((s) => {
                  const kl = s.klinika_id ? klinikalar[s.klinika_id] : null
                  const faol = tanlangan?.doctor_id === s.doctor_id
                  return (
                    <button key={s.doctor_id} onClick={() => { setTanlangan(s); setKun(null); setSlot(null) }} style={{
                      textAlign: 'left', border: faol ? '2px solid var(--accent)' : '1px solid var(--line)',
                      background: faol ? 'var(--accent-soft)' : 'var(--surface-2)',
                      borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', color: 'var(--ink)',
                    }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px' }}><Stethoscope size={16} strokeWidth={2} style={{ flexShrink: 0 }} /> {s.full_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {s.mutaxassislik && <span>{s.mutaxassislik}</span>}
                        {kl && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Building2 size={12} strokeWidth={2} /> {kl.nom}</span>}
                        {s.qabul_narxi && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CreditCard size={12} strokeWidth={2} /> {s.qabul_narxi}</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Kun tanlash */}
            {tanlangan && (
              <div style={{ ...card, marginBottom: '16px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>2. Kunni tanlang</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {qabulKunlari(tanlangan).map((s) => {
                    const faol = kun && sanaISO(kun) === sanaISO(s)
                    return (
                      <button key={sanaISO(s)} onClick={() => setKun(s)} style={{
                        border: faol ? '2px solid var(--accent)' : '1px solid var(--line)',
                        background: faol ? 'var(--accent-soft)' : 'var(--surface-2)',
                        color: faol ? 'var(--accent)' : 'var(--ink)',
                        borderRadius: '10px', padding: '9px 13px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      }}>
                        {sanaChiroyli(s)}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 3. Vaqt tanlash */}
            {tanlangan && kun && (
              <div style={{ ...card, marginBottom: '16px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>3. Vaqtni tanlang</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(78px, 1fr))', gap: '8px' }}>
                  {kunSlotlari(tanlangan).map((v) => {
                    const band = bandlar.includes(v) || otganSlotmi(kun, v)
                    const faol = slot === v
                    return (
                      <button key={v} disabled={band} onClick={() => setSlot(v)} style={{
                        border: faol ? '2px solid var(--accent)' : '1px solid var(--line)',
                        background: band ? 'var(--surface-2)' : faol ? 'var(--accent)' : 'var(--surface)',
                        color: band ? 'var(--muted)' : faol ? 'white' : 'var(--ink)',
                        textDecoration: band ? 'line-through' : 'none',
                        borderRadius: '9px', padding: '9px 4px', cursor: band ? 'not-allowed' : 'pointer',
                        fontSize: '13px', fontWeight: 700, opacity: band ? 0.55 : 1,
                      }}>
                        {v}
                      </button>
                    )
                  })}
                </div>
                {kunSlotlari(tanlangan).every((v) => bandlar.includes(v) || otganSlotmi(kun, v)) && (
                  <p style={{ color: 'var(--muted)', fontSize: '12.5px', margin: '10px 0 0' }}>Bu kunda bo&apos;sh vaqt qolmadi — boshqa kunni tanlang.</p>
                )}
              </div>
            )}

            {/* 4. Tasdiqlash */}
            {tanlangan && kun && slot && (
              <div style={card}>
                <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>4. Tasdiqlash</p>
                <p style={{ margin: '0 0 12px', fontSize: '13.5px' }}>
                  <strong>{tanlangan.full_name}</strong> — {sanaChiroyli(kun)}, soat <strong>{slot}</strong>
                </p>
                <textarea
                  value={izoh} onChange={(e) => setIzoh(e.target.value)}
                  placeholder="Izoh (ixtiyoriy): nima bezovta qilyapti?"
                  style={{
                    width: '100%', minHeight: '56px', background: 'var(--surface-2)', color: 'var(--ink)',
                    border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 12px', fontSize: '13.5px',
                    outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', marginBottom: '12px',
                  }}
                />
                {xato && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '5px' }}><AlertTriangle size={14} strokeWidth={2} style={{ flexShrink: 0 }} /> {xato}</p>}
                <button onClick={bandQil} disabled={saving} className="btn-animated soft-press" style={{
                  width: '100%', background: 'var(--good)', color: 'white', border: 'none', borderRadius: '12px',
                  padding: '14px', cursor: 'pointer', fontSize: '15px', fontWeight: 700, opacity: saving ? 0.7 : 1,
                }}>
                  {saving ? 'Band qilinmoqda...' : '✓ Navbatni band qilish'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
