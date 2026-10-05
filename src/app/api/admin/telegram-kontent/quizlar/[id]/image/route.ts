import { NextResponse } from 'next/server'
import { quizErrorResponse, quizId } from '@/lib/telegramQuizResponse'
import { QuizError } from '@/lib/telegramQuiz'
import { quizDetail, requireQuizAdmin, uploadQuizImage } from '@/lib/telegramQuiz.server'

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireQuizAdmin()
    const id = quizId((await context.params).id)
    const detail = await quizDetail(id)
    if (detail.jobs.length) throw new QuizError('Yuborish boshlangan quiz tahrirlanmaydi.', 409)
    const form = await request.formData(), file = form.get('file')
    const credit = String(form.get('credit') ?? '').trim(), license = String(form.get('license') ?? '').trim()
    if (!(file instanceof File)) throw new QuizError('Rasm faylini tanlang.')
    if (form.get('rights_confirmed') !== 'true' || !credit || credit.length > 200 || !license || license.length > 200) throw new QuizError('Muallif va litsenziyani kiriting, foydalanish huquqini tasdiqlang.')
    return NextResponse.json({ image_url: await uploadQuizImage(id, file), image_credit: credit, image_license: license, image_source_url: null })
  } catch (error) { return quizErrorResponse(error) }
}
