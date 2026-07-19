import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { ThemeProvider } from '@/components/ThemeProvider'
import { PwaRegistrar } from '@/components/PwaRegistrar'
import { TelegramAutoLogin } from '@/components/TelegramAutoLogin'
import { SAYT_URL } from '@/lib/saytUrl'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' })

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
  openGraph: { siteName: 'Urosfera', locale: 'uz_UZ', type: 'website' },
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
    <html lang="uz" data-theme="dark" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        {/* Telegram Mini App SDK — window.Telegram.WebApp ni ta'minlaydi */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <ThemeProvider>{children}</ThemeProvider>
        <TelegramAutoLogin />
        <PwaRegistrar />
      </body>
    </html>
  )
}
