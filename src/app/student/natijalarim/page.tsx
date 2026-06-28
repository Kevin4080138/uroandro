'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { DARSLAR, BOSQICHLAR } from '@/lib/talim/darslar'

type SertifikatHolati = {
  darsSlug: string; darsNomi: string; engYaxshiFoiz: number; otishFoizi: number; otdimi: boolean; sana: string
}

export default function NatijalarimPage() {
  const router = useRouter()
  const supabase = createClient()
  const [natijalar, setNatijalar] = useState<any[]>([])
  const [sertifikatlar, setSertifikatlar] = useState<SertifikatHolati[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const [{ data }, { data: nazoratlar }] = await Promise.all([
        supabase
          .from('talim_natijalari')
          .select('*')
          .eq('student_id', user.id)
          .neq('turi', 'nazorat')
          .order('created_at', { ascending: false }),
        supabase
          .from('talim_natijalari')
          .select('dars_slug, dars_nomi, foiz, created_at')
          .eq('student_id', user.id)
          .eq('turi', 'nazorat')
          .order('created_at', { ascending: false }),
      ])
      setNatijalar(data ?? [])

      const darsSlugs = Array.from(new Set((nazoratlar ?? []).map((n) => n.dars_slug)))
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
            darsSlug: n.dars_slug, darsNomi: n.dars_nomi, engYaxshiFoiz: n.foiz,
            otishFoizi, otdimi: n.foiz >= otishFoizi, sana: n.created_at,
          }
        }
      }
      setSertifikatlar(Object.values(engYaxshilar))
      setLoading(false)
    }
    load()
  }, [])

  const bosqichSertifikatlari = useMemo(() => {
    const otganSlugSet = new Set(sertifikatlar.filter((s) => s.otdimi).map((s) => s.darsSlug))
    return BOSQICHLAR.map((b) => {
      const darslar = DARSLAR.filter((d) => d.bosqich === b.id)
      const otganSoni = darslar.filter((d) => otganSlugSet.has(d.slug)).length
      return { ...b, jami: darslar.length, otgan: otganSoni, olindi: darslar.length > 0 && otganSoni === darslar.length }
    })
  }, [sertifikatlar])

  const statistika = useMemo(() => {
    const yakunlanganSlug = new Set(natijalar.map((n) => n.dars_slug))
    const ortachaFoiz = natijalar.length ? Math.round(natijalar.reduce((s, n) => s + n.foiz, 0) / natijalar.length) : 0
    return {
      jamiUrinish: natijalar.length,
      darsSoni: yakunlanganSlug.size,
      jamiDars: DARSLAR.length,
      ortachaFoiz,
    }
  }, [natijalar])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 22px', fontSize: '24px', fontWeight: 800 }}>📊 Natijalarim</h2>

        {/* Statistika kartalari */}
        <div className="rise" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', marginBottom: '24px',
          animationDelay: '.05s',
        }}>
          {[
            { label: "O'zlashtirilgan darslar", qiymat: `${statistika.darsSoni}/${statistika.jamiDars}`, rang: 'var(--accent)' },
            { label: 'Jami urinishlar', qiymat: statistika.jamiUrinish, rang: 'var(--accent-2)' },
            { label: "O'rtacha natija", qiymat: `${statistika.ortachaFoiz}%`, rang: statistika.ortachaFoiz >= 70 ? 'var(--good)' : 'var(--warn)' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em' }}>{s.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.rang, marginTop: '4px' }}>{s.qiymat}</div>
            </div>
          ))}
        </div>

        {/* Bosqich sertifikatlari (umumiy) */}
        <div className="rise" style={{ marginBottom: '24px', animationDelay: '.06s' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>🎓 Bosqich sertifikatlari</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bosqichSertifikatlari.map((b) => (
              <div key={b.id} className="rise" style={{
                background: 'var(--surface)', border: `1px solid ${b.olindi ? 'var(--good)' : 'var(--line)'}`,
                borderRadius: '14px', padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '14px' }}>{b.emoji} {b.nom}</strong>
                  {b.olindi ? (
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--good)' }}>🏆 Sertifikat olindi</span>
                  ) : (
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warn)' }}>
                      {b.otgan}/{b.jami} mavzu bajarildi
                    </span>
                  )}
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '999px', transition: 'width .3s ease',
                    background: b.olindi ? 'var(--good)' : 'var(--accent)',
                    width: `${b.jami ? Math.round((b.otgan / b.jami) * 100) : 0}%`,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mavzu bo'yicha sertifikat tafsilotlari */}
        {sertifikatlar.length > 0 && (
          <div className="rise" style={{ marginBottom: '24px', animationDelay: '.08s' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>🏅 Mavzu sertifikatlari (tafsilot)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sertifikatlar.map((s) => (
                <div key={s.darsSlug} className="rise" style={{
                  background: 'var(--surface)', border: `1px solid ${s.otdimi ? 'var(--good)' : 'var(--line)'}`,
                  borderRadius: '14px', padding: '16px 20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '14px' }}>{s.darsNomi}</strong>
                    {s.otdimi ? (
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--good)' }}>🏆 Sertifikat olindi</span>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warn)' }}>
                        Yana {Math.max(0, s.otishFoizi - s.engYaxshiFoiz)}% kerak
                      </span>
                    )}
                  </div>
                  <div style={{ height: '8px', borderRadius: '999px', background: 'var(--surface-2)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '999px', transition: 'width .3s ease',
                      background: s.otdimi ? 'var(--good)' : 'var(--accent)',
                      width: `${Math.min(100, Math.round((s.engYaxshiFoiz / s.otishFoizi) * 100))}%`,
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--muted)' }}>
                    <span>Eng yaxshi natija: {s.engYaxshiFoiz}%</span>
                    <span>O&apos;tish chegarasi: {s.otishFoizi}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : natijalar.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📝</div>
            <p style={{ margin: '0 0 16px' }}>Hali test topshirmagansiz.</p>
            <button onClick={() => router.push('/student/darslar')} className="soft-press" style={{
              background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>
              Darslarni boshlash →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {natijalar.map((n, i) => (
              <div key={n.id} className="rise lift" style={{
                animationDelay: `${Math.min(i * 0.04, 0.3)}s`,
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap',
                cursor: 'pointer',
              }}
                onClick={() => router.push(`/student/darslar/${n.dars_slug}`)}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{n.dars_nomi}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                    {new Date(n.created_at).toLocaleString('uz-UZ')}
                  </div>
                </div>
                <div style={{
                  fontSize: '15px', fontWeight: 800,
                  color: n.foiz >= 80 ? 'var(--good)' : n.foiz >= 60 ? 'var(--warn)' : 'var(--danger)',
                  flexShrink: 0,
                }}>
                  {n.togri_son}/{n.jami_savol} ({n.foiz}%)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
