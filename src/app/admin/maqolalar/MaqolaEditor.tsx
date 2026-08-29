'use client'

import { useState } from 'react'
import type { NewsRow } from '@/lib/newsTypes'

export type ActionName = 'approve' | 'banner' | 'telegram' | 'publish' | 'reject' | 'resend' | 'unpublish'

const CONTENT_TYPES = ['news', 'research_summary', 'guideline_update', 'educational_article', 'clinical_review', 'event']
const input: React.CSSProperties = { width: '100%', border: '1px solid var(--line)', borderRadius: '9px', padding: '9px 11px', background: 'var(--surface-2)', color: 'var(--ink)', font: 'inherit', fontSize: '14px' }
const btn: React.CSSProperties = { border: '1px solid var(--line)', borderRadius: '9px', padding: '9px 12px', background: 'var(--surface-2)', color: 'var(--ink)', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }

export function blankManual(): NewsRow {
  return {
    id: '', slug: '', source_name: 'Urosfera', source_url: '', source_date: null,
    original_title: '', title_uz: '', summary_uz: '', content_uz: '',
    category: 'urologiya', importance: 'normal',
    student_importance: '', doctor_importance: '', patient_importance: '',
    telegram_post_uz: '', status: 'draft', content_origin: 'manual',
    image_url: null, image_source_url: null, image_credit: null,
    telegram_message_id: null, telegram_status: 'pending', telegram_error: null,
    published_at: null, created_at: '', updated_at: '',
    source_key: null, external_id: null, canonical_url: null,
    content_type: 'educational_article', specialty: null,
    audience: ['student', 'doctor', 'patient'], importance_score: 0, importance_reasons: [],
    telegram_auto_eligible: false, telegram_selected_at: null, telegram_sent_at: null,
    banner_approval_status: 'not_created', source_published_at: null, source_metadata: {},
    trust_tier: 1, verification_status: 'kutilmoqda', auto_published: false, tags: [], reading_level: null,
  }
}

export function MaqolaEditor({ editing, setEditing, busy, umumiyBanner, setUmumiyBanner, onSave, onAction, onClose }: {
  editing: NewsRow
  setEditing: (row: NewsRow) => void
  busy: string | null
  umumiyBanner: boolean
  setUmumiyBanner: (v: boolean) => void
  onSave: () => void
  onAction: (name: ActionName) => void
  onClose: () => void
}) {
  const [imgError, setImgError] = useState(false)
  const isNew = !editing.id
  const isManual = editing.content_origin === 'manual'
  const busyHere = busy === editing.id || busy === 'new'
  const label = (title: string) => <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.3px' }}>{title}</span>
  const field = (key: keyof NewsRow, title: string, rows = 2) => (
    <label style={{ display: 'grid', gap: '4px' }}>{label(title)}
      <textarea rows={rows} value={String(editing[key] ?? '')} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} style={{ ...input, resize: 'vertical' }} />
    </label>
  )
  const line = (key: keyof NewsRow, title: string) => (
    <label style={{ display: 'grid', gap: '4px' }}>{label(title)}
      <input value={String(editing[key] ?? '')} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} style={input} />
    </label>
  )

  const showImage = editing.image_url && !imgError

  return (
    <section style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '16px', display: 'grid', gap: '11px', marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '16px' }}>{isNew ? '➕ Yangi qo‘lda maqola' : 'Tahrirlash'}</h2>
        <button onClick={onClose} style={{ ...btn, padding: '5px 10px' }}>✕</button>
      </div>
      {!isNew && editing.source_url && !isManual && (
        <a href={editing.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: '12px', overflowWrap: 'anywhere' }}>
          {editing.source_name}: {editing.original_title} ↗
        </a>
      )}
      {!isNew && !isManual && (() => {
        const meta = editing.source_metadata as { gemini_confidence?: number; auto_decision?: { publish?: boolean; reasons?: string[] } } | null
        const dec = meta?.auto_decision
        if (!dec && meta?.gemini_confidence == null) return null
        return <div style={{ fontSize: '12px', padding: '9px 11px', borderRadius: '9px', background: dec?.publish ? 'color-mix(in srgb, var(--good) 12%, transparent)' : 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)' }}>
          <b>Ishonch:</b> {meta?.gemini_confidence ?? '—'} · <b>Manba darajasi:</b> {editing.trust_tier}
          {dec && <div style={{ marginTop: '3px', color: 'var(--muted)' }}>{dec.publish ? '✔ Avto-nashr shartlariga mos' : `Draftda qoldi: ${(dec.reasons ?? []).join(', ')}`}</div>}
        </div>
      })()}

      {/* Banner preview */}
      <div style={{ minHeight: '150px', borderRadius: '12px', padding: '18px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: showImage ? `linear-gradient(to top,rgba(0,0,0,.82),transparent),url(${editing.image_url}) center/cover` : 'linear-gradient(135deg,#0891b2,#2563eb)' }}>
        <b style={{ fontSize: '17px', lineHeight: 1.25 }}>{editing.title_uz || editing.original_title || 'Sarlavha'}</b>
        {editing.summary_uz && <span style={{ fontSize: '13px', marginTop: '4px', opacity: .95 }}>{editing.summary_uz}</span>}
      </div>
      {editing.image_url && <img src={editing.image_url} alt="" onError={() => setImgError(true)} style={{ display: 'none' }} />}

      {isManual && (
        <div style={{ display: 'grid', gap: '11px', padding: '12px', background: 'var(--surface-2)', borderRadius: '11px', border: '1px dashed var(--line)' }}>
          {line('source_name', 'Manba nomi')}
          {line('source_url', 'Manba/original URL (ixtiyoriy)')}
          {line('image_url', 'Rasm URL (Supabase Storage, ixtiyoriy)')}
        </div>
      )}

      {field('title_uz', "O'zbekcha sarlavha")}
      {field('summary_uz', 'Qisqa mazmun', 3)}
      {field('content_uz', 'Maqola matni', 8)}
      {field('telegram_post_uz', 'Telegram uchun matn', 6)}
      {field('student_importance', 'Talaba uchun: nima uchun muhim?')}
      {field('doctor_importance', 'Shifokor uchun: nima uchun muhim?')}
      {field('patient_importance', 'Bemor uchun: nima uchun muhim?')}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <label style={{ display: 'grid', gap: '4px' }}>{label('Yo‘nalish')}
          <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as NewsRow['category'] })} style={input}>
            <option value="urologiya">Urologiya</option><option value="andrologiya">Andrologiya</option><option value="ginekologiya">Ginekologiya</option>
          </select>
        </label>
        <label style={{ display: 'grid', gap: '4px' }}>{label('Muhimlik')}
          <select value={editing.importance} onChange={(e) => setEditing({ ...editing, importance: e.target.value as NewsRow['importance'] })} style={input}>
            <option value="normal">Oddiy</option><option value="high">Muhim</option><option value="critical">Juda muhim</option>
          </select>
        </label>
      </div>
      <label style={{ display: 'grid', gap: '4px' }}>{label('Kontent turi')}
        <select value={editing.content_type} onChange={(e) => setEditing({ ...editing, content_type: e.target.value as NewsRow['content_type'] })} style={input}>
          {CONTENT_TYPES.map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>{(['student', 'doctor', 'patient'] as const).map((role) => (
        <label key={role} style={{ fontSize: '13px' }}>
          <input type="checkbox" checked={editing.audience?.includes(role)} onChange={(e) => setEditing({ ...editing, audience: e.target.checked ? [...(editing.audience ?? []), role] : (editing.audience ?? []).filter((item) => item !== role) })} /> {role}
        </label>
      ))}</div>
      <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px' }}>
        <input type="checkbox" checked={umumiyBanner} onChange={(e) => setUmumiyBanner(e.target.checked)} /> Uch rol o‘rniga bitta “hamma” banner
      </label>

      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginTop: '4px' }}>
        <button onClick={onSave} disabled={busyHere} style={{ ...btn, background: 'var(--accent)', color: 'white', border: 0, cursor: busyHere ? 'wait' : 'pointer' }}>💾 {isNew ? 'Yaratish' : 'Saqlash'}</button>
        {!isNew && editing.status === 'draft' && <button onClick={() => onAction('approve')} style={btn}>✅ Tasdiqlash</button>}
        {!isNew && ['approved', 'published'].includes(editing.status) && <button onClick={() => onAction('banner')} style={btn}>🖼 Banner</button>}
        {!isNew && ['approved', 'published'].includes(editing.status) && <button onClick={() => onAction(editing.telegram_status === 'sent' ? 'resend' : 'telegram')} style={btn}>✈️ Telegram</button>}
        {!isNew && ['approved', 'published'].includes(editing.status) && <button onClick={() => onAction('publish')} style={btn}>🚀 Banner + Telegram</button>}
        {!isNew && editing.status === 'published' && <button onClick={() => onAction('unpublish')} style={btn}>↩️ Nashrdan qaytarish</button>}
        {!isNew && editing.status !== 'rejected' && <button onClick={() => onAction('reject')} style={btn}>⛔ Rad etish</button>}
      </div>
    </section>
  )
}
