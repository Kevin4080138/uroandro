'use client'

// Savol-Javoblar — admin /admin/faq da boshqaradi, shu yerda accordion ko'rinishida.

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Faq = { id: string; savol: string; javob: string }

export default function StudentFaqPage() {
  const supabase = createClient()
  const [royxat, setRoyxat] = useState<Faq[]>([])
  const [yuklandi, setYuklandi] = useState(false)
  const [ochiq, setOchiq] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('faq')
      .select('id, savol, javob')
      .eq('faol', true)
      .order('tartib')
      .then(({ data }) => {
        setRoyxat((data as Faq[]) ?? [])
        setYuklandi(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/profil" backLabel="Profil" />
      <div className="mx-auto max-w-[600px] px-5 py-8 sm:px-8">
        <h2 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 800 }}>❔ Savol-Javoblar</h2>

        {!yuklandi ? (
          <UrosferaLoaderMini />
        ) : royxat.length === 0 ? (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
            padding: '28px', textAlign: 'center', color: 'var(--muted)', fontSize: '13.5px',
          }}>
            Savol-javoblar tez orada qo&apos;shiladi. Savolingiz bo&apos;lsa:{' '}
            <a href="https://t.me/urolog_arabboyev" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>@urolog_arabboyev</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {royxat.map((f, i) => {
              const och = ochiq === f.id
              return (
                <div
                  key={f.id}
                  className="rise"
                  style={{
                    animationDelay: `${Math.min(i * 0.05, 0.3)}s`,
                    background: 'var(--surface)', border: och ? '1px solid var(--accent)' : '1px solid var(--line)',
                    borderRadius: '14px', overflow: 'hidden', transition: 'border-color .15s ease',
                  }}
                >
                  <button
                    onClick={() => setOchiq(och ? null : f.id)}
                    style={{
                      width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                      padding: '15px 18px', display: 'flex', alignItems: 'center', gap: '10px',
                      fontSize: '13.5px', fontWeight: 800, color: 'var(--ink)',
                    }}
                  >
                    <span style={{ flex: 1 }}>{f.savol}</span>
                    <span style={{ color: 'var(--accent)', fontSize: '13px', flexShrink: 0 }}>{och ? '▲' : '▼'}</span>
                  </button>
                  {och && (
                    <p style={{
                      margin: 0, padding: '0 18px 15px', fontSize: '13px', lineHeight: 1.7,
                      color: 'var(--ink-soft)', whiteSpace: 'pre-line',
                    }}>{f.javob}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
