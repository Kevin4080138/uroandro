import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import type { NewsRow } from '@/lib/newsTypes'

export default async function YangilikPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  const { data, error } = await supabase.from('yangiliklar').select('*').eq('slug', slug).eq('status', 'published').maybeSingle()
  if (error) console.error(`[daily-news][public-article] slug=${slug} code=${error.code} ${error.message}`)
  if (!data) notFound()
  const news = data as NewsRow
  const date = news.source_date ?? news.published_at

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', padding: '28px 18px 64px' }}>
      <article style={{ maxWidth: '820px', margin: '0 auto' }}>
        <Link href="/" style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 700 }}>← Urosfera</Link>
        <header style={{ marginTop: '22px', marginBottom: '24px' }}>
          <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}>{news.category}</div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.12, margin: '8px 0 12px' }}>{news.title_uz}</h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '17px' }}>{news.summary_uz}</p>
          {date && <time style={{ color: 'var(--muted)', fontSize: '12px' }}>{new Date(date).toLocaleDateString('uz-UZ')}</time>}
        </header>
        {news.image_url && <img src={news.image_url} alt={news.title_uz ?? news.original_title} style={{ width: '100%', maxHeight: '460px', objectFit: 'cover', borderRadius: '18px' }} />}
        {news.image_credit && <p style={{ fontSize: '11px', color: 'var(--muted)' }}>{news.image_credit}</p>}
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.85, fontSize: '16px', margin: '28px 0' }}>{news.content_uz}</div>
        <section style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          {[
            ['🎓 Talaba uchun', news.student_importance], ['👨‍⚕️ Shifokor uchun', news.doctor_importance], ['🧑 Bemor uchun', news.patient_importance],
          ].map(([title, text]) => text && <div key={title} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px' }}>
            <h2 style={{ fontSize: '15px', margin: '0 0 8px' }}>{title}: nima uchun muhim?</h2><p style={{ margin: 0, lineHeight: 1.6, fontSize: '14px' }}>{text}</p>
          </div>)}
        </section>
        <aside style={{ marginTop: '28px', background: '#fff7ed', color: '#9a3412', borderRadius: '14px', padding: '16px', lineHeight: 1.6 }}>
          Bu material ma’rifiy maqsadda. Individual tashxis yoki davolash uchun shifokorga murojaat qiling.
        </aside>
        <section style={{ marginTop: '22px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '15px' }}>Original manba</h2>
          <p style={{ margin: '4px 0' }}><b>Manba:</b> {news.source_name}</p>
          <p style={{ margin: '4px 0' }}><b>Nashr sanasi:</b> {news.source_date ? new Date(news.source_date).toLocaleDateString('uz-UZ') : 'Ko‘rsatilmagan'}</p>
          <p style={{ margin: '4px 0' }}><b>Original sarlavha:</b> {news.original_title}</p>
          <p style={{ margin: '4px 0' }}><b>URL:</b>{' '}<a href={news.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', overflowWrap: 'anywhere' }}>{news.source_url}</a></p>
        </section>
      </article>
    </main>
  )
}
