import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Faqat server tomonida (API route'larda) ishlatiladi — RLS'ni chetlab o'tadi.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
