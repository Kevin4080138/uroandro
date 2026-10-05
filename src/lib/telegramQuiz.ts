import type { ContentStatus, TelegramSource } from './telegramContent'

export const QUIZ_LIMIT = 5
export type QuizQuestion = {
  id?: string; question: string; case_text: string; options: string[]; correct_option: number
  explanation: string; image_url: string | null; image_credit: string | null
  image_license: string | null; image_source_url: string | null; sources: TelegramSource[]
}
export type QuizDraft = {
  id: string; title: string; topic: string; difficulty: 'easy' | 'orta' | 'qiyin'
  subject_type: 'normalogiya' | 'clinical'; audience: 'student' | 'doctor' | 'patient'
  status: ContentStatus; revision: number; questions: QuizQuestion[]
}
export type QuizDelivery = {
  id: string; destination_id: string; status: string; last_error: string | null; created_at: string
  parts: { part_key: string; status: string; telegram_message_id: string | null; telegram_poll_id: string | null }[]
}
export type QuizPollResult = {
  poll_id: string; job_id: string; question: string; correct_option: number
  options: { text: string; voter_count: number }[]; total_voter_count: number | null
  is_closed: boolean; updated_at: string | null
}
export type QuizDetail = { quiz: QuizDraft; jobs: QuizDelivery[]; polls: QuizPollResult[] }

export class QuizError extends Error {
  constructor(message: string, public status = 400) { super(message); this.name = 'QuizError' }
}
export function quizObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new QuizError('Ma’lumot formati noto‘g‘ri.')
  return value as Record<string, unknown>
}
function text(value: unknown, label: string, max: number, optional = false) {
  if (optional && (value === null || value === undefined)) return ''
  if (typeof value !== 'string' || (!optional && !value.trim()) || value.trim().length > max) {
    throw new QuizError(`${label}: ${optional ? '0' : '1'}–${max} belgi kiriting.`)
  }
  return value.trim()
}
export function quizRevision(value: unknown) {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) throw new QuizError('Quiz versiyasi noto‘g‘ri.')
  return value
}
function choice<T extends string>(value: unknown, values: readonly T[], label: string): T {
  if (!values.includes(value as T)) throw new QuizError(`${label} noto‘g‘ri.`)
  return value as T
}
export function quizSettings(value: unknown) {
  const input = quizObject(value)
  return {
    title: text(input.title, 'Sarlavha', 240), topic: text(input.topic, 'Mavzu', 240),
    difficulty: choice(input.difficulty, ['easy', 'orta', 'qiyin'] as const, 'Daraja'),
    subject_type: choice(input.subject_type, ['normalogiya', 'clinical'] as const, 'Mavzu turi'),
    audience: choice(input.audience, ['student', 'doctor', 'patient'] as const, 'Auditoriya'),
  }
}
export function quizSource(value: unknown): TelegramSource {
  const input = quizObject(value)
  const url = text(input.url, 'Manba havolasi', 1000)
  try { const parsed = new URL(url); if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw new Error() }
  catch { throw new QuizError('Manba uchun HTTPS havola kiriting.') }
  return { title: text(input.title, 'Manba nomi', 400), url, provider: text(input.provider, 'Manba turi', 100) }
}
export function parseQuizQuestion(value: unknown, settings: ReturnType<typeof quizSettings>): QuizQuestion {
  const input = quizObject(value)
  const question = text(input.question, 'Savol', 300)
  const case_text = text(input.case_text, 'Vaziyatli masala', 2800, true)
  if (case_text && (settings.difficulty !== 'qiyin' || settings.subject_type === 'normalogiya')) {
    throw new QuizError('Vaziyatli masala faqat QIYIN klinik mavzuda mumkin.')
  }
  if (!Array.isArray(input.options) || input.options.length < 4 || input.options.length > 5) throw new QuizError('4 yoki 5 ta variant kiriting.')
  const options = input.options.map((value, index) => text(value, `${index + 1}-variant`, 100))
  if (new Set(options.map(normalize)).size !== options.length) throw new QuizError('Javob variantlari takrorlanmasin.')
  const correct_option = input.correct_option
  if (typeof correct_option !== 'number' || !Number.isInteger(correct_option) || correct_option < 0 || correct_option >= options.length) {
    throw new QuizError('Bitta to‘g‘ri javobni tanlang.')
  }
  const explanation = text(input.explanation, 'Javob izohi', 200)
  if ((explanation.match(/\n/g) ?? []).length > 2) throw new QuizError('Izohda ko‘pi bilan 2 ta yangi qator mumkin.')
  const image_url = text(input.image_url, 'Rasm manzili', 1000, true) || null
  const image_credit = text(input.image_credit, 'Rasm muallifi', 200, true) || null
  const image_license = text(input.image_license, 'Rasm litsenziyasi', 200, true) || null
  if (image_url && (!image_credit || !image_license)) throw new QuizError('Rasm muallifi va litsenziyasini kiriting.')
  if (!Array.isArray(input.sources) || input.sources.length > 5) throw new QuizError('Ko‘pi bilan 5 ta manba kiriting.')
  return { question, case_text, options, correct_option, explanation, image_url, image_credit, image_license,
    image_source_url: null, sources: input.sources.map(quizSource) }
}
function normalize(value: string) { return value.toLocaleLowerCase().replace(/[’‘ʻ`]/g, "'").replace(/\s+/g, ' ').trim() }
export function quizSaveInput(value: unknown) {
  const input = quizObject(value), settings = quizSettings(input)
  const status = choice(input.status, ['draft', 'review', 'approved'] as const, 'Holat')
  if (!Array.isArray(input.questions) || input.questions.length > QUIZ_LIMIT) throw new QuizError(`Ko‘pi bilan ${QUIZ_LIMIT} ta savol kiriting.`)
  const questions = input.questions.map((item) => parseQuizQuestion(item, settings))
  if (status !== 'draft' && !questions.length) throw new QuizError('Avval kamida bitta savol tayyorlang.')
  if (new Set(questions.map((q) => normalize(`${q.case_text} ${q.question}`))).size !== questions.length) throw new QuizError('Bir xil savol takrorlanmasin.')
  return { ...settings, status, questions, revision: quizRevision(input.revision) }
}

/** To‘g‘ri javob matni va indeksi birga ko‘chadi. Har variant soni uchun alohida balans. */
export function balanceQuizAnswers(questions: QuizQuestion[]): QuizQuestion[] {
  const count = new Map<number, number>()
  return questions.map((q) => {
    const seen = count.get(q.options.length) ?? 0, target = seen % q.options.length
    count.set(q.options.length, seen + 1)
    const options = [...q.options]
    ;[options[target], options[q.correct_option]] = [options[q.correct_option], options[target]]
    return { ...q, options, correct_option: target }
  })
}
export function quizWarnings(questions: QuizQuestion[]): string[] {
  const issues: string[] = []
  questions.forEach((q, i) => {
    const lengths = q.options.map((item) => item.length).filter(Boolean)
    if (lengths.length && Math.max(...lengths) > Math.min(...lengths) * 2.5) issues.push(`${i + 1}-savol variantlari uzunligi keskin farq qiladi.`)
    if (!q.sources.length) issues.push(`${i + 1}-savolga manba qo‘shilmagan. Faktlarni tekshiring.`)
  })
  if (questions.length >= 4 && new Set(questions.map((q) => q.correct_option)).size === 1) issues.push('Barcha to‘g‘ri javoblar bir xil harfda. Variantlarni muvozanatlang.')
  return issues
}
export function emptyQuizQuestion(): QuizQuestion {
  return { question: '', case_text: '', options: ['', '', '', ''], correct_option: 0, explanation: '', image_url: null,
    image_credit: null, image_license: null, image_source_url: null, sources: [] }
}
export type QuizSendPart = { key: string; method: 'sendPhoto' | 'sendMessage' | 'sendPoll'; body: Record<string, unknown>; questionIndex: number }
export function quizSendParts(quiz: Pick<QuizDraft, 'questions'>, chatId: string): QuizSendPart[] {
  return quiz.questions.flatMap((q, i) => {
    const parts: QuizSendPart[] = []
    const add = (key: string, method: QuizSendPart['method'], body: Record<string, unknown>) => parts.push({ key: `${i}:${key}`, method, body: { chat_id: chatId, ...body }, questionIndex: i })
    const context = [q.case_text, q.image_credit && `Rasm: ${q.image_credit} · ${q.image_license}`].filter(Boolean).join('\n\n')
    if (q.image_url) {
      add('photo', 'sendPhoto', { photo: q.image_url, ...(context.length <= 1024 ? { caption: context } : {}) })
      if (context.length > 1024) add('case', 'sendMessage', { text: context })
    } else if (context) add('case', 'sendMessage', { text: context })
    add('poll', 'sendPoll', { question: q.question, options: q.options.map((text) => ({ text })), type: 'quiz',
      is_anonymous: true, allows_multiple_answers: false, correct_option_ids: [q.correct_option], explanation: q.explanation })
    return parts
  })
}
export type PollSnapshot = { poll_id: string; update_id: number; options: { text: string; voter_count: number }[]; total_voter_count: number; is_closed: boolean }
export function parsePollUpdate(value: unknown): PollSnapshot {
  const input = quizObject(value), poll = quizObject(input.poll)
  const count = (v: unknown) => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0
  if (!count(input.update_id) || !count(poll.total_voter_count) || typeof poll.is_closed !== 'boolean' || poll.type !== 'quiz') throw new QuizError('Poll natijasi noto‘g‘ri.')
  if (!Array.isArray(poll.options) || poll.options.length < 4 || poll.options.length > 5) throw new QuizError('Poll variantlari noto‘g‘ri.')
  const options = poll.options.map((v) => {
    const option = quizObject(v)
    if (!count(option.voter_count)) throw new QuizError('Ovoz soni noto‘g‘ri.')
    return { text: text(option.text, 'Variant', 100), voter_count: option.voter_count as number }
  })
  return { poll_id: text(poll.id, 'Poll ID', 200), update_id: input.update_id as number, options,
    total_voter_count: poll.total_voter_count as number, is_closed: poll.is_closed }
}
