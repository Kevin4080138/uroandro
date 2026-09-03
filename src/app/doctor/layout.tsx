import { Home, Users, MessageSquare, CalendarClock } from 'lucide-react'
import { MeniscusNav, type NavBand } from '@/components/MeniscusNav'
import { Toaster } from '@/components/Toast'

// Shifokor bo'limi — talaba/bemordagidek suzuvchi meniscus pastki nav + Toast.
const SHIFOKOR_BANDLAR: NavBand[] = [
  { Icon: Home,          label: 'Bosh sahifa', href: '/doctor/dashboard' },
  { Icon: Users,         label: 'Bemorlar',    href: '/doctor/patients' },
  { Icon: MessageSquare, label: 'Murojaatlar', href: '/doctor/murojaatlar' },
  { Icon: CalendarClock, label: 'Navbatlar',   href: '/doctor/navbatlar' },
]

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Sahifa ildiziga pastki bo'shliq — suzuvchi nav kontentni to'smasin */}
      <div className="doctor-app">{children}</div>
      <MeniscusNav bandlar={SHIFOKOR_BANDLAR} />
      <Toaster />
      <style>{`
        .doctor-app > div { padding-bottom: calc(96px + env(safe-area-inset-bottom)) !important; }
      `}</style>
    </>
  )
}
