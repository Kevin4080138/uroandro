'use client'

import { useRouter } from 'next/navigation'

const KALKULYATORLAR = [
  { href: '/doctor/calculators/varikotsele', icon: '🧮', title: 'Varikotsele solishtirish', desc: "Laparoskopik, Marmar, Skleroterapiya, Palomo, Ivanissevich usullarini qiyosiy tahlil qilish", color: '#7c3aed', faol: true },
  { href: '#', icon: '📊', title: 'IPSS kalkulyatori', desc: "Prostata simptomlari indeksini hisoblash", color: '#2563eb', faol: false },
  { href: '#', icon: '🩸', title: 'PSA kalkulyatori', desc: "Yoshga moslashgan PSA me'zonlari", color: '#059669', faol: false },
  { href: '#', icon: '💧', title: 'Uroflowmetriya baholash', desc: "Siydik oqimi tezligi natijalarini izohlash", color: '#d97706', faol: false },
]

export default function CalculatorsHubPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', color: 'white' }}>
      <div style={{
        backgroundColor: '#111118', borderBottom: '1px solid #1e1e2e',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
          Uro<span style={{ color: '#60a5fa' }}>sfera</span>
        </h1>
        <button onClick={() => router.push('/doctor/dashboard')} style={{
          backgroundColor: '#1e1e2e', color: '#9ca3af', border: '1px solid #2e2e3e',
          borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
        }}>
          ← Bosh sahifa
        </button>
      </div>

      <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Kalkulatorlar</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px 0' }}>
          Klinik qaror qabul qilishda yordam beradigan hisoblash vositalari.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {KALKULYATORLAR.map((k) => (
            <div
              key={k.title}
              onClick={() => k.faol && router.push(k.href)}
              style={{
                backgroundColor: '#111118',
                border: '1px solid #1e1e2e',
                borderRadius: '12px',
                padding: '24px',
                cursor: k.faol ? 'pointer' : 'default',
                opacity: k.faol ? 1 : 0.5,
                position: 'relative',
              }}
            >
              {!k.faol && (
                <span style={{
                  position: 'absolute', top: '14px', right: '14px', fontSize: '11px',
                  color: '#6b7280', border: '1px solid #2e2e3e', borderRadius: '6px', padding: '2px 8px',
                }}>
                  tez kunda
                </span>
              )}
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{k.icon}</div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{k.title}</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{k.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
