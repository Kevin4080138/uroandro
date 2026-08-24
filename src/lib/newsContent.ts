type Candidate = { title: string; summary: string; url: string; sourceName: string }

export type UzbekNewsContent = {
  title_uz: string
  summary_uz: string
  content_uz: string
  student_importance: string
  doctor_importance: string
  patient_importance: string
}
// Vendor-locksiz adapter. Endpoint faqat strukturali JSON qaytarishi kerak.
// Adapter sozlanmagan yoki javob to'liq bo'lmasa cron xavfsiz draft yaratadi.
export async function uzbekContentYarat(candidate: Candidate): Promise<UzbekNewsContent | null> {
  const endpoint = process.env.NEWS_AI_API_URL
  const key = process.env.NEWS_AI_API_KEY
  if (!endpoint || !key) return null

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        task: 'urosfera_daily_medical_news_uz',
        safety: 'No diagnosis, prescription, dosage or individual treatment advice.',
        candidate,
      }),
      signal: AbortSignal.timeout(20_000),
    })
    if (!response.ok) return null
    const data = await response.json() as Partial<UzbekNewsContent>
    const fields: (keyof UzbekNewsContent)[] = ['title_uz', 'summary_uz', 'content_uz', 'student_importance', 'doctor_importance', 'patient_importance']
    if (!fields.every((field) => typeof data[field] === 'string' && data[field]!.trim())) return null
    return data as UzbekNewsContent
  } catch {
    return null
  }
}
