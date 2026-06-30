'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

type FaollikMa = {
  bugunKirganlar: number
  haftaYangilar: number
  korilmagan: number
  yangiMurojaatlar: number
}

const ROLE_COLOR: Record<string, string> = {
  doctor: 'var(--danger)', student: 'var(--accent)', patient: 'var(--good)', admin: 'var(--warn)',
}
const ROLE_LABEL: Record<string, string> = {
  doctor: '👨‍⚕️ Shifokor', student: '🎓 Talaba', patient: '🧑 Bemor', admin: '🛠️ Admin',
}

type Recent = { full_name: string; role: string; created_at: string }

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [faollik, setFaollik] = useState<FaollikMa | null>(null)
  const [recentUsers, setRecentUsers] = useState<Recent[]>([])
  const [miniChart, setMiniChart] = useState<{ kun: string; soni: number }[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const bugun = new Date(); bugun.setHours(0, 0, 0, 0)
      const hafta = new Date(); hafta.setDate(hafta.getDate() - 7); hafta.setHours(0, 0, 0, 0)
      const yettikun = new Date(); yettikun.setDate(yettikun.getDate() - 6); yettikun.setHours(0, 0, 0, 0)

      const [profileRes, bugunRes, haftaRes, fikrRes, murojaatRes, recentRes, yettiKunRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', bugun.toISOString()),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', hafta.toISOString()),
        supabase.from('fikrlar').select('id', { count: 'exact', head: true }).eq('korildi', false),
        supabase.from('tashriflar').select('id', { count: 'exact', head: true }).eq('holat', 'yangi'),
        supabase.from('profiles').select('full_name, role, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('profiles').select('created_at').gte('created_at', yettikun.toISOString()),
      ])

      setProfile(profileRes.data)
      setFaollik({
        bugunKirganlar: bugunRes.count ?? 0,
        haftaYangilar: haftaRes.count ?? 0,
        korilmagan: fikrRes.count ?? 0,
        yangiMurojaatlar: murojaatRes.count ?? 0,
      })
      setRecentUsers((recentRes.data as Recent[]) ?? [])

      // Mini chart: 7 kunlik
      const kunMap: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0)
        kunMap[d.toDateString()] = 0
      }
      for (const p of yettiKunRes.data ?? []) {
        const d = new Date(p.created_at); d.setHours(0, 0, 0, 0)
        if (kunMap[d.toDateString()] !== undefined) kunMap[d.toDateString()]++
      }
      setMiniChart(Object.entries(kunMap).map(([key, soni]) => ({
        kun: new Date(key).toLocaleDateString('uz-UZ', { weekday: 'short' }),
        soni,
      })))
    }
    load()
  }, [])

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header />

      <div style={{ padding: '32px' }}>
        <h2 className="rise" style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '6px', fontWeight: 500, letterSpacing: 0 }}>Xush kelibsiz 👋</h2>
        <h1 className="rise" style={{ fontSize: '32px', marginBottom: '24px' }}>{profile.full_name}</h1>

        {/* Faollik ko'rsatkichlari */}
        {faollik && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
            {[
              { label: 'Bugun qo\'shildi', value: faollik.bugunKirganlar, icon: '🆕', color: 'var(--accent)', href: '/admin/users' },
              { label: 'Haftalik yangilar', value: faollik.haftaYangilar, icon: '📅', color: 'var(--good)', href: '/admin/users' },
              { label: 'Ko\'rilmagan fikrlar', value: faollik.korilmagan, icon: '💬', color: faollik.korilmagan > 0 ? 'var(--warn)' : 'var(--muted)', href: '/admin/fikrlar' },
              { label: 'Yangi murojaatlar', value: faollik.yangiMurojaatlar, icon: '📋', color: faollik.yangiMurojaatlar > 0 ? 'var(--danger)' : 'var(--muted)', href: '/admin/statistika' },
            ].map((k) => (
              <div key={k.label} onClick={() => router.push(k.href)} className="rise" style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                padding: '16px 18px', cursor: 'pointer', transition: 'border-color .15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{k.icon}</span>
                  {k.value > 0 && (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: k.color, background: `${k.color}20`, padding: '2px 8px', borderRadius: 20 }}>
                      {k.value}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: k.color, fontFamily: 'monospace', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>{k.label}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {/* Tezkor havolalar */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
            <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', margin: '0 0 14px 0', fontWeight: 600 }}>Boshqaruv paneli</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {[
                { icon: '👥', title: 'Foydalanuvchilar', href: '/admin/users', c: 'var(--accent)' },
                { icon: '📝', title: 'Kontent', href: '/admin/content', c: 'var(--accent-2)' },
                { icon: '📚', title: 'Darslar', href: '/admin/darslar', c: 'var(--warn)' },
                { icon: '💬', title: 'Fikrlar', href: '/admin/fikrlar', c: 'var(--accent-2)' },
                { icon: '📈', title: 'Statistika', href: '/admin/statistika', c: 'var(--good)' },
                { icon: '🛡️', title: 'Audit log', href: '/admin/audit', c: 'var(--danger)' },
              ].map((item) => (
                <div key={item.title} onClick={() => router.push(item.href)}
                  className="dash-card rise"
                  style={{ ['--c' as any]: item.c, cursor: 'pointer', padding: '14px' }}>
                  <div className="dash-icon" style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
                  <h3 className="dash-title" style={{ fontSize: '13px', margin: 0 }}>{item.title}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* Mini grafik */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', margin: 0, fontWeight: 600 }}>7 kunlik yangi a'zolar</h3>
              <Link href="/admin/statistika" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Batafsil →</Link>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={miniChart} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="kun" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13 }} formatter={(v: any) => [v, "Yangi a'zo"]} />
                <Area type="monotone" dataKey="soni" stroke="#2563eb" fill="url(#miniGrad)" strokeWidth={2} dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* So'nggi ro'yxatdan o'tganlar */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', margin: 0, fontWeight: 600 }}>So'nggi a'zolar</h3>
              <Link href="/admin/users" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>Barchasini ko'rish →</Link>
            </div>
            {recentUsers.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hozircha yo'q.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentUsers.map((u, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingBottom: i < recentUsers.length - 1 ? '10px' : 0,
                    borderBottom: i < recentUsers.length - 1 ? '1px solid var(--line)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${ROLE_COLOR[u.role]}20`, color: ROLE_COLOR[u.role], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                        {u.full_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>{u.full_name ?? '—'}</div>
                        <div style={{ fontSize: '11px', color: ROLE_COLOR[u.role], fontWeight: 600 }}>{ROLE_LABEL[u.role] ?? u.role}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'monospace' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Boshqa dashboardlar */}
        <h2 style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>
          Dashboardlarni ko&apos;rish
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {[
            { icon: '🎓', title: 'Talaba', href: '/student/dashboard', c: 'var(--accent)' },
            { icon: '👨‍⚕️', title: 'Shifokor', href: '/doctor/dashboard', c: 'var(--good)' },
            { icon: '🧑', title: 'Bemor', href: '/patient/dashboard', c: 'var(--accent-2)' },
            { icon: '🛠️', title: 'Admin', href: '/admin/dashboard', c: 'var(--warn)' },
          ].map((item) => (
            <Link key={item.title} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="dash-card" style={{ ['--c' as any]: item.c, padding: '14px' }}>
                <div className="dash-icon" style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
                <h3 className="dash-title" style={{ margin: 0, fontSize: '13px' }}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
