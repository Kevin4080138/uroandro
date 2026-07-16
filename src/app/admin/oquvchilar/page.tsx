'use client'

// O'quvchilar reytingi — barcha talabalar faollik balli bo'yicha saralangan.
// Ball = test urinishlari (nazoratsiz) + tugallangan darslar×5 + o'tilgan nazoratlar×10.

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { darsTugadimi } from '@/lib/talim/useDarsProgress'

type ProgressQator = { student_id: string; dars_slug: string; qadam: string }
type NatijaQator = { student_id: string; dars_slug: string; foiz: number; turi: string }
type Profil = { id: string; full_name: string | null; email: string | null }

export default function AdminOquvchilarPage() {
  const supabase = createClient()
  const router = useRouter()
  const [talabalar, setTalabalar] = useState<Profil[]>([])
  const [progresslar, setProgresslar] = useState<ProgressQator[]>([])
  const [natijalar, setNatijalar] = useState<NatijaQator[]>([])
  const [yuklandi, setYuklandi] = useState(false)
  const [qidiruv, setQidiruv] = useState('')

  useEffect(() => {
    const yukla = async () => {
      const [p, pr, n] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email').eq('role', 'student').eq('arxivlangan', false),
        supabase.from('dars_qadam_progress').select('student_id, dars_slug, qadam'),
        supabase.from('talim_natijalari').select('student_id, dars_slug, foiz, turi'),
      ])
      setTalabalar((p.data as Profil[]) ?? [])
      setProgresslar((pr.data as ProgressQator[]) ?? [])
      setNatijalar((n.data as NatijaQator[]) ?? [])
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reyting = useMemo(() => {
    const prByStudent = new Map<string, ProgressQator[]>()
    for (const r of progresslar) {
      const arr = prByStudent.get(r.student_id) ?? []
      arr.push(r)
      prByStudent.set(r.student_id, arr)
    }
    const ntByStudent = new Map<string, NatijaQator[]>()
    for (const r of natijalar) {
      const arr = ntByStudent.get(r.student_id) ?? []
      arr.push(r)
      ntByStudent.set(r.student_id, arr)
    }

    return talabalar.map((t) => {
      const pr = prByStudent.get(t.id) ?? []
      const nt = ntByStudent.get(t.id) ?? []

      const darslar = new Map<string, Set<string>>()
      for (const r of pr) {
        const s = darslar.get(r.dars_slug) ?? new Set<string>()
        s.add(r.qadam)
        darslar.set(r.dars_slug, s)
      }
      let tugallangan = 0
      darslar.forEach((s) => { if (darsTugadimi(s)) tugallangan++ })

      const mashqlar = nt.filter((r) => r.turi !== 'nazorat')
      const nazoratOtgan = new Set(nt.filter((r) => r.turi === 'nazorat' && Number(r.foiz) >= 70).map((r) => r.dars_slug)).size
      const ortacha = mashqlar.length
        ? Math.round(mashqlar.reduce((s, r) => s + Number(r.foiz), 0) / mashqlar.length)
        : null

      return {
        profil: t,
        tugallangan,
        urinishlar: mashqlar.length,
        nazoratOtgan,
        ortacha,
        ball: mashqlar.length + tugallangan * 5 + nazoratOtgan * 10,
      }
    }).sort((a, b) => b.ball - a.ball || (b.ortacha ?? 0) - (a.ortacha ?? 0))
  }, [talabalar, progresslar, natijalar])

  const korinadigan = useMemo(() => {
    if (!qidiruv.trim()) return reyting
    const q = qidiruv.trim().toLowerCase()
    return reyting.filter((x) =>
      (x.profil.full_name ?? '').toLowerCase().includes(q) ||
      (x.profil.email ?? '').toLowerCase().includes(q)
    )
  }, [reyting, qidiruv])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[900px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>🎓 O&apos;quvchilar reytingi</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          Ball = test urinishlari + tugallangan darslar×5 + o&apos;tilgan nazoratlar×10. Qator bosilsa — batafsil sahifa.
        </p>

        <input
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Ism yoki email..."
          style={{
            width: '100%', maxWidth: '320px', marginBottom: '16px',
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
            padding: '10px 14px', fontSize: '13px', color: 'var(--ink)', outline: 'none',
          }}
        />

        {!yuklandi ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Yuklanmoqda...</p>
        ) : korinadigan.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Talaba topilmadi.</p>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
                    {['#', 'Talaba', 'Ball', 'Tugallangan darslar', 'Urinishlar', "O'rtacha", 'Nazorat'].map((h) => (
                      <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.03em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {korinadigan.map((x) => {
                    const orin = reyting.indexOf(x)
                    return (
                      <tr
                        key={x.profil.id}
                        onClick={() => router.push(`/admin/talabalar-nazorati/${x.profil.id}`)}
                        className="list-row"
                        style={{ borderBottom: '1px solid var(--line)', cursor: 'pointer' }}
                      >
                        <td style={{ padding: '12px 14px', fontSize: '15px', width: '44px' }}>
                          {['🥇', '🥈', '🥉'][orin] ?? <span style={{ fontSize: '12.5px', color: 'var(--muted)', fontWeight: 700 }}>{orin + 1}</span>}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700 }}>{x.profil.full_name ?? '—'}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{x.profil.email ?? ''}</div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '13px', fontWeight: 900, color: 'var(--accent)',
                            background: 'var(--surface-2)', borderRadius: '999px', padding: '4px 12px',
                          }}>{x.ball}</span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800 }}>{x.tugallangan}</td>
                        <td style={{ padding: '12px 14px' }}>{x.urinishlar}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: x.ortacha === null ? 'var(--muted)' : x.ortacha >= 70 ? '#16a34a' : x.ortacha >= 50 ? '#d97706' : '#dc2626' }}>
                          {x.ortacha === null ? '—' : `${x.ortacha}%`}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {x.nazoratOtgan > 0
                            ? <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', background: '#16a34a14', borderRadius: '999px', padding: '3px 10px' }}>🎓 {x.nazoratOtgan}</span>
                            : <span style={{ color: 'var(--muted)' }}>—</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
