'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Profile = { id: string; full_name: string; role: string; telefon: string | null; email: string | null; faol: boolean; created_at: string; arxivlangan: boolean; doctor_holati: string | null; mutaxassislik: string | null; ish_joyi: string | null }

const ROLLAR = [
  { value: 'student', label: '🎓 Talaba' },
  { value: 'doctor', label: '👨‍⚕️ Shifokor' },
  { value: 'patient', label: '🧑 Bemor' },
  { value: 'admin', label: '🛠️ Admin' },
]

const BOSQICH_PILLLAR: { id: "oson" | "o'rta" | 'qiyin'; emoji: string }[] = [
  { id: 'oson', emoji: '🟢' },
  { id: "o'rta", emoji: '🟡' },
  { id: 'qiyin', emoji: '🔴' },
]

const inputStyle = {
  background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '8px', padding: '7px 10px', fontSize: '12.5px', outline: 'none', width: '100%', boxSizing: 'border-box' as const,
}

export default function AdminUsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [qidiruv, setQidiruv] = useState('')
  const [rolFiltr, setRolFiltr] = useState('')
  const [sahifa, setSahifa] = useState(0)
  const [jami, setJami] = useState(0)
  const SAHIFADA = 20
  const [tahrirId, setTahrirId] = useState<string | null>(null)
  const [tahrirLogin, setTahrirLogin] = useState('')
  const [tahrirParol, setTahrirParol] = useState('')
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xato, setXato] = useState<string | null>(null)
  const [arxivKorsat, setArxivKorsat] = useState(false)
  const [ochirilmoqda, setOchirilmoqda] = useState<string | null>(null)
  const [obunalar, setObunalar] = useState<Record<string, Set<string>>>({})
  const [kutayotganlar, setKutayotganlar] = useState<Profile[]>([])
  const [kutayotganlarLoading, setKutayotganlarLoading] = useState(true)

  const load = async (q: string, rol: string, s: number) => {
    setLoading(true)
    let base = supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false })
    if (q.trim()) base = base.or(`full_name.ilike.%${q.trim()}%,telefon.ilike.%${q.trim()}%,email.ilike.%${q.trim()}%`)
    if (rol) base = base.eq('role', rol)
    const [{ data: profillar, count }, { data: obunaQatorlari }] = await Promise.all([
      base.range(s * SAHIFADA, (s + 1) * SAHIFADA - 1),
      supabase.from('obunalar').select('student_id, bosqich').eq('faol', true),
    ])
    setUsers((profillar as Profile[]) ?? [])
    setJami(count ?? 0)
    const om: Record<string, Set<string>> = {}
    for (const o of obunaQatorlari ?? []) (om[o.student_id] ??= new Set()).add(o.bosqich)
    setObunalar(om)
    setLoading(false)
  }

  const loadKutayotganlar = async () => {
    setKutayotganlarLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('doctor_holati', 'kutish')
      .order('created_at', { ascending: false })
    setKutayotganlar((data as Profile[]) ?? [])
    setKutayotganlarLoading(false)
  }

  const tasdiqlash = async (u: Profile) => {
    await supabase.from('profiles').update({ role: 'doctor', doctor_holati: 'tasdiqlandi' }).eq('id', u.id)
    setKutayotganlar((prev) => prev.filter((x) => x.id !== u.id))
  }

  const radEtish = async (u: Profile) => {
    await supabase.from('profiles').update({ doctor_holati: 'rad_etildi' }).eq('id', u.id)
    setKutayotganlar((prev) => prev.filter((x) => x.id !== u.id))
  }

  useEffect(() => {
    loadKutayotganlar()
  }, [])

  useEffect(() => {
    setSahifa(0)
    const timer = setTimeout(() => load(qidiruv, rolFiltr, 0), 300)
    return () => clearTimeout(timer)
  }, [qidiruv, rolFiltr])

  const sahifaOzgartir = (yangi: number) => {
    setSahifa(yangi)
    load(qidiruv, rolFiltr, yangi)
  }

  const obunaniBekorQil = async (studentId: string, bosqich: string) => {
    setObunalar((prev) => {
      const yangi = { ...prev, [studentId]: new Set(prev[studentId] ?? []) }
      yangi[studentId].delete(bosqich)
      return yangi
    })
    await supabase.from('obunalar').delete().eq('student_id', studentId).eq('bosqich', bosqich)
  }

  const obunaBer = async (studentId: string, bosqich: string, oylar: number | null) => {
    setObunalar((prev) => {
      const yangi = { ...prev, [studentId]: new Set(prev[studentId] ?? []) }
      yangi[studentId].add(bosqich)
      return yangi
    })
    const tugashSanasi = oylar ? new Date(Date.now() + oylar * 30 * 24 * 60 * 60 * 1000).toISOString() : null
    await supabase.from('obunalar').upsert(
      { student_id: studentId, bosqich, faol: true, tugash_sanasi: tugashSanasi },
      { onConflict: 'student_id,bosqich' }
    )
  }

  const changeRole = async (id: string, role: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
    await supabase.from('profiles').update({ role }).eq('id', id)
  }

  const toggleFaol = async (u: Profile) => {
    const faol = !u.faol
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, faol } : x)))
    await supabase.from('profiles').update({ faol }).eq('id', u.id)
  }

  const toggleArxiv = async (u: Profile) => {
    const arxivlangan = !u.arxivlangan
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, arxivlangan } : x)))
    await supabase.from('profiles').update({ arxivlangan }).eq('id', u.id)
  }

  const foydalanuvchiniOchir = async (u: Profile) => {
    if (!confirm(`"${u.full_name}" foydalanuvchisini BUTUNLAY o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.`)) return
    setOchirilmoqda(u.id)
    const res = await fetch('/api/admin/foydalanuvchi-ochirish', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: u.id }),
    })
    setOchirilmoqda(null)
    if (!res.ok) { const j = await res.json(); alert(j.error ?? "O'chirib bo'lmadi"); return }
    setUsers((prev) => prev.filter((x) => x.id !== u.id))
  }

  const tahrirniOch = (u: Profile) => {
    setTahrirId(u.id)
    setTahrirLogin(u.role === 'patient' ? (u.telefon ?? '') : (u.email ?? ''))
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
    load(qidiruv, rolFiltr, sahifa)
  }

  const filtered = users.filter((u) => !u.arxivlangan)
  const arxivlangan = users.filter((u) => u.arxivlangan)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />

      <div className="fade-in px-4 py-6 sm:px-8 sm:py-8">

        {/* Kutayotgan shifokorlar */}
        {(kutayotganlarLoading || kutayotganlar.length > 0) && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⏳ Tasdiqlash kutayotgan shifokorlar
              {kutayotganlar.length > 0 && (
                <span style={{ background: 'var(--danger)', color: 'white', borderRadius: '12px', padding: '2px 10px', fontSize: '13px' }}>
                  {kutayotganlar.length}
                </span>
              )}
            </h2>
            {kutayotganlarLoading ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {kutayotganlar.map((u) => (
                  <div key={u.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontWeight: 600, fontSize: '15px' }}>{u.full_name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '2px' }}>
                        {u.mutaxassislik && <span>{u.mutaxassislik}</span>}
                        {u.mutaxassislik && u.ish_joyi && <span> · </span>}
                        {u.ish_joyi && <span>{u.ish_joyi}</span>}
                      </div>
                      <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '2px' }}>{u.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => tasdiqlash(u)}
                        style={{
                          background: '#059669', color: 'white', border: 'none', borderRadius: '8px',
                          padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        ✓ Tasdiqlash
                      </button>
                      <button
                        onClick={() => radEtish(u)}
                        style={{
                          background: 'var(--surface-2)', color: 'var(--danger)', border: '1px solid var(--danger)',
                          borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                        }}
                      >
                        ✕ Rad etish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <hr style={{ border: 'none', borderTop: '1px solid var(--line)', marginTop: '24px' }} />
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>Foydalanuvchilar</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              placeholder="Ism, telefon yoki email bo'yicha..."
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              className="rounded-lg border px-3.5 py-2.5 text-sm outline-none"
              style={{ background: 'var(--surface-2)', color: 'var(--ink)', borderColor: 'var(--line)', maxWidth: '280px', width: '100%' }}
            />
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[{ value: '', label: 'Barchasi' }, ...ROLLAR].map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRolFiltr(r.value)}
                  style={{
                    border: `1px solid ${rolFiltr === r.value ? 'var(--accent)' : 'var(--line)'}`,
                    background: rolFiltr === r.value ? 'var(--accent-soft)' : 'var(--surface-2)',
                    color: rolFiltr === r.value ? 'var(--accent)' : 'var(--ink-soft)',
                    borderRadius: '8px', padding: '6px 12px', fontSize: '12.5px',
                    fontWeight: rolFiltr === r.value ? 700 : 400,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {r.label || 'Barchasi'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
                  {['Ism', 'Login (telefon/email)', 'Rol', 'Holat', 'Obuna', "Ro'yxatdan o'tgan", ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <FoydalanuvchiQatori key={u.id} u={u} changeRole={changeRole} toggleFaol={toggleFaol}
                    toggleArxiv={toggleArxiv} foydalanuvchiniOchir={foydalanuvchiniOchir} ochirilmoqda={ochirilmoqda === u.id}
                    tahrirId={tahrirId} tahrirniOch={tahrirniOch} setTahrirId={setTahrirId}
                    tahrirLogin={tahrirLogin} setTahrirLogin={setTahrirLogin}
                    tahrirParol={tahrirParol} setTahrirParol={setTahrirParol}
                    tahrirniSaqla={tahrirniSaqla} saqlanmoqda={saqlanmoqda} xato={xato}
                    obunalar={obunalar[u.id] ?? new Set()} obunaBer={obunaBer} obunaniBekorQil={obunaniBekorQil} />
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p style={{ color: 'var(--muted)', padding: '20px' }}>Hech kim topilmadi.</p>}
          </div>
        )}

        {/* Pagination */}
        {!loading && jami > SAHIFADA && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              {sahifa * SAHIFADA + 1}–{Math.min((sahifa + 1) * SAHIFADA, jami)} / {jami} ta
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => sahifaOzgartir(sahifa - 1)}
                disabled={sahifa === 0}
                style={{
                  border: '1px solid var(--line)', background: 'var(--surface)',
                  color: sahifa === 0 ? 'var(--muted)' : 'var(--ink)',
                  borderRadius: '8px', padding: '6px 14px', fontSize: '13px',
                  cursor: sahifa === 0 ? 'not-allowed' : 'pointer', opacity: sahifa === 0 ? 0.5 : 1,
                }}
              >← Oldingi</button>
              {Array.from({ length: Math.ceil(jami / SAHIFADA) }, (_, i) => i)
                .filter((i) => Math.abs(i - sahifa) <= 2)
                .map((i) => (
                  <button key={i} onClick={() => sahifaOzgartir(i)} style={{
                    border: `1px solid ${i === sahifa ? 'var(--accent)' : 'var(--line)'}`,
                    background: i === sahifa ? 'var(--accent-soft)' : 'var(--surface)',
                    color: i === sahifa ? 'var(--accent)' : 'var(--ink)',
                    borderRadius: '8px', padding: '6px 12px', fontSize: '13px',
                    fontWeight: i === sahifa ? 700 : 400, cursor: 'pointer',
                  }}>{i + 1}</button>
                ))}
              <button
                onClick={() => sahifaOzgartir(sahifa + 1)}
                disabled={(sahifa + 1) * SAHIFADA >= jami}
                style={{
                  border: '1px solid var(--line)', background: 'var(--surface)',
                  color: (sahifa + 1) * SAHIFADA >= jami ? 'var(--muted)' : 'var(--ink)',
                  borderRadius: '8px', padding: '6px 14px', fontSize: '13px',
                  cursor: (sahifa + 1) * SAHIFADA >= jami ? 'not-allowed' : 'pointer',
                  opacity: (sahifa + 1) * SAHIFADA >= jami ? 0.5 : 1,
                }}
              >Keyingi →</button>
            </div>
          </div>
        )}


        {!loading && arxivlangan.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setArxivKorsat((v) => !v)} className="btn-animated" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--muted)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              🗄️ Arxivlangan ({arxivlangan.length}) {arxivKorsat ? '▲' : '▼'}
            </button>
            {arxivKorsat && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', overflowX: 'auto', marginTop: '12px' }}>
                <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <tbody>
                    {arxivlangan.map((u) => (
                      <FoydalanuvchiQatori key={u.id} u={u} changeRole={changeRole} toggleFaol={toggleFaol}
                        toggleArxiv={toggleArxiv} foydalanuvchiniOchir={foydalanuvchiniOchir} ochirilmoqda={ochirilmoqda === u.id}
                        tahrirId={tahrirId} tahrirniOch={tahrirniOch} setTahrirId={setTahrirId}
                        tahrirLogin={tahrirLogin} setTahrirLogin={setTahrirLogin}
                        tahrirParol={tahrirParol} setTahrirParol={setTahrirParol}
                        tahrirniSaqla={tahrirniSaqla} saqlanmoqda={saqlanmoqda} xato={xato}
                        obunalar={obunalar[u.id] ?? new Set()} obunaBer={obunaBer} obunaniBekorQil={obunaniBekorQil} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const MUDDATLAR = [
  { oylar: 1, nom: '1 oy' },
  { oylar: 6, nom: '6 oy' },
  { oylar: 12, nom: '12 oy' },
  { oylar: null, nom: 'Muddatsiz' },
]

function FoydalanuvchiQatori({
  u, changeRole, toggleFaol, toggleArxiv, foydalanuvchiniOchir, ochirilmoqda,
  tahrirId, tahrirniOch, setTahrirId, tahrirLogin, setTahrirLogin, tahrirParol, setTahrirParol,
  tahrirniSaqla, saqlanmoqda, xato, obunalar, obunaBer, obunaniBekorQil,
}: {
  u: Profile
  changeRole: (id: string, role: string) => void
  toggleFaol: (u: Profile) => void
  toggleArxiv: (u: Profile) => void
  foydalanuvchiniOchir: (u: Profile) => void
  ochirilmoqda: boolean
  tahrirId: string | null
  tahrirniOch: (u: Profile) => void
  setTahrirId: (id: string | null) => void
  tahrirLogin: string; setTahrirLogin: (v: string) => void
  tahrirParol: string; setTahrirParol: (v: string) => void
  tahrirniSaqla: (u: Profile) => void
  saqlanmoqda: boolean
  xato: string | null
  obunalar: Set<string>
  obunaBer: (studentId: string, bosqich: string, oylar: number | null) => void
  obunaniBekorQil: (studentId: string, bosqich: string) => void
}) {
  const [muddatTanlovOchiq, setMuddatTanlovOchiq] = useState<string | null>(null)

  return (
    <React.Fragment>
      <tr className="row-hover" style={{ borderTop: '1px solid var(--line)' }}>
        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{u.full_name ?? '—'}</td>
        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: 'var(--ink-soft)', fontSize: '12px' }}>
          {u.role === 'patient' ? (u.telefon ?? '—') : (u.email ?? '—')}
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
        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', position: 'relative' }}>
          {u.role !== 'student' ? (
            <span style={{ color: 'var(--muted)' }}>—</span>
          ) : (
            <div style={{ display: 'flex', gap: '4px' }}>
              {BOSQICH_PILLLAR.map((b) => {
                const ega = obunalar.has(b.id)
                return (
                  <div key={b.id} style={{ position: 'relative' }}>
                    <button
                      onClick={() => (ega ? obunaniBekorQil(u.id, b.id) : setMuddatTanlovOchiq(muddatTanlovOchiq === b.id ? null : b.id))}
                      title={`${b.id}${ega ? ' — sotib olingan (bekor qilish uchun bosing)' : ' — sotib olinmagan (muddat tanlash uchun bosing)'}`}
                      className="soft-press"
                      style={{
                        border: ega ? '1px solid var(--good)' : '1px solid var(--line)',
                        background: ega ? 'rgba(5,150,105,.12)' : 'var(--surface-2)',
                        borderRadius: '6px', padding: '3px 7px', fontSize: '12px', cursor: 'pointer',
                        opacity: ega ? 1 : 0.45,
                      }}
                    >
                      {b.emoji}
                    </button>
                    {muddatTanlovOchiq === b.id && (
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 30,
                        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px',
                        boxShadow: 'var(--shadow)', padding: '6px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '110px',
                      }}>
                        {MUDDATLAR.map((m) => (
                          <button
                            key={m.nom}
                            onClick={() => { obunaBer(u.id, b.id, m.oylar); setMuddatTanlovOchiq(null) }}
                            style={{
                              background: 'none', border: 'none', textAlign: 'left', padding: '6px 8px', borderRadius: '6px',
                              fontSize: '12px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer', whiteSpace: 'nowrap',
                            }}
                            className="row-hover"
                          >
                            {m.nom}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </td>
        <td style={{ padding: '12px 16px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{new Date(u.created_at).toLocaleDateString()}</td>
        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
            <button
              onClick={() => toggleArxiv(u)}
              className="soft-press"
              style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                borderRadius: '8px', padding: '5px 11px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {u.arxivlangan ? '↩️ Chiqarish' : '🗄️ Arxivlash'}
            </button>
            <button
              onClick={() => foydalanuvchiniOchir(u)}
              disabled={ochirilmoqda}
              className="soft-press"
              style={{
                background: 'rgba(220,38,38,.1)', color: 'var(--danger)', border: '1px solid var(--danger)',
                borderRadius: '8px', padding: '5px 11px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {ochirilmoqda ? '...' : "🗑️ O'chirish"}
            </button>
          </div>
        </td>
      </tr>
      {tahrirId === u.id && (
        <tr style={{ borderTop: '1px solid var(--line)', background: 'var(--surface-2)' }}>
          <td colSpan={7} style={{ padding: '14px 16px' }}>
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
  )
}
