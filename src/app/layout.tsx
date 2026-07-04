import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { PwaRegistrar } from '@/components/PwaRegistrar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'Urosfera Platform',
  description: 'Urologiya va Andrologiya platformasi',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Urosfera', statusBarStyle: 'default' },
  icons: { icon: '/icon-192.png', apple: '/icon-192.png' },
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
        <ThemeProvider>{children}</ThemeProvider>
        <PwaRegistrar />
      </body>
    </html>
  )
}
