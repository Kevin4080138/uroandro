'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu, X, Home, GraduationCap, Trophy, User, BookOpen, BarChart3, Library,
  Target, Calculator, Scissors, FolderTree, Newspaper, Dna, type LucideIcon,
} from 'lucide-react'
import { SideDrawer } from './SideDrawer'

type Band = { Icon: LucideIcon; nom: string; href: string }

// Havolalar dashboard'dagi mavjud bo'limlarga mos — o'lik havola bo'lmasin.
const ASOSIY: Band[] = [
  { Icon: Home,          nom: 'Bosh sahifa', href: '/student/dashboard' },
  { Icon: BookOpen,      nom: 'Darslar',     href: '/student/darslar' },
  { Icon: Trophy,        nom: 'Reyting',     href: '/student/reyting' },
  { Icon: User,          nom: 'Profil',      href: '/student/profil' },
]

const BOLIMLAR: Band[] = [
  { Icon: GraduationCap, nom: 'Yangi darslar (3-Level)', href: '/student/urologiya/darslar' },
  { Icon: BarChart3,     nom: 'Natijalarim',            href: '/student/natijalarim' },
  { Icon: Library,       nom: 'Kutubxona',              href: '/student/kutubxona' },
  { Icon: Target,        nom: "O'zingizni tekshiring",  href: '/student/ozingizni-tekshiring' },
  { Icon: Calculator,    nom: 'Kalkulyatorlar',         href: '/student/kalkulyatorlar' },
  { Icon: Scissors,      nom: 'Operativ urologiya',     href: '/student/operativ-urologiya' },
  { Icon: FolderTree,    nom: 'Klassifikatsiyalar',     href: '/student/klassifikatsiyalar' },
  { Icon: Dna,           nom: 'Andrologiya',            href: '/student/andrologiya' },
  { Icon: Newspaper,     nom: 'Yangiliklar',            href: '/student/yangiliklar' },
]

export function TalabaSideMenu() {
  const [ochiq, setOchiq] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const ot = (href: string) => { setOchiq(false); router.push(href) }
  const faolMi = (href: string) =>
    href === '/student/dashboard' ? pathname === href : pathname.startsWith(href)

  const guruh = (sarlavha: string, bandlar: Band[]) => (
    <div style={{ padding: '6px 10px' }}>
      <p style={{ margin: '6px 8px', fontSize: '10.5px', fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {sarlavha}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {bandlar.map((b) => {
          const faol = faolMi(b.href)
          return (
            <button
              key={b.href}
              onClick={() => ot(b.href)}
              aria-current={faol ? 'page' : undefined}
              className="soft-press"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%', textAlign: 'left',
                border: 'none', cursor: 'pointer', font: 'inherit',
                background: faol ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'none',
                color: faol ? 'var(--accent)' : 'var(--ink)',
                fontSize: '14px', fontWeight: faol ? 800 : 600, padding: '12px', borderRadius: '11px',
              }}
            >
              <b.Icon size={18} strokeWidth={2} style={{ flexShrink: 0 }} /> {b.nom}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setOchiq(true)}
        aria-label="Menyu"
        className="btn-animated flex shrink-0 items-center rounded-lg border px-2.5 py-2"
        style={{ background: 'var(--surface-2)', color: 'var(--ink-soft)', borderColor: 'var(--line)' }}
      >
        <Menu size={18} strokeWidth={2.2} aria-hidden />
      </button>

      <SideDrawer ochiq={ochiq} onYopish={() => setOchiq(false)} taraf="left">
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '18px', fontWeight: 800, color: 'var(--ink)' }}>
            <img src="/urosfera-logo.png" alt="" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
          </span>
          <button
            onClick={() => setOchiq(false)}
            aria-label="Yopish"
            className="soft-press"
            style={{
              width: '34px', height: '34px', borderRadius: '999px', flexShrink: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--muted)',
            }}
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div style={{ padding: '8px 0 16px' }}>
          {guruh('Asosiy', ASOSIY)}
          {guruh("Bo'limlar", BOLIMLAR)}
        </div>
      </SideDrawer>
    </>
  )
}
