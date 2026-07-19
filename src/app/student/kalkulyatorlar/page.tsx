'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { KALKULYATORLAR, KALK_KATEGORIYALARI } from '@/lib/kalkulyatorlar'

// Talaba uchun kalkulyatorlar shifokornikidan boshqacha ko'rsatiladi: shifokorga
// vosita kerak, talabaga esa uning MA'NOSI — shkala nimani o'lchaydi va qaysi
// chegara qiymat klinik qarorni o'zgartiradi. Shu sabab har kartada `oquv`
// izohi ochiq turadi, kalkulyatorning o'zi esa bir bosishda ochiladi.

export default function StudentKalkulyatorlarPage() {
  const router = useRouter()
  const [filtr, setFiltr] = useState<string>('Hammasi')
  const [qidiruv, setQidiruv] = useState('')

  const royxat = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    return KALKULYATORLAR.filter((k) => {
      if (filtr !== 'Hammasi' && k.kategoriya !== filtr) return false
      if (!q) return true
      return k.title.toLowerCase().includes(q) || k.desc.toLowerCase().includes(q)
    })
  }, [filtr, qidiruv])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px' }}>
        <div className="rise" style={{ marginBottom: '18px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>🧮 Kalkulyatorlar</h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}>
            Urologiyada ishlatiladigan {KALKULYATORLAR.length} ta xalqaro shkala va formula.
            Har birida — nimani o&apos;lchashi va qaysi chegara qiymat qarorni o&apos;zgartirishi.
          </p>
        </div>

        <input
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Qidirish — masalan, IPSS yoki PSA"
          style={{
            width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
            border: '1px solid var(--line)', borderRadius: '12px', padding: '11px 14px',
            fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px',
          }}
        />

        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {KALK_KATEGORIYALARI.map((kat) => {
            const faol = filtr === kat
            return (
              <button
                key={kat}
                onClick={() => setFiltr(kat)}
                className="soft-press"
                style={{
                  border: `1px solid ${faol ? 'var(--accent)' : 'var(--line)'}`,
                  background: faol ? 'var(--accent-soft)' : 'var(--surface)',
                  color: faol ? 'var(--accent)' : 'var(--muted)',
                  borderRadius: '999px', padding: '6px 13px', fontSize: '12.5px',
                  fontWeight: faol ? 700 : 500, cursor: 'pointer',
                }}
              >
                {kat}
              </button>
            )
          })}
        </div>

        {royxat.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', textAlign: 'center', padding: '30px 0' }}>
            Bunday kalkulyator topilmadi.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {royxat.map((k) => (
              <div
                key={k.slug}
                onClick={() => k.faol && router.push(`/doctor/calculators/${k.slug}`)}
                className="soft-press"
                style={{
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                  overflow: 'hidden', cursor: k.faol ? 'pointer' : 'default', opacity: k.faol ? 1 : 0.5,
                }}
              >
                <div style={{ height: '3px', background: k.gradient }} />
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '19px' }}>{k.icon}</span>
                    <strong style={{ fontSize: '14.5px', flex: 1 }}>{k.title}</strong>
                    <span style={{
                      fontSize: '10.5px', color: 'var(--muted)', border: '1px solid var(--line)',
                      borderRadius: '999px', padding: '2px 8px', whiteSpace: 'nowrap',
                    }}>
                      {k.kategoriya}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.55 }}>
                    {k.desc}
                  </p>
                  {k.oquv && (
                    <p style={{
                      margin: 0, fontSize: '12.5px', lineHeight: 1.6, color: 'var(--ink)',
                      background: 'var(--surface-2)', borderRadius: '9px', padding: '9px 11px',
                      borderLeft: '3px solid var(--accent)',
                    }}>
                      <strong style={{ fontSize: '11px', color: 'var(--accent)', display: 'block', marginBottom: '2px' }}>
                        NIMA O&apos;RGANASIZ
                      </strong>
                      {k.oquv}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
