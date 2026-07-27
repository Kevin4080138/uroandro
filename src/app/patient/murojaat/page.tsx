'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { shikoyatToifalari } from '@/lib/shikoyatlar'
import { BEMOR_TASHXIS, SHOSHILINCH_SHIKOYATLAR } from '@/lib/bemorTashxis'
import { CheckCircle2, AlertTriangle, Zap, Stethoscope } from 'lucide-react'

const card = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px',
} as React.CSSProperties

const chip = (active: boolean): React.CSSProperties => ({
  border: active ? '2px solid var(--accent)' : '1.5px solid var(--line)', borderRadius: '22px',
  padding: '11px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
  background: active ? 'var(--accent)' : 'var(--surface-2)', color: active ? 'white' : 'var(--ink)',
})

type Doctor = { id: string; full_name: string }

// Bemorga tushunarli belgi — toifa nomiga qo'shib ko'rsatiladi
const TOIFA_BELGI: Record<string, string> = {
  'Siyish': '💧',
  'Buyrak': '🫘',
  'Qovuq': '🚽',
  'Prostata bezi': '🔵',
  'Jinsiy aloqa': '❤️',
  'Moshonka / Tuxumdon': '⚪',
  'Bepushtlik / reproduktiv': '👶',
}

export default function MurojaatYuborishPage() {
  const router = useRouter()
  const supabase = createClient()

  const [bosqich, setBosqich] = useState<1 | 2 | 3 | 4>(1)
  const [organlar, setOrganlar] = useState<string[]>([])
  const [shikoyatlar, setShikoyatlar] = useState<string[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [tanlanganShifokor, setTanlanganShifokor] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [yuborildi, setYuborildi] = useState(false)

  useEffect(() => {
    supabase.from('profiles').select('id, full_name').eq('role', 'doctor').eq('faol', true).then(({ data }) => {
      setDoctors((data as Doctor[]) ?? [])
    })
  }, [])

  const toggleOrgan = (nom: string) => setOrganlar((p) => (p.includes(nom) ? p.filter((o) => o !== nom) : [...p, nom]))
  const toggleShikoyat = (s: string) => setShikoyatlar((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))

  const tashxislar = organlar.map((o) => BEMOR_TASHXIS[o]).filter(Boolean)
  const shoshilinch = shikoyatlar.some((s) => SHOSHILINCH_SHIKOYATLAR.includes(s))

  const yuborish = async (targetDoctorId: string | null) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    setSaving(true)
    const { data: yangiMurojaat } = await supabase.from('murojaatlar').insert({
      patient_id: user.id,
      target_doctor_id: targetDoctorId,
      organlar: organlar.join(', '),
      shikoyatlar: shikoyatlar.join(', '),
      taxminiy_tashxis: tashxislar.map((t) => t.nom).join('; '),
      sabablar: tashxislar.flatMap((t) => t.sabablar).join(', '),
      tavsiya: tashxislar.flatMap((t) => t.tavsiya).join(', '),
      shoshilinch,
    }).select('id').single()

    if (yangiMurojaat) {
      fetch('/api/push/yangi-murojaat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ murojaatId: yangiMurojaat.id }),
      }).catch(() => {})
    }

    setSaving(false)
    setYuborildi(true)
  }

  if (yuborildi) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="fade-in mx-auto max-w-[560px] px-8 py-16 text-center">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--good)' }}><CheckCircle2 size={56} strokeWidth={1.5} /></div>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Murojaatingiz yuborildi</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          Shifokor tez orada ko&apos;rib chiqadi va javob beradi. Javobni &quot;Mening murojaatlarim&quot; bo&apos;limida ko&apos;rishingiz mumkin.
        </p>
        <button onClick={() => router.push('/patient/murojaatlarim')} className="btn-animated" style={{
          marginTop: '20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
          padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
        }}>
          Mening murojaatlarim
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />

      <div className="fade-in mx-auto max-w-[640px] px-8 py-8">
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} style={{ flex: 1, height: '4px', borderRadius: '2px', background: n <= bosqich ? 'var(--accent)' : 'var(--surface-2)' }} />
          ))}
        </div>

        {bosqich === 1 && (
          <div style={card}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Qayeringiz bezovta qilyapti?</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '18px' }}>Bir yoki bir nechtasini bosing.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
              {shikoyatToifalari.map((t) => {
                const faol = organlar.includes(t.nom)
                return (
                  <button key={t.nom} onClick={() => toggleOrgan(t.nom)} className="soft-press" style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    padding: '16px 10px', borderRadius: '14px', cursor: 'pointer',
                    border: faol ? '2px solid var(--accent)' : '1.5px solid var(--line)',
                    background: faol ? 'var(--accent-soft)' : 'var(--surface-2)',
                    color: faol ? 'var(--accent)' : 'var(--ink)',
                    fontSize: '14px', fontWeight: 600, textAlign: 'center', lineHeight: 1.3,
                  }}>
                    <span style={{ fontSize: '28px' }}>{TOIFA_BELGI[t.nom] ?? '🩺'}</span>
                    {t.nom}
                  </button>
                )
              })}
            </div>
            <button disabled={organlar.length === 0} onClick={() => setBosqich(2)} className="btn-animated" style={{
              marginTop: '24px', width: '100%', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
              padding: '15px 24px', cursor: 'pointer', fontSize: '15px', fontWeight: 700, opacity: organlar.length === 0 ? 0.5 : 1,
            }}>
              Davom etish →
            </button>
          </div>
        )}

        {bosqich === 2 && (
          <div style={card}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Qanday shikoyatlaringiz bor?</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '18px' }}>Mosini bosib belgilang.</p>
            {shikoyatToifalari.filter((t) => organlar.includes(t.nom)).map((t) => (
              <div key={t.nom} style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12.5px', color: 'var(--muted)', margin: '0 0 8px 0' }}>{t.nom}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {t.shikoyatlar.map((s) => (
                    <button key={s} style={chip(shikoyatlar.includes(s))} onClick={() => toggleShikoyat(s)}>{s}</button>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button onClick={() => setBosqich(1)} className="btn-animated" style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              }}>
                ← Orqaga
              </button>
              <button disabled={shikoyatlar.length === 0} onClick={() => setBosqich(3)} className="btn-animated" style={{
                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, opacity: shikoyatlar.length === 0 ? 0.5 : 1,
              }}>
                Tahlil qilish →
              </button>
            </div>
          </div>
        )}

        {bosqich === 3 && (
          <div style={card}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Taxminiy yo&apos;nalish</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '18px' }}>
              Bu shifokor tashxisi emas — faqat dastlabki yo&apos;naltiruvchi ma&apos;lumot.
            </p>

            {shoshilinch && (
              <div style={{ background: 'rgba(220,38,38,.12)', border: '1px solid var(--danger)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '13.5px', color: 'var(--danger)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <AlertTriangle size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} /> <span>Belgilagan shikoyatlaringiz orasida shoshilinch e&apos;tibor talab qiladigan belgilar bor. Iloji boricha tezroq shifokorga murojaat qiling.</span>
              </div>
            )}

            {tashxislar.map((t, i) => (
              <div key={i} style={{ background: 'var(--surface-2)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--accent)' }}>{t.nom}</h3>
                <p style={{ margin: '0 0 4px 0', fontSize: '12.5px', color: 'var(--muted)', fontWeight: 600 }}>Mumkin bo&apos;lgan sabablar:</p>
                <p style={{ margin: '0 0 10px 0', fontSize: '13.5px' }}>{t.sabablar.join(', ')}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: '12.5px', color: 'var(--muted)', fontWeight: 600 }}>Tavsiya:</p>
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                  {t.tavsiya.map((tv, j) => <li key={j} style={{ fontSize: '13.5px' }}>{tv}</li>)}
                </ul>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button onClick={() => setBosqich(2)} className="btn-animated" style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px',
              }}>
                ← Orqaga
              </button>
              <button onClick={() => setBosqich(4)} className="btn-animated" style={{
                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
              }}>
                Shifokorga yuborish →
              </button>
            </div>
          </div>
        )}

        {bosqich === 4 && (
          <div style={card}>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>Qanday yuboramiz?</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '18px' }}>
              Shifokor tanlamasangiz, murojaatingiz mos shifokorlar navbatiga tushadi — birinchi bo&apos;sh shifokor qabul qiladi.
            </p>

            <button onClick={() => yuborish(null)} disabled={saving} className="btn-animated" style={{
              width: '100%', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
              padding: '14px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, marginBottom: '20px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <Zap size={17} strokeWidth={2} /> Menga mos shifokor toping
            </button>

            <p style={{ fontSize: '12.5px', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Yoki o&apos;zim tanlayman</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {doctors.map((d) => (
                <button key={d.id} onClick={() => setTanlanganShifokor(d.id)} style={{
                  textAlign: 'left', border: tanlanganShifokor === d.id ? '1.5px solid var(--accent)' : '1px solid var(--line)',
                  background: tanlanganShifokor === d.id ? 'var(--accent-soft)' : 'var(--surface-2)',
                  borderRadius: '10px', padding: '12px 16px', cursor: 'pointer', fontSize: '14px', color: 'var(--ink)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <Stethoscope size={16} strokeWidth={2} style={{ flexShrink: 0 }} /> {d.full_name}
                </button>
              ))}
              {doctors.length === 0 && <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha shifokorlar ro&apos;yxati bo&apos;sh.</p>}
            </div>
            <button onClick={() => tanlanganShifokor && yuborish(tanlanganShifokor)} disabled={!tanlanganShifokor || saving} className="btn-animated" style={{
              width: '100%', background: 'var(--good)', color: 'white', border: 'none', borderRadius: '10px',
              padding: '14px', cursor: 'pointer', fontSize: '15px', fontWeight: 600, opacity: !tanlanganShifokor ? 0.5 : 1,
            }}>
              {saving ? 'Yuborilmoqda...' : 'Tanlangan shifokorga yuborish'}
            </button>

            <button onClick={() => setBosqich(3)} className="btn-animated" style={{
              marginTop: '14px', background: 'none', color: 'var(--muted)', border: 'none',
              cursor: 'pointer', fontSize: '13.5px',
            }}>
              ← Orqaga
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
