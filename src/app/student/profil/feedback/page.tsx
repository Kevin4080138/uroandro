'use client'

import { Header } from '@/components/Header'

export default function FeedbackPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/profil" backLabel="Profil" />
      <div className="mx-auto max-w-[600px] px-5 py-8 sm:px-8">
        <h2 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 800 }}>💬 Izoh (feedback)</h2>
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px',
          color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.7,
        }}>
          <p style={{ margin: 0 }}>Fikr-mulohaza yuborish shakli tez orada qo&apos;shiladi.</p>
        </div>
      </div>
    </div>
  )
}
