'use client'

import { useState } from 'react'
import type { TelegramDestination } from '@/lib/telegramContent'
import s from './quizlar.module.css'

const blank: Omit<TelegramDestination, 'id'> = { name: '', chat_id: '', chat_type: 'group', use_for: 'both', is_active: true }
const scopeLabel: Record<TelegramDestination['use_for'], string> = { both: 'Post va quiz', quizzes: 'Faqat quiz', posts: 'Faqat post' }
export function QuizDestinations({ destinations, disabled, save }: { destinations: TelegramDestination[]; disabled: boolean; save: (value: Omit<TelegramDestination, 'id'>, id: string | null) => Promise<boolean> }) {
  const [value, setValue] = useState(blank), [id, setId] = useState<string | null>(null)
  return <details className={s.panel}><summary>Telegram kanal va guruhlarini sozlash</summary>
    <p className={s.muted}>Bot guruhda xabar va so‘rovnoma yubora olishi kerak; kanalda nashr qilish huquqi bo‘lishi kerak.</p>
    {destinations.map((d) => <div className={s.spread} key={d.id} style={{ padding: '8px 0' }}><span>{d.name} · {d.chat_id} · {scopeLabel[d.use_for]} · {d.is_active ? 'Faol' : 'Nofaol'}</span><button className={s.secondary} disabled={disabled} onClick={() => { setId(d.id); setValue(d) }}>Tahrirlash</button></div>)}
    <form className={s.stack} style={{ marginTop: 14 }} onSubmit={(e) => { e.preventDefault(); void save(value, id).then((ok) => { if (ok) { setId(null); setValue(blank) } }) }}>
      <h3>{id ? 'Manzilni tahrirlash' : 'Yangi manzil'}</h3>
      <div className={s.fields}>
        <label className={s.label}>Nomi<input className={s.input} required maxLength={100} disabled={disabled} value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} /></label>
        <label className={s.label}>Chat ID yoki @username<input className={s.input} required maxLength={64} disabled={disabled} value={value.chat_id} onChange={(e) => setValue({ ...value, chat_id: e.target.value })} placeholder="-1001234567890 yoki @guruh" /></label>
        <label className={s.label}>Tur<select className={s.input} disabled={disabled} value={value.chat_type} onChange={(e) => setValue({ ...value, chat_type: e.target.value as TelegramDestination['chat_type'] })}><option value="group">Guruh</option><option value="channel">Kanal</option></select></label>
        <label className={s.label}>Kontent<select className={s.input} disabled={disabled} value={value.use_for} onChange={(e) => setValue({ ...value, use_for: e.target.value as TelegramDestination['use_for'] })}><option value="both">Post va quiz</option><option value="quizzes">Faqat quiz</option><option value="posts">Faqat post</option></select></label>
      </div>
      <label><input type="checkbox" disabled={disabled} checked={value.is_active} onChange={(e) => setValue({ ...value, is_active: e.target.checked })} /> Faol</label>
      <div className={s.row}><button className={s.button} disabled={disabled}>Saqlash</button>{id && <button type="button" className={s.secondary} disabled={disabled} onClick={() => { setId(null); setValue(blank) }}>Bekor qilish</button>}</div>
    </form>
  </details>
}
