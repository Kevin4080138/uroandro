'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

export default function DoctorDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
    }
    getProfile()
  }, [])

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
    </div>
  )

  return (
    <AppShell title={`👨‍⚕️ ${profile.full_name}`}>
      <div className="px-8 py-8">
        <h2 className="rise" style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '6px', fontFamily: 'var(--font-inter)', fontWeight: 500, letterSpacing: 0 }}>Xush kelibsiz 👋</h2>
        <h1 className="rise" style={{ fontSize: '32px', marginBottom: '32px' }}>
          Dr. {profile.full_name}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '🧑‍🤝‍🧑', title: 'Bemorlar', desc: "Ro'yxat va yangi qabul", href: '/doctor/patients', c: 'var(--danger)' },
            { icon: '📨', title: 'Murojaatlar', desc: 'Bemor shikoyatlari', href: '/doctor/murojaatlar', c: 'var(--accent-2)' },
            { icon: '📋', title: 'Protokollar', desc: 'Klinik protokollar', href: '/doctor/protokollar', c: 'var(--accent)' },
            { icon: '🧮', title: 'Kalkulatorlar', desc: 'Varikotsele usul tanlash, IPSS, PSA', href: '/doctor/calculators', c: 'var(--accent-2)' },
            { icon: '📚', title: 'Kutubxona', desc: 'PDF materiallar', href: '/doctor/kutubxona', c: 'var(--good)' },
            { icon: '🌐', title: "Qo'llanmalar", desc: 'EAU, AUA guidelines', href: '/doctor/qollanmalar', c: 'var(--warn)' },
          ].map((item, i) => (
            <div
              key={item.title}
              onClick={() => item.href && router.push(item.href)}
              className="dash-card rise"
              style={{ ['--c' as any]: item.c, animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
            >
              <div className="dash-icon">{item.icon}</div>
              <h3 className="dash-title">{item.title}</h3>
              <p className="dash-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
