import { NextResponse } from 'next/server'
import { kunlikYangilikIshiniBajar } from '@/lib/newsRun'

export const maxDuration = 300

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
  }
  try {
    return NextResponse.json({ ok: true, ...(await kunlikYangilikIshiniBajar(false)) })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Noma’lum xato' }, { status: 500 })
  }
}
