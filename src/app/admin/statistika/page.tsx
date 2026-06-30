'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { CountUp } from '@/components/CountUp'
import { USULLAR, type UsulId } from '@/lib/varikotseleUsullari'
import {
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const ROLE_COLOR: Record<string, string> = {
  doctor: '#dc2626', student: '#2563eb', patient: '#059669', admin: '#7c3aed',
}
const ROLE_LABEL: Record<string, string> = {
  doctor: 'Shifokor', student: 'Talaba', patient: 'Bemor', admin: 'Admin',
}
const HOLAT_COLOR: Record<string, string> = {
  yangi: '#f59e0b', tekshiruv_buyurildi: '#f97316',
  natija_kiritildi: '#3b82f6', yakunlandi: '#10b981',
}
const HOLAT_LABEL: Record<string, string> = {
  yangi: 'Yangi', tekshiruv_buyurildi: "Tekshiruv buyurildi",
  natija_kiritildi: 'Natija kiritildi', yakunlandi: 'Yakunlandi',
}

function kunlar(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (n - 1 - i)); d.setHours(0, 0, 0, 0)
    return d
  })
}
function kunLabel(d: Date) {
  return d.toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })
}

export default function AdminStatistikaPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [yangilanmoqda, setYangilanmoqda] = useState(false)
  const [oxirgiYangilanish, setOxirgiYangilanish] = useState<Date | null>(null)

  const [totalUsers, setTotalUsers] = useState(0)
  const [bemorCount, setBemorCount] = useState(0)
  const [totalTashrif, setTotalTashrif] = useState(0)
  const [totalUsul, setTotalUsul] = useState(0)

  const [kunlikData, setKunlikData] = useState<{ kun: string; talaba: number; shifokor: number; bemor: number }[]>([])
  const [rolePieData, setRolePieData] = useState<{ name: string; value: number; color: string }[]>([])
  const [tashrifBarData, setTashrifBarData] = useState<{ nom: string; soni: number; color: string }[]>([])
  const [usulBarData, setUsulBarData] = useState<{ nom: string; soni: number; color: string }[]>([])

  const load = async (yangilash = false) => {
    if (yangilash) setYangilanmoqda(true)
    else setLoading(true)

    const o_ttiz_kun = new Date(); o_ttiz_kun.setDate(o_ttiz_kun.getDate() - 29); o_ttiz_kun.setHours(0, 0, 0, 0)

    const [profilesAll, profilesOttiz, bemorlar, tashriflar, tadqiqot] = await Promise.all([
      supabase.from('profiles').select('role'),
      supabase.from('profiles').select('role, created_at').gte('created_at', o_ttiz_kun.toISOString()),
      supabase.from('bemorlar').select('id', { count: 'exact', head: true }),
      supabase.from('tashriflar').select('holat'),
      supabase.from('varikotsele_tadqiqot').select('method'),
    ])

    // KPI
    const allProfiles = profilesAll.data ?? []
    setTotalUsers(allProfiles.length)
    setBemorCount(bemorlar.count ?? 0)
    const tc: Record<string, number> = {}
    for (const t of tashriflar.data ?? []) tc[t.holat] = (tc[t.holat] ?? 0) + 1
    setTotalTashrif(Object.values(tc).reduce((a, b) => a + b, 0))
    const uc: Record<string, number> = {}
    for (const u of tadqiqot.data ?? []) uc[u.method] = (uc[u.method] ?? 0) + 1
    setTotalUsul(Object.values(uc).reduce((a, b) => a + b, 0))

    // Rollar pie
    const rc: Record<string, number> = {}
    for (const p of allProfiles) rc[p.role] = (rc[p.role] ?? 0) + 1
    setRolePieData(
      Object.keys(ROLE_LABEL).filter((r) => rc[r]).map((r) => ({
        name: ROLE_LABEL[r], value: rc[r] ?? 0, color: ROLE_COLOR[r],
      }))
    )

    // 30 kunlik chiziqli grafik
    const o_ttizKunlar = kunlar(30)
    const kunMap: Record<string, { talaba: number; shifokor: number; bemor: number }> = {}
    for (const d of o_ttizKunlar) kunMap[d.toDateString()] = { talaba: 0, shifokor: 0, bemor: 0 }
    for (const p of profilesOttiz.data ?? []) {
      const d = new Date(p.created_at); d.setHours(0, 0, 0, 0)
      const key = d.toDateString()
      if (!kunMap[key]) continue
      if (p.role === 'student') kunMap[key].talaba++
      else if (p.role === 'doctor') kunMap[key].shifokor++
      else if (p.role === 'patient') kunMap[key].bemor++
    }
    setKunlikData(o_ttizKunlar.map((d) => ({ kun: kunLabel(d), ...kunMap[d.toDateString()] })))

    // Tashrif bar
    setTashrifBarData(
      Object.keys(HOLAT_LABEL).map((h) => ({
        nom: HOLAT_LABEL[h], soni: tc[h] ?? 0, color: HOLAT_COLOR[h],
      }))
    )

    // Usul bar
    setUsulBarData(
      (Object.keys(USULLAR) as UsulId[]).filter((id) => uc[id]).map((id) => ({
        nom: USULLAR[id].nom, soni: uc[id] ?? 0, color: USULLAR[id].color,
      }))
    )

    setOxirgiYangilanish(new Date())
    setLoading(false)
    setYangilanmoqda(false)
  }

  useEffect(() => { load() }, [])

  const card = { background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' } as React.CSSProperties
  const cardTitle = { fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '.05em', margin: '0 0 18px 0', fontWeight: 600 }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />

      <div className="fade-in mx-auto max-w-[1100px] px-8 py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '12px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Statistik tahlil</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {oxirgiYangilanish && (
              <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                {oxirgiYangilanish.toLocaleTimeString('uz-UZ')} da yangilandi
              </span>
            )}
            <button onClick={() => load(true)} disabled={yangilanmoqda} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '8px', padding: '6px 12px', fontSize: '12.5px',
              color: 'var(--ink-soft)', cursor: yangilanmoqda ? 'not-allowed' : 'pointer',
              opacity: yangilanmoqda ? 0.6 : 1,
            }}>
              <span style={{ display: 'inline-block', animation: yangilanmoqda ? 'spin 1s linear infinite' : 'none' }}>↻</span>
              {yangilanmoqda ? 'Yangilanmoqda...' : 'Yangilash'}
            </button>
          </div>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '28px' }}>
          Platformaning umumiy faolligi va foydalanish ko&apos;rsatkichlari.
        </p>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : (
          <>
            {/* KPI kartalar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              {[
                { label: 'Jami foydalanuvchilar', value: totalUsers, color: '#2563eb' },
                { label: 'Bemorlar reestrida', value: bemorCount, color: '#dc2626' },
                { label: 'Jami qabullar', value: totalTashrif, color: '#10b981' },
                { label: 'Varikotsele tadqiqotlari', value: totalUsul, color: '#7c3aed' },
              ].map((k) => (
                <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}` }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 700, color: k.color }}>
                    <CountUp value={k.value} />
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '6px' }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Chiziqli grafik — 30 kunlik o'sish */}
            <div style={{ ...card, marginBottom: '20px' }}>
              <h3 style={cardTitle}>So&apos;nggi 30 kun — yangi a&apos;zolar dinamikasi</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={kunlikData} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gTalaba" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gShifokor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gBemor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                  <XAxis dataKey="kun" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 13 }} />
                  <Area type="monotone" dataKey="talaba" name="Talaba" stroke="#2563eb" fill="url(#gTalaba)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="shifokor" name="Shifokor" stroke="#dc2626" fill="url(#gShifokor)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="bemor" name="Bemor" stroke="#10b981" fill="url(#gBemor)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              {/* Donut — rollar taqsimoti */}
              <div style={card}>
                <h3 style={cardTitle}>Foydalanuvchilar taqsimoti</h3>
                {rolePieData.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Ma&apos;lumot yo&apos;q.</p>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={rolePieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                          dataKey="value" paddingAngle={3}>
                          {rolePieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                      {rolePieData.map((d) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                          <span style={{ flex: 1 }}>{d.name}</span>
                          <span style={{ fontFamily: 'monospace', color: 'var(--muted)', fontWeight: 600 }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bar — qabullar bosqichi */}
              <div style={card}>
                <h3 style={cardTitle}>Qabullar bosqichi bo&apos;yicha</h3>
                {totalTashrif === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha qabul yo&apos;q.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={tashrifBarData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                      <XAxis dataKey="nom" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13 }} />
                      <Bar dataKey="soni" name="Soni" radius={[6, 6, 0, 0]}>
                        {tashrifBarData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Bar — varikotsele usullari */}
            {usulBarData.length > 0 && (
              <div style={card}>
                <h3 style={cardTitle}>Varikotsele — tanlangan jarrohlik usullari</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={usulBarData} margin={{ top: 4, right: 12, left: -20, bottom: 0 }} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                    <XAxis dataKey="nom" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13 }} />
                    <Bar dataKey="soni" name="Tadqiqotlar soni" radius={[6, 6, 0, 0]}>
                      {usulBarData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
