import { NextResponse } from 'next/server'
import { quizErrorResponse, quizId } from '@/lib/telegramQuizResponse'
import { quizObject, quizRevision, quizSaveInput, QuizError } from '@/lib/telegramQuiz'
import { deliverQuiz, generateQuiz, quizDetail, requireQuizAdmin, saveQuiz } from '@/lib/telegramQuiz.server'

export const maxDuration = 180
type Context = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: Context) {
  try {
    await requireQuizAdmin()
    return NextResponse.json(await quizDetail(quizId((await context.params).id)), { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) { return quizErrorResponse(error) }
}
export async function PATCH(request: Request, context: Context) {
  try {
    await requireQuizAdmin()
    const id = quizId((await context.params).id)
    return NextResponse.json(await saveQuiz(id, quizSaveInput(await request.json())))
  } catch (error) { return quizErrorResponse(error) }
}
export async function POST(request: Request, context: Context) {
  try {
    await requireQuizAdmin()
    const id = quizId((await context.params).id), input = quizObject(await request.json())
    if (input.action === 'generate') {
      const detail = await quizDetail(id)
      if (detail.jobs.length) throw new QuizError('Yuborish boshlangan quizga yangi savol yaratilmaydi.', 409)
      return NextResponse.json({ questions: await generateQuiz(input) })
    }
    if (input.action === 'send') return NextResponse.json(await deliverQuiz(id, quizId(input.destination_id), quizRevision(input.revision)))
    throw new QuizError('Noma’lum amal.')
  } catch (error) { return quizErrorResponse(error) }
}
