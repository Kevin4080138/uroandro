'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { DARSLAR } from '@/lib/talim/darslar'
import { BannerCarousel } from '@/components/BannerCarousel'
import { RankCard } from '@/components/RankBadge'
import { getRank, getProgressData } from '@/lib/rank'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [bajarilganSoni, setBajarilganSoni] = useState(0)
  const [natijalarList, setNatijalarList] = useState<{ dars_slug: string }[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      const { data: natijalar } = await supabase.from('talim_natijalari').select('dars_slug').eq('student_id', user.id)
      const list = natijalar ?? []
      setNatijalarList(list)
      setBajarilganSoni(new Set(list.map((n: any) => n.dars_slug)).size)
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
  const rank = getRank(getProgressData(natijalarList))

  const KARTALAR = [
    { icon: '📖', title: 'Darslar', desc: 'Urologiya va andrologiya kurslari', c: 'var(--accent)', href: '/student/darslar' },
    { icon: '📊', title: 'Natijalarim', desc: 'Test natijalari va progress', c: 'var(--good)', href: '/student/natijalarim' },
    { icon: '🏆', title: 'Reyting', desc: "Faollik bo'yicha reyting", c: 'var(--accent-2)', href: '/student/reyting' },
    { icon: '📚', title: 'Kutubxona', desc: "O'quv materiallar", c: 'var(--warn)', href: '/student/kutubxona' },
    { icon: '🎯', title: "O'zingizni tekshiring", desc: 'Aralash savol va klinik holat', c: 'var(--danger)', href: '/student/ozingizni-tekshiring' },
    { icon: null, imgSrc: '/camu-logo.png', title: "CAMU bo'limi", desc: 'Central Asian Medical University', c: '#1a3a9e', href: '/student/camu' },
  ]

  const NAZAR_KARTALAR = [
    { icon: '🧑‍🤝‍🧑', title: "Bemor bo'limi", desc: 'Tanishish uchun', href: '/student/bemor-bolimi' },
    { icon: '👨‍⚕️', title: "Shifokor bo'limi", desc: 'Tanishish uchun', href: '/student/shifokor-bolimi' },
  ]

  return (
    <>
      <style>{`
        .db-wrap { max-width: 1000px; margin: 0 auto; padding: 24px 24px; }
        .db-hero { display: grid; grid-template-columns: 1fr 1.3fr; gap: 20px; align-items: stretch; margin-bottom: 28px; }
        .db-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
        @media (max-width: 680px) {
          .db-hero { grid-template-columns: 1fr; }
          .db-cards { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 420px) {
          .db-wrap { padding: 16px 16px 0; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
        <Header {...(profile.role === 'admin' ? { backHref: '/admin/dashboard', backLabel: 'Admin paneli' } : {})} />

        <div className="db-wrap">

          {/* Salom + ism — griddan tashqarida */}
          <div style={{ marginBottom: '16px' }}>
            <p className="rise" style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '3px', fontWeight: 500 }}>
              Xush kelibsiz 👋
            </p>
            <h1 className="rise" style={{ fontSize: '26px', lineHeight: 1.2, margin: 0, animationDelay: '.03s' }}>
              {profile.full_name}
            </h1>
          </div>

          {/* HERO: chap — rank+progress, o'ng — banner */}
          <div className="db-hero">

            {/* Chap: rank + progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'space-between' }}>
              <div className="rise" style={{ animationDelay: '.05s' }}>
                <RankCard rank={rank} />
              </div>

              <div className="rise" style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                padding: '16px 18px', animationDelay: '.08s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-soft)' }}>O&apos;zlashtirish</span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>{bajarilganSoni}/{jamiDars}</span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{
                    height: '100%', borderRadius: '999px', width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width .5s ease',
                  }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{progress}% yakunlangan</span>
              </div>
            </div>

            {/* O'ng: banner */}
            <div className="rise db-banner" style={{ animationDelay: '.04s' }}>
              <BannerCarousel role={profile.role} />
            </div>

          </div>

          {/* Bo'limlar */}
          <p className="rise" style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, margin: '0 0 12px', animationDelay: '.1s' }}>
            📌 Bo&apos;limlar
          </p>
          <div className="db-cards">
            {KARTALAR.map((item, i) => (
              <div
                key={item.title}
                onClick={() => router.push(item.href)}
                className="dash-card rise"
                style={{ ['--c' as any]: item.c, animationDelay: `${0.1 + i * 0.04}s`, cursor: 'pointer' }}
              >
                <div className="dash-icon">
                  {(item as any).imgSrc
                    ? <img src={(item as any).imgSrc} alt={item.title} style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }} />
                    : item.icon}
                </div>
                <h3 className="dash-title">{item.title}</h3>
                <p className="dash-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Nazar solish */}
          <p className="rise" style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 700, margin: '0 0 10px', animationDelay: '.26s' }}>
            👁️ Nazar solish
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {NAZAR_KARTALAR.map((item, i) => (
              <div
                key={item.title}
                onClick={() => router.push(item.href)}
                className="rise soft-press"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                  padding: '10px 16px', opacity: 0.8, animationDelay: `${0.28 + i * 0.04}s`,
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
    </>
  )
}
