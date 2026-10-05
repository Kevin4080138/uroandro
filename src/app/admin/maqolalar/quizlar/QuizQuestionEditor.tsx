'use client'

/* eslint-disable @next/next/no-img-element -- Yuklangan rasmlar serverda WebP qilib optimallashtiriladi. */
import { useRef, useState } from 'react'
import type { QuizQuestion } from '@/lib/telegramQuiz'
import s from './quizlar.module.css'

type Props = {
  question: QuizQuestion; index: number; total: number; disabled: boolean; allowCase: boolean
  onChange: (question: QuizQuestion) => void; onRemove: () => void; onMove: (direction: number) => void
  onUpload: (file: File, credit: string, license: string) => Promise<void>
}
export function QuizQuestionEditor({ question: q, index, total, disabled, allowCase, onChange, onRemove, onMove, onUpload }: Props) {
  const [rights, setRights] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const field = (patch: Partial<QuizQuestion>) => onChange({ ...q, ...patch })
  return <article className={s.question}>
    <div className={s.spread}><h3>{index + 1}-savol</h3><div className={s.row}>
      <button type="button" className={s.secondary} disabled={disabled || index === 0} onClick={() => onMove(-1)} aria-label="Savolni yuqoriga ko‘chirish">↑</button>
      <button type="button" className={s.secondary} disabled={disabled || index === total - 1} onClick={() => onMove(1)} aria-label="Savolni pastga ko‘chirish">↓</button>
      <button type="button" className={s.danger} disabled={disabled} onClick={onRemove}>Olib tashlash</button>
    </div></div>
    <label className={s.label}>Savol ({q.question.length}/300)<textarea className={s.input} rows={3} maxLength={300} disabled={disabled} value={q.question} onChange={(e) => field({ question: e.target.value })} /></label>
    {(allowCase || q.case_text) && <label className={s.label}>Vaziyatli masala — ixtiyoriy<textarea className={s.input} rows={4} maxLength={2800} disabled={disabled || !allowCase} value={q.case_text} onChange={(e) => field({ case_text: e.target.value })} />
      {!allowCase && <button type="button" className={s.secondary} disabled={disabled} onClick={() => field({ case_text: '' })}>Ushbu darajaga moslash uchun vaziyatni olib tashlash</button>}</label>}
    <div className={s.muted}>To‘g‘ri javob yonidagi doirani belgilang. Har variant 100 belgigacha.</div>
    {q.options.map((option, n) => <label className={s.option} key={n}>
      <input type="radio" name={`correct-${index}`} checked={q.correct_option === n} disabled={disabled} onChange={() => field({ correct_option: n })} aria-label={`${String.fromCharCode(65 + n)} to‘g‘ri javob`} />
      <span>{String.fromCharCode(65 + n)}</span><input className={s.input} aria-label={`${index + 1}-savol ${String.fromCharCode(65 + n)} varianti`} maxLength={100} disabled={disabled} value={option} onChange={(e) => field({ options: q.options.map((v, j) => j === n ? e.target.value : v) })} />
    </label>)}
    <button type="button" className={s.secondary} disabled={disabled} onClick={() => field(q.options.length === 4 ? { options: [...q.options, ''] } : { options: q.options.slice(0, 4), correct_option: Math.min(q.correct_option, 3) })}>
      {q.options.length === 4 ? '5-variant qo‘shish' : '5-variantni olib tashlash'}</button>
    <label className={s.label}>Javob izohi — majburiy ({q.explanation.length}/200)<textarea className={s.input} rows={3} maxLength={200} disabled={disabled} value={q.explanation} onChange={(e) => field({ explanation: e.target.value })} /></label>
    <details><summary>Manbalar ({q.sources.length})</summary><div className={s.stack} style={{ marginTop: 12 }}>
      {q.sources.map((source, n) => <div className={s.stack} key={n}>
        <label className={s.label}>Manba nomi<input className={s.input} disabled={disabled} maxLength={400} value={source.title} onChange={(e) => field({ sources: q.sources.map((v, j) => j === n ? { ...v, title: e.target.value } : v) })} /></label>
        <label className={s.label}>HTTPS havola<input className={s.input} disabled={disabled} type="url" maxLength={1000} value={source.url} onChange={(e) => field({ sources: q.sources.map((v, j) => j === n ? { ...v, url: e.target.value } : v) })} /></label>
        {source.url.startsWith('https://') && <a href={source.url} target="_blank" rel="noreferrer">Manbani ochish ↗</a>}
        <button type="button" className={s.secondary} disabled={disabled} onClick={() => field({ sources: q.sources.filter((_, j) => j !== n) })}>Manbani olib tashlash</button>
      </div>)}
      <button type="button" className={s.secondary} disabled={disabled || q.sources.length >= 5} onClick={() => field({ sources: [...q.sources, { title: '', url: '', provider: 'Qo‘lda' }] })}>Manba qo‘shish</button>
    </div></details>
    <details><summary>Rasm {q.image_url ? '— yuklangan' : 'qo‘shish'}</summary><div className={s.stack} style={{ marginTop: 12 }}>
      {q.image_url && <><img className={s.image} src={q.image_url} alt={`${index + 1}-savol rasmi`} /><button className={s.secondary} type="button" disabled={disabled} onClick={() => field({ image_url: null, image_credit: null, image_license: null })}>Rasmni olib tashlash</button></>}
      <label className={s.label}>Muallif<input className={s.input} disabled={disabled} maxLength={200} value={q.image_credit ?? ''} onChange={(e) => field({ image_credit: e.target.value })} /></label>
      <label className={s.label}>Litsenziya yoki ruxsat<input className={s.input} disabled={disabled} maxLength={200} placeholder="Masalan: o‘z klinikam surati, nashrga rozilik bor" value={q.image_license ?? ''} onChange={(e) => field({ image_license: e.target.value })} /></label>
      <label><input type="checkbox" disabled={disabled} checked={rights} onChange={(e) => setRights(e.target.checked)} /> Rasmni nashr qilish huquqi bor, bemorning shaxsiy ma’lumotlari olib tashlangan.</label>
      <label className={s.label}>Rasm yuklash — JPG, PNG yoki WebP, 4 MB gacha<input ref={input} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled || !rights || !q.image_credit?.trim() || !q.image_license?.trim()} onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) void onUpload(file, q.image_credit!, q.image_license!).finally(() => { if (input.current) input.current.value = '' })
      }} /></label>
    </div></details>
  </article>
}
