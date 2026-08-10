'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { HAFTA_KUNLARI, sanaISO } from '@/lib/navbatSlotlar'
import { Phone, MessageSquare, Calendar, Archive, ChevronUp, ChevronDown, CalendarClock, AlertTriangle } from 'lucide-react'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Navbat = {
  id: string; patient_id: string; sana: string; vaqt: string; holat: string; izoh: string | null
}

const card = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '14px',
} as React.CSSProperties
const input = {
  background: 'var(--surface-2)', color: 'var(--ink)', border: '1.5px solid var(--line)',
  borderRadius: '9px', padding: '8px 10px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' as const,
}

const HOLAT: Record<string, { text: string; color: string }> = {
  kutilmoqda: { text: 'Kutilmoqda', color: 'var(--warn)' },
  tasdiqlandi: { text: 'Tasdiqlandi', color: 'var(--good)' },
  bekor: { text: 'Bekor', color: 'var(--danger)' },
  yakunlandi: { text: 'Yakunlandi', color: 'var(--muted)' },
}

export default function DoctorNavbatlarPage() {
  const router = useRouter()
  const supabase = createClient()

  const [myId, setMyId] = useState<string | null>(null)
  const [navbatlar, setNavbatlar] = useState<Navbat[]>([])
  const [bemorNomlari, setBemorNomlari] = useState<Record<string, { name: string; telefon: string | null }>>({})
  const [loading, setLoading] = useState(true)

  // ish jadvali sozlamalari
  const [profilBor, setProfilBor] = useState(false)
  const [kunlar, setKunlar] = useState<number[]>([1, 2, 3, 4, 5, 6])
  const [boshlanish, setBoshlanish] = useState('09:00')
  const [tugash, setTugash] = useState('17:00')
  const [slotDaqiqa, setSlotDaqiqa] = useState(30)
  const [jadvalSaving, setJadvalSaving] = useState(false)
  const [jadvalSaqlandi, setJadvalSaqlandi] = useState(false)
  const [otganlarKorsat, setOtganlarKorsat] = useState(false)

  const yukla = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    setMyId(user.id)

    const [{ data: prof }, { data: navb }] = await Promise.all([
      supabase.from('shifokor_profillari')
        .select('qabul_kunlari, qabul_boshlanish, qabul_tugash, slot_daqiqa')
        .eq('doctor_id', user.id).maybeSingle(),
      supabase.from('navbatlar').select('*').eq('doctor_id', user.id)
        .order('sana').order('vaqt'),
    ])

    if (prof) {
      setProfilBor(true)
      setKunlar(Array.isArray(prof.qabul_kunlari) ? prof.qabul_kunlari : [1, 2, 3, 4, 5, 6])
      setBoshlanish(prof.qabul_boshlanish ?? '09:00')
      setTugash(prof.qabul_tugash ?? '17:00')
      setSlotDaqiqa(prof.slot_daqiqa ?? 30)
    }

    const list = (navb as Navbat[]) ?? []
    setNavbatlar(list)

    const patientIds = Array.from(new Set(list.map((n) => n.patient_id)))
    if (patientIds.length > 0) {
      const { data: pats } = await supabase.from('profiles').select('id, full_name, telefon').in('id', patientIds)
      const map: Record<string, { name: string; telefon: string | null }> = {}
      for (const p of pats ?? []) map[p.id] = { name: p.full_name, telefon: p.telefon }
      setBemorNomlari(map)
    }
    setLoading(false)
  }

  useEffect(() => { yukla() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [])

  const jadvalSaqla = async () => {
    if (!myId) return
    setJadvalSaving(true)
    if (profilBor) {
      await supabase.from('shifokor_profillari').update({
        qabul_kunlari: kunlar, qabul_boshlanish: boshlanish, qabul_tugash: tugash,
        slot_daqiqa: slotDaqiqa, updated_at: new Date().toISOString(),
      }).eq('doctor_id', myId)
    } else {
      const { data: prof } = await supabase.from('profiles').select('full_name').eq('id', myId).single()
      await supabase.from('shifokor_profillari').insert({
        doctor_id: myId, full_name: prof?.full_name ?? 'Shifokor',
        qabul_kunlari: kunlar, qabul_boshlanish: boshlanish, qabul_tugash: tugash, slot_daqiqa: slotDaqiqa,
      })
      setProfilBor(true)
    }
    setJadvalSaving(false)
    setJadvalSaqlandi(true)
    setTimeout(() => setJadvalSaqlandi(false), 2000)
  }

  const holatOzgartir = async (n: Navbat, holat: string) => {
    await supabase.from('navbatlar').update({ holat }).eq('id', n.id)
    yukla()
  }

  const bugun = sanaISO(new Date())
  const kelgusi = navbatlar.filter((n) => n.sana >= bugun && n.holat !== 'bekor')
  const otganlar = navbatlar.filter((n) => n.sana < bugun || n.holat === 'bekor')

  // sana bo'yicha guruhlash
  const guruhlar: { sana: string; royxat: Navbat[] }[] = []
  for (const n of kelgusi) {
    const oxirgi = guruhlar[guruhlar.length - 1]
    if (oxirgi && oxirgi.sana === n.sana) oxirgi.royxat.push(n)
    else guruhlar.push({ sana: n.sana, royxat: [n] })
  }

  const NavbatQator = ({ n }: { n: Navbat }) => {
    const h = HOLAT[n.holat] ?? HOLAT.kutilmoqda
    const bemor = bemorNomlari[n.patient_id]
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px dashed var(--line)', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '14px', color: 'var(--accent)', minWidth: '48px' }}>{n.vaqt}</span>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{bemor?.name ?? 'Bemor'}</div>
          <div style={{ fontSize: '11.5px', color: 'var(--muted)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {bemor?.telefon && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Phone size={12} strokeWidth={2} /> {bemor.telefon}</span>}
            {n.izoh && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={12} strokeWidth={2} /> {n.izoh}</span>}
          </div>
        </div>
        <span style={{ color: h.color, fontSize: '11.5px', fontWeight: 800, background: `color-mix(in srgb, ${h.color} 15%, transparent)`, borderRadius: '999px', padding: '3px 10px', whiteSpace: 'nowrap' }}>{h.text}</span>
        {n.holat === 'kutilmoqda' && (
          <button onClick={() => holatOzgartir(n, 'tasdiqlandi')} className="btn-animated" style={{
            background: 'var(--good)', color: 'white', border: 'none', borderRadius: '999px',
            padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
          }}>✓ Tasdiqlash</button>
        )}
        {n.holat === 'tasdiqlandi' && (
          <button onClick={() => holatOzgartir(n, 'yakunlandi')} className="btn-animated" style={{
            background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '999px',
            padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
          }}>Yakunlandi</button>
        )}
        {(n.holat === 'kutilmoqda' || n.holat === 'tasdiqlandi') && (
          <button onClick={() => holatOzgartir(n, 'bekor')} style={{
            background: 'none', border: '1px solid var(--line)', borderRadius: '999px',
            padding: '6px 12px', cursor: 'pointer', fontSize: '11.5px', color: 'var(--danger)',
          }}>Bekor</button>
        )}
      </div>
    )
  }

  return (
    <AppShell title="Navbatlar">
      <div className="fade-in mx-auto max-w-[720px] px-4 py-6 sm:px-8">
        <h1 style={{ fontSize: '24px', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '9px' }}><CalendarClock size={24} strokeWidth={2} /> Navbatlar</h1>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '18px' }}>
          Bemorlar katalog orqali qabulingizga onlayn yoziladi. Ish jadvalingizni belgilang.
        </p>

        {/* Ish jadvali */}
        <div style={card}>
          <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Ish jadvalim</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {HAFTA_KUNLARI.map((nom, i) => {
              const kod = i + 1
              const faol = kunlar.includes(kod)
              return (
                <button key={kod} onClick={() => setKunlar((k) => faol ? k.filter((x) => x !== kod) : [...k, kod].sort())} style={{
                  border: 'none', borderRadius: '999px', padding: '7px 13px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600,
                  background: faol ? 'var(--accent)' : 'var(--surface-2)', color: faol ? 'white' : 'var(--ink-soft)',
                }}>{nom.slice(0, 3)}</button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'end', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '11.5px', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Boshlanishi</label>
              <input type="time" style={input} value={boshlanish} onChange={(e) => setBoshlanish(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Tugashi</label>
              <input type="time" style={input} value={tugash} onChange={(e) => setTugash(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '11.5px', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Bir qabul (daqiqa)</label>
              <select style={{ ...input, cursor: 'pointer' }} value={slotDaqiqa} onChange={(e) => setSlotDaqiqa(parseInt(e.target.value, 10))}>
                {[15, 20, 30, 45, 60].map((d) => <option key={d} value={d}>{d} daqiqa</option>)}
              </select>
            </div>
            <button onClick={jadvalSaqla} disabled={jadvalSaving} className="btn-animated soft-press" style={{
              background: jadvalSaqlandi ? 'var(--good)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '999px',
              padding: '9px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
            }}>
              {jadvalSaving ? 'Saqlanmoqda...' : jadvalSaqlandi ? '✓ Saqlandi' : 'Saqlash'}
            </button>
          </div>
          {!profilBor && (
            <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'var(--warn)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <AlertTriangle size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>Katalog profilingiz hali yo&apos;q — jadvalni saqlasangiz profil yaratiladi, lekin bemorlarga ko&apos;rinishi uchun{' '}
              <a href="/doctor/ochiq-profil" style={{ color: 'var(--accent)' }}>Katalogdagi profilim</a> sahifasida to&apos;ldirib, yoqib qo&apos;ying.</span>
            </p>
          )}
        </div>

        {/* Kelgusi navbatlar */}
        {loading ? <UrosferaLoaderMini /> : (
          <>
            {guruhlar.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '36px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', color: 'var(--muted)' }}><CalendarClock size={36} strokeWidth={1.5} /></div>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13.5px' }}>Kelgusi navbatlar yo&apos;q.</p>
              </div>
            ) : guruhlar.map((g) => (
              <div key={g.sana} style={card}>
                <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={15} strokeWidth={2} /> {g.sana}{g.sana === bugun ? ' — bugun' : ''}
                  <span style={{
                    minWidth: '22px', height: '22px', borderRadius: '999px', background: 'var(--ink)', color: 'var(--bg)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, padding: '0 6px',
                  }}>{g.royxat.length}</span>
                </p>
                {g.royxat.map((n) => <NavbatQator key={n.id} n={n} />)}
              </div>
            ))}

            {otganlar.length > 0 && (
              <>
                <button onClick={() => setOtganlarKorsat((v) => !v)} className="btn-animated" style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  <Archive size={15} strokeWidth={2} /> O&apos;tgan / bekor qilingan ({otganlar.length}) {otganlarKorsat ? <ChevronUp size={14} strokeWidth={2.4} /> : <ChevronDown size={14} strokeWidth={2.4} />}
                </button>
                {otganlarKorsat && (
                  <div style={{ ...card, marginTop: '10px' }}>
                    {otganlar.map((n) => (
                      <div key={n.id} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: '1px dashed var(--line)', fontSize: '13px', color: 'var(--muted)' }}>
                        <span style={{ fontFamily: 'monospace' }}>{n.sana} {n.vaqt}</span>
                        <span style={{ flex: 1 }}>{bemorNomlari[n.patient_id]?.name ?? 'Bemor'}</span>
                        <span style={{ color: (HOLAT[n.holat] ?? HOLAT.kutilmoqda).color, fontWeight: 600 }}>{(HOLAT[n.holat] ?? HOLAT.kutilmoqda).text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
