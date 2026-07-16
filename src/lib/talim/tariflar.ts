'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Bosqich } from '@/lib/talim/darslar'

export type Tarif = {
  id: string
  bosqich: Bosqich
  nom: string
  narx: number
  muddat_oy: number | null
  tavsif: string | null
}

export function narxFmt(n: number): string {
  return n.toLocaleString('uz-UZ').replace(/,/g, ' ') + " so'm"
}

// Faol tariflar — talaba tomonda narx ko'rsatish uchun (admin /admin/tariflar da boshqaradi).
export function useTariflar() {
  const supabase = createClient()
  const [tariflar, setTariflar] = useState<Tarif[]>([])
  const [yuklandi, setYuklandi] = useState(false)

  useEffect(() => {
    supabase
      .from('tariflar')
      .select('id, bosqich, nom, narx, muddat_oy, tavsif')
      .eq('faol', true)
      .order('tartib')
      .then(({ data }) => {
        setTariflar((data as Tarif[]) ?? [])
        setYuklandi(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Bosqich uchun eng arzon tarif ("...dan boshlab" ko'rinishida ishlatiladi)
  const engArzon = (bosqich: Bosqich): Tarif | null => {
    const mos = tariflar.filter((t) => t.bosqich === bosqich)
    if (!mos.length) return null
    return mos.reduce((a, b) => (a.narx <= b.narx ? a : b))
  }

  const bosqichniki = (bosqich: Bosqich) => tariflar.filter((t) => t.bosqich === bosqich)

  return { tariflar, yuklandi, engArzon, bosqichniki }
}
