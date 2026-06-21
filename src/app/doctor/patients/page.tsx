'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'

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

const emptyForm = { fio: '', passport_seria: '', passport_raqam: '', tugilgan_sana: '', telefon: '', manzil: '' }

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

    setSaving(true)
    const { error } = await supabase.from('bemorlar').insert({
      fio: form.fio,
      passport_seria: form.passport_seria,
      passport_raqam: form.passport_raqam,
      tugilgan_sana: form.tugilgan_sana || null,
      telefon: form.telefon,
      manzil: form.manzil,
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
    `${b.fio} ${b.passport_seria ?? ''}${b.passport_raqam ?? ''} ${b.telefon ?? ''}`
      .toLowerCase()
      .includes(qidiruv.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header />

      <div className="fade-in px-8 py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Bemorlar reestri</h2>
          <input
            placeholder="F.I.O, pasport yoki telefon bo'yicha qidirish..."
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            style={{ ...inputStyle, maxWidth: '320px' }}
          />
          <button onClick={() => setShowForm(!showForm)} className="btn-animated" style={{
            background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap',
          }}>
            {showForm ? 'Bekor qilish' : '+ Yangi bemor'}
          </button>
        </div>

        {showForm && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
            padding: '24px', marginBottom: '24px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <label style={labelStyle}>F.I.O.</label>
                <input style={inputStyle} value={form.fio} onChange={set('fio')} />
              </div>
              <div>
                <label style={labelStyle}>Pasport seriyasi</label>
                <input style={inputStyle} value={form.passport_seria} onChange={set('passport_seria')} placeholder="AB" />
              </div>
              <div>
                <label style={labelStyle}>Pasport raqami</label>
                <input style={inputStyle} value={form.passport_raqam} onChange={set('passport_raqam')} placeholder="1234567" />
              </div>
              <div>
                <label style={labelStyle}>Tug&apos;ilgan sana</label>
                <input type="date" style={inputStyle} value={form.tugilgan_sana} onChange={set('tugilgan_sana')} />
              </div>
              <div>
                <label style={labelStyle}>Telefon</label>
                <input style={inputStyle} value={form.telefon} onChange={set('telefon')} placeholder="+998 90 123 45 67" />
              </div>
              <div>
                <label style={labelStyle}>Manzil</label>
                <input style={inputStyle} value={form.manzil} onChange={set('manzil')} />
              </div>
            </div>

            <button onClick={handleSave} disabled={saving || !form.fio} className="btn-animated" style={{
              marginTop: '16px', background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '10px', padding: '12px 24px', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600, opacity: saving || !form.fio ? 0.7 : 1,
            }}>
              {saving ? 'Saqlanmoqda...' : 'Reestrga qo\'shish'}
            </button>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Hech narsa topilmadi.</p>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
                  {['F.I.O.', 'Pasport', "Tug'ilgan sana", 'Telefon', "Qo'shilgan"].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', color: 'var(--muted)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => router.push(`/doctor/patients/${b.id}`)}
                    className="row-hover"
                    style={{ borderTop: '1px solid var(--line)', cursor: 'pointer' }}
                  >
                    <td style={{ padding: '12px 16px', color: 'var(--accent)' }}>{b.fio}</td>
                    <td style={{ padding: '12px 16px' }}>{[b.passport_seria, b.passport_raqam].filter(Boolean).join(' ')}</td>
                    <td style={{ padding: '12px 16px' }}>{b.tugilgan_sana ?? '—'}</td>
                    <td style={{ padding: '12px 16px' }}>{b.telefon ?? '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{new Date(b.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
