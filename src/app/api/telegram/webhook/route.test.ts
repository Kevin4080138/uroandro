import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const mocks = vi.hoisted(() => ({ from: vi.fn(), auth: vi.fn(), record: vi.fn() }))
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ from: mocks.from }) }))
vi.mock('@/lib/telegramSend', () => ({ SAYT_URL: 'https://example.org', miniAppTugmalari: vi.fn(), chatIdniProfilgaBogla: vi.fn() }))
vi.mock('@/lib/telegramQuiz.server', () => ({ authenticQuizWebhook: mocks.auth, recordQuizPoll: mocks.record }))
import { POST } from './route'

const update = { update_id: 9, poll: { id: 'quiz-poll', type: 'quiz', is_closed: false, total_voter_count: 1,
  options: ['A', 'B', 'C', 'D'].map((text, i) => ({ text, voter_count: i === 0 ? 1 : 0 })) } }
function request(body: unknown) {
  return new NextRequest('https://example.org/api/telegram/webhook', { method: 'POST', headers: {
    'content-type': 'application/json', 'x-telegram-bot-api-secret-token': 'test-secret',
  }, body: JSON.stringify(body) })
}

describe('Telegram quiz webhook', () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.auth.mockReturnValue(true); mocks.record.mockResolvedValue(undefined) })
  it('rejects unsigned poll updates before writing data', async () => {
    mocks.auth.mockReturnValue(false)
    expect((await POST(request(update))).status).toBe(403)
    expect(mocks.record).not.toHaveBeenCalled()
  })
  it('stores authenticated aggregate counts', async () => {
    expect((await POST(request(update))).status).toBe(200)
    expect(mocks.auth).toHaveBeenCalledWith('test-secret')
    expect(mocks.record).toHaveBeenCalledWith(expect.objectContaining({ poll_id: 'quiz-poll', total_voter_count: 1 }))
  })
  it('requests redelivery on database failure without disclosing details', async () => {
    mocks.record.mockRejectedValue(new Error('private credentials'))
    const response = await POST(request(update))
    expect(response.status).toBe(503)
    expect(await response.text()).not.toContain('private credentials')
  })
  it('ignores non-quiz polls', async () => {
    expect((await POST(request({ ...update, poll: { ...update.poll, type: 'regular' } }))).status).toBe(200)
    expect(mocks.record).not.toHaveBeenCalled()
  })
  it('does not trigger private OTP flows for group messages', async () => {
    expect((await POST(request({ message: { chat: { id: -100123, type: 'supergroup' }, text: '/start' } }))).status).toBe(200)
    expect(mocks.from).not.toHaveBeenCalled()
  })
})
