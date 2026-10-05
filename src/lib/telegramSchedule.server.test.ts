import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn(), quiz: vi.fn(), post: vi.fn() }))
vi.mock('server-only', () => ({}))
vi.mock('./supabaseAdmin', () => ({ createAdminClient: () => ({ rpc: mocks.rpc, from: mocks.from }) }))
vi.mock('./telegramQuiz.server', () => ({ deliverQuiz: mocks.quiz }))
vi.mock('./telegramPosts.server', () => ({ sendTelegramPost: mocks.post }))
import { runTelegramScheduler, schedulerAuthorized } from './telegramSchedule.server'

const schedule = { id: 'schedule', quiz_id: 'quiz', destination_id: 'destination', destination_chat_id: '-100123', revision: 2 }
beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token')
  vi.stubEnv('CRON_SECRET', 'test-secret')
  mocks.rpc.mockResolvedValue({ data: null, error: null })
  mocks.from.mockReturnValue({ select: () => ({ eq: () => ({ single: async () => ({ data: { chat_id: '-100123', is_active: true }, error: null }) }) }) })
})
describe('Scheduler authorization and delivery', () => {
  it('fails closed when the secret is missing', () => {
    vi.stubEnv('CRON_SECRET', '')
    expect(schedulerAuthorized('Bearer undefined')).toBe(false)
    expect(schedulerAuthorized(null)).toBe(false)
  })
  it('accepts only the configured bearer secret', () => {
    expect(schedulerAuthorized('Bearer test-secret')).toBe(true)
    expect(schedulerAuthorized('Bearer wrong-secret')).toBe(false)
  })
  it('does not send when another worker owns the lease or nothing is due', async () => {
    expect(await runTelegramScheduler()).toEqual({ processed: 0 })
    expect(mocks.quiz).not.toHaveBeenCalled()
    expect(mocks.post).not.toHaveBeenCalled()
  })
  it('delivers the claimed quiz version and records completion', async () => {
    mocks.rpc.mockResolvedValueOnce({ data: schedule, error: null })
    mocks.quiz.mockResolvedValue({ jobs: [{ destination_id: 'destination', status: 'sent' }] })
    expect(await runTelegramScheduler()).toMatchObject({ status: 'sent' })
    expect(mocks.quiz).toHaveBeenCalledWith('quiz', 'destination', 2)
    expect(mocks.rpc).toHaveBeenLastCalledWith('finish_telegram_schedule', { p_id: 'schedule', p_status: 'sent', p_error: null })
  })
  it('marks unexpected send failures uncertain without retrying', async () => {
    mocks.rpc.mockResolvedValueOnce({ data: schedule, error: null })
    mocks.quiz.mockRejectedValue(new Error('private upstream secret'))
    expect(await runTelegramScheduler()).toMatchObject({ status: 'uncertain' })
    expect(mocks.quiz).toHaveBeenCalledTimes(1)
    expect(JSON.stringify(mocks.rpc.mock.calls)).not.toContain('private upstream secret')
  })
  it('does not send to a changed destination', async () => {
    mocks.rpc.mockResolvedValueOnce({ data: { ...schedule, destination_chat_id: '-100999' }, error: null })
    expect(await runTelegramScheduler()).toMatchObject({ status: 'failed' })
    expect(mocks.quiz).not.toHaveBeenCalled()
  })
})
