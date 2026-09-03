import { Home, MessageSquare, CalendarClock, Pill } from 'lucide-react'
import { MeniscusNav, type NavBand } from '@/components/MeniscusNav'
import { Toaster } from '@/components/Toast'

// Bemor bo'limi — talabadagidek suzuvchi meniscus pastki nav + Toast tizimi.
const BEMOR_BANDLAR: NavBand[] = [
  { Icon: Home,          label: 'Bosh sahifa',   href: '/patient/dashboard' },
  { Icon: MessageSquare, label: 'Murojaatlarim', href: '/patient/murojaatlarim' },
  { Icon: CalendarClock, label: 'Navbat',        href: '/patient/navbat' },
  { Icon: Pill,          label: 'Dorilarim',     href: '/patient/dorilarim' },
]

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Sahifa ildizi (min-height:100vh div) ichiga pastki bo'shliq beramiz —
          suzuvchi nav kontentni to'smasin. */}
      <div className="bemor-app">{children}</div>
      <MeniscusNav bandlar={BEMOR_BANDLAR} />
      <Toaster />
      <style>{`
        .bemor-app > div { padding-bottom: calc(96px + env(safe-area-inset-bottom)) !important; }
      `}</style>
    </>
  )
}
