import 'server-only'
import { timingSafeEqual } from 'node:crypto'
import { createAdminClient } from './supabaseAdmin'
import { QuizError } from './telegramQuiz'
import { deliverQuiz } from './telegramQuiz.server'
import { sendTelegramPost } from './telegramPosts.server'
import type { TelegramSchedule } from './telegramSchedule'

export function scheduleDbError(error: { code?: string } | null) {
  if (!error) return
  if (['42P01', 'PGRST202', 'PGRST205'].includes(error.code ?? '')) throw new QuizError('Rejalashtirish SQL migratsiyasini Supabase’da bajaring.', 503)
  if (['23505', '55000', '40001'].includes(error.code ?? '')) throw new QuizError('Kontent rejalashtirilgan, o‘zgargan yoki yuborish boshlangan. Ro‘yxatni yangilang.', 409)
  throw new QuizError('Rejani saqlash yoki o‘qishda xato. Tasdiqlangan kontent, vaqt va manzilni tekshiring.', 400)
}
export function schedulerAuthorized(header: string | null) {
  const secret = process.env.CRON_SECRET
  if (!secret || !header) return false
  const expected = Buffer.from(`Bearer ${secret}`), actual = Buffer.from(header)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

async function scheduledPost(schedule: TelegramSchedule) {
  const db = createAdminClient()
  const { data: post, error } = await db.from('telegram_posts').select('*').eq('id', schedule.post_id!).single()
  scheduleDbError(error)
  if (!post || post.revision !== schedule.revision || post.status !== 'approved' || !post.body?.trim()) throw new QuizError('Post tasdiqlanmagan yoki versiyasi o‘zgargan.', 409)
  const dest = await db.from('telegram_destinations').select('*').eq('id', schedule.destination_id).single()
  scheduleDbError(dest.error)
  if (!dest.data?.is_active || !['posts', 'both'].includes(dest.data.use_for)) throw new QuizError('Telegram manzili faol emas.', 409)
  // The unique job constraint arbitrates races against the manual send endpoint.
  const job = await db.from('telegram_delivery_jobs').insert({ post_id: post.id, destination_id: dest.data.id,
    revision: post.revision, payload: { ...post, destination: dest.data }, status: 'sending', attempts: 1, locked_at: new Date().toISOString() }).select('id').single()
  scheduleDbError(job.error)
  if (!job.data) throw new QuizError('Yuborish yozuvi yaratilmadi.', 500)
  const result = await sendTelegramPost(post, dest.data.chat_id)
  for (const part of result.parts) {
    const write = await db.from('telegram_delivery_parts').insert({ job_id: job.data.id, part_key: part.key, method: part.method, status: 'sent', telegram_message_id: part.messageId })
    scheduleDbError(write.error)
  }
  // The post transport cannot distinguish rejection from timeout: never automatically retry.
  const status = result.error ? 'uncertain' : 'sent'
  const reason = result.error ? 'Telegram yuborish natijasi noaniq. Guruh/kanalni tekshiring; avtomatik takror yuborilmadi.' : null
  const finish = await db.from('telegram_delivery_jobs').update({ status, last_error: reason, locked_at: null }).eq('id', job.data.id)
  scheduleDbError(finish.error)
  const update = await db.from('telegram_posts').update({ status: result.error ? 'failed' : 'sent',
    telegram_message_ids: result.parts.map(p => p.messageId), sent_to_destination_id: dest.data.id,
    sent_at: result.error ? null : new Date().toISOString(), last_error: reason }).eq('id', post.id).eq('revision', post.revision)
  scheduleDbError(update.error)
  return { status, reason } as const
}

export async function runTelegramScheduler() {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw new QuizError('Telegram bot kaliti sozlanmagan.', 503)
  const db = createAdminClient()
  const claim = await db.rpc('claim_due_telegram_schedule')
  scheduleDbError(claim.error)
  const schedule = claim.data as TelegramSchedule | null
  if (!schedule) return { processed: 0 }
  let status: 'sent' | 'failed' | 'uncertain' = 'uncertain'
  let reason: string | null = null
  try {
    const destination = await db.from('telegram_destinations').select('chat_id,is_active').eq('id', schedule.destination_id).single()
    scheduleDbError(destination.error)
    if (!destination.data?.is_active || destination.data.chat_id !== schedule.destination_chat_id) {
      const finish = await db.rpc('finish_telegram_schedule', { p_id: schedule.id, p_status: 'failed', p_error: 'Telegram manzili o‘zgargan yoki o‘chirilgan. Yangi reja yarating.' })
      scheduleDbError(finish.error)
      return { processed: 1, id: schedule.id, status: 'failed' }
    }
    if (schedule.quiz_id) {
      const detail = await deliverQuiz(schedule.quiz_id, schedule.destination_id, schedule.revision)
      const job = detail.jobs.find(j => j.destination_id === schedule.destination_id)
      status = job?.status === 'sent' ? 'sent' : job?.status === 'failed' ? 'failed' : 'uncertain'
      reason = status === 'sent' ? null : 'Quiz yuborilmadi yoki qisman yuborildi. Quizlar bo‘limida tafsilotlarni tekshiring.'
    } else {
      const result = await scheduledPost(schedule)
      status = result.status; reason = result.reason
    }
  } catch {
    // Even a database error may occur after Telegram accepted the message.
    reason = 'Yuborish yakunlanmadi. Telegram va kontentdagi yuborish holatini tekshiring; avtomatik qayta yuborilmadi.'
  }
  const finish = await db.rpc('finish_telegram_schedule', { p_id: schedule.id, p_status: status, p_error: reason })
  scheduleDbError(finish.error)
  return { processed: 1, id: schedule.id, status }
}
