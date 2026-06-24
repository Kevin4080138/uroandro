import type { Shablon } from './turlar'
import { prostatitShablon } from './prostatit'
import { varikotseleShablon } from './varikotsele'

export const SHABLONLAR: Shablon[] = [
  prostatitShablon,
  varikotseleShablon,
  // kelajakda: urolitiazShablon, ...
]

export function shablonTop(id: string) {
  return SHABLONLAR.find((s) => s.id === id)
}

export * from './turlar'
