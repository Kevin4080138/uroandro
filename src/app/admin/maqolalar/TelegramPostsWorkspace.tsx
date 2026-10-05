'use client'

/* eslint-disable @next/next/no-img-element -- Tashqi qidiruv preview URLlari oldindan ma’lum emas; tanlangan rasm Storage’da optimallashtiriladi. */

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { Header } from '@/components/Header'
import { ContentTabs } from './ContentTabs'
import { CONTENT_STATUS_LABELS, type ContentDraft, type TelegramContentOverview, type TelegramDestination, type TelegramImageCandidate } from '@/lib/telegramContent'

const panel: CSSProperties = { padding: 18, border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)' }
const field: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--ink)', font: 'inherit' }
const button: CSSProperties = { padding: '10px 14px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--accent)', color: '#fff', font: 'inherit', fontWeight: 700, cursor: 'pointer' }
const secondary: CSSProperties = { ...button, background: 'var(--surface-2)', color: 'var(--ink)' }
const blankDestination: Omit<TelegramDestination, 'id'> = { name: '', chat_id: '', chat_type: 'channel', use_for: 'posts', is_active: true }

async function api(url: string, method = 'GET', body?: unknown) {
  const response = await fetch(url, { method, cache: 'no-store', ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw Object.assign(new Error(data.error || 'So‘rov bajarilmadi.'), { post: data.post })
  return data
}

export function TelegramPostsWorkspace() {
  const [data, setData] = useState<TelegramContentOverview | null>(null)
  const [selected, setSelected] = useState<ContentDraft | null>(null)
  const [topic, setTopic] = useState('')
  const [newAudience, setNewAudience] = useState<'student' | 'doctor' | 'patient'>('student')
  const [destinationId, setDestinationId] = useState('')
  const [destination, setDestination] = useState(blankDestination)
  const [images, setImages] = useState<TelegramImageCandidate[]>([])
  const [imageQuery, setImageQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = async (selectId?: string) => {
    const result = await api('/api/admin/telegram-kontent') as TelegramContentOverview
    setData(result)
    if (selectId) setSelected(result.posts.find((post) => post.id === selectId) ?? null)
    else if (selected) setSelected(result.posts.find((post) => post.id === selected.id) ?? selected)
    const valid = result.destinations.filter((item) => item.is_active && ['posts', 'both'].includes(item.use_for))
    if (!destinationId && valid[0]) setDestinationId(valid[0].id)
  }
  // Ma’lumot tarmoq javobidan keyin yangilanadi; bu sinxron cascading render emas.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { void load().catch((reason: Error) => setError(reason.message)) }, [])

  const run = async (name: string, task: () => Promise<void>) => {
    setBusy(name); setError(''); setNotice('')
    try { await task() } catch (reason) {
      const failure = reason as Error & { post?: ContentDraft }
      if (failure.post) setSelected(failure.post)
      setError(failure.message)
    } finally { setBusy('') }
  }
  const updateLocal = (post: ContentDraft) => {
    setSelected(post)
    setData((current) => current ? { ...current, posts: current.posts.map((item) => item.id === post.id ? post : item) } : current)
  }

  async function createPost(event: FormEvent) {
    event.preventDefault()
    await run('create', async () => {
      const created = await api('/api/admin/telegram-kontent', 'POST', { kind: 'post', topic, audience: newAudience })
      setTopic(''); await load(created.id); setNotice('Mavzu saqlandi. Endi AI qoralama yaratishi mumkin.')
    })
  }
  async function save(status = selected?.status) {
    if (!selected || status === 'sent' || status === 'scheduled' || status === 'archived') return
    await run('save', async () => {
      const post = await api(`/api/admin/telegram-kontent/${selected.id}`, 'PATCH', { ...selected, status, revision: selected.revision })
      updateLocal(post); setNotice('Post saqlandi.')
    })
  }
  async function action(name: 'generate' | 'search-images' | 'select-image' | 'send', extra: Record<string, unknown> = {}) {
    if (!selected) return
    await run(name, async () => {
      const result = await api(`/api/admin/telegram-kontent/${selected.id}`, 'POST', { action: name, ...extra })
      if (result.post) updateLocal(result.post)
      if (result.imageQuery) setImageQuery(result.imageQuery)
      if (result.images) setImages(result.images)
      if (name === 'generate') setNotice('AI qoralama va ilmiy manbalar tayyorlandi.')
      if (name === 'select-image') { setImages([]); setNotice('Rasm optimallashtirilib saqlandi.') }
      if (name === 'send') setNotice('Post Telegramga yuborildi.')
    })
  }
  async function addDestination(event: FormEvent) {
    event.preventDefault()
    await run('destination', async () => {
      await api('/api/admin/telegram-kontent', 'POST', { resource: 'destination', ...destination })
      setDestination(blankDestination); await load(); setNotice('Telegram manzili saqlandi.')
    })
  }

  const posts = data?.posts ?? []
  const visible = posts.filter((post) => statusFilter === 'all' || post.status === statusFilter)
  const destinations = useMemo(() => (data?.destinations ?? []).filter((item) => item.is_active && ['posts', 'both'].includes(item.use_for)), [data])
  const disabled = Boolean(busy)
  const sent = selected?.status === 'sent'

  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
    <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '18px 14px 56px', fontSize: 14 }}>
      <ContentTabs />
      <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>Telegram postlar</h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 18px' }}>Mavzudan ilmiy manbali post yarating, litsenziyali rasm tanlang, tahrirlang va tasdiqlangandan keyin Telegramga yuboring.</p>
      {error && <p role="alert" style={{ ...panel, color: 'var(--danger)', borderLeft: '4px solid var(--danger)' }}>{error}</p>}
      {notice && <p role="status" style={{ ...panel, color: 'var(--good)', borderLeft: '4px solid var(--good)' }}>{notice}</p>}
      {data && <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16, color: 'var(--muted)' }}>
        <span>{posts.length} ta post</span><span>· {destinations.length} ta faol manzil</span>
        <span>· AI: {data.aiConfigured ? 'sozlangan' : 'sozlanmagan'}</span><span>· Rasm qidiruvi: {data.imageSearchConfigured ? 'sozlangan' : 'sozlanmagan'}</span>
        <span>· Bot: {data.botConfigured ? 'sozlangan' : 'sozlanmagan'}</span>
      </div>}

      <section style={{ ...panel, marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>Yangi post</h2>
        <form className="telegram-post-create" onSubmit={(event) => void createPost(event)} style={{ display: 'grid', gridTemplateColumns: 'minmax(240px,1fr) 160px auto', gap: 10, alignItems: 'end' }}>
          <label>Mavzu<input required maxLength={240} disabled={disabled} style={{ ...field, marginTop: 6 }} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Masalan: Buyrak toshining oldini olish" /></label>
          <label>Auditoriya<select style={{ ...field, marginTop: 6 }} value={newAudience} onChange={(event) => setNewAudience(event.target.value as typeof newAudience)}><option value="student">Talaba</option><option value="doctor">Shifokor</option><option value="patient">Keng omma</option></select></label>
          <button disabled={disabled || !topic.trim()} style={button}>{busy === 'create' ? 'Saqlanmoqda…' : 'Post ochish'}</button>
        </form>
      </section>

      <div className="telegram-post-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 330px) minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
        <section style={panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}><h2 style={{ margin: 0, fontSize: 18 }}>Postlar</h2>
            <select aria-label="Holat filtri" style={{ ...field, width: 145 }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">Hammasi</option>{Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          {!data && <p>Yuklanmoqda…</p>}
          {data && !visible.length && <p style={{ color: 'var(--muted)' }}>Bu holatda post yo‘q.</p>}
          {visible.map((post) => <button type="button" key={post.id} onClick={() => { setSelected(post); setImages([]); setImageQuery('') }}
            style={{ width: '100%', textAlign: 'left', padding: '12px 0', border: 0, borderTop: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)', cursor: 'pointer' }}>
            <strong>{post.title}</strong><div style={{ marginTop: 5, color: post.id === selected?.id ? 'var(--accent)' : 'var(--muted)', fontSize: 12 }}>{CONTENT_STATUS_LABELS[post.status]}</div>
          </button>)}
        </section>

        <div style={{ display: 'grid', gap: 16 }}>
          {!selected && <section style={panel}><p style={{ margin: 0, color: 'var(--muted)' }}>Tahrirlash uchun chap tomondan postni tanlang.</p></section>}
          {selected && <>
            <section style={panel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}><div><h2 style={{ margin: 0, fontSize: 18 }}>Post muharriri</h2><small style={{ color: 'var(--muted)' }}>Versiya {selected.revision ?? 1} · {CONTENT_STATUS_LABELS[selected.status]}</small></div>
                <button disabled={disabled || sent || !data?.aiConfigured} title={!data?.aiConfigured ? 'GEMINI_API_KEY va GEMINI_MODEL kerak' : undefined} style={secondary} onClick={() => void action('generate', { audience: selected.audience ?? newAudience })}>{busy === 'generate' ? 'AI ishlayapti…' : '✨ AI qoralama yaratish'}</button></div>
              <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
                <label>Mavzu<input disabled={disabled || sent} maxLength={240} style={{ ...field, marginTop: 6 }} value={selected.topic} onChange={(event) => setSelected({ ...selected, topic: event.target.value })} /></label>
                <label>Sarlavha<input disabled={disabled || sent} maxLength={240} style={{ ...field, marginTop: 6 }} value={selected.title} onChange={(event) => setSelected({ ...selected, title: event.target.value })} /></label>
                <label>Auditoriya<select disabled={disabled || sent} style={{ ...field, marginTop: 6 }} value={selected.audience ?? 'student'} onChange={(event) => setSelected({ ...selected, audience: event.target.value as ContentDraft['audience'] })}><option value="student">Talaba</option><option value="doctor">Shifokor</option><option value="patient">Keng omma</option></select></label>
                <label>Post matni<textarea disabled={disabled || sent} maxLength={3500} rows={13} style={{ ...field, marginTop: 6, resize: 'vertical' }} value={selected.body ?? ''} onChange={(event) => setSelected({ ...selected, body: event.target.value })} /></label>
                <div style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 12 }}>{selected.body?.length ?? 0} / 3500 belgi</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button disabled={disabled || sent || !selected.body?.trim()} style={button} onClick={() => void save('draft')}>{busy === 'save' ? 'Saqlanmoqda…' : 'Saqlash'}</button>
                  <button disabled={disabled || sent || !selected.body?.trim()} style={secondary} onClick={() => void save('review')}>Tekshirishga tayyor</button>
                  <button disabled={disabled || sent || !selected.body?.trim() || !(selected.sources?.length)} style={{ ...button, background: 'var(--good)' }} onClick={() => void save('approved')}>Tasdiqlash</button>
                </div>
              </div>
            </section>

            <section style={panel}>
              <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>Rasm</h2>
              {selected.image_url && <figure style={{ margin: '0 0 14px' }}><img src={selected.image_url} alt="Post rasmi" style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: 12 }} /><figcaption style={{ marginTop: 6, color: 'var(--muted)', fontSize: 12 }}>{selected.image_credit} · {selected.image_license}</figcaption></figure>}
              <div style={{ display: 'flex', gap: 8 }}><input disabled={disabled || sent} style={field} value={imageQuery} onChange={(event) => setImageQuery(event.target.value)} placeholder="Inglizcha rasm qidiruv iborasi" />
                <button disabled={disabled || sent || !data?.imageSearchConfigured} title={!data?.imageSearchConfigured ? 'PEXELS_API_KEY yoki UNSPLASH_ACCESS_KEY kerak' : undefined} style={secondary} onClick={() => void action('search-images', { query: imageQuery || `${selected.topic} medical healthcare` })}>{busy === 'search-images' ? 'Qidirilmoqda…' : 'Rasm qidirish'}</button></div>
              {images.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10, marginTop: 14 }}>{images.map((image, index) => <button key={`${image.provider}-${index}`} type="button" disabled={disabled} onClick={() => void action('select-image', { candidate: image })} style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 6, background: 'var(--surface-2)', color: 'var(--ink)', cursor: 'pointer', textAlign: 'left' }}>
                <img src={image.preview_url} alt="Rasm varianti" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 7 }} /><small>{image.credit}<br />{image.license}</small>
              </button>)}</div>}
            </section>

            <section style={panel}>
              <h2 style={{ margin: '0 0 10px', fontSize: 18 }}>Manbalar</h2>
              {selected.sources?.length ? <ol style={{ paddingLeft: 20, margin: 0 }}>{selected.sources.map((source) => <li key={source.url} style={{ marginBottom: 8 }}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> <small>({source.provider})</small></li>)}</ol> : <p style={{ color: 'var(--muted)' }}>AI qoralama yaratilganda ilmiy manbalar shu yerda chiqadi.</p>}
            </section>

            <section style={panel}>
              <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>Telegram ko‘rinishi va yuborish</h2>
              <div style={{ maxWidth: 560, borderRadius: 14, padding: 14, background: '#dceaf5', color: '#17212b', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {selected.image_url && <img src={selected.image_url} alt="" style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 9, marginBottom: 10 }} />}
                <strong>{selected.title}</strong>{'\n\n'}{selected.body || 'Post matni hali tayyor emas.'}{selected.image_credit ? `\n\n📷 ${selected.image_credit}` : ''}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'end' }}><label style={{ flex: 1 }}>Manzil<select disabled={disabled || sent} style={{ ...field, marginTop: 6 }} value={destinationId} onChange={(event) => setDestinationId(event.target.value)}><option value="">Manzilni tanlang</option>{destinations.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.chat_id}</option>)}</select></label>
                <button disabled={disabled || sent || selected.status !== 'approved' || !destinationId} style={{ ...button, background: 'var(--good)' }} onClick={() => { if (confirm('Tasdiqlangan post tanlangan Telegram manziliga yuborilsinmi?')) void action('send', { destinationId }) }}>{busy === 'send' ? 'Yuborilmoqda…' : '✈️ Telegramga yuborish'}</button></div>
              {selected.status !== 'approved' && !sent && <p style={{ color: 'var(--muted)', fontSize: 12 }}>Yuborish tugmasi post tasdiqlangandan keyin ochiladi.</p>}
              {sent && <p style={{ color: 'var(--good)' }}>Yuborildi · xabar ID: {selected.telegram_message_ids?.join(', ')}</p>}
              {selected.last_error && <p style={{ color: 'var(--danger)' }}>{selected.last_error}</p>}
            </section>
          </>}
        </div>
      </div>

      <details style={{ ...panel, marginTop: 16 }}><summary style={{ cursor: 'pointer', fontWeight: 800 }}>Telegram manzilini qo‘shish</summary>
        <form onSubmit={(event) => void addDestination(event)} style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          <label>Nomi<input required maxLength={100} style={{ ...field, marginTop: 6 }} value={destination.name} onChange={(event) => setDestination({ ...destination, name: event.target.value })} /></label>
          <label>Chat ID yoki @username<input required maxLength={64} style={{ ...field, marginTop: 6 }} value={destination.chat_id} onChange={(event) => setDestination({ ...destination, chat_id: event.target.value })} placeholder="-1001234567890 yoki @kanal_nomi" /></label>
          <label>Tur<select style={{ ...field, marginTop: 6 }} value={destination.chat_type} onChange={(event) => setDestination({ ...destination, chat_type: event.target.value as TelegramDestination['chat_type'] })}><option value="channel">Kanal</option><option value="group">Guruh</option></select></label>
          <button disabled={disabled} style={{ ...button, justifySelf: 'start' }}>{busy === 'destination' ? 'Saqlanmoqda…' : 'Manzilni saqlash'}</button>
        </form>
      </details>
    </main>
  </div>
}
