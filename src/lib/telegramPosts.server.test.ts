import { afterEach, beforeEach, expect, it, vi } from 'vitest'
vi.mock('server-only', () => ({}))
vi.mock('@/lib/supabaseAdmin', () => ({ createAdminClient: vi.fn() }))
import { searchTelegramPostImages } from './telegramPosts.server'

beforeEach(() => {
  vi.stubEnv('PIXABAY_API_KEY', 'private-key')
  vi.stubEnv('PEXELS_API_KEY', '')
  vi.stubEnv('UNSPLASH_ACCESS_KEY', '')
  vi.stubEnv('PINTEREST_RAPIDAPI_KEY', 'private-key')
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

it('identifies invalid Pixabay credentials without exposing the response body', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Invalid API key: private-key', { status: 400 })))
  await expect(searchTelegramPostImages('kidney')).rejects.toThrow('Pixabay HTTP 400. API kaliti noto‘g‘ri.')
  await expect(searchTelegramPostImages('kidney')).rejects.not.toThrow('private-key')
})
it('reports rate limits by provider', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 429 })))
  await expect(searchTelegramPostImages('kidney')).rejects.toThrow('Pixabay HTTP 429')
})
it('does not leak credentials from network errors', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('https://pixabay.com/api/?key=private-key')))
  await expect(searchTelegramPostImages('kidney')).rejects.toThrow('Pixabay: ulanish')
  await expect(searchTelegramPostImages('kidney')).rejects.not.toThrow('private-key')
})
it('keeps a successful empty search distinct from a service failure', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"hits":[]}')))
  await expect(searchTelegramPostImages('kidney')).resolves.toEqual([])
})
it('does not hide Pexels authentication failures as empty results', async () => {
  vi.stubEnv('PIXABAY_API_KEY', '')
  vi.stubEnv('PEXELS_API_KEY', 'private-key')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 403 })))
  await expect(searchTelegramPostImages('kidney')).rejects.toThrow('Pexels HTTP 403')
})
it('reports Pinterest 500 without claiming the key was accepted', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })))
  await expect(searchTelegramPostImages('kidney', 'pinterest')).rejects.toThrow('Pinterest HTTP 500')
  await expect(searchTelegramPostImages('kidney', 'pinterest')).rejects.not.toThrow('Kalit qabul qilindi')
})
