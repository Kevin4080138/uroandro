'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { SkeletonRow } from '@/components/Skeleton'
import { createClient } from '@/lib/supabase'
import type { NewsCategory, TegRow } from '@/lib/newsTypes'

type FeedRow = {
  id: string; slug: string; title_uz: string | null; summary_uz: string | null; original_title: string
  category: NewsCategory; image_url: string | null; published_at: string | null; source_name: string
  tags: string[]; trust_tier: number; verification_status: string; reading_level: string | null; content_type: string
}

const CAT_LABEL: Record<string, string> = { urologiya: 'Urologiya', andrologiya: 'Andrologiya', ginekologiya: 'Ginekologiya' }
const LEVEL: Record<string, string> = { easy: 'Boshlang‘ich', orta: 'O‘rta', qiyin: 'Chuqur' }

export function YangiliklarFeed({ audience, backHref }: { audience: 'student' | 'doctor'; backHref: string }) {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [items, setItems] = useState<FeedRow[]>([])
  const [tags, setTags] = useState<TegRow[]>([])
  const [saqlangan, setSaqlangan] = useState<Set<string>>(new Set())
  const [oqilgan, setOqilgan] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [qidiruv, setQidiruv] = useState('')
  const [category, setCategory] = useState<'all' | NewsCategory>('all')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [faqatSaqlangan, setFaqatSaqlangan] = useState(false)
  const [faqatOqilmagan, setFaqatOqilmagan] = useState(false)

  const load = useCallback(async () => {
    const { data } = await supabase.from('yangiliklar')
      .select('id,slug,title_uz,summary_uz,original_title,category,image_url,published_at,source_name,tags,trust_tier,verification_status,reading_level,content_type')
      .eq('status', 'published').contains('audience', [audience])
      .order('published_at', { ascending: false }).limit(80)
    setItems((data ?? []) as FeedRow[])
    setLoading(false)
  }, [audience, supabase])

  // Ma'lumot tarmoq javobidan keyin yangilanadi; sinxron cascading render emas.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])
  useEffect(() => {
    void supabase.from('yangilik_teglari').select('id,slug,nom_uz,category,created_at').order('nom_uz').then(({ data }) => setTags((data ?? []) as TegRow[]))
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      void supabase.from('saqlangan_maqolalar').select('yangilik_id').eq('user_id', data.user.id)
        .then(({ data: rows }) => setSaqlangan(new Set((rows ?? []).map((r) => r.yangilik_id as string))))
      void supabase.from('oqilgan_maqolalar').select('yangilik_id').eq('user_id', data.user.id)
        .then(({ data: rows }) => setOqilgan(new Set((rows ?? []).map((r) => r.yangilik_id as string))))
    })
  }, [supabase])

  const ochish = async (id: string, slug: string) => {
    router.push(`/yangiliklar/${slug}`)
    if (!userId || oqilgan.has(id)) return
    setOqilgan((prev) => new Set(prev).add(id))
    await supabase.from('oqilgan_maqolalar').upsert({ user_id: userId, yangilik_id: id }, { onConflict: 'user_id,yangilik_id' })
  }

  const toggleSaqla = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const { data } = await supabase.auth.getUser()
    if (!data.user) { router.push('/auth/login'); return }
    const bor = saqlangan.has(id)
    setSaqlangan((prev) => { const next = new Set(prev); if (bor) next.delete(id); else next.add(id); return next })
    if (bor) await supabase.from('saqlangan_maqolalar').delete().eq('user_id', data.user.id).eq('yangilik_id', id)
    else await supabase.from('saqlangan_maqolalar').insert({ user_id: data.user.id, yangilik_id: id })
  }

  // Mavjud teglar — faqat feʼddagi maqolalarda uchraydiganlari.
  const mavjudTeglar = useMemo(() => {
    const set = new Set<string>(); for (const item of items) for (const tag of item.tags ?? []) set.add(tag)
    return tags.filter((tag) => set.has(tag.slug))
  }, [items, tags])

  const korinadigan = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    return items.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (activeTag && !(item.tags ?? []).includes(activeTag)) return false
      if (faqatSaqlangan && !saqlangan.has(item.id)) return false
      if (faqatOqilmagan && oqilgan.has(item.id)) return false
      if (q && !`${item.title_uz ?? item.original_title} ${item.summary_uz ?? ''}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [items, category, activeTag, faqatSaqlangan, faqatOqilmagan, saqlangan, oqilgan, qidiruv])

  const chip = (active: boolean): React.CSSProperties => ({
    border: '1px solid var(--line)', borderRadius: '999px', padding: '6px 13px', cursor: 'pointer',
    fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', flex: 'none',
    background: active ? 'var(--accent)' : 'var(--surface)', color: active ? '#fff' : 'var(--ink)',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref={backHref} backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>📰 Yangiliklar va maqolalar</h2>
        <p className="rise" style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          {audience === 'doctor'
            ? 'Tasdiqlangan manbalardan klinik yangilik, qo‘llanma va tadqiqot xulosalari.'
            : 'Tasdiqlangan manbalardan tibbiy yangilik va tushunarli maqolalar.'}
        </p>

        {/* Qidiruv + filtr */}
        <div className="rise" style={{ display: 'grid', gap: '10px', marginBottom: '14px', animationDelay: '.08s' }}>
          <input value={qidiruv} onChange={(e) => setQidiruv(e.target.value)} placeholder="🔍 Sarlavha bo‘yicha qidirish"
            style={{ width: '100%', border: '1px solid var(--line)', borderRadius: '12px', padding: '11px 14px', background: 'var(--surface)', color: 'var(--ink)', font: 'inherit', fontSize: '14px' }} />
          <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px' }}>
            {(['all', 'urologiya', 'andrologiya', 'ginekologiya'] as const).map((value) => (
              <button key={value} onClick={() => setCategory(value)} style={chip(category === value)}>
                {value === 'all' ? 'Hammasi' : CAT_LABEL[value]}
              </button>
            ))}
            <button onClick={() => setFaqatSaqlangan((v) => !v)} style={chip(faqatSaqlangan)}>🔖 Saqlangan</button>
            {userId && <button onClick={() => setFaqatOqilmagan((v) => !v)} style={chip(faqatOqilmagan)}>🆕 O‘qilmagan</button>}
          </div>
          {mavjudTeglar.length > 0 && (
            <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '2px' }}>
              {mavjudTeglar.map((tag) => (
                <button key={tag.id} onClick={() => setActiveTag((prev) => prev === tag.slug ? null : tag.slug)} style={chip(activeTag === tag.slug)}>
                  {tag.nom_uz}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : korinadigan.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '56px 24px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px', lineHeight: 1 }}>🗞️</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>Maqola topilmadi</div>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6, maxWidth: '280px', marginInline: 'auto' }}>
              Filtrlarni o‘zgartiring yoki keyinroq qaytib keling — baza doimiy to‘lib boradi.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {korinadigan.map((news, i) => (
              <article key={news.id} onClick={() => ochish(news.id, news.slug)}
                className="rise lift"
                style={{
                  animationDelay: `${Math.min(i * 0.04, 0.4)}s`, cursor: 'pointer',
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                  overflow: 'hidden', display: 'grid', gridTemplateColumns: news.image_url ? '92px 1fr' : '1fr',
                }}>
                {news.image_url && <img src={news.image_url} alt="" loading="lazy" style={{ width: '92px', height: '100%', minHeight: '92px', objectFit: 'cover' }} />}
                <div style={{ padding: '13px 15px', minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '5px' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.3px' }}>{CAT_LABEL[news.category] ?? news.category}</span>
                    {userId && !oqilgan.has(news.id) && (
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#fff', background: 'var(--accent)', padding: '2px 7px', borderRadius: '6px' }}>🆕 Yangi</span>
                    )}
                    {news.verification_status === 'tasdiqlangan' && (
                      <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--good)', background: 'color-mix(in srgb, var(--good) 14%, transparent)', padding: '2px 7px', borderRadius: '6px' }}>✔ Tasdiqlangan</span>
                    )}
                    {news.reading_level && LEVEL[news.reading_level] && (
                      <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--muted)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: '6px' }}>{LEVEL[news.reading_level]}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '15px', lineHeight: 1.3, margin: '0 0 5px', fontWeight: 700 }}>{news.title_uz ?? news.original_title}</h3>
                  {news.summary_uz && <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.summary_uz}</p>}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginTop: '9px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '11px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {news.source_name}{news.published_at ? ` · ${new Date(news.published_at).toLocaleDateString('uz-UZ')}` : ''}
                    </span>
                    <button onClick={(e) => toggleSaqla(news.id, e)} aria-label="Saqlash"
                      style={{ flex: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px', lineHeight: 1, padding: '2px', color: saqlangan.has(news.id) ? 'var(--accent)' : 'var(--muted)' }}>
                      {saqlangan.has(news.id) ? '🔖' : '📄'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
