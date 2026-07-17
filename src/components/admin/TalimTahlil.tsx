'use client'

// Dashboard bloki: Ta'lim tahlili —
// 1) 7 kunlik faollik grafigi (qadamlar + test urinishlari)
// 2) TOP-5 eng faol talabalar (oxirgi 7 kun)
// 3) Eng qiyin darslar (o'rtacha foiz eng past — kontent sifati signali)
// 4) Konversiya voronkasi: ro'yxat → boshlagan → dars tugatgan → obunali

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { darsTugadimi } from '@/lib/talim/useDarsProgress'
import { darsTop } from '@/lib/talim/darslar'

type ProgressQator = { student_id: string; dars_slug: string; qadam: string; created_at: string }
type NatijaQator = { student_id: string; dars_slug: string; dars_nomi: string; foiz: number; created_at: string }
type Profil = { id: string; full_name: string | null; email: string | null }

export function TalimTahlil() {
  const supabase = createClient()
  const router = useRouter()
  const [progresslar, setProgresslar] = useState<ProgressQator[]>([])
  const [natijalar, setNatijalar] = useState<NatijaQator[]>([])
  const [profillar, setProfillar] = useState<Map<string, Profil>>(new Map())
  const [jamiTalaba, setJamiTalaba] = useState(0)
  const [obunaliIdlar, setObunaliIdlar] = useState<Set<string>>(new Set())
  const [yuklandi, setYuklandi] = useState(false)
  const [hozir] = useState(() => Date.now())

  useEffect(() => {
    const yukla = async () => {
      const [pr, n, p, o] = await Promise.all([
        supabase.from('dars_qadam_progress').select('student_id, dars_slug, qadam, created_at'),
        supabase.from('talim_natijalari').select('student_id, dars_slug, dars_nomi, foiz, created_at'),
        supabase.from('profiles').select('id, full_name, email').eq('role', 'student').eq('arxivlangan', false),
        supabase.from('obunalar').select('student_id, faol, tugash_sanasi').eq('faol', true),
      ])
      setProgresslar((pr.data as ProgressQator[]) ?? [])
      setNatijalar((n.data as NatijaQator[]) ?? [])
      const plar = (p.data as Profil[]) ?? []
      setProfillar(new Map(plar.map((x) => [x.id, x])))
      setJamiTalaba(plar.length)
      setObunaliIdlar(new Set(
        ((o.data as { student_id: string; tugash_sanasi: string | null }[]) ?? [])
          .filter((r) => !r.tugash_sanasi || new Date(r.tugash_sanasi).getTime() > Date.now())
          .map((r) => r.student_id)
      ))
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 1) 7 kunlik faollik grafigi
  const grafik = useMemo(() => {
    const kunlar: { kun: string; kalit: string; qadamlar: number; urinishlar: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hozir - i * 86400000)
      d.setHours(0, 0, 0, 0)
      kunlar.push({
        kun: d.toLocaleDateString('uz-UZ', { weekday: 'short' }),
        kalit: d.toDateString(),
        qadamlar: 0,
        urinishlar: 0,
      })
    }
    const indeks = new Map(kunlar.map((k, i) => [k.kalit, i]))
    for (const r of progresslar) {
      const d = new Date(r.created_at); d.setHours(0, 0, 0, 0)
      const i = indeks.get(d.toDateString())
      if (i !== undefined) kunlar[i].qadamlar++
    }
    for (const r of natijalar) {
      const d = new Date(r.created_at); d.setHours(0, 0, 0, 0)
      const i = indeks.get(d.toDateString())
      if (i !== undefined) kunlar[i].urinishlar++
    }
    return kunlar
  }, [progresslar, natijalar, hozir])

  // 2) TOP-5 faol talabalar (7 kun: qadam + urinish soni)
  const topTalabalar = useMemo(() => {
    const chegara = hozir - 7 * 86400000
    const ball = new Map<string, { qadam: number; urinish: number }>()
    for (const r of progresslar) {
      if (new Date(r.created_at).getTime() < chegara) continue
      const b = ball.get(r.student_id) ?? { qadam: 0, urinish: 0 }
      b.qadam++
      ball.set(r.student_id, b)
    }
    for (const r of natijalar) {
      if (new Date(r.created_at).getTime() < chegara) continue
      const b = ball.get(r.student_id) ?? { qadam: 0, urinish: 0 }
      b.urinish++
      ball.set(r.student_id, b)
    }
    return [...ball.entries()]
      .map(([id, b]) => ({ id, ...b, jami: b.qadam + b.urinish, profil: profillar.get(id) }))
      .filter((x) => x.profil)
      .sort((a, b) => b.jami - a.jami)
      .slice(0, 5)
  }, [progresslar, natijalar, profillar, hozir])

  // 3) Eng qiyin darslar (o'rtacha foiz eng past, kamida 3 urinish)
  const qiyinDarslar = useMemo(() => {
    const m = new Map<string, { nom: string; foizlar: number[] }>()
    for (const r of natijalar) {
      const bor = m.get(r.dars_slug) ?? { nom: darsTop(r.dars_slug)?.sarlavha ?? r.dars_nomi, foizlar: [] }
      bor.foizlar.push(Number(r.foiz))
      m.set(r.dars_slug, bor)
    }
    return [...m.entries()]
      .filter(([, v]) => v.foizlar.length >= 3)
      .map(([slug, v]) => ({
        slug, nom: v.nom,
        ortacha: Math.round(v.foizlar.reduce((a, b) => a + b, 0) / v.foizlar.length),
        soni: v.foizlar.length,
      }))
      .sort((a, b) => a.ortacha - b.ortacha)
      .slice(0, 5)
  }, [natijalar])

  // 4) Konversiya voronkasi
  const voronka = useMemo(() => {
    const boshlaganlar = new Set([...progresslar.map((r) => r.student_id), ...natijalar.map((r) => r.student_id)])
    const darsQadamlari = new Map<string, Map<string, Set<string>>>()
    for (const r of progresslar) {
      const talaba = darsQadamlari.get(r.student_id) ?? new Map<string, Set<string>>()
      const s = talaba.get(r.dars_slug) ?? new Set<string>()
      s.add(r.qadam)
      talaba.set(r.dars_slug, s)
      darsQadamlari.set(r.student_id, talaba)
    }
    let tugatganlar = 0
    darsQadamlari.forEach((darslar) => {
      for (const s of darslar.values()) {
        if (darsTugadimi(s)) { tugatganlar++; return }
      }
    })
    return [
      { nom: "Ro'yxatdan o'tgan", soni: jamiTalaba, rang: '#2563eb' },
      { nom: "O'qishni boshlagan", soni: boshlaganlar.size, rang: '#0d9488' },
      { nom: '≥1 dars tugatgan', soni: tugatganlar, rang: '#d97706' },
      { nom: 'Obuna sotib olgan', soni: obunaliIdlar.size, rang: '#16a34a' },
    ]
  }, [progresslar, natijalar, jamiTalaba, obunaliIdlar])

  if (!yuklandi) return null

  const kartaStil = {
    background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px',
  } as const
  const sarlavhaStil = {
    fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase' as const,
    letterSpacing: '.05em', margin: '0 0 14px 0', fontWeight: 600,
  }

  // Fragment qaytaradi — har karta dashboard'dagi .adm-grid ning to'g'ridan-to'g'ri
  // katagi bo'ladi (grafik 8 ustun, qolganlari 4 tadan; mobil'da hammasi to'liq qator).
  return (
    <>
      {/* 1) 7 kunlik ta'lim faolligi */}
      <div className="adm-span-8" style={kartaStil}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={sarlavhaStil}>📚 7 kunlik ta&apos;lim faolligi</h3>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={grafik} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
            <XAxis dataKey="kun" tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="qadamlar" name="Qadamlar" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="urinishlar" name="Test urinishlari" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2) TOP-5 faol talabalar */}
      <div className="adm-span-4" style={kartaStil}>
        <h3 style={sarlavhaStil}>🏆 Haftaning eng faol talabalari</h3>
        {topTalabalar.length === 0 ? (
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>7 kun ichida faollik bo&apos;lmadi.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {topTalabalar.map((t, i) => (
              <div
                key={t.id}
                onClick={() => router.push(`/admin/talabalar-nazorati/${t.id}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '15px', width: '24px', flexShrink: 0, textAlign: 'center' }}>
                  {['🥇', '🥈', '🥉'][i] ?? `${i + 1}.`}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.profil?.full_name ?? t.profil?.email ?? '—'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                    {t.qadam} qadam · {t.urinish} urinish
                  </div>
                </div>
                <span style={{
                  fontSize: '12px', fontWeight: 900, color: 'var(--accent)',
                  background: 'var(--surface-2)', borderRadius: '999px', padding: '3px 11px', flexShrink: 0,
                }}>{t.jami}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3) Eng qiyin darslar */}
      <div className="adm-span-4" style={kartaStil}>
        <h3 style={sarlavhaStil}>🧗 Eng qiyin darslar (past o&apos;rtacha foiz)</h3>
        {qiyinDarslar.length === 0 ? (
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
            Hali yetarli urinish yo&apos;q (har dars uchun kamida 3 ta kerak).
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {qiyinDarslar.map((d) => (
              <div key={d.slug}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d.nom}
                  </span>
                  <span style={{
                    fontSize: '12px', fontWeight: 900, flexShrink: 0,
                    color: d.ortacha >= 70 ? '#16a34a' : d.ortacha >= 50 ? '#d97706' : '#dc2626',
                  }}>{d.ortacha}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${d.ortacha}%`, height: '100%', borderRadius: '999px',
                    background: d.ortacha >= 70 ? '#16a34a' : d.ortacha >= 50 ? '#d97706' : '#dc2626',
                  }} />
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 600, marginTop: '2px' }}>{d.soni} urinish</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4) Konversiya voronkasi */}
      <div className="adm-span-4" style={kartaStil}>
        <h3 style={sarlavhaStil}>🎯 Konversiya voronkasi</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {voronka.map((v, i) => {
            const asos = voronka[0].soni || 1
            const foiz = Math.round((v.soni / asos) * 100)
            const oldingi = i > 0 ? voronka[i - 1].soni : null
            const otish = oldingi ? Math.round((v.soni / (oldingi || 1)) * 100) : null
            return (
              <div key={v.nom}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700 }}>{v.nom}</span>
                  <span style={{ fontSize: '12px', fontWeight: 900, color: v.rang }}>
                    {v.soni} ta{otish !== null && <span style={{ color: 'var(--muted)', fontWeight: 600 }}> · {otish}%</span>}
                  </span>
                </div>
                <div style={{ height: '10px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.max(foiz, 2)}%`, height: '100%', borderRadius: '999px',
                    background: v.rang, transition: 'width .4s ease',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
        <p style={{ margin: '12px 0 0', fontSize: '11px', color: 'var(--muted)', lineHeight: 1.5 }}>
          Foizlar oldingi bosqichdan o&apos;tishni ko&apos;rsatadi — qaysi bo&apos;g&apos;inda talabalar &quot;to&apos;xtab qolayotganini&quot; kuzating.
        </p>
      </div>
    </>
  )
}
