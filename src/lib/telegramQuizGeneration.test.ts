import { beforeEach, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ gemini: vi.fn(), history: vi.fn(), available: vi.fn(), lessons: vi.fn() }))
vi.mock('server-only', () => ({}))
vi.mock('./supabaseServer', () => ({ createServerSupabase: vi.fn() }))
vi.mock('./supabaseAdmin', () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === 'telegram_quiz_questions') return { select: () => ({ order: () => ({ limit: mocks.history }) }) }
      if (table === 'dars_tarkibi') return { select: (columns: string) => columns === 'dars_slug'
        ? { not: mocks.available }
        : { in: mocks.lessons } }
      throw new Error(`Unexpected table: ${table}`)
    },
  }),
}))
vi.mock('./telegramPosts.server', () => ({ geminiJson: mocks.gemini }))

import { generateQuiz } from './telegramQuiz.server'

const input = { title: 'Nefron', topic: 'Buyrak va nefron anatomiyasi', difficulty: 'easy', subject_type: 'normalogiya', audience: 'student', count: 2 }
const q = (question: string) => ({
  question, case_text: '', options: ['Po‘stloq qavat', 'Mag‘iz qavat', 'Buyrak jomi', 'Fibroz kapsula'],
  correct_option: 1, explanation: 'Nefronning ushbu qismi mag‘iz qavatda davom etadi.', source_indices: [0],
  evidence_quote: 'Buyrakning mag‘iz qavatida nefron kanalchalari va yig‘uvchi naychalar joylashadi',
})
const verdicts = (length: number) => ({ verdicts: Array.from({ length }, (_, index) => ({ index, supported: true, human_urology: true, correct_option: 1 })) })

beforeEach(() => {
  vi.resetAllMocks()
  mocks.history.mockResolvedValue({ data: [], error: null })
  mocks.available.mockResolvedValue({ data: [{ dars_slug: 'buyrak-siydik-yollari-anatomiyasi' }], error: null })
  mocks.lessons.mockResolvedValue({ data: [{ dars_slug: 'buyrak-siydik-yollari-anatomiyasi', nazariya_html: `<p>${q('x').evidence_quote}. Ushbu inson urologiyasi darsi Campbell-Walsh-Wein asosida tayyorlangan.</p>`.repeat(8) }], error: null })
})

it('uses only the selected Campbell-Walsh based platform lesson and verifies every answer', async () => {
  mocks.gemini
    .mockResolvedValueOnce({ slugs: ['buyrak-siydik-yollari-anatomiyasi'] })
    .mockResolvedValueOnce({ questions: [q('Henle ilmog‘i qaysi qavatda davom etadi?'), q('Yig‘uvchi naychalar qayerda joylashadi?')] })
    .mockResolvedValueOnce(verdicts(2))
  const result = await generateQuiz(input)
  expect(result).toHaveLength(2)
  expect(result[0].sources[0].provider).toContain('Campbell-Walsh-Wein')
  expect(result[0].sources[0].title).toContain('Buyrak')
  expect(mocks.gemini.mock.calls[0][1]).toContain('buyrak-siydik-yollari-anatomiyasi')
  expect(mocks.gemini.mock.calls[2][0]).toContain('fakt tekshiruvchisiz')
})

it('removes previous questions and fills only missing questions on retry', async () => {
  mocks.history.mockResolvedValue({ data: [{ question: 'Eski savol?' }], error: null })
  mocks.gemini
    .mockResolvedValueOnce({ slugs: ['buyrak-siydik-yollari-anatomiyasi'] })
    .mockResolvedValueOnce({ questions: [q('Eski savol?'), q('Yangi savol?')] })
    .mockResolvedValueOnce(verdicts(1))
    .mockResolvedValueOnce({ questions: [q('Boshqa savol?')] })
    .mockResolvedValueOnce(verdicts(1))
  const result = await generateQuiz({ ...input, instructions: 'Turli funksiyalarni solishtiring' })
  expect(result.map(item => item.question)).toEqual(['Yangi savol?', 'Boshqa savol?'])
  const retryPrompt = JSON.parse(mocks.gemini.mock.calls[3][1])
  expect(retryPrompt.count).toBe(1)
  expect(retryPrompt.previous_questions).toContain('Yangi savol?')
  expect(retryPrompt.admin_instructions).toContain('Turli funksiyalar')
})

it('uses supplied textbook text without selecting a platform lesson', async () => {
  const sourceText = `${q('x').evidence_quote}. `.repeat(8)
  mocks.gemini.mockResolvedValueOnce({ questions: [q('Birinchi savol?'), q('Ikkinchi savol?')] }).mockResolvedValueOnce(verdicts(2))
  const result = await generateQuiz({ ...input, source_text: sourceText, source_title: 'Campbell-Walsh-Wein, 2-bob', source_url: 'https://example.org/book' })
  expect(mocks.available).not.toHaveBeenCalled()
  expect(result[0].sources[0].title).toBe('Campbell-Walsh-Wein, 2-bob')
})

it('rejects animal content, unsupported quotes and wrong proposed answers', async () => {
  mocks.gemini
    .mockResolvedValueOnce({ slugs: ['buyrak-siydik-yollari-anatomiyasi'] })
    .mockResolvedValueOnce({ questions: [q('It buyragi qayerda?'), { ...q('Noto‘g‘ri?'), evidence_quote: 'Manbada umuman mavjud bo‘lmagan boshqa jumla' }, q('Javobi xato savol?')] })
    .mockResolvedValueOnce({ verdicts: [{ index: 0, supported: true, human_urology: true, correct_option: 0 }] })
    .mockResolvedValueOnce({ questions: [] })
  await expect(generateQuiz(input)).rejects.toThrow('0/2')
})

it('does not create a quiz when no matching urology textbook lesson exists', async () => {
  mocks.gemini.mockResolvedValueOnce({ slugs: [] })
  await expect(generateQuiz(input)).rejects.toThrow('mos Campbell-Walsh')
  expect(mocks.lessons).not.toHaveBeenCalled()
})
