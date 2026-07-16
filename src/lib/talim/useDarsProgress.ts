'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Bosqich, Dars } from '@/lib/talim/darslar'

// Dars ichidagi qadamlar ketma-ketligi bosqichga qarab farq qiladi.
// Bu tartib path-interfeysdagi qadamlar tartibining yagona manbasi.
export const BOSQICH_QADAMLARI: Record<Bosqich, string[]> = {
  oson:    ['nazariya', 'video', 'yuklab', 'flashcard', 'amaliy'],
  "o'rta": ['nazariya', 'video', 'yuklab', 'flashcard', 'amaliy', 'usmle', 'nazorat'],
  qiyin:   ['nazariya', 'video', 'yuklab', 'flashcard', 'amaliy', 'usmle', 'klinik', 'interaktiv', 'vaziyatli', 'xatolar', 'nazorat'],
}

// Keyingi darsni ochish uchun shart bo'lgan "asosiy" qadamlar — hammasini
// talab qilmaymiz (talaba bezib ketmasin), nazariya + amaliy test yetarli.
export const ASOSIY_QADAMLAR = ['nazariya', 'amaliy']

export function darsTugadimi(qadamlar: Set<string> | undefined): boolean {
  if (!qadamlar) return false
  return ASOSIY_QADAMLAR.every((q) => qadamlar.has(q))
}

// Bitta dars uchun: tugallangan qadamlar + yakunlash funksiyasi.
export function useDarsProgress(slug: string) {
  const supabase = createClient()
  const [tugallangan, setTugallangan] = useState<Set<string>>(new Set())
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    const yukla = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setYuklandi(true); return }
      const { data } = await supabase
        .from('dars_qadam_progress')
        .select('qadam')
        .eq('student_id', user.id)
        .eq('dars_slug', slug)
      setTugallangan(new Set((data ?? []).map((r) => r.qadam as string)))
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const yakunla = useCallback(async (qadam: string) => {
    // Avval lokal belgilaymiz — UI kutmasin; jadval hali yaratilmagan bo'lsa ham buzilmaydi.
    setTugallangan((s) => {
      if (s.has(qadam)) return s
      return new Set(s).add(qadam)
    })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('dars_qadam_progress')
      .upsert(
        { student_id: user.id, dars_slug: slug, qadam },
        { onConflict: 'student_id,dars_slug,qadam', ignoreDuplicates: true }
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  return { tugallangan, yuklandi, yakunla }
}

// Talabaning barcha darslar bo'yicha progressi — bosqich sahifasida
// ketma-ket ochilishni hisoblash uchun. Map<dars_slug, Set<qadam>>.
export function useUmumiyProgress() {
  const supabase = createClient()
  const [progress, setProgress] = useState<Map<string, Set<string>>>(new Map())
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    const yukla = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setYuklandi(true); return }
      const { data } = await supabase
        .from('dars_qadam_progress')
        .select('dars_slug, qadam')
        .eq('student_id', user.id)
      const m = new Map<string, Set<string>>()
      for (const r of data ?? []) {
        const s = m.get(r.dars_slug) ?? new Set<string>()
        s.add(r.qadam)
        m.set(r.dars_slug, s)
      }
      setProgress(m)
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { progress, yuklandi }
}

// Tartiblangan darslar ro'yxatida N-dars ochiqmi? Birinchi dars har doim ochiq,
// keyingilari oldingi darsning asosiy qadamlari tugagach ochiladi.
export function darsOchiqmi(darslar: Dars[], indeks: number, progress: Map<string, Set<string>>): boolean {
  if (indeks <= 0) return true
  const oldingi = darslar[indeks - 1]
  return darsTugadimi(progress.get(oldingi.slug))
}
