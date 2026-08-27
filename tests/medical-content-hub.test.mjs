import test from 'node:test'
import assert from 'node:assert/strict'
import { candidateHash, canonicalUrl, titleSimilarity } from '../src/lib/newsDedup.ts'
import { defaultAudience, importanceHisobla } from '../src/lib/newsRanking.ts'
import { newsCronSlotKey } from '../src/lib/newsSchedule.ts'
import { telegramKanalgaYangilik } from '../src/lib/newsTelegram.ts'
import { isolateSourceFetch } from '../src/lib/newsSources/isolation.ts'
import { DEFAULT_NEWS_MIN_IMPORTANCE_SCORE, newsMinImportanceScore } from '../src/lib/newsConfig.ts'
import { urosferaRelevant } from '../src/lib/newsRelevance.ts'

const candidate = { source_key: 'pubmed-urology', source_name: 'PubMed', source_type: 'api', external_id: '123',
  original_url: 'https://pubmed.ncbi.nlm.nih.gov/123/', canonical_url: 'https://pubmed.ncbi.nlm.nih.gov/123/',
  title_original: 'Randomized clinical trial for bladder treatment', summary_original: 'A clinical trial reports a diagnostic treatment outcome.',
  authors: [], published_at: '2026-08-27T00:00:00Z', source_updated_at: null, image_url: null,
  specialty: 'urology', content_type: 'research_summary', metadata: { pmid: '123' } }

test('duplicate detection uses PMID, canonical URL and title similarity', () => {
  assert.equal(candidateHash(candidate), candidateHash({ ...candidate, canonical_url: 'https://example.com/other' }))
  assert.equal(canonicalUrl('https://www.EXAMPLE.com/a/?utm_source=x#b'), 'https://example.com/a')
  assert.ok(titleSimilarity('New prostate cancer screening guideline', 'Guideline: new prostate cancer screening') > .8)
})

test('importance is deterministic and most-viewed is never invented', () => {
  const first = importanceHisobla(candidate), second = importanceHisobla(candidate)
  assert.deepEqual(first, second); assert.ok(first.score >= 55)
  assert.equal(first.reasons.some((reason) => /view/i.test(reason)), false)
  assert.deepEqual(defaultAudience('research_summary'), ['student', 'doctor'])
  assert.equal(defaultAudience('research_summary').includes('patient'), false)
})

test('importance threshold defaults to 70 and remains configurable', () => {
  assert.equal(DEFAULT_NEWS_MIN_IMPORTANCE_SCORE, 70)
  assert.equal(newsMinImportanceScore(undefined), 70)
  assert.equal(newsMinImportanceScore('82'), 82)
})

test('NIDDK relevance accepts specialty news and rejects unrelated news', () => {
  assert.equal(urosferaRelevant({ title_original: 'New kidney stone treatment guideline', summary_original: 'Urinary tract care update.' }), true)
  assert.equal(urosferaRelevant({ title_original: 'Nutrition study in adolescents', summary_original: 'A general wellness report.' }), false)
})

test('generic PubMed popularity cannot bypass specialty relevance', () => {
  assert.equal(urosferaRelevant({ title_original: 'Most-read artificial intelligence research', summary_original: 'A popular generic computer science article.' }), false)
  assert.equal(urosferaRelevant({ title_original: 'Cervical dystonia review', summary_original: 'A neurology review of the cervical spine.' }), false)
})

test('Tashkent morning and evening cron slots are distinct', () => {
  assert.match(newsCronSlotKey(new Date('2026-08-27T04:00:00Z')), /-09$/)
  assert.match(newsCronSlotKey(new Date('2026-08-27T15:00:00Z')), /-20$/)
})

test('Telegram auto-send keeps one article button and linked circle footer', async () => {
  const oldFetch = globalThis.fetch; const calls = []
  process.env.TELEGRAM_BOT_TOKEN = 'test-token'; process.env.TELEGRAM_CHANNEL_ID = '@test'
  process.env.TELEGRAM_SOCIAL_URL = 'https://t.me/urosfera'; process.env.INSTAGRAM_URL = 'https://instagram.com/urosfera'; process.env.YOUTUBE_URL = 'https://youtube.com/@urosfera'
  globalThis.fetch = async (_url, init) => { calls.push(JSON.parse(init.body)); return new Response(JSON.stringify({ ok: true, result: { message_id: 77 } }), { status: 200 }) }
  try {
    const news = { id: 'n1', slug: 'test-slug', title_uz: 'Sarlavha', original_title: 'Title', summary_uz: 'Mazmun', content_uz: 'Maqola',
      telegram_post_uz: 'Umumiy post', telegram_message_id: null, source_url: 'https://pubmed.ncbi.nlm.nih.gov/123/', source_name: 'PubMed', image_url: null }
    assert.equal((await telegramKanalgaYangilik(news)).messageId, '77')
    assert.equal(calls[0].reply_markup.inline_keyboard.length, 1)
    assert.match(calls[0].text, /🔵 <a href=.*>Telegram<\/a> • 🟣 <a href=.*>Instagram<\/a> • 🔴 <a href=.*>YouTube<\/a>/)
    assert.doesNotMatch(calls[0].text, /Talaba uchun|Shifokor uchun|Bemor uchun/)
  } finally { globalThis.fetch = oldFetch }
})

test('no eligible, banner prohibition and manual guard are explicit in workflow', async () => {
  const source = await import('node:fs/promises').then((fs) => fs.readFile(new URL('../src/lib/newsRun.ts', import.meta.url), 'utf8'))
  assert.match(source, /no eligible content/); assert.match(source, /auto_banner: false/)
  assert.match(source, /eq\('content_origin', 'automation'\)/)
  assert.doesNotMatch(source, /yangilikBannerlariniSaqlash/)
  assert.match(source, /const selected = eligible\[0\]/)
  assert.match(source, /urosferaRelevant\(item\.candidate\)/)
})

test('every adapter contract normalizes mock candidates and failures are isolated', async () => {
  const keys = ['pubmed-urology', 'niddk-news', 'nichd-news', 'eau-news', 'aua-news', 'acog-news']
  for (const source_key of keys) {
    const ok = await isolateSourceFetch(async () => [{ ...candidate, source_key }])
    assert.equal(ok.error, null); assert.equal(ok.candidates[0].source_key, source_key)
    for (const field of ['source_name','source_type','external_id','original_url','canonical_url','title_original','summary_original','authors','published_at','source_updated_at','image_url','specialty','content_type','metadata']) assert.ok(field in ok.candidates[0])
  }
  const failed = await isolateSourceFetch(async () => { throw new Error('HTTP 503') })
  assert.deepEqual(failed.candidates, []); assert.equal(failed.error, 'HTTP 503')
})

test('Telegram claim and existing manual publish actions remain idempotent', async () => {
  const publish = await import('node:fs/promises').then((fs) => fs.readFile(new URL('../src/lib/newsPublish.ts', import.meta.url), 'utf8'))
  assert.match(publish, /is\('telegram_selected_at', null\)/)
  assert.match(publish, /telegram_message_id && !options\?\.resendTelegram/)
  assert.match(publish, /export async function yangilikBannergaChiqar/)
  assert.match(publish, /export async function yangilikTelegramgaYubor/)
  assert.match(publish, /export async function yangilikBannerVaTelegram/)
})
