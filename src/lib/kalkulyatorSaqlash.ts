import { createClient } from '@/lib/supabase'

export async function kalkulyatorNatijasiniSaqla(opts: {
  bemorId: string
  kalkulyator: string
  sarlavha: string
  xulosa: string
  malumot: Record<string, any>
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Tizimga kirilmagan' }

  const { error } = await supabase.from('kalkulyator_natijalari').insert({
    bemor_id: opts.bemorId,
    doctor_id: user.id,
    kalkulyator: opts.kalkulyator,
    sarlavha: opts.sarlavha,
    xulosa: opts.xulosa,
    malumot: opts.malumot,
  })
  return { error: error?.message ?? null }
}

export function yoshHisobla(tugilganSana?: string | null): number | null {
  if (!tugilganSana) return null
  const t = new Date(tugilganSana).getTime()
  if (Number.isNaN(t)) return null
  return Math.floor((Date.now() - t) / (365.25 * 24 * 3600 * 1000))
}
