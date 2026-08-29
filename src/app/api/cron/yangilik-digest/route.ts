import { NextResponse } from 'next/server'
import { yangilikDigestYubor } from '@/lib/newsDigest'
import { cronRuxsatXatosi } from '@/lib/cronAuth'

export const maxDuration = 300

export async function GET(req: Request) {
  const authError = cronRuxsatXatosi(req)
  if (authError) return authError
  try {
    return NextResponse.json({ ok: true, ...(await yangilikDigestYubor()) })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Noma’lum xato' }, { status: 500 })
  }
}
