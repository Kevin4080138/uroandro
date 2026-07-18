'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { DARSLAR, darsTop, BOSQICH_YOLI, type Bosqich } from '@/lib/talim/darslar'
import { BOSQICH_QADAMLARI, darsTugadimi } from '@/lib/talim/useDarsProgress'
import { BannerHero } from '@/components/BannerHero'
import { SkeletonDashboard } from '@/components/Skeleton'
import { RankCard } from '@/components/RankBadge'
import { getRank, getProgressData } from '@/lib/rank'

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [natijalarList, setNatijalarList] = useState<{ dars_slug: string }[]>([])
  // Qadam progressi: slug -> tugallangan qadamlar; oxirgi faollik darsi "Davom ettirish" uchun
  const [qadamProgress, setQadamProgress] = useState<Map<string, Set<string>>>(new Map())
  const [oxirgiSlug, setOxirgiSlug] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      const [{ data: natijalar }, { data: qadamlar }] = await Promise.all([
        supabase.from('talim_natijalari').select('dars_slug').eq('student_id', user.id),
        supabase.from('dars_qadam_progress').select('dars_slug, qadam, created_at').eq('student_id', user.id).order('created_at', { ascending: false }),
      ])
      setNatijalarList(natijalar ?? [])
      const m = new Map<string, Set<string>>()
      for (const r of qadamlar ?? []) {
        const s = m.get(r.dars_slug) ?? new Set<string>()
        s.add(r.qadam)
        m.set(r.dars_slug, s)
      }
      setQadamProgress(m)
      setOxirgiSlug(qadamlar?.[0]?.dars_slug ?? null)
    }
    getProfile()
  }, [])

  if (!profile) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <SkeletonDashboard />
    </div>
  )

  const rank = getRank(getProgressData(natijalarList))

  // Bosqich kesimidagi progress: tugallangan (nazariya+amaliy) darslar soni
  const BOSQICH_MA: { id: Bosqich; nom: string; emoji: string; rang: string }[] = [
    { id: 'oson', nom: 'Oson', emoji: '🟢', rang: '#16a34a' },
    { id: "o'rta", nom: "O'rta", emoji: '🟡', rang: '#d97706' },
    { id: 'qiyin', nom: 'Qiyin', emoji: '🔴', rang: '#dc2626' },
  ]
  const bosqichProgress = BOSQICH_MA.map((b) => {
    const jami = DARSLAR.filter((d) => d.bosqich === b.id).length
    let tugadi = 0
    qadamProgress.forEach((s, slug) => {
      if (darsTop(slug)?.bosqich === b.id && darsTugadimi(s)) tugadi++
    })
    return { ...b, tugadi, jami }
  })
  const jamiTugadi = bosqichProgress.reduce((s, b) => s + b.tugadi, 0)

  // "Davom ettirish": oxirgi faollik bo'lgan dars va uning qadam progressi
  const oxirgiDars = oxirgiSlug ? darsTop(oxirgiSlug) : null
  const oxirgiQadamlar = oxirgiDars ? (BOSQICH_QADAMLARI[oxirgiDars.bosqich] ?? []) : []
  const oxirgiTugallangan = oxirgiSlug
    ? oxirgiQadamlar.filter((q) => qadamProgress.get(oxirgiSlug)?.has(q)).length
    : 0
  const oxirgiTugadi = oxirgiQadamlar.length > 0 && oxirgiTugallangan >= oxirgiQadamlar.length

  const KARTALAR = [
    { icon: '📖', title: 'Darslar', desc: 'Urologiya va andrologiya kurslari', c: 'var(--accent)', href: '/student/darslar' },
    { icon: '📊', title: 'Natijalarim', desc: 'Test natijalari va progress', c: 'var(--good)', href: '/student/natijalarim' },
    { icon: '📚', title: 'Kutubxona', desc: "O'quv materiallar", c: 'var(--warn)', href: '/student/kutubxona' },
    { icon: '🎯', title: "O'zingizni tekshiring", desc: 'Aralash savol va klinik holat', c: 'var(--danger)', href: '/student/ozingizni-tekshiring' },
    { icon: null, imgSrc: '/camu-logo.png', title: "CAMU bo'limi", desc: 'Central Asian Medical University', c: '#1a3a9e', href: '/student/camu' },
    { icon: '🏆', title: 'Reyting', desc: "Faollik bo'yicha reyting", c: 'var(--accent-2)', href: '/student/reyting' },
  ]

  const NAZAR_KARTALAR = [
    { icon: '🧑‍🤝‍🧑', title: "Bemor bo'limi", desc: 'Tanishish uchun', href: '/student/bemor-bolimi' },
    { icon: '👨‍⚕️', title: "Shifokor bo'limi", desc: 'Tanishish uchun', href: '/student/shifokor-bolimi' },
  ]

  return (
    <>
      <style>{`
        .db-wrap { max-width: 1000px; margin: 0 auto; padding: 20px 24px; }
        .db-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: stretch; margin-bottom: 28px; }
        .db-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
        @media (max-width: 680px) {
          .db-hero { grid-template-columns: 1fr; }
          .db-cards { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          /* Telefonda kartalar ixcham: kichik ikonka, tavsifsiz — bir ekranga ko'proq sig'adi */
          .db-cards .dash-card { padding: 14px; }
          .db-cards .dash-icon { width: 38px; height: 38px; font-size: 19px; margin-bottom: 8px; border-radius: 10px; }
          .db-cards .dash-title { font-size: 14px; }
          .db-cards .dash-desc { display: none; }
        }
        @media (max-width: 420px) {
          .db-wrap { padding: 16px 16px 0; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
        <Header {...(profile.role === 'admin' ? { backHref: '/admin/dashboard', backLabel: 'Admin paneli' } : {})} />

        {/* Banner tepada, kontent varaq bo'lib ustidan scroll bo'ladi */}
        <BannerHero role={profile.role}>
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

          {/* Davom ettirish — talabaning keyingi harakati doim birinchi ko'rinadi */}
          <div
            onClick={() => router.push(oxirgiDars && !oxirgiTugadi ? `/student/darslar/${oxirgiDars.slug}` : '/student/darslar')}
            className="rise soft-press"
            style={{
              background: 'linear-gradient(120deg, var(--accent), var(--accent-2))', color: 'white',
              borderRadius: '16px', padding: '16px 18px', marginBottom: '20px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '14px', animationDelay: '.04s',
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '13px', flexShrink: 0,
              background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '21px',
            }}>
              {oxirgiDars ? (oxirgiTugadi ? '🎉' : '▶️') : '🚀'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, opacity: .85, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                {oxirgiDars ? (oxirgiTugadi ? 'Dars tugallandi — keyingisiga o\'ting' : 'Davom ettirish') : 'Boshlash vaqti keldi'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '2px 0 4px' }}>
                {oxirgiDars ? oxirgiDars.sarlavha : 'Birinchi darsni bepul boshlang'}
              </div>
              {oxirgiDars && !oxirgiTugadi && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, maxWidth: '160px', height: '5px', background: 'rgba(255,255,255,.25)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${oxirgiQadamlar.length ? Math.round((oxirgiTugallangan / oxirgiQadamlar.length) * 100) : 0}%`,
                      height: '100%', background: 'white', borderRadius: '999px',
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, opacity: .9 }}>{oxirgiTugallangan}/{oxirgiQadamlar.length} qadam</span>
                </div>
              )}
            </div>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>→</span>
          </div>

          {/* HERO: rank va bosqich progressi yonma-yon (banner endi tepada) */}
          <div className="db-hero">
            <div className="rise" style={{ animationDelay: '.05s' }}>
              <RankCard rank={rank} />
            </div>

            <div className="rise" style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
              padding: '16px 18px', animationDelay: '.08s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-soft)' }}>O&apos;zlashtirish</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)' }}>{jamiTugadi} ta dars tugallandi</span>
              </div>
              {/* Har qator bosilsa o'sha bosqich sahifasiga o'tadi */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {bosqichProgress.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => router.push(`/student/darslar/bosqich/${BOSQICH_YOLI[b.id]}`)}
                    className="soft-press"
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)' }}>{b.emoji} {b.nom}</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: b.rang }}>{b.tugadi}/{b.jami} →</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: '999px',
                        width: `${b.jami ? Math.round((b.tugadi / b.jami) * 100) : 0}%`,
                        background: b.rang, transition: 'width .5s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
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
        </BannerHero>
        <BottomNav />
      </div>
    </>
  )
}
