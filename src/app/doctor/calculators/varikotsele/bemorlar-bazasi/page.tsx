'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { T, card } from '../_theme'
import { USULLAR, type UsulId } from '@/lib/varikotseleUsullari'

type Yozuv = {
  id: string
  fio: string | null
  telefon: string | null
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

function gradeLabel(g: number | null) {
  if (g === 0) return 'Sub'
  return g ? String(['', 'I', 'II', 'III'][g] ?? g) : '—'
}

function eksportQil(yozuvlar: Yozuv[]) {
  const sarlavhalar = ['F.I.O.', 'Telefon', 'Yosh', 'Usul', 'Daraja', "Kuzatuv (oy)", 'Retsidiv', 'Gidrotsele', 'Spermogramma', 'Homiladorlik', 'Izoh', 'Sana']
  const qatorlar = yozuvlar.map((y) => [
    y.fio ?? y.pid ?? '', y.telefon ?? '', y.age ?? '', USULLAR[y.method]?.nom ?? y.method, gradeLabel(y.grade),
    y.followup, y.recur ? 'Ha' : "Yo'q", y.hydro ? 'Ha' : "Yo'q", y.semen ? 'Ha' : "Yo'q", y.preg ? 'Ha' : "Yo'q",
    y.notes ?? '', new Date(y.created_at).toLocaleDateString(),
  ])
  const csv = [sarlavhalar, ...qatorlar]
    .map((qator) => qator.map((qiymat) => `"${String(qiymat).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `varikotsele_bemorlar_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function BemorlarBazasiPage() {
  const supabase = createClient()
  const router = useRouter()
  const [yozuvlar, setYozuvlar] = useState<Yozuv[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase.from('varikotsele_tadqiqot').select('*').order('created_at', { ascending: false })
    setYozuvlar((data as Yozuv[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const yangila = async (id: string, patch: Partial<Yozuv>) => {
    setYozuvlar((prev) => prev.map((y) => (y.id === id ? { ...y, ...patch } : y)))
    await supabase.from('varikotsele_tadqiqot').update(patch).eq('id', id)
  }

  const del = async (id: string) => {
    if (!confirm("Bu yozuvni o'chirishni tasdiqlaysizmi?")) return
    await supabase.from('varikotsele_tadqiqot').delete().eq('id', id)
    load()
  }

  const toggleBtn = (active: boolean) => ({
    border: 'none', padding: '4px 9px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', borderRadius: 6,
    background: active ? '#FBEAE4' : '#E3F2E9', color: active ? '#B4520C' : T.good,
  })

  return (
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>
        Ilmiy tadqiqot moduli
      </div>
      <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.025em', marginBottom: 8 }}>Bemorlar bazasi</h1>
      <p style={{ color: T.inkSoft, fontSize: 15.5, maxWidth: '62ch' }}>
        Bu ro&apos;yxat <strong>Klinik qaror</strong> bo&apos;limida saqlangan bemorlardan avtomatik to&apos;ldiriladi. Operatsiyadan keyingi
        kuzatuv natijalarini (retsidiv, gidrotsele va h.k.) shu yerda yangilab borishingiz mumkin.
      </p>

      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button onClick={() => router.push('/doctor/calculators/varikotsele/klinik-qaror')} style={{
          background: T.deep, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px',
          fontSize: 14.5, fontWeight: 600, cursor: 'pointer',
        }}>
          + Yangi bemor (Klinik qaror)
        </button>
        <button onClick={() => eksportQil(yozuvlar)} disabled={yozuvlar.length === 0} style={{
          background: T.surface2, color: T.inkSoft, border: 'none', borderRadius: 10, padding: '11px 20px',
          fontSize: 14.5, fontWeight: 600, cursor: yozuvlar.length === 0 ? 'not-allowed' : 'pointer', opacity: yozuvlar.length === 0 ? 0.6 : 1,
        }}>
          ⬇️ Excelga (CSV) yuklab olish
        </button>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, margin: '34px 0 14px' }}>
        Ro&apos;yxatdagi bemorlar <span style={{ fontFamily: 'monospace', fontSize: 13, color: T.muted, fontWeight: 400 }}>({yozuvlar.length})</span>
      </div>

      {loading ? (
        <p style={{ color: T.muted }}>Yuklanmoqda...</p>
      ) : yozuvlar.length === 0 ? (
        <div style={card}>
          <p style={{ color: T.muted, textAlign: 'center', margin: 0 }}>
            Baza hozircha bo&apos;sh. Bemorni <strong>Klinik qaror</strong> bo&apos;limi orqali qo&apos;shing.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: `1px solid ${T.line}`, borderRadius: 14, background: T.surface }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13.5, minWidth: 880 }}>
            <thead>
              <tr>
                {['F.I.O.', 'Yosh', 'Usul', 'Daraja', 'Kuzatuv (oy)', 'Retsidiv', 'Gidrotsele', 'Spermogramma', 'Homiladorlik', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 14px', background: T.surface2, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: T.muted, borderBottom: `1px solid ${T.line}`, whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {yozuvlar.map((y) => (
                <tr key={y.id}>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}` }}>
                    <div>{y.fio ?? y.pid ?? '—'}</div>
                    {y.telefon && <div style={{ fontFamily: 'monospace', fontSize: 11, color: T.muted }}>{y.telefon}</div>}
                  </td>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}`, fontFamily: 'monospace' }}>{y.age ?? '—'}</td>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}` }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: `${USULLAR[y.method]?.color ?? T.muted}1A`, color: USULLAR[y.method]?.color ?? T.muted }}>
                      {USULLAR[y.method]?.nom ?? y.method}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}`, fontFamily: 'monospace' }}>{gradeLabel(y.grade)}</td>
                  <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}` }}>
                    <input
                      type="number"
                      defaultValue={y.followup}
                      onBlur={(e) => yangila(y.id, { followup: Number(e.target.value) || 0 })}
                      style={{ width: 56, fontFamily: 'monospace', border: `1px solid ${T.line}`, borderRadius: 6, padding: '4px 6px' }}
                    />
                  </td>
                  {(['recur', 'hydro', 'semen', 'preg'] as const).map((key) => (
                    <td key={key} style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}` }}>
                      <button style={toggleBtn(y[key])} onClick={() => yangila(y.id, { [key]: !y[key] } as Partial<Yozuv>)}>
                        {y[key] ? 'Ha' : "Yo'q"}
                      </button>
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
