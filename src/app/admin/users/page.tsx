'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Profile = { id: string; full_name: string; role: string; telefon: string | null; faol: boolean; created_at: string }

const ROLLAR = [
  { value: 'student', label: '🎓 Talaba' },
  { value: 'doctor', label: '👨‍⚕️ Shifokor' },
  { value: 'patient', label: '🧑 Bemor' },
  { value: 'admin', label: '🛠️ Admin' },
]

export default function AdminUsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [qidiruv, setQidiruv] = useState('')

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers((data as Profile[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const changeRole = async (id: string, role: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
    await supabase.from('profiles').update({ role }).eq('id', id)
  }

  const toggleFaol = async (u: Profile) => {
    const faol = !u.faol
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, faol } : x)))
    await supabase.from('profiles').update({ faol }).eq('id', u.id)
  }

  const filtered = users.filter((u) =>
    `${u.full_name} ${u.telefon ?? ''} ${u.role}`.toLowerCase().includes(qidiruv.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />

      <div className="fade-in px-8 py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Foydalanuvchilar</h2>
          <input
            placeholder="Ism, telefon yoki rol bo'yicha qidirish..."
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            className="rounded-lg border px-3.5 py-2.5 text-sm outline-none"
            style={{ background: 'var(--surface-2)', color: 'var(--ink)', borderColor: 'var(--line)', maxWidth: '320px', width: '100%' }}
          />
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
                  {['Ism', 'Telefon', 'Rol', 'Holat', "Ro'yxatdan o'tgan", ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', color: 'var(--muted)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="row-hover" style={{ borderTop: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 16px' }}>{u.full_name ?? '—'}</td>
                    <td style={{ padding: '12px 16px' }}>{u.telefon ?? '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        style={{ background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)', borderRadius: '8px', padding: '6px 10px', fontSize: '13px' }}
                      >
                        {ROLLAR.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => toggleFaol(u)}
                        className="btn-animated"
                        style={{
                          border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer',
                          background: u.faol ? 'rgba(5,150,105,.15)' : 'rgba(220,38,38,.15)',
                          color: u.faol ? 'var(--good)' : 'var(--danger)',
                        }}
                      >
                        {u.faol ? 'Faol' : 'Bloklangan'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }} />
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p style={{ color: 'var(--muted)', padding: '20px' }}>Hech kim topilmadi.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
