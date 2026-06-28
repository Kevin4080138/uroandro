'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'

export default function FeedbackPage() {
  const router = useRouter()
  const supabase = createClient()
  const [matn, setMatn] = useState('')
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [yuborildi, setYuborildi] = useState(false)
  const [xato, setXato] = useState<string | null>(null)

  const yubor = async () => {
    if (!matn.trim()) return
    setYuborilmoqda(true)
    setXato(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const { error } = await supabase.from('fikrlar').insert({ student_id: user.id, matn: matn.trim() })
    setYuborilmoqda(false)
    if (error) { setXato("Yuborib bo'lmadi, qaytadan urinib ko'ring."); return }
    setYuborildi(true)
    setMatn('')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/profil" backLabel="Profil" />
      <div className="mx-auto max-w-[600px] px-5 py-8 sm:px-8">
        <h2 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 800 }}>💬 Izoh (feedback)</h2>

        {yuborildi ? (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--good)', borderRadius: '14px', padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <p style={{ margin: '0 0 16px', color: 'var(--ink-soft)' }}>Fikringiz qabul qilindi, rahmat!</p>
            <button onClick={() => setYuborildi(false)} className="soft-press" style={{
              background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>
              Yana yuborish
            </button>
          </div>
        ) : (
          <div className="rise" style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '24px',
          }}>
            <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: '13.5px' }}>
              Platforma haqida fikr-mulohaza, taklif yoki muammoni shu yerga yozing — to&apos;g&apos;ridan-to&apos;g&apos;ri adminga yetib boradi.
            </p>
            <textarea
              value={matn}
              onChange={(e) => setMatn(e.target.value)}
              placeholder="Fikringizni yozing..."
              style={{
                width: '100%', minHeight: '140px', background: 'var(--surface-2)', color: 'var(--ink)',
                border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 14px', fontSize: '14px',
                outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={yubor}
              disabled={!matn.trim() || yuborilmoqda}
              className="btn-animated soft-press"
              style={{
                marginTop: '14px', width: '100%', background: matn.trim() ? 'var(--accent)' : 'var(--surface-2)',
                color: matn.trim() ? 'white' : 'var(--muted)', border: 'none', borderRadius: '10px',
                padding: '13px', fontSize: '14px', fontWeight: 700, cursor: matn.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {yuborilmoqda ? 'Yuborilmoqda...' : 'Yuborish'}
            </button>
            {xato && <p style={{ color: 'var(--danger)', fontSize: '12.5px', marginTop: '10px' }}>{xato}</p>}
          </div>
        )}
      </div>
    </div>
  )
}
