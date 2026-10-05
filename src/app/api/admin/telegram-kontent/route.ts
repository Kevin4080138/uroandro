import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { destinationId, destinationInput, draftInput } from '@/lib/telegramContent'

async function adminClient() {
  const client = await createServerSupabase()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return null
  const { data, error } = await client.from('profiles').select('role').eq('id', user.id).single()
  return !error && data?.role === 'admin' ? { client, user } : null
}
const forbidden = () => NextResponse.json({ error: 'Faqat admin uchun.' }, { status: 403 })
function databaseError(error: { code?: string }) {
  if (error.code === '42P01' || error.code === 'PGRST205') {
    return NextResponse.json({ error: 'Telegram kontent bazasi hali tayyor emas. Yangi migratsiyani qo‘llash kerak.' }, { status: 503 })
  }
  if (error.code === '23505') return NextResponse.json({ error: 'Bu Telegram manzili avval qo‘shilgan.' }, { status: 409 })
  return NextResponse.json({ error: 'Ma’lumotni saqlash yoki o‘qishda xatolik. Qayta urinib ko‘ring.' }, { status: 500 })
}

export async function GET() {
  const auth = await adminClient()
  if (!auth) return forbidden()
  const [destinations, posts, quizzes] = await Promise.all([
    auth.client.from('telegram_destinations').select('id,name,chat_id,chat_type,use_for,is_active').order('created_at'),
    auth.client.from('telegram_posts').select('id,title,topic,body,audience,image_url,image_source_url,image_credit,image_license,sources,status,revision,telegram_message_ids,sent_at,last_error,created_at').order('created_at', { ascending: false }).limit(50),
    auth.client.from('telegram_quizzes').select('id,title,topic,status,created_at').order('created_at', { ascending: false }).limit(50),
  ])
  const error = destinations.error ?? posts.error ?? quizzes.error
  if (error) return databaseError(error)
  return NextResponse.json({ destinations: destinations.data, posts: posts.data, quizzes: quizzes.data,
    botConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim()),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim() && process.env.GEMINI_MODEL?.trim()),
    imageSearchConfigured: Boolean(process.env.PEXELS_API_KEY?.trim() || process.env.UNSPLASH_ACCESS_KEY?.trim()),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  const auth = await adminClient()
  if (!auth) return forbidden()
  let input: { table: string; values: Record<string, unknown> }
  try {
    const body: unknown = await request.json()
    if (body && typeof body === 'object' && 'resource' in body && body.resource === 'destination') {
      input = { table: 'telegram_destinations', values: destinationInput(body) }
    } else {
      const draft = draftInput(body)
      input = { table: draft.kind === 'post' ? 'telegram_posts' : 'telegram_quizzes',
        values: { title: draft.title, topic: draft.topic, audience: draft.audience, created_by: auth.user.id } }
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? 'JSON formati noto‘g‘ri.' : error instanceof Error ? error.message : 'Ma’lumot noto‘g‘ri.' }, { status: 400 })
  }
  const { data, error } = await auth.client.from(input.table).insert(input.values).select('id').single()
  if (error) return databaseError(error)
  return NextResponse.json({ id: data.id }, { status: 201 })
}

export async function PATCH(request: Request) {
  const auth = await adminClient()
  if (!auth) return forbidden()
  let id: string
  let values
  try {
    const body: unknown = await request.json()
    id = destinationId(body)
    values = destinationInput(body)
  } catch (error) {
    return NextResponse.json({ error: error instanceof SyntaxError ? 'JSON formati noto‘g‘ri.' : error instanceof Error ? error.message : 'Ma’lumot noto‘g‘ri.' }, { status: 400 })
  }
  const { data, error } = await auth.client.from('telegram_destinations').update(values).eq('id', id).select('id').maybeSingle()
  if (error) return databaseError(error)
  if (!data) return NextResponse.json({ error: 'Manzil topilmadi.' }, { status: 404 })
  return NextResponse.json({ id: data.id })
}
