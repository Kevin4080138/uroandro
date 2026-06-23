'use client'

import { useEffect, useRef, useState } from 'react'

export function CountUp({ value, durationMs = 900 }: { value: number; durationMs?: number }) {
  const [display, setDisplay] = useState(0)
  const start = useRef<number | null>(null)

  useEffect(() => {
    start.current = null
    let raf = 0
    const tick = (t: number) => {
      if (start.current === null) start.current = t
      const progress = Math.min((t - start.current) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, durationMs])

  return <>{display}</>
}
