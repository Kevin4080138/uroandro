'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { DoctorBannerStrip } from '@/components/DoctorBannerStrip'
import {
  TrendingUp, Users, Inbox, FileText, Globe, CalendarClock, Bandage,
  ClipboardList, Calculator, Library, BookOpenCheck, ChevronRight,
} from 'lucide-react'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

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

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <UrosferaLoaderMini />
    </div>
  )

  return (
    <AppShell title={profile.full_name}>
      <div className="px-8 py-8">
        <DoctorBannerStrip role={profile.role} />
        <div className="rise" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'var(--muted)', fontWeight: 600, marginBottom: '8px' }}>
          <span>Bosh sahifa</span>
          <ChevronRight size={13} strokeWidth={2} />
          <span style={{ color: 'var(--ink-soft)' }}>Dashboard</span>
        </div>
        <h1 className="rise" style={{ fontSize: '32px', marginBottom: '32px' }}>
          {(() => { const h = new Date().getHours(); return h < 12 ? 'Xayrli tong' : h < 18 ? 'Xayrli kun' : 'Xayrli kech' })()}, Dr. {profile.full_name} 👋
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { Icon: TrendingUp, title: 'Faoliyat paneli', desc: 'Murojaat, navbat, reyting ko\'rsatkichlari', href: '/doctor/faoliyat', c: 'var(--accent)' },
            { Icon: Users, title: 'Bemorlar', desc: "Ro'yxat va yangi qabul", href: '/doctor/patients', c: 'var(--danger)' },
            { Icon: Inbox, title: 'Murojaatlar', desc: 'Bemor shikoyatlari', href: '/doctor/murojaatlar', c: 'var(--accent-2)' },
            { Icon: FileText, title: 'Mening shablonlarim', desc: 'Kasallik tarixi shablonlari', href: '/doctor/shablonlarim', c: 'var(--accent)' },
            { Icon: Globe, title: 'Katalogdagi profilim', desc: 'Xizmatlar, narxlar, reyting', href: '/doctor/ochiq-profil', c: 'var(--good)' },
            { Icon: CalendarClock, title: 'Navbatlar', desc: 'Onlayn yozilgan bemorlar', href: '/doctor/navbatlar', c: 'var(--warn)' },
            { Icon: Bandage, title: 'Operatsiya kuzatuvi', desc: 'Operatsiyadan keyingi eslatmalar', href: '/doctor/operatsiya-kuzatuvi', c: 'var(--danger)' },
            { Icon: ClipboardList, title: 'Protokollar', desc: 'Klinik protokollar', href: '/doctor/protokollar', c: 'var(--accent)' },
            { Icon: Calculator, title: 'Kalkulatorlar', desc: 'Varikotsele usul tanlash, IPSS, PSA', href: '/doctor/calculators', c: 'var(--accent-2)' },
            { Icon: Library, title: 'Kutubxona', desc: 'PDF materiallar', href: '/doctor/kutubxona', c: 'var(--good)' },
            { Icon: BookOpenCheck, title: "Qo'llanmalar", desc: 'EAU, AUA guidelines', href: '/doctor/qollanmalar', c: 'var(--warn)' },
          ].map((item, i) => (
            <div
              key={item.title}
              onClick={() => item.href && router.push(item.href)}
              className="dash-card rise"
              style={{ ['--c' as any]: item.c, animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
            >
              <div className="dash-icon" style={{ color: item.c }}><item.Icon size={25} strokeWidth={2} /></div>
              <h3 className="dash-title">{item.title}</h3>
              <p className="dash-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
