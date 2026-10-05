import { beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ authorized: vi.fn(), run: vi.fn(), health: vi.fn() }))
vi.mock('@/lib/telegramSchedule.server', () => ({ schedulerAuthorized: mocks.authorized, runTelegramScheduler: mocks.run, telegramSchedulerHealth: mocks.health }))
import { GET } from './route'
beforeEach(() => vi.resetAllMocks())
it('does not run the worker for an unauthorized request', async () => {
  mocks.authorized.mockReturnValue(false)
  expect((await GET(new Request('https://example.org'))).status).toBe(401)
  expect(mocks.run).not.toHaveBeenCalled()
})
it('runs the worker after checking the bearer header', async () => {
  mocks.authorized.mockReturnValue(true); mocks.run.mockResolvedValue({ processed: 0 })
  const r = await GET(new Request('https://example.org', { headers: { authorization: 'Bearer test' } }))
  expect(mocks.authorized).toHaveBeenCalledWith('Bearer test')
  expect(await r.json()).toEqual({ processed: 0 })
})
it('health check cannot claim jobs or send Telegram messages', async () => {
  mocks.authorized.mockReturnValue(true); mocks.health.mockResolvedValue({ ready: true, pending_count: 3 })
  const r = await GET(new Request('https://example.org?check=1', { headers: { authorization: 'Bearer test' } }))
  expect(await r.json()).toEqual({ ready: true, pending_count: 3 })
  expect(mocks.run).not.toHaveBeenCalled()
})
