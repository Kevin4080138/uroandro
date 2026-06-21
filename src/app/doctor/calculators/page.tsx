'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'

const KALKULYATORLAR = [
  { href: '/doctor/calculators/varikotsele', icon: '🧮', title: 'Varikotsele solishtirish', desc: "Laparoskopik, Marmar, Skleroterapiya, Palomo, Ivanissevich usullarini qiyosiy tahlil qilish", faol: true },
  { href: '#', icon: '📊', title: 'IPSS kalkulyatori', desc: "Prostata simptomlari indeksini hisoblash", faol: false },
  { href: '#', icon: '🩸', title: 'PSA kalkulyatori', desc: "Yoshga moslashgan PSA me'zonlari", faol: false },
  { href: '#', icon: '💧', title: 'Uroflowmetriya baholash', desc: "Siydik oqimi tezligi natijalarini izohlash", faol: false },
]

export default function CalculatorsHubPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header />

      <div className="fade-in mx-auto max-w-[900px] px-8 py-8">
        <h2 className="mb-1 text-2xl font-bold">Kalkulatorlar</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
          Klinik qaror qabul qilishda yordam beradigan hisoblash vositalari.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {KALKULYATORLAR.map((k) => (
            <div
              key={k.title}
              onClick={() => k.faol && router.push(k.href)}
              className={k.faol ? 'card-hover' : ''}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '24px',
                cursor: k.faol ? 'pointer' : 'default',
                opacity: k.faol ? 1 : 0.55,
                position: 'relative',
              }}
            >
              {!k.faol && (
                <span style={{
                  position: 'absolute', top: '14px', right: '14px', fontSize: '11px',
                  color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '6px', padding: '2px 8px',
                }}>
                  tez kunda
                </span>
              )}
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{k.icon}</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{k.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>{k.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
