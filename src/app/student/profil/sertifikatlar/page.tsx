'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { DARSLAR, BOSQICHLAR } from '@/lib/talim/darslar'

type SertifikatHolati = {
  darsSlug: string
  darsNomi: string
  engYaxshiFoiz: number
  otishFoizi: number
  otdimi: boolean
  sana: string
}

type Profile = { full_name: string; avatar_url: string | null }

function formatSana(iso: string) {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

const BOSQICH_RANG: Record<string, { bg: string; text: string; border: string }> = {
  oson:    { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
  "o'rta": { bg: '#fef9c3', text: '#ca8a04', border: '#fde047' },
  qiyin:   { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
}

function SertifikatKarta({ s, profile }: { s: SertifikatHolati; profile: Profile }) {
  const dars = DARSLAR.find(d => d.slug === s.darsSlug)
  const bosqich = dars?.bosqich ?? 'oson'
  const rang = BOSQICH_RANG[bosqich] ?? BOSQICH_RANG['oson']
  const harf = (profile.full_name?.trim()?.[0] ?? '?').toUpperCase()

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${rang.border}`,
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      {/* Yuqori chiziq */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${rang.text}, ${rang.border})` }} />

      <div style={{ padding: '20px' }}>
        {/* Sarlavha */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: rang.bg, color: rang.text, borderRadius: '6px',
                padding: '2px 10px', fontSize: '11px', fontWeight: 700,
              }}>
                {BOSQICHLAR.find(b => b.id === bosqich)?.emoji} {BOSQICHLAR.find(b => b.id === bosqich)?.nom}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.4 }}>
              {s.darsNomi}
            </h3>
          </div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${rang.text}, ${rang.border})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
          }}>
            🏅
          </div>
        </div>

        {/* Foydalanuvchi */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 14px',
          marginBottom: '14px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #2563eb, #0891b2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 800, color: 'white', overflow: 'hidden',
          }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : harf
            }
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>{profile.full_name}</p>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>Urosfera talabasi</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: rang.text }}>{s.engYaxshiFoiz}%</p>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted)' }}>{s.otishFoizi}% talab</p>
          </div>
        </div>

        {/* Sana */}
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
          📅 {formatSana(s.sana)} · Urosfera.uz
        </p>
      </div>
    </div>
  )
}

export default function SertifikatlarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [sertifikatlar, setSertifikatlar] = useState<SertifikatHolati[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const [{ data: profData }, { data: nazoratlar }] = await Promise.all([
        supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).maybeSingle(),
        supabase.from('talim_natijalari')
          .select('dars_slug, dars_nomi, foiz, created_at')
          .eq('student_id', user.id)
          .eq('turi', 'nazorat')
          .order('created_at', { ascending: false }),
      ])

      setProfile(profData as Profile)

      const darsSlugs = Array.from(new Set((nazoratlar ?? []).map(n => n.dars_slug)))
      const { data: tarkiblar } = darsSlugs.length
        ? await supabase.from('dars_tarkibi').select('dars_slug, sertifikat_otish_foizi').in('dars_slug', darsSlugs)
        : { data: [] }

      const otishMap: Record<string, number> = {}
      for (const t of tarkiblar ?? []) otishMap[t.dars_slug] = t.sertifikat_otish_foizi ?? 70

      const engYaxshilar: Record<string, SertifikatHolati> = {}
      for (const n of nazoratlar ?? []) {
        const mavjud = engYaxshilar[n.dars_slug]
        if (!mavjud || n.foiz > mavjud.engYaxshiFoiz) {
          const otishFoizi = otishMap[n.dars_slug] ?? 70
          engYaxshilar[n.dars_slug] = {
            darsSlug: n.dars_slug, darsNomi: n.dars_nomi,
            engYaxshiFoiz: n.foiz, otishFoizi,
            otdimi: n.foiz >= otishFoizi, sana: n.created_at,
          }
        }
      }
      setSertifikatlar(Object.values(engYaxshilar))
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { olingan, kutilmoqda } = useMemo(() => ({
    olingan: sertifikatlar.filter(s => s.otdimi),
    kutilmoqda: sertifikatlar.filter(s => !s.otdimi),
  }), [sertifikatlar])

  const bosqichSertifikatlari = useMemo(() => {
    const otganSlugSet = new Set(olingan.map(s => s.darsSlug))
    return BOSQICHLAR.map(b => {
      const darslar = DARSLAR.filter(d => d.bosqich === b.id)
      const otgan = darslar.filter(d => otganSlugSet.has(d.slug)).length
      return { ...b, jami: darslar.length, otgan, olindi: darslar.length > 0 && otgan === darslar.length }
    })
  }, [olingan])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/student/profil" backLabel="Profil" />

      <div className="mx-auto max-w-[600px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>🏅 Sertifikatlar</h2>
          {olingan.length > 0 && (
            <span style={{
              background: '#dcfce7', color: '#16a34a', borderRadius: '20px',
              padding: '4px 12px', fontSize: '13px', fontWeight: 700,
            }}>
              {olingan.length} ta olindi
            </span>
          )}
        </div>

        {/* Bosqich progressi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {bosqichSertifikatlari.map(b => {
            const rang = BOSQICH_RANG[b.id] ?? BOSQICH_RANG['oson']
            const foiz = b.jami > 0 ? Math.round((b.otgan / b.jami) * 100) : 0
            return (
              <div key={b.id} style={{
                background: 'var(--surface)', border: `1px solid ${b.olindi ? rang.border : 'var(--line)'}`,
                borderRadius: '14px', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{b.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{b.nom}</span>
                    {b.olindi && <span style={{ fontSize: '16px' }}>🏆</span>}
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
                    {b.otgan}/{b.jami}
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--line)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '999px',
                    width: `${foiz}%`,
                    background: b.olindi ? rang.text : 'var(--accent)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Olingan sertifikatlar */}
        {olingan.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>✅ Olingan sertifikatlar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {olingan.map(s => (
                <SertifikatKarta key={s.darsSlug} s={s} profile={profile!} />
              ))}
            </div>
          </div>
        )}

        {/* Kutilmoqda */}
        {kutilmoqda.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>⏳ Nazorat topshirilgan, erishilmagan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {kutilmoqda.map(s => (
                <div key={s.darsSlug} style={{
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: '12px', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '24px' }}>😔</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{s.darsNomi}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                      {s.engYaxshiFoiz}% · Talab: {s.otishFoizi}%
                    </p>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 700 }}>
                    -{s.otishFoizi - s.engYaxshiFoiz}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hech narsa yo'q */}
        {sertifikatlar.length === 0 && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: '14px', padding: '48px 20px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '48px', margin: '0 0 12px' }}>🎓</p>
            <p style={{ fontWeight: 700, color: 'var(--ink)', margin: '0 0 8px' }}>Hali sertifikat yo'q</p>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
              Darslarni o'qing, Nazorat testidan o'ting — sertifikat oling!
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
