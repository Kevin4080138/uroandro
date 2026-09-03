import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { PwaRegistrar } from '@/components/PwaRegistrar'
import { TelegramAutoLogin } from '@/components/TelegramAutoLogin'
import { SAYT_URL } from '@/lib/saytUrl'

// Manrope — Elevate referens dizayni shrifti. Butun ilovada shu ishlatiladi.
// O'zgaruvchi nomlari ataylab eski (--font-inter/--font-display) — mavjud inline
// havolalar buzilmasligi uchun; ikkalasi ham endi Manrope'ni ko'rsatadi.
const manrope = Manrope({ subsets: ['latin'], variable: '--font-inter' })
const manropeDisplay = Manrope({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' })

export const metadata: Metadata = {
  metadataBase: new URL(SAYT_URL),
  title: {
    default: "Urosfera — urologiya va andrologiya platformasi",
    template: '%s',
  },
  description:
    "Urologiya va andrologiya bo'yicha o'zbek tilidagi ta'lim platformasi: talabalar uchun " +
    "darslar va testlar, shifokorlar uchun kasbiy vositalar, bemorlar uchun konsultatsiya.",
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Urosfera', statusBarStyle: 'default' },
  icons: { icon: '/icon-192.png', apple: '/apple-touch-icon.png' },
  openGraph: {
    siteName: 'Urosfera',
    locale: 'uz_UZ',
    type: 'website',
    title: "Urosfera — urologiya va andrologiya platformasi",
    description: "Urologiya — o'zbek tilida, bir platformada.",
    images: [{ url: '/og.png', width: 1672, height: 941, alt: 'Urosfera platformasi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Urosfera — urologiya va andrologiya platformasi",
    description: "Urologiya — o'zbek tilida, bir platformada.",
    images: ['/og.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#2563EB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" data-theme="dark" className={`${manrope.variable} ${manropeDisplay.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <TelegramAutoLogin />
        <PwaRegistrar />
      </body>
    </html>
  )
}
