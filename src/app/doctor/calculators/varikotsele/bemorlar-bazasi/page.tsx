'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { T, card, input, label, btnPrimary, btnGhost } from '../_theme'
import { USULLAR, USUL_IDLARI, type UsulId } from '@/lib/varikotseleUsullari'

type Yozuv = {
  id: string
  pid: string | null
  age: number | null
  method: UsulId
  grade: number | null
  followup: number
  recur: boolean
  hydro: boolean
  semen: boolean
  preg: boolean
  notes: string | null
  created_at: string
}

const emptyForm = {
  pid: '', age: '', method: 'micro' as UsulId, grade: '3', followup: '6',
  recur: false, hydro: false, semen: false, preg: false, notes: '',
}

function gradeLabel(g: number | null) {
  if (g === 0) return 'Sub'
  return g ? String(['', 'I', 'II', 'III'][g] ?? g) : '—'
}

export default function BemorlarBazasiPage() {
  const supabase = createClient()
  const [yozuvlar, setYozuvlar] = useState<Yozuv[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('varikotsele_tadqiqot').select('*').order('created_at', { ascending: true })
    setYozuvlar((data as Yozuv[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const set = (key: string) => (e: any) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const toggle = (key: 'recur' | 'hydro' | 'semen' | 'preg') => setForm((f) => ({ ...f, [key]: !f[key] }))

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSaving(true)
    await supabase.from('varikotsele_tadqiqot').insert({
      doctor_id: user.id,
      pid: form.pid || `P-${String(yozuvlar.length + 1).padStart(3, '0')}`,
      age: Number(form.age) || null,
      method: form.method,
      grade: Number(form.grade),
      followup: Number(form.followup) || 0,
      recur: form.recur, hydro: form.hydro, semen: form.semen, preg: form.preg,
      notes: form.notes,
    })
    setSaving(false)
    setForm(emptyForm)
    setShowForm(false)
    load()
  }

  const del = async (id: string) => {
    if (!confirm("Bu yozuvni o'chirishni tasdiqlaysizmi?")) return
    await supabase.from('varikotsele_tadqiqot').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>
        Ilmiy tadqiqot moduli
      </div>
      <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.025em', marginBottom: 8 }}>Bemorlar bazasi</h1>
      <p style={{ color: T.inkSoft, fontSize: 15.5, maxWidth: '62ch' }}>
        Bajarilgan operatsiyalar va natijalarni ro&apos;yxatga oling. Bu ma&apos;lumotlar statistik tahlil moduliga uzatiladi.
      </p>

      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button style={btnPrimary} onClick={() => setShowForm(!showForm)}>{showForm ? 'Bekor qilish' : '+ Yangi bemor qo\'shish'}</button>
      </div>

      {showForm && (
        <div style={{ ...card, marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={label}>Ism / ID <span style={{ fontWeight: 400 }}>(masalan, B-001)</span></label>
              <input style={input} value={form.pid} onChange={set('pid')} placeholder="B-001" />
            </div>
            <div>
              <label style={label}>Yoshi</label>
              <input type="number" style={input} value={form.age} onChange={set('age')} />
            </div>
            <div>
              <label style={label}>Qo&apos;llanilgan usul</label>
              <select style={input} value={form.method} onChange={set('method')}>
                {USUL_IDLARI.map((id) => <option key={id} value={id}>{USULLAR[id].nom}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Darajasi</label>
              <select style={input} value={form.grade} onChange={set('grade')}>
                <option value="1">I</option><option value="2">II</option><option value="3">III</option><option value="0">Subklinik</option>
              </select>
            </div>
            <div>
              <label style={label}>Kuzatuv (oy)</label>
              <input type="number" style={input} value={form.followup} onChange={set('followup')} />
            </div>
          </div>

          <div style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: T.muted, marginTop: 18, marginBottom: 8 }}>Natijalar</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
            {([['recur', 'Retsidiv'], ['hydro', 'Gidrotsele'], ['semen', 'Spermogramma yaxshilandi'], ['preg', 'Homiladorlik']] as const).map(([k, l]) => (
              <div key={k}>
                <label style={label}>{l}</label>
                <div style={{ display: 'flex', border: '1.5px solid #C5D4D5', borderRadius: 9, overflow: 'hidden' }}>
                  <button onClick={() => setForm((f) => ({ ...f, [k]: false }))} style={{ flex: 1, border: 'none', padding: '9px 6px', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: !form[k] ? T.teal : T.surface, color: !form[k] ? '#fff' : T.muted }}>Yo&apos;q</button>
                  <button onClick={() => setForm((f) => ({ ...f, [k]: true }))} style={{ flex: 1, border: 'none', padding: '9px 6px', fontSize: 13, fontWeight: 600, cursor: 'pointer', background: form[k] ? T.teal : T.surface, color: form[k] ? '#fff' : T.muted }}>Ha</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={label}>Izohlar</label>
            <textarea style={{ ...input, minHeight: 60 }} value={form.notes} onChange={set('notes')} />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button style={btnPrimary} onClick={save} disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
            <button style={btnGhost} onClick={() => setShowForm(false)}>Bekor qilish</button>
          </div>
        </div>
      )}

      <div style={{ fontSize: 18, fontWeight: 700, margin: '34px 0 14px' }}>
        Ro&apos;yxatdagi bemorlar <span style={{ fontFamily: 'monospace', fontSize: 13, color: T.muted, fontWeight: 400 }}>({yozuvlar.length})</span>
      </div>

      {loading ? (
        <p style={{ color: T.muted }}>Yuklanmoqda...</p>
      ) : yozuvlar.length === 0 ? (
        <div style={card}><p style={{ color: T.muted, textAlign: 'center', margin: 0 }}>Baza hozircha bo&apos;sh.</p></div>
      ) : (
        <div style={{ overflowX: 'auto', border: `1px solid ${T.line}`, borderRadius: 14, background: T.surface }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13.5, minWidth: 760 }}>
            <thead>
              <tr>
                {['ID', 'Yosh', 'Usul', 'Daraja', 'Kuzatuv', 'Retsidiv', 'Gidrotsele', 'Homiladorlik', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', background: T.surface2, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: T.muted, borderBottom: `1px solid ${T.line}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yozuvlar.map((y) => (
                <tr key={y.id}>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}`, fontFamily: 'monospace' }}>{y.pid ?? '—'}</td>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}`, fontFamily: 'monospace' }}>{y.age ?? '—'}</td>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}` }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: `${USULLAR[y.method]?.color ?? T.muted}1A`, color: USULLAR[y.method]?.color ?? T.muted }}>
                      {USULLAR[y.method]?.nom ?? y.method}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}`, fontFamily: 'monospace' }}>{gradeLabel(y.grade)}</td>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}`, fontFamily: 'monospace' }}>{y.followup} oy</td>
                  {([y.recur, y.hydro, y.preg] as const).map((v, i) => (
                    <td key={i} style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}` }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: v ? '#FBEAE4' : '#E3F2E9', color: v ? '#B4520C' : T.good }}>{v ? 'Ha' : "Yo'q"}</span>
                    </td>
                  ))}
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}` }}>
                    <button onClick={() => del(y.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.muted, fontSize: 16 }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
