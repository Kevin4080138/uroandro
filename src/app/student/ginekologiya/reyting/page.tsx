'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { Trophy } from 'lucide-react'

type Qator = { student_id: string; ism: string; testlar: number; jamiFoiz: number; ortacha: number; men: boolean }

export default function GinReyting() {
  const supabase = createClient()
  const [qatorlar, setQatorlar] = useState<Qator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: nat } = await supabase.from('gin_natijalar').select('student_id, foiz')
      const agg = new Map<string, { testlar: number; jami: number }>()
      for (const n of (nat ?? []) as { student_id: string; foiz: number }[]) {
        const a = agg.get(n.student_id) ?? { testlar: 0, jami: 0 }
        a.testlar++; a.jami += n.foiz; agg.set(n.student_id, a)
      }
      const ids = [...agg.keys()]
      const { data: profs } = ids.length
        ? await supabase.from('profiles').select('id, full_name').in('id', ids)
        : { data: [] as { id: string; full_name: string | null }[] }
      const ism = new Map((profs ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name ?? 'Talaba']))
      const rows: Qator[] = ids.map((id) => {
        const a = agg.get(id)!
        return { student_id: id, ism: ism.get(id) ?? 'Talaba', testlar: a.testlar, jamiFoiz: a.jami, ortacha: Math.round(a.jami / a.testlar), men: id === user?.id }
      }).sort((x, y) => y.jamiFoiz - x.jamiFoiz)
      setQatorlar(rows)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const medal = (i: number) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
        <h2 style={{ margin: '0 0 5px', fontSize: '22px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ color: 'var(--gyn)' }}><Trophy size={22} strokeWidth={2} /></span> Ginekologiya — Reyting
        </h2>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px' }}>Ginekologiya testlari bo&apos;yicha faollik reytingi.</p>

        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : qatorlar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', color: 'var(--gyn)' }}><Trophy size={38} strokeWidth={1.5} /></div>
            <p style={{ margin: 0 }}>Hali reyting bo&apos;sh — birinchi bo&apos;lib test yeching!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {qatorlar.map((r, i) => (
              <div key={r.student_id} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px', borderRadius: '12px',
                background: r.men ? 'var(--gyn-soft)' : 'var(--surface)',
                border: `1px solid ${r.men ? 'var(--gyn)' : 'var(--line)'}`,
              }}>
                <span style={{ width: '28px', textAlign: 'center', fontSize: i < 3 ? '18px' : '13px', fontWeight: 800, color: 'var(--muted)', flexShrink: 0 }}>{medal(i)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.ism} {r.men && <span style={{ color: 'var(--gyn)', fontSize: '11px' }}>· siz</span>}
                  </p>
                  <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--muted)' }}>{r.testlar} test · o&apos;rtacha {r.ortacha}%</p>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gyn)', flexShrink: 0 }}>{r.jamiFoiz}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
