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

      <Header actions={
        <button onClick={handleLogout} className="btn-animated rounded-lg border px-4 py-2 text-sm" style={{
          background: 'var(--surface-2)', color: 'var(--danger)', borderColor: 'var(--line)',
        }}>
          Chiqish
        </button>
      } />

      {/* Content */}
      <div style={{ padding: '32px' }}>
        <h2 style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '8px' }}>Xush kelibsiz</h2>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>
          {profile.full_name} 🛠️
        </h1>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '👥', title: 'Foydalanuvchilar', desc: 'Talaba, bemor, shifokorlarni boshqarish', href: '/admin/users' },
            { icon: '📝', title: 'Kontent', desc: 'Protokol va kutubxona materiallarini boshqarish', href: '/admin/content' },
            { icon: '❓', title: 'Testlar', desc: 'Quizlarni boshqarish (tez kunda)' },
            { icon: '📈', title: 'Statistika', desc: 'Platforma faolligi (tez kunda)' },
          ].map((item) => (
            <div key={item.title} onClick={() => item.href && router.push(item.href)} style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '24px',
              cursor: item.href ? 'pointer' : 'default',
              opacity: item.href ? 1 : 0.55,
              }} className={item.href ? 'card-hover' : ''}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{item.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
          Dashboardlarni ko'rish
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { icon: '🎓', title: 'Talaba', href: '/student/dashboard' },
            { icon: '👨‍⚕️', title: 'Shifokor', href: '/doctor/dashboard' },
            { icon: '🧑', title: 'Bemor', href: '/patient/dashboard' },
            { icon: '🛠️', title: 'Admin', href: '/admin/dashboard' },
          ].map((item) => (
            <Link key={item.title} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                }} className="card-hover">
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--ink)' }}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
