import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { postUpdateInput, uuid, type TelegramImageCandidate, type TelegramSource } from '@/lib/telegramContent'
import { generateTelegramPost, saveTelegramPostImage, searchTelegramPostImages, sendTelegramPost } from '@/lib/telegramPosts.server'

async function admin() {
  const client = await createServerSupabase()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return null
  const { data } = await client.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin' ? user : null
}
const jsonError = (message: string, status = 400) => NextResponse.json({ error: message }, { status })
function dbError(error: { code?: string; message?: string }) {
  if (error.code === '42P01' || error.code === 'PGRST205' || error.code === '42703') return jsonError('Telegram post migratsiyalari hali bazaga qo‘llanmagan.', 503)
  return jsonError(`Baza xatosi: ${(error.message ?? 'noma’lum xato').slice(0, 300)}`, 500)
}
async function postId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  return uuid(id, 'Post identifikatori')
}
function imageCandidate(value: unknown): TelegramImageCandidate {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Rasm ma’lumoti noto‘g‘ri.')
  const item = value as Record<string, unknown>
  if (item.provider !== 'pexels' && item.provider !== 'unsplash') throw new Error('Rasm provayderi noto‘g‘ri.')
  for (const field of ['image_url', 'preview_url', 'source_url', 'credit', 'license']) {
    if (typeof item[field] !== 'string' || !item[field]) throw new Error(`Rasmning ${field} maydoni noto‘g‘ri.`)
  }
  if (item.tracking_url !== undefined && typeof item.tracking_url !== 'string') throw new Error('Rasm tracking manzili noto‘g‘ri.')
  return item as TelegramImageCandidate
}
async function getPost(id: string) {
  return createAdminClient().from('telegram_posts').select('*').eq('id', id).maybeSingle()
}
async function saveRevision(post: Record<string, unknown>, userId: string) {
  const { error } = await createAdminClient().from('telegram_post_revisions').upsert({
    post_id: post.id, revision: post.revision, snapshot: post, created_by: userId,
  }, { onConflict: 'post_id,revision', ignoreDuplicates: true })
  if (error) throw new Error(error.message)
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!await admin()) return jsonError('Faqat admin uchun.', 403)
  try {
    const id = await postId(context)
    const { data, error } = await getPost(id)
    if (error) return dbError(error)
    if (!data) return jsonError('Post topilmadi.', 404)
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return jsonError(error instanceof Error ? error.message : 'So‘rov noto‘g‘ri.') }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await admin()
  if (!user) return jsonError('Faqat admin uchun.', 403)
  try {
    const id = await postId(context)
    const input = postUpdateInput(await request.json())
    const { data: current, error: readError } = await getPost(id)
    if (readError) return dbError(readError)
    if (!current) return jsonError('Post topilmadi.', 404)
    if (current.status === 'sent') return jsonError('Yuborilgan postni o‘zgartirib bo‘lmaydi.', 409)
    if (current.revision !== input.revision) return jsonError('Post boshqa oynada yangilangan. Sahifani yangilang.', 409)
    await saveRevision(current, user.id)
    const adminDb = createAdminClient()
    const { data, error } = await adminDb.from('telegram_posts').update({ ...input, revision: input.revision + 1, last_error: null })
      .eq('id', id).eq('revision', input.revision).select('*').maybeSingle()
    if (error) return dbError(error)
    if (!data) return jsonError('Post boshqa oynada yangilangan. Sahifani yangilang.', 409)
    return NextResponse.json(data)
  } catch (error) { return jsonError(error instanceof SyntaxError ? 'JSON formati noto‘g‘ri.' : error instanceof Error ? error.message : 'So‘rov noto‘g‘ri.') }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await admin()
  if (!user) return jsonError('Faqat admin uchun.', 403)
  try {
    const id = await postId(context)
    const body = await request.json() as { action?: string; audience?: string; query?: string; candidate?: unknown; destinationId?: string }
    const { data: post, error: readError } = await getPost(id)
    if (readError) return dbError(readError)
    if (!post) return jsonError('Post topilmadi.', 404)
    const adminDb = createAdminClient()

    if (body.action === 'generate') {
      if (post.status === 'sent') return jsonError('Yuborilgan postni qayta yaratib bo‘lmaydi.', 409)
      const audience = ['student', 'doctor', 'patient'].includes(String(body.audience)) ? body.audience as 'student' | 'doctor' | 'patient' : post.audience
      const generated = await generateTelegramPost(post.topic, audience)
      await saveRevision(post, user.id)
      const { data, error } = await adminDb.from('telegram_posts').update({ title: generated.title, body: generated.body,
        audience, sources: generated.sources, status: 'draft', revision: post.revision + 1, last_error: null })
        .eq('id', id).eq('revision', post.revision).select('*').maybeSingle()
      if (error) return dbError(error)
      if (!data) return jsonError('Post boshqa oynada yangilangan. Qayta yuklang.', 409)
      return NextResponse.json({ post: data, imageQuery: generated.imageQuery })
    }

    if (body.action === 'search-images') {
      const query = typeof body.query === 'string' && body.query.trim() ? body.query.trim() : `${post.topic} medical healthcare`
      return NextResponse.json({ images: await searchTelegramPostImages(query) })
    }

    if (body.action === 'select-image') {
      if (post.status === 'sent') return jsonError('Yuborilgan post rasmini o‘zgartirib bo‘lmaydi.', 409)
      const selected = await saveTelegramPostImage(id, imageCandidate(body.candidate))
      await saveRevision(post, user.id)
      const { data, error } = await adminDb.from('telegram_posts').update({ ...selected, status: 'draft', revision: post.revision + 1, last_error: null })
        .eq('id', id).eq('revision', post.revision).select('*').maybeSingle()
      if (error) return dbError(error)
      if (!data) return jsonError('Post boshqa oynada yangilangan. Qayta yuklang.', 409)
      return NextResponse.json({ post: data })
    }

    if (body.action === 'send') {
      if (post.status !== 'approved') return jsonError('Telegramga yuborishdan oldin postni tasdiqlang.', 409)
      if (!post.body?.trim()) return jsonError('Post matni bo‘sh.', 409)
      if (Array.isArray(post.telegram_message_ids) && post.telegram_message_ids.length) return jsonError('Bu post yoki uning bir qismi Telegramga avval yuborilgan.', 409)
      const destinationId = uuid(body.destinationId, 'Telegram manzili')
      const { data: destination, error: destinationError } = await adminDb.from('telegram_destinations').select('*').eq('id', destinationId).maybeSingle()
      if (destinationError) return dbError(destinationError)
      if (!destination || !destination.is_active || !['posts', 'both'].includes(destination.use_for)) return jsonError('Faol post manzili topilmadi.', 409)
      const { data: oldJob, error: oldJobError } = await adminDb.from('telegram_delivery_jobs').select('id,status,attempts')
        .eq('destination_id', destination.id).eq('post_id', id).eq('revision', post.revision).maybeSingle()
      if (oldJobError) return dbError(oldJobError)
      if (oldJob && oldJob.status !== 'failed') return jsonError('Bu versiya yuborilgan yoki yuborish natijasi noaniq. Dublikat bo‘lmasligi uchun qayta yuborish bloklandi.', 409)
      const payload = { title: post.title, body: post.body, image_url: post.image_url, image_credit: post.image_credit,
        sources: post.sources, destination: { id: destination.id, name: destination.name, chat_id: destination.chat_id } }
      let jobId: string
      if (oldJob) {
        const { data: retried, error } = await adminDb.from('telegram_delivery_jobs').update({ status: 'sending',
          attempts: oldJob.attempts + 1, locked_at: new Date().toISOString(), last_error: null, payload }).eq('id', oldJob.id).select('id').single()
        if (error) return dbError(error)
        jobId = retried.id
      } else {
        const { data: created, error } = await adminDb.from('telegram_delivery_jobs').insert({ destination_id: destination.id,
          post_id: id, revision: post.revision, payload, status: 'sending', attempts: 1, locked_at: new Date().toISOString() }).select('id').single()
        if (error) return dbError(error)
        jobId = created.id
      }
      const sent = await sendTelegramPost({ title: post.title, body: post.body, image_url: post.image_url,
        image_credit: post.image_credit, sources: (post.sources ?? []) as TelegramSource[] }, destination.chat_id)
      for (const part of sent.parts) {
        await adminDb.from('telegram_delivery_parts').upsert({ job_id: jobId, part_key: part.key, method: part.method,
          status: 'sent', telegram_message_id: part.messageId, last_error: null }, { onConflict: 'job_id,part_key' })
      }
      const ids = sent.parts.map((part) => part.messageId)
      await adminDb.from('telegram_delivery_jobs').update({ status: sent.error ? (ids.length ? 'uncertain' : 'failed') : 'sent',
        last_error: sent.error, locked_at: null }).eq('id', jobId)
      const nextStatus = sent.error ? 'failed' : 'sent'
      const { data, error } = await adminDb.from('telegram_posts').update({ status: nextStatus,
        telegram_message_ids: ids, sent_to_destination_id: destination.id,
        sent_at: sent.error ? null : new Date().toISOString(), last_error: sent.error })
        .eq('id', id).eq('revision', post.revision).select('*').maybeSingle()
      if (error) return dbError(error)
      if (!data) return jsonError('Yuborish natijasini saqlab bo‘lmadi.', 500)
      if (sent.error) return NextResponse.json({ error: ids.length
        ? `Postning bir qismi yuborildi; avtomatik qayta yuborilmadi. ${sent.error}` : sent.error, post: data }, { status: 502 })
      return NextResponse.json({ post: data })
    }
    return jsonError('Noma’lum amal.')
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) return jsonError('Tashqi xizmat vaqtida javob bermadi.', 504)
    return jsonError(error instanceof SyntaxError ? 'JSON formati noto‘g‘ri.' : error instanceof Error ? error.message : 'Amal bajarilmadi.', 500)
  }
}
