'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Notif = {
  id: string
  title: string
  body: string
  type: string
  target_role: string | null
  created_at: string
}

const TYPE_OPTS = [
  { value: 'info',    label: 'ℹ️ Ma\'lumot',  color: '#2563eb' },
  { value: 'success', label: '✅ Muvaffaqiyat', color: '#16a34a' },
  { value: 'warning', label: '⚠️ Ogohlantirish', color: '#ca8a04' },
  { value: 'urgent',  label: '🚨 Shoshilinch',  color: '#dc2626' },
]

const ROLE_OPTS = [
  { value: '',        label: '👥 Hammaga' },
  { value: 'student', label: '🎓 Talabalar' },
  { value: 'doctor',  label: '👨‍⚕️ Shifokorlar' },
  { value: 'patient', label: '🧑 Bemorlar' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px',
  padding: '12px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}

export default function AdminBildirishnomalarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState('')
  const [history, setHistory] = useState<Notif[]>([])

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [type, setType] = useState('info')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data: p } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (p?.role !== 'admin') { router.push('/student/dashboard'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('notifications')
        .select('id, title, body, type, target_role, created_at')
        .order('created_at', { ascending: false })
        .limit(30)
      setHistory(data ?? [])
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const yuborish = async () => {
    setError('')
    if (!title.trim()) { setError('Sarlavha kiriting'); return }
    if (!body.trim()) { setError('Matn kiriting'); return }
    setLoading(true)

    const { error: dbErr } = await supabase.from('notifications').insert({
      title: title.trim(),
      body: body.trim(),
      type,
      target_role: role || null,
      created_by: userId,
    })

    if (dbErr) { setError('Xatolik: ' + dbErr.message); setLoading(false); return }

    setSuccess(true)
    setTitle(''); setBody(''); setType('info'); setRole('')
    setTimeout(() => setSuccess(false), 3000)

    // Refresh history
    const { data } = await supabase
      .from('notifications')
      .select('id, title, body, type, target_role, created_at')
      .order('created_at', { ascending: false })
      .limit(30)
    setHistory(data ?? [])
    setLoading(false)
  }

  const typeInfo = TYPE_OPTS.find(t => t.value === type)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin panel" />

      <div className="mx-auto max-w-[640px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>📢 Bildirishnoma yuborish</h2>

        {/* Forma */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Kimga</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ROLE_OPTS.map(r => (
                <button key={r.value} onClick={() => setRole(r.value)} style={{
                  padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid',
                  background: role === r.value ? 'var(--accent)' : 'var(--surface-2)',
                  color: role === r.value ? 'white' : 'var(--ink)',
                  borderColor: role === r.value ? 'var(--accent)' : 'var(--line)',
                }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Tur</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TYPE_OPTS.map(t => (
                <button key={t.value} onClick={() => setType(t.value)} style={{
                  padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid',
                  background: type === t.value ? t.color : 'var(--surface-2)',
                  color: type === t.value ? 'white' : 'var(--ink)',
                  borderColor: type === t.value ? t.color : 'var(--line)',
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Sarlavha</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Qisqa sarlavha" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Matn</label>
            <textarea
              value={body} onChange={e => setBody(e.target.value)}
              placeholder="Xabar matni..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          {/* Preview */}
          {(title || body) && (
            <div style={{
              background: type === 'info' ? '#eff6ff' : type === 'success' ? '#f0fdf4' : type === 'warning' ? '#fefce8' : '#fff1f2',
              border: `1px solid ${typeInfo?.color}40`,
              borderRadius: '12px', padding: '14px 16px',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>Ko'rinishi:</p>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>{typeInfo?.label} {title}</p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', opacity: 0.8 }}>{body}</p>
            </div>
          )}

          {error && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: 0 }}>{error}</p>}
          {success && <p style={{ color: '#16a34a', fontSize: '13px', margin: 0 }}>✅ Bildirishnoma yuborildi!</p>}

          <button onClick={yuborish} disabled={loading} style={{
            background: 'var(--accent)', color: 'white', border: 'none',
            borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Yuborilmoqda...' : '📢 Yuborish'}
          </button>
        </div>

        {/* Tarix */}
        {history.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>📋 Yuborilgan bildirishnomalar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map(n => {
                const roleLabel = ROLE_OPTS.find(r => r.value === (n.target_role ?? ''))?.label ?? '👥 Hammaga'
                const typeLabel = TYPE_OPTS.find(t => t.value === n.type)?.label ?? n.type
                return (
                  <div key={n.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--line)',
                    borderRadius: '12px', padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>{n.title}</span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', background: 'var(--surface-2)', borderRadius: '6px', padding: '1px 8px' }}>{roleLabel}</span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{typeLabel}</span>
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--ink)', opacity: 0.75, lineHeight: 1.5 }}>{n.body}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>
                      {new Date(n.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
