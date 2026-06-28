'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { HududTanlash } from '@/components/HududTanlash'

const inputStyle = {
  width: '100%',
  background: 'var(--surface-2)',
  color: 'var(--ink)',
  border: '1px solid var(--line)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px' }

const emptyForm = { familiya: '', ism: '', otasi: '', tugilgan_sana: '', telefon: '', viloyat: '', tuman: '', manzil_qolgan: '' }

export default function PatientsRegistryPage() {
  const [bemorlar, setBemorlar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [qidiruv, setQidiruv] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('bemorlar').select('*').order('created_at', { ascending: false })
    setBemorlar(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const fio = [form.familiya, form.ism, form.otasi].map((x) => x.trim()).filter(Boolean).join(' ')
    const manzil = [form.viloyat, form.tuman, form.manzil_qolgan].map((x) => x.trim()).filter(Boolean).join(', ')
    setSaving(true)
    const { error } = await supabase.from('bemorlar').insert({
      fio,
      familiya: form.familiya.trim() || null,
      ism: form.ism.trim() || null,
      otasi: form.otasi.trim() || null,
      tugilgan_sana: form.tugilgan_sana || null,
      telefon: form.telefon,
      manzil,
      created_by: user.id,
    })
    setSaving(false)

    if (!error) {
      setForm(emptyForm)
      setShowForm(false)
      load()
    }
  }

  const filtered = bemorlar.filter((b) =>
    `${b.fio} №${b.raqam ?? ''} ${b.telefon ?? ''}`
      .toLowerCase()
      .includes(qidiruv.toLowerCase().replace('№', ''))
  )

  return (
    <AppShell title="Bemorlar reestri">
      <div className="mx-auto max-w-[920px] px-8 py-8">
        {/* Sarlavha + qidiruv */}
        <div className="rise" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Bemorlar</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '13px' }}>
              Jami <strong style={{ color: 'var(--ink)' }}>{bemorlar.length}</strong> ta bemor
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', width: '100%', maxWidth: '420px' }}>
            <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 0 }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '14px', pointerEvents: 'none' }}>🔍</span>
              <input
                placeholder="Qidirish..."
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                style={{ ...inputStyle, width: '100%', paddingLeft: '36px', borderRadius: '999px' }}
              />
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-animated soft-press" style={{
              background: showForm ? 'var(--surface-2)' : 'var(--accent)', color: showForm ? 'var(--ink-soft)' : 'white',
              border: showForm ? '1px solid var(--line)' : 'none', borderRadius: '999px',
              padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              {showForm ? 'Bekor qilish' : '+ Yangi bemor'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
            padding: '24px', marginBottom: '20px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Familiya *</label>
                <input style={inputStyle} value={form.familiya} onChange={set('familiya')} placeholder="Aliyev" />
              </div>
              <div>
                <label style={labelStyle}>Ism *</label>
                <input style={inputStyle} value={form.ism} onChange={set('ism')} placeholder="Abdusattor" />
              </div>
              <div>
                <label style={labelStyle}>Otasining ismi</label>
                <input style={inputStyle} value={form.otasi} onChange={set('otasi')} placeholder="Akmal o'g'li" />
              </div>
              <div>
                <label style={labelStyle}>Tug&apos;ilgan sana</label>
                <input type="date" style={inputStyle} value={form.tugilgan_sana} onChange={set('tugilgan_sana')} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input style={inputStyle} value={form.telefon} onChange={set('telefon')} placeholder="+998 90 123 45 67" />
              </div>
              <div style={{ gridColumn: 'span 3' }}>
                <label style={labelStyle}>Manzil</label>
                <HududTanlash
                  viloyat={form.viloyat}
                  tuman={form.tuman}
                  qolgan={form.manzil_qolgan}
                  onViloyat={(v) => setForm((f) => ({ ...f, viloyat: v }))}
                  onTuman={(v) => setForm((f) => ({ ...f, tuman: v }))}
                  onQolgan={(v) => setForm((f) => ({ ...f, manzil_qolgan: v }))}
                />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving || !form.familiya || !form.ism} className="btn-animated" style={{
              marginTop: '16px', background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '10px', padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, opacity: saving || !form.familiya || !form.ism ? 0.7 : 1,
            }}>
              {saving ? 'Saqlanmoqda...' : 'Reestrga qo\'shish'}
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ height: '64px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', opacity: 0.5 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.6 }}>🗂️</div>
            <p style={{ margin: 0, fontSize: '14px' }}>{qidiruv ? 'Hech narsa topilmadi.' : 'Hozircha bemor yo\'q. Yangi bemor qo\'shing.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((b, i) => (
              <div
                key={b.id}
                onClick={() => router.push(`/doctor/patients/${b.id}`)}
                className="lift rise"
                style={{
                  animationDelay: `${Math.min(i * 0.04, 0.4)}s`,
                  display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '14px 18px',
                }}
              >
                <span className="avatar" style={{ width: '42px', height: '42px', fontSize: '15px', position: 'relative' }}>
                  {ismBoshHarflar(b.fio)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {b.raqam && <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--accent)', background: 'var(--accent-soft)', borderRadius: '6px', padding: '1px 7px', fontWeight: 700 }}>№{b.raqam}</span>}
                    {b.namuna && <span style={{ fontSize: '12px', color: 'var(--accent-2)', fontWeight: 700 }}>✨ Namuna</span>}
                    {b.fio}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {b.telefon && <span>📞 {b.telefon}</span>}
                    {b.tugilgan_sana && <span>🎂 {b.tugilgan_sana}</span>}
                  </div>
                </div>
                <span style={{ fontSize: '11.5px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{new Date(b.created_at).toLocaleDateString()}</span>
                <span className="chevron" style={{ color: 'var(--muted)', fontSize: '18px' }}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function ismBoshHarflar(fio?: string) {
  if (!fio) return '—'
  const qismlar = fio.trim().split(/\s+/)
  return ((qismlar[0]?.[0] ?? '') + (qismlar[1]?.[0] ?? '')).toUpperCase()
}
