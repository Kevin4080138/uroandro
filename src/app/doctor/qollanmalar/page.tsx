'use client'

import { AppShell } from '@/components/AppShell'
import { QOLLANMALAR } from '@/lib/qollanmalar'

export default function QollanmalarPage() {
  return (
    <AppShell title="Qo'llanmalar">
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
          Rasmiy xalqaro urologiya/andrologiya tashkilotlarining klinik qo&apos;llanmalariga havolalar.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {QOLLANMALAR.map((q) => (
            <a
              key={q.nom}
              href={q.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover"
              style={{
                display: 'block', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                padding: '18px 20px', textDecoration: 'none', color: 'var(--ink)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--accent)' }}>{q.nom}</h3>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>↗</span>
              </div>
              <p style={{ margin: '4px 0 6px 0', fontSize: '12px', color: 'var(--accent-2)' }}>{q.tashkilot}</p>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>{q.tavsif}</p>
            </a>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
