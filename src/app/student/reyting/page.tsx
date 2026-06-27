'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'

type ReytingQatori = { studentId: string; ism: string; urinishSoni: number; ortachaFoiz: number }

export default function ReytingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [royxat, setRoyxat] = useState<ReytingQatori[]>([])
  const [ozId, setOzId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setOzId(user.id)

      const { data: natijalar } = await supabase
        .from('talim_natijalari')
        .select('student_id, foiz')
        .neq('turi', 'nazorat')
      const guruh: Record<string, { soni: number; foizYigindi: number }> = {}
      for (const n of natijalar ?? []) {
        const g = (guruh[n.student_id] ??= { soni: 0, foizYigindi: 0 })
        g.soni += 1
        g.foizYigindi += n.foiz
      }

      const studentIds = Object.keys(guruh)
      const { data: profillar } = studentIds.length
        ? await supabase.from('profiles').select('id, full_name').in('id', studentIds)
        : { data: [] }
      const ismlar: Record<string, string> = {}
      for (const p of profillar ?? []) ismlar[p.id] = p.full_name

      const qatorlar: ReytingQatori[] = studentIds.map((id) => ({
        studentId: id,
        ism: ismlar[id] ?? "Noma'lum talaba",
        urinishSoni: guruh[id].soni,
        ortachaFoiz: Math.round(guruh[id].foizYigindi / guruh[id].soni),
      }))
      qatorlar.sort((a, b) => b.urinishSoni - a.urinishSoni || b.ortachaFoiz - a.ortachaFoiz)

      setRoyxat(qatorlar)
      setLoading(false)
    }
    load()
  }, [])

  const MEDAL = ['🥇', '🥈', '🥉']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>🏆 Reyting</h2>
        <p className="rise" style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Faollik bo&apos;yicha — qancha ko&apos;p test ishlasangiz, reytingingiz shuncha yuqori bo&apos;ladi.
          (Nazorat testlari reytingga kirmaydi.)
        </p>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : royxat.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
            <p style={{ margin: 0 }}>Hali hech kim test ishlamagan.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {royxat.map((q, i) => {
              const oz = q.studentId === ozId
              return (
                <div key={q.studentId} className="rise lift" style={{
                  animationDelay: `${Math.min(i * 0.04, 0.3)}s`,
                  background: oz ? 'var(--accent-soft)' : 'var(--surface)',
                  border: oz ? '1px solid var(--accent)' : '1px solid var(--line)',
                  borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px',
                }}>
                  <div style={{ width: '32px', textAlign: 'center', fontSize: '16px', fontWeight: 800, color: 'var(--muted)' }}>
                    {MEDAL[i] ?? i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{q.ism}{oz && ' (siz)'}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>O&apos;rtacha {q.ortachaFoiz}%</div>
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>
                    {q.urinishSoni} <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>test</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
