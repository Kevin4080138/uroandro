'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { DoriEslatmaKartasi } from '@/components/DoriEslatmaKartasi'
import { BildirishnomalarPaneli } from '@/components/BildirishnomalarPaneli'
import { Onboarding } from '@/components/Onboarding'
import { BannerHero } from '@/components/BannerHero'
import { BannerCarousel } from '@/components/BannerCarousel'
import {
  MessageSquare, CalendarClock, Hourglass, Stethoscope, Inbox, Building2,
  Bandage, Pill, TestTube, Activity, HelpCircle, ArrowRight, type LucideIcon,
} from 'lucide-react'

type HolatKarta = { Icon: LucideIcon; sarlavha: string; matn: string; href: string }

export default function PatientDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [holatKarta, setHolatKarta] = useState<HolatKarta | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)

      // Holat kartasi: bemor uchun eng muhim keyingi harakatni aniqlaymiz.
      // Ustuvorlik: shifokor javobi > yaqin navbat > kutilayotgan murojaat > yangi murojaat taklifi.
      const bugun = new Date().toISOString().slice(0, 10)
      const [{ data: murojaatlar }, { data: navbatlar }] = await Promise.all([
        supabase.from('murojaatlar').select('javob, holat, created_at').order('created_at', { ascending: false }).limit(1),
        supabase.from('navbatlar').select('sana, vaqt, holat').gte('sana', bugun).neq('holat', 'bekor').order('sana').order('vaqt').limit(1),
      ])
      const m = murojaatlar?.[0]
      const n = navbatlar?.[0]
      if (m?.javob) {
        setHolatKarta({ Icon: MessageSquare, sarlavha: 'Shifokordan javob keldi', matn: "Murojaatingizga javob yozildi — o'qib chiqing", href: '/patient/murojaatlarim' })
      } else if (n) {
        const sana = new Date(n.sana).toLocaleDateString('uz-UZ', { month: 'long', day: 'numeric' })
        setHolatKarta({ Icon: CalendarClock, sarlavha: 'Yaqin navbatingiz', matn: `${sana}, soat ${String(n.vaqt).slice(0, 5)} — unutmang!`, href: '/patient/navbat' })
      } else if (m) {
        setHolatKarta({ Icon: Hourglass, sarlavha: "Murojaatingiz ko'rib chiqilmoqda", matn: 'Shifokor javob yozishi bilan xabar beramiz', href: '/patient/murojaatlarim' })
      } else {
        setHolatKarta({ Icon: Stethoscope, sarlavha: 'Shikoyatingiz bormi?', matn: 'Shifokorga yozing — tez orada javob olasiz', href: '/patient/murojaat' })
      }
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

      {/* Banner tepada, kontent varaq bo'lib ustidan scroll bo'ladi */}
      <BannerHero role={profile.role} maxWidth={680}>
      <div className="mx-auto max-w-[680px] px-4 pb-12 pt-5 sm:px-6">

        {/* Banner — faqat desktopda oqim ichida (telefonda BannerHero tepada ko'rsatadi) */}
        <div className="hidden min-[681px]:block">
          <BannerCarousel role={profile.role} />
        </div>

        {/* Salom */}
        <p className="rise" style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '4px', fontWeight: 500 }}>
          Salom 👋
        </p>
        <h1 className="rise text-2xl sm:text-[28px]" style={{ marginBottom: '20px', lineHeight: 1.2 }}>
          {profile.full_name}
        </h1>

        {/* Holat kartasi — bemorning keyingi harakati doim birinchi ko'rinadi */}
        {holatKarta && (
          <div
            onClick={() => nav(holatKarta.href)}
            className="rise soft-press"
            style={{
              background: 'linear-gradient(120deg, var(--accent), var(--accent-2))', color: 'white',
              borderRadius: 16, padding: '15px 17px', marginBottom: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 13,
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><holatKarta.Icon size={21} strokeWidth={2} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{holatKarta.sarlavha}</div>
              <div style={{ fontSize: 12, opacity: .85, lineHeight: 1.4 }}>{holatKarta.matn}</div>
            </div>
            <ArrowRight size={18} strokeWidth={2.2} style={{ flexShrink: 0 }} />
          </div>
        )}

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
            <div style={{ marginBottom: 10 }}><Stethoscope size={28} strokeWidth={2} /></div>
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
            <div style={{ marginBottom: 10, color: 'var(--accent)' }}><Inbox size={28} strokeWidth={2} /></div>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, lineHeight: 1.2 }}>Murojaatlarim</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>Javoblar va holat</div>
          </button>
        </div>

        {/* ── Kichik 4 ta karta ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
          {[
            { Icon: CalendarClock, title: 'Navbat olish', desc: 'Shifokorga onlayn yozilish', href: '/patient/navbat', c: '#059669' },
            { Icon: Building2, title: 'Operatsiyalar', desc: 'Oddiy tilda tushuntirish', href: '/patient/operatsiyalar', c: '#0d9488' },
            { Icon: Bandage, title: 'Operatsiya kuzatuvim', desc: 'Tiklanish bosqichlari', href: '/patient/operatsiya-kuzatuvim', c: '#e11d48' },
            { Icon: Pill, title: 'Dorilarim', desc: 'Retsept va eslatmalar', href: '/patient/dorilarim', c: '#8b5cf6' },
            { Icon: TestTube, title: 'Qaysi tahlil?', desc: 'Shikoyatga qarab', href: '/patient/qaysi-tahlil', c: '#0891b2' },
            { Icon: Activity, title: 'O\'z-o\'zini tekshirish', desc: 'Yo\'riqnoma + kalkulyator', href: '/patient/oz-tekshiruv', c: '#2563eb' },
            { Icon: HelpCircle, title: 'Savol-javob', desc: 'Ko\'p so\'raladigan savollar', href: '/patient/savollar', c: '#d97706' },
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
                // Kartalar soni toq — oxirgisi ikki ustunni egallab, yetim katak qolmaydi
                gridColumn: i === 6 ? 'span 2' : undefined,
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
                background: `${item.c}18`, color: item.c,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <item.Icon size={19} strokeWidth={2} />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 2, lineHeight: 1.25 }}>{item.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.35 }}>{item.desc}</div>
            </button>
          ))}
        </div>

      </div>
      </BannerHero>
    </div>
  )
}
