export const CONTENT_STATUS_LABELS = {
  draft: 'Qoralama', review: 'Tekshirishga tayyor', approved: 'Tasdiqlangan',
  scheduled: 'Rejalashtirilgan', sent: 'Yuborilgan', failed: 'Xatoli', archived: 'Arxiv',
} as const
export type ContentStatus = keyof typeof CONTENT_STATUS_LABELS
export type ContentKind = 'post' | 'quiz'
export type TelegramDestination = {
  id: string; name: string; chat_id: string; chat_type: 'channel' | 'group'
  use_for: 'posts' | 'quizzes' | 'both'; is_active: boolean
}
export type TelegramSource = { title: string; url: string; provider: string }
export type TelegramImageCandidate = {
  provider: 'pexels' | 'unsplash'; image_url: string; preview_url: string
  source_url: string; credit: string; license: string; tracking_url?: string
}
export type ContentDraft = {
  id: string; title: string; topic: string; status: ContentStatus; created_at: string
  body?: string; audience?: 'student' | 'doctor' | 'patient'; image_url?: string | null
  image_source_url?: string | null; image_credit?: string | null; image_license?: string | null
  sources?: TelegramSource[]; revision?: number; telegram_message_ids?: string[]
  sent_at?: string | null; last_error?: string | null
}
export type TelegramContentOverview = {
  destinations: TelegramDestination[]; posts: ContentDraft[]; quizzes: ContentDraft[]
  botConfigured: boolean; aiConfigured: boolean; imageSearchConfigured: boolean
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Ma’lumot formati noto‘g‘ri.')
  return value as Record<string, unknown>
}
function requiredText(value: unknown, label: string, max: number) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new Error(`${label}: 1–${max} belgi kiriting.`)
  }
  return value.trim()
}
export function destinationInput(value: unknown): Omit<TelegramDestination, 'id'> {
  const input = object(value)
  const name = requiredText(input.name, 'Nomi', 100)
  const chatId = requiredText(input.chat_id, 'Chat ID yoki @username', 64)
  if (!/^-[1-9]\d{0,15}$/.test(chatId) && !/^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(chatId)) {
    throw new Error('Kanal/guruhning manfiy raqamli ID sini yoki @username kiriting. Havola qabul qilinmaydi.')
  }
  if (input.chat_type !== 'channel' && input.chat_type !== 'group') throw new Error('Manzil turini tanlang.')
  if (input.use_for !== 'posts' && input.use_for !== 'quizzes' && input.use_for !== 'both') throw new Error('Manzil vazifasini tanlang.')
  if (typeof input.is_active !== 'boolean') throw new Error('Faollik holati noto‘g‘ri.')
  return { name, chat_id: chatId.toLowerCase(), chat_type: input.chat_type, use_for: input.use_for, is_active: input.is_active }
}
export function draftInput(value: unknown): { kind: ContentKind; title: string; topic: string; audience: 'student' | 'doctor' | 'patient' } {
  const input = object(value)
  if (input.kind !== 'post' && input.kind !== 'quiz') throw new Error('Kontent turi noto‘g‘ri.')
  const topic = requiredText(input.topic, 'Mavzu', 240)
  const audience = ['student', 'doctor', 'patient'].includes(String(input.audience)) ? input.audience as 'student' | 'doctor' | 'patient' : 'student'
  return { kind: input.kind, title: topic, topic, audience }
}
export function destinationId(value: unknown) {
  const id = object(value).id
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error('Manzil identifikatori noto‘g‘ri.')
  }
  return id
}

export function uuid(value: unknown, label = 'Identifikator') {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new Error(`${label} noto‘g‘ri.`)
  }
  return value
}

export function postUpdateInput(value: unknown) {
  const input = object(value)
  const title = requiredText(input.title, 'Sarlavha', 240)
  const topic = requiredText(input.topic, 'Mavzu', 240)
  const body = requiredText(input.body, 'Post matni', 3500)
  if (!['student', 'doctor', 'patient'].includes(String(input.audience))) throw new Error('Auditoriyani tanlang.')
  if (!['draft', 'review', 'approved'].includes(String(input.status))) throw new Error('Post holati noto‘g‘ri.')
  const revision = Number(input.revision)
  if (!Number.isInteger(revision) || revision < 1) throw new Error('Post versiyasi noto‘g‘ri.')
  return { title, topic, body, audience: input.audience as 'student' | 'doctor' | 'patient',
    status: input.status as 'draft' | 'review' | 'approved', revision }
}
