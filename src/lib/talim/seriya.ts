'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export type Seriya = {
  joriy: number
  eng_uzun: number
  oxirgi_sana: string | null
  jami_faol_kun: number
}

// Toshkent vaqti bo'yicha bugungi sana (YYYY-MM-DD) — baza bilan bir xil hisoblanishi shart.
export function bugunToshkent(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date())
}

// Seriya bugun uchun sanalganmi? (kecha faol bo'lsa seriya hali tirik, lekin bugun emas)
export function bugunSanalganmi(s: Seriya | null): boolean {
  return !!s && s.oxirgi_sana === bugunToshkent()
}

// Har qanday yakunlangan qadamdan keyin chaqiriladi — kuniga bir marta sanaladi,
// takroriy chaqiruvlar seriyani oshirmaydi (mantiq bazadagi funksiyada).
// Jadval/funksiya hali yaratilmagan bo'lsa ham chaqiruvchi buzilmasin.
export async function seriyaBelgila(): Promise<Seriya | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('seriya_belgila')
  if (error) return null
  return (data as Seriya) ?? null
}

export function useSeriya() {
  const supabase = createClient()
  const [seriya, setSeriya] = useState<Seriya | null>(null)
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    const yukla = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setYuklandi(true); return }
      const { data } = await supabase
        .from('kunlik_seriya')
        .select('joriy, eng_uzun, oxirgi_sana, jami_faol_kun')
        .eq('student_id', user.id)
        .maybeSingle()
      setSeriya((data as Seriya) ?? null)
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { seriya, yuklandi }
}
