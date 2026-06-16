'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
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
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white' }}>Yuklanmoqda...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', color: 'white' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#111118',
        borderBottom: '1px solid #1e1e2e',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
          Uro<span style={{ color: '#60a5fa' }}>Andro</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>🛠️ {profile.full_name}</span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#1e1e2e',
              color: '#f87171',
              border: '1px solid #2e2e3e',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Chiqish
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px' }}>
        <h2 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>Xush kelibsiz</h2>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>
          {profile.full_name} 🛠️
        </h1>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: '👥', title: 'Foydalanuvchilar', desc: 'Talaba, bemor, shifokorlarni boshqarish' },
            { icon: '📝', title: 'Kontent', desc: 'Protokol, maqola va materiallarni tahrirlash' },
            { icon: '❓', title: 'Testlar', desc: 'Quizlarni boshqarish' },
            { icon: '📈', title: 'Statistika', desc: 'Platforma faolligi' },
          ].map((item) => (
            <div key={item.title} style={{
              backgroundColor: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
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
                backgroundColor: '#111118',
                border: '1px solid #1e1e2e',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'white' }}>{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
