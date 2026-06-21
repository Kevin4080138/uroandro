'use client'

import { useParams, useRouter } from 'next/navigation'
import { PROTOKOLLAR } from '@/lib/protokollar'

export default function ProtokolDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const protokol = PROTOKOLLAR.find((p) => p.slug === slug)

  if (!protokol) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white' }}>Protokol topilmadi.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', color: 'white' }}>
      <div style={{
        backgroundColor: '#111118', borderBottom: '1px solid #1e1e2e',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
          Uro<span style={{ color: '#60a5fa' }}>Andro</span>
        </h1>
        <button onClick={() => router.push('/doctor/protokollar')} style={{
          backgroundColor: '#1e1e2e', color: '#9ca3af', border: '1px solid #2e2e3e',
          borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
        }}>
          ← Protokollar ro&apos;yxati
        </button>
      </div>

      <div style={{ padding: '32px', maxWidth: '760px', margin: '0 auto' }}>
        <span style={{ fontSize: '12px', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{protokol.toifa}</span>
        <h2 style={{ margin: '6px 0 8px 0', fontSize: '26px' }}>{protokol.nom}</h2>
        <p style={{ color: '#9ca3af', fontSize: '15px' }}>{protokol.qisqa}</p>

        <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '20px', marginTop: '20px' }}>
          <h3 style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', margin: '0 0 10px 0' }}>Ko&apos;rsatma</h3>
          <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6 }}>{protokol.korsatma}</p>
        </div>

        <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Tashxis bosqichlari</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {protokol.tashxis.map((t, i) => <li key={i} style={{ fontSize: '14.5px', lineHeight: 1.5 }}>{t}</li>)}
          </ul>
        </div>

        <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
          <h3 style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Davolash algoritmi</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {protokol.davolash.map((d, i) => <li key={i} style={{ fontSize: '14.5px', lineHeight: 1.5, color: '#4ade80' }}>{d}</li>)}
          </ul>
        </div>

        <div style={{ marginTop: '18px', backgroundColor: '#1f1505', border: '1px solid #6b4a14', borderRadius: '10px', padding: '13px 15px', fontSize: '12.5px', color: '#fbbf24' }}>
          Manba: {protokol.manba}. Bu qisqacha yo&apos;naltiruvchi xulosa — yakuniy klinik qaror to&apos;liq rasmiy qo&apos;llanma va shifokorning shaxsiy baholashiga asoslanishi kerak.
        </div>
      </div>
    </div>
  )
}
