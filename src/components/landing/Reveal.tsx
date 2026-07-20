'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll bilan ochiladigan o'ram.
 *
 * Bo'lim ko'rinish maydoniga kirganda `.korindi` sinfini qo'shadi —
 * qolgan ishni globals.css dagi `.reveal` o'tishi bajaradi. Bir marta
 * ishlaydi (`disconnect`), ya'ni orqaga scroll qilganda qayta yonib-o'chmaydi.
 */
export function Reveal({
  children,
  kechikish = 0,
}: {
  children: React.ReactNode
  /** Qo'shni elementlar ketma-ket ochilishi uchun kechikish (ms) */
  kechikish?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [korindi, setKorindi] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // IntersectionObserver bo'lmasa (juda eski brauzer) — darrov ko'rsatiladi
    if (typeof IntersectionObserver === 'undefined') {
      setKorindi(true)
      return
    }

    const kuzatuvchi = new IntersectionObserver(
      ([yozuv]) => {
        if (yozuv.isIntersecting) {
          setKorindi(true)
          kuzatuvchi.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    )
    kuzatuvchi.observe(el)
    return () => kuzatuvchi.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal${korindi ? ' korindi' : ''}`}
      style={kechikish ? { transitionDelay: `${kechikish}ms` } : undefined}
    >
      {children}
    </div>
  )
}
