'use client'

// "Biz haqimizda" matnini tahrirlash — sayt_kontenti['biz_haqimizda'] kaliti.
// Har bir xatboshi alohida qator; talaba sahifasi shu yerdan o'qiydi.

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

export default function AdminBizHaqimizdaPage() {
  const supabase = createClient()
  const [matn, setMatn] = useState('')
  const [yuklandi, setYuklandi] = useState(false)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xabar, setXabar] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('sayt_kontenti')
      .select('qiymat')
      .eq('kalit', 'biz_haqimizda')
      .maybeSingle()
      .then(({ data }) => {
        const paragraflar = (data?.qiymat as { paragraflar?: string[] } | null)?.paragraflar
        if (paragraflar?.length) setMatn(paragraflar.join('\n\n'))
        setYuklandi(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saqla = async () => {
    setSaqlanmoqda(true)
    setXabar(null)
    const paragraflar = matn.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    const { error } = await supabase
      .from('sayt_kontenti')
      .upsert({ kalit: 'biz_haqimizda', qiymat: { paragraflar }, updated_at: new Date().toISOString() })
    setXabar(error ? `❌ ${error.message}` : '✅ Saqlandi — talaba sahifasida darhol ko\'rinadi')
    setSaqlanmoqda(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[760px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>🏥 Biz haqimizda</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          Har bir xatboshini bo&apos;sh qator bilan ajrating. Bo&apos;sh qoldirsangiz, talaba sahifasida standart matn chiqadi.
        </p>

        {!yuklandi ? (
          <UrosferaLoaderMini />
        ) : (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
            padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            <textarea
              value={matn}
              onChange={(e) => setMatn(e.target.value)}
              rows={14}
              placeholder={"Urosfera — urologiya va andrologiya yo'nalishidagi tibbiy ta'lim platformasi...\n\nIkkinchi xatboshi..."}
              style={{
                width: '100%', background: 'var(--surface-2)', border: '1px solid var(--line)',
                borderRadius: '12px', padding: '14px', fontSize: '13.5px', color: 'var(--ink)', outline: 'none',
                resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
              }}
            />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={saqla} disabled={saqlanmoqda} className="soft-press" style={{
                background: saqlanmoqda ? 'var(--surface-2)' : 'var(--accent)',
                color: saqlanmoqda ? 'var(--muted)' : 'white',
                border: 'none', borderRadius: '12px', padding: '12px 26px', fontSize: '13.5px', fontWeight: 800,
                cursor: saqlanmoqda ? 'wait' : 'pointer',
              }}>
                {saqlanmoqda ? 'Saqlanmoqda...' : '💾 Saqlash'}
              </button>
              {xabar && <span style={{ fontSize: '12.5px', fontWeight: 700, color: xabar.startsWith('✅') ? '#16a34a' : '#dc2626' }}>{xabar}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
