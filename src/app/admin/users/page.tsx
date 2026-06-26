'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Profile = { id: string; full_name: string; role: string; telefon: string | null; faol: boolean; created_at: string }

const ROLLAR = [
  { value: 'student', label: '🎓 Talaba' },
  { value: 'doctor', label: '👨‍⚕️ Shifokor' },
  { value: 'patient', label: '🧑 Bemor' },
  { value: 'admin', label: '🛠️ Admin' },
]

const inputStyle = {
  background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '8px', padding: '7px 10px', fontSize: '12.5px', outline: 'none', width: '100%', boxSizing: 'border-box' as const,
}

export default function AdminUsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<Profile[]>([])
  const [emaillar, setEmaillar] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [qidiruv, setQidiruv] = useState('')
  const [tahrirId, setTahrirId] = useState<string | null>(null)
  const [tahrirLogin, setTahrirLogin] = useState('')
  const [tahrirParol, setTahrirParol] = useState('')
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xato, setXato] = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers((data as Profile[]) ?? [])
    setLoading(false)

    const res = await fetch('/api/admin/foydalanuvchilar')
    if (res.ok) {
      const json = await res.json()
      setEmaillar(json.emaillar ?? {})
    }
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

  const tahrirniOch = (u: Profile) => {
    setTahrirId(u.id)
    setTahrirLogin(u.role === 'patient' ? (u.telefon ?? '') : (emaillar[u.id] ?? ''))
    setTahrirParol('')
    setXato(null)
  }

  const tahrirniSaqla = async (u: Profile) => {
    setSaqlanmoqda(true)
    setXato(null)
    const body: any = { userId: u.id }
    if (u.role === 'patient') body.telefon = tahrirLogin.trim()
    else body.email = tahrirLogin.trim()
    if (tahrirParol.trim()) body.parol = tahrirParol.trim()

    const res = await fetch('/api/admin/foydalanuvchi', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    const json = await res.json()
    setSaqlanmoqda(false)
    if (!res.ok) { setXato(json.error ?? 'Xatolik yuz berdi'); return }

    setTahrirId(null)
    load()
  }

  const filtered = users.filter((u) =>
    `${u.full_name} ${u.telefon ?? ''} ${u.role}`.toLowerCase().includes(qidiruv.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />

      <div className="fade-in px-4 py-6 sm:px-8 sm:py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
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
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
                  {['Ism', 'Login (telefon/email)', 'Rol', 'Holat', "Ro'yxatdan o'tgan", ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <React.Fragment key={u.id}>
                    <tr className="row-hover" style={{ borderTop: '1px solid var(--line)' }}>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{u.full_name ?? '—'}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: 'var(--ink-soft)', fontSize: '12px' }}>
                        {u.role === 'patient' ? (u.telefon ?? '—') : (emaillar[u.id] ?? '—')}
                      </td>
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
                            color: u.faol ? 'var(--good)' : 'var(--danger)', whiteSpace: 'nowrap',
                          }}
                        >
                          {u.faol ? 'Faol' : 'Bloklangan'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => (tahrirId === u.id ? setTahrirId(null) : tahrirniOch(u))}
                          className="soft-press"
                          style={{
                            background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)',
                            borderRadius: '8px', padding: '5px 11px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer',
                          }}
                        >
                          ✎ Login/parol
                        </button>
                      </td>
                    </tr>
                    {tahrirId === u.id && (
                      <tr style={{ borderTop: '1px solid var(--line)', background: 'var(--surface-2)' }}>
                        <td colSpan={6} style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div style={{ flex: '1 1 200px' }}>
                              <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                                {u.role === 'patient' ? 'Telefon raqami (login)' : 'Email (login)'}
                              </label>
                              <input style={inputStyle} value={tahrirLogin} onChange={(e) => setTahrirLogin(e.target.value)} />
                            </div>
                            <div style={{ flex: '1 1 180px' }}>
                              <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
                                Yangi parol (ixtiyoriy)
                              </label>
                              <input style={inputStyle} type="text" value={tahrirParol} onChange={(e) => setTahrirParol(e.target.value)} placeholder="bo'sh qoldirilsa o'zgarmaydi" />
                            </div>
                            <button
                              onClick={() => tahrirniSaqla(u)}
                              disabled={saqlanmoqda}
                              className="soft-press"
                              style={{
                                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px',
                                padding: '8px 16px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                              }}
                            >
                              {saqlanmoqda ? 'Saqlanmoqda...' : 'Saqlash'}
                            </button>
                            <button
                              onClick={() => setTahrirId(null)}
                              style={{
                                background: 'none', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '8px',
                                padding: '8px 16px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer',
                              }}
                            >
                              Bekor qilish
                            </button>
                          </div>
                          {xato && <p style={{ color: 'var(--danger)', fontSize: '12px', margin: '8px 0 0' }}>{xato}</p>}
                          <p style={{ color: 'var(--muted)', fontSize: '11px', margin: '8px 0 0' }}>
                            ⚠️ Eski parolni ko&apos;rish mumkin emas (xavfsizlik sababli yashiringan) — faqat yangi parol o&apos;rnatish mumkin.
                          </p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
