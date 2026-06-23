import type { Shablon } from './turlar'
import { prostatitShablon } from './prostatit'

export const SHABLONLAR: Shablon[] = [
  prostatitShablon,
  // kelajakda: varikotseleShablon, urolitiazShablon, ...
]

export function shablonTop(id: string) {
  return SHABLONLAR.find((s) => s.id === id)
}

export * from './turlar'
