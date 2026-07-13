'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Klinika = {
  id: string
  nom: string
  manzil: string | null
  telefon: string | null
  hudud: string
  created_at: string
}

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px',
  padding: '11px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px' }

const bosh = { nom: '', manzil: '', telefon: '', hudud: "Farg'ona" }

export default function AdminKlinikalarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState('')
  const [klinikalar, setKlinikalar] = useState<Klinika[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(bosh)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('klinikalar').select('*').order('nom')
    setKlinikalar((data as Klinika[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/auth/login'); return }
      setUserId(data.user.id)
    })
    load()
  }, [])

  const set = (k: keyof typeof bosh) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const tahrirBoshla = (k: Klinika) => {
    setEditId(k.id)
    setForm({ nom: k.nom, manzil: k.manzil ?? '', telefon: k.telefon ?? '', hudud: k.hudud })
    setShowForm(true)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const bekor = () => { setShowForm(false); setEditId(null); setForm(bosh) }

  const saqla = async () => {
    if (!form.nom.trim()) { alert('Nomini kiriting'); return }
    setSaving(true)
    if (editId) {
      await supabase.from('klinikalar').update({
        nom: form.nom.trim(), manzil: form.manzil.trim() || null,
        telefon: form.telefon.trim() || null, hudud: form.hudud.trim() || "Farg'ona",
      }).eq('id', editId)
    } else {
      await supabase.from('klinikalar').insert({
        nom: form.nom.trim(), manzil: form.manzil.trim() || null,
        telefon: form.telefon.trim() || null, hudud: form.hudud.trim() || "Farg'ona",
        created_by: userId,
      })
    }
    setSaving(false)
    bekor()
    load()
  }

  const ochir = async (k: Klinika) => {
    if (!confirm(`"${k.nom}" klinikasini o'chirasizmi?`)) return
    const { error } = await supabase.from('klinikalar').delete().eq('id', k.id)
    if (error) { alert('Xatolik: ' + error.message); return }
    load()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
      <div className="mx-auto max-w-[860px] px-8 py-8">
        <div className="rise" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>🏥 Klinikalar</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '13px' }}>
              Jami <strong style={{ color: 'var(--ink)' }}>{klinikalar.length}</strong> ta klinika · katalogda ko&apos;rinadi
            </p>
          </div>
          <button onClick={() => (showForm ? bekor() : setShowForm(true))} className="btn-animated soft-press" style={{
            background: showForm ? 'var(--surface-2)' : 'var(--accent)', color: showForm ? 'var(--ink-soft)' : 'white',
            border: showForm ? '1px solid var(--line)' : 'none', borderRadius: '999px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {showForm ? 'Bekor qilish' : '+ Yangi klinika'}
          </button>
        </div>

        {showForm && (
          <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px', marginBottom: '20px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>{editId ? 'Klinikani tahrirlash' : 'Yangi klinika'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={lbl}>Nomi *</label>
                <input style={inp} value={form.nom} onChange={set('nom')} placeholder="Masalan: Farg'ona shahar tibbiyot markazi" />
              </div>
              <div>
                <label style={lbl}>Telefon</label>
                <input style={inp} value={form.telefon} onChange={set('telefon')} placeholder="+998 ..." />
              </div>
              <div>
                <label style={lbl}>Hudud</label>
                <input style={inp} value={form.hudud} onChange={set('hudud')} placeholder="Farg'ona" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={lbl}>Manzil</label>
                <input style={inp} value={form.manzil} onChange={set('manzil')} placeholder="Ko'cha, uy" />
              </div>
            </div>
            <button onClick={saqla} disabled={saving || !form.nom.trim()} className="btn-animated" style={{
              marginTop: '16px', background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '10px', padding: '12px 24px', cursor: saving || !form.nom.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, opacity: saving || !form.nom.trim() ? 0.7 : 1,
            }}>
              {saving ? 'Saqlanmoqda...' : editId ? 'Saqlash' : "Qo'shish"}
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : klinikalar.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.6 }}>🏥</div>
            <p style={{ margin: 0, fontSize: '14px' }}>Hozircha klinika yo&apos;q. Yangi klinika qo&apos;shing.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {klinikalar.map((k, i) => (
              <div key={k.id} className="rise" style={{
                animationDelay: `${Math.min(i * 0.04, 0.4)}s`,
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '14px 18px',
              }}>
                <span style={{ fontSize: 24, width: 44, height: 44, flexShrink: 0, borderRadius: 12, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏥</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600 }}>{k.nom}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>📍 {k.hudud}{k.manzil ? `, ${k.manzil}` : ''}</span>
                    {k.telefon && <span>📞 {k.telefon}</span>}
                  </div>
                </div>
                <button onClick={() => tahrirBoshla(k)} className="soft-press" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-soft)', borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Tahrirlash</button>
                <button onClick={() => ochir(k)} className="soft-press" style={{ background: 'color-mix(in srgb, var(--danger) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--danger) 30%, transparent)', color: 'var(--danger)', borderRadius: 8, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>O&apos;chirish</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
