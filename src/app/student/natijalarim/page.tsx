'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { DARSLAR } from '@/lib/talim/darslar'

export default function NatijalarimPage() {
  const router = useRouter()
  const supabase = createClient()
  const [natijalar, setNatijalar] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase
        .from('talim_natijalari')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
      setNatijalar(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

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
