import { describe, expect, it, vi } from 'vitest'
import { emptyQuizQuestion } from './telegramQuiz'
import { executeQuizDelivery, TelegramDeliveryError, type QuizJob, type QuizDeliveryLedger, type QuizPartRecord } from './telegramQuizDelivery'

const job: QuizJob = { id: 'job', quiz_id: 'quiz', lease_token: 'lease', status: 'sending', payload: {
  destination: { name: 'Test', chat_id: '-100123' }, quiz: { id: 'quiz', title: 'T', topic: 'T', revision: 1,
    audience: 'student', subject_type: 'clinical', difficulty: 'qiyin', status: 'approved', questions: [{ ...emptyQuizQuestion(),
      question: 'Savol?', case_text: 'Vaziyat', options: ['A', 'B', 'C', 'D'], explanation: 'Izoh', correct_option: 1 }] },
} }
function ledger() {
  const parts: QuizPartRecord[] = []
  let status = 'sending'
  const store: QuizDeliveryLedger = {
    parts: async () => parts,
    begin: vi.fn(async (key: string) => { const p = parts.find((p) => p.part_key === key); if (p) p.status = 'sending'; else parts.push({ part_key: key, status: 'sending', telegram_message_id: null, telegram_poll_id: null }) }),
    complete: vi.fn(async (key, message) => { Object.assign(parts.find((p) => p.part_key === key)!, { status: 'sent', telegram_message_id: String(message.message_id), telegram_poll_id: message.poll?.id ?? null }) }),
    fail: vi.fn(async (key, next) => { parts.find((p) => p.part_key === key)!.status = next }),
    finish: vi.fn(async (next) => { status = next }),
  }
  return { parts, store, status: () => status }
}
describe('Quiz yuborishning uzilishdan keyingi xulqi', () => {
  it('resumes only the failed poll after an explicit Telegram rejection', async () => {
    const state = ledger()
    const request = vi.fn().mockResolvedValueOnce({ message_id: 1 }).mockRejectedValueOnce(new TelegramDeliveryError('Rate limited', true))
    await expect(executeQuizDelivery(job, state.store, request)).rejects.toThrow('Rate limited')
    expect(state.parts[0].status).toBe('sent')
    expect(state.status()).toBe('failed')
    const retry = vi.fn().mockResolvedValue({ message_id: 2, poll: { id: 'poll-2' } })
    await executeQuizDelivery(job, state.store, retry)
    expect(retry).toHaveBeenCalledTimes(1)
    expect(retry.mock.calls[0][0]).toBe('sendPoll')
    expect(state.status()).toBe('sent')
  })
  it('does not retry when a request times out even if no message ID was returned', async () => {
    const state = ledger(), request = vi.fn().mockRejectedValue(new TelegramDeliveryError('Timeout', false))
    await expect(executeQuizDelivery(job, state.store, request)).rejects.toThrow('Timeout')
    expect(state.status()).toBe('uncertain')
    await expect(executeQuizDelivery(job, state.store, request)).rejects.toThrow('noaniq')
    expect(request).toHaveBeenCalledTimes(1)
  })
  it('does not retry an interrupted in-flight part', async () => {
    const state = ledger(), request = vi.fn()
    await state.store.begin('0:case', 'sendMessage')
    await expect(executeQuizDelivery(job, state.store, request)).rejects.toThrow('noaniq')
    expect(request).not.toHaveBeenCalled()
  })
  it('blocks duplication if Telegram succeeds but persistence fails', async () => {
    const state = ledger(), request = vi.fn().mockResolvedValue({ message_id: 1 })
    state.store.complete = vi.fn().mockRejectedValue(new Error('DB unavailable'))
    await expect(executeQuizDelivery(job, state.store, request)).rejects.toThrow('tasdiqlanmadi')
    expect(state.status()).toBe('uncertain')
    expect(request).toHaveBeenCalledTimes(1)
  })
  it('never contacts Telegram for an already completed job', async () => {
    const state = ledger(), request = vi.fn()
    await executeQuizDelivery({ ...job, status: 'sent' }, state.store, request)
    expect(request).not.toHaveBeenCalled()
  })
})
