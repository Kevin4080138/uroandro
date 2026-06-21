import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Urosfera Platform',
  description: 'Urologiya va Andrologiya platformasi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}