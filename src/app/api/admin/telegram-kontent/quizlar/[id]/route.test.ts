import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, PATCH, POST } from './route'
import { QuizError, emptyQuizQuestion } from '@/lib/telegramQuiz'

const mocked = vi.hoisted(() => ({ auth: vi.fn(), detail: vi.fn(), save: vi.fn(), generate: vi.fn(), deliver: vi.fn() }))
vi.mock('@/lib/telegramQuiz.server', () => ({ requireQuizAdmin: mocked.auth, quizDetail: mocked.detail,
  saveQuiz: mocked.save, generateQuiz: mocked.generate, deliverQuiz: mocked.deliver }))
const id = '3e20b411-b4cc-47a4-bf8c-b09c69f0052e'
const context = { params: Promise.resolve({ id }) }
const request = (method: string, data: unknown) => new Request('http://localhost', { method, body: JSON.stringify(data) })
describe('Quiz admin API', () => {
  beforeEach(() => { vi.resetAllMocks(); mocked.auth.mockResolvedValue({ id: 'admin' }); mocked.detail.mockResolvedValue({ jobs: [], quiz: {} }) })
  it('denies reads, edits, generation and sends without admin authorization', async () => {
    mocked.auth.mockRejectedValue(new QuizError('Faqat admin', 403))
    expect((await GET(new Request('http://localhost'), context)).status).toBe(403)
    expect((await PATCH(request('PATCH', {}), context)).status).toBe(403)
    expect((await POST(request('POST', { action: 'generate' }), context)).status).toBe(403)
    expect((await POST(request('POST', { action: 'send' }), context)).status).toBe(403)
    expect(mocked.detail).not.toHaveBeenCalled(); expect(mocked.save).not.toHaveBeenCalled(); expect(mocked.deliver).not.toHaveBeenCalled()
  })
  it('rejects a bad question before invoking transactional save', async () => {
    const res = await PATCH(request('PATCH', { title: 'Quiz', topic: 'Mavzu', revision: 1, status: 'approved', difficulty: 'easy',
      subject_type: 'normalogiya', audience: 'student', questions: [emptyQuizQuestion()] }), context)
    expect(res.status).toBe(400); expect(mocked.save).not.toHaveBeenCalled()
  })
  it('does not regenerate an in-flight or published quiz', async () => {
    mocked.detail.mockResolvedValue({ jobs: [{ status: 'sending' }] })
    expect((await POST(request('POST', { action: 'generate' }), context)).status).toBe(409)
    expect(mocked.generate).not.toHaveBeenCalled()
  })
  it('requires a destination and explicit integer revision to send', async () => {
    expect((await POST(request('POST', { action: 'send', destination_id: id, revision: '1' }), context)).status).toBe(400)
    expect(mocked.deliver).not.toHaveBeenCalled()
  })
  it('never leaks upstream secrets in unexpected error messages', async () => {
    mocked.detail.mockRejectedValue(new Error('token=secret-from-upstream'))
    const res = await GET(new Request('http://localhost'), context)
    expect(res.status).toBe(502)
    expect(await res.text()).not.toContain('secret-from-upstream')
  })
})
