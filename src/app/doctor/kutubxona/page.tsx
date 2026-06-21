'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px' }

type Fayl = { id: string; nom: string; izoh: string | null; file_path: string; created_at: string; doctor_id: string }

export default function KutubxonaPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileInput = useRef<HTMLInputElement>(null)

  const [fayllar, setFayllar] = useState<Fayl[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [nom, setNom] = useState('')
  const [izoh, setIzoh] = useState('')
  const [tanlanganFayl, setTanlanganFayl] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase.from('kutubxona_fayllar').select('*').order('created_at', { ascending: false })
    setFayllar((data as Fayl[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  const yukla = async () => {
    if (!tanlanganFayl || !nom.trim()) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    setSaving(true)
    const yol = `${user.id}/${Date.now()}_${tanlanganFayl.name}`
    const { error: uploadError } = await supabase.storage.from('kutubxona').upload(yol, tanlanganFayl)

    if (!uploadError) {
      await supabase.from('kutubxona_fayllar').insert({ doctor_id: user.id, nom, izoh: izoh || null, file_path: yol })
      setNom(''); setIzoh(''); setTanlanganFayl(null); setShowForm(false)
      if (fileInput.current) fileInput.current.value = ''
      load()
    }
    setSaving(false)
  }

  const ochish = (yol: string) => {
    const { data } = supabase.storage.from('kutubxona').getPublicUrl(yol)
    window.open(data.publicUrl, '_blank')
  }

  const ochirish = async (f: Fayl) => {
    if (!confirm("Bu faylni o'chirishni tasdiqlaysizmi?")) return
    await supabase.storage.from('kutubxona').remove([f.file_path])
    await supabase.from('kutubxona_fayllar').delete().eq('id', f.id)
    load()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header />

      <div className="fade-in px-8 py-8" style={{ maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Kutubxona</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>PDF materiallar — hamma shifokorlar uchun umumiy.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{
            background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {showForm ? 'Bekor qilish' : '+ Fayl yuklash'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Nomi</label>
              <input style={inputStyle} value={nom} onChange={(e) => setNom(e.target.value)} placeholder="masalan, EAU Varikotsele bo'limi 2025" />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Izoh (ixtiyoriy)</label>
              <input style={inputStyle} value={izoh} onChange={(e) => setIzoh(e.target.value)} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>PDF fayl</label>
              <input ref={fileInput} type="file" accept="application/pdf" onChange={(e) => setTanlanganFayl(e.target.files?.[0] ?? null)} style={{ color: 'var(--muted)', fontSize: '14px' }} />
            </div>
            <button onClick={yukla} disabled={saving || !nom.trim() || !tanlanganFayl} style={{
              background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
              padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
              opacity: saving || !nom.trim() || !tanlanganFayl ? 0.7 : 1,
            }}>
              {saving ? 'Yuklanmoqda...' : 'Yuklash'}
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : fayllar.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Hozircha materiallar yo&apos;q.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {fayllar.map((f) => (
              <div key={f.id} className="card-hover" style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
              }}>
                <div onClick={() => ochish(f.file_path)} style={{ cursor: 'pointer', flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--accent)' }}>📄 {f.nom}</h4>
                  {f.izoh && <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>{f.izoh}</p>}
                  <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--muted)' }}>{new Date(f.created_at).toLocaleDateString()}</p>
                </div>
                {f.doctor_id === userId && (
                  <button onClick={() => ochirish(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '16px' }}>🗑️</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
