'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { ContentTabs } from '../ContentTabs'
import { scheduleLabel, tashkentInput, type TelegramSchedule } from '@/lib/telegramSchedule'
import styles from './rejalar.module.css'

type Choice = { id: string; title: string; revision: number }
type Overview = { schedules: TelegramSchedule[]; posts: Choice[]; quizzes: Choice[];
  destinations: { id: string; name: string; use_for: string; is_active: boolean }[]; last_run_at: string | null; configured: boolean }
const labels: Record<TelegramSchedule['status'], string> = { pending: 'Rejalashtirilgan', sending: 'Yuborilmoqda', sent: 'Yuborilgan', failed: 'Xatoli', uncertain: 'Tekshirish kerak', cancelled: 'Bekor qilingan' }
async function readOverview(): Promise<Overview> {
  const response = await fetch('/api/admin/telegram-kontent/rejalar', { cache: 'no-store' })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? 'Rejalar yuklanmadi.')
  return body
}

export default function TelegramSchedulesPage() {
  const [data, setData] = useState<Overview | null>(null)
  const [now, setNow] = useState(0)
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false)
  const [kind, setKind] = useState<'post' | 'quiz'>('post'), [content, setContent] = useState(''), [destination, setDestination] = useState('')
  const [time, setTime] = useState(''), [filter, setFilter] = useState('active')
  const [editing, setEditing] = useState(''), [editTime, setEditTime] = useState('')
  async function load() {
    setData(await readOverview())
  }
  useEffect(() => {
    let active = true
    readOverview().then(body => { if (active) { setData(body); setNow(Date.now()) } }).catch(e => { if (active) setError(e.message) })
    const timer = setInterval(() => setNow(Date.now()), 30_000)
    return () => { active = false; clearInterval(timer) }
  }, [])
  async function mutate(method: string, body: object) {
    setBusy(true); setError(''); setNotice('')
    try {
      const response = await fetch('/api/admin/telegram-kontent/rejalar', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Amal bajarilmadi.')
      setEditing(''); await load(); setNotice('O‘zgarish saqlandi.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Xato yuz berdi.') }
    finally { setBusy(false) }
  }
  const choices = (kind === 'post' ? data?.posts : data?.quizzes)?.filter(c => !data?.schedules.some(s => (s.post_id === c.id || s.quiz_id === c.id) && ['pending', 'sending'].includes(s.status))) ?? []
  const destinations = data?.destinations.filter(d => d.is_active && (d.use_for === 'both' || d.use_for === (kind === 'post' ? 'posts' : 'quizzes'))) ?? []
  const selected = choices.find(c => c.id === content)
  const active = data?.schedules.filter(s => ['pending', 'sending'].includes(s.status)).length ?? 0
  const rows = data?.schedules.filter(s => filter === 'all' || (filter === 'active' ? ['pending', 'sending'].includes(s.status) : s.status === filter))
    .sort((a, b) => filter === 'active' ? a.scheduled_at.localeCompare(b.scheduled_at) : b.scheduled_at.localeCompare(a.scheduled_at)) ?? []
  const healthy = data?.last_run_at && now - new Date(data.last_run_at).getTime() < 6 * 60_000

  return <div className={styles.root}>
    <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
    <main className={styles.main}>
      <ContentTabs />
      <h1>Rejalashtirish</h1>
      <p className={styles.muted}>Tasdiqlangan post va quizlarni belgilangan vaqtda Telegramga yuboring. Barcha vaqtlar — Toshkent (UTC+5).</p>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {data && <section className={styles.health}>
        <strong>{active} ta faol reja · {healthy ? 'Avtomatik tekshiruv ishlayapti' : 'Avtomatik tekshiruvni ulash yoki tekshirish kerak'}</strong>
        <p className={styles.muted}>{data.last_run_at ? `Oxirgi tekshiruv: ${scheduleLabel(data.last_run_at)}` : 'Avtomatik yuborish xizmati hali murojaat qilmagan.'}
          {!data.configured && ' Serverda CRON_SECRET sozlanmagan.'}</p>
        <p className={styles.muted}>Vaqti kelgan rejalar navbat bilan yuboriladi. Xizmat uzilishi yoki katta navbat yuborishni kechiktirishi mumkin.</p>
      </section>}
      <section className={styles.card}>
        <h2>Yangi reja</h2>
        <form onSubmit={e => { e.preventDefault(); if (selected) void mutate('POST', { kind, content_id: selected.id, revision: selected.revision, destination_id: destination, time }) }}>
          <fieldset disabled={busy || !data} className={styles.form}>
            <label>Kontent turi<select value={kind} onChange={e => { setKind(e.target.value as 'post' | 'quiz'); setContent(''); setDestination('') }}><option value="post">Telegram post</option><option value="quiz">Quiz</option></select></label>
            <label>Tasdiqlangan kontent<select required value={content} onChange={e => setContent(e.target.value)}><option value="">Tanlang</option>{choices.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
            <label>Telegram manzili<select required value={destination} onChange={e => setDestination(e.target.value)}><option value="">Tanlang</option>{destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
            <label>Sana va vaqt (Toshkent)<input required type="datetime-local" value={time} onChange={e => setTime(e.target.value)} /></label>
            <p className={styles.muted}>Kontent avval o‘z bo‘limida saqlangan va tasdiqlangan bo‘lishi kerak. Faol reja turganda tahrirlash bloklanadi; avval rejani bekor qiling.</p>
            <button type="submit" disabled={!selected || !destination || !time}>Rejalashtirish</button>
          </fieldset>
        </form>
      </section>
      <section className={styles.card}>
        <div className={styles.toolbar}><h2>Yuborish taqvimi</h2><button disabled={busy} onClick={async () => { setBusy(true); setError(''); try { await load() } catch(e) { setError(e instanceof Error ? e.message : 'Xato') } finally { setBusy(false) } }}>Yangilash</button></div>
        <label>Holat<select value={filter} onChange={e => setFilter(e.target.value)}><option value="active">Faol rejalar</option><option value="all">Barchasi</option>{Object.entries(labels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        {!data ? <p>Yuklanmoqda…</p> : !rows.length ? <p className={styles.muted}>Bu holatda reja yo‘q.</p> : rows.map(row => <article key={row.id} className={styles.item}>
          <div className={styles.toolbar}><strong>{scheduleLabel(row.scheduled_at)}</strong><span>{labels[row.status]}</span></div>
          <h3>{row.title}</h3>
          <p className={styles.muted}>{row.quiz_id ? 'Quiz' : 'Post'} · {data.destinations.find(d => d.id === row.destination_id)?.name ?? 'Manzil'} · {row.revision}-versiya</p>
          {row.status === 'pending' && new Date(row.scheduled_at).getTime() < now && <p className={styles.error}>Vaqti keldi — navbatdagi avtomatik tekshiruv kutilmoqda.</p>}
          {row.last_error && <p role="status" className={styles.error}>{row.last_error}</p>}
          <div className={styles.toolbar}><Link href={row.quiz_id ? '/admin/maqolalar/quizlar' : '/admin/maqolalar/telegram'}>Kontent bo‘limini ochish</Link>
            {row.status === 'pending' && <><button disabled={busy} onClick={() => { setEditing(row.id); setEditTime(tashkentInput(new Date(row.scheduled_at))) }}>Vaqtni o‘zgartirish</button>
              <button disabled={busy} onClick={() => { if (confirm(`“${row.title}” uchun rejalashtirilgan yuborish bekor qilinsinmi?`)) void mutate('PATCH', { id: row.id, action: 'cancel' }) }}>Bekor qilish</button></>}
          </div>
          {editing === row.id && row.status === 'pending' && <form className={styles.toolbar} onSubmit={e => { e.preventDefault(); void mutate('PATCH', { id: row.id, action: 'reschedule', time: editTime }) }}>
            <label>Yangi vaqt (Toshkent)<input required type="datetime-local" value={editTime} onChange={e => setEditTime(e.target.value)} /></label><button disabled={busy}>Saqlash</button><button type="button" onClick={() => setEditing('')}>Yopish</button>
          </form>}
        </article>)}
      </section>
    </main>
  </div>
}
