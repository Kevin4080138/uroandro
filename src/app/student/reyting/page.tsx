'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { createClient } from '@/lib/supabase'
import { SkeletonRow } from '@/components/Skeleton'

type Natija = { student_id: string; foiz: number; created_at: string }
type ReytingQatori = { studentId: string; ism: string; urinishSoni: number; ortachaFoiz: number }
type Oraliq = 'umumiy' | 'kun' | 'hafta' | 'oy' | 'yil'

const ORALIQLAR: { id: Oraliq; nom: string }[] = [
  { id: 'umumiy', nom: 'Umumiy' },
  { id: 'kun', nom: 'Kun' },
  { id: 'hafta', nom: 'Hafta' },
  { id: 'oy', nom: 'Oy' },
  { id: 'yil', nom: 'Yil' },
]

function oraliqBoshlanishi(oraliq: Oraliq): Date | null {
  const hozir = new Date()
  switch (oraliq) {
    case 'kun': return new Date(hozir.getFullYear(), hozir.getMonth(), hozir.getDate())
    case 'hafta': { const d = new Date(hozir); d.setDate(d.getDate() - 7); return d }
    case 'oy': { const d = new Date(hozir); d.setMonth(d.getMonth() - 1); return d }
    case 'yil': { const d = new Date(hozir); d.setFullYear(d.getFullYear() - 1); return d }
    default: return null
  }
}

const PODIUM_RANG = ['linear-gradient(135deg, #f5c518, #d4960a)', 'linear-gradient(135deg, #b8bec7, #8b9099)', 'linear-gradient(135deg, #d98a4f, #b5612a)']
const PODIUM_BALANDLIK = [120, 90, 70]

export default function ReytingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [hammaNatijalar, setHammaNatijalar] = useState<Natija[]>([])
  const [ismlar, setIsmlar] = useState<Record<string, string>>({})
  const [ozId, setOzId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [oraliq, setOraliq] = useState<Oraliq>('umumiy')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setOzId(user.id)

      const { data: natijalar } = await supabase
        .from('talim_natijalari')
        .select('student_id, foiz, created_at')
        .neq('turi', 'nazorat')
      setHammaNatijalar((natijalar as Natija[]) ?? [])

      const studentIds = Array.from(new Set((natijalar ?? []).map((n) => n.student_id)))
      const { data: profillar } = studentIds.length
        ? await supabase.from('profiles').select('id, full_name').in('id', studentIds)
        : { data: [] }
      const ismMap: Record<string, string> = {}
      for (const p of profillar ?? []) ismMap[p.id] = p.full_name
      setIsmlar(ismMap)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const royxat = useMemo(() => {
    const boshlanish = oraliqBoshlanishi(oraliq)
    const filtrlangan = boshlanish ? hammaNatijalar.filter((n) => new Date(n.created_at) >= boshlanish) : hammaNatijalar

    const guruh: Record<string, { soni: number; foizYigindi: number }> = {}
    for (const n of filtrlangan) {
      const g = (guruh[n.student_id] ??= { soni: 0, foizYigindi: 0 })
      g.soni += 1
      g.foizYigindi += n.foiz
    }

    const qatorlar: ReytingQatori[] = Object.keys(guruh).map((id) => ({
      studentId: id,
      ism: ismlar[id] ?? "Noma'lum talaba",
      urinishSoni: guruh[id].soni,
      ortachaFoiz: Math.round(guruh[id].foizYigindi / guruh[id].soni),
    }))
    qatorlar.sort((a, b) => b.urinishSoni - a.urinishSoni || b.ortachaFoiz - a.ortachaFoiz)
    return qatorlar
  }, [hammaNatijalar, ismlar, oraliq])

  const podium = [royxat[1], royxat[0], royxat[2]] // 2, 1, 3 tartibida (markazda birinchi)
  const qolganlar = royxat.slice(3)

  const harf = (ism: string) => (ism.trim()[0] ?? '?').toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>🏆 Reyting</h2>
        <p className="rise" style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Faollik bo&apos;yicha — qancha ko&apos;p test ishlasangiz, reytingingiz shuncha yuqori bo&apos;ladi.
          (Nazorat testlari reytingga kirmaydi.)
        </p>

        <div className="rise" style={{ display: 'flex', gap: '8px', marginBottom: '26px', flexWrap: 'wrap', animationDelay: '.08s' }}>
          {ORALIQLAR.map((o) => (
            <button
              key={o.id}
              onClick={() => setOraliq(o.id)}
              className="soft-press"
              style={{
                background: oraliq === o.id ? 'var(--accent)' : 'var(--surface-2)',
                color: oraliq === o.id ? 'white' : 'var(--ink-soft)',
                border: oraliq === o.id ? 'none' : '1px solid var(--line)',
                borderRadius: '999px', padding: '8px 18px', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', transition: 'all .18s ease',
              }}
            >
              {o.nom}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : royxat.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📊</div>
            <p style={{ margin: 0 }}>Bu oraliqda hali hech kim test ishlamagan.</p>
          </div>
        ) : (
          <>
            {/* Podium — top 3 */}
            <div className="rise" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
              {podium.map((q, podiumI) => {
                if (!q) return <div key={podiumI} style={{ flex: 1, maxWidth: '120px' }} />
                const haqiqiyOrin = podiumI === 1 ? 0 : podiumI === 0 ? 1 : 2
                const oz = q.studentId === ozId
                return (
                  <div key={q.studentId} style={{ flex: 1, maxWidth: '120px', textAlign: 'center' }}>
                    {haqiqiyOrin === 0 && <div style={{ fontSize: '22px', marginBottom: '2px' }}>👑</div>}
                    <div style={{
                      width: haqiqiyOrin === 0 ? '64px' : '52px', height: haqiqiyOrin === 0 ? '64px' : '52px',
                      borderRadius: '50%', background: PODIUM_RANG[haqiqiyOrin], color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: haqiqiyOrin === 0 ? '24px' : '19px',
                      fontWeight: 800, margin: '0 auto 8px', border: oz ? '3px solid var(--accent)' : 'none',
                      boxShadow: '0 4px 14px rgba(0,0,0,.18)',
                    }}>
                      {harf(q.ism)}
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {q.ism}{oz && ' (siz)'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>{q.urinishSoni} test</div>
                    <div style={{
                      height: `${PODIUM_BALANDLIK[haqiqiyOrin]}px`, borderRadius: '10px 10px 0 0',
                      background: PODIUM_RANG[haqiqiyOrin], display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'center', paddingTop: '8px', color: 'white', fontWeight: 800, fontSize: '20px',
                    }}>
                      {haqiqiyOrin + 1}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* #4 va undan keyingilar */}
            {qolganlar.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {qolganlar.map((q, i) => {
                  const oz = q.studentId === ozId
                  return (
                    <div key={q.studentId} className="rise lift" style={{
                      animationDelay: `${Math.min(i * 0.04, 0.3)}s`,
                      background: oz ? 'var(--accent-soft)' : 'var(--surface)',
                      border: oz ? '1px solid var(--accent)' : '1px solid var(--line)',
                      borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                      <div style={{ width: '26px', textAlign: 'center', fontSize: '13px', fontWeight: 800, color: 'var(--muted)' }}>
                        #{i + 4}
                      </div>
                      <div style={{
                        width: '34px', height: '34px', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0,
                      }}>
                        {harf(q.ism)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{q.ism}{oz && ' (siz)'}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>O&apos;rtacha {q.ortachaFoiz}%</div>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>
                        {q.urinishSoni} <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>test</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
