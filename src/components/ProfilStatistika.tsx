'use client'

// Talaba profilidagi boy statistika bloki (Lordbank referens) — gauge (o'zlashtirish),
// haftalik faollik bar-chart, bosqich breakdown. Desktopda 2 ustun, telefonda 1 ustun.
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { DARSLAR, darsTop, type Bosqich } from '@/lib/talim/darslar'
import { darsTugadimi } from '@/lib/talim/useDarsProgress'
import { Flame, ClipboardCheck, TrendingUp } from 'lucide-react'

const KUN = ['DU', 'SE', 'CH', 'PA', 'JU', 'SH', 'YA']
const BOSQICH_MA: { id: Bosqich; nom: string; rang: string }[] = [
  { id: 'oson', nom: 'Oson', rang: '#16a34a' },
  { id: "o'rta", nom: "O'rta", rang: '#d97706' },
  { id: 'qiyin', nom: 'Qiyin', rang: '#dc2626' },
]

const karta: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px',
}
const sarlavha: React.CSSProperties = {
  fontSize: '13px', fontWeight: 800, margin: '0 0 14px',
}

export function ProfilStatistika({ studentId }: { studentId: string }) {
  const supabase = createClient()
  const [qadam, setQadam] = useState<Map<string, Set<string>>>(new Map())
  const [natijalar, setNatijalar] = useState<{ foiz: number; created_at: string }[]>([])

  useEffect(() => {
    if (!studentId) return
    ;(async () => {
      const [{ data: q }, { data: n }] = await Promise.all([
        supabase.from('dars_qadam_progress').select('dars_slug, qadam').eq('student_id', studentId),
        supabase.from('talim_natijalari').select('foiz, created_at').eq('student_id', studentId),
      ])
      const m = new Map<string, Set<string>>()
      for (const r of (q ?? []) as { dars_slug: string; qadam: string }[]) {
        const s = m.get(r.dars_slug) ?? new Set<string>()
        s.add(r.qadam); m.set(r.dars_slug, s)
      }
      setQadam(m)
      setNatijalar((n as { foiz: number; created_at: string }[]) ?? [])
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId])

  // Bosqich breakdown
  const bosqichProgress = BOSQICH_MA.map((b) => {
    const jami = DARSLAR.filter((d) => d.bosqich === b.id).length
    let tugadi = 0
    qadam.forEach((s, slug) => { if (darsTop(slug)?.bosqich === b.id && darsTugadimi(s)) tugadi++ })
    return { ...b, tugadi, jami }
  })
  const jamiTugadi = bosqichProgress.reduce((s, b) => s + b.tugadi, 0)
  const jamiDarslar = DARSLAR.length || 1
  const foiz = Math.round((jamiTugadi / jamiDarslar) * 100)

  // Haftalik faollik (joriy hafta test soni)
  const bugun = new Date()
  const kunIdx = (bugun.getDay() + 6) % 7
  const dushanba = new Date(bugun); dushanba.setDate(bugun.getDate() - kunIdx); dushanba.setHours(0, 0, 0, 0)
  const sonlar = new Array(7).fill(0)
  for (const r of natijalar) {
    const dt = new Date(r.created_at); dt.setHours(0, 0, 0, 0)
    const i = Math.round((dt.getTime() - dushanba.getTime()) / 86400000)
    if (i >= 0 && i < 7) sonlar[i]++
  }
  const maxW = Math.max(1, ...sonlar)

  const gaugeData = [{ v: Math.max(foiz, 0.01) }, { v: Math.max(100 - foiz, 0.01) }]

  return (
    <>

      {/* O'zlashtirish gauge */}
      <div style={karta}>
        <h3 style={sarlavha}>O&apos;zlashtirish</h3>
        <div style={{ position: 'relative', width: '100%', height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={gaugeData} cx="50%" cy="82%" startAngle={180} endAngle={0} innerRadius={62} outerRadius={88} dataKey="v" stroke="none">
                <Cell fill="#2563EB" />
                <Cell fill="rgba(130,130,130,.2)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 6, textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: 'var(--accent)' }}>{foiz}%</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{jamiTugadi} / {jamiDarslar} dars</div>
          </div>
        </div>
      </div>

      {/* Haftalik faollik */}
      <div style={karta}>
        <h3 style={{ ...sarlavha, display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Flame size={15} strokeWidth={2} style={{ color: '#f59e0b' }} /> Haftalik faollik
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', height: '116px' }}>
          {sonlar.map((s, i) => {
            const bugunmi = i === kunIdx
            const h = s === 0 ? 4 : Math.round((s / maxW) * 92) + 8
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                {s > 0 && <span style={{ fontSize: '10px', fontWeight: 800, color: bugunmi ? '#d97706' : 'var(--muted)' }}>{s}</span>}
                <div style={{
                  width: '100%', maxWidth: '24px', height: `${h}%`, minHeight: '4px', borderRadius: '7px 7px 3px 3px',
                  background: bugunmi ? '#f59e0b' : 'var(--surface-2)',
                  border: bugunmi ? 'none' : '1px solid var(--line)',
                }} />
                <span style={{ fontSize: '9.5px', fontWeight: bugunmi ? 800 : 600, color: bugunmi ? 'var(--ink)' : 'var(--muted)' }}>{KUN[i]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bosqich breakdown — o'ng blok to'liq kengligi */}
      <div className="min-[760px]:col-start-2 min-[760px]:col-span-2" style={karta}>
        <h3 style={{ ...sarlavha, display: 'flex', alignItems: 'center', gap: '7px' }}>
          <TrendingUp size={15} strokeWidth={2} /> Bosqichlar bo&apos;yicha
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bosqichProgress.map((b) => (
            <div key={b.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12.5px', fontWeight: 700 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: 'var(--ink-soft)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: b.rang }} /> {b.nom}
                </span>
                <span style={{ color: b.rang, fontVariantNumeric: 'tabular-nums' }}>{b.tugadi}/{b.jami}</span>
              </div>
              <div style={{ height: '9px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', background: b.rang, width: `${b.jami ? Math.round((b.tugadi / b.jami) * 100) : 0}%`, transition: 'width .5s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
