import { NextResponse } from 'next/server'
import { QuizError } from './telegramQuiz'

export function quizErrorResponse(error: unknown) {
  if (error instanceof QuizError) return NextResponse.json({ error: error.message }, { status: error.status })
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'JSON formati noto‘g‘ri.' }, { status: 400 })
  // Tashqi xizmat xatolari va API kalitlari foydalanuvchiga yoki logga chiqarilmaydi.
  return NextResponse.json({ error: 'Xizmat javob bermadi yoki noto‘g‘ri ma’lumot qaytardi. Qayta urinib ko‘ring.' }, { status: 502 })
}
export function quizId(id: unknown) {
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new QuizError('Identifikator noto‘g‘ri.')
  return id
}
