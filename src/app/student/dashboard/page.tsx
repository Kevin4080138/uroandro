'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { DARSLAR } from '@/lib/talim/darslar'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [bajarilganSoni, setBajarilganSoni] = useState(0)
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

      const { data: natijalar } = await supabase
        .from('talim_natijalari')
        .select('dars_slug')
        .eq('student_id', user.id)
      const yakunlangan = new Set((natijalar ?? []).map((n: any) => n.dars_slug))
      setBajarilganSoni(yakunlangan.size)
    }
    getProfile()
  }, [])

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
    </div>
  )

  const jamiDars = DARSLAR.length
  const progress = jamiDars ? Math.round((bajarilganSoni / jamiDars) * 100) : 0

  const KARTALAR = [
    { icon: '📖', title: 'Darslar', desc: 'Urologiya va andrologiya kurslari', c: 'var(--accent)', href: '/student/darslar' },
    { icon: '📊', title: 'Natijalarim', desc: 'Test natijalari va progress', c: 'var(--good)', href: '/student/natijalarim' },
    { icon: '🏆', title: 'Reyting', desc: 'Faollik bo\'yicha talabalar reytingi', c: 'var(--accent-2)', href: '/student/reyting' },
    { icon: '📚', title: 'Kutubxona', desc: "O'quv materiallar", c: 'var(--warn)', href: '/student/kutubxona' },
    { icon: '🎯', title: "O'zingizni tekshiring", desc: 'Turli mavzudan aralash savol, karta va klinik holat', c: 'var(--danger)', href: '/student/ozingizni-tekshiring' },
  ]

  // Boshqa rollarga nazar solish — asosiy bo'limlardan ajratib, kichikroq ko'rinishda chiqariladi
  const NAZAR_KARTALAR = [
    { icon: '🧑‍🤝‍🧑', title: 'Bemor bo\'limi', desc: 'Tanishish uchun', href: '/student/bemor-bolimi' },
    { icon: '👨‍⚕️', title: 'Shifokor bo\'limi', desc: 'Tanishish uchun', href: '/student/shifokor-bolimi' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>

      <Header {...(profile.role === 'admin' ? { backHref: '/admin/dashboard', backLabel: 'Admin paneli' } : {})} />

      {/* Content */}
      <div style={{ padding: '32px' }}>
        <h2 className="rise" style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '6px', fontFamily: 'var(--font-inter)', fontWeight: 500, letterSpacing: 0 }}>Xush kelibsiz 👋</h2>
        <h1 className="rise" style={{ fontSize: '32px', marginBottom: '20px' }}>
          {profile.full_name}
        </h1>

        {/* Progress */}
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '20px 24px', marginBottom: '28px', maxWidth: '520px', animationDelay: '.04s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-soft)' }}>O&apos;zlashtirish darajangiz</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>{bajarilganSoni}/{jamiDars} dars</span>
          </div>
          <div style={{ height: '10px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '999px', width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width .4s ease',
            }} />
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {KARTALAR.map((item, i) => (
            <div
              key={item.title}
              onClick={() => router.push(item.href)}
              className="dash-card rise"
              style={{ ['--c' as any]: item.c, animationDelay: `${i * 0.05}s`, cursor: 'pointer' }}
            >
              <div className="dash-icon">{item.icon}</div>
              <h3 className="dash-title">{item.title}</h3>
              <p className="dash-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Nazar solish — boshqa rollar qanday tuzilganini ko'rib chiqish, ajratilgan va kichikroq */}
        <p className="rise" style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700, margin: '0 0 10px' }}>
          👁️ Nazar solish
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {NAZAR_KARTALAR.map((item, i) => (
            <div
              key={item.title}
              onClick={() => router.push(item.href)}
              className="rise soft-press"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                padding: '10px 16px', opacity: 0.85, animationDelay: `${0.15 + i * 0.05}s`,
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--ink-soft)' }}>{item.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
