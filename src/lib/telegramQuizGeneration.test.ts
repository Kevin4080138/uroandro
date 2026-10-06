import { beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ gemini: vi.fn(), sources: vi.fn(), history: vi.fn() }))
vi.mock('server-only', () => ({}))
vi.mock('./supabaseServer', () => ({ createServerSupabase: vi.fn() }))
vi.mock('./supabaseAdmin', () => ({ createAdminClient: () => ({ from: () => ({ select: () => ({ order: () => ({ limit: mocks.history }) }) }) }) }))
vi.mock('./telegramPosts.server', () => ({ geminiJson: mocks.gemini, medicalSources: mocks.sources }))
import { generateQuiz } from './telegramQuiz.server'
const input = { title: 'Nefron', topic: 'Nefron anatomiyasi', difficulty: 'easy', subject_type: 'normalogiya', audience: 'student', count: 2 }
const q = (question: string) => ({ question, case_text: '', options: ['Birinchi', 'Ikkinchi', 'Uchinchi', 'To‘rtinchi'], correct_option: 1, explanation: 'Manbada shu tuzilma ko‘rsatilgan.', source_indices: [0] })
beforeEach(() => {
  vi.resetAllMocks()
  mocks.history.mockResolvedValue({ data: [], error: null })
  mocks.sources.mockResolvedValue({ results: [{ title: 'Anatomy', abstractText: 'Evidence', pmid: '123' }] })
})
it('removes previous questions and fills only missing questions on retry', async () => {
  mocks.history.mockResolvedValue({ data: [{ question: 'Eski savol?' }], error: null })
  mocks.gemini.mockResolvedValueOnce({ questions: [q('Eski savol?'), q('Yangi savol?')] }).mockResolvedValueOnce({ questions: [q('Boshqa savol?')] })
  const result = await generateQuiz({ ...input, instructions: 'Turli funksiyalarni solishtiring' })
  expect(result.map(q => q.question)).toEqual(['Yangi savol?', 'Boshqa savol?'])
  expect(mocks.sources).toHaveBeenCalledWith(input.topic, true)
  const prompt = JSON.parse(mocks.gemini.mock.calls[1][1])
  expect(prompt.count).toBe(1)
  expect(prompt.previous_questions).toContain('Yangi savol?')
  expect(prompt.admin_instructions).toContain('Turli funksiyalar')
})
it('uses supplied textbook text and attaches its citation', async () => {
  mocks.gemini.mockResolvedValue({ questions: [q('Birinchi savol?'), q('Ikkinchi savol?')] })
  const result = await generateQuiz({ ...input, source_text: 'Nefron haqida bob matni.', source_title: 'Darslik, 2-bob', source_url: 'https://example.org/book' })
  expect(mocks.sources).not.toHaveBeenCalled()
  expect(result[0].sources[0].title).toBe('Darslik, 2-bob')
  expect(mocks.gemini.mock.calls[0][1]).toContain('Nefron haqida bob matni.')
})
it('stops after two attempts if sources cannot support enough valid questions', async () => {
  mocks.gemini.mockResolvedValue({ questions: [q('Takror savol?')] })
  await expect(generateQuiz(input)).rejects.toThrow('1/2')
  expect(mocks.gemini).toHaveBeenCalledTimes(2)
})
it('rejects unsupported citations and clinical cases for normal anatomy', async () => {
  mocks.gemini.mockResolvedValue({ questions: [{ ...q('Savol?'), source_indices: [20] }, { ...q('Bemor?'), case_text: 'Bemor keldi.' }] })
  await expect(generateQuiz(input)).rejects.toThrow('0/2')
})
