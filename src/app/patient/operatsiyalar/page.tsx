'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { OPERATSIYALAR } from '@/lib/operatsiyalar'

export default function OperatsiyalarPage() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>🏥 Operatsiyalar haqida</h2>
        <p className="rise" style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '13.5px', animationDelay: '.05s' }}>
          Operatsiya nima uchun qilinadi, qancha davom etadi, taxminan qancha turadi va qancha vaqtda tuzalasiz — oddiy tilda.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {OPERATSIYALAR.map((op, i) => (
            <div
              key={op.slug}
              onClick={() => router.push(`/patient/operatsiyalar/${op.slug}`)}
              className="rise lift"
              style={{
                animationDelay: `${Math.min(i * 0.08, 0.4)}s`,
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
                padding: '20px 22px', cursor: 'pointer', display: 'flex', gap: '16px', alignItems: 'center',
              }}
            >
              <div style={{
                width: '64px', height: '64px', borderRadius: '14px', flexShrink: 0,
                background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
              }}>
                {op.belgi}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: '10.5px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em',
                }}>
                  {op.organ}
                </span>
                <h3 style={{ margin: '2px 0 6px', fontSize: '16px', fontWeight: 700 }}>{op.nom}</h3>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{op.qisqa}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '11.5px', color: 'var(--muted)' }}>
                  <span>⏱ {op.davomiyligi}</span>
                  <span>💳 {op.narxOraliq}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rise" style={{
          marginTop: '24px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
          padding: '16px 20px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          ℹ️ Bu ma&apos;lumot faqat tushuntirish uchun. Aniq tashxis, operatsiya zarurati va yakuniy narx shifokor ko&apos;rigidan keyin
          belgilanadi. Narxlar Farg&apos;ona bo&apos;yicha taxminiy oraliq — klinikaga qarab farq qiladi.
        </div>
      </div>
    </div>
  )
}
