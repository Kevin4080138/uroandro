'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'
import { KebabMenu } from '@/components/KebabMenu'
import { Pencil, Archive, ArchiveRestore, Trash2 } from 'lucide-react'

// Qator amallari: bitta ⋮ menyu (true) yoki 3 alohida tugma (false).
const KEBAB_AMALLAR = true

type Profile = { id: string; full_name: string; role: string; telefon: string | null; email: string | null; faol: boolean; created_at: string; arxivlangan: boolean; doctor_holati: string | null; mutaxassislik: string | null; ish_joyi: string | null }

const ROLLAR = [
  { value: 'student', label: '🎓 Talaba' },
  { value: 'doctor', label: '👨‍⚕️ Shifokor' },
  { value: 'patient', label: '🧑 Bemor' },
  { value: 'admin', label: '🛠️ Admin' },
]

// Obuna bosqichi — rang + matnli belgi (faqat rang bilan ajratish rang ko'rmaydiganlar
// uchun tushunarsiz edi).
const BOSQICH_PILLLAR: { id: "oson" | "o'rta" | 'qiyin'; label: string; rang: string }[] = [
  { id: 'oson', label: 'Oson', rang: 'var(--good)' },
  { id: "o'rta", label: "O'rta", rang: 'var(--warn)' },
  { id: 'qiyin', label: 'Qiyin', rang: 'var(--danger)' },
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
  const [amalXato, setAmalXato] = useState<string | null>(null)
  const [tanlanganlar, setTanlanganlar] = useState<Set<string>>(new Set())
  const [bulkYuklanmoqda, setBulkYuklanmoqda] = useState(false)
  const [obunalar, setObunalar] = useState<Record<string, Set<string>>>({})
  const [kutayotganlar, setKutayotganlar] = useState<Profile[]>([])
  const [kutayotganlarLoading, setKutayotganlarLoading] = useState(true)

  const load = async (q: string, rol: string, s: number) => {
    setLoading(true)
    let base = supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false })
    // .or() grammatikasini buzadigan belgilarni tozalaymiz (vergul OR ajratuvchisi,
    // qavslar guruhlash, `*` PostgREST wildcard'i) — xom kiritma to'g'ridan-to'g'ri kirmasin.
    const qq = q.trim().replace(/[,()*\\]/g, ' ').trim()
    if (qq) base = base.or(`full_name.ilike.%${qq}%,telefon.ilike.%${qq}%,email.ilike.%${qq}%`)
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
    const res = await fetch('/api/admin/shifokor-tasdiq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: u.id, amal: 'tasdiqlash' }),
    })
    if (res.ok) setKutayotganlar((prev) => prev.filter((x) => x.id !== u.id))
  }

  const radEtish = async (u: Profile) => {
    const res = await fetch('/api/admin/shifokor-tasdiq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: u.id, amal: 'rad_etish' }),
    })
    if (res.ok) setKutayotganlar((prev) => prev.filter((x) => x.id !== u.id))
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

  // Mutatsiyalar server route orqali ketadi: xato bo'lsa optimistik UI qaytariladi.
  const amalYubor = async (payload: Record<string, unknown>): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/foydalanuvchi-amal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setAmalXato(j.error ?? "Amalni bajarib bo'lmadi")
        return false
      }
      return true
    } catch (e: any) {
      setAmalXato(e?.message ?? 'Tarmoq xatosi')
      return false
    }
  }

  const tanlaToggle = (id: string) => setTanlanganlar((prev) => {
    const n = new Set(prev)
    if (n.has(id)) n.delete(id); else n.add(id)
    return n
  })
  const hammaTanla = (ids: string[]) => setTanlanganlar((prev) => {
    const hammaTanlangan = ids.length > 0 && ids.every((i) => prev.has(i))
    const n = new Set(prev)
    if (hammaTanlangan) ids.forEach((i) => n.delete(i))
    else ids.forEach((i) => n.add(i))
    return n
  })

  // Ommaviy arxivlash/chiqarish — tanlangan foydalanuvchilar ustida
  const bulkArxivla = async (arxivlangan: boolean) => {
    const ids = [...tanlanganlar]
    if (ids.length === 0) return
    setBulkYuklanmoqda(true)
    setUsers((prev) => prev.map((u) => (tanlanganlar.has(u.id) ? { ...u, arxivlangan } : u)))
    const natijalar = await Promise.all(ids.map((id) => amalYubor({ amal: 'arxiv_ozgartirish', userId: id, arxivlangan })))
    setBulkYuklanmoqda(false)
    setTanlanganlar(new Set())
    // Biror amal muvaffaqiyatsiz bo'lsa — ro'yxatni qayta yuklab, holatni bazaga moslaymiz
    if (natijalar.some((ok) => !ok)) load(qidiruv, rolFiltr, sahifa)
  }

  const obunaniBekorQil = async (studentId: string, bosqich: string) => {
    const borMi = obunalar[studentId]?.has(bosqich) ?? false
    setObunalar((prev) => {
      const yangi = { ...prev, [studentId]: new Set(prev[studentId] ?? []) }
      yangi[studentId].delete(bosqich)
      return yangi
    })
    const ok = await amalYubor({ amal: 'obuna_bekor', userId: studentId, bosqich })
    if (!ok && borMi) setObunalar((prev) => {
      const yangi = { ...prev, [studentId]: new Set(prev[studentId] ?? []) }
      yangi[studentId].add(bosqich)
      return yangi
    })
  }

  const obunaBer = async (studentId: string, bosqich: string, oylar: number | null) => {
    const borMi = obunalar[studentId]?.has(bosqich) ?? false
    setObunalar((prev) => {
      const yangi = { ...prev, [studentId]: new Set(prev[studentId] ?? []) }
      yangi[studentId].add(bosqich)
      return yangi
    })
    const ok = await amalYubor({ amal: 'obuna_berish', userId: studentId, bosqich, oylar })
    if (!ok && !borMi) setObunalar((prev) => {
      const yangi = { ...prev, [studentId]: new Set(prev[studentId] ?? []) }
      yangi[studentId].delete(bosqich)
      return yangi
    })
  }

  const changeRole = async (id: string, role: string) => {
    const eski = users.find((u) => u.id === id)?.role
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
    const ok = await amalYubor({ amal: 'rol_ozgartirish', userId: id, role })
    if (!ok && eski !== undefined) setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: eski } : u)))
  }

  const toggleFaol = async (u: Profile) => {
    const faol = !u.faol
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, faol } : x)))
    const ok = await amalYubor({ amal: 'faol_ozgartirish', userId: u.id, faol })
    if (!ok) setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, faol: u.faol } : x)))
  }

  const toggleArxiv = async (u: Profile) => {
    const arxivlangan = !u.arxivlangan
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, arxivlangan } : x)))
    const ok = await amalYubor({ amal: 'arxiv_ozgartirish', userId: u.id, arxivlangan })
    if (!ok) setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, arxivlangan: u.arxivlangan } : x)))
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
    try {
      const body: any = { userId: u.id }
      if (u.role === 'patient') body.telefon = tahrirLogin.trim()
      else body.email = tahrirLogin.trim()
      if (tahrirParol.trim()) body.parol = tahrirParol.trim()

      const res = await fetch('/api/admin/foydalanuvchi', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) { setXato(json.error ?? 'Xatolik yuz berdi'); return }
      setTahrirId(null)
      load(qidiruv, rolFiltr, sahifa)
    } catch (e: any) {
      setXato(e?.message ?? 'Tarmoq xatosi')
    } finally {
      setSaqlanmoqda(false)
    }
  }

  const filtered = users.filter((u) => !u.arxivlangan)
  const arxivlangan = users.filter((u) => u.arxivlangan)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />

      {amalXato && (
        <div role="alert" style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 100,
          background: 'var(--danger)', color: 'white', borderRadius: '12px', padding: '12px 18px',
          fontSize: '13px', fontWeight: 600, boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '90vw',
        }}>
          <span>{amalXato}</span>
          <button onClick={() => setAmalXato(null)} style={{ background: 'rgba(255,255,255,.25)', border: 'none', color: 'white', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Yopish
          </button>
        </div>
      )}

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
              <UrosferaLoaderMini />
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
                          background: 'var(--good)', color: 'white', border: 'none', borderRadius: '8px',
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

        {tanlanganlar.size > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px', padding: '10px 14px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{tanlanganlar.size} ta tanlandi</span>
            <button onClick={() => bulkArxivla(true)} disabled={bulkYuklanmoqda} className="soft-press" style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
              {bulkYuklanmoqda ? '...' : '🗄️ Arxivlash'}
            </button>
            <button onClick={() => bulkArxivla(false)} disabled={bulkYuklanmoqda} className="soft-press" style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)', borderRadius: '8px', padding: '6px 12px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
              {bulkYuklanmoqda ? '...' : '↩️ Chiqarish'}
            </button>
            <button onClick={() => setTanlanganlar(new Set())} style={{ background: 'none', color: 'var(--muted)', border: 'none', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}>
              Tozalash
            </button>
          </div>
        )}

        {loading ? (
          <UrosferaLoaderMini />
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', width: '36px' }}>
                    <input type="checkbox" aria-label="Barchasini tanlash"
                      checked={filtered.length > 0 && filtered.every((u) => tanlanganlar.has(u.id))}
                      onChange={() => hammaTanla(filtered.map((u) => u.id))} />
                  </th>
                  {['Ism', 'Login (telefon/email)', 'Rol', 'Holat', 'Obuna', "Ro'yxatdan o'tgan", ''].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <FoydalanuvchiQatori key={u.id} u={u} changeRole={changeRole} toggleFaol={toggleFaol}
                    tanlangan={tanlanganlar.has(u.id)} onTanla={tanlaToggle}
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
                        tanlangan={tanlanganlar.has(u.id)} onTanla={tanlaToggle}
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
  tanlangan, onTanla,
  tahrirId, tahrirniOch, setTahrirId, tahrirLogin, setTahrirLogin, tahrirParol, setTahrirParol,
  tahrirniSaqla, saqlanmoqda, xato, obunalar, obunaBer, obunaniBekorQil,
}: {
  u: Profile
  changeRole: (id: string, role: string) => void
  toggleFaol: (u: Profile) => void
  tanlangan: boolean
  onTanla: (id: string) => void
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
  const pillRef = useRef<HTMLDivElement>(null)

  // Muddat-tanlash popover'i tashqariga bosilganda yopiladi
  useEffect(() => {
    if (!muddatTanlovOchiq) return
    const h = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) setMuddatTanlovOchiq(null)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [muddatTanlovOchiq])

  return (
    <React.Fragment>
      <tr className="row-hover" style={{ borderTop: '1px solid var(--line)' }}>
        <td style={{ padding: '12px 16px', width: '36px' }}>
          <input type="checkbox" checked={tanlangan} onChange={() => onTanla(u.id)} aria-label={`${u.full_name ?? 'Foydalanuvchi'} — tanlash`} />
        </td>
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
              background: u.faol ? 'color-mix(in srgb, var(--good) 15%, transparent)' : 'color-mix(in srgb, var(--danger) 15%, transparent)',
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
            <div ref={pillRef} style={{ display: 'flex', gap: '4px' }}>
              {BOSQICH_PILLLAR.map((b) => {
                const ega = obunalar.has(b.id)
                return (
                  <div key={b.id} style={{ position: 'relative' }}>
                    <button
                      onClick={() => (ega ? obunaniBekorQil(u.id, b.id) : setMuddatTanlovOchiq(muddatTanlovOchiq === b.id ? null : b.id))}
                      title={`${b.label}${ega ? ' — sotib olingan (bekor qilish uchun bosing)' : ' — sotib olinmagan (muddat tanlash uchun bosing)'}`}
                      aria-label={`${b.label} bosqich — ${ega ? 'obuna bor, bekor qilish' : "obuna yo'q, berish"}`}
                      aria-pressed={ega}
                      className="soft-press"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap',
                        border: ega ? `1px solid ${b.rang}` : '1px solid var(--line)',
                        background: ega ? `color-mix(in srgb, ${b.rang} 12%, transparent)` : 'var(--surface-2)',
                        color: ega ? b.rang : 'var(--muted)',
                        borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                        opacity: ega ? 1 : 0.7,
                      }}
                    >
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: ega ? b.rang : 'var(--muted)', flexShrink: 0 }} />
                      {b.label}
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
          {KEBAB_AMALLAR ? (
            <KebabMenu
              ariaLabel={`${u.full_name ?? 'Foydalanuvchi'} — amallar`}
              amallar={[
                {
                  label: tahrirId === u.id ? 'Tahrirni yopish' : 'Login/parol',
                  icon: <Pencil size={15} strokeWidth={2} />,
                  onClick: () => (tahrirId === u.id ? setTahrirId(null) : tahrirniOch(u)),
                },
                {
                  label: u.arxivlangan ? 'Arxivdan chiqarish' : 'Arxivlash',
                  icon: u.arxivlangan ? <ArchiveRestore size={15} strokeWidth={2} /> : <Archive size={15} strokeWidth={2} />,
                  onClick: () => toggleArxiv(u),
                },
                {
                  label: ochirilmoqda ? "O'chirilmoqda..." : "O'chirish",
                  icon: <Trash2 size={15} strokeWidth={2} />,
                  onClick: () => foydalanuvchiniOchir(u),
                  danger: true,
                  disabled: ochirilmoqda,
                },
              ]}
            />
          ) : (
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
                background: 'color-mix(in srgb, var(--danger) 10%, transparent)', color: 'var(--danger)', border: '1px solid var(--danger)',
                borderRadius: '8px', padding: '5px 11px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {ochirilmoqda ? '...' : "🗑️ O'chirish"}
            </button>
          </div>
          )}
        </td>
      </tr>
      {tahrirId === u.id && (
        <tr style={{ borderTop: '1px solid var(--line)', background: 'var(--surface-2)' }}>
          <td colSpan={8} style={{ padding: '14px 16px' }}>
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
