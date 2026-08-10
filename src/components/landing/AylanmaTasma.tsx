'use client'

import { useEffect, useRef } from 'react'

/**
 * Avtomatik aylanadigan VA qo'lda suriladigan tasma.
 *
 * Ilgari bu ScreenshotMarquee/ProductMarquee'da sof CSS animatsiya edi —
 * o'zi aylanardi, lekin foydalanuvchi qo'li bilan sura olmasdi. Endi
 * gorizontal scroll konteyneri: telefon barmoq bilan suradi (native),
 * kompyuter sichqoncha bilan tortadi, va hech kim tegmasa o'zi aylanadi.
 *
 * Uzilishsiz aylanish uchun bolalar ikki marta chiziladi; scrollLeft
 * yarmiga yetganda boshiga qaytariladi (ko'zga ko'rinmaydi).
 */
export function AylanmaTasma({
  children,
  tezlikPx = 42,        // sekundiga necha piksel
  teskari = false,      // o'ngdan chapga
  gap = 16,
}: {
  children: React.ReactNode
  tezlikPx?: number
  teskari?: boolean
  gap?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pauzaGacha = useRef(0)   // shu vaqtgacha auto to'xtaydi (foydalanuvchi tegsa)
  const hover = useRef(false)
  const rafRef = useRef(0)
  const drag = useRef({ aktiv: false, startX: 0, startScroll: 0, harakat: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let oxirgi = performance.now()

    // Teskari yo'nalishda boshlanishni o'rtaga qo'yamiz — chapga suriladi
    const ortaga = () => { el.scrollLeft = teskari ? el.scrollWidth / 2 : 1 }
    // Rasmlar yuklanmasidan scrollWidth 0 bo'lishi mumkin — biroz kutamiz
    requestAnimationFrame(ortaga)

    const yur = (now: number) => {
      rafRef.current = requestAnimationFrame(yur)
      const dt = Math.min((now - oxirgi) / 1000, 0.05)
      oxirgi = now
      const yarim = el.scrollWidth / 2
      if (yarim <= 1) return

      const tegilmadi = now >= pauzaGacha.current && !hover.current && !drag.current.aktiv
      if (!reduced && tegilmadi) {
        el.scrollLeft += (teskari ? -1 : 1) * tezlikPx * dt
      }

      // Uzilishsiz loop (ikki yo'nalishda ham)
      if (el.scrollLeft >= yarim) el.scrollLeft -= yarim
      else if (el.scrollLeft <= 0) el.scrollLeft += yarim
    }
    rafRef.current = requestAnimationFrame(yur)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tezlikPx, teskari])

  const pauza = () => { pauzaGacha.current = performance.now() + 2500 }

  // Sichqoncha bilan tortish (telefonda native touch-scroll ishlaydi)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') { pauza(); return }
    const el = ref.current
    if (!el) return
    drag.current = { aktiv: true, startX: e.clientX, startScroll: el.scrollLeft, harakat: false }
    el.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.aktiv) return
    const el = ref.current
    if (!el) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 3) drag.current.harakat = true
    el.scrollLeft = drag.current.startScroll - dx
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.aktiv) return
    drag.current.aktiv = false
    pauza()
    try { ref.current?.releasePointerCapture(e.pointerId) } catch {}
  }

  return (
    <div
      ref={ref}
      className="aylanma-tasma"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onMouseEnter={() => { hover.current = true }}
      onMouseLeave={() => { hover.current = false; drag.current.aktiv = false }}
      onWheel={pauza}
    >
      <div style={{ display: 'flex', gap, width: 'max-content', alignItems: 'flex-start' }}>
        {children}
        {children}
      </div>
    </div>
  )
}
