'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import type { NewsRow, NewsStatus } from '@/lib/newsTypes'

const STATUS: NewsStatus[] = ['draft', 'approved', 'published', 'rejected', 'failed']
const LABEL: Record<NewsStatus, string> = { draft: 'Qoralama', approved: 'Tasdiqlangan', published: 'Nashr qilingan', rejected: 'Rad etilgan', failed: 'Xatoli' }
const input: React.CSSProperties = { width: '100%', border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 12px', background: 'var(--surface-2)', color: 'var(--ink)', font: 'inherit' }
type TestResult = { candidatesFound: number; draftsCreated: number; draftsEnriched: number; duplicates: number; geminiFailures: number; processedNewsId: string | null; errors: string[] }
type SourceRow = { id: string; source_key: string; name: string; specialties: string[]; is_enabled: boolean; priority: number; last_checked_at: string | null; last_success_at: string | null; last_error: string | null }

export default function AdminMaqolalarPage() {
  const supabase = useMemo(() => createClient(), [])
  const [status, setStatus] = useState<NewsStatus>('draft')
  const [origin, setOrigin] = useState<'all' | 'manual' | 'automation'>('all')
  const [items, setItems] = useState<NewsRow[]>([])
  const [editing, setEditing] = useState<NewsRow | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [umumiyBanner, setUmumiyBanner] = useState(false)
  const [bannerFaol, setBannerFaol] = useState<Record<string, boolean>>({})
  const [sources, setSources] = useState<SourceRow[]>([])
  const [sourceFilter, setSourceFilter] = useState('all')
  const [contentTypeFilter, setContentTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [audienceFilter, setAudienceFilter] = useState('all')
  const [telegramFilter, setTelegramFilter] = useState('all')
  const [bannerFilter, setBannerFilter] = useState('all')
  const [minImportance, setMinImportance] = useState(0)
  const load = useCallback(async (requestedStatus: NewsStatus = status, requestedOrigin: 'all' | 'manual' | 'automation' = origin) => {
    let query = supabase.from('yangiliklar').select('*').eq('status', requestedStatus)
      .order('updated_at', { ascending: false }).order('created_at', { ascending: false }).limit(100)
    if (requestedOrigin !== 'all') query = query.eq('content_origin', requestedOrigin)
    if (sourceFilter !== 'all') query = query.eq('source_key', sourceFilter)
    if (contentTypeFilter !== 'all') query = query.eq('content_type', contentTypeFilter)
    if (categoryFilter !== 'all') query = query.eq('category', categoryFilter)
    if (audienceFilter !== 'all') query = query.contains('audience', [audienceFilter])
    if (telegramFilter !== 'all') query = query.eq('telegram_status', telegramFilter)
    if (bannerFilter !== 'all') query = query.eq('banner_approval_status', bannerFilter)
    if (minImportance > 0) query = query.gte('importance_score', minImportance)
    const { data } = await query
    const rows = (data ?? []) as NewsRow[]
    setItems(rows)
    if (rows.length) {
      const { data: banners } = await supabase.from('bannerlar').select('yangilik_id,faol,arxiv').in('yangilik_id', rows.map((row) => row.id))
      const active: Record<string, boolean> = {}
      for (const banner of banners ?? []) if (banner.yangilik_id && banner.faol && !banner.arxiv) active[banner.yangilik_id] = true
      setBannerFaol(active)
    } else setBannerFaol({})
    return rows
  }, [audienceFilter, bannerFilter, categoryFilter, contentTypeFilter, minImportance, origin, sourceFilter, status, supabase, telegramFilter])
  // Ma'lumot tarmoq javobidan keyin yangilanadi; bu sinxron cascading render emas.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])
  useEffect(() => { void supabase.from('yangilik_manbalari').select('id,source_key,name,specialties,is_enabled,priority,last_checked_at,last_success_at,last_error').order('priority').then(({ data }) => setSources((data ?? []) as SourceRow[])) }, [supabase])

  const save = async () => {
    if (!editing) return
    setBusy(editing.id); setMessage('')
    const { id, title_uz, summary_uz, content_uz, student_importance, doctor_importance, patient_importance, telegram_post_uz, importance, content_type, audience } = editing
    const { error } = await supabase.from('yangiliklar').update({ title_uz, summary_uz, content_uz, student_importance, doctor_importance, patient_importance, telegram_post_uz, importance, content_type, audience, updated_at: new Date().toISOString() }).eq('id', id)
    setBusy(null); setMessage(error ? `❌ ${error.message}` : '✅ Saqlandi'); if (!error) { const rows = await load(); setEditing(rows.find((row) => row.id === id) ?? null) }
  }
  const action = async (news: NewsRow, name: 'approve' | 'banner' | 'telegram' | 'publish' | 'reject' | 'resend') => {
    if (name === 'resend' && !confirm('Telegram kanaliga qayta yuborilsinmi?')) return
    setBusy(news.id); setMessage('')
    try {
      const response = await fetch(`/api/admin/yangiliklar/${news.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: name, umumiyBanner }) })
      const json = await response.json(); if (!response.ok) throw new Error(json.error ?? 'Xatolik')
      setMessage('✅ Amal bajarildi'); const rows = await load(name === 'reject' ? 'rejected' : name === 'approve' ? 'approved' : 'published')
      const nextStatus = name === 'reject' ? 'rejected' : name === 'approve' ? 'approved' : 'published'
      setStatus(nextStatus); setEditing(rows.find((row) => row.id === news.id) ?? null)
    } catch (error) { setMessage(`❌ ${error instanceof Error ? error.message : 'Xatolik'}`) } finally { setBusy(null) }
  }
  const testRun = async () => {
    setBusy('test'); setMessage(''); setTestResult(null)
    try {
      const response = await fetch('/api/admin/yangiliklar/test', { method: 'POST' })
      const contentType = response.headers.get('content-type') ?? ''
      const body = await response.text()
      if (!contentType.toLowerCase().includes('application/json')) {
        const detail = body.trim().slice(0, 1000) || 'Server bo‘sh javob qaytardi'
        throw new Error(`HTTP ${response.status}: ${detail}`)
      }
      let json: TestResult & { error?: string }
      try {
        json = JSON.parse(body) as TestResult & { error?: string }
      } catch {
        throw new Error(`HTTP ${response.status}: server noto‘g‘ri JSON qaytardi`)
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${json.error ?? 'Test bajarilmadi'}`)
      setTestResult(json as TestResult)
      setStatus('draft')
      setOrigin('automation')
      const rows = await load('draft', 'automation')
      const processed = rows.find((row) => row.id === json.processedNewsId)
      if (processed) {
        setEditing(processed); setUmumiyBanner(processed.importance === 'critical')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) { setMessage(`❌ ${error instanceof Error ? error.message : 'Test xatosi'}`) }
    finally { setBusy(null) }
  }
  const field = (key: keyof NewsRow, title: string, rows = 2) => editing && <label style={{ display: 'grid', gap: '5px' }}><span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)' }}>{title}</span><textarea rows={rows} value={String(editing[key] ?? '')} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} style={{ ...input, resize: 'vertical' }} /></label>
  const toggleSource = async (source: SourceRow) => { await supabase.from('yangilik_manbalari').update({ is_enabled: !source.is_enabled, enabled: !source.is_enabled, updated_at: new Date().toISOString() }).eq('id', source.id); setSources((rows) => rows.map((row) => row.id === source.id ? { ...row, is_enabled: !row.is_enabled } : row)) }

  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
    <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 22px 60px' }}>
      <h1 style={{ fontSize: '24px', margin: '0 0 6px' }}>📰 Kunlik tibbiy yangiliklar</h1><p style={{ color: 'var(--muted)', margin: '0 0 14px' }}>Manbadan kelgan materiallarni tekshirish, tahrirlash va nashr qilish.</p>
      <button onClick={testRun} disabled={busy === 'test'} style={{ background: 'var(--accent)', color: 'white', border: 0, borderRadius: '11px', padding: '11px 16px', fontWeight: 800, cursor: busy === 'test' ? 'wait' : 'pointer', marginBottom: '12px' }}>
        {busy === 'test' ? '⏳ Tekshirilmoqda...' : '🧪 Kunlik yangilikni hozir tekshirish'}
      </button>
      {testResult && <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px', marginBottom: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}>
        <span>🔎 Topildi: {testResult.candidatesFound}</span><span>📝 Draft yaratildi: {testResult.draftsCreated}</span><span>✨ Gemini to‘ldirdi: {testResult.draftsEnriched}</span><span>♻️ Dublikat: {testResult.duplicates}</span><span>🤖 Gemini xatosi: {testResult.geminiFailures}</span><span>❌ Xato: {testResult.errors.length}</span>
        {testResult.errors.length > 0 && <details style={{ width: '100%', color: 'var(--danger)' }}><summary>Xatolarni ko‘rish</summary><ul>{testResult.errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul></details>}
      </div>}
      <details style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '12px', marginBottom: '18px' }}><summary style={{ fontWeight: 800, cursor: 'pointer' }}>Manbalar ({sources.filter((source) => source.is_enabled).length}/{sources.length} faol)</summary><div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>{sources.map((source) => <div key={source.id} style={{ borderTop: '1px solid var(--line)', paddingTop: '8px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}><div><b>{source.name}</b> · {source.specialties.join(', ')} · priority {source.priority}<div style={{ fontSize: '12px', color: 'var(--muted)' }}>Tekshiruv: {source.last_checked_at ?? '—'} · Muvaffaqiyat: {source.last_success_at ?? '—'}{source.last_error && <div style={{ color: 'var(--danger)' }}>{source.last_error}</div>}</div></div><button onClick={() => toggleSource(source)}>{source.is_enabled ? 'Faol' : 'Nofaol'}</button></div>)}</div></details>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>{STATUS.map((item) => <button key={item} onClick={() => { setStatus(item); setEditing(null) }} style={{ border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 14px', cursor: 'pointer', fontWeight: 700, background: status === item ? 'var(--accent)' : 'var(--surface)', color: status === item ? 'white' : 'var(--ink)' }}>{LABEL[item]}</button>)}</div>
      <div style={{ display: 'flex', gap: '8px', margin: '-12px 0 20px' }}>{([['all', 'Hammasi'], ['manual', '✍️ Qo‘lda'], ['automation', '⚙️ Avtomatik']] as const).map(([value, text]) => <button key={value} onClick={() => setOrigin(value)} style={{ border: '1px solid var(--line)', borderRadius: '9px', padding: '7px 12px', background: origin === value ? 'var(--accent)' : 'var(--surface)', color: origin === value ? 'white' : 'var(--ink)', cursor: 'pointer' }}>{text}</button>)}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '8px', marginBottom: '20px' }}><select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={input}><option value="all">Barcha manbalar</option>{sources.map((source) => <option key={source.id} value={source.source_key}>{source.name}</option>)}</select><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={input}><option value="all">Barcha yo‘nalishlar</option><option value="urologiya">Urologiya</option><option value="ginekologiya">Ginekologiya</option><option value="andrologiya">Andrologiya</option></select><select value={contentTypeFilter} onChange={(e) => setContentTypeFilter(e.target.value)} style={input}><option value="all">Barcha kontent</option>{['news','research_summary','guideline_update','educational_article','clinical_review','event'].map((value) => <option key={value}>{value}</option>)}</select><select value={audienceFilter} onChange={(e) => setAudienceFilter(e.target.value)} style={input}><option value="all">Barcha auditoriya</option><option value="student">Talaba</option><option value="doctor">Shifokor</option><option value="patient">Bemor</option></select><select value={telegramFilter} onChange={(e) => setTelegramFilter(e.target.value)} style={input}><option value="all">Barcha Telegram</option>{['pending','sent','failed','skipped'].map((value) => <option key={value}>{value}</option>)}</select><select value={bannerFilter} onChange={(e) => setBannerFilter(e.target.value)} style={input}><option value="all">Barcha bannerlar</option>{['not_created','pending','active','failed'].map((value) => <option key={value}>{value}</option>)}</select><input type="number" min="0" max="100" value={minImportance} onChange={(e) => setMinImportance(Number(e.target.value))} placeholder="Minimal ball" style={input} /></div>
      {message && <p style={{ padding: '10px 12px', background: 'var(--surface)', borderRadius: '10px' }}>{message}</p>}
      {editing && <section style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'grid', gap: '14px', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Tahrirlash va banner preview</h2><a href={editing.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{editing.source_name}: {editing.original_title} ↗</a>
        {editing.image_url && <img src={editing.image_url} alt="Yangilik rasmi" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} />}
        <div style={{ minHeight: '180px', borderRadius: '14px', padding: '22px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: editing.image_url ? `linear-gradient(to top,rgba(0,0,0,.8),transparent),url(${editing.image_url}) center/cover` : 'linear-gradient(135deg,#0891b2,#2563eb)' }}><b style={{ fontSize: '20px' }}>{editing.title_uz || editing.original_title}</b><span>{editing.summary_uz}</span></div>
        {field('title_uz', "O'zbekcha sarlavha")}{field('summary_uz', 'Qisqa mazmun', 3)}{field('content_uz', 'Maqola matni', 9)}{field('telegram_post_uz', 'Telegram uchun umumiy matn', 9)}{field('student_importance', 'Talaba uchun: nima uchun muhim?', 3)}{field('doctor_importance', 'Shifokor uchun: nima uchun muhim?', 3)}{field('patient_importance', 'Bemor uchun: nima uchun muhim?', 3)}
        <label style={{ display: 'grid', gap: '5px' }}><span style={{ fontSize: '12px', fontWeight: 800 }}>MUHIMLIK</span><select value={editing.importance} onChange={(e) => setEditing({ ...editing, importance: e.target.value as NewsRow['importance'] })} style={input}><option value="normal">Oddiy</option><option value="high">Muhim</option><option value="critical">Juda muhim</option></select></label>
        <label style={{ display: 'grid', gap: '5px' }}><span style={{ fontSize: '12px', fontWeight: 800 }}>KONTENT TURI</span><select value={editing.content_type} onChange={(e) => setEditing({ ...editing, content_type: e.target.value as NewsRow['content_type'] })} style={input}>{['news','research_summary','guideline_update','educational_article','clinical_review','event'].map((value) => <option key={value}>{value}</option>)}</select></label>
        <div style={{ display: 'flex', gap: '12px' }}>{(['student','doctor','patient'] as const).map((role) => <label key={role}><input type="checkbox" checked={editing.audience?.includes(role)} onChange={(e) => setEditing({ ...editing, audience: e.target.checked ? [...(editing.audience ?? []), role] : (editing.audience ?? []).filter((item) => item !== role) })} /> {role}</label>)}</div>
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><input type="checkbox" checked={umumiyBanner} onChange={(e) => setUmumiyBanner(e.target.checked)} /> Uch rol o‘rniga bitta “hamma” banner</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}><button onClick={save} disabled={busy === editing.id}>💾 Saqlash</button>{editing.status === 'draft' && <button onClick={() => action(editing, 'approve')}>✅ Tasdiqlash</button>}{['approved', 'published'].includes(editing.status) && <button onClick={() => action(editing, 'banner')}>🖼 Bannerga chiqarish</button>}{['approved', 'published'].includes(editing.status) && <button onClick={() => action(editing, editing.telegram_status === 'sent' ? 'resend' : 'telegram')}>✈️ Telegramga yuborish</button>}{['approved', 'published'].includes(editing.status) && <button onClick={() => action(editing, 'publish')}>🚀 Banner + Telegram</button>}{editing.status !== 'rejected' && <button onClick={() => action(editing, 'reject')}>⛔ Rad etish</button>}<button onClick={() => setEditing(null)}>Yopish</button></div>
      </section>}
      <div style={{ display: 'grid', gap: '12px' }}>{items.map((news) => <article key={news.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px', display: 'grid', gridTemplateColumns: news.image_url ? '110px 1fr' : '1fr', gap: '14px' }}>{news.image_url && <img src={news.image_url} alt="" style={{ width: '110px', height: '90px', objectFit: 'cover', borderRadius: '10px' }} />}<div><div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800 }}>{news.category.toUpperCase()} · {news.source_name} · {news.content_type} · {news.importance_score ?? 0} ball</div><h2 style={{ fontSize: '16px', margin: '5px 0' }}>{news.title_uz || news.original_title}</h2><p style={{ color: 'var(--muted)', fontSize: '13px', margin: '0 0 4px' }}>{news.summary_uz || 'O‘zbekcha mazmun hali tayyor emas.'}</p><p style={{ color: 'var(--muted)', fontSize: '11px', margin: '0 0 9px' }}>Manba sanasi: {news.source_published_at ?? news.source_date ?? '—'} · Auditoriya: {(news.audience ?? []).join(', ') || '—'} · Sabab: {(news.importance_reasons ?? []).join('; ') || '—'}</p><button onClick={() => { setEditing(news); setUmumiyBanner(news.importance === 'critical'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Ko‘rish / tahrirlash</button><span style={{ marginLeft: '10px', fontSize: '11px', color: 'var(--muted)' }}>Banner: {news.banner_approval_status ?? (bannerFaol[news.id] ? 'active' : 'not_created')} · Telegram: {news.telegram_status}</span></div></article>)}{!items.length && <p style={{ color: 'var(--muted)' }}>Bu holatda yangilik yo‘q.</p>}</div>
    </div>
  </div>
}
