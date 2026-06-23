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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
    </div>
  )

  return (
    <AppShell
      title={`👨‍⚕️ ${profile.full_name}`}
      actions={
        <button
          onClick={handleLogout}
          className="btn-animated rounded-lg border px-4 py-2 text-sm"
          style={{ background: 'var(--surface-2)', color: 'var(--danger)', borderColor: 'var(--line)' }}
        >
          Chiqish
        </button>
      }
    >
      <div className="px-8 py-8">
        <h2 style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '8px' }}>Xush kelibsiz</h2>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>
          Dr. {profile.full_name} 👨‍⚕️
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '🧑‍🤝‍🧑', title: 'Bemorlar', desc: "Ro'yxat va yangi qabul", href: '/doctor/patients' },
            { icon: '📋', title: 'Protokollar', desc: 'Klinik protokollar', href: '/doctor/protokollar' },
            { icon: '🧮', title: 'Kalkulatorlar', desc: "Varikotsele usul tanlash, IPSS, PSA", href: '/doctor/calculators' },
            { icon: '📚', title: 'Kutubxona', desc: 'PDF materiallar', href: '/doctor/kutubxona' },
            { icon: '🌐', title: "Qo'llanmalar", desc: 'EAU, AUA guidelines', href: '/doctor/qollanmalar' },
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => item.href && router.push(item.href)}
              className="card-hover"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '24px',
                cursor: item.href ? 'pointer' : 'default',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{item.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
