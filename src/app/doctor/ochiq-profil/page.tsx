'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'
import { Globe, Briefcase, Star, Wallet, Eye, EyeOff, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Xizmat = { nom: string; narx: string }
type Mezon = { nom: string; qiymat: number; rang: string }

const REYTING_MEZON: { kalit: 'muomala' | 'samara' | 'tushuntirish' | 'kutish'; nom: string; rang: string }[] = [
  { kalit: 'muomala', nom: 'Muomala', rang: '#3b82f6' },
  { kalit: 'samara', nom: 'Samaradorlik', rang: '#10b981' },
  { kalit: 'tushuntirish', nom: 'Tushuntirish', rang: '#8b5cf6' },
  { kalit: 'kutish', nom: 'Kutish vaqti', rang: '#f59e0b' },
]
type Klinika = { id: string; nom: string; manzil: string | null }

const input = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1.5px solid var(--line)',
  borderRadius: '9px', padding: '9px 11px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' as const,
}
const lbl = { color: 'var(--ink-soft)', fontSize: '12px', fontWeight: 600 as const, display: 'block', marginBottom: '5px' }
const card = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px', marginBottom: '14px',
} as React.CSSProperties

export default function OchiqProfilPage() {
  const router = useRouter()
  const supabase = createClient()

  const [myId, setMyId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saqlandi, setSaqlandi] = useState(false)

  const [fullName, setFullName] = useState('')
  const [mutaxassislik, setMutaxassislik] = useState('')
  const [ilmiyDaraja, setIlmiyDaraja] = useState('')
  const [tajribaYil, setTajribaYil] = useState('')
  const [bio, setBio] = useState('')
  const [qabulNarxi, setQabulNarxi] = useState('')
  const [ishVaqti, setIshVaqti] = useState('')
  const [telefon, setTelefon] = useState('')
  const [ochiq, setOchiq] = useState(false)
  const [xizmatlar, setXizmatlar] = useState<Xizmat[]>([])

  const [klinikalar, setKlinikalar] = useState<Klinika[]>([])
  const [klinikaId, setKlinikaId] = useState<string>('')
  const [yangiKlinika, setYangiKlinika] = useState(false)
  const [klinikaNom, setKlinikaNom] = useState('')
  const [klinikaManzil, setKlinikaManzil] = useState('')

  const [baho, setBaho] = useState<{ ortacha: number; soni: number } | null>(null)
  const [mezonlar, setMezonlar] = useState<Mezon[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setMyId(user.id)

      const [{ data: prof }, { data: mavjud }, { data: kl }, { data: bah }] = await Promise.all([
        supabase.from('profiles').select('full_name, telefon').eq('id', user.id).single(),
        supabase.from('shifokor_profillari').select('*').eq('doctor_id', user.id).maybeSingle(),
        supabase.from('klinikalar').select('id, nom, manzil').order('nom'),
        supabase.from('baholar').select('muomala, samara, tushuntirish, kutish').eq('doctor_id', user.id),
      ])

      setKlinikalar((kl as Klinika[]) ?? [])
      if (bah && bah.length > 0) {
        const jami = bah.reduce((s, b) => s + (b.muomala + b.samara + b.tushuntirish + b.kutish) / 4, 0)
        setBaho({ ortacha: jami / bah.length, soni: bah.length })
        setMezonlar(REYTING_MEZON.map((mz) => ({
          nom: mz.nom, rang: mz.rang,
          qiymat: bah.reduce((s, b: Record<string, number>) => s + (b[mz.kalit] ?? 0), 0) / bah.length,
        })))
      }

      if (mavjud) {
        setFullName(mavjud.full_name ?? '')
        setMutaxassislik(mavjud.mutaxassislik ?? '')
        setIlmiyDaraja(mavjud.ilmiy_daraja ?? '')
        setTajribaYil(mavjud.tajriba_yil != null ? String(mavjud.tajriba_yil) : '')
        setBio(mavjud.bio ?? '')
        setQabulNarxi(mavjud.qabul_narxi ?? '')
        setIshVaqti(mavjud.ish_vaqti ?? '')
        setTelefon(mavjud.telefon ?? '')
        setOchiq(!!mavjud.ochiq)
        setXizmatlar(Array.isArray(mavjud.xizmatlar) ? mavjud.xizmatlar : [])
        setKlinikaId(mavjud.klinika_id ?? '')
      } else {
        setFullName(prof?.full_name ?? '')
        setTelefon(prof?.telefon ?? '')
      }
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saqla = async () => {
    if (!myId) return
    setSaving(true)

    let klId: string | null = klinikaId || null
    if (yangiKlinika && klinikaNom.trim()) {
      const { data: yk } = await supabase.from('klinikalar')
        .insert({ nom: klinikaNom.trim(), manzil: klinikaManzil.trim() || null, created_by: myId })
        .select('id').single()
      if (yk) {
        klId = yk.id
        setKlinikaId(yk.id)
        setYangiKlinika(false)
        const { data: kl } = await supabase.from('klinikalar').select('id, nom, manzil').order('nom')
        setKlinikalar((kl as Klinika[]) ?? [])
      }
    }

    await supabase.from('shifokor_profillari').upsert({
      doctor_id: myId,
      full_name: fullName.trim(),
      klinika_id: klId,
      mutaxassislik: mutaxassislik.trim() || null,
      ilmiy_daraja: ilmiyDaraja.trim() || null,
      tajriba_yil: tajribaYil ? parseInt(tajribaYil, 10) : null,
      bio: bio.trim() || null,
      xizmatlar: xizmatlar.filter((x) => x.nom.trim()),
      qabul_narxi: qabulNarxi.trim() || null,
      ish_vaqti: ishVaqti.trim() || null,
      telefon: telefon.trim() || null,
      ochiq,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    setSaqlandi(true)
    setTimeout(() => setSaqlandi(false), 2000)
  }

  if (loading) return (
    <AppShell title="Katalogdagi profilim"><div className="px-8 py-8"><p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p></div></AppShell>
  )

  return (
    <AppShell title="Katalogdagi profilim">
      <div className="fade-in mx-auto max-w-[720px] px-4 py-6 sm:px-8">
        <h1 style={{ fontSize: '24px', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '9px' }}><Globe size={24} strokeWidth={2} /> Katalogdagi profilim</h1>
        <p style={{ color: 'var(--muted)', fontSize: '13.5px', marginBottom: '18px' }}>
          Bu ma&apos;lumotlar <strong>/shifokorlar</strong> katalogida bemorlar uchun ochiq ko&apos;rinadi.
          Profil faqat &quot;Katalogda ko&apos;rsatish&quot; yoqilganda chiqadi.
        </p>

        {/* Profil hero — ko'rgazma karta (Lordbank referens) */}
        {(() => {
          const chip = { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '999px', padding: '5px 11px', color: 'var(--ink-soft)' } as React.CSSProperties
          const bosh = (fullName || 'Sh').trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase()
          return (
            <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span className="avatar" style={{ width: 60, height: 60, fontSize: 22, flexShrink: 0 }}>{bosh}</span>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>{fullName || 'Ismingiz'}</div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
                  {[mutaxassislik, ilmiyDaraja].filter(Boolean).join(' · ') || 'Mutaxassislik ko\'rsatilmagan'}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '11px' }}>
                  {tajribaYil && <span style={chip}><Briefcase size={13} strokeWidth={2} /> {tajribaYil} yil tajriba</span>}
                  <span style={{ ...chip, color: baho ? '#d97706' : 'var(--muted)' }}>
                    <Star size={13} strokeWidth={2} fill={baho ? 'currentColor' : 'none'} /> {baho ? `${baho.ortacha.toFixed(1)} (${baho.soni})` : 'Baho yo\'q'}
                  </span>
                  {qabulNarxi && <span style={chip}><Wallet size={13} strokeWidth={2} /> {qabulNarxi}</span>}
                  <span style={{ ...chip, color: ochiq ? 'var(--good)' : 'var(--muted)' }}>
                    {ochiq ? <Eye size={13} strokeWidth={2} /> : <EyeOff size={13} strokeWidth={2} />} {ochiq ? 'Katalogda ko\'rinadi' : 'Yashirin'}
                  </span>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Reyting statistikasi (Lordbank referens) — gauge + mezonlar */}
        {baho && mezonlar.length > 0 && (
          <div style={{ ...card, display: 'grid', gap: '18px', gridTemplateColumns: '1fr' }} className="prof-reyting">
            <style>{`@media (min-width: 640px) { .prof-reyting { grid-template-columns: 190px 1fr; align-items: center; } }`}</style>
            <div style={{ position: 'relative', width: '100%', height: 140 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ v: Math.max(baho.ortacha / 5 * 100, 0.01) }, { v: Math.max(100 - baho.ortacha / 5 * 100, 0.01) }]}
                    cx="50%" cy="82%" startAngle={180} endAngle={0} innerRadius={58} outerRadius={82} dataKey="v" stroke="none">
                    <Cell fill="#f59e0b" />
                    <Cell fill="rgba(130,130,130,.2)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: '#d97706' }}>{baho.ortacha.toFixed(1)}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>5 dan · {baho.soni} baho</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
              {mezonlar.map((d) => (
                <div key={d.nom}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--ink-soft)' }}>{d.nom}</span>
                    <span style={{ fontWeight: 700, color: d.rang, fontVariantNumeric: 'tabular-nums' }}>{d.qiymat.toFixed(1)}</span>
                  </div>
                  <div style={{ background: 'var(--surface-2)', borderRadius: '6px', height: '9px', overflow: 'hidden' }}>
                    <div style={{ width: `${(d.qiymat / 5) * 100}%`, height: '100%', background: d.rang, borderRadius: '6px', transition: 'width .4s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Asosiy ma'lumotlar */}
        <div style={card}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: '2 1 220px' }}>
              <label style={lbl}>F.I.O (katalogda ko&apos;rinadi)</label>
              <input style={input} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label style={lbl}>Mutaxassislik</label>
              <input style={input} value={mutaxassislik} onChange={(e) => setMutaxassislik(e.target.value)} placeholder="Urolog-androlog" />
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label style={lbl}>Ilmiy daraja / toifa</label>
              <input style={input} value={ilmiyDaraja} onChange={(e) => setIlmiyDaraja(e.target.value)} placeholder="Oliy toifa, PhD..." />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <label style={lbl}>Tajriba (yil)</label>
              <input type="number" style={input} value={tajribaYil} onChange={(e) => setTajribaYil(e.target.value)} placeholder="10" />
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label style={lbl}>Aloqa telefoni (ochiq)</label>
              <input style={input} value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+998 90 123 45 67" />
            </div>
            <div style={{ flex: '1 1 100%' }}>
              <label style={lbl}>Qisqacha o&apos;zingiz haqingizda</label>
              <textarea style={{ ...input, minHeight: '64px' }} value={bio} onChange={(e) => setBio(e.target.value)}
                placeholder="Ta'lim, tajriba, yo'nalishlar..." />
            </div>
          </div>
        </div>

        {/* Klinika */}
        <div style={card}>
          <label style={lbl}>Ish joyi (klinika)</label>
          {!yangiKlinika ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <select style={{ ...input, cursor: 'pointer' }} value={klinikaId} onChange={(e) => setKlinikaId(e.target.value)}>
                <option value="">— Tanlanmagan —</option>
                {klinikalar.map((k) => <option key={k.id} value={k.id}>{k.nom}{k.manzil ? ` — ${k.manzil}` : ''}</option>)}
              </select>
              <button onClick={() => setYangiKlinika(true)} className="btn-animated" style={{
                background: 'var(--surface-2)', color: 'var(--accent)', border: '1px dashed var(--accent)',
                borderRadius: '9px', padding: '0 14px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, whiteSpace: 'nowrap',
              }}>+ Yangi</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <input style={{ ...input, flex: '1 1 180px' }} value={klinikaNom} onChange={(e) => setKlinikaNom(e.target.value)} placeholder="Klinika nomi" />
              <input style={{ ...input, flex: '1 1 180px' }} value={klinikaManzil} onChange={(e) => setKlinikaManzil(e.target.value)} placeholder="Manzil" />
              <button onClick={() => setYangiKlinika(false)} className="btn-animated" style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                borderRadius: '9px', padding: '0 14px', cursor: 'pointer', fontSize: '12.5px',
              }}>Bekor</button>
            </div>
          )}
          <div style={{ marginTop: '12px' }}>
            <label style={lbl}>Ish vaqti</label>
            <input style={input} value={ishVaqti} onChange={(e) => setIshVaqti(e.target.value)} placeholder="Du–Sha 9:00–17:00" />
          </div>
        </div>

        {/* Xizmatlar va narxlar */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ ...lbl, marginBottom: 0 }}>Xizmatlar va narxlar</label>
            <button onClick={() => setXizmatlar((x) => [...x, { nom: '', narx: '' }])} className="btn-animated" style={{
              background: 'var(--surface-2)', color: 'var(--accent)', border: '1px dashed var(--accent)',
              borderRadius: '8px', padding: '5px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
            }}>+ Xizmat</button>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={lbl}>Qabul narxi</label>
            <input style={input} value={qabulNarxi} onChange={(e) => setQabulNarxi(e.target.value)} placeholder="100 000 so'm" />
          </div>
          {xizmatlar.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: '12.5px', margin: 0 }}>
              Masalan: Varikotsele operatsiyasi, USG, sistoskopiya...
            </p>
          )}
          {xizmatlar.map((x, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input style={{ ...input, flex: 2 }} value={x.nom} placeholder="Xizmat nomi"
                onChange={(e) => setXizmatlar((arr) => arr.map((v, j) => (j === i ? { ...v, nom: e.target.value } : v)))} />
              <input style={{ ...input, flex: 1 }} value={x.narx} placeholder="Narxi"
                onChange={(e) => setXizmatlar((arr) => arr.map((v, j) => (j === i ? { ...v, narx: e.target.value } : v)))} />
              <button onClick={() => setXizmatlar((arr) => arr.filter((_, j) => j !== i))} style={{
                background: 'var(--surface-2)', color: 'var(--danger)', border: '1px solid var(--line)',
                borderRadius: '8px', padding: '0 10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
              }}><Trash2 size={15} strokeWidth={2} /></button>
            </div>
          ))}
        </div>

        {/* Ko'rsatish + saqlash */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
            <input type="checkbox" checked={ochiq} onChange={(e) => setOchiq(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }} />
            Katalogda ko&apos;rsatish
          </label>
          <button onClick={saqla} disabled={saving || !fullName.trim()} className="btn-animated soft-press" style={{
            background: saqlandi ? 'var(--good)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: '999px',
            padding: '11px 26px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, opacity: !fullName.trim() ? 0.5 : 1,
          }}>
            {saving ? 'Saqlanmoqda...' : saqlandi ? '✓ Saqlandi' : 'Saqlash'}
          </button>
        </div>
      </div>
    </AppShell>
  )
}
