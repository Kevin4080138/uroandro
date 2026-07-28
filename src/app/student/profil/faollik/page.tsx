'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { TrendingUp, ClipboardCheck, Trophy, ClipboardList, BarChart3, BookOpen, ArrowUp, ArrowDown } from 'lucide-react'

type Natija = {
  id: string
  dars_nomi: string
  dars_slug: string
  togri_son: number
  jami_savol: number
  foiz: number
  turi: string
  created_at: string
}

type Statistika = {
  jami_test: number
  amaliy: number
  usmle: number
  nazorat: number
  ortacha_foiz: number
  eng_yaxshi: Natija | null
  oxirgi: Natija | null
}

function FoizDoira({ foiz, rang }: { foiz: number; rang: string }) {
  const r = 28
  const perimetr = 2 * Math.PI * r
  const doldi = (foiz / 100) * perimetr
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none" stroke={rang} strokeWidth="6"
        strokeDasharray={`${doldi} ${perimetr}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--ink)">
        {foiz}%
      </text>
    </svg>
  )
}

function formatSana(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

function TuriChip({ turi }: { turi: string }) {
  const map: Record<string, { label: string; color: string }> = {
    amaliy:  { label: 'Amaliy', color: '#3b82f6' },
    usmle:   { label: 'USMLE', color: '#8b5cf6' },
    nazorat: { label: 'Nazorat', color: '#f59e0b' },
  }
  const t = map[turi] ?? { label: turi, color: 'var(--muted)' }
  return (
    <span style={{
      background: t.color + '20', color: t.color,
      borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 700,
    }}>
      {t.label}
    </span>
  )
}

// Haftalik faollik — joriy hafta har kuni nechta test ishlangan (Elevate uslubi).
// Kunlik "o'qish soati" o'lchanmagani uchun bu yerda faollik = test soni.
function HaftalikFaollik({ natijalar }: { natijalar: Natija[] }) {
  const KUN = ['DU', 'SE', 'CH', 'PA', 'JU', 'SH', 'YA']
  const bugun = new Date()
  const kunIdx = (bugun.getDay() + 6) % 7 // Dushanba = 0
  const dushanba = new Date(bugun); dushanba.setDate(bugun.getDate() - kunIdx); dushanba.setHours(0, 0, 0, 0)
  const sonlar = new Array(7).fill(0)
  let otganHafta = 0 // o'tgan hafta (delta uchun)
  for (const n of natijalar) {
    const dt = new Date(n.created_at); dt.setHours(0, 0, 0, 0)
    const idx = Math.round((dt.getTime() - dushanba.getTime()) / 86400000)
    if (idx >= 0 && idx < 7) sonlar[idx]++
    else if (idx >= -7 && idx < 0) otganHafta++
  }
  const jami = sonlar.reduce((a, b) => a + b, 0)
  const max = Math.max(1, ...sonlar)
  // Delta: o'tgan haftaga nisbatan (LeadNest uslubi). Bazaviy 0 bo'lsa foiz ko'rsatilmaydi.
  const deltaFoiz = otganHafta > 0 ? Math.round(((jami - otganHafta) / otganHafta) * 100) : null
  const oshdi = (deltaFoiz ?? 0) >= 0
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', fontWeight: 800 }}>Haftalik faollik</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {deltaFoiz !== null && (
            <span style={{
              fontSize: '11px', fontWeight: 800, borderRadius: '999px', padding: '3px 8px',
              display: 'inline-flex', alignItems: 'center', gap: '3px',
              color: oshdi ? '#16a34a' : '#dc2626', background: oshdi ? '#16a34a16' : '#dc262616',
            }}>
              {oshdi ? <ArrowUp size={11} strokeWidth={2.6} /> : <ArrowDown size={11} strokeWidth={2.6} />}
              {oshdi ? '+' : ''}{deltaFoiz}%
            </span>
          )}
          <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{jami} ta test</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', height: '110px' }}>
        {sonlar.map((s, i) => {
          const bugunmi = i === kunIdx
          const h = s === 0 ? 4 : Math.round((s / max) * 96) + 4
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
              {s > 0 && <span style={{ fontSize: '10px', fontWeight: 800, color: bugunmi ? '#d97706' : 'var(--muted)' }}>{s}</span>}
              <div style={{
                width: '100%', maxWidth: '26px', height: `${h}%`, minHeight: '4px', borderRadius: '8px 8px 4px 4px',
                background: bugunmi ? '#f59e0b' : 'var(--surface-2)',
                border: bugunmi ? 'none' : '1px solid var(--line)', transition: 'height .5s ease',
              }} />
              <span style={{ fontSize: '10px', fontWeight: bugunmi ? 800 : 600, color: bugunmi ? 'var(--ink)' : 'var(--muted)' }}>{KUN[i]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FaollikPage() {
  const router = useRouter()
  const supabase = createClient()
  const [natijalار, setNatijalar] = useState<Natija[]>([])
  const [stat, setStat] = useState<Statistika | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }

      const { data } = await supabase
        .from('talim_natijalari')
        .select('id, dars_nomi, dars_slug, togri_son, jami_savol, foiz, turi, created_at')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      const list = (data ?? []) as Natija[]
      setNatijalar(list)

      if (list.length > 0) {
        const amaliy  = list.filter(n => n.turi === 'amaliy').length
        const usmle   = list.filter(n => n.turi === 'usmle').length
        const nazorat = list.filter(n => n.turi === 'nazorat').length
        const ortacha = Math.round(list.reduce((s, n) => s + n.foiz, 0) / list.length)
        const engYaxshi = [...list].sort((a, b) => b.foiz - a.foiz)[0]

        setStat({
          jami_test: list.length,
          amaliy, usmle, nazorat,
          ortacha_foiz: ortacha,
          eng_yaxshi: engYaxshi,
          oxirgi: list[0],
        })
      } else {
        setStat({ jami_test: 0, amaliy: 0, usmle: 0, nazorat: 0, ortacha_foiz: 0, eng_yaxshi: null, oxirgi: null })
      }
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      <div className="mx-auto max-w-[600px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}><BarChart3 size={22} strokeWidth={2} /> Faolligingiz</h2>

        {stat?.jami_test === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: '14px', padding: '40px 20px', textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: 'var(--muted)' }}><BookOpen size={40} strokeWidth={1.5} /></div>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
              Hali birorta test ishlanmagan.<br />Darslarni boshlang!
            </p>
          </div>
        ) : (
          <>
            {/* Umumiy statistika */}
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #0891b2)',
              borderRadius: '16px', padding: '20px 22px', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', opacity: 0.85 }}>Jami ishlangan test</p>
                <p style={{ margin: '4px 0 0', fontSize: '36px', fontWeight: 800 }}>{stat!.jami_test}</p>
                <p style={{ margin: '6px 0 0', fontSize: '13px', opacity: 0.85 }}>
                  Amaliy: {stat!.amaliy} · USMLE: {stat!.usmle} · Nazorat: {stat!.nazorat}
                </p>
              </div>
              <FoizDoira foiz={stat!.ortacha_foiz} rang="white" />
            </div>

            {/* Kartalar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: "O'rtacha natija", value: stat!.ortacha_foiz + '%', Icon: TrendingUp, rang: stat!.ortacha_foiz >= 70 ? '#34d399' : stat!.ortacha_foiz >= 50 ? '#f59e0b' : '#f87171' },
                { label: 'Testlar soni', value: stat!.jami_test + ' ta', Icon: ClipboardCheck, rang: '#3b82f6' },
                { label: 'Eng yaxshi natija', value: stat!.eng_yaxshi ? stat!.eng_yaxshi.foiz + '%' : '—', Icon: Trophy, rang: '#f59e0b' },
                { label: 'Nazorat testlari', value: stat!.nazorat + ' ta', Icon: ClipboardList, rang: '#8b5cf6' },
              ].map(k => (
                <div key={k.label} style={{
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: '14px', padding: '16px',
                }}>
                  <p style={{ margin: 0, color: k.rang }}><k.Icon size={22} strokeWidth={2} /></p>
                  <p style={{ margin: '8px 0 2px', fontSize: '22px', fontWeight: 800, color: k.rang }}>{k.value}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>{k.label}</p>
                </div>
              ))}
            </div>

            <HaftalikFaollik natijalar={natijalار} />

            {/* So'nggi faollik */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '14px', overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>So'nggi natijalar</p>
              </div>
              {natijalار.slice(0, 15).map((n, i) => (
                <div key={n.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 18px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                }}>
                  {/* Foiz doira */}
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                    background: n.foiz >= 70 ? '#34d39920' : n.foiz >= 50 ? '#f59e0b20' : '#f8717120',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '12px',
                    color: n.foiz >= 70 ? '#34d399' : n.foiz >= 50 ? '#f59e0b' : '#f87171',
                  }}>
                    {n.foiz}%
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.dars_nomi}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {n.togri_son}/{n.jami_savol} to'g'ri · {formatSana(n.created_at)}
                    </p>
                  </div>
                  <TuriChip turi={n.turi} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
