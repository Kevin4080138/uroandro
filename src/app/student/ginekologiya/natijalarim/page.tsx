'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { BarChart3, CheckCircle2 } from 'lucide-react'

type Natija = { dars_slug: string; ball: number; jami: number; foiz: number; sarlavha: string }

export default function GinNatijalarim() {
  const supabase = createClient()
  const [natijalar, setNatijalar] = useState<Natija[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const [{ data: nat }, { data: darslar }] = await Promise.all([
        supabase.from('gin_natijalar').select('dars_slug, ball, jami, foiz').eq('student_id', user.id).order('updated_at', { ascending: false }),
        supabase.from('gin_darslar').select('slug, sarlavha'),
      ])
      const nomi = new Map((darslar ?? []).map((d: { slug: string; sarlavha: string }) => [d.slug, d.sarlavha]))
      setNatijalar((nat ?? []).map((n: { dars_slug: string; ball: number; jami: number; foiz: number }) => ({ ...n, sarlavha: nomi.get(n.dars_slug) ?? n.dars_slug })))
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ortacha = natijalar.length ? Math.round(natijalar.reduce((s, n) => s + n.foiz, 0) / natijalar.length) : 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
        <h2 style={{ margin: '0 0 5px', fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ color: 'var(--gyn)' }}><BarChart3 size={22} strokeWidth={2} /></span> Ginekologiya — Natijalarim
        </h2>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px' }}>Ginekologiya testlaringiz natijalari.</p>

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : natijalar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'var(--gyn)' }}><BarChart3 size={38} strokeWidth={1.5} /></div>
            <p style={{ margin: 0 }}>Hali test yechmagansiz. Darslarni o&apos;qib, testlarni ishlang.</p>
          </div>
        ) : (
          <>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px', marginBottom: '18px', display: 'flex', gap: '20px' }}>
              <div><div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gyn)' }}>{natijalar.length}</div><div style={{ fontSize: '12px', color: 'var(--muted)' }}>test ishlandi</div></div>
              <div><div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--good)' }}>{ortacha}%</div><div style={{ fontSize: '12px', color: 'var(--muted)' }}>o&apos;rtacha</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {natijalar.map((n) => (
                <div key={n.dars_slug} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '13px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0 0 3px', fontSize: '13.5px', fontWeight: 700 }}>{n.sarlavha}</p>
                    <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--muted)' }}>{n.ball}/{n.jami} to&apos;g&apos;ri</p>
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: n.foiz >= 70 ? 'var(--good)' : 'var(--gyn)', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                    {n.foiz >= 70 && <CheckCircle2 size={15} strokeWidth={2.4} />} {n.foiz}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
