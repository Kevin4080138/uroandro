'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { DoriEslatmaKartasi } from '@/components/DoriEslatmaKartasi'
import { BildirishnomalarPaneli } from '@/components/BildirishnomalarPaneli'
import { Onboarding } from '@/components/Onboarding'
import { BannerCarousel } from '@/components/BannerCarousel'

export default function PatientDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    getProfile()
  }, [])

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
    </div>
  )

  const nav = (href: string) => router.push(href)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Onboarding ism={profile.full_name} />
      <Header {...(profile.role === 'admin' ? { backHref: '/admin/dashboard', backLabel: 'Admin paneli' } : {})} />

      <div style={{ padding: '28px 24px 48px', maxWidth: 680, margin: '0 auto' }}>
        <BannerCarousel role={profile.role} />

        {/* Salom */}
        <p className="rise" style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '4px', fontWeight: 500 }}>
          Salom 👋
        </p>
        <h1 className="rise" style={{ fontSize: '28px', marginBottom: '24px', lineHeight: 1.2 }}>
          {profile.full_name}
        </h1>

        {/* Bildirishnomalar */}
        <BildirishnomalarPaneli />
        <DoriEslatmaKartasi />

        {/* ── Asosiy 2 ta katta tugma ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

          <button
            onClick={() => nav('/patient/murojaat')}
            className="rise"
            style={{
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: 18, padding: '22px 18px',
              cursor: 'pointer', textAlign: 'left', animationDelay: '.0s',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 28px rgba(37,99,235,.35)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>🩺</div>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, lineHeight: 1.2 }}>Yangi murojaat</div>
            <div style={{ fontSize: 12, opacity: .8, lineHeight: 1.4 }}>Shikoyatingizni shifokorga yuboring</div>
          </button>

          <button
            onClick={() => nav('/patient/murojaatlarim')}
            className="rise"
            style={{
              background: 'var(--surface)', color: 'var(--ink)',
              border: '1.5px solid var(--accent)',
              borderRadius: 18, padding: '22px 18px',
              cursor: 'pointer', textAlign: 'left', animationDelay: '.05s',
              transition: 'transform .2s, box-shadow .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>📨</div>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, lineHeight: 1.2 }}>Murojaatlarim</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>Javoblar va holat</div>
          </button>
        </div>

        {/* ── Kichik 4 ta karta ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
          {[
            { icon: '🗓', title: 'Navbat olish', desc: 'Shifokorga onlayn yozilish', href: '/patient/navbat', c: '#059669' },
            { icon: '💊', title: 'Dorilarim', desc: 'Retsept va eslatmalar', href: '/patient/dorilarim', c: '#8b5cf6' },
            { icon: '🧪', title: 'Qaysi tahlil?', desc: 'Shikoyatga qarab', href: '/patient/qaysi-tahlil', c: '#0891b2' },
            { icon: '🩻', title: 'O\'z-o\'zini tekshirish', desc: 'Yo\'riqnoma + kalkulyator', href: '/patient/oz-tekshiruv', c: '#2563eb' },
            { icon: '❓', title: 'Savol-javob', desc: 'Ko\'p so\'raladigan savollar', href: '/patient/savollar', c: '#d97706' },
          ].map((item, i) => (
            <button
              key={item.title}
              onClick={() => nav(item.href)}
              className="rise"
              style={{
                background: 'var(--surface)', border: '1px solid var(--line)',
                borderRadius: 14, padding: '16px 14px',
                cursor: 'pointer', textAlign: 'left',
                animationDelay: `${0.1 + i * 0.05}s`,
                transition: 'transform .2s, border-color .2s, box-shadow .2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-2px)'
                el.style.borderColor = item.c
                el.style.boxShadow = `0 6px 18px ${item.c}22`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = ''
                el.style.borderColor = ''
                el.style.boxShadow = ''
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, marginBottom: 10,
                background: `${item.c}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 2, lineHeight: 1.25 }}>{item.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.35 }}>{item.desc}</div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
