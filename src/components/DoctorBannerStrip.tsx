'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { BannerCarousel } from './BannerCarousel'

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
  yangilik:      { label: '📰 Yangilik',      bg: 'rgba(37,99,235,0.85)' },
  reklama:       { label: '📣 Reklama',        bg: 'rgba(124,58,237,0.85)' },
  elon:          { label: "📢 E'lon",          bg: 'rgba(202,138,4,0.85)' },
  bildirishnoma: { label: '🔔 Bildirishnoma',  bg: 'rgba(220,38,38,0.85)' },
}

const VISIBLE = 4
const INTERVAL_MS = 6000

export function DoctorBannerStrip({ role }: { role?: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [banners, setBanners] = useState<Banner[]>([])
  const [offset, setOffset] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const load = async () => {
      let q = supabase
        .from('bannerlar')
        .select('id, sarlavha, tavsif, image_url, link_href, type, rang')
        .eq('faol', true)
        .order('sort_order', { ascending: true })
        .limit(10)
      if (role) q = q.or(`target_role.is.null,target_role.eq.${role}`)
      const { data } = await q
      if (data && data.length > 0) setBanners(data)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])

  useEffect(() => {
    if (banners.length <= VISIBLE) return
    timerRef.current = setInterval(() => {
      setOffset(o => (o + 1) % banners.length)
    }, INTERVAL_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [banners.length])

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (banners.length <= VISIBLE) return
    timerRef.current = setInterval(() => {
      setOffset(o => (o + 1) % banners.length)
    }, INTERVAL_MS)
  }

  const prev = () => { setOffset(o => (o - 1 + banners.length) % banners.length); resetTimer() }
  const next = () => { setOffset(o => (o + 1) % banners.length); resetTimer() }

  if (banners.length === 0) return null

  // 4 ta ko'rinadigan banner (offset dan boshlab, loop bilan)
  const visible = Array.from({ length: VISIBLE }, (_, i) => banners[(offset + i) % banners.length])

  return (
    <>
      <style>{`
        .doc-strip-desktop { display: block; }
        .doc-strip-mobile  { display: none; }
        @media (max-width: 768px) {
          .doc-strip-desktop { display: none; }
          .doc-strip-mobile  { display: block; }
        }
        .doc-card {
          flex: 1;
          min-width: 0;
          height: 170px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          animation: bannerScaleIn 0.45s cubic-bezier(0.22,0.61,0.36,1) both;
        }
      `}</style>

      {/* Desktop */}
      <div className="doc-strip-desktop" style={{ marginBottom: '28px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            {visible.map((b, i) => {
              const tl = TYPE_LABEL[b.type] ?? TYPE_LABEL['yangilik']
              return (
                <div
                  key={`${b.id}-${offset}-${i}`}
                  className="doc-card"
                  onClick={() => b.link_href && router.push(b.link_href)}
                  style={{
                    animationDelay: `${i * 0.06}s`,
                    background: b.image_url
                      ? 'var(--surface)'
                      : `linear-gradient(135deg, ${b.rang ?? '#2563eb'}, ${b.rang ?? '#2563eb'}99)`,
                    cursor: b.link_href ? 'pointer' : 'default',
                  }}
                >
                  {b.image_url && (
                    <img
                      src={b.image_url}
                      alt={b.sarlavha}
                      draggable={false}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    padding: '12px 14px',
                  }}>
                    <span style={{
                      display: 'inline-block', background: tl.bg,
                      backdropFilter: 'blur(4px)', borderRadius: '5px',
                      padding: '1px 8px', fontSize: '10px', fontWeight: 700,
                      color: 'white', marginBottom: '4px', alignSelf: 'flex-start',
                    }}>{tl.label}</span>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: 'white', lineHeight: 1.3 }}>
                      {b.sarlavha}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* O'q tugmalar */}
          {banners.length > VISIBLE && (
            <>
              <button onClick={prev} style={{
                position: 'absolute', left: '-16px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '50%',
                width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ink)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 2,
              }}>‹</button>
              <button onClick={next} style={{
                position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '50%',
                width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ink)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 2,
              }}>›</button>
            </>
          )}
        </div>

        {/* Dots */}
        {banners.length > VISIBLE && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => { setOffset(i); resetTimer() }}
                style={{
                  width: i === offset ? '20px' : '7px', height: '7px',
                  borderRadius: '4px', border: 'none', padding: 0, cursor: 'pointer',
                  background: i === offset ? 'var(--accent)' : 'var(--line)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="doc-strip-mobile" style={{ marginBottom: '24px' }}>
        <BannerCarousel role={role} />
      </div>
    </>
  )
}
