'use client'

// Sertifikatlar — kim qaysi dars nazoratidan o'tib sertifikat oldi va
// kim bosqich sertifikatiga qanchalik yaqin (barcha darslar nazoratidan o'tish sharti).

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { DARSLAR, darsTop, type Bosqich } from '@/lib/talim/darslar'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type NatijaQator = { student_id: string; dars_slug: string; dars_nomi: string; foiz: number; created_at: string }
type Profil = { id: string; full_name: string | null; email: string | null }

const BOSQICH_NOMI: Record<string, string> = { "o'rta": "🟡 O'RTA", qiyin: '🔴 QIYIN' }
const BOSQICH_RANG: Record<string, string> = { "o'rta": '#d97706', qiyin: '#dc2626' }

function sanaFmt(s: string): string {
  return new Date(s).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminSertifikatlarPage() {
  const supabase = createClient()
  const router = useRouter()
  const [nazoratlar, setNazoratlar] = useState<NatijaQator[]>([])
  const [profillar, setProfillar] = useState<Map<string, Profil>>(new Map())
  const [otishFoizlar, setOtishFoizlar] = useState<Record<string, number>>({})
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    const yukla = async () => {
      const [n, p, t] = await Promise.all([
        supabase.from('talim_natijalari')
          .select('student_id, dars_slug, dars_nomi, foiz, created_at')
          .eq('turi', 'nazorat')
          .order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, email').eq('role', 'student').eq('arxivlangan', false),
        supabase.from('dars_tarkibi').select('dars_slug, sertifikat_otish_foizi'),
      ])
      setNazoratlar((n.data as NatijaQator[]) ?? [])
      setProfillar(new Map(((p.data as Profil[]) ?? []).map((x) => [x.id, x])))
      const m: Record<string, number> = {}
      for (const r of (t.data ?? []) as { dars_slug: string; sertifikat_otish_foizi: number | null }[]) {
        m[r.dars_slug] = r.sertifikat_otish_foizi ?? 70
      }
      setOtishFoizlar(m)
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const otish = (slug: string) => otishFoizlar[slug] ?? darsTop(slug)?.sertifikatOtishFoizi ?? 70

  // Har (talaba, dars) uchun eng yaxshi nazorat natijasi
  const engYaxshilar = useMemo(() => {
    const m = new Map<string, NatijaQator>()
    for (const n of nazoratlar) {
      const kalit = `${n.student_id}|${n.dars_slug}`
      const bor = m.get(kalit)
      if (!bor || Number(n.foiz) > Number(bor.foiz)) m.set(kalit, n)
    }
    return [...m.values()]
  }, [nazoratlar])

  // Olingan dars-sertifikatlari (o'tish chegarasidan yuqori)
  const olinganlar = useMemo(
    () => engYaxshilar
      .filter((n) => Number(n.foiz) >= otish(n.dars_slug))
      .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [engYaxshilar, otishFoizlar]
  )

  // Bosqich sertifikati tayyorligi: talaba × bosqich — o'tilgan / jami darslar
  const bosqichTayyorlik = useMemo(() => {
    const jami: Record<string, number> = {
      "o'rta": DARSLAR.filter((d) => d.bosqich === "o'rta").length,
      qiyin: DARSLAR.filter((d) => d.bosqich === 'qiyin').length,
    }
    const m = new Map<string, { otgan: number }>()
    for (const n of olinganlar) {
      const bosqich = darsTop(n.dars_slug)?.bosqich
      if (bosqich !== "o'rta" && bosqich !== 'qiyin') continue
      const kalit = `${n.student_id}|${bosqich}`
      const bor = m.get(kalit) ?? { otgan: 0 }
      bor.otgan++
      m.set(kalit, bor)
    }
    return [...m.entries()]
      .map(([kalit, v]) => {
        const [studentId, bosqich] = kalit.split('|')
        return {
          studentId,
          bosqich: bosqich as Bosqich,
          otgan: v.otgan,
          jami: jami[bosqich] ?? 0,
          foiz: jami[bosqich] ? Math.round((v.otgan / jami[bosqich]) * 100) : 0,
        }
      })
      .sort((a, b) => b.foiz - a.foiz)
  }, [olinganlar])

  const talabaSoni = new Set(olinganlar.map((n) => n.student_id)).size

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[900px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>🏅 Sertifikatlar</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          Dars sertifikati — nazoratdan o&apos;tish; bosqich sertifikati — bosqichning barcha nazoratlaridan o&apos;tish
        </p>

        {/* KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { nom: 'Olingan dars sertifikatlari', qiymat: olinganlar.length, emoji: '🏅' },
            { nom: 'Sertifikatli talabalar', qiymat: talabaSoni, emoji: '🎓' },
            { nom: 'Jami nazorat urinishlari', qiymat: nazoratlar.length, emoji: '📝' },
          ].map((k) => (
            <div key={k.nom} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '16px 18px' }}>
              <div style={{ fontSize: '22px', fontWeight: 900 }}>{k.emoji} {k.qiymat}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>{k.nom}</div>
            </div>
          ))}
        </div>

        {!yuklandi ? (
          <UrosferaLoaderMini />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

            {/* Bosqich sertifikatiga yaqinlik */}
            <div>
              <h2 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 900 }}>🏆 Bosqich sertifikatiga yaqinlik</h2>
              {bosqichTayyorlik.length === 0 ? (
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12.5px' }}>
                  Hali hech kim nazoratdan o&apos;tmagan.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {bosqichTayyorlik.map((b) => {
                    const t = profillar.get(b.studentId)
                    const tayyor = b.otgan >= b.jami && b.jami > 0
                    return (
                      <div
                        key={`${b.studentId}-${b.bosqich}`}
                        onClick={() => router.push(`/admin/talabalar-nazorati/${b.studentId}`)}
                        style={{
                          background: tayyor ? '#16a34a0d' : 'var(--surface)',
                          border: tayyor ? '1.5px solid #16a34a66' : '1px solid var(--line)',
                          borderRadius: '14px', padding: '13px 17px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                        }}
                      >
                        <span style={{
                          fontSize: '10.5px', fontWeight: 900, color: BOSQICH_RANG[b.bosqich],
                          background: BOSQICH_RANG[b.bosqich] + '14', borderRadius: '999px', padding: '3px 10px', flexShrink: 0,
                        }}>{BOSQICH_NOMI[b.bosqich]}</span>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>{t?.full_name ?? t?.email ?? '—'}</div>
                          <div style={{ height: '6px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden', marginTop: '6px' }}>
                            <div style={{ width: `${b.foiz}%`, height: '100%', background: tayyor ? '#16a34a' : BOSQICH_RANG[b.bosqich], borderRadius: '999px' }} />
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          {tayyor ? (
                            <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#16a34a' }}>🏆 SERTIFIKATGA LOYIQ</span>
                          ) : (
                            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink-soft)' }}>{b.otgan}/{b.jami} nazorat</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Olingan dars sertifikatlari */}
            <div>
              <h2 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 900 }}>🏅 Olingan dars sertifikatlari</h2>
              {olinganlar.length === 0 ? (
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '12.5px' }}>Hali yo&apos;q.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {olinganlar.slice(0, 30).map((n) => {
                    const t = profillar.get(n.student_id)
                    return (
                      <div
                        key={`${n.student_id}-${n.dars_slug}`}
                        onClick={() => router.push(`/admin/talabalar-nazorati/${n.student_id}`)}
                        style={{
                          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                          padding: '12px 16px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '180px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>{t?.full_name ?? t?.email ?? '—'}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {darsTop(n.dars_slug)?.sarlavha ?? n.dars_nomi}
                          </div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 900, color: '#16a34a', flexShrink: 0 }}>
                          {Math.round(Number(n.foiz))}%
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, flexShrink: 0 }}>
                          📅 {sanaFmt(n.created_at)}
                        </span>
                      </div>
                    )
                  })}
                  {olinganlar.length > 30 && (
                    <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>
                      ... va yana {olinganlar.length - 30} ta
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
