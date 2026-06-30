'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { CountUp } from '@/components/CountUp'
import { USULLAR, type UsulId } from '@/lib/varikotseleUsullari'

const ROLE_COLOR: Record<string, string> = {
  doctor: '#dc2626', student: '#2563eb', patient: '#059669', admin: '#7c3aed',
}
const ROLE_LABEL: Record<string, string> = {
  doctor: '👨‍⚕️ Shifokor', student: '🎓 Talaba', patient: '🧑 Bemor', admin: '🛠️ Admin',
}
const HOLAT_COLOR: Record<string, string> = {
  yangi: 'var(--warn)', tekshiruv_buyurildi: 'var(--warn)', natija_kiritildi: 'var(--accent)', yakunlandi: 'var(--good)',
}
const HOLAT_LABEL: Record<string, string> = {
  yangi: 'Shikoyat qabul qilindi', tekshiruv_buyurildi: 'Tekshiruv buyurildi',
  natija_kiritildi: 'Natija kiritildi', yakunlandi: 'Yakunlandi',
}

type Recent = { full_name: string; role: string; created_at: string }

export default function AdminStatistikaPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [yangilanmoqda, setYangilanmoqda] = useState(false)
  const [oxirgiYangilanish, setOxirgiYangilanish] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const [roleCounts, setRoleCounts] = useState<Record<string, number>>({})
  const [bemorCount, setBemorCount] = useState(0)
  const [tashrifCounts, setTashrifCounts] = useState<Record<string, number>>({})
  const [usulCounts, setUsulCounts] = useState<Record<string, number>>({})
  const [recent, setRecent] = useState<Recent[]>([])

  const load = async (yangilash = false) => {
    if (yangilash) setYangilanmoqda(true)
    else setLoading(true)

    const [profiles, bemorlar, tashriflar, tadqiqot, recentUsers] = await Promise.all([
      supabase.from('profiles').select('role'),
      supabase.from('bemorlar').select('id', { count: 'exact', head: true }),
      supabase.from('tashriflar').select('holat'),
      supabase.from('varikotsele_tadqiqot').select('method'),
      supabase.from('profiles').select('full_name, role, created_at').order('created_at', { ascending: false }).limit(6),
    ])

    const rc: Record<string, number> = {}
    for (const p of profiles.data ?? []) rc[p.role] = (rc[p.role] ?? 0) + 1
    setRoleCounts(rc)

    setBemorCount(bemorlar.count ?? 0)

    const tc: Record<string, number> = {}
    for (const t of tashriflar.data ?? []) tc[t.holat] = (tc[t.holat] ?? 0) + 1
    setTashrifCounts(tc)

    const uc: Record<string, number> = {}
    for (const u of tadqiqot.data ?? []) uc[u.method] = (uc[u.method] ?? 0) + 1
    setUsulCounts(uc)

    setRecent((recentUsers.data as Recent[]) ?? [])
    setOxirgiYangilanish(new Date())
    setLoading(false)
    setYangilanmoqda(false)
    requestAnimationFrame(() => setMounted(true))
  }

  useEffect(() => { load() }, [])

  const totalUsers = Object.values(roleCounts).reduce((a, b) => a + b, 0)
  const totalTashrif = Object.values(tashrifCounts).reduce((a, b) => a + b, 0)
  const totalUsul = Object.values(usulCounts).reduce((a, b) => a + b, 0)

  const card = {
    background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px',
  } as React.CSSProperties

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />

      <div className="fade-in mx-auto max-w-[1000px] px-8 py-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '12px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Statistik tahlil</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {oxirgiYangilanish && (
              <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                {oxirgiYangilanish.toLocaleTimeString('uz-UZ')} da yangilandi
              </span>
            )}
            <button
              onClick={() => load(true)}
              disabled={yangilanmoqda}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: '8px', padding: '6px 12px', fontSize: '12.5px',
                color: 'var(--ink-soft)', cursor: yangilanmoqda ? 'not-allowed' : 'pointer',
                opacity: yangilanmoqda ? 0.6 : 1,
              }}
            >
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
            {/* KPI cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              {[
                { label: 'Jami foydalanuvchilar', value: totalUsers, color: 'var(--accent)' },
                { label: 'Bemorlar reestrida', value: bemorCount, color: 'var(--danger)' },
                { label: 'Jami qabullar', value: totalTashrif, color: 'var(--good)' },
                { label: 'Varikotsele tadqiqotlari', value: totalUsul, color: 'var(--accent-2)' },
              ].map((k) => (
                <div key={k.label} className="stat-card" style={card}>
                  <div style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 700, color: k.color }}>
                    <CountUp value={k.value} />
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '6px' }}>{k.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
              {/* Role distribution */}
              <div style={card}>
                <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 16px 0' }}>Rollar bo&apos;yicha taqsimot</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.keys(ROLE_LABEL).map((role) => {
                    const count = roleCounts[role] ?? 0
                    const pct = totalUsers ? Math.round((count / totalUsers) * 100) : 0
                    return (
                      <div key={role}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                          <span>{ROLE_LABEL[role]}</span>
                          <span style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: '10px', borderRadius: '6px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                          <div className="bar-fill" style={{
                            height: '100%', borderRadius: '6px', background: ROLE_COLOR[role],
                            width: mounted ? `${pct}%` : '0%',
                          }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tashrif status distribution */}
              <div style={card}>
                <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 16px 0' }}>Qabullar bosqichi bo&apos;yicha</h3>
                {totalTashrif === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha qabul yo&apos;q.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {Object.keys(HOLAT_LABEL).map((holat) => {
                      const count = tashrifCounts[holat] ?? 0
                      const pct = totalTashrif ? Math.round((count / totalTashrif) * 100) : 0
                      return (
                        <div key={holat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                            <span>{HOLAT_LABEL[holat]}</span>
                            <span style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ height: '10px', borderRadius: '6px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                            <div className="bar-fill" style={{
                              height: '100%', borderRadius: '6px', background: HOLAT_COLOR[holat],
                              width: mounted ? `${pct}%` : '0%',
                            }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Varikotsele method distribution */}
              <div style={card}>
                <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 16px 0' }}>Varikotsele — tanlangan usullar</h3>
                {totalUsul === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha tadqiqot yozuvi yo&apos;q.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(Object.keys(USULLAR) as UsulId[]).map((id) => {
                      const count = usulCounts[id] ?? 0
                      const pct = totalUsul ? Math.round((count / totalUsul) * 100) : 0
                      return (
                        <div key={id}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                            <span>{USULLAR[id].nom}</span>
                            <span style={{ fontFamily: 'monospace', color: 'var(--muted)' }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ height: '10px', borderRadius: '6px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                            <div className="bar-fill" style={{
                              height: '100%', borderRadius: '6px', background: USULLAR[id].color,
                              width: mounted ? `${pct}%` : '0%',
                            }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Recent signups */}
              <div style={card}>
                <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 16px 0' }}>So&apos;nggi ro&apos;yxatdan o&apos;tganlar</h3>
                {recent.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha foydalanuvchi yo&apos;q.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {recent.map((u, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', borderBottom: i < recent.length - 1 ? '1px solid var(--line)' : 'none', paddingBottom: '8px' }}>
                        <span>{u.full_name ?? '—'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', color: ROLE_COLOR[u.role], fontWeight: 600 }}>{ROLE_LABEL[u.role]}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--muted)' }}>{new Date(u.created_at).toLocaleDateString()}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
