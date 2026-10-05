import { QuizError, quizSendParts, type QuizDraft } from './telegramQuiz'

export type QuizJob = {
  id: string; quiz_id: string; status: string; lease_token: string
  payload: { quiz: QuizDraft; destination: { chat_id: string; name: string } }
}
export type QuizPartRecord = { part_key: string; status: string; telegram_message_id: string | null; telegram_poll_id: string | null }
export type TelegramSentMessage = { message_id: number; poll?: { id: string } }
export interface QuizDeliveryLedger {
  parts(): Promise<QuizPartRecord[]>
  begin(key: string, method: string): Promise<void>
  complete(key: string, message: TelegramSentMessage): Promise<void>
  fail(key: string, status: 'failed' | 'uncertain', reason: string): Promise<void>
  finish(status: 'sent' | 'failed' | 'uncertain', reason?: string): Promise<void>
}
export class TelegramDeliveryError extends Error {
  constructor(message: string, public definitive: boolean) { super(message) }
}
export type TelegramRequester = (method: string, body: Record<string, unknown>) => Promise<TelegramSentMessage>

/** No automatic retries after network uncertainty. A definitive Telegram rejection can be resumed. */
export async function executeQuizDelivery(job: QuizJob, ledger: QuizDeliveryLedger, request: TelegramRequester) {
  if (job.status === 'sent') return
  const existing = await ledger.parts()
  if (existing.some((part) => part.status === 'sending' || part.status === 'uncertain')) {
    throw new QuizError('Yuborish natijasi noaniq. Telegramni tekshiring; qayta yuborish bloklandi.', 409)
  }
  for (const part of quizSendParts(job.payload.quiz, job.payload.destination.chat_id)) {
    if (existing.some((saved) => saved.part_key === part.key && saved.status === 'sent')) continue
    // Commit before the external call. A terminated process leaves 'sending', never retryable automatically.
    await ledger.begin(part.key, part.method)
    let received = false
    try {
      const result = await request(part.method, part.body)
      received = true
      if (!Number.isSafeInteger(result.message_id) || (part.method === 'sendPoll' && !result.poll?.id)) throw new Error('Telegram javobi to‘liq emas.')
      await ledger.complete(part.key, result)
    } catch (error) {
      const status = !received && error instanceof TelegramDeliveryError && error.definitive ? 'failed' : 'uncertain'
      const reason = error instanceof TelegramDeliveryError ? error.message : 'Yuborish yoki natijani saqlash tasdiqlanmadi. Telegramni tekshiring.'
      // Even if recording fails, the prior 'sending' marker blocks a blind duplicate.
      await ledger.fail(part.key, status, reason).catch(() => undefined)
      await ledger.finish(status, reason).catch(() => undefined)
      throw new QuizError(reason, 502)
    }
  }
  await ledger.finish('sent')
}
