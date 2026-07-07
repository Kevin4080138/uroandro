import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { ref_code, invited_id } = await req.json()
  if (!ref_code || !invited_id) return NextResponse.json({ ok: false })

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find inviter by referral_code
  const { data: inviter } = await adminClient
    .from('profiles')
    .select('id')
    .eq('referral_code', ref_code.toUpperCase())
    .maybeSingle()

  if (!inviter || inviter.id === invited_id) return NextResponse.json({ ok: false })

  // Insert referral (ignore duplicate)
  await adminClient.from('referrals').upsert(
    { inviter_id: inviter.id, invited_id },
    { onConflict: 'invited_id', ignoreDuplicates: true }
  )

  return NextResponse.json({ ok: true })
}
