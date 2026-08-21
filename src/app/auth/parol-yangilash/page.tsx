'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'
import Hero, { MobileHero } from '@/components/Hero'

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
  border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 16px',
  fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px',
}

function passwordStrength(pw: string): { level: number; label: string; color: string } {
  if (!pw) return { level: 0, label: '', color: 'var(--line)' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return { level: 1, label: 'Zaif', color: 'var(--danger)' }
  if (score === 3) return { level: 2, label: "O'rtacha", color: 'var(--warn)' }
  return { level: 3, label: 'Kuchli', color: 'var(--good)' }
}

export default function ParolYangilashPage() {
  const [ready, setReady] = useState<'kutish' | 'tayyor' | 'yaroqsiz'>('kutish')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { theme, toggle } = useTheme()
  const pw = passwordStrength(password)

  // Recovery havolasidan kelganda @supabase/ssr URL'dagi PKCE `?code=` (yoki hash
  // token) ni avtomatik almashtirib sessiya ochadi va hodisa yuboradi.
  useEffect(() => {
    const url = new URL(window.location.href)
    const hasCode = url.searchParams.has('code')
    const hasHashToken = /access_token|type=recovery/.test(window.location.hash)
    const hasError = url.searchParams.has('error') || /error/.test(window.location.hash)

    // Supabase xato qaytargan bo'lsa (muddati o'tgan/ishlatilgan) — darrov yaroqsiz
    if (hasError) { setReady('yaroqsiz'); return }

    let hal = false
    const tayyorla = () => { if (!hal) { hal = true; setReady('tayyor') } }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) tayyorla()
    })
    supabase.auth.getSession().then(({ data }) => { if (data.session) tayyorla() })

    // Recovery parametrlari umuman yo'q bo'lsa — sahifa to'g'ridan-to'g'ri ochilgan
    if (!hasCode && !hasHashToken) {
      const t = setTimeout(() => { if (!hal) setReady('yaroqsiz') }, 800)
      return () => { sub.subscription.unsubscribe(); clearTimeout(t) }
    }

    // Token bor — almashtirish sekin tarmoqda vaqt olishi mumkin, kengroq kutamiz
    const t = setTimeout(() => { if (!hal) setReady('yaroqsiz') }, 6000)
    return () => { sub.subscription.unsubscribe(); clearTimeout(t) }
  }, [supabase])

  const handleUpdate = async () => {
    setError('')
    if (password.length < 8) { setError("Parol kamida 8 ta belgi bo'lishi kerak"); return }
    if (password !== confirm) { setError('Parollar mos kelmayapti'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError('Xatolik: ' + error.message); return }
    setDone(true)
    await supabase.auth.signOut()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <Hero />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <MobileHero />
        <div style={{
          width: '100%', maxWidth: '420px', background: 'var(--surface)',
          borderRadius: '16px', padding: '32px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid var(--line)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Kunduzgi temaga o\'tish' : 'Tungi temaga o\'tish'} className="btn-animated" style={{
              background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px',
              padding: '8px', cursor: 'pointer', color: 'var(--ink-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0,
            }}>
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
                  <line x1="4.9" y1="4.9" x2="6.3" y2="6.3" /><line x1="17.7" y1="17.7" x2="19.1" y2="19.1" />
                  <line x1="4.9" y1="19.1" x2="6.3" y2="17.7" /><line x1="17.7" y1="6.3" x2="19.1" y2="4.9" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--ink)', margin: 0 }}>
              Uro<span style={{ color: 'var(--accent)' }}>sfera</span>
            </h1>
            <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '14px' }}>Yangi parol o'rnatish</p>
          </div>

          {done ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--good)',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 style={{ color: 'var(--ink)', fontSize: '18px', fontWeight: '700', margin: '0 0 10px' }}>Parol yangilandi</h2>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 24px' }}>
                Endi yangi parolingiz bilan kira olasiz.
              </p>
              <a href="/auth/login" className="btn-animated" style={{
                display: 'inline-block', background: 'var(--accent)', color: 'white', textDecoration: 'none',
                borderRadius: '10px', padding: '13px 28px', fontSize: '15px', fontWeight: '600',
              }}>Kirishga o'tish</a>
            </div>
          ) : ready === 'yaroqsiz' ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ color: 'var(--ink-soft)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 20px' }}>
                Havola yaroqsiz yoki muddati o'tgan. Parolni tiklashni qaytadan boshlang.
              </p>
              <a href="/auth/parol-tiklash" className="btn-animated" style={{
                display: 'inline-block', background: 'var(--accent)', color: 'white', textDecoration: 'none',
                borderRadius: '10px', padding: '13px 28px', fontSize: '15px', fontWeight: '600',
              }}>Qaytadan tiklash</a>
            </div>
          ) : ready === 'kutish' ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>Yuklanmoqda…</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (!loading) handleUpdate() }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label htmlFor="yangi-parol" style={labelStyle}>Yangi parol</label>
                <input id="yangi-parol" type="password" autoComplete="new-password" value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                {password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3].map(i => (
                        <div key={i} style={{
                          flex: 1, height: '4px', borderRadius: '2px',
                          background: i <= pw.level ? pw.color : 'var(--line)', transition: 'background 0.2s',
                        }} />
                      ))}
                    </div>
                    <p style={{ color: pw.color, fontSize: '12px', margin: '5px 0 0' }}>{pw.label}</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="yangi-parol-2" style={labelStyle}>Parolni tasdiqlang</label>
                <input id="yangi-parol-2" type="password" autoComplete="new-password" value={confirm}
                  onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" style={inputStyle} />
              </div>

              {error && <p role="alert" aria-live="polite" style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>}

              <button type="submit" disabled={loading} className="btn-animated" style={{
                width: '100%', background: 'var(--accent)', color: 'white', border: 'none',
                borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                {loading && (
                  <span style={{
                    width: '15px', height: '15px', borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white',
                    animation: 'spin 0.7s linear infinite', display: 'inline-block',
                  }} />
                )}
                {loading ? 'Saqlanmoqda...' : 'Parolni yangilash'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
