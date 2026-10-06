'use client'

/* eslint-disable @next/next/no-img-element -- Quiz rasmlari serverda optimallashtirilgan WebP. */
import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { ContentTabs } from '../ContentTabs'
import { CONTENT_STATUS_LABELS, type TelegramContentOverview, type TelegramDestination } from '@/lib/telegramContent'
import { balanceQuizAnswers, emptyQuizQuestion, QUIZ_LIMIT, quizSaveInput, quizWarnings, type QuizDetail, type QuizDraft, type QuizQuestion } from '@/lib/telegramQuiz'
import { QuizQuestionEditor } from './QuizQuestionEditor'
import { QuizDestinations } from './QuizDestinations'
import s from './quizlar.module.css'

const ROOT = '/api/admin/telegram-kontent'
const path = (id: string) => `${ROOT}/quizlar/${id}`
async function api<T>(url: string, method = 'GET', data?: unknown): Promise<T> {
  const body = data instanceof FormData ? data : data === undefined ? undefined : JSON.stringify(data)
  const res = await fetch(url, { method, cache: 'no-store', body, ...(body && !(body instanceof FormData) ? { headers: { 'Content-Type': 'application/json' } } : {}) })
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error(json?.error || `So‘rov bajarilmadi (HTTP ${res.status}).`)
  return json as T
}
const jobLabels: Record<string, string> = { sending: 'Yuborilmoqda', sent: 'Yuborildi', failed: 'Xatoli — davom ettirish mumkin', uncertain: 'Natija noaniq — Telegramni tekshiring', queued: 'Navbatda', cancelled: 'Bekor qilingan' }

export function QuizWorkspace() {
  const [overview, setOverview] = useState<TelegramContentOverview | null>(null)
  const [detail, setDetail] = useState<QuizDetail | null>(null)
  const [draft, setDraft] = useState<QuizDraft | null>(null)
  const [topic, setTopic] = useState(''), [filter, setFilter] = useState('all')
  const [count, setCount] = useState(3), [destinationId, setDestinationId] = useState('')
  const [instructions, setInstructions] = useState('')
  const [sourceText, setSourceText] = useState(''), [sourceTitle, setSourceTitle] = useState(''), [sourceUrl, setSourceUrl] = useState('')
  const [busy, setBusy] = useState(''), [loading, setLoading] = useState(true)
  const [error, setError] = useState(''), [notice, setNotice] = useState('')
  const dirty = !!draft && JSON.stringify(draft) !== JSON.stringify(detail?.quiz)
  const locked = Boolean(detail?.jobs.length)
  const disabled = Boolean(busy) || loading
  useEffect(() => {
    let active = true
    api<TelegramContentOverview>(ROOT).then((data) => { if (active) setOverview(data) }).catch((e: Error) => { if (active) setError(e.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    if (!dirty) return
    const prevent = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', prevent)
    return () => window.removeEventListener('beforeunload', prevent)
  }, [dirty])
  async function run(label: string, task: () => Promise<void>) {
    setBusy(label); setError(''); setNotice('')
    try { await task(); return true } catch (e) { setError(e instanceof Error ? e.message : 'Amal bajarilmadi.'); return false }
    finally { setBusy('') }
  }
  function accept(data: QuizDetail) {
    if (data.quiz.id !== draft?.id) { setInstructions(''); setSourceText(''); setSourceTitle(''); setSourceUrl('') }
    setDetail(data); setDraft(data.quiz)
    setOverview((o) => o ? { ...o, quizzes: o.quizzes.map((q) => q.id === data.quiz.id ? { ...q, title: data.quiz.title, status: data.quiz.status } : q) } : o)
  }
  async function select(id: string) {
    if (dirty && !window.confirm('Saqlanmagan o‘zgarishlarni tashlab, boshqa quiz ochilsinmi?')) return
    await run('Quiz ochilmoqda…', async () => { accept(await api<QuizDetail>(path(id))) })
  }
  async function save(status: 'draft' | 'review' | 'approved') {
    if (!draft) return
    await run('Saqlanmoqda…', async () => {
      const input = quizSaveInput({ ...draft, status })
      accept(await api<QuizDetail>(path(draft.id), 'PATCH', input))
      setNotice(status === 'approved' ? 'Quiz tasdiqlandi. Manzilni tanlab yuborishingiz mumkin.' : 'Quiz saqlandi.')
    })
  }
  const update = (patch: Partial<QuizDraft>) => setDraft((q) => q ? { ...q, ...patch } : q)
  const changeQuestion = (index: number, question: QuizQuestion) => update({ questions: draft!.questions.map((q, n) => n === index ? question : q) })
  const destinations = (overview?.destinations ?? []).filter((d) => d.is_active && ['both', 'quizzes'].includes(d.use_for))
  const postOnlyDestinations = (overview?.destinations ?? []).filter((d) => d.is_active && d.use_for === 'posts')
  const saveDestination = (value: Omit<TelegramDestination, 'id'>, id: string | null) => run('Manzil saqlanmoqda…', async () => {
    await api(ROOT, id ? 'PATCH' : 'POST', { ...value, resource: 'destination', ...(id ? { id } : {}) })
    setOverview(await api<TelegramContentOverview>(ROOT)); setNotice('Manzil saqlandi.')
  })
  const warnings = draft ? quizWarnings(draft.questions) : []
  const canSend = draft && !dirty && ['approved', 'sent', 'failed'].includes(draft.status) && destinationId && overview?.botConfigured
  const thisJob = detail?.jobs.find((j) => j.destination_id === destinationId)
  const blocked = thisJob && !['failed'].includes(thisJob.status)

  return <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
    <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
    <div className={s.page}>
      <ContentTabs /><h1>Quizlar</h1>
      <p className={s.muted}>Mavzudan savollar yarating yoki o‘zingiz tuzing. Tahrirlab, tekshirib va tasdiqlab, Telegram guruh yoki kanaliga yuboring.</p>
      {error && <div className={s.error} role="alert">{error}</div>}
      {notice && <p className={s.notice} role="status">{notice}</p>}
      {(busy || loading) && <p role="status" aria-live="polite">{busy || 'Yuklanmoqda…'}</p>}
      {!overview && !loading && <button className={s.secondary} disabled={disabled} onClick={() => void run('Yuklanmoqda…', async () => setOverview(await api<TelegramContentOverview>(ROOT)))}>Qayta yuklash</button>}
      {overview && <>
        <div className={s.row} style={{ marginBottom: 16 }}><span className={s.badge}>AI: {overview.aiConfigured ? 'sozlangan' : 'sozlanmagan'}</span><span className={s.badge}>Bot: {overview.botConfigured ? 'sozlangan' : 'sozlanmagan'}</span><span className={s.badge}>Anonim quiz · 4–5 variant</span></div>
        <form className={s.panel} onSubmit={(e) => {
          e.preventDefault()
          if (dirty && !window.confirm('Saqlanmagan quizni qoldirib, yangi mavzu ochilsinmi?')) return
          void run('Quiz yaratilmoqda…', async () => {
            const { id } = await api<{ id: string }>(ROOT, 'POST', { kind: 'quiz', topic })
            setOverview(await api<TelegramContentOverview>(ROOT)); accept(await api<QuizDetail>(path(id))); setTopic('')
          })
        }}><div className={s.row}><label className={s.label} style={{ flex: '1 1 260px' }}>Yangi quiz mavzusi<input className={s.input} required maxLength={240} disabled={disabled} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Masalan: siydik tizimi anatomiyasi" /></label><button className={s.button} disabled={disabled || !topic.trim()}>Quiz ochish</button></div></form>
        <div className={s.grid}>
          <aside className={s.panel}><h2>Quiz to‘plamlari</h2><select className={s.input} aria-label="Quiz holati" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">Hammasi</option>{Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
            {overview.quizzes.filter((q) => filter === 'all' || q.status === filter).map((q) => <button className={s.item} key={q.id} disabled={disabled} aria-current={q.id === draft?.id} onClick={() => void select(q.id)}><strong>{q.title}</strong><br /><small>{CONTENT_STATUS_LABELS[q.status]}</small></button>)}
            {!overview.quizzes.length && <p className={s.muted}>Yuqorida birinchi mavzuni kiriting.</p>}
            {overview.quizzes.length === 50 && <small>So‘nggi 50 ta quiz ko‘rsatilmoqda.</small>}
          </aside>
          <div className={s.stack}>
            {!draft && <section className={s.panel}>Mavzuni oching yoki ro‘yxatdan quiz tanlang.</section>}
            {draft && <>
              <section className={`${s.panel} ${s.stack}`}>
                <div className={s.spread}><h2>Quiz muharriri</h2><span className={s.badge}>{dirty ? 'Saqlanmagan o‘zgarishlar' : CONTENT_STATUS_LABELS[draft.status]} · v{draft.revision}</span></div>
                {locked && <p className={s.muted}>Bu quizni yuborish boshlangan. Savollar va javoblar statistika bilan birga saqlanadi. O‘zgartirish uchun yangi quiz oching.</p>}
                <label className={s.label}>Sarlavha<input className={s.input} disabled={disabled || locked} maxLength={240} value={draft.title} onChange={(e) => update({ title: e.target.value })} /></label>
                <label className={s.label}>Mavzu<input className={s.input} disabled={disabled || locked} maxLength={240} value={draft.topic} onChange={(e) => update({ topic: e.target.value })} /></label>
                <div className={s.fields}>
                  <label className={s.label}>Daraja<select className={s.input} disabled={disabled || locked} value={draft.difficulty} onChange={(e) => update({ difficulty: e.target.value as QuizDraft['difficulty'] })}><option value="easy">EASY</option><option value="orta">O‘RTA</option><option value="qiyin">QIYIN</option></select></label>
                  <label className={s.label}>Mavzu turi<select className={s.input} disabled={disabled || locked} value={draft.subject_type} onChange={(e) => update({ subject_type: e.target.value as QuizDraft['subject_type'] })}><option value="clinical">Klinik</option><option value="normalogiya">Normalogiya</option></select></label>
                  <label className={s.label}>Auditoriya<select className={s.input} disabled={disabled || locked} value={draft.audience} onChange={(e) => update({ audience: e.target.value as QuizDraft['audience'] })}><option value="student">Talaba</option><option value="doctor">Shifokor</option><option value="patient">Keng omma</option></select></label>
                </div>
                {!locked && <div className={s.stack}>
                  <p className={s.muted}>Avtomatik rejim faqat platformadagi Campbell-Walsh-Wein asosidagi inson urologiyasi darslarini manba qiladi. Mos dars topilmasa savol yaratilmaydi.</p>
                  <label className={s.label}>AI uchun talablar<textarea className={s.input} disabled={disabled} maxLength={2000} value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Masalan: nefronning turli qismlari va funksiyalarini solishtiring; har savol boshqa tuzilmani tekshirsin." /></label>
                  <details><summary>O‘z adabiyotim asosida yaratish</summary>
                    <p className={s.muted}>Maydonlar ushbu yaratish uchun ishlatiladi. Matn kiritsangiz, AI shu manbaga asoslanadi; havolaning o‘zi avtomatik o‘qilmaydi.</p>
                    <label className={s.label}>Adabiyot nomi va bob<input className={s.input} disabled={disabled} maxLength={400} value={sourceTitle} onChange={e => setSourceTitle(e.target.value)} /></label>
                    <label className={s.label}>Manbaning HTTPS havolasi<input className={s.input} disabled={disabled} type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} /></label>
                    <label className={s.label}>Mavzuga tegishli matn<textarea className={s.input} disabled={disabled} rows={8} maxLength={30000} value={sourceText} onChange={e => setSourceText(e.target.value)} /></label>
                  </details>
                </div>}
                {!locked && <div className={s.row}>
                  <label>AI savollar soni <select className={s.input} style={{ width: 75 }} disabled={disabled} value={count} onChange={(e) => setCount(Number(e.target.value))}>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select></label>
                  <button className={s.button} disabled={disabled || !overview.aiConfigured} onClick={() => {
                    if (draft.questions.length && !window.confirm('Muharrirdagi savollar yangi AI qoralamasi bilan almashtirilsinmi? Saqlamaguncha bazadagi savollar saqlanadi.')) return
                    void run('Urologiya darsligi tanlanmoqda, savollar tekshirilmoqda…', async () => {
                      const result = await api<{ questions: QuizQuestion[] }>(path(draft.id), 'POST', { ...draft, count, instructions, source_text: sourceText, source_title: sourceTitle, source_url: sourceUrl, action: 'generate' })
                      update({ questions: result.questions }); setNotice('AI qoralamasi tayyor. Manbalar, javoblar va izohlarni tekshirib, saqlang.')
                    })
                  }}>AI bilan yaratish</button>
                  <button className={s.secondary} disabled={disabled || draft.questions.length >= QUIZ_LIMIT} onClick={() => update({ questions: [...draft.questions, emptyQuizQuestion()] })}>Qo‘lda savol qo‘shish</button>
                </div>}
                {draft.questions.map((q, i) => <QuizQuestionEditor key={`${draft.id}-${i}`} question={q} index={i} total={draft.questions.length} disabled={disabled || locked} allowCase={draft.difficulty === 'qiyin' && draft.subject_type === 'clinical'} onChange={(q) => changeQuestion(i, q)}
                  onRemove={() => { if (window.confirm(`${i + 1}-savol muharrirdan olib tashlansinmi?`)) update({ questions: draft.questions.filter((_, n) => n !== i) }) }}
                  onMove={(direction) => { const questions = [...draft.questions]; [questions[i], questions[i + direction]] = [questions[i + direction], questions[i]]; update({ questions }) }}
                  onUpload={async (file, credit, license) => { await run('Rasm optimallashtirilmoqda…', async () => {
                    const form = new FormData(); form.set('file', file); form.set('credit', credit); form.set('license', license); form.set('rights_confirmed', 'true')
                    const image = await api<Partial<QuizQuestion>>(`${path(draft.id)}/image`, 'POST', form)
                    changeQuestion(i, { ...q, ...image }); setNotice('Rasm yuklandi. Quizni saqlang.')
                  }) }} />)}
                {warnings.length > 0 && <details><summary>Tekshirish uchun eslatmalar ({warnings.length})</summary><ul className={s.muted}>{warnings.map((w) => <li key={w}>{w}</li>)}</ul></details>}
                {!locked && <div className={s.row}>
                  <button className={s.secondary} disabled={disabled || !draft.questions.length} onClick={() => update({ questions: balanceQuizAnswers(draft.questions) })}>Javob harflarini muvozanatlash</button>
                  <button className={s.button} disabled={disabled} onClick={() => void save('draft')}>Qoralamani saqlash</button>
                  <button className={s.secondary} disabled={disabled || !draft.questions.length} onClick={() => void save('review')}>Tekshirishga tayyor</button>
                  <button className={s.button} disabled={disabled || !draft.questions.length} onClick={() => void save('approved')}>Tekshirdim, tasdiqlash</button>
                </div>}
              </section>
              <section className={`${s.panel} ${s.stack}`}><h2>Telegram ko‘rinishi</h2>
                {draft.questions.map((q, i) => <div className={s.preview} key={i}>
                  {q.image_url && <img className={s.image} src={q.image_url} alt={`${i + 1}-savol rasmi`} />}
                  {q.case_text && <p>{q.case_text}</p>}{q.image_url && <small>Rasm: {q.image_credit} · {q.image_license}</small>}
                  <strong>{i + 1}. {q.question || 'Savol matni'}</strong>
                  {q.options.map((option, n) => <div className={s.previewOption} key={n}>{String.fromCharCode(65 + n)}. {option || 'Variant'}</div>)}
                  <details><summary>Admin uchun: to‘g‘ri javob va izoh</summary><p>{String.fromCharCode(65 + q.correct_option)} · {q.explanation}</p></details>
                </div>)}
                <p className={s.muted}>Telegramda izoh javob tanlangandan keyin quiz ichida ochiladi. Vaziyat va rasm bo‘lsa, ular savoldan oldin yuboriladi.</p>
                <label className={s.label}>Yuboriladigan manzil<select className={s.input} disabled={disabled} value={destinationId} onChange={(e) => setDestinationId(e.target.value)}><option value="">Manzilni tanlang</option>{destinations.map((d) => <option key={d.id} value={d.id}>{d.name} · {d.chat_id}</option>)}</select></label>
                {!destinations.length && !postOnlyDestinations.length && <p className={s.muted}>Quyidagi sozlamalarda quiz uchun faol manzil qo‘shing.</p>}
                {postOnlyDestinations.map((d) => <div className={s.spread} key={d.id}>
                  <span className={s.muted}><strong>{d.name}</strong> mavjud, lekin faqat postlar uchun sozlangan.</span>
                  <button className={s.secondary} disabled={disabled} onClick={() => void saveDestination({ name: d.name, chat_id: d.chat_id, chat_type: d.chat_type, use_for: 'both', is_active: true }, d.id).then((ok) => { if (ok) setDestinationId(d.id) })}>Quiz uchun ham yoqish</button>
                </div>)}
                {dirty && <p className={s.muted}>Yuborishdan oldin o‘zgarishlarni saqlang va tasdiqlang.</p>}
                <button className={s.button} disabled={disabled || !canSend || Boolean(blocked)} onClick={() => {
                  const name = destinations.find((d) => d.id === destinationId)?.name
                  if (!window.confirm(`${draft.questions.length} ta savol “${name}” manziliga yuborilsinmi?`)) return
                  void run('Telegramga yuborilmoqda…', async () => {
                    try { accept(await api<QuizDetail>(path(draft.id), 'POST', { action: 'send', destination_id: destinationId, revision: draft.revision })); setNotice('Quiz Telegramga yuborildi.') }
                    catch (error) { try { accept(await api<QuizDetail>(path(draft.id))) } catch { /* Asosiy xatoni saqlaymiz. */ } throw error }
                  })
                }}>{thisJob?.status === 'failed' ? 'Yuborilmagan qismlarni davom ettirish' : thisJob?.status === 'sent' ? 'Bu manzilga yuborilgan' : 'Telegramga yuborish'}</button>
                {detail?.jobs.map((j) => <div key={j.id}><strong>{overview.destinations.find((d) => d.id === j.destination_id)?.name ?? 'Telegram manzili'}</strong> · {jobLabels[j.status] ?? j.status}<div className={s.muted}>{j.parts.filter((p) => p.status === 'sent').length} ta qism yuborilgan</div>{j.last_error && <p className={s.error}>{j.last_error}</p>}</div>)}
              </section>
              <section className={`${s.panel} ${s.stack}`}><div className={s.spread}><h2>Javoblar statistikasi</h2><button className={s.secondary} disabled={disabled || dirty} onClick={() => void run('Natijalar yangilanmoqda…', async () => accept(await api<QuizDetail>(path(draft.id))))}>Yangilash</button></div>
                <p className={s.muted}>Har savol uchun umumiy ovozlar ko‘rsatiladi. Anonim quizda ismlar va shaxsiy reyting yig‘ilmaydi.</p>
                <button className={s.secondary} disabled={disabled || !overview.botConfigured} onClick={() => void run('Telegram statistikasi ulanmoqda…', async () => { await api(`${ROOT}/quizlar/statistics`, 'POST'); setNotice('Statistika ulandi. Yangi ovozlar kelganda natijalar yangilanadi.') })}>Statistikani Telegramga ulash</button>
                {!detail?.polls.length && <p className={s.muted}>Quiz yuborilgandan keyin natijalar shu yerda chiqadi.</p>}
                {detail?.polls.map((poll) => <article key={poll.poll_id} className={s.question}><strong>{poll.question}</strong>
                  <span className={s.muted}>{poll.total_voter_count === null ? 'Birinchi statistika kutilmoqda' : `${poll.total_voter_count} ta javob`}{poll.is_closed ? ' · Yopilgan' : ''}</span>
                  {poll.options.map((o, n) => <div key={n}><div className={s.spread}><span>{n === poll.correct_option ? '✓ ' : ''}{o.text}</span><span>{o.voter_count} · {poll.total_voter_count ? Math.round(o.voter_count / poll.total_voter_count * 100) : 0}%</span></div><div className={s.bar}><span style={{ width: `${poll.total_voter_count ? Math.min(100, o.voter_count / poll.total_voter_count * 100) : 0}%` }} /></div></div>)}
                  {poll.updated_at && <small className={s.muted}>Yangilangan: {new Date(poll.updated_at).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</small>}
                </article>)}
              </section>
            </>}
          </div>
        </div>
        <div style={{ marginTop: 18 }}><QuizDestinations destinations={overview.destinations} disabled={disabled} save={saveDestination} /></div>
      </>}
    </div>
  </div>
}
