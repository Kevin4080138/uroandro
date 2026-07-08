'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Banner = {
  id: string
  sarlavha: string
  tavsif: string | null
  image_url: string | null
  link_href: string | null
  type: string
  rang: string
}

const TYPE_LABEL: Record<string, { label: string; bg: string }> = {
  yangilik:       { label: '📰 Yangilik',       bg: 'rgba(37,99,235,0.85)' },
  reklama:        { label: '📣 Reklama',         bg: 'rgba(124,58,237,0.85)' },
  elon:           { label: '📢 E\'lon',           bg: 'rgba(202,138,4,0.85)' },
  bildirishnoma:  { label: '🔔 Bildirishnoma',   bg: 'rgba(220,38,38,0.85)' },
}

const INTERVAL_MS = 4000

export function BannerCarousel({ role }: { role?: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [banners, setBanners] = useState<Banner[]>([])
  const [idx, setIdx] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const didDrag = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const load = async () => {
      let query = supabase
        .from('bannerlar')
        .select('id, sarlavha, tavsif, image_url, link_href, type, rang')
        .eq('faol', true)
        .order('sort_order', { ascending: true })
        .limit(5)
      if (role) query = query.or(`target_role.is.null,target_role.eq.${role}`)
      const { data } = await query
      if (data && data.length > 0) setBanners(data)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  useEffect(() => {
    if (banners.length <= 1) return
    timerRef.current = setInterval(() => {
      setIdx(i => (i + 1) % banners.length)
      setAnimKey(k => k + 1)
    }, INTERVAL_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [banners.length])

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIdx(i => (i + 1) % banners.length)
      setAnimKey(k => k + 1)
    }, INTERVAL_MS)
  }

  const goTo = (n: number) => { setIdx(n); setAnimKey(k => k + 1); resetTimer() }
  const prev = () => { setIdx(i => (i - 1 + banners.length) % banners.length); setAnimKey(k => k + 1); resetTimer() }
  const next = () => { setIdx(i => (i + 1) % banners.length); setAnimKey(k => k + 1); resetTimer() }

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; didDrag.current = false; setDragging(true) }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!dragging) return
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) { didDrag.current = true; diff > 0 ? next() : prev() }
    setDragging(false)
  }
  const onMouseDown = (e: React.MouseEvent) => { startX.current = e.clientX; didDrag.current = false; setDragging(true) }
  const onMouseUp = (e: React.MouseEvent) => {
    if (!dragging) return
    const diff = startX.current - e.clientX
    if (Math.abs(diff) > 40) { didDrag.current = true; diff > 0 ? next() : prev() }
    setDragging(false)
  }
  const handleClick = () => {
    if (!didDrag.current && banners[idx]?.link_href) router.push(banners[idx].link_href!)
  }

  if (banners.length === 0) return null

  const b = banners[idx]
  const tl = TYPE_LABEL[b.type] ?? TYPE_LABEL['yangilik']

  return (
    <div style={{ userSelect: 'none' }}>
      {/* Slide */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={handleClick}
        className="banner-slide"
        style={{
          position: 'relative', borderRadius: '18px', overflow: 'hidden',
          cursor: b.link_href ? 'pointer' : 'default',
          background: b.image_url
            ? 'var(--surface)'
            : `linear-gradient(135deg, ${b.rang ?? '#2563eb'}, ${b.rang ?? '#2563eb'}99)`,
        }}
      >
        {/* globals.css dagi bannerScaleIn keyframe, key o'zgarganda remount → animatsiya qayta boshlanadi */}
        <div key={animKey} className="banner-anim">
          {b.image_url && (
            <img
              src={b.image_url}
              alt={b.sarlavha}
              draggable={false}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          {!b.image_url && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${b.rang ?? '#2563eb'}, ${b.rang ?? '#2563eb'}99)`,
            }} />
          )}

          <div style={{
            position: 'absolute', inset: 0,
            background: b.image_url
              ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)'
              : 'transparent',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: '16px 18px',
          }}>
            <span style={{
              display: 'inline-block', background: tl.bg,
              backdropFilter: 'blur(4px)', borderRadius: '6px',
              padding: '2px 10px', fontSize: '11px', fontWeight: 700,
              color: 'white', marginBottom: '6px', alignSelf: 'flex-start',
            }}>
              {tl.label}
            </span>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'white', lineHeight: 1.3 }}>
              {b.sarlavha}
            </p>
            {b.tavsif && (
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
                {b.tavsif}
              </p>
            )}
          </div>
        </div>

        {banners.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev() }} style={{
              position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', color: 'white', fontSize: '14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
            }}>‹</button>
            <button onClick={(e) => { e.stopPropagation(); next() }} style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', color: 'white', fontSize: '14px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
            }}>›</button>
          </>
        )}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? '20px' : '7px', height: '7px',
                borderRadius: '4px', border: 'none', padding: 0, cursor: 'pointer',
                background: i === idx ? 'var(--accent)' : 'var(--line)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
