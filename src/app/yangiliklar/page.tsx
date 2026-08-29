import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import type { NewsRow } from '@/lib/newsTypes'

export const revalidate = 300

export const metadata = {
  title: 'Tibbiy maqolalar va yangiliklar — Urosfera',
  description: 'Urologiya, andrologiya va ginekologiya bo‘yicha so‘nggi tibbiy maqolalar, tadqiqot xulosalari va yangiliklar.',
}

const CAT_LABEL: Record<string, string> = { urologiya: 'Urologiya', andrologiya: 'Andrologiya', ginekologiya: 'Ginekologiya' }

export default async function YangiliklarRoyxati() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  const { data } = await supabase.from('yangiliklar')
    .select('id,slug,title_uz,summary_uz,category,image_url,published_at,source_date,content_type,original_title')
    .eq('status', 'published').order('published_at', { ascending: false }).limit(60)
  const items = (data ?? []) as Pick<NewsRow, 'id' | 'slug' | 'title_uz' | 'summary_uz' | 'category' | 'image_url' | 'published_at' | 'source_date' | 'content_type' | 'original_title'>[]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', padding: '22px 16px 56px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 700 }}>← Urosfera</Link>
        <h1 style={{ fontSize: 'clamp(24px,5vw,34px)', margin: '16px 0 6px', lineHeight: 1.15 }}>Maqolalar va yangiliklar</h1>
        <p style={{ color: 'var(--muted)', margin: '0 0 22px', fontSize: '14px', lineHeight: 1.6 }}>
          Urologiya, andrologiya va ginekologiya bo‘yicha so‘nggi tibbiy materiallar.
        </p>
        {!items.length && <p style={{ color: 'var(--muted)' }}>Hozircha nashr qilingan maqola yo‘q.</p>}
        <div style={{ display: 'grid', gap: '14px' }}>
          {items.map((news) => {
            const date = news.published_at ?? news.source_date
            return (
              <Link key={news.id} href={`/yangiliklar/${news.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article style={{
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                  overflow: 'hidden', display: 'grid',
                  gridTemplateColumns: news.image_url ? '96px 1fr' : '1fr',
                }}>
                  {news.image_url && <img src={news.image_url} alt="" loading="lazy" style={{ width: '96px', height: '100%', minHeight: '96px', objectFit: 'cover' }} />}
                  <div style={{ padding: '13px 15px', minWidth: 0 }}>
                    <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '.3px' }}>
                      {CAT_LABEL[news.category] ?? news.category}
                    </div>
                    <h2 style={{ fontSize: '15px', lineHeight: 1.3, margin: '5px 0 5px' }}>{news.title_uz ?? news.original_title}</h2>
                    {news.summary_uz && <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.summary_uz}</p>}
                    {date && <time style={{ display: 'block', marginTop: '7px', color: 'var(--muted)', fontSize: '11px' }}>{new Date(date).toLocaleDateString('uz-UZ')}</time>}
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
