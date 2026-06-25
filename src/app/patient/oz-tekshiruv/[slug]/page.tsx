'use client'

import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { yoriqnomaTop } from '@/lib/ozTekshiruv'
import { OzTekshiruvIkon } from '@/components/OzTekshiruvIkon'

export default function YoriqnomaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const y = yoriqnomaTop(slug)

  if (!y) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/patient/oz-tekshiruv" backLabel="Yo'riqnomalar" />
        <div className="mx-auto max-w-[700px] px-8 py-12">
          <p>Yo&apos;riqnoma topilmadi.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/oz-tekshiruv" backLabel="Yo'riqnomalar" />
      <div className="mx-auto max-w-[700px] px-8 py-8">
        <div className="rise" style={{
          background: 'linear-gradient(135deg, #2563eb, #0891b2)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '24px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '.04em' }}>{y.organ}</span>
          <h1 style={{ margin: '6px 0 0', fontSize: '21px', fontWeight: 800, lineHeight: 1.3 }}>{y.sarlavha}</h1>
          <p style={{ margin: '10px 0 0', fontSize: '13.5px', opacity: 0.92 }}>{y.qisqa}</p>
          <p style={{ margin: '8px 0 0', fontSize: '12.5px', opacity: 0.85 }}>🔁 {y.davriylik}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {y.bosqichlar.map((b, i) => (
            <div key={i} className="rise" style={{
              animationDelay: `${Math.min(i * 0.07, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
              padding: '20px 22px', display: 'flex', gap: '18px', alignItems: 'flex-start',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '14px', flexShrink: 0,
                background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <OzTekshiruvIkon tur={b.svg} size={40} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700 }}>{b.sarlavha}</h3>
                <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.65, color: 'var(--ink-soft)' }}>{b.matn}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{
          marginTop: '20px', background: 'var(--surface)', border: '2px solid #dc262633', borderRadius: '16px',
          padding: '20px 22px',
        }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: '#dc2626' }}>⚠ Qachon shifokorga murojaat qilish kerak</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {y.ogohlantiruvchiBelgilar.map((belgi) => (
              <li key={belgi} style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{belgi}</li>
            ))}
          </ul>
        </div>

        <p style={{ margin: '16px 0 0', fontSize: '11.5px', color: 'var(--muted)' }}>Manba: {y.manba}</p>

        <button
          onClick={() => router.push('/patient/murojaat')}
          className="btn-animated soft-press"
          style={{
            width: '100%', marginTop: '20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
            padding: '16px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
          }}
        >
          Shifokorga murojaat yuborish →
        </button>
      </div>
    </div>
  )
}
