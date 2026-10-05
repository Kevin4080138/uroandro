import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, POST, PATCH } from './route'

const mocks = vi.hoisted(() => ({ create: vi.fn() }))
vi.mock('@/lib/supabaseServer', () => ({ createServerSupabase: mocks.create }))

function client(role: string | null = 'admin', loggedIn = true) {
  const result = { data: { id: 'saved-id' }, error: null }
  const table = { insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue(result), maybeSingle: vi.fn().mockResolvedValue(result) }
  const profile = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), single: vi.fn().mockResolvedValue({ data: { role }, error: null }) }
  const from = vi.fn((name: string) => name === 'profiles' ? profile : table)
  mocks.create.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user: loggedIn ? { id: 'admin-id' } : null } }) }, from })
  return { from, table }
}
const request = (body: unknown, method = 'POST') => new Request('http://localhost/api/admin/telegram-kontent', { method, body: JSON.stringify(body) })
const destination = { resource: 'destination', name: 'Kanal', chat_id: '@Urosfera', chat_type: 'channel', use_for: 'both', is_active: true }

describe('Telegram kontent admin chegarasi', () => {
  beforeEach(() => vi.clearAllMocks())
  it.each(['student', 'doctor', null])('blocks role %s for reads and writes', async (role) => {
    const { from } = client(role)
    expect((await GET()).status).toBe(403)
    expect((await POST(request(destination))).status).toBe(403)
    expect((await PATCH(request(destination, 'PATCH'))).status).toBe(403)
    expect(from.mock.calls.every(([name]) => name === 'profiles')).toBe(true)
  })
  it('blocks anonymous requests before querying tables', async () => {
    const { from } = client(null, false)
    expect((await GET()).status).toBe(403)
    expect(from).not.toHaveBeenCalled()
  })
  it('rejects malformed JSON and destinations without writing', async () => {
    const { table } = client()
    expect((await POST(new Request('http://localhost', { method: 'POST', body: '{' }))).status).toBe(400)
    for (const chat_id of ['https://t.me/urosfera', '12345', '-0', '@a', '<script>']) {
      expect((await POST(request({ ...destination, chat_id }))).status).toBe(400)
    }
    expect(table.insert).not.toHaveBeenCalled()
  })
  it('normalizes usernames and ignores client supplied privileged fields', async () => {
    const { table } = client()
    expect((await POST(request({ ...destination, token: 'never-store', created_by: 'someone-else' }))).status).toBe(201)
    expect(table.insert).toHaveBeenCalledWith({ name: 'Kanal', chat_id: '@urosfera', chat_type: 'channel', use_for: 'both', is_active: true })
  })
  it('creates only a draft owned by the authenticated admin', async () => {
    const { table, from } = client()
    expect((await POST(request({ kind: 'quiz', topic: ' Anatomiyadan savollar ', status: 'sent', created_by: 'someone-else' }))).status).toBe(201)
    expect(from).toHaveBeenCalledWith('telegram_quizzes')
    expect(table.insert).toHaveBeenCalledWith({ title: 'Anatomiyadan savollar', topic: 'Anatomiyadan savollar', audience: 'student', created_by: 'admin-id' })
  })
  it('rejects blank topics and unknown content kinds', async () => {
    const { table } = client()
    expect((await POST(request({ kind: 'post', topic: ' ' }))).status).toBe(400)
    expect((await POST(request({ kind: 'other', topic: 'test' }))).status).toBe(400)
    expect(table.insert).not.toHaveBeenCalled()
  })
  it('updates an existing destination and reports a missing one', async () => {
    const { table } = client()
    const body = { ...destination, id: '3e20b411-b4cc-47a4-bf8c-b09c69f0052e', is_active: false }
    expect((await PATCH(request(body, 'PATCH'))).status).toBe(200)
    expect(table.eq).toHaveBeenCalledWith('id', body.id)
    expect(table.update).toHaveBeenCalledWith(expect.objectContaining({ is_active: false }))
    table.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
    expect((await PATCH(request(body, 'PATCH'))).status).toBe(404)
  })
  it('reports duplicate destinations and unapplied migrations clearly', async () => {
    const { table } = client()
    table.single.mockResolvedValueOnce({ data: null, error: { code: '23505' } })
    expect((await POST(request(destination))).status).toBe(409)
    table.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST205' } })
    expect((await POST(request(destination))).status).toBe(503)
  })
})
