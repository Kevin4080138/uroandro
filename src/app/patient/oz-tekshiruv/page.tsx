'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { OZ_TEKSHIRUV_YORIQNOMALARI } from '@/lib/ozTekshiruv'
import { OzTekshiruvIkon } from '@/components/OzTekshiruvIkon'
import { Activity, Repeat } from 'lucide-react'

const KALKULYATOR_IKON: Record<string, 'kalkulyator' | 'yurak' | 'vaqt'> = {
  'erektil-disfunksiya': 'kalkulyator',
  'tez-boshanish': 'vaqt',
  'jinsiy-zaiflik': 'yurak',
}

export default function OzTekshiruvPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '9px' }}><Activity size={24} strokeWidth={2} /> O&apos;z-o&apos;zini tekshirish</h2>
        <p className="rise" style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Erta aniqlash uchun uyda bajarishingiz mumkin bo&apos;lgan yo&apos;riqnomalar va kalkulyatorlar.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {OZ_TEKSHIRUV_YORIQNOMALARI.map((y, i) => {
            const ikon = y.tur === 'kalkulyator'
              ? (KALKULYATOR_IKON[y.slug] ?? 'kalkulyator')
              : y.bosqichlar[0].svg
            return (
              <div
                key={y.slug}
                onClick={() => router.push(`/patient/oz-tekshiruv/${y.slug}`)}
                className="rise lift"
                style={{
                  animationDelay: `${Math.min(i * 0.08, 0.4)}s`,
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                  padding: '20px 22px', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center',
                }}
              >
                <div style={{
                  width: '64px', height: '64px', borderRadius: '14px', flexShrink: 0,
                  background: y.tur === 'kalkulyator' ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <OzTekshiruvIkon tur={ikon} size={40} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '10.5px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em',
                    }}>
                      {y.organ}
                    </span>
                    {y.tur === 'kalkulyator' && (
                      <span style={{
                        fontSize: '9.5px', background: 'var(--accent)', color: 'white',
                        borderRadius: '6px', padding: '1px 7px', fontWeight: 700, letterSpacing: '.03em',
                      }}>
                        KALKULYATOR
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: '2px 0 6px', fontSize: '16px', fontWeight: 700 }}>{y.sarlavha}</h3>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{y.qisqa}</p>
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Repeat size={12} strokeWidth={2} /> {y.davriylik}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rise" style={{
          marginTop: '24px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
          padding: '16px 20px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          ℹ️ Bu yo&apos;riqnomalar va kalkulyatorlar tashxis qo&apos;yish vositasi emas — ular faqat o&apos;zgarishlarni o&apos;z vaqtida sezish va shifokorga
          murojaat qilish zarurligini aniqlashga yordam beradi.
        </div>
      </div>
    </div>
  )
}
