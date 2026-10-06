import { afterEach, beforeEach, expect, it, vi } from 'vitest'
vi.mock('server-only', () => ({}))
vi.mock('@/lib/supabaseAdmin', () => ({ createAdminClient: vi.fn() }))
import { searchTelegramPinterest, searchTelegramPostImages, telegramImageQuery } from './telegramPosts.server'

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

it('calls Scrappa Search Pins with the documented host and parameters', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ pins: [{ id: '123', image_url: 'https://i.pinimg.com/originals/a.jpg', is_video: false }] })))
  vi.stubGlobal('fetch', fetch)
  const results = await searchTelegramPostImages('kidney anatomy', 'pinterest')
  const [url, options] = fetch.mock.calls[0]
  const parsed = new URL(url)
  expect(parsed.origin + parsed.pathname).toBe('https://pinterest-scraper6.p.rapidapi.com/api/pinterest/search')
  expect(parsed.searchParams.get('query')).toBe('kidney anatomy')
  expect(parsed.searchParams.get('limit')).toBe('30')
  expect(parsed.searchParams.has('filter')).toBe(false)
  expect(options.headers['x-rapidapi-host']).toBe(parsed.hostname)
  expect(results[0].source_url).toBe('https://www.pinterest.com/pin/123/')
})

it('passes a validated bookmark to Scrappa pagination', async () => {
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ pins: [], nextBookmark: null })))
  vi.stubGlobal('fetch', fetch)
  await searchTelegramPinterest('kidney anatomy', 'NEXT_123=')
  const parsed = new URL(fetch.mock.calls[0][0])
  expect(parsed.searchParams.get('bookmark')).toBe('NEXT_123=')
})
it('rejects malformed bookmarks before calling Scrappa', async () => {
  const fetch = vi.fn()
  vi.stubGlobal('fetch', fetch)
  await expect(searchTelegramPinterest('kidney', 'bad bookmark?')).rejects.toThrow('sahifalash kaliti')
  expect(fetch).not.toHaveBeenCalled()
})

it('preserves an explicit query without broadening it or calling AI', async () => {
  const fetch = vi.fn()
  vi.stubGlobal('fetch', fetch)
  expect(await telegramImageQuery('Mavzu', ' oligozoospermia ')).toBe('oligozoospermia')
  expect(fetch).not.toHaveBeenCalled()
})
it('translates a blank query to a specific medical term', async () => {
  vi.stubEnv('GEMINI_API_KEY', 'test')
  vi.stubEnv('GEMINI_MODEL', 'test-model')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"query":"oligozoospermia"}' }] } }] }))))
  expect(await telegramImageQuery('oligozospermiya', '')).toBe('oligozoospermia')
})
