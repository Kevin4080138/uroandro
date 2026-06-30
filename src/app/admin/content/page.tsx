'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Protokol = {
  id: string; slug: string; nom: string; toifa: string; qisqa: string
  korsatma: string; tashxis: string[]; davolash: string[]; manba: string | null
}
type Fayl = { id: string; nom: string; izoh: string | null; file_path: string; created_at: string }

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px' }

const boshForm = { slug: '', nom: '', toifa: '', qisqa: '', korsatma: '', tashxis: '', davolash: '', manba: '' }

export default function AdminContentPage() {
  const supabase = createClient()
  const [tab, setTab] = useState<'protokollar' | 'kutubxona'>('protokollar')

  const [protokollar, setProtokollar] = useState<Protokol[]>([])
  const [fayllar, setFayllar] = useState<Fayl[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [tahrirId, setTahrirId] = useState<string | null>(null)
  const [form, setForm] = useState(boshForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [{ data: p }, { data: f }] = await Promise.all([
      supabase.from('protokollar').select('*').order('toifa'),
      supabase.from('kutubxona_fayllar').select('*').order('created_at', { ascending: false }),
    ])
    setProtokollar((p as Protokol[]) ?? [])
    setFayllar((f as Fayl[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const tahrirOch = (p: Protokol) => {
    setTahrirId(p.id)
    setForm({
      slug: p.slug, nom: p.nom, toifa: p.toifa, qisqa: p.qisqa,
      korsatma: p.korsatma,
      tashxis: p.tashxis.join('\n'),
      davolash: p.davolash.join('\n'),
      manba: p.manba ?? '',
    })
    setShowForm(true)
  }

  const formYop = () => { setShowForm(false); setTahrirId(null); setForm(boshForm) }

  const saveProtokol = async () => {
    if (!form.slug.trim() || !form.nom.trim()) return
    setSaving(true)
    const ma = {
      slug: form.slug.trim(), nom: form.nom, toifa: form.toifa || 'Boshqa',
      qisqa: form.qisqa, korsatma: form.korsatma,
      tashxis: form.tashxis.split('\n').map((s) => s.trim()).filter(Boolean),
      davolash: form.davolash.split('\n').map((s) => s.trim()).filter(Boolean),
      manba: form.manba || null,
    }
    if (tahrirId) {
      await supabase.from('protokollar').update(ma).eq('id', tahrirId)
    } else {
      await supabase.from('protokollar').insert(ma)
    }
    setSaving(false)
    formYop()
    load()
  }

  const delProtokol = async (id: string) => {
    if (!confirm("Bu protokolni o'chirishni tasdiqlaysizmi?")) return
    await supabase.from('protokollar').delete().eq('id', id)
    load()
  }

  const ochishFayl = (yol: string) => {
    const { data } = supabase.storage.from('kutubxona').getPublicUrl(yol)
    window.open(data.publicUrl, '_blank')
  }

  const delFayl = async (f: Fayl) => {
    if (!confirm("Bu faylni o'chirishni tasdiqlaysizmi?")) return
    await supabase.storage.from('kutubxona').remove([f.file_path])
    await supabase.from('kutubxona_fayllar').delete().eq('id', f.id)
    load()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />

      <div className="fade-in px-8 py-8">
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>Kontent boshqaruvi</h2>

        <div style={{ display: 'flex', border: '1.5px solid var(--line)', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px', maxWidth: '360px' }}>
          {([['protokollar', 'Protokollar'], ['kutubxona', 'Kutubxona']] as const).map(([v, label]) => (
            <button key={v} onClick={() => setTab(v)} className="btn-animated" style={{
              flex: 1, border: 'none', padding: '10px 6px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
              background: tab === v ? 'var(--accent)' : 'var(--surface-2)', color: tab === v ? 'white' : 'var(--muted)',
            }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : tab === 'protokollar' ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <button onClick={() => showForm ? formYop() : setShowForm(true)} className="btn-animated" style={{
                background: showForm ? 'var(--surface-2)' : 'var(--accent)',
                color: showForm ? 'var(--ink-soft)' : 'white',
                border: showForm ? '1px solid var(--line)' : 'none',
                borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
              }}>
                {showForm ? 'Bekor qilish' : '+ Yangi protokol'}
              </button>
            </div>

            {showForm && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 18px 0', fontSize: '15px', fontWeight: 700 }}>
                  {tahrirId ? '✎ Protokolni tahrirlash' : '+ Yangi protokol qo\'shish'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Slug (URL, masalan: prostatit)</label>
                    <input style={inputStyle} value={form.slug} onChange={set('slug')} />
                  </div>
                  <div>
                    <label style={labelStyle}>Toifa</label>
                    <input style={inputStyle} value={form.toifa} onChange={set('toifa')} placeholder="Urologiya / Andrologiya" />
                  </div>
                </div>
                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Nomi</label>
                  <input style={inputStyle} value={form.nom} onChange={set('nom')} />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Qisqa tavsif</label>
                  <input style={inputStyle} value={form.qisqa} onChange={set('qisqa')} />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Ko&apos;rsatma</label>
                  <textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.korsatma} onChange={set('korsatma')} />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Tashxis bosqichlari (har biri yangi qatordan)</label>
                  <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.tashxis} onChange={set('tashxis')} />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Davolash algoritmi (har biri yangi qatordan)</label>
                  <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.davolash} onChange={set('davolash')} />
                </div>
                <div style={{ marginTop: '14px' }}>
                  <label style={labelStyle}>Manba (ixtiyoriy)</label>
                  <input style={inputStyle} value={form.manba} onChange={set('manba')} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button onClick={saveProtokol} disabled={saving} className="btn-animated" style={{
                    background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
                    padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                  }}>
                    {saving ? 'Saqlanmoqda...' : (tahrirId ? 'Saqlash' : 'Qo\'shish')}
                  </button>
                  <button onClick={formYop} className="btn-animated" style={{
                    background: 'none', color: 'var(--muted)', border: '1px solid var(--line)',
                    borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', fontSize: '14px',
                  }}>Bekor qilish</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {protokollar.map((p) => (
                <div key={p.id} style={{
                  background: tahrirId === p.id ? 'var(--accent-soft)' : 'var(--surface)',
                  border: `1px solid ${tahrirId === p.id ? 'var(--accent)' : 'var(--line)'}`,
                  borderRadius: '10px', padding: '14px 18px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <strong style={{ fontSize: '14px' }}>{p.nom}</strong>
                    <span style={{ color: 'var(--muted)', fontSize: '12px', marginLeft: '8px' }}>{p.toifa} · /{p.slug}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => tahrirId === p.id ? formYop() : tahrirOch(p)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: tahrirId === p.id ? 'var(--accent)' : 'var(--muted)', fontSize: '15px', padding: '2px 4px',
                    }}>✎</button>
                    <button onClick={() => delProtokol(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '16px' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {fayllar.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>Kutubxonada fayl yo&apos;q.</p>
            ) : fayllar.map((f) => (
              <div key={f.id} style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px',
                padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div onClick={() => ochishFayl(f.file_path)} style={{ cursor: 'pointer' }}>
                  <strong style={{ fontSize: '14px' }}>📄 {f.nom}</strong>
                  {f.izoh && <span style={{ color: 'var(--muted)', fontSize: '12px', marginLeft: '8px' }}>{f.izoh}</span>}
                </div>
                <button onClick={() => delFayl(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '16px' }}>🗑️</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
