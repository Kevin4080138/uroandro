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

const CARD_W = 280   // har bir karta kengligi (px)
const CARD_GAP = 14  // oraliq

export function DoctorBannerStrip({ role }: { role?: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [banners, setBanners] = useState<Banner[]>([])
  const trackRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

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

  if (banners.length === 0) return null

  // Animatsiya uchun duplikat (uzluksiz loop)
  const loop = [...banners, ...banners]
  const totalW = banners.length * (CARD_W + CARD_GAP)

  return (
    <>
      <style>{`
        @keyframes bannerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-${totalW}px); }
        }
        .doc-strip-track {
          display: flex;
          gap: ${CARD_GAP}px;
          animation: bannerScroll ${banners.length * 3.5}s linear infinite;
          width: max-content;
        }
        .doc-strip-track.paused { animation-play-state: paused; }
        .doc-strip-wrap {
          overflow: hidden;
          cursor: pointer;
        }
        /* Mobilda oddiy carousel ko'rinadi */
        .doc-strip-desktop { display: block; }
        .doc-strip-mobile  { display: none; }
        @media (max-width: 768px) {
          .doc-strip-desktop { display: none; }
          .doc-strip-mobile  { display: block; }
        }
      `}</style>

      {/* Desktop: gorizontal strip */}
      <div className="doc-strip-desktop" style={{ marginBottom: '28px' }}>
        <div
          className="doc-strip-wrap"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{ borderRadius: '16px' }}
        >
          <div
            ref={trackRef}
            className={`doc-strip-track${paused ? ' paused' : ''}`}
          >
            {loop.map((b, i) => {
              const tl = TYPE_LABEL[b.type] ?? TYPE_LABEL['yangilik']
              return (
                <div
                  key={`${b.id}-${i}`}
                  onClick={() => b.link_href && router.push(b.link_href)}
                  style={{
                    width: `${CARD_W}px`,
                    height: '170px',
                    flexShrink: 0,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: b.link_href ? 'pointer' : 'default',
                    background: b.image_url
                      ? 'var(--surface)'
                      : `linear-gradient(135deg, ${b.rang ?? '#2563eb'}, ${b.rang ?? '#2563eb'}99)`,
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
                    {b.tavsif && (
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.3,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                        {b.tavsif}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile: oddiy carousel */}
      <div className="doc-strip-mobile" style={{ marginBottom: '24px' }}>
        <BannerCarousel role={role} />
      </div>
    </>
  )
}
