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
  boshlanish: string | null
  tugash: string | null
  arxiv: boolean
  created_at: string
}

type Sozlama = {
  role: string
  max_soni: number
  interval_soniya: number
  effekt: string
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
  { value: 'landing', label: '🌐 Kirish sahifasi (ochiq)' },
]
const RANG_OPTS = [
  '#2563eb', '#7c3aed', '#dc2626', '#16a34a', '#ca8a04', '#0891b2', '#db2777',
]
// Bo'lim sozlamalari uchun ko'rsatiladigan rollar (banner_sozlamalar bilan bir xil)
const SOZ_ROLLAR = [
  { role: 'patient', label: '🧑 Bemorlar' },
  { role: 'student', label: '🎓 Talabalar' },
  { role: 'doctor',  label: '👨‍⚕️ Shifokorlar' },
  { role: 'landing', label: '🌐 Kirish sahifasi' },
]
const EFFEKT_OPTS = [
  { value: 'fade',  label: 'Silliq (fade)' },
  { value: 'slide', label: 'Surilish (slide)' },
  { value: 'zoom',  label: 'Kattalashish (zoom)' },
]
const DEFAULT_SOZ = { max_soni: 5, interval_soniya: 6, effekt: 'fade' }

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px',
  padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}

// ── Sana yordamchilari ───────────────────────────────────────────────
function isoToLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}
function localInputToIso(v: string): string | null {
  if (!v) return null
  return new Date(v).toISOString()
}
function sanaKorinishi(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminBannerlarPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [userId, setUserId] = useState('')
  const [banners, setBanners] = useState<Banner[]>([])
  const [sozlamalar, setSozlamalar] = useState<Sozlama[]>([])
  const [sozXato, setSozXato] = useState(false)
  const [tab, setTab] = useState<'faol' | 'arxiv'>('faol')
  const [editId, setEditId] = useState<string | null>(null)

  // Form state
  const [sarlavha, setSarlavha] = useState('')
  const [tavsif, setTavsif] = useState('')
  const [linkHref, setLinkHref] = useState('')
  const [type, setType] = useState('yangilik')
  const [role, setRole] = useState('')
  const [rang, setRang] = useState('#2563eb')
  const [boshlanish, setBoshlanish] = useState('')
  const [tugash, setTugash] = useState('')
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
      loadSozlamalar()
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
    let list = (data ?? []) as Banner[]

    // Avto-arxiv: muddati o'tgan, hali arxivlanmagan bannerlarni arxivga o'tkazamiz
    const now = new Date().toISOString()
    const eskirgan = list.filter(b => !b.arxiv && b.tugash && b.tugash < now)
    if (eskirgan.length) {
      await supabase.from('bannerlar').update({ arxiv: true }).in('id', eskirgan.map(b => b.id))
      list = list.map(b => eskirgan.some(e => e.id === b.id) ? { ...b, arxiv: true } : b)
    }
    setBanners(list)
  }

  const loadSozlamalar = async () => {
    const { data, error } = await supabase.from('banner_sozlamalar').select('*')
    if (error) { setSozXato(true); return }
    setSozXato(false)
    setSozlamalar((data ?? []) as Sozlama[])
  }

  const saveSozlama = async (r: string, patch: Partial<Sozlama>) => {
    const joriy = sozlamalar.find(s => s.role === r) ?? { role: r, ...DEFAULT_SOZ }
    const yangi = { ...joriy, ...patch }
    setSozlamalar(prev => prev.some(s => s.role === r) ? prev.map(s => s.role === r ? yangi : s) : [...prev, yangi])
    // upsert — qator bo'lmasa yaratadi (seed ishlamagan bo'lsa ham ishlaydi)
    const { error } = await supabase.from('banner_sozlamalar')
      .upsert({ ...yangi, updated_at: new Date().toISOString() }, { onConflict: 'role' })
    if (error) setSozXato(true)
  }

  const resetForm = () => {
    setEditId(null); setSarlavha(''); setTavsif(''); setLinkHref('')
    setType('yangilik'); setRole(''); setRang('#2563eb')
    setBoshlanish(''); setTugash('')
    setImageFile(null); setImagePreview(null); setClearImage(false)
    setError(''); setSuccess('')
  }

  const startEdit = (b: Banner) => {
    setEditId(b.id); setSarlavha(b.sarlavha); setTavsif(b.tavsif ?? '')
    setLinkHref(b.link_href ?? ''); setType(b.type); setRole(b.target_role ?? '')
    setRang(b.rang ?? '#2563eb'); setImagePreview(b.image_url)
    setBoshlanish(isoToLocalInput(b.boshlanish)); setTugash(isoToLocalInput(b.tugash))
    setImageFile(null); setClearImage(false); setError(''); setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Muddat presetlari — tugash sanasini hozirdan N kun keyinga qo'yadi
  const muddatPreset = (kun: number) => {
    if (!boshlanish) setBoshlanish(isoToLocalInput(new Date().toISOString()))
    const asos = boshlanish ? new Date(boshlanish) : new Date()
    setTugash(isoToLocalInput(new Date(asos.getTime() + kun * 86400000).toISOString()))
  }

  const saqlash = async () => {
    setError(''); setSuccess('')
    if (!sarlavha.trim()) { setError('Sarlavha kiriting'); return }
    const boshIso = localInputToIso(boshlanish)
    const tugIso = localInputToIso(tugash)
    if (boshIso && tugIso && tugIso <= boshIso) { setError("Tugash sanasi boshlanishdan keyin bo'lsin"); return }
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
      boshlanish: boshIso,
      tugash: tugIso,
      created_by: userId,
    }

    if (editId) {
      // Tahrirda: yangi tugash kelajakda bo'lsa arxivdan chiqaramiz
      const arxivPatch = tugIso && tugIso < new Date().toISOString() ? { arxiv: true } : { arxiv: false }
      const { error: dbErr } = await supabase.from('bannerlar').update({ ...payload, ...arxivPatch }).eq('id', editId)
      if (dbErr) { setError(dbErr.message); setLoading(false); return }
    } else {
      const { error: dbErr } = await supabase.from('bannerlar').insert({ ...payload, faol: true, arxiv: false, sort_order: banners.length })
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

  const arxivla = async (b: Banner) => {
    await supabase.from('bannerlar').update({ arxiv: true }).eq('id', b.id)
    setBanners(prev => prev.map(x => x.id === b.id ? { ...x, arxiv: true } : x))
    if (editId === b.id) resetForm()
  }

  const arxivdanChiqar = async (b: Banner) => {
    // Muddati o'tgan bo'lsa tugashni tozalaymiz — aks holda darrov qayta arxivlanardi
    const patch: Partial<Banner> = { arxiv: false }
    if (b.tugash && b.tugash < new Date().toISOString()) patch.tugash = null
    await supabase.from('bannerlar').update(patch).eq('id', b.id)
    setBanners(prev => prev.map(x => x.id === b.id ? { ...x, ...patch } : x))
  }

  const ochirish = async (id: string) => {
    if (!confirm('Bannerni butunlay o\'chirasizmi?')) return
    await supabase.from('bannerlar').delete().eq('id', id)
    setBanners(prev => prev.filter(x => x.id !== id))
    if (editId === id) resetForm()
  }

  const koringan = banners.filter(b => tab === 'arxiv' ? b.arxiv : !b.arxiv)

  const tartibOzgartir = async (id: string, dir: 'up' | 'down') => {
    const arr = koringan
    const i = arr.findIndex(b => b.id === id)
    const j = dir === 'up' ? i - 1 : i + 1
    if (j < 0 || j >= arr.length) return
    const a = arr[i], b2 = arr[j]
    await Promise.all([
      supabase.from('bannerlar').update({ sort_order: b2.sort_order }).eq('id', a.id),
      supabase.from('bannerlar').update({ sort_order: a.sort_order }).eq('id', b2.id),
    ])
    setBanners(prev => prev.map(x =>
      x.id === a.id ? { ...x, sort_order: b2.sort_order } :
      x.id === b2.id ? { ...x, sort_order: a.sort_order } : x
    ).sort((x, y) => x.sort_order - y.sort_order))
  }

  const typeInfo = TYPE_OPTS.find(t => t.value === type)
  const arxivSoni = banners.filter(b => b.arxiv).length
  const faolSoni = banners.filter(b => !b.arxiv).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin panel" />

      <div className="mx-auto max-w-[680px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
          🎠 Bannerlar boshqaruvi
        </h2>

        {/* ── Bo'lim sozlamalari ── */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>⚙️ Bo&apos;lim sozlamalari</h3>
          <p style={{ margin: '-6px 0 0', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
            Har bir bo&apos;limda ko&apos;pi bilan nechta banner, har biri necha soniya turishi va almashinish effekti.
          </p>
          {sozXato && (
            <div style={{ background: 'color-mix(in srgb, var(--danger) 12%, transparent)', border: '1px solid var(--danger)', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              ⚠️ Sozlamalar jadvali topilmadi. Supabase&apos;da <code>20260821000000_banner_kengaytirish.sql</code> migratsiyasini ishga tushiring — shundan keyin bu yer saqlanadi.
            </div>
          )}
          {SOZ_ROLLAR.map(sr => {
            const s = sozlamalar.find(x => x.role === sr.role) ?? { role: sr.role, ...DEFAULT_SOZ }
            return (
              <div key={sr.role} style={{ background: 'var(--surface-2)', borderRadius: '12px', padding: '12px 14px' }}>
                <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700 }}>{sr.label}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    Nechtagacha
                    <input type="number" min={1} max={10} value={s.max_soni}
                      onChange={e => saveSozlama(sr.role, { max_soni: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })}
                      style={{ ...inp, width: '90px', padding: '8px 10px' }} />
                  </label>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    Soniya
                    <input type="number" min={2} max={30} value={s.interval_soniya}
                      onChange={e => saveSozlama(sr.role, { interval_soniya: Math.max(2, Math.min(30, Number(e.target.value) || 6)) })}
                      style={{ ...inp, width: '90px', padding: '8px 10px' }} />
                  </label>
                  <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '150px' }}>
                    Effekt
                    <select value={s.effekt} onChange={e => saveSozlama(sr.role, { effekt: e.target.value })} style={{ ...inp, padding: '8px 10px' }}>
                      {EFFEKT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </label>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Forma ── */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
            {editId ? '✏️ Bannerni tahrirlash' : '➕ Yangi banner'}
          </h3>

          {/* Kimga */}
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>Kimga ko&apos;rsatilsin</p>
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

          {/* ── Muddat (rejalashtirish) ── */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
              📅 Ko&apos;rsatish muddati (ixtiyoriy)
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {[['1 kun', 1], ['1 hafta', 7], ['1 oy', 30]].map(([lab, kun]) => (
                <button key={lab as string} onClick={() => muddatPreset(kun as number)} style={{
                  padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
                }}>{lab}</button>
              ))}
              <button onClick={() => { setBoshlanish(''); setTugash('') }} style={{
                padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)',
              }}>Muddatsiz</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '150px' }}>
                Boshlanish
                <input type="datetime-local" value={boshlanish} onChange={e => setBoshlanish(e.target.value)} style={{ ...inp, padding: '9px 12px' }} />
              </label>
              <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '150px' }}>
                Tugash
                <input type="datetime-local" value={tugash} onChange={e => setTugash(e.target.value)} style={{ ...inp, padding: '9px 12px' }} />
              </label>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
              Bo&apos;sh qoldirilsa — muddatsiz. Tugash o&apos;tgach banner avtomatik arxivga o&apos;tadi.
            </p>
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
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Fon rangi (rasm yo&apos;q bo&apos;lsa)</label>
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

        {/* ── Faol / Arxiv tablari ── */}
        <div style={{ display: 'flex', border: '1.5px solid var(--line)', borderRadius: '10px', overflow: 'hidden' }}>
          {([['faol', `📋 Faol (${faolSoni})`], ['arxiv', `🗄 Arxiv (${arxivSoni})`]] as const).map(([v, label]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              flex: 1, border: 'none', padding: '10px 6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              background: tab === v ? 'var(--accent)' : 'var(--surface-2)',
              color: tab === v ? 'white' : 'var(--muted)',
            }}>{label}</button>
          ))}
        </div>

        {/* ── Ro'yxat ── */}
        {koringan.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {koringan.map((b, i) => (
              <div key={b.id} style={{
                background: 'var(--surface)', border: `1px solid ${b.faol ? 'var(--line)' : 'var(--danger)40'}`,
                borderRadius: '14px', padding: '14px 16px', opacity: b.faol || b.arxiv ? 1 : 0.6,
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
                    {(b.boshlanish || b.tugash) && (
                      <p style={{ margin: '3px 0 0', fontSize: '10.5px', color: 'var(--muted)' }}>
                        📅 {sanaKorinishi(b.boshlanish)} → {sanaKorinishi(b.tugash)}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {tab === 'faol' ? (
                    <>
                      <button onClick={() => startEdit(b)} style={{ ...btnSm, color: 'var(--accent)', borderColor: 'var(--accent)20' }}>✏️ Tahrir</button>
                      <button onClick={() => toggleFaol(b)} style={{ ...btnSm, color: b.faol ? 'var(--muted)' : '#16a34a', borderColor: 'var(--line)' }}>{b.faol ? '🙈 Yashir' : '👁 Ko\'rsat'}</button>
                      <button onClick={() => tartibOzgartir(b.id, 'up')} disabled={i === 0} style={{ ...btnSm, color: 'var(--muted)', borderColor: 'var(--line)' }}>↑</button>
                      <button onClick={() => tartibOzgartir(b.id, 'down')} disabled={i === koringan.length - 1} style={{ ...btnSm, color: 'var(--muted)', borderColor: 'var(--line)' }}>↓</button>
                      <button onClick={() => arxivla(b)} style={{ ...btnSm, color: '#ca8a04', borderColor: 'var(--line)' }}>🗄 Arxivla</button>
                      <button onClick={() => ochirish(b.id)} style={{ ...btnSm, color: 'var(--danger)', borderColor: 'var(--danger)30' }}>🗑 O&apos;chir</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => arxivdanChiqar(b)} style={{ ...btnSm, color: '#16a34a', borderColor: 'var(--line)' }}>↩️ Arxivdan chiqarish</button>
                      <button onClick={() => startEdit(b)} style={{ ...btnSm, color: 'var(--accent)', borderColor: 'var(--accent)20' }}>✏️ Tahrir</button>
                      <button onClick={() => ochirish(b.id)} style={{ ...btnSm, color: 'var(--danger)', borderColor: 'var(--danger)30' }}>🗑 O&apos;chir</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', padding: '20px 0' }}>
            {tab === 'arxiv' ? 'Arxivda banner yo\'q.' : 'Hozircha banner yo\'q.'}
          </p>
        )}
      </div>
    </div>
  )
}

const btnSm: React.CSSProperties = {
  background: 'var(--surface-2)', border: '1px solid', borderRadius: '8px',
  padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
}
