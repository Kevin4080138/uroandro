'use client'

// Bitta talabaning batafsil nazorat sahifasi: profil, obunalar, bosqich bo'yicha
// dars progressi (qadamlar + urinishlar) va so'nggi faollik xronologiyasi.

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { DARSLAR, BOSQICHLAR, type Bosqich } from '@/lib/talim/darslar'
import { BOSQICH_QADAMLARI, darsTugadimi } from '@/lib/talim/useDarsProgress'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type ProgressQator = { dars_slug: string; qadam: string; created_at: string }
type NatijaQator = {
  dars_slug: string; dars_nomi: string
  togri_son: number; jami_savol: number; foiz: number; turi: string; created_at: string
}
type Profil = { id: string; full_name: string | null; email: string | null; telefon: string | null; created_at: string }
type Obuna = { bosqich: Bosqich; faol: boolean; tugash_sanasi: string | null; created_at: string }

const BOSQICH_RANG: Record<string, string> = { oson: '#16a34a', "o'rta": '#d97706', qiyin: '#dc2626' }
const QADAM_EMOJI: Record<string, string> = {
  nazariya: '📖', video: '🎥', yuklab: '📂', flashcard: '🃏', amaliy: '✅',
  usmle: '🏅', klinik: '🏥', interaktiv: '🧩', vaziyatli: '📋', xatolar: '🔍', nazorat: '🎓',
}
const QADAM_NOMI: Record<string, string> = {
  nazariya: 'Nazariya', video: 'Video', yuklab: 'Materiallar', flashcard: 'Flashcard', amaliy: 'Amaliy test',
  usmle: 'USMLE', klinik: 'Klinik holat', interaktiv: 'Interaktiv case', vaziyatli: 'Vaziyatli masala',
  xatolar: 'Xatolar tahlili', nazorat: 'Nazorat',
}
const TURI_LABEL: Record<string, string> = { amaliy: '✅ Amaliy test', usmle: '🏅 USMLE', nazorat: '🎓 Nazorat' }

function sanaFmt(s: string | null): string {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function TalabaBatafsilPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const [profil, setProfil] = useState<Profil | null>(null)
  const [progresslar, setProgresslar] = useState<ProgressQator[]>([])
  const [natijalar, setNatijalar] = useState<NatijaQator[]>([])
  const [obunalar, setObunalar] = useState<Obuna[]>([])
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    const yukla = async () => {
      const [p, pr, n, o] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, telefon, created_at').eq('id', id).maybeSingle(),
        supabase.from('dars_qadam_progress').select('dars_slug, qadam, created_at').eq('student_id', id),
        supabase.from('talim_natijalari').select('dars_slug, dars_nomi, togri_son, jami_savol, foiz, turi, created_at').eq('student_id', id).order('created_at', { ascending: false }),
        supabase.from('obunalar').select('bosqich, faol, tugash_sanasi, created_at').eq('student_id', id),
      ])
      setProfil((p.data as Profil) ?? null)
      setProgresslar((pr.data as ProgressQator[]) ?? [])
      setNatijalar((n.data as NatijaQator[]) ?? [])
      setObunalar((o.data as Obuna[]) ?? [])
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const qadamlarMap = useMemo(() => {
    const m = new Map<string, Set<string>>()
    for (const r of progresslar) {
      const s = m.get(r.dars_slug) ?? new Set<string>()
      s.add(r.qadam)
      m.set(r.dars_slug, s)
    }
    return m
  }, [progresslar])

  // Bosqich bo'yicha: talaba tegib chiqqan darslar
  const bosqichlarMalumoti = useMemo(() => {
    const teggan = new Set<string>([...qadamlarMap.keys(), ...natijalar.map((n) => n.dars_slug)])
    return BOSQICHLAR.map((b) => {
      const darslar = DARSLAR
        .filter((d) => d.bosqich === b.id && teggan.has(d.slug))
        .map((d) => ({
          slug: d.slug,
          nom: d.sarlavha,
          qadamlar: qadamlarMap.get(d.slug) ?? new Set<string>(),
          urinishlar: natijalar.filter((n) => n.dars_slug === d.slug),
        }))
      const jamiDars = DARSLAR.filter((d) => d.bosqich === b.id).length
      const tugallangan = darslar.filter((d) => darsTugadimi(d.qadamlar)).length
      return { ...b, darslar, jamiDars, tugallangan }
    })
  }, [qadamlarMap, natijalar])

  // So'nggi faollik xronologiyasi (qadam + urinish aralash, eng yangisi birinchi)
  const xronologiya = useMemo(() => {
    const darsNomi = (slug: string) => DARSLAR.find((d) => d.slug === slug)?.sarlavha ?? slug
    const hodisalar: { sana: string; matn: string }[] = [
      ...progresslar.map((r) => ({
        sana: r.created_at,
        matn: `${QADAM_EMOJI[r.qadam] ?? '•'} ${QADAM_NOMI[r.qadam] ?? r.qadam} yakunlandi — ${darsNomi(r.dars_slug)}`,
      })),
      ...natijalar.map((r) => ({
        sana: r.created_at,
        matn: `${TURI_LABEL[r.turi] ?? r.turi}: ${r.togri_son}/${r.jami_savol} (${Math.round(Number(r.foiz))}%) — ${r.dars_nomi}`,
      })),
    ]
    return hodisalar.sort((a, b) => b.sana.localeCompare(a.sana)).slice(0, 25)
  }, [progresslar, natijalar])

  const foizlar = natijalar.map((r) => Number(r.foiz))
  const ortacha = foizlar.length ? Math.round(foizlar.reduce((a, b) => a + b, 0) / foizlar.length) : null
  const nazoratOtgan = new Set(natijalar.filter((r) => r.turi === 'nazorat' && Number(r.foiz) >= 70).map((r) => r.dars_slug)).size
  const jamiTugallangan = bosqichlarMalumoti.reduce((s, b) => s + b.tugallangan, 0)

  if (yuklandi && !profil) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/admin/talabalar-nazorati" backLabel="Talabalar nazorati" />
        <div className="mx-auto max-w-[760px] px-8 py-12"><p>Talaba topilmadi.</p></div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/talabalar-nazorati" backLabel="Talabalar nazorati" />

      <div className="mx-auto max-w-[900px] px-6 py-8">
        {!yuklandi ? (
          <UrosferaLoaderMini />
        ) : (
          <>
            {/* Profil kartasi */}
            <div className="rise" style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '18px',
              padding: '22px 24px', marginBottom: '18px',
              display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
                background: 'var(--accent)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 900,
              }}>
                {(profil?.full_name ?? '?').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900 }}>{profil?.full_name ?? '—'}</h1>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: '2px' }}>
                  {profil?.email ?? ''}{profil?.telefon ? ` · ${profil.telefon}` : ''}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '2px' }}>
                  Ro&apos;yxatdan o&apos;tgan: {sanaFmt(profil?.created_at ?? null)}
                </div>
              </div>
              <button
                onClick={() => router.push('/admin/obunalar')}
                className="soft-press"
                style={{
                  background: 'var(--surface-2)', color: 'var(--accent)', border: '1px solid var(--line)',
                  borderRadius: '12px', padding: '9px 16px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                }}
              >
                💳 Obuna berish →
              </button>
            </div>

            {/* Obunalar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {obunalar.length === 0 ? (
                <span style={{
                  fontSize: '12px', fontWeight: 700, color: 'var(--muted)',
                  background: 'var(--surface)', border: '1px dashed var(--line)',
                  borderRadius: '999px', padding: '6px 14px',
                }}>Obunasi yo&apos;q — faqat bepul kontent</span>
              ) : obunalar.map((o) => {
                const amal = o.faol && (!o.tugash_sanasi || new Date(o.tugash_sanasi) > new Date())
                const rang = BOSQICH_RANG[o.bosqich]
                return (
                  <span key={o.bosqich} style={{
                    fontSize: '12px', fontWeight: 800,
                    color: amal ? rang : 'var(--muted)',
                    background: amal ? rang + '14' : 'var(--surface-2)',
                    border: `1px solid ${amal ? rang + '55' : 'var(--line)'}`,
                    borderRadius: '999px', padding: '6px 14px',
                    textDecoration: amal ? 'none' : 'line-through',
                  }}>
                    {BOSQICHLAR.find((b) => b.id === o.bosqich)?.emoji} {o.bosqich.toUpperCase()} · {amal ? (o.tugash_sanasi ? sanaFmt(o.tugash_sanasi).split(',')[0] + ' gacha' : 'muddatsiz') : 'tugagan'}
                  </span>
                )
              })}
            </div>

            {/* KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '24px' }}>
              {[
                { nom: 'Tugallangan darslar', qiymat: jamiTugallangan, emoji: '✅' },
                { nom: 'Yakunlangan qadamlar', qiymat: progresslar.length, emoji: '👣' },
                { nom: 'Test urinishlari', qiymat: natijalar.length, emoji: '📝' },
                { nom: "O'rtacha foiz", qiymat: ortacha === null ? '—' : `${ortacha}%`, emoji: '🎯' },
                { nom: "Nazorat o'tgan", qiymat: nazoratOtgan, emoji: '🎓' },
              ].map((k) => (
                <div key={k.nom} style={{
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                  padding: '13px 15px',
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 900 }}>{k.emoji} {k.qiymat}</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 700, marginTop: '2px' }}>{k.nom}</div>
                </div>
              ))}
            </div>

            {/* Bosqichlar bo'yicha progress */}
            {bosqichlarMalumoti.map((b) => (
              <div key={b.id} style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 900 }}>{b.emoji} {b.nom}</h2>
                  <span style={{
                    fontSize: '11px', fontWeight: 800, color: BOSQICH_RANG[b.id],
                    background: BOSQICH_RANG[b.id] + '14', borderRadius: '999px', padding: '3px 10px',
                  }}>
                    {b.tugallangan}/{b.jamiDars} dars tugallangan
                  </span>
                </div>

                {b.darslar.length === 0 ? (
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)', paddingLeft: '4px' }}>
                    Bu bosqichda hali boshlagan darsi yo&apos;q.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {b.darslar.map((d) => {
                      const barchaQadamlar = BOSQICH_QADAMLARI[b.id] ?? []
                      const tugadi = darsTugadimi(d.qadamlar)
                      return (
                        <div key={d.slug} style={{
                          background: 'var(--surface)',
                          border: tugadi ? '1px solid #16a34a55' : '1px solid var(--line)',
                          borderRadius: '14px', padding: '14px 18px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 800 }}>{tugadi && '✅ '}{d.nom}</span>
                            <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, marginLeft: 'auto' }}>
                              {d.qadamlar.size}/{barchaQadamlar.length} qadam
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: d.urinishlar.length ? '10px' : 0 }}>
                            {barchaQadamlar.map((q) => {
                              const bor = d.qadamlar.has(q)
                              return (
                                <span key={q} style={{
                                  fontSize: '11px', fontWeight: 700,
                                  color: bor ? '#16a34a' : 'var(--muted)',
                                  background: bor ? '#16a34a12' : 'var(--surface-2)',
                                  border: bor ? '1px solid #16a34a44' : '1px solid var(--line)',
                                  borderRadius: '999px', padding: '3px 9px',
                                }}>
                                  {bor ? '✓' : '·'} {QADAM_EMOJI[q]} {QADAM_NOMI[q]}
                                </span>
                              )
                            })}
                          </div>

                          {d.urinishlar.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {d.urinishlar.map((u, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 700, minWidth: '100px' }}>{TURI_LABEL[u.turi] ?? u.turi}</span>
                                  <span style={{ color: 'var(--muted)' }}>{u.togri_son}/{u.jami_savol}</span>
                                  <span style={{
                                    fontWeight: 900,
                                    color: Number(u.foiz) >= 70 ? '#16a34a' : Number(u.foiz) >= 50 ? '#d97706' : '#dc2626',
                                  }}>{Math.round(Number(u.foiz))}%</span>
                                  {u.turi === 'nazorat' && Number(u.foiz) >= 70 && (
                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a' }}>O&apos;TDI</span>
                                  )}
                                  <span style={{ color: 'var(--muted)', fontSize: '11px', marginLeft: 'auto' }}>{sanaFmt(u.created_at)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Xronologiya */}
            <h2 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 900 }}>🕐 So&apos;nggi faollik</h2>
            {xronologiya.length === 0 ? (
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>Hali faollik yo&apos;q.</p>
            ) : (
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                padding: '6px 0',
              }}>
                {xronologiya.map((h, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', alignItems: 'baseline',
                    padding: '9px 18px',
                    borderBottom: i < xronologiya.length - 1 ? '1px solid var(--line)' : 'none',
                  }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap', fontWeight: 600, minWidth: '120px' }}>
                      {sanaFmt(h.sana)}
                    </span>
                    <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{h.matn}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
