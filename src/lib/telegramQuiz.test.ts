import { describe, expect, it } from 'vitest'
import { balanceQuizAnswers, parsePollUpdate, quizSaveInput, quizSendParts, type QuizQuestion } from './telegramQuiz'

const question: QuizQuestion = { question: 'Savol?', case_text: '', options: ['Birinchi', 'Ikkinchi', 'Uchinchi', 'To‘rtinchi'],
  correct_option: 2, explanation: 'Manbadagi faktga mos keladi.', image_url: null, image_credit: null,
  image_license: null, image_source_url: null, sources: [] }
const document = { title: 'Quiz', topic: 'Anatomiya', revision: 1, status: 'approved', difficulty: 'easy', subject_type: 'normalogiya', audience: 'student', questions: [question] }
const editQuestion = (patch: Partial<QuizQuestion>) => ({ ...document, questions: [{ ...question, ...patch }] })

describe('Quiz tayyorlash chegaralari', () => {
  it('supports manually authored questions without an AI or mandatory web source', () => {
    expect(quizSaveInput(document).questions[0].correct_option).toBe(2)
  })
  it('allows an empty draft but cannot approve an empty bank', () => {
    expect(quizSaveInput({ ...document, status: 'draft', questions: [] }).questions).toEqual([])
    expect(() => quizSaveInput({ ...document, questions: [] })).toThrow('kamida bitta')
  })
  it.each([['question', 'x'.repeat(301)], ['explanation', 'x'.repeat(201)], ['explanation', 'a\nb\nc\nd']])('rejects oversized Telegram %s', (key, value) => {
    expect(() => quizSaveInput(editQuestion({ [key]: value }))).toThrow()
  })
  it.each([-1, 4, 1.5, NaN])('requires an actual single answer index: %s', (correct_option) => {
    expect(() => quizSaveInput(editQuestion({ correct_option }))).toThrow('to‘g‘ri javob')
  })
  it('rejects duplicate choices and missing explanations', () => {
    expect(() => quizSaveInput(editQuestion({ options: ['Birinchi', 'birinchi ', 'Uchinchi', 'To‘rtinchi'] }))).toThrow('takrorlanmasin')
    expect(() => quizSaveInput(editQuestion({ explanation: ' ' }))).toThrow('izohi')
  })
  it('blocks clinical cases in normalology, easy and intermediate levels', () => {
    for (const difficulty of ['easy', 'orta', 'qiyin']) expect(() => quizSaveInput({ ...editQuestion({ case_text: 'Klinik holat' }), difficulty })).toThrow('QIYIN klinik')
    for (const difficulty of ['easy', 'orta']) expect(() => quizSaveInput({ ...editQuestion({ case_text: 'Klinik holat' }), difficulty, subject_type: 'clinical' })).toThrow('QIYIN klinik')
    expect(quizSaveInput({ ...editQuestion({ case_text: 'Klinik holat' }), difficulty: 'qiyin', subject_type: 'clinical' }).questions[0].case_text).toBe('Klinik holat')
  })
  it('rejects duplicate questions and unsafe source links', () => {
    expect(() => quizSaveInput({ ...document, questions: [question, question] })).toThrow('savol takrorlanmasin')
    expect(() => quizSaveInput(editQuestion({ sources: [{ title: 'Manba', url: 'javascript:alert(1)', provider: 'Qo‘lda' }] }))).toThrow('HTTPS')
  })
  it('preserves the correct answer text while distributing indices', () => {
    const questions = Array.from({ length: 5 }, (_, i) => ({ ...question, question: `${i}?` }))
    const balanced = balanceQuizAnswers(questions)
    expect(balanced.map((q) => q.correct_option)).toEqual([0, 1, 2, 3, 0])
    expect(balanced.every((q) => q.options[q.correct_option] === 'Uchinchi')).toBe(true)
    expect(question.options[0]).toBe('Birinchi')
  })
})
describe('Telegram xabarlari va natijalar', () => {
  it('sends quiz mode with one correct answer and keeps explanation out of public context', () => {
    const parts = quizSendParts({ questions: [{ ...question, case_text: 'Vaziyat' }] }, '-100123')
    expect(parts.map((p) => p.method)).toEqual(['sendMessage', 'sendPoll'])
    expect(parts[0].body.text).toBe('Vaziyat')
    expect(parts[1].body).toMatchObject({ type: 'quiz', is_anonymous: true, correct_option_ids: [2], explanation: question.explanation })
    expect(parts[1].body.options).toEqual(question.options.map((text) => ({ text })))
  })
  it('splits oversized photo captions without truncating the case or attribution', () => {
    const q = { ...question, image_url: 'https://example.org/image.webp', case_text: 'x'.repeat(1500), image_credit: 'Muallif', image_license: 'CC BY' }
    const parts = quizSendParts({ questions: [q] }, '-100123')
    expect(parts.map((p) => p.method)).toEqual(['sendPhoto', 'sendMessage', 'sendPoll'])
    expect(parts[0].body.caption).toBeUndefined()
    expect(parts[1].body.text).toBe(`${q.case_text}\n\nRasm: Muallif · CC BY`)
  })
  it('reads aggregate votes without retaining voter personal data', () => {
    const snapshot = parsePollUpdate({ update_id: 4, user: { name: 'Private' }, poll: { id: 'poll', type: 'quiz', is_closed: false,
      total_voter_count: 3, options: question.options.map((text, i) => ({ text, voter_count: i === 2 ? 3 : 0 })) } })
    expect(snapshot.total_voter_count).toBe(3)
    expect(snapshot.options[2].voter_count).toBe(3)
    expect(snapshot).not.toHaveProperty('user')
  })
})
