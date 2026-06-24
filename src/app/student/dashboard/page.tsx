'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'

export default function StudentDashboard() {
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
            { icon: '📖', title: 'Darslar', desc: 'Urologiya va andrologiya kurslari', c: 'var(--accent)' },
            { icon: '❓', title: 'Testlar', desc: 'Bilimni sinash uchun quizlar', c: 'var(--accent-2)' },
            { icon: '📊', title: 'Natijalarim', desc: 'Test natijalari va progress', c: 'var(--good)' },
            { icon: '📚', title: 'Kutubxona', desc: "O'quv materiallar", c: 'var(--warn)' },
          ].map((item, i) => (
            <div key={item.title} className="dash-card rise" style={{ ['--c' as any]: item.c, animationDelay: `${i * 0.05}s` }}>
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
