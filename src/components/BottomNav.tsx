'use client'

import { Home, GraduationCap, Trophy, User } from 'lucide-react'
import { MeniscusNav, type NavBand } from './MeniscusNav'

// Talaba bo'limi pastki navigatsiyasi — umumiy MeniscusNav ustida.
const TALABA_BANDLAR: NavBand[] = [
  { Icon: Home, label: 'Bosh sahifa', href: '/student/dashboard' },
  { Icon: GraduationCap, label: 'Talim', href: '/student/darslar' },
  { Icon: Trophy, label: 'Reyting', href: '/student/reyting' },
  { Icon: User, label: 'Profil', href: '/student/profil' },
]

export function BottomNav() {
  return <MeniscusNav bandlar={TALABA_BANDLAR} />
}
