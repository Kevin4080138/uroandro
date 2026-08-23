'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'

type TestSavol = { savol: string; variantlar: string[]; togri: number; izoh?: string }
type GinDars = { slug: string; sarlavha: string; kategoriya: string | null; bosqich: string; qisqa: string | null; video_url: string | null; nazariya_html: string | null; test_savollar: TestSavol[]; daqiqa: number }

// YouTube havolasini embed ko'rinishiga o'giradi
function youtubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

export default function GinDarsViewer() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const slug = String(params?.slug ?? '')
  const [dars, setDars] = useState<GinDars | null>(null)
  const [loading, setLoading] = useState(true)

  // Test holati
  const [javoblar, setJavoblar] = useState<Record<number, number>>({})
  const [tekshirildi, setTekshirildi] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('gin_darslar')
        .select('slug, sarlavha, kategoriya, bosqich, qisqa, video_url, nazariya_html, test_savollar, daqiqa')
        .eq('slug', slug).eq('faol', true).maybeSingle()
      setDars((data as GinDars) ?? null)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const test = dars?.test_savollar ?? []
  const togriSoni = test.filter((q, i) => javoblar[i] === q.togri).length

  const tekshir = async () => {
    setTekshirildi(true)
    if (!test.length) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const foiz = Math.round((togriSoni / test.length) * 100)
    await supabase.from('gin_natijalar').upsert(
      { student_id: user.id, dars_slug: slug, ball: togriSoni, jami: test.length, foiz, updated_at: new Date().toISOString() },
      { onConflict: 'student_id,dars_slug' }
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/ginekologiya/darslar" backLabel="Ginekologiya darslari" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '20px 20px 40px' }}>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
        ) : !dars ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <p style={{ margin: '0 0 16px' }}>Dars topilmadi.</p>
            <button onClick={() => router.push('/student/ginekologiya/darslar')} style={{ background: 'var(--gyn)', color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              Darslar ro&apos;yxati
            </button>
          </div>
        ) : (
          <>
            <span style={{ display: 'inline-block', background: 'var(--gyn-soft)', color: 'var(--gyn)', borderRadius: '999px', padding: '3px 11px', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
              Ginekologiya
            </span>
            <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, lineHeight: 1.25 }}>{dars.sarlavha}</h1>
            <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={13} strokeWidth={2} /> {dars.daqiqa} daqiqa {dars.kategoriya ? `· ${dars.kategoriya}` : ''}
            </p>

            {/* Video */}
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

            {dars.nazariya_html ? (
              <div className="maqola-html" dangerouslySetInnerHTML={{ __html: dars.nazariya_html }} />
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Bu dars mazmuni hali tayyorlanmoqda.</p>
            )}

            {/* ── Test ── */}
            {test.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>Test</h2>
                <p style={{ margin: '0 0 16px', color: 'var(--muted)', fontSize: '13px' }}>{test.length} ta savol — bilimingizni tekshiring.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {test.map((q, qi) => (
                    <div key={qi} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px' }}>
                      <p style={{ margin: '0 0 12px', fontSize: '14.5px', fontWeight: 700, lineHeight: 1.4 }}>{qi + 1}. {q.savol}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {q.variantlar.map((v, vi) => {
                          const tanlangan = javoblar[qi] === vi
                          const togri = vi === q.togri
                          let bg = 'var(--surface-2)', bd = 'var(--line)', col = 'var(--ink-soft)'
                          if (tekshirildi) {
                            if (togri) { bg = 'rgba(5,150,105,0.12)'; bd = 'var(--good)'; col = 'var(--good)' }
                            else if (tanlangan) { bg = 'rgba(220,38,38,0.10)'; bd = 'var(--danger)'; col = 'var(--danger)' }
                          } else if (tanlangan) { bg = 'var(--gyn-soft)'; bd = 'var(--gyn)'; col = 'var(--gyn)' }
                          return (
                            <button key={vi} disabled={tekshirildi} onClick={() => setJavoblar((p) => ({ ...p, [qi]: vi }))}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '9px', textAlign: 'left', width: '100%',
                                background: bg, border: `1.5px solid ${bd}`, color: col, borderRadius: '10px',
                                padding: '11px 13px', fontSize: '13.5px', fontWeight: 600,
                                cursor: tekshirildi ? 'default' : 'pointer',
                              }}>
                              {tekshirildi && togri && <CheckCircle2 size={15} strokeWidth={2.4} style={{ flexShrink: 0 }} />}
                              {tekshirildi && tanlangan && !togri && <XCircle size={15} strokeWidth={2.4} style={{ flexShrink: 0 }} />}
                              <span>{v}</span>
                            </button>
                          )
                        })}
                      </div>
                      {tekshirildi && q.izoh && (
                        <p style={{ margin: '10px 0 0', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 12px' }}>
                          {q.izoh}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {!tekshirildi ? (
                  <button onClick={tekshir} disabled={Object.keys(javoblar).length < test.length}
                    style={{
                      marginTop: '16px', width: '100%', background: 'var(--gyn)', color: '#fff', border: 'none',
                      borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700,
                      cursor: Object.keys(javoblar).length < test.length ? 'not-allowed' : 'pointer',
                      opacity: Object.keys(javoblar).length < test.length ? 0.6 : 1,
                    }}>
                    Tekshirish {Object.keys(javoblar).length < test.length ? `(${Object.keys(javoblar).length}/${test.length})` : ''}
                  </button>
                ) : (
                  <div style={{ marginTop: '16px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800, color: togriSoni === test.length ? 'var(--good)' : 'var(--gyn)' }}>
                      {togriSoni} / {test.length}
                    </p>
                    <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--muted)' }}>to&apos;g&apos;ri javob</p>
                    <button onClick={() => { setJavoblar({}); setTekshirildi(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '10px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}>
                      Qayta ishlash
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
