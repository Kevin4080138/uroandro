'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Bosqich } from '@/lib/talim/darslar'

// Joriy talabaning qaysi bosqich(lar)ga faol obunasi borligini qaytaradi.
// Admin uchun har doim "hammasi ochiq" qaytariladi (RLS'da ham shunday bypass mavjud).
export function useMeningObunalarim() {
  const supabase = createClient()
  const [obunalar, setObunalar] = useState<Set<Bosqich> | null>(null)
  const [adminmi, setAdminmi] = useState(false)
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    const yukla = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setObunalar(new Set()); setYuklandi(true); return }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (profile?.role === 'admin') {
        setAdminmi(true)
        setObunalar(new Set(['oson', "o'rta", 'qiyin']))
        setYuklandi(true)
        return
      }

      const { data } = await supabase.from('obunalar').select('bosqich, tugash_sanasi').eq('student_id', user.id).eq('faol', true)
      const amaldagilar = (data ?? []).filter((o) => !o.tugash_sanasi || new Date(o.tugash_sanasi) > new Date())
      setObunalar(new Set(amaldagilar.map((o) => o.bosqich as Bosqich)))
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Oson bosqich hamma uchun bepul — obuna talab qilinmaydi.
  const egami = (bosqich: Bosqich) => bosqich === 'oson' || adminmi || (obunalar?.has(bosqich) ?? false)

  return { obunalar, egami, adminmi, yuklandi }
}
