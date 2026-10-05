'use client'

import { useEffect, useState, type CSSProperties, type FormEvent } from 'react'
import { Header } from '@/components/Header'
import { ContentTabs } from './ContentTabs'
import { CONTENT_STATUS_LABELS, type ContentKind, type TelegramContentOverview, type TelegramDestination } from '@/lib/telegramContent'

const panel: CSSProperties = { padding: 18, border: '1px solid var(--line)', borderRadius: 14, background: 'var(--surface)' }
const field: CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--ink)', font: 'inherit' }
const button: CSSProperties = { padding: '10px 14px', borderRadius: 9, border: '1px solid var(--line)', background: 'var(--accent)', color: '#fff', font: 'inherit', fontWeight: 700, cursor: 'pointer' }
const blankDestination: Omit<TelegramDestination, 'id'> = { name: '', chat_id: '', chat_type: 'channel', use_for: 'both', is_active: true }

async function api(method: string, body?: unknown) {
  const response = await fetch('/api/admin/telegram-kontent', { method, cache: 'no-store',
    ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'So‘rov bajarilmadi.')
  return data
}

export function TelegramContentWorkspace({ kind }: { kind: ContentKind }) {
  const [data, setData] = useState<TelegramContentOverview | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [reload, setReload] = useState(0)
  const [topic, setTopic] = useState('')
  const [destination, setDestination] = useState(blankDestination)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    let ignore = false
    api('GET').then((result: TelegramContentOverview) => { if (!ignore) { setData(result); setError('') } })
      .catch((reason: Error) => { if (!ignore) setError(reason.message) })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [reload])

  async function save(event: FormEvent, resource: 'draft' | 'destination') {
    event.preventDefault()
    setBusy(true); setError(''); setNotice('')
    try {
      await api(resource === 'destination' && editingId ? 'PATCH' : 'POST', resource === 'draft'
        ? { kind, topic } : { resource, ...destination, ...(editingId ? { id: editingId } : {}) })
      if (resource === 'draft') setTopic('')
      else { setDestination(blankDestination); setEditingId(null) }
      setNotice(resource === 'draft' ? 'Mavzu qoralama sifatida saqlandi.' : 'Telegram manzili saqlandi.')
      setReload((value) => value + 1)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Saqlashda xatolik.') }
    finally { setBusy(false) }
  }

  const drafts = data ? kind === 'post' ? data.posts : data.quizzes : []
  const visible = drafts.filter((draft) => statusFilter === 'all' || draft.status === statusFilter)
  const destinations = data?.destinations ?? []
  const activeCount = destinations.filter((item) => item.is_active && (item.use_for === 'both' || item.use_for === (kind === 'post' ? 'posts' : 'quizzes'))).length
  const disabled = busy || loading || !data

  return <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
    <Header backHref="/admin/dashboard" backLabel="Admin paneli" />
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '18px 14px 56px', fontSize: 14 }}>
      <ContentTabs />
      <h1 style={{ margin: '0 0 8px', fontSize: 24 }}>{kind === 'post' ? 'Telegram postlar' : 'Quizlar'}</h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 20px' }}>
        {kind === 'post' ? 'Rasmli postlar uchun mavzularni tayyorlang va Telegram manzillarini sozlang.' : 'Test to‘plamlari uchun mavzularni tayyorlang va guruh yoki kanalni sozlang.'}
      </p>
      <div style={{ ...panel, marginBottom: 16, borderLeft: '4px solid var(--accent)' }}>
        <strong>Birinchi bosqich: mavzular va sozlamalar</strong>
        <p style={{ margin: '6px 0 0', color: 'var(--muted)', lineHeight: 1.6 }}>
          {kind === 'post' ? 'AI matni, rasm qidiruvi va post muharriri keyingi bosqichda qo‘shiladi.' : 'Savol va variantlar muharriri, AI yordamida test yaratish keyingi bosqichda qo‘shiladi.'}
          {' '}Bu bosqichda mavzular saqlanadi; Telegramga yuborish hali ulanmagan.
        </p>
      </div>
      {error && <div role="alert" style={{ ...panel, marginBottom: 16, color: 'var(--danger)' }}>{error}
        <button type="button" disabled={busy || loading} onClick={() => { setLoading(true); setReload((value) => value + 1) }} style={{ ...button, marginLeft: 12 }}>Qayta yuklash</button>
      </div>}
      {notice && <p role="status">{notice}</p>}
      {loading && <p role="status">Yuklanmoqda…</p>}
      {data && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, color: 'var(--muted)' }}>
        <span>{drafts.length} ta so‘nggi mavzu</span><span>· {activeCount} ta faol manzil</span>
        <span>· Bot kaliti: {data.botConfigured ? 'sozlangan' : 'sozlanmagan'}</span><span>· Vaqt: Toshkent</span>
      </div>}

      <section style={{ ...panel, marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>Yangi mavzu</h2>
        <form onSubmit={(event) => void save(event, 'draft')} style={{ display: 'grid', gap: 12 }}>
          <label>Mavzu<input style={{ ...field, marginTop: 6 }} required maxLength={240} disabled={disabled} value={topic}
            onChange={(event) => setTopic(event.target.value)} placeholder={kind === 'post' ? 'Masalan: Buyrak toshlari haqida foydali ma’lumot' : 'Masalan: Siydik tizimi anatomiyasi'} /></label>
          <button style={{ ...button, justifySelf: 'start' }} disabled={disabled || !topic.trim()}>{busy ? 'Saqlanmoqda…' : 'Mavzuni saqlash'}</button>
        </form>
      </section>

      <section style={{ ...panel, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Saqlangan mavzular</h2>
          <label>Holati <select style={{ ...field, width: 'auto' }} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Hammasi</option>{Object.entries(CONTENT_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
        </div>
        {data && !visible.length && <p style={{ color: 'var(--muted)' }}>{drafts.length ? 'Bu holatda mavzu yo‘q.' : 'Hali mavzu yo‘q. Yuqorida birinchi mavzuni kiriting.'}</p>}
        {visible.map((draft) => <article key={draft.id} style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid var(--line)' }}>
          <strong style={{ overflowWrap: 'anywhere' }}>{draft.title}</strong>
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>{CONTENT_STATUS_LABELS[draft.status]} · {new Date(draft.created_at).toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</div>
        </article>)}
        {drafts.length === 50 && <p style={{ color: 'var(--muted)' }}>So‘nggi 50 ta mavzu ko‘rsatilmoqda.</p>}
      </section>

      <section style={panel}>
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Telegram kanal va guruhlari</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Bu sozlamalar ikkala bo‘lim uchun umumiy. Saqlash manzil va bot ruxsatlarini Telegramda tekshirmaydi.</p>
        {destinations.map((item) => <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: '1px solid var(--line)' }}>
          <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}><strong>{item.name}</strong><div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
            {item.chat_id} · {item.chat_type === 'channel' ? 'Kanal' : 'Guruh'} · {item.use_for === 'both' ? 'Post va quiz' : item.use_for === 'posts' ? 'Postlar' : 'Quizlar'} · {item.is_active ? 'Faol' : 'Nofaol'}
          </div></div>
          <button type="button" disabled={disabled} style={{ ...button, background: 'var(--surface-2)', color: 'var(--ink)' }} onClick={() => { setEditingId(item.id); setDestination({ name: item.name, chat_id: item.chat_id, chat_type: item.chat_type, use_for: item.use_for, is_active: item.is_active }) }}>Tahrirlash</button>
        </div>)}
        {data && !destinations.length && <p style={{ color: 'var(--muted)' }}>Hali manzil qo‘shilmagan.</p>}
        <form onSubmit={(event) => void save(event, 'destination')} style={{ display: 'grid', gap: 12, marginTop: 20 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>{editingId ? 'Manzilni tahrirlash' : 'Manzil qo‘shish'}</h3>
          <label>Nomi<input required maxLength={100} disabled={disabled} style={{ ...field, marginTop: 6 }} value={destination.name} onChange={(event) => setDestination({ ...destination, name: event.target.value })} placeholder="Urosfera kanali" /></label>
          <label>Chat ID yoki @username<input required maxLength={64} disabled={disabled} style={{ ...field, marginTop: 6 }} value={destination.chat_id} onChange={(event) => setDestination({ ...destination, chat_id: event.target.value })} placeholder="-1001234567890 yoki @kanal_nomi" /></label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <label>Manzil turi<select disabled={disabled} style={{ ...field, marginTop: 6 }} value={destination.chat_type} onChange={(event) => setDestination({ ...destination, chat_type: event.target.value as TelegramDestination['chat_type'] })}><option value="channel">Kanal</option><option value="group">Guruh</option></select></label>
            <label>Qaysi kontent uchun?<select disabled={disabled} style={{ ...field, marginTop: 6 }} value={destination.use_for} onChange={(event) => setDestination({ ...destination, use_for: event.target.value as TelegramDestination['use_for'] })}><option value="both">Post va quiz</option><option value="posts">Faqat postlar</option><option value="quizzes">Faqat quizlar</option></select></label>
          </div>
          <label><input type="checkbox" disabled={disabled} checked={destination.is_active} onChange={(event) => setDestination({ ...destination, is_active: event.target.checked })} /> Manzil faol</label>
          <div style={{ display: 'flex', gap: 10 }}><button style={button} disabled={disabled}>{busy ? 'Saqlanmoqda…' : 'Manzilni saqlash'}</button>
            {editingId && <button type="button" disabled={busy} style={{ ...button, background: 'var(--surface-2)', color: 'var(--ink)' }} onClick={() => { setEditingId(null); setDestination(blankDestination) }}>Bekor qilish</button>}</div>
        </form>
      </section>
    </div>
  </div>
}
