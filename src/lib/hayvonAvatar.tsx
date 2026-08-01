// Talaba avatari uchun hayvon ikonkalari — rasm o'rniga tanlanadigan tiniq variant.
// Tanlangan hayvon `profiles.avatar_ikon` (text) ustunida kalit sifatida saqlanadi.
import { Cat, Dog, Rabbit, Bird, Fish, Turtle, Squirrel, Panda, type LucideIcon } from 'lucide-react'

export type Hayvon = { key: string; Icon: LucideIcon; nom: string }

export const HAYVONLAR: Hayvon[] = [
  { key: 'mushuk', Icon: Cat, nom: 'Mushuk' },
  { key: 'it', Icon: Dog, nom: 'It' },
  { key: 'quyon', Icon: Rabbit, nom: 'Quyon' },
  { key: 'qush', Icon: Bird, nom: 'Qush' },
  { key: 'baliq', Icon: Fish, nom: 'Baliq' },
  { key: 'toshbaqa', Icon: Turtle, nom: 'Toshbaqa' },
  { key: 'olmaxon', Icon: Squirrel, nom: 'Olmaxon' },
  { key: 'panda', Icon: Panda, nom: 'Panda' },
]

export function hayvonTop(key: string | null | undefined): Hayvon | undefined {
  if (!key) return undefined
  return HAYVONLAR.find((h) => h.key === key)
}
