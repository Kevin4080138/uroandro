'use client'

import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { operatsiyaTop, POSTOP_JADVALI } from '@/lib/operatsiyalar'

function InfoQator({ belgi, nom, qiymat }: { belgi: string; nom: string; qiymat: string }) {
  return (
    <div style={{
      display: 'flex', gap: '12px', alignItems: 'flex-start',
      padding: '12px 14px', background: 'var(--surface-2)', borderRadius: '12px',
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>{belgi}</span>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: '2px' }}>{nom}</div>
        <div style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.45 }}>{qiymat}</div>
      </div>
    </div>
  )
}

function Bolim({ sarlavha, children }: { sarlavha: string; children: React.ReactNode }) {
  return (
    <div className="rise" style={{ marginTop: '24px' }}>
      <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 800 }}>{sarlavha}</h3>
      {children}
    </div>
  )
}

export default function OperatsiyaTafsilotPage() {
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>()
  const op = operatsiyaTop(slug)

  if (!op) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
        <Header backHref="/patient/operatsiyalar" backLabel="Operatsiyalar" />
        <div className="mx-auto max-w-[760px] px-8 py-8">
          <p style={{ color: 'var(--muted)' }}>Operatsiya topilmadi.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/patient/operatsiyalar" backLabel="Operatsiyalar" />
      <div className="mx-auto max-w-[760px] px-8 py-8">
        {/* Sarlavha */}
        <div className="rise" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px', flexShrink: 0,
            background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px',
          }}>
            {op.belgi}
          </div>
          <div>
            <span style={{ fontSize: '10.5px', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{op.organ}</span>
            <h2 style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: 800, lineHeight: 1.25 }}>{op.nom}</h2>
          </div>
        </div>
        <p className="rise" style={{ margin: '0 0 20px', color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.55, animationDelay: '.05s' }}>{op.qisqa}</p>

        {/* Nima uchun */}
        <div className="rise" style={{
          background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
          padding: '16px 20px', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6,
        }}>
          <strong style={{ display: 'block', marginBottom: '6px' }}>Nega qilinadi?</strong>
          {op.nimaUchun}
        </div>

        {/* Asosiy raqamlar */}
        <div className="rise" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '16px' }}>
          <InfoQator belgi="⏱" nom="Davomiyligi" qiymat={op.davomiyligi} />
          <InfoQator belgi="😴" nom="Og'riqsizlantirish" qiymat={op.anesteziya} />
          <InfoQator belgi="🛏" nom="Klinikada yotish" qiymat={op.yotish} />
          <InfoQator belgi="💳" nom="Taxminiy narx" qiymat={op.narxOraliq} />
          <InfoQator belgi="🌿" nom="Tiklanish" qiymat={op.tiklanish} />
        </div>

        {/* Tayyorgarlik */}
        <Bolim sarlavha="🧾 Operatsiyaga tayyorgarlik">
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {op.tayyorgarlik.map((t, i) => (
              <li key={i} style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{t}</li>
            ))}
          </ul>
        </Bolim>

        {/* Qanday o'tadi */}
        <Bolim sarlavha="🔧 Qanday o'tadi">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {op.jarayon.map((j, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--accent)', color: 'white', fontSize: '13px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{j.sarlavha}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{j.matn}</div>
                </div>
              </div>
            ))}
          </div>
        </Bolim>

        {/* Keyin */}
        <Bolim sarlavha="🏠 Operatsiyadan keyin">
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {op.keyin.map((t, i) => (
              <li key={i} style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{t}</li>
            ))}
          </ul>
        </Bolim>

        {/* Kuzatuv jadvali */}
        <Bolim sarlavha="🗓 Operatsiyadan keyingi kuzatuv">
          <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            Shifokor operatsiyani biriktirgach, quyidagi bosqichlarda ilova sizga eslatma yuboradi:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {POSTOP_JADVALI.map((b) => (
              <span key={b.kalit} style={{
                fontSize: '12px', fontWeight: 700, color: 'var(--accent)',
                background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                borderRadius: '999px', padding: '5px 12px',
              }}>{b.nom}</span>
            ))}
          </div>
        </Bolim>

        {/* Ogohlantirish */}
        <Bolim sarlavha="🚨 Qachon zudlik bilan shifokorga">
          <div style={{
            background: 'color-mix(in srgb, var(--danger) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--danger) 35%, transparent)',
            borderRadius: '14px', padding: '14px 18px',
          }}>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {op.ogohlantiruvchiBelgilar.map((t, i) => (
                <li key={i} style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.5 }}>{t}</li>
              ))}
            </ul>
          </div>
        </Bolim>

        {/* CTA */}
        <div className="rise" style={{ marginTop: '28px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/patient/navbat')}
            style={{
              background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px',
              padding: '13px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            🗓 Shifokorga yozilish
          </button>
          <button
            onClick={() => router.push('/patient/murojaat')}
            style={{
              background: 'var(--surface)', color: 'var(--ink)', border: '1.5px solid var(--accent)', borderRadius: '12px',
              padding: '13px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            📨 Savol berish
          </button>
        </div>

        <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
          ℹ️ Narxlar Farg&apos;ona bo&apos;yicha taxminiy oraliq va klinika, anesteziya turi hamda holat murakkabligiga qarab farq qiladi.
          Yakuniy qaror shifokor ko&apos;rigidan keyin belgilanadi.
        </p>
      </div>
    </div>
  )
}
