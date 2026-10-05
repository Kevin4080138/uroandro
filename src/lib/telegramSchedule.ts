import { QuizError } from './telegramQuiz'

export type TelegramSchedule = {
  id: string; post_id: string | null; quiz_id: string | null; destination_id: string; destination_chat_id: string;
  revision: number; title: string; scheduled_at: string;
  status: 'pending' | 'sending' | 'sent' | 'failed' | 'uncertain' | 'cancelled';
  last_error: string | null;
}
export function scheduleTime(value: unknown, now = Date.now()) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new QuizError('Sana va vaqtni kiriting.')
  const date = new Date(`${value}:00+05:00`)
  if (!Number.isFinite(date.getTime()) || tashkentInput(date) !== value) throw new QuizError('Sana yoki vaqt noto‘g‘ri.')
  if (date.getTime() < now + 60_000 || date.getTime() > now + 366 * 86400_000) throw new QuizError('Vaqt 1 daqiqadan 366 kungacha kelajakda bo‘lsin.')
  return date.toISOString()
}
export function tashkentInput(date: Date) {
  return new Date(date.getTime() + 5 * 3600_000).toISOString().slice(0, 16)
}
export function scheduleLabel(value: string) {
  return new Intl.DateTimeFormat('uz-UZ', { timeZone: 'Asia/Tashkent', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}
