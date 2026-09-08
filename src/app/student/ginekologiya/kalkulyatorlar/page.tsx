'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import {
  GINEKOLOGIYA_KALKULYATORLARI,
  GIN_KALK_KATEGORIYALARI,
} from '@/lib/ginekologiyaKalkulyatorlari'

export default function GinekologiyaKalkulyatorlarPage() {
  const router = useRouter()
  const [filtr, setFiltr] = useState<string>('Hammasi')
  const [qidiruv, setQidiruv] = useState('')

  const royxat = useMemo(() => {
    const q = qidiruv.trim().toLocaleLowerCase('uz')
    return GINEKOLOGIYA_KALKULYATORLARI.filter((k) => {
      if (filtr !== 'Hammasi' && k.kategoriya !== filtr) return false
      return !q || k.title.toLocaleLowerCase('uz').includes(q)
    })
  }, [filtr, qidiruv])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '24px 20px' }}>
        <div className="rise" style={{ marginBottom: '18px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px' }}>🌸 Ginekologiya kalkulyatorlari</h1>
          <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}>
            {GINEKOLOGIYA_KALKULYATORLARI.length} ta klinik shkala va kalkulyator.
            «Ishlaydi» — interaktiv hisoblash; «Ma’lumot» — to‘liq klinik ta’rif va hisoblash mantig‘i.
          </p>
        </div>

        <input
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          placeholder="Qidirish — masalan, Bishop yoki IOTA"
          aria-label="Kalkulyatorlarni qidirish"
          style={{
            width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
            border: '1px solid var(--line)', borderRadius: '12px', padding: '11px 14px',
            fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '14px',
          }}
        />

        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '18px' }}>
          {GIN_KALK_KATEGORIYALARI.map((kat) => {
            const faol = filtr === kat
            return (
              <button
                key={kat}
                onClick={() => setFiltr(kat)}
                className="soft-press"
                style={{
                  border: `1px solid ${faol ? 'var(--gyn)' : 'var(--line)'}`,
                  background: faol ? 'var(--gyn-soft)' : 'var(--surface)',
                  color: faol ? 'var(--gyn)' : 'var(--muted)',
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
            {royxat.map((k) => {
              const jonli = k.holat === 'jonli'
              return (
              <div
                key={k.slug}
                role="button"
                tabIndex={0}
                aria-label={k.title}
                onClick={() => router.push(`/student/ginekologiya/kalkulyatorlar/${k.slug}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/student/ginekologiya/kalkulyatorlar/${k.slug}`) } }}
                className="soft-press"
                style={{
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                  overflow: 'hidden', cursor: 'pointer',
                }}
              >
                <div style={{ height: '3px', background: 'linear-gradient(135deg, var(--gyn), #f472b6)' }} />
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '19px' }}>{k.icon}</span>
                  <strong style={{ fontSize: '14.5px', flex: 1 }}>{k.title}</strong>
                  <span style={{
                    fontSize: '10.5px',
                    color: jonli ? 'var(--gyn)' : 'var(--muted)',
                    background: jonli ? 'var(--gyn-soft)' : 'var(--surface-2)',
                    border: jonli ? 'none' : '1px solid var(--line)',
                    borderRadius: '999px', padding: '3px 8px', whiteSpace: 'nowrap', fontWeight: 700,
                  }}>
                    {jonli ? 'Ishlaydi' : 'Ma’lumot'}
                  </span>
                </div>
              </div>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
