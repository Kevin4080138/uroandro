import { beforeEach, describe, expect, it, vi } from 'vitest'
import { QuizError } from '@/lib/telegramQuiz'
const mocks = vi.hoisted(() => ({ admin: vi.fn(), rpc: vi.fn() }))
vi.mock('@/lib/telegramQuiz.server', () => ({ requireQuizAdmin: mocks.admin }))
vi.mock('@/lib/supabaseAdmin', () => ({ createAdminClient: () => ({ rpc: mocks.rpc }) }))
vi.mock('@/lib/telegramSchedule.server', () => ({ scheduleDbError: (e: unknown) => { if (e) throw new Error('DB') } }))
import { GET, POST, PATCH } from './route'
const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const request = (body: unknown) => new Request('https://example.org', { method: 'POST', body: JSON.stringify(body) })
beforeEach(() => { vi.resetAllMocks(); mocks.admin.mockResolvedValue({ id }); mocks.rpc.mockResolvedValue({ data: id, error: null }) })
describe('Schedule API authorization and validation', () => {
  it('protects reading, creating and changing schedules', async () => {
    mocks.admin.mockRejectedValue(new QuizError('Forbidden', 403))
    expect((await GET()).status).toBe(403)
    expect((await POST(request({}))).status).toBe(403)
    expect((await PATCH(request({}))).status).toBe(403)
    expect(mocks.rpc).not.toHaveBeenCalled()
  })
  it('rejects invalid content before writing', async () => {
    expect((await POST(request({ kind: 'other' }))).status).toBe(400)
    expect(mocks.rpc).not.toHaveBeenCalled()
  })
  it('cancels through the atomic pending-only RPC', async () => {
    expect((await PATCH(request({ id, action: 'cancel' }))).status).toBe(200)
    expect(mocks.rpc).toHaveBeenCalledWith('change_telegram_schedule', { p_id: id, p_at: null })
  })
  it('rejects past rescheduling dates', async () => {
    expect((await PATCH(request({ id, action: 'reschedule', time: '2000-01-01T12:00' }))).status).toBe(400)
    expect(mocks.rpc).not.toHaveBeenCalled()
  })
})
