'use client'

import { useRouter } from 'next/navigation'
import { QOLLANMALAR } from '@/lib/qollanmalar'

export default function QollanmalarPage() {
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

      <div style={{ padding: '32px', maxWidth: '760px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Qo&apos;llanmalar</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px 0' }}>
          Rasmiy xalqaro urologiya/andrologiya tashkilotlarining klinik qo&apos;llanmalariga havolalar.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {QOLLANMALAR.map((q) => (
            <a key={q.nom} href={q.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'block', backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px',
              padding: '18px 20px', textDecoration: 'none', color: 'white',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#60a5fa' }}>{q.nom}</h3>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>↗</span>
              </div>
              <p style={{ margin: '4px 0 6px 0', fontSize: '12px', color: '#7c3aed' }}>{q.tashkilot}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>{q.tavsif}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
