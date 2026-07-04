'use client'

import { useEffect } from 'react'

// Service worker'ni har yuklamada ro'yxatga oladi — PWA o'rnatilishi va offline kesh uchun.
export function PwaRegistrar() {
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return null
}
