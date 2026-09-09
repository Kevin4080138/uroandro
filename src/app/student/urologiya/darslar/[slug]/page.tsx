'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { Clock, CheckCircle2, XCircle, ArrowRight, Lightbulb, Layers } from 'lucide-react'
import { BOSQICH_RANG } from '@/lib/talim/darslar'
import { MavzuniMustahkamlash } from './MavzuniMustahkamlash'

type KursDars = {
  id: string
  modul_id: string | null
  bosqich: string
  modul_no: number
  modul_nom: string | null
  slug: string
  sarlavha: string
  kategoriya: string | null
  klinik_kirish: string | null
  nazariya_html: string | null
  video_url: string | null
  xulosa: string | null
  dars_natijalari: unknown
  daqiqa: number
}

type TezkorSavol = { id: string; savol: string; variantlar: string[] }
type TezkorNatija = { togri: number; jami: number; otdi: boolean; tugatdim: boolean; natijalar: { savol_id: string; togri: number; izoh: string | null }[] }
type QoshniDars = { slug: string; sarlavha: string; sort_order: number }

const YONALISH = 'urologiya'

const BOSQICH_NOM: Record<string, string> = { oson: 'Foundation', orta: 'Clinical', qiyin: 'Advanced' }

// YouTube havolasini embed ko'rinishiga o'giradi
function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

function natijalarRoyxat(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
}

export default function UroDarsViewer() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const slug = String(params?.slug ?? '')

  const [dars, setDars] = useState<KursDars | null>(null)
  const [loading, setLoading] = useState(true)
  const [keyingi, setKeyingi] = useState<QoshniDars | null>(null)

  // Tezkor test holati
  const [tezkor, setTezkor] = useState<TezkorSavol[] | null>(null)   // null — hali yuklanmagan/yo'q
  const [javoblar, setJavoblar] = useState<Record<string, number>>({})
  const [natija, setNatija] = useState<TezkorNatija | null>(null)
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [testXato, setTestXato] = useState('')

  const korildiRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const bosqichKey = dars?.bosqich === 'orta' ? "o'rta" : dars?.bosqich === 'qiyin' ? 'qiyin' : 'oson'
  const rang = BOSQICH_RANG[bosqichKey].accent

  // ── Dars + qo'shni darslar + tezkor bankni yuklash ──
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data } = await supabase.from('kurs_darslar')
        .select('id, modul_id, bosqich, modul_no, modul_nom, slug, sarlavha, kategoriya, klinik_kirish, nazariya_html, video_url, xulosa, dars_natijalari, daqiqa')
        .eq('slug', slug).eq('yonalish', YONALISH).eq('faol', true).maybeSingle()
      const d = (data as KursDars) ?? null
      setDars(d)
      setLoading(false)
      if (!d) return

      // Modul ichidagi keyingi dars (sort_order bo'yicha)
      if (d.modul_id) {
        const { data: qoshni } = await supabase.from('kurs_darslar')
          .select('slug, sarlavha, sort_order')
          .eq('yonalish', YONALISH).eq('modul_id', d.modul_id).eq('faol', true)
          .order('sort_order', { ascending: true })
        const list = (qoshni ?? []) as QoshniDars[]
        const idx = list.findIndex((x) => x.slug === d.slug)
        setKeyingi(idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null)
      }

      // Tezkor bank (togri'siz) — bo'lmasa (409) bo'lim yashiriladi
      try {
        const res = await fetch('/api/kurs/progress', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amal: 'tezkor', dars_id: d.id }),
        })
        if (res.ok) {
          const j = await res.json()
          setTezkor((j.savollar ?? []) as TezkorSavol[])
        } else {
          setTezkor(null) // 409/403 — bo'lim ko'rsatilmaydi
        }
      } catch {
        setTezkor(null)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // ── korildi: nazariya oxiriga yetganda bir marta belgilanadi ──
  const korildiYubor = useCallback(async (darsId: string) => {
    if (korildiRef.current) return
    korildiRef.current = true
    try {
      await fetch('/api/kurs/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amal: 'korildi', dars_id: darsId }),
      })
    } catch { /* progress yengil — xato jim o'tadi */ }
  }, [])

  useEffect(() => {
    if (!dars || !sentinelRef.current) return
    const el = sentinelRef.current
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) korildiYubor(dars.id)
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [dars, korildiYubor])

  const hammaJavobBerildi = tezkor != null && tezkor.every((s) => javoblar[s.id] !== undefined)

  const tekshir = async () => {
    if (!dars || !tezkor || !hammaJavobBerildi) return
    setYuborilmoqda(true); setTestXato('')
    try {
      const res = await fetch('/api/kurs/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amal: 'yakunla', dars_id: dars.id, javoblar: tezkor.map((s) => ({ savol_id: s.id, tanlov: javoblar[s.id] })) }),
      })
      if (!res.ok) { setTestXato('Natija saqlanmadi — internetni tekshirib qayta urining.'); setYuborilmoqda(false); return }
      const j = (await res.json()) as TezkorNatija
      setNatija(j)
      korildiRef.current = true // yakunla korildi'ni ham yozadi
    } catch {
      setTestXato('Natija saqlanmadi — internetni tekshirib qayta urining.')
    }
    setYuborilmoqda(false)
  }

  const qaytaIshla = () => { setJavoblar({}); setNatija(null); setTestXato('') }

  const togriIndeks = (savolId: string) => natija?.natijalar.find((n) => n.savol_id === savolId)?.togri
  const izohMatn = (savolId: string) => natija?.natijalar.find((n) => n.savol_id === savolId)?.izoh

  const natijaRoyxat = natijalarRoyxat(dars?.dars_natijalari)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header
        backHref={dars ? `/student/urologiya/darslar/bosqich/${dars.bosqich}` : '/student/urologiya/darslar'}
        backLabel={dars?.modul_nom ?? 'Urologiya darslari'}
      />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : !dars ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <p style={{ margin: '0 0 16px' }}>Dars topilmadi yoki hali nashr qilinmagan.</p>
            <button onClick={() => router.push('/student/urologiya/darslar')} style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              Darslar ro&apos;yxati
            </button>
          </div>
        ) : (
          <>
            {/* ── Yuqori qism: modul · bosqich · sarlavha · vaqt ── */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span style={{ display: 'inline-block', background: rang + '16', color: rang, borderRadius: '999px', padding: '3px 11px', fontSize: '11px', fontWeight: 700 }}>
                {BOSQICH_NOM[dars.bosqich] ?? dars.bosqich}
              </span>
              {dars.modul_nom && (
                <span style={{ display: 'inline-block', background: 'var(--surface-2)', color: 'var(--muted)', borderRadius: '999px', padding: '3px 11px', fontSize: '11px', fontWeight: 700 }}>
                  №{dars.modul_no} · {dars.modul_nom}
                </span>
              )}
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, lineHeight: 1.25 }}>{dars.sarlavha}</h1>
            <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} strokeWidth={2} /> {dars.daqiqa} daqiqa {dars.kategoriya ? `· ${dars.kategoriya}` : ''}
            </p>

            {/* O'quv natijalari */}
            {natijaRoyxat.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderLeft: `3px solid ${rang}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '18px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Bu darsdan keyin</p>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {natijaRoyxat.map((n, i) => (
                    <li key={i} style={{ fontSize: '13.5px', lineHeight: 1.5 }}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Klinik kirish */}
            {dars.klinik_kirish && (
              <div style={{ background: rang + '0e', border: `1px solid ${rang}33`, borderRadius: '12px', padding: '13px 15px', marginBottom: '18px', fontSize: '13.5px', lineHeight: 1.55, fontStyle: 'italic' }}>
                {dars.klinik_kirish}
              </div>
            )}

            {/* Asosiy video (nazariya ustida) */}
            {dars.video_url && (
              <div style={{ marginBottom: '20px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--line)' }}>
                {youtubeEmbed(dars.video_url) ? (
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe src={youtubeEmbed(dars.video_url)!} title={dars.sarlavha} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} />
                  </div>
                ) : (
                  <video src={dars.video_url} controls style={{ width: '100%', display: 'block', background: '#000' }} />
                )}
              </div>
            )}

            {/* Nazariya */}
            {dars.nazariya_html ? (
              <div className="maqola-html" dangerouslySetInnerHTML={{ __html: dars.nazariya_html }} />
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Bu dars mazmuni hali tayyorlanmoqda.</p>
            )}

            {/* korildi sentineli */}
            <div ref={sentinelRef} style={{ height: '1px' }} />

            {/* ── Tezkor test (3 savol, izohli, cheksiz urinish) ── */}
            {tezkor && tezkor.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>Tezkor tekshiruv</h2>
                <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '13px' }}>{tezkor.length} ta savol — o&apos;zingizni sinab ko&apos;ring. Bu baholanmaydi, cheksiz urinishingiz mumkin.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {tezkor.map((q, qi) => {
                    const togri = togriIndeks(q.id)
                    return (
                      <div key={q.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px' }}>
                        <p style={{ margin: '0 0 12px', fontSize: '14.5px', fontWeight: 700, lineHeight: 1.4 }}>{qi + 1}. {q.savol}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {q.variantlar.map((v, vi) => {
                            const tanlangan = javoblar[q.id] === vi
                            const buTogri = natija != null && togri === vi
                            let bg = 'var(--surface-2)', bd = 'var(--line)', col = 'var(--ink-soft)'
                            if (natija != null) {
                              if (buTogri) { bg = 'rgba(5,150,105,0.12)'; bd = 'var(--good)'; col = 'var(--good)' }
                              else if (tanlangan) { bg = 'rgba(220,38,38,0.10)'; bd = 'var(--danger)'; col = 'var(--danger)' }
                            } else if (tanlangan) { bg = rang + '16'; bd = rang; col = rang }
                            return (
                              <button key={vi} disabled={natija != null} aria-pressed={tanlangan}
                                onClick={() => setJavoblar((p) => ({ ...p, [q.id]: vi }))}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '9px', textAlign: 'left', width: '100%',
                                  background: bg, border: `1.5px solid ${bd}`, color: col, borderRadius: '10px',
                                  padding: '11px 13px', fontSize: '13.5px', fontWeight: 600,
                                  cursor: natija != null ? 'default' : 'pointer',
                                }}>
                                {natija != null && buTogri && <CheckCircle2 size={15} strokeWidth={2.4} style={{ flexShrink: 0 }} />}
                                {natija != null && tanlangan && !buTogri && <XCircle size={15} strokeWidth={2.4} style={{ flexShrink: 0 }} />}
                                <span>{v}</span>
                              </button>
                            )
                          })}
                        </div>
                        {natija != null && izohMatn(q.id) && (
                          <p style={{ margin: '10px 0 0', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 12px', display: 'flex', gap: '7px' }}>
                            <Lightbulb size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px', color: rang }} />
                            <span>{izohMatn(q.id)}</span>
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>

                {testXato && <p role="alert" style={{ margin: '12px 0 0', fontSize: '13px', fontWeight: 600, color: 'var(--danger)' }}>{testXato}</p>}

                {natija == null ? (
                  <button onClick={tekshir} disabled={!hammaJavobBerildi || yuborilmoqda}
                    style={{
                      marginTop: '16px', width: '100%', background: rang, color: '#fff', border: 'none',
                      borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700,
                      cursor: !hammaJavobBerildi || yuborilmoqda ? 'not-allowed' : 'pointer',
                      opacity: !hammaJavobBerildi || yuborilmoqda ? 0.6 : 1,
                    }}>
                    {yuborilmoqda ? 'Tekshirilmoqda…' : `Tekshirish ${hammaJavobBerildi ? '' : `(${Object.keys(javoblar).length}/${tezkor.length})`}`}
                  </button>
                ) : (
                  <div style={{ marginTop: '16px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800, color: natija.otdi ? 'var(--good)' : rang }}>
                      {natija.togri} / {natija.jami}
                    </p>
                    <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--muted)' }}>
                      {natija.otdi ? "to'g'ri javob · dars tugallandi ✓" : "to'g'ri javob"}
                    </p>
                    <button onClick={qaytaIshla}
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '10px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}>
                      Qayta ishlash
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Mavzuni mustahkamlash (dars-darajali: flashcard + amaliy) ── */}
            <MavzuniMustahkamlash darsId={dars.id} rang={rang} />

            {/* Xulosa */}
            {dars.xulosa && (
              <div style={{ marginTop: '28px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '16px', fontSize: '13.5px', lineHeight: 1.6 }}>
                <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Xulosa</p>
                {dars.xulosa}
              </div>
            )}

            {/* Keyingi mavzu / modul mashqlari */}
            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {keyingi ? (
                <button onClick={() => router.push(`/student/urologiya/darslar/${keyingi.slug}`)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%', background: rang, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 18px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                  <span><span style={{ opacity: 0.8, fontSize: '12px', display: 'block' }}>Keyingi mavzu</span>{keyingi.sarlavha}</span>
                  <ArrowRight size={18} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                </button>
              ) : dars.modul_id ? (
                <button onClick={() => router.push(`/student/urologiya/darslar/modul/${dars.modul_id}`)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%', background: rang, color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 18px', fontSize: '14.5px', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}><Layers size={17} strokeWidth={2} /> Modul yakuni — bilimni mustahkamlash</span>
                  <ArrowRight size={18} strokeWidth={2.2} style={{ flexShrink: 0 }} />
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
