'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/AppShell'
import { createClient } from '@/lib/supabase'

const MAVZULAR = [
  { id: 'varikotsele', nom: '🔵 Varikotsele' },
  { id: 'bph', nom: '🟡 BPH' },
  { id: 'prostatit', nom: '🟠 Prostatit' },
  { id: 'urolitiaz', nom: '🟣 Urolitiaz' },
]

const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px 22px',
}

function StatCard({ label, qiymat, rang }: { label: string; qiymat: string | number; rang: string }) {
  return (
    <div style={{ ...card, borderLeft: `4px solid ${rang}` }}>
      <div style={{ fontSize: '28px', fontWeight: 800, color: rang }}>{qiymat}</div>
      <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

// Oddiy gorizontal bar chart (CSS bilan, kutubxonasiz)
function BarChart({ data, rang }: { data: { nom: string; son: number }[]; rang: string }) {
  const max = Math.max(...data.map((d) => d.son), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map((d) => (
        <div key={d.nom} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '160px', fontSize: '12.5px', color: 'var(--ink-soft)', textAlign: 'right', flexShrink: 0 }}>{d.nom}</div>
          <div style={{ flex: 1, background: 'var(--surface-2)', borderRadius: '6px', height: '22px', overflow: 'hidden' }}>
            <div style={{
              width: `${(d.son / max) * 100}%`, height: '100%', background: rang,
              borderRadius: '6px', transition: 'width .4s', display: 'flex', alignItems: 'center', paddingLeft: '8px',
            }}>
              {d.son > 0 && <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>{d.son}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Donut chart (SVG bilan)
function DonutChart({ data, rang }: { data: { nom: string; son: number }[]; rang: string[] }) {
  const jami = data.reduce((s, d) => s + d.son, 0)
  if (jami === 0) return <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Ma'lumot yo'q</p>
  let angle = -90
  const r = 60, cx = 80, cy = 80, stroke = 28
  const slices = data.map((d, i) => {
    const pct = d.son / jami
    const a1 = angle
    angle += pct * 360
    return { ...d, a1, a2: angle, color: rang[i % rang.length], pct }
  })
  const arc = (a1: number, a2: number) => {
    const toR = (a: number) => (a * Math.PI) / 180
    const x1 = cx + r * Math.cos(toR(a1)), y1 = cy + r * Math.sin(toR(a1))
    const x2 = cx + r * Math.cos(toR(a2)), y2 = cy + r * Math.sin(toR(a2))
    const large = a2 - a1 > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }
  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {slices.map((s, i) => s.son > 0 && (
          <path key={i} d={arc(s.a1, s.a2)} fill="none" stroke={s.color} strokeWidth={stroke} />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--ink)">{jami}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="var(--muted)">jami</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--ink-soft)' }}>{s.nom}</span>
            <span style={{ fontWeight: 700 }}>{s.son}</span>
            <span style={{ color: 'var(--muted)', fontSize: '11px' }}>({Math.round(s.pct * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Spermogramma oldin vs keyin jadvali
function SpermJadvali({ juftlar }: { juftlar: { fio: string; konts_oldin: any; konts_keyin: any; harakat_oldin: any; harakat_keyin: any }[] }) {
  if (juftlar.length === 0) return <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Natija kiritilmagan</p>
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)' }}>
            {['FIO', 'Konts. oldin', 'Konts. keyin', 'Δ', 'Harakat oldin', 'Harakat keyin', 'Δ'].map((h) => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {juftlar.map((j, i) => {
            const dk = j.konts_keyin && j.konts_oldin ? Number(j.konts_keyin) - Number(j.konts_oldin) : null
            const dh = j.harakat_keyin && j.harakat_oldin ? Number(j.harakat_keyin) - Number(j.harakat_oldin) : null
            return (
              <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>{j.fio}</td>
                <td style={{ padding: '8px 12px' }}>{j.konts_oldin ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>{j.konts_keyin ?? '—'}</td>
                <td style={{ padding: '8px 12px', color: dk === null ? 'var(--muted)' : dk >= 0 ? 'var(--good)' : 'var(--danger)', fontWeight: 700 }}>
                  {dk === null ? '—' : `${dk >= 0 ? '+' : ''}${dk.toFixed(1)}`}
                </td>
                <td style={{ padding: '8px 12px' }}>{j.harakat_oldin ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>{j.harakat_keyin ?? '—'}</td>
                <td style={{ padding: '8px 12px', color: dh === null ? 'var(--muted)' : dh >= 0 ? 'var(--good)' : 'var(--danger)', fontWeight: 700 }}>
                  {dh === null ? '—' : `${dh >= 0 ? '+' : ''}${dh.toFixed(1)}%`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function StatistikaPage() {
  const supabase = createClient()
  const [mavzu, setMavzu] = useState('varikotsele')
  const [loading, setLoading] = useState(true)
  const [eksportLoading, setEksportLoading] = useState(false)
  const [bemorlar, setBemorlar] = useState<any[]>([])
  const [natijalar, setNatijalar] = useState<any[]>([])
  const [tashriflar, setTashriflar] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      const [{ data: b }, { data: n }, { data: t }] = await Promise.all([
        supabase.from('bemorlar').select('id, fio, tugilgan_sana').eq('created_by', user!.id),
        supabase.from('bemor_natijalar').select('bemor_id, malumot').eq('doctor_id', user!.id).eq('mavzu', mavzu),
        supabase.from('tashriflar').select('bemor_id, daraja, tomon, sperm_konts, sperm_harakat, sperm_morf, testosteron').eq('doctor_id', user!.id).order('sana', { ascending: false }),
      ])
      setBemorlar(b ?? [])
      setNatijalar(n ?? [])
      setTashriflar(t ?? [])
      setLoading(false)
    }
    load()
  }, [mavzu])

  const eksport = async () => {
    setEksportLoading(true)
    const res = await fetch(`/api/doctor/statistika-eksport?mavzu=${mavzu}`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${mavzu}-statistika.xlsx`; a.click()
    URL.revokeObjectURL(url)
    setEksportLoading(false)
  }

  // So'nggi tashrifni topamiz (bemor bo'yicha)
  const tashrifMap: Record<string, any> = {}
  for (const t of tashriflar) if (!tashrifMap[t.bemor_id]) tashrifMap[t.bemor_id] = t
  const natijalarMap: Record<string, any> = {}
  for (const n of natijalar) natijalarMap[n.bemor_id] = n.malumot

  // Varikotsele statistikasi
  const v_tashriflar = bemorlar.map((b) => ({ ...tashrifMap[b.id], ...b })).filter((b) => tashrifMap[b.id])
  const v_natijalar = bemorlar.map((b) => ({ fio: b.fio, ...tashrifMap[b.id], ...natijalarMap[b.id] })).filter((b) => natijalarMap[b.id])

  const darajalar = ['I', 'II', 'III'].map((d) => ({ nom: `${d} daraja`, son: v_tashriflar.filter((t) => t.daraja === d).length }))
  const tomonlar = ['chap', "o'ng", 'ikki tomonlama'].map((t) => ({ nom: t, son: v_tashriflar.filter((x) => x.tomon === t).length }))
  const operatsiyalar = Array.from(new Set(v_natijalar.map((n) => n.operatsiya_turi).filter(Boolean))).map((op) => ({
    nom: String(op).length > 30 ? String(op).slice(0, 30) + '…' : String(op),
    son: v_natijalar.filter((n) => n.operatsiya_turi === op).length,
  }))
  const natijalarBo = ['Yaxshilandi', "O'zgarmadi", 'Yomonlashdi'].map((n) => ({
    nom: n, son: v_natijalar.filter((x) => x.umumiy_natija === n).length,
  }))
  const spermJuftlar = v_natijalar.map((n) => ({
    fio: n.fio, konts_oldin: n.sperm_konts, konts_keyin: n.sperm_konts_keyin,
    harakat_oldin: n.sperm_harakat, harakat_keyin: n.sperm_harakat_keyin,
  })).filter((j) => j.konts_oldin || j.konts_keyin)

  const natijalilar = v_natijalar.length
  const retsidiv = v_natijalar.filter((n) => n.retsidiv === 'Bor').length

  const DONUT_RANGLAR = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <AppShell title="Statistika">
      <div className="fade-in px-4 py-6 sm:px-8 sm:py-8">

        {/* Mavzu + Eksport */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {MAVZULAR.map((m) => (
              <button key={m.id} onClick={() => setMavzu(m.id)} className="btn-animated" style={{
                border: 'none', borderRadius: '999px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                background: mavzu === m.id ? 'var(--accent)' : 'var(--surface-2)',
                color: mavzu === m.id ? 'white' : 'var(--ink-soft)',
              }}>{m.nom}</button>
            ))}
          </div>
          <button onClick={eksport} disabled={eksportLoading} className="btn-animated soft-press" style={{
            background: 'var(--good)', color: 'white', border: 'none', borderRadius: '10px',
            padding: '10px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
          }}>
            {eksportLoading ? 'Yuklanmoqda...' : '⬇️ Excel eksport'}
          </button>
        </div>

        {loading ? <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p> : (
          <>
            {/* Umumiy kartalar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <StatCard label="Jami bemorlar" qiymat={bemorlar.length} rang="var(--accent)" />
              <StatCard label="Tashriflar bor" qiymat={v_tashriflar.length} rang="#10b981" />
              <StatCard label="Natija kiritilgan" qiymat={natijalilar} rang="#f59e0b" />
              {mavzu === 'varikotsele' && <StatCard label="Retsidiv" qiymat={retsidiv} rang={retsidiv > 0 ? 'var(--danger)' : 'var(--good)'} />}
            </div>

            {mavzu === 'varikotsele' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>

                <div style={card}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>📊 Daraja taqsimoti</h3>
                  <DonutChart data={darajalar} rang={DONUT_RANGLAR} />
                </div>

                <div style={card}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>↔️ Tomon</h3>
                  <DonutChart data={tomonlar} rang={['#3b82f6', '#10b981', '#f59e0b']} />
                </div>

                <div style={card}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>💊 Operatsiya turlari</h3>
                  {operatsiyalar.length > 0
                    ? <BarChart data={operatsiyalar} rang="#6366f1" />
                    : <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Natija kiritilmagan</p>}
                </div>

                <div style={card}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>✅ Umumiy natija</h3>
                  <DonutChart data={natijalarBo} rang={['#10b981', '#f59e0b', '#ef4444']} />
                </div>

                <div style={{ ...card, gridColumn: '1 / -1' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>🔬 Spermogramma: oldin vs keyin</h3>
                  <SpermJadvali juftlar={spermJuftlar} />
                </div>

              </div>
            )}

            {mavzu !== 'varikotsele' && (
              <div style={card}>
                <p style={{ color: 'var(--muted)', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
                  Bu mavzu uchun statistika tayyorlanmoqda. Excel eksport orqali ma'lumotlarni olishingiz mumkin.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
