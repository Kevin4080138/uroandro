'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Profil = {
  doctor_id: string
  full_name: string
  mutaxassislik: string | null
  telefon: string | null
  tajriba_yil: number | null
  ochiq: boolean
}
type Baho = {
  id: string
  doctor_id: string
  muomala: number
  samara: number
  tushuntirish: number
  kutish: number
  izoh: string | null
  created_at: string
}

export default function AdminKatalogPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profillar, setProfillar] = useState<Profil[]>([])
  const [baholar, setBaholar] = useState<Baho[]>([])
  const [ishlov, setIshlov] = useState<string | null>(null)

  const load = async () => {
    const [{ data: p }, { data: b }] = await Promise.all([
      supabase.from('shifokor_profillari').select('doctor_id, full_name, mutaxassislik, telefon, tajriba_yil, ochiq').order('full_name'),
      supabase.from('baholar').select('*').order('created_at', { ascending: false }),
    ])
    setProfillar((p as Profil[]) ?? [])
    setBaholar((b as Baho[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (!data.user) router.push('/auth/login') })
    load()
  }, [])

  const nomMap: Record<string, string> = {}
  for (const p of profillar) nomMap[p.doctor_id] = p.full_name

  const ochiqToggle = async (p: Profil) => {
    setIshlov(p.doctor_id)
    const { error } = await supabase.from('shifokor_profillari').update({ ochiq: !p.ochiq }).eq('doctor_id', p.doctor_id)
    setIshlov(null)
    if (error) { alert('Xatolik: ' + error.message); return }
    setProfillar((prev) => prev.map((x) => x.doctor_id === p.doctor_id ? { ...x, ochiq: !x.ochiq } : x))
  }

  const bahoOchir = async (b: Baho) => {
    if (!confirm("Bu bahoni o'chirasizmi? (Reyting qayta hisoblanadi)")) return
    const { error } = await supabase.from('baholar').delete().eq('id', b.id)
    if (error) { alert('Xatolik: ' + error.message); return }
    setBaholar((prev) => prev.filter((x) => x.id !== b.id))
  }

  const ochiqSoni = profillar.filter((p) => p.ochiq).length
  const izohliBaholar = baholar.filter((b) => b.izoh && b.izoh.trim())

  const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
      <div className="mx-auto max-w-[900px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700 }}>🌐 Katalog nazorati</h2>
        <p className="rise" style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '13px', animationDelay: '.05s' }}>
          Shifokor profillarini katalogda ko&apos;rsatish/yashirish va bemor izohlarini moderatsiya qilish.
        </p>

        {loading ? <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p> : (
          <>
            {/* Shifokor profillari */}
            <div style={{ ...card, marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Shifokor profillari</h3>
                <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{ochiqSoni}/{profillar.length} ochiq</span>
              </div>
              {profillar.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha profil yo&apos;q.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {profillar.map((p) => (
                    <div key={p.doctor_id} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--line)' }}>
                      <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {p.full_name.trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.full_name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {p.mutaxassislik && <span>{p.mutaxassislik}</span>}
                          {p.telefon && <span>📞 {p.telefon}</span>}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: p.ochiq ? 'var(--good)' : 'var(--muted)', background: p.ochiq ? 'color-mix(in srgb, var(--good) 14%, transparent)' : 'var(--surface-2)', borderRadius: 6, padding: '2px 8px', whiteSpace: 'nowrap' }}>
                        {p.ochiq ? 'Ochiq' : 'Yashirin'}
                      </span>
                      <button onClick={() => ochiqToggle(p)} disabled={ishlov === p.doctor_id} className="soft-press" style={{
                        background: p.ochiq ? 'color-mix(in srgb, var(--warn) 12%, transparent)' : 'var(--accent)',
                        border: p.ochiq ? '1px solid color-mix(in srgb, var(--warn) 30%, transparent)' : 'none',
                        color: p.ochiq ? 'var(--warn)' : '#fff', borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 600,
                        cursor: ishlov === p.doctor_id ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                      }}>
                        {p.ochiq ? 'Yashirish' : "Ko'rsatish"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bemor izohlari */}
            <div style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Bemor izohlari</h3>
                <span style={{ fontSize: '12.5px', color: 'var(--muted)' }}>{izohliBaholar.length} ta izoh · {baholar.length} baho</span>
              </div>
              {izohliBaholar.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Izohli baho yo&apos;q.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {izohliBaholar.map((b) => {
                    const ort = (b.muomala + b.samara + b.tushuntirish + b.kutish) / 4
                    return (
                      <div key={b.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: '1px solid var(--line)' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 600 }}>{nomMap[b.doctor_id] ?? 'Shifokor'}</span>
                            <span style={{ fontSize: '12px', color: 'var(--warn)', fontWeight: 700 }}>★ {ort.toFixed(1)}</span>
                            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{new Date(b.created_at).toLocaleDateString('uz-UZ')}</span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{b.izoh}</p>
                        </div>
                        <button onClick={() => bahoOchir(b)} className="soft-press" style={{ background: 'color-mix(in srgb, var(--danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)', color: 'var(--danger)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>O&apos;chirish</button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
