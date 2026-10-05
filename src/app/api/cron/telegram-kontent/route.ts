import { NextResponse } from 'next/server'
import { runTelegramScheduler, schedulerAuthorized, telegramSchedulerHealth } from '@/lib/telegramSchedule.server'
import { quizErrorResponse } from '@/lib/telegramQuizResponse'

export const maxDuration = 180
export async function GET(request: Request) {
  if (!schedulerAuthorized(request.headers.get('authorization'))) return NextResponse.json({ error: 'Ruxsat yo‘q.' }, { status: 401 })
  try {
    const result = new URL(request.url).searchParams.get('check') === '1' ? await telegramSchedulerHealth() : await runTelegramScheduler()
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } })
  }
  catch (e) { return quizErrorResponse(e) }
}
