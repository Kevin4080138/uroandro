'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import type { NewsRow, NewsStatus } from '@/lib/newsTypes'
import { MaqolaEditor, blankManual, type ActionName } from './MaqolaEditor'

const STATUS: NewsStatus[] = ['draft', 'approved', 'published', 'rejected', 'failed']
const LABEL: Record<NewsStatus, string> = { draft: 'Qoralama', approved: 'Tasdiqlangan', published: 'Nashr qilingan', rejected: 'Rad etilgan', failed: 'Xatoli' }
const input: React.CSSProperties = { width: '100%', border: '1px solid var(--line)', borderRadius: '9px', padding: '8px 10px', background: 'var(--surface-2)', color: 'var(--ink)', font: 'inherit', fontSize: '13px' }
type TestResult = { candidatesFound: number; draftsCreated: number; draftsEnriched: number; duplicates: number; geminiFailures: number; processedNewsId: string | null; errors: string[] }
type SourceRow = { id: string; source_key: string; name: string; specialties: string[]; is_enabled: boolean; priority: number; last_checked_at: string | null; last_success_at: string | null; last_error: string | null }
type Origin = 'all' | 'manual' | 'automation'

export default function AdminMaqolalarPage() {
  const supabase = useMemo(() => createClient(), [])
  const [status, setStatus] = useState<NewsStatus>('draft')
  const [origin, setOrigin] = useState<Origin>('all')
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

  const load = useCallback(async (requestedStatus: NewsStatus = status, requestedOrigin: Origin = origin) => {
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
    if (!editing.id) {
      setBusy('new'); setMessage('')
      try {
        const res = await fetch('/api/admin/yangiliklar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
        const json = await res.json(); if (!res.ok) throw new Error(json.error ?? 'Xatolik')
        setMessage('✅ Maqola yaratildi'); setStatus('draft'); setOrigin('manual')
        const rows = await load('draft', 'manual'); setEditing(rows.find((row) => row.id === json.id) ?? null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (error) { setMessage(`❌ ${error instanceof Error ? error.message : 'Xatolik'}`) } finally { setBusy(null) }
      return
    }
    setBusy(editing.id); setMessage('')
    const { id, title_uz, summary_uz, content_uz, student_importance, doctor_importance, patient_importance, telegram_post_uz, importance, content_type, audience, category, source_name, source_url, image_url } = editing
    const patch = editing.content_origin === 'manual'
      ? { title_uz, summary_uz, content_uz, student_importance, doctor_importance, patient_importance, telegram_post_uz, importance, content_type, audience, category, source_name, source_url, image_url, updated_at: new Date().toISOString() }
      : { title_uz, summary_uz, content_uz, student_importance, doctor_importance, patient_importance, telegram_post_uz, importance, content_type, audience, updated_at: new Date().toISOString() }
    const { error } = await supabase.from('yangiliklar').update(patch).eq('id', id)
    setBusy(null); setMessage(error ? `❌ ${error.message}` : '✅ Saqlandi'); if (!error) { const rows = await load(); setEditing(rows.find((row) => row.id === id) ?? null) }
  }

  const action = async (news: NewsRow, name: ActionName) => {
    if (name === 'resend' && !confirm('Telegram kanaliga qayta yuborilsinmi?')) return
    if (name === 'unpublish' && !confirm('Maqola nashrdan qaytarilib, bannerlari o‘chirilsinmi?')) return
    setBusy(news.id); setMessage('')
    try {
      const response = await fetch(`/api/admin/yangiliklar/${news.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: name, umumiyBanner }) })
      const json = await response.json(); if (!response.ok) throw new Error(json.error ?? 'Xatolik')
      setMessage('✅ Amal bajarildi')
      const nextStatus: NewsStatus = name === 'reject' ? 'rejected' : name === 'approve' ? 'approved' : name === 'unpublish' ? 'draft' : 'published'
      const rows = await load(nextStatus)
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
      try { json = JSON.parse(body) as TestResult & { error?: string } } catch { throw new Error(`HTTP ${response.status}: server noto‘g‘ri JSON qaytardi`) }
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${json.error ?? 'Test bajarilmadi'}`)
      setTestResult(json as TestResult); setStatus('draft'); setOrigin('automation')
      const rows = await load('draft', 'automation')
      const processed = rows.find((row) => row.id === json.processedNewsId)
      if (processed) { setEditing(processed); setUmumiyBanner(processed.importance === 'critical'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    } catch (error) { setMessage(`❌ ${error instanceof Error ? error.message : 'Test xatosi'}`) }
    finally { setBusy(null) }
  }

  const toggleSource = async (source: SourceRow) => {
    await supabase.from('yangilik_manbalari').update({ is_enabled: !source.is_enabled, enabled: !source.is_enabled, updated_at: new Date().toISOString() }).eq('id', source.id)
    setSources((rows) => rows.map((row) => row.id === source.id ? { ...row, is_enabled: !row.is_enabled } : row))
  }

  const pill = (active: boolean): React.CSSProperties => ({ border: '1px solid var(--line)', borderRadius: '999px', padding: '6px 13px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap', background: active ? 'var(--accent)' : 'var(--surface)', color: active ? 'white' : 'var(--ink)' })

  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
    <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '18px 14px 56px' }}>
      <h1 style={{ fontSize: '21px', margin: '0 0 4px' }}>📰 Maqolalar</h1>
      <p style={{ color: 'var(--muted)', margin: '0 0 14px', fontSize: '13px', lineHeight: 1.5 }}>Qo‘lda maqola qo‘shish hamda avtomatik yangiliklarni tekshirish, tahrirlash va nashr qilish.</p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <button onClick={() => { setEditing(blankManual()); setUmumiyBanner(false); setMessage(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ background: 'var(--accent)', color: 'white', border: 0, borderRadius: '10px', padding: '10px 14px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>➕ Yangi maqola</button>
        <button onClick={testRun} disabled={busy === 'test'} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: '10px', padding: '10px 14px', fontWeight: 800, fontSize: '13px', cursor: busy === 'test' ? 'wait' : 'pointer' }}>
          {busy === 'test' ? '⏳ Tekshirilmoqda...' : '🧪 Avtomatik yangilikni tekshirish'}
        </button>
      </div>

      {testResult && <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '11px', marginBottom: '14px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '11px', fontSize: '12px', fontWeight: 700 }}>
        <span>🔎 {testResult.candidatesFound}</span><span>📝 {testResult.draftsCreated}</span><span>✨ {testResult.draftsEnriched}</span><span>♻️ {testResult.duplicates}</span><span>🤖 {testResult.geminiFailures}</span><span>❌ {testResult.errors.length}</span>
        {testResult.errors.length > 0 && <details style={{ width: '100%', color: 'var(--danger)' }}><summary>Xatolar</summary><ul>{testResult.errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul></details>}
      </div>}

      <details style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '11px', padding: '11px', marginBottom: '12px' }}>
        <summary style={{ fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>Manbalar ({sources.filter((source) => source.is_enabled).length}/{sources.length} faol)</summary>
        <div style={{ display: 'grid', gap: '8px', marginTop: '11px' }}>{sources.map((source) => <div key={source.id} style={{ borderTop: '1px solid var(--line)', paddingTop: '8px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}><div style={{ fontSize: '12px' }}><b>{source.name}</b> · {source.specialties.join(', ')} · p{source.priority}<div style={{ fontSize: '11px', color: 'var(--muted)' }}>Tekshiruv: {source.last_checked_at ?? '—'}{source.last_error && <div style={{ color: 'var(--danger)' }}>{source.last_error}</div>}</div></div><button onClick={() => toggleSource(source)} style={{ ...pill(source.is_enabled) }}>{source.is_enabled ? 'Faol' : 'Nofaol'}</button></div>)}</div>
      </details>

      <details style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '11px', padding: '11px', marginBottom: '14px' }}>
        <summary style={{ fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>Filtrlar</summary>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '8px', marginTop: '11px' }}>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} style={input}><option value="all">Barcha manbalar</option>{sources.map((source) => <option key={source.id} value={source.source_key}>{source.name}</option>)}</select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={input}><option value="all">Barcha yo‘nalishlar</option><option value="urologiya">Urologiya</option><option value="ginekologiya">Ginekologiya</option><option value="andrologiya">Andrologiya</option></select>
          <select value={contentTypeFilter} onChange={(e) => setContentTypeFilter(e.target.value)} style={input}><option value="all">Barcha kontent</option>{['news', 'research_summary', 'guideline_update', 'educational_article', 'clinical_review', 'event'].map((value) => <option key={value}>{value}</option>)}</select>
          <select value={audienceFilter} onChange={(e) => setAudienceFilter(e.target.value)} style={input}><option value="all">Barcha auditoriya</option><option value="student">Talaba</option><option value="doctor">Shifokor</option><option value="patient">Bemor</option></select>
          <select value={telegramFilter} onChange={(e) => setTelegramFilter(e.target.value)} style={input}><option value="all">Barcha Telegram</option>{['pending', 'sent', 'failed', 'skipped'].map((value) => <option key={value}>{value}</option>)}</select>
          <select value={bannerFilter} onChange={(e) => setBannerFilter(e.target.value)} style={input}><option value="all">Barcha bannerlar</option>{['not_created', 'pending', 'active', 'failed'].map((value) => <option key={value}>{value}</option>)}</select>
          <input type="number" min="0" max="100" value={minImportance} onChange={(e) => setMinImportance(Number(e.target.value))} placeholder="Min ball" style={input} />
        </div>
      </details>

      <div style={{ display: 'flex', gap: '7px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '10px' }}>{STATUS.map((item) => <button key={item} onClick={() => { setStatus(item); setEditing(null) }} style={pill(status === item)}>{LABEL[item]}</button>)}</div>
      <div style={{ display: 'flex', gap: '7px', marginBottom: '16px' }}>{([['all', 'Hammasi'], ['manual', '✍️ Qo‘lda'], ['automation', '⚙️ Avtomatik']] as const).map(([value, text]) => <button key={value} onClick={() => setOrigin(value)} style={pill(origin === value)}>{text}</button>)}</div>

      {message && <p style={{ padding: '10px 12px', background: 'var(--surface)', borderRadius: '10px', fontSize: '13px' }}>{message}</p>}

      {editing && <MaqolaEditor editing={editing} setEditing={setEditing} busy={busy} umumiyBanner={umumiyBanner} setUmumiyBanner={setUmumiyBanner} onSave={save} onAction={(name) => action(editing, name)} onClose={() => setEditing(null)} />}

      <div style={{ display: 'grid', gap: '10px' }}>{items.map((news) => <article key={news.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '13px', padding: '13px', display: 'grid', gridTemplateColumns: news.image_url ? '84px 1fr' : '1fr', gap: '12px' }}>{news.image_url && <img src={news.image_url} alt="" style={{ width: '84px', height: '84px', objectFit: 'cover', borderRadius: '9px' }} />}<div style={{ minWidth: 0 }}><div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase' }}>{news.content_origin === 'manual' ? '✍️ Qo‘lda' : '⚙️'} · {news.category} · {news.content_type} · {news.importance_score ?? 0} ball</div><h2 style={{ fontSize: '15px', margin: '5px 0', lineHeight: 1.3 }}>{news.title_uz || news.original_title}</h2><p style={{ color: 'var(--muted)', fontSize: '12px', margin: '0 0 6px', lineHeight: 1.5 }}>{news.summary_uz || 'O‘zbekcha mazmun hali tayyor emas.'}</p><div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}><button onClick={() => { setEditing(news); setUmumiyBanner(news.importance === 'critical'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{ ...pill(false), padding: '6px 12px' }}>Ko‘rish / tahrirlash</button><span style={{ fontSize: '10px', color: 'var(--muted)' }}>Banner: {news.banner_approval_status ?? (bannerFaol[news.id] ? 'active' : 'not_created')} · TG: {news.telegram_status}</span></div></div></article>)}{!items.length && <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Bu holatda maqola yo‘q.</p>}</div>
    </div>
  </div>
}
