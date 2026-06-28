'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import Link from 'next/link'

export default function AdminDashboard() {
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>

      <Header />

      {/* Content */}
      <div style={{ padding: '32px' }}>
        <h2 className="rise" style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '6px', fontFamily: 'var(--font-inter)', fontWeight: 500, letterSpacing: 0 }}>Xush kelibsiz 👋</h2>
        <h1 className="rise" style={{ fontSize: '32px', marginBottom: '32px' }}>
          {profile.full_name}
        </h1>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '34px' }}>
          {[
            { icon: '👥', title: 'Foydalanuvchilar', desc: 'Talaba, bemor, shifokorlarni boshqarish', href: '/admin/users', c: 'var(--accent)' },
            { icon: '📝', title: 'Kontent', desc: 'Protokol va kutubxona materiallarini boshqarish', href: '/admin/content', c: 'var(--accent-2)' },
            { icon: '📚', title: 'Darslar tarkibi', desc: 'Video, konspekt, prezentatsiya fayllari', href: '/admin/darslar', c: 'var(--warn)' },
            { icon: '💬', title: 'Fikrlar', desc: 'Talabalardan kelgan izohlar', href: '/admin/fikrlar', c: 'var(--accent-2)' },
            { icon: '📈', title: 'Statistika', desc: 'Platforma faolligi', href: '/admin/statistika', c: 'var(--good)' },
          ].map((item, i) => (
            <div key={item.title} onClick={() => item.href && router.push(item.href)}
              className={`dash-card rise ${item.href ? '' : 'dash-soon'}`}
              style={{ ['--c' as any]: item.c, animationDelay: `${i * 0.05}s`, opacity: item.href ? 1 : 0.5, cursor: item.href ? 'pointer' : 'default' }}>
              <div className="dash-icon">{item.icon}</div>
              <h3 className="dash-title">{item.title}</h3>
              <p className="dash-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'var(--font-inter)', fontWeight: 600 }}>
          Dashboardlarni ko&apos;rish
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🎓', title: 'Talaba', href: '/student/dashboard', c: 'var(--accent)' },
            { icon: '👨‍⚕️', title: 'Shifokor', href: '/doctor/dashboard', c: 'var(--good)' },
            { icon: '🧑', title: 'Bemor', href: '/patient/dashboard', c: 'var(--accent-2)' },
            { icon: '🛠️', title: 'Admin', href: '/admin/dashboard', c: 'var(--warn)' },
          ].map((item) => (
            <Link key={item.title} href={item.href} style={{ textDecoration: 'none' }}>
              <div className="dash-card" style={{ ['--c' as any]: item.c }}>
                <div className="dash-icon">{item.icon}</div>
                <h3 className="dash-title" style={{ margin: 0 }}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
