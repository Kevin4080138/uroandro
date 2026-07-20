'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Banner = {
  id: string
  sarlavha: string
  tavsif: string | null
  image_url: string | null
  link_href: string | null
  type: string
  target_role: string | null
  rang: string
  faol: boolean
  sort_order: number
  created_at: string
}

const TYPE_OPTS = [
  { value: 'yangilik',      label: '📰 Yangilik',      color: '#2563eb' },
  { value: 'reklama',       label: '📣 Reklama',        color: '#7c3aed' },
  { value: 'elon',          label: "📢 E'lon",          color: '#ca8a04' },
  { value: 'bildirishnoma', label: '🔔 Bildirishnoma',  color: '#dc2626' },
]
const ROLE_OPTS = [
  { value: '',        label: '👥 Hammaga (tizim ichida)' },
  { value: 'student', label: '🎓 Talabalar' },
  { value: 'doctor',  label: '👨‍⚕️ Shifokorlar' },
  { value: 'patient', label: '🧑 Bemorlar' },
  // Kirish sahifasi ochiq — bu banner ro'yxatdan o'tmagan mehmonga ham ko'rinadi.
  // "Hammaga" bannerlari bu yerga tushmaydi (BannerCarousel faqatShuRol).
  { value: 'landing', label: '🌐 Kirish sahifasi (ochiq)' },
]
const RANG_OPTS = [
  '#2563eb', '#7c3aed', '#dc2626', '#16a34a', '#ca8a04', '#0891b2', '#db2777',
]

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px',
  padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}

export default function AdminBannerlarPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [userId, setUserId] = useState('')
  const [banners, setBanners] = useState<Banner[]>([])
  const [editId, setEditId] = useState<string | null>(null)

  // Form state
  const [sarlavha, setSarlavha] = useState('')
  const [tavsif, setTavsif] = useState('')
  const [linkHref, setLinkHref] = useState('')
  const [type, setType] = useState('yangilik')
  const [role, setRole] = useState('')
  const [rang, setRang] = useState('#2563eb')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [clearImage, setClearImage] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (p?.role !== 'admin') { router.push('/student/dashboard'); return }
      setUserId(user.id)
      loadBanners()
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadBanners = async () => {
    const { data } = await supabase
      .from('bannerlar')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    setBanners(data ?? [])
  }

  const resetForm = () => {
    setEditId(null); setSarlavha(''); setTavsif(''); setLinkHref('')
    setType('yangilik'); setRole(''); setRang('#2563eb')
    setImageFile(null); setImagePreview(null); setClearImage(false)
    setError(''); setSuccess('')
  }

  const startEdit = (b: Banner) => {
    setEditId(b.id); setSarlavha(b.sarlavha); setTavsif(b.tavsif ?? '')
    setLinkHref(b.link_href ?? ''); setType(b.type); setRole(b.target_role ?? '')
    setRang(b.rang ?? '#2563eb'); setImagePreview(b.image_url)
    setImageFile(null); setClearImage(false); setError(''); setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saqlash = async () => {
    setError(''); setSuccess('')
    if (!sarlavha.trim()) { setError('Sarlavha kiriting'); return }
    setLoading(true)

    let imageUrl: string | null = imagePreview
    if (clearImage) imageUrl = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `banner-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('bannerlar').upload(path, imageFile, { upsert: true })
      if (upErr) { setError('Rasm yuklanmadi: ' + upErr.message); setLoading(false); return }
      const { data: urlData } = supabase.storage.from('bannerlar').getPublicUrl(path)
      imageUrl = urlData.publicUrl
    }

    const payload = {
      sarlavha: sarlavha.trim(),
      tavsif: tavsif.trim() || null,
      image_url: imageUrl,
      link_href: linkHref.trim() || null,
      type,
      target_role: role || null,
      rang,
      created_by: userId,
    }

    if (editId) {
      const { error: dbErr } = await supabase.from('bannerlar').update(payload).eq('id', editId)
      if (dbErr) { setError(dbErr.message); setLoading(false); return }
    } else {
      const { error: dbErr } = await supabase.from('bannerlar').insert({ ...payload, faol: true, sort_order: banners.length })
      if (dbErr) { setError(dbErr.message); setLoading(false); return }
    }

    setSuccess(editId ? '✅ Yangilandi!' : '✅ Banner qo\'shildi!')
    resetForm()
    loadBanners()
    setLoading(false)
  }

  const toggleFaol = async (b: Banner) => {
    await supabase.from('bannerlar').update({ faol: !b.faol }).eq('id', b.id)
    setBanners(prev => prev.map(x => x.id === b.id ? { ...x, faol: !x.faol } : x))
  }

  const ochirish = async (id: string) => {
    if (!confirm('Bannerni o\'chirasizmi?')) return
    await supabase.from('bannerlar').delete().eq('id', id)
    setBanners(prev => prev.filter(x => x.id !== id))
    if (editId === id) resetForm()
  }

  const tartibOzgartir = async (id: string, dir: 'up' | 'down') => {
    const i = banners.findIndex(b => b.id === id)
    const j = dir === 'up' ? i - 1 : i + 1
    if (j < 0 || j >= banners.length) return
    const updated = [...banners]
    const [a, b2] = [updated[i], updated[j]]
    await Promise.all([
      supabase.from('bannerlar').update({ sort_order: b2.sort_order }).eq('id', a.id),
      supabase.from('bannerlar').update({ sort_order: a.sort_order }).eq('id', b2.id),
    ])
    updated[i] = { ...a, sort_order: b2.sort_order }
    updated[j] = { ...b2, sort_order: a.sort_order }
    setBanners(updated.sort((x, y) => x.sort_order - y.sort_order))
  }

  const typeInfo = TYPE_OPTS.find(t => t.value === type)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin panel" />

      <div className="mx-auto max-w-[680px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
          🎠 Bannerlar boshqaruvi
        </h2>

        {/* ── Forma ── */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
            {editId ? '✏️ Bannerni tahrirlash' : '➕ Yangi banner'}
          </h3>

          {/* Kimga */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>Kimga ko'rsatilsin</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ROLE_OPTS.map(r => (
                <button key={r.value} onClick={() => setRole(r.value)} style={{
                  padding: '7px 13px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid',
                  background: role === r.value ? 'var(--accent)' : 'var(--surface-2)',
                  color: role === r.value ? 'white' : 'var(--ink)',
                  borderColor: role === r.value ? 'var(--accent)' : 'var(--line)',
                }}>{r.label}</button>
              ))}
            </div>
          </div>

          {/* Tur */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>Banner turi</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TYPE_OPTS.map(t => (
                <button key={t.value} onClick={() => setType(t.value)} style={{
                  padding: '7px 13px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid',
                  background: type === t.value ? t.color : 'var(--surface-2)',
                  color: type === t.value ? 'white' : 'var(--ink)',
                  borderColor: type === t.value ? t.color : 'var(--line)',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Sarlavha va tavsif */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Sarlavha *</label>
            <input value={sarlavha} onChange={e => setSarlavha(e.target.value)} placeholder="Banner sarlavhasi" style={inp} />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Tavsif (ixtiyoriy)</label>
            <textarea
              value={tavsif}
              onChange={e => { setTavsif(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
              placeholder="Qisqa izoh..."
              rows={1}
              style={{ ...inp, resize: 'none', overflow: 'hidden', lineHeight: '1.5' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Havola (bosilganda) (ixtiyoriy)</label>
            <input value={linkHref} onChange={e => setLinkHref(e.target.value)} placeholder="/student/darslar yoki https://..." style={inp} />
          </div>

          {/* Rasm */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Rasm (ixtiyoriy)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {imagePreview && !clearImage ? (
                <div style={{ position: 'relative', width: '120px', height: '70px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => { setClearImage(true); setImageFile(null); setImagePreview(null) }}
                    style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px' }}>
                    ✕
                  </button>
                </div>
              ) : null}
              <button onClick={() => fileRef.current?.click()} style={{
                background: 'var(--surface-2)', border: '1px dashed var(--line)', borderRadius: '10px',
                padding: '10px 16px', cursor: 'pointer', fontSize: '13px', color: 'var(--ink)',
              }}>
                📷 {imagePreview && !clearImage ? 'Rasmni almashtirish' : 'Rasm yuklash'}
              </button>
              {imageFile && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>✓ {imageFile.name}</span>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (!f) return
                setImageFile(f); setImagePreview(URL.createObjectURL(f)); setClearImage(false)
              }} />
          </div>

          {/* Rang (rasm yo'q bo'lsa) */}
          {!imagePreview || clearImage ? (
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Fon rangi (rasm yo'q bo'lsa)</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {RANG_OPTS.map(r => (
                  <button key={r} onClick={() => setRang(r)} style={{
                    width: '32px', height: '32px', borderRadius: '50%', border: `3px solid ${rang === r ? 'white' : 'transparent'}`,
                    outline: rang === r ? `2px solid ${r}` : 'none',
                    background: r, cursor: 'pointer',
                  }} />
                ))}
              </div>
            </div>
          ) : null}

          {/* Preview */}
          {sarlavha && (
            <div style={{ borderRadius: '14px', overflow: 'hidden', height: '120px', position: 'relative',
              background: imagePreview && !clearImage ? 'var(--surface)' : `linear-gradient(135deg, ${rang}, ${rang}99)` }}>
              {imagePreview && !clearImage && (
                <img src={imagePreview} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div style={{ position: 'absolute', inset: 0,
                background: imagePreview && !clearImage ? 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' : 'transparent',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '12px 14px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'white', background: `${typeInfo?.color}cc`, borderRadius: '4px', padding: '1px 8px', display: 'inline-block', marginBottom: '4px', alignSelf: 'flex-start' }}>{typeInfo?.label}</span>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: 'white' }}>{sarlavha}</p>
                {tavsif && <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.85)' }}>{tavsif}</p>}
              </div>
            </div>
          )}

          {error && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: 0 }}>{error}</p>}
          {success && <p style={{ color: '#16a34a', fontSize: '13px', margin: 0 }}>{success}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={saqlash} disabled={loading} style={{
              flex: 1, background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '10px', padding: '13px', fontSize: '14px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Saqlanmoqda...' : editId ? '✅ Saqlash' : '➕ Qo\'shish'}
            </button>
            {editId && (
              <button onClick={resetForm} style={{
                background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
                borderRadius: '10px', padding: '13px 18px', fontSize: '14px', cursor: 'pointer',
              }}>Bekor</button>
            )}
          </div>
        </div>

        {/* ── Bannerlar ro'yxati ── */}
        {banners.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>📋 Mavjud bannerlar ({banners.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {banners.map((b, i) => (
                <div key={b.id} style={{
                  background: 'var(--surface)', border: `1px solid ${b.faol ? 'var(--line)' : 'var(--danger)40'}`,
                  borderRadius: '14px', padding: '14px 16px', opacity: b.faol ? 1 : 0.6,
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {b.image_url ? (
                      <img src={b.image_url} alt="" style={{ width: '72px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '72px', height: '48px', borderRadius: '8px', background: `linear-gradient(135deg, ${b.rang}, ${b.rang}80)`, flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 800, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.sarlavha}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>
                        {TYPE_OPTS.find(t => t.value === b.type)?.label} ·{' '}
                        {ROLE_OPTS.find(r => r.value === (b.target_role ?? ''))?.label} ·{' '}
                        {b.faol ? <span style={{ color: '#16a34a' }}>Faol</span> : <span style={{ color: 'var(--danger)' }}>Yashirin</span>}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => startEdit(b)} style={{ ...btnSm, color: 'var(--accent)', borderColor: 'var(--accent)20' }}>✏️ Tahrir</button>
                    <button onClick={() => toggleFaol(b)} style={{ ...btnSm, color: b.faol ? 'var(--muted)' : '#16a34a', borderColor: 'var(--line)' }}>{b.faol ? '🙈 Yashir' : '👁 Ko\'rsat'}</button>
                    <button onClick={() => tartibOzgartir(b.id, 'up')} disabled={i === 0} style={{ ...btnSm, color: 'var(--muted)', borderColor: 'var(--line)' }}>↑</button>
                    <button onClick={() => tartibOzgartir(b.id, 'down')} disabled={i === banners.length - 1} style={{ ...btnSm, color: 'var(--muted)', borderColor: 'var(--line)' }}>↓</button>
                    <button onClick={() => ochirish(b.id)} style={{ ...btnSm, color: 'var(--danger)', borderColor: 'var(--danger)30' }}>🗑 O'chir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const btnSm: React.CSSProperties = {
  background: 'var(--surface-2)', border: '1px solid', borderRadius: '8px',
  padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
}
