'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useTheme } from '@/components/ThemeProvider'
import Hero, { MobileHero } from '@/components/Hero'

export default function ParolTiklashPage() {
  const [login, setLogin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = createClient()
  const { theme, toggle } = useTheme()

  const handleReset = async () => {
    setError('')
    const raw = login.trim()
    if (!raw) { setError('Login yoki emailingizni kiriting'); return }

    // Staff loginlari `login@urosfera.uz` ko'rinishida saqlanadi (login sahifasi bilan bir xil qoida).
    const email = raw.includes('@') ? raw : `${raw}@urosfera.uz`

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/parol-yangilash`,
    })
    setLoading(false)

    // Xavfsizlik: email mavjud yoki yo'qligini oshkor qilmaymiz — har doim bir xil muvaffaqiyat xabari.
    if (error && !/rate limit/i.test(error.message)) {
      setError('Xatolik yuz berdi. Birozdan so\'ng qayta urinib ko\'ring.')
      return
    }
    setSent(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <Hero />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}>
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
            <p style={{ color: 'var(--muted)', marginTop: '8px', fontSize: '14px' }}>
              Parolni tiklash
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 16px',
                background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--good)',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 style={{ color: 'var(--ink)', fontSize: '18px', fontWeight: '700', margin: '0 0 10px' }}>
                Havola yuborildi
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.7', margin: '0 0 24px' }}>
                Agar bunday hisob mavjud bo'lsa, parolni tiklash havolasi emailingizga yuborildi.
                Pochtangizni tekshiring (spam papkasini ham).
              </p>
              <a href="/auth/login" style={{
                display: 'inline-block', background: 'var(--accent)', color: 'white', textDecoration: 'none',
                borderRadius: '10px', padding: '13px 28px', fontSize: '15px', fontWeight: '600',
              }} className="btn-animated">
                Kirishga qaytish
              </a>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (!loading) handleReset() }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ color: 'var(--ink-soft)', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                Login yoki emailingizni kiriting — parolni tiklash havolasini yuboramiz.
              </p>

              <div>
                <label htmlFor="tiklash-login" style={{ color: 'var(--ink-soft)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>
                  Login yoki email
                </label>
                <input
                  id="tiklash-login"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={login}
                  onChange={(e) => setLogin(e.target.value.replace(/\s/g, ''))}
                  placeholder="arabboyev yoki email@gmail.com"
                  style={{
                    width: '100%', background: 'var(--surface-2)', color: 'var(--ink)',
                    border: '1px solid var(--line)', borderRadius: '10px', padding: '12px 16px',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <p style={{ color: 'var(--muted)', fontSize: '12px', margin: '6px 0 0' }}>
                  Bemorlar telefon orqali kiradi — parol uchun administrator bilan bog'laning.
                </p>
              </div>

              {error && (
                <p role="alert" aria-live="polite" style={{ color: 'var(--danger)', fontSize: '14px', margin: 0 }}>{error}</p>
              )}

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
                {loading ? 'Yuborilmoqda...' : 'Tiklash havolasini yuborish'}
              </button>

              <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
                Paroli esladingizmi?{' '}
                <a href="/auth/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  Kirish
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
