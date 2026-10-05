import { NextResponse } from 'next/server'
import { quizErrorResponse } from '@/lib/telegramQuizResponse'
import { connectQuizStatistics, requireQuizAdmin } from '@/lib/telegramQuiz.server'

export async function POST() {
  try {
    await requireQuizAdmin()
    await connectQuizStatistics()
    return NextResponse.json({ ok: true })
  } catch (error) { return quizErrorResponse(error) }
}
