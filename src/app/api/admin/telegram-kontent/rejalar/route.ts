import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabaseAdmin'
import { requireQuizAdmin } from '@/lib/telegramQuiz.server'
import { QuizError } from '@/lib/telegramQuiz'
import { quizErrorResponse, quizId } from '@/lib/telegramQuizResponse'
import { scheduleTime } from '@/lib/telegramSchedule'
import { scheduleDbError } from '@/lib/telegramSchedule.server'

export async function GET() {
  try {
    await requireQuizAdmin()
    const db = createAdminClient()
    const results = await Promise.all([
      db.from('telegram_schedules').select('*').order('scheduled_at', { ascending: false }).limit(500),
      db.from('telegram_posts').select('id,title,revision').eq('status', 'approved').order('created_at', { ascending: false }),
      db.from('telegram_quizzes').select('id,title,revision').eq('status', 'approved').order('created_at', { ascending: false }),
      db.from('telegram_destinations').select('id,name,use_for,is_active').order('name'),
      db.from('telegram_scheduler_state').select('last_run_at').eq('id', true).single(),
    ])
    results.forEach(r => scheduleDbError(r.error))
    return NextResponse.json({ schedules: results[0].data, posts: results[1].data, quizzes: results[2].data,
      destinations: results[3].data, last_run_at: results[4].data?.last_run_at ?? null, configured: !!process.env.CRON_SECRET }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) { return quizErrorResponse(e) }
}
export async function POST(request: Request) {
  try {
    await requireQuizAdmin()
    const body = await request.json()
    if (!body || !['post', 'quiz'].includes(body.kind) || !Number.isInteger(body.revision) || body.revision < 1) throw new QuizError('Kontent va uning versiyasini tanlang.')
    const r = await createAdminClient().rpc('create_telegram_schedule', { p_kind: body.kind, p_content: quizId(body.content_id),
      p_destination: quizId(body.destination_id), p_revision: body.revision, p_at: scheduleTime(body.time) })
    scheduleDbError(r.error)
    return NextResponse.json({ id: r.data }, { status: 201 })
  } catch (e) { return quizErrorResponse(e) }
}
export async function PATCH(request: Request) {
  try {
    await requireQuizAdmin()
    const body = await request.json()
    if (!body || !['cancel', 'reschedule'].includes(body.action)) throw new QuizError('Amal noto‘g‘ri.')
    const r = await createAdminClient().rpc('change_telegram_schedule', { p_id: quizId(body.id), p_at: body.action === 'cancel' ? null : scheduleTime(body.time) })
    scheduleDbError(r.error)
    return NextResponse.json({ ok: true })
  } catch (e) { return quizErrorResponse(e) }
}
