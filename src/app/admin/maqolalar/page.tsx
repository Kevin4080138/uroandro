'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import type { NewsRow, NewsStatus } from '@/lib/newsTypes'

const STATUS: NewsStatus[] = ['draft', 'approved', 'published', 'rejected', 'failed']
const LABEL: Record<NewsStatus, string> = { draft: 'Qoralama', approved: 'Tasdiqlangan', published: 'Nashr qilingan', rejected: 'Rad etilgan', failed: 'Xatoli' }
const input: React.CSSProperties = { width: '100%', border: '1px solid var(--line)', borderRadius: '10px', padding: '10px 12px', background: 'var(--surface-2)', color: 'var(--ink)', font: 'inherit' }
type TestResult = { candidatesFound: number; draftsCreated: number; duplicates: number; errors: string[] }

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
  const load = useCallback(async () => {
    let query = supabase.from('yangiliklar').select('*').eq('status', status).order('created_at', { ascending: false }).limit(100)
    if (origin !== 'all') query = query.eq('content_origin', origin)
    const { data } = await query
    setItems((data ?? []) as NewsRow[])
  }, [origin, status, supabase])
  // Ma'lumot tarmoq javobidan keyin yangilanadi; bu sinxron cascading render emas.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])

  const save = async () => {
    if (!editing) return
    setBusy(editing.id); setMessage('')
    const { id, title_uz, summary_uz, content_uz, student_importance, doctor_importance, patient_importance, importance } = editing
    const { error } = await supabase.from('yangiliklar').update({ title_uz, summary_uz, content_uz, student_importance, doctor_importance, patient_importance, importance, updated_at: new Date().toISOString() }).eq('id', id)
    setBusy(null); setMessage(error ? `❌ ${error.message}` : '✅ Saqlandi'); if (!error) await load()
  }
  const action = async (news: NewsRow, name: 'approve' | 'publish' | 'reject' | 'resend') => {
    if ((name === 'publish' || name === 'resend') && !confirm(name === 'resend' ? 'Telegram kanaliga qayta yuborilsinmi?' : 'Yangilik nashr qilinsinmi?')) return
    setBusy(news.id); setMessage('')
    try {
      const response = await fetch(`/api/admin/yangiliklar/${news.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: name, umumiyBanner }) })
      const json = await response.json(); if (!response.ok) throw new Error(json.error ?? 'Xatolik')
      setMessage('✅ Amal bajarildi'); setEditing(null); await load()
    } catch (error) { setMessage(`❌ ${error instanceof Error ? error.message : 'Xatolik'}`) } finally { setBusy(null) }
  }
  const testRun = async () => {
    setBusy('test'); setMessage(''); setTestResult(null)
    try {
      const response = await fetch('/api/admin/yangiliklar/test', { method: 'POST' })
      const json = await response.json()
      if (!response.ok) throw new Error(json.error ?? 'Test bajarilmadi')
      setTestResult(json as TestResult)
      setStatus('draft')
      await load()
    } catch (error) { setMessage(`❌ ${error instanceof Error ? error.message : 'Test xatosi'}`) }
    finally { setBusy(null) }
  }
  const field = (key: keyof NewsRow, title: string, rows = 2) => editing && <label style={{ display: 'grid', gap: '5px' }}><span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)' }}>{title}</span><textarea rows={rows} value={String(editing[key] ?? '')} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} style={{ ...input, resize: 'vertical' }} /></label>

  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
    <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 22px 60px' }}>
      <h1 style={{ fontSize: '24px', margin: '0 0 6px' }}>📰 Kunlik tibbiy yangiliklar</h1><p style={{ color: 'var(--muted)', margin: '0 0 14px' }}>Manbadan kelgan materiallarni tekshirish, tahrirlash va nashr qilish.</p>
      <button onClick={testRun} disabled={busy === 'test'} style={{ background: 'var(--accent)', color: 'white', border: 0, borderRadius: '11px', padding: '11px 16px', fontWeight: 800, cursor: busy === 'test' ? 'wait' : 'pointer', marginBottom: '12px' }}>
        {busy === 'test' ? '⏳ Tekshirilmoqda...' : '🧪 Kunlik yangilikni hozir tekshirish'}
      </button>
      {testResult && <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px', marginBottom: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}>
        <span>🔎 Topildi: {testResult.candidatesFound}</span><span>📝 Draft yaratildi: {testResult.draftsCreated}</span><span>♻️ Dublikat: {testResult.duplicates}</span><span>❌ Xato: {testResult.errors.length}</span>
        {testResult.errors.length > 0 && <details style={{ width: '100%', color: 'var(--danger)' }}><summary>Xatolarni ko‘rish</summary><ul>{testResult.errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}</ul></details>}
      </div>}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '22px' }}>{STATUS.map((item) => <button key={item} onClick={() => { setStatus(item); setEditing(null) }} style={{ border: '1px solid var(--line)', borderRadius: '999px', padding: '8px 14px', cursor: 'pointer', fontWeight: 700, background: status === item ? 'var(--accent)' : 'var(--surface)', color: status === item ? 'white' : 'var(--ink)' }}>{LABEL[item]}</button>)}</div>
      <div style={{ display: 'flex', gap: '8px', margin: '-12px 0 20px' }}>{([['all', 'Hammasi'], ['manual', '✍️ Qo‘lda'], ['automation', '⚙️ Avtomatik']] as const).map(([value, text]) => <button key={value} onClick={() => setOrigin(value)} style={{ border: '1px solid var(--line)', borderRadius: '9px', padding: '7px 12px', background: origin === value ? 'var(--accent)' : 'var(--surface)', color: origin === value ? 'white' : 'var(--ink)', cursor: 'pointer' }}>{text}</button>)}</div>
      {message && <p style={{ padding: '10px 12px', background: 'var(--surface)', borderRadius: '10px' }}>{message}</p>}
      {editing && <section style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px', display: 'grid', gap: '14px', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>Tahrirlash va banner preview</h2><a href={editing.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>{editing.source_name}: {editing.original_title} ↗</a>
        {editing.image_url && <img src={editing.image_url} alt="Yangilik rasmi" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} />}
        <div style={{ minHeight: '180px', borderRadius: '14px', padding: '22px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: editing.image_url ? `linear-gradient(to top,rgba(0,0,0,.8),transparent),url(${editing.image_url}) center/cover` : 'linear-gradient(135deg,#0891b2,#2563eb)' }}><b style={{ fontSize: '20px' }}>{editing.title_uz || editing.original_title}</b><span>{editing.summary_uz}</span></div>
        {field('title_uz', "O'zbekcha sarlavha")}{field('summary_uz', 'Qisqa mazmun', 3)}{field('content_uz', 'Maqola matni', 9)}{field('student_importance', 'Talaba uchun: nima uchun muhim?', 3)}{field('doctor_importance', 'Shifokor uchun: nima uchun muhim?', 3)}{field('patient_importance', 'Bemor uchun: nima uchun muhim?', 3)}
        <label style={{ display: 'grid', gap: '5px' }}><span style={{ fontSize: '12px', fontWeight: 800 }}>MUHIMLIK</span><select value={editing.importance} onChange={(e) => setEditing({ ...editing, importance: e.target.value as NewsRow['importance'] })} style={input}><option value="normal">Oddiy</option><option value="high">Muhim</option><option value="critical">Juda muhim</option></select></label>
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><input type="checkbox" checked={umumiyBanner} onChange={(e) => setUmumiyBanner(e.target.checked)} /> Uch rol o‘rniga bitta “hamma” banner</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}><button onClick={save} disabled={busy === editing.id}>💾 Saqlash</button>{editing.status === 'draft' && <button onClick={() => action(editing, 'approve')}>✅ Tasdiqlash</button>}{['draft', 'approved'].includes(editing.status) && <button onClick={() => action(editing, 'publish')}>🚀 Nashr qilish</button>}{editing.status !== 'rejected' && <button onClick={() => action(editing, 'reject')}>⛔ Rad etish</button>}{editing.status === 'published' && <button onClick={() => action(editing, 'resend')}>✈️ Telegramga qayta yuborish</button>}<button onClick={() => setEditing(null)}>Yopish</button></div>
      </section>}
      <div style={{ display: 'grid', gap: '12px' }}>{items.map((news) => <article key={news.id} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '16px', display: 'grid', gridTemplateColumns: news.image_url ? '110px 1fr' : '1fr', gap: '14px' }}>{news.image_url && <img src={news.image_url} alt="" style={{ width: '110px', height: '90px', objectFit: 'cover', borderRadius: '10px' }} />}<div><div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800 }}>{news.category.toUpperCase()} · {news.source_name}</div><h2 style={{ fontSize: '16px', margin: '5px 0' }}>{news.title_uz || news.original_title}</h2><p style={{ color: 'var(--muted)', fontSize: '13px', margin: '0 0 9px' }}>{news.summary_uz || 'O‘zbekcha mazmun hali tayyor emas.'}</p><button onClick={() => { setEditing(news); setUmumiyBanner(news.importance === 'critical'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Ko‘rish / tahrirlash</button><span style={{ marginLeft: '10px', fontSize: '11px', color: 'var(--muted)' }}>Telegram: {news.telegram_status}</span></div></article>)}{!items.length && <p style={{ color: 'var(--muted)' }}>Bu holatda yangilik yo‘q.</p>}</div>
    </div>
  </div>
}
