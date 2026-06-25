'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'

export default function PatientDashboard() {
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>

      <Header {...(profile.role === 'admin' ? { backHref: '/admin/dashboard', backLabel: 'Admin paneli' } : {})} actions={
        <button onClick={handleLogout} className="btn-animated rounded-lg border px-4 py-2 text-sm" style={{
          background: 'var(--surface-2)', color: 'var(--danger)', borderColor: 'var(--line)',
        }}>
          Chiqish
        </button>
      } />

      {/* Content */}
      <div style={{ padding: '32px' }}>
        <h2 className="rise" style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '6px', fontFamily: 'var(--font-inter)', fontWeight: 500, letterSpacing: 0 }}>Xush kelibsiz 👋</h2>
        <h1 className="rise" style={{ fontSize: '32px', marginBottom: '32px' }}>
          {profile.full_name}
        </h1>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '🩺', title: 'Yangi murojaat', desc: 'Shikoyatingizni shifokorga yuboring', href: '/patient/murojaat', c: 'var(--accent)' },
            { icon: '📨', title: 'Mening murojaatlarim', desc: 'Yuborilgan shikoyatlar va javoblar', href: '/patient/murojaatlarim', c: 'var(--good)' },
            { icon: '❓', title: 'Savol-javob', desc: "Eng ko'p beriladigan savollarga javoblar", href: '/patient/savollar', c: 'var(--warn)' },
          ].map((item, i) => (
            <div key={item.title} onClick={() => item.href && router.push(item.href)}
              className="dash-card rise"
              style={{ ['--c' as any]: item.c, animationDelay: `${i * 0.05}s`, opacity: item.href ? 1 : 0.5, cursor: item.href ? 'pointer' : 'default' }}>
              <div className="dash-icon">{item.icon}</div>
              <h3 className="dash-title">{item.title}</h3>
              <p className="dash-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
