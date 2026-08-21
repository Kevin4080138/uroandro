'use client'

// Telegram Mini App avto-login. Faqat Telegram ichida (initData mavjud) ishlaydi,
// oddiy brauzer foydalanuvchilariga umuman ta'sir qilmaydi.
// Sessiya bo'lmasa: initData'ni serverga yuboradi → magic-link token → verifyOtp → uy sahifasi.
// Yangi foydalanuvchi bo'lsa: Talaba/Bemor tanlash ekrani chiqadi.

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type TgWebApp = {
  initData: string
  ready: () => void
  expand: () => void
}

const ROLE_HOME: Record<string, string> = {
  student: '/student/dashboard',
  patient: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  admin: '/admin/dashboard',
}

export function TelegramAutoLogin() {
  const supabase = createClient()
  const [holat, setHolat] = useState<'tekshirilyapti' | 'rol' | 'kirilmoqda' | 'yopiq'>('yopiq')
  const [ism, setIsm] = useState('')
  const [xato, setXato] = useState<string | null>(null)

  const kir = async (initData: string, role: string | undefined) => {
    setXato(null)
    // Watchdog: server yoki tarmoq javob bermasa — cheksiz spinnerда qolmaymiz
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 12000)
    try {
      const res = await fetch('/api/telegram/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, role }),
        signal: ctrl.signal,
      })
      const json = await res.json()

      if (json.needRole) {
        setIsm(json.name || '')
        setHolat('rol')
        return
      }
      if (!res.ok || !json.token_hash) {
        setXato(json.error || 'Kirishda xatolik')
        setHolat('rol') // qayta urinish uchun ekran ochiq qoladi
        return
      }

      setHolat('kirilmoqda')
      // DIQQAT: token_hash bilan tekshirganda faqat `token_hash` va `type`
      // yuboriladi. `email` ham qo'shilsa Supabase quyidagi xatoni qaytaradi:
      // "Only the token_hash and type should be provided".
      // `type` server yaratgan havola turiga mos bo'lishi kerak — shuning
      // uchun server generateLink'ning verification_type'ini qaytaradi.
      const verify = supabase.auth.verifyOtp({
        token_hash: json.token_hash,
        type: json.type ?? 'magiclink',
      })
      const verifyTimeout = new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error("Sessiya ochish uzoq davom etdi")), 12000)
      )
      const { error } = await Promise.race([verify, verifyTimeout])
      if (error) {
        setXato('Sessiya ochilmadi: ' + error.message)
        setHolat('rol')
        return
      }
      // Muvaffaqiyat — TO'LIQ qayta yuklash bilan uy sahifasiga o'tamiz.
      // Bu overlay'ni butunlay yopadi (router.replace overlay state'ini
      // tozalamasdi) va server yangi sessiya cookie'sini o'qiydi.
      window.location.replace(ROLE_HOME[json.role] ?? '/')
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === 'AbortError'
      setXato(aborted ? "Server javob bermadi. Qayta urinib ko'ring." : (e instanceof Error ? e.message : 'Xatolik'))
      setHolat('rol')
    } finally {
      clearTimeout(t)
    }
  }

  const rolTanla = async (role: 'student' | 'patient') => {
    const tg = (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp
    if (!tg?.initData) return
    setHolat('kirilmoqda')
    await kir(tg.initData, role)
  }

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp
    if (!tg?.initData) return // Telegram ichida emas — hech narsa qilmaymiz

    tg.ready?.()
    tg.expand?.()

    const boshla = async () => {
      // Allaqachon kirgan bo'lsa — tegmaymiz
      const { data: { session } } = await supabase.auth.getSession()
      if (session) return

      setHolat('tekshirilyapti')
      await kir(tg.initData, undefined)
    }
    boshla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (holat === 'yopiq') return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        {(holat === 'tekshirilyapti' || holat === 'kirilmoqda') && (
          <>
            <div style={{ fontSize: 40, marginBottom: 14 }}>💧</div>
            <p style={{ fontSize: 15, fontWeight: 700 }}>Urosfera&apos;ga kirilmoqda...</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>Bir soniya, Telegram orqali tasdiqlayapmiz</p>
          </>
        )}

        {holat === 'rol' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 10 }}>👋</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 6px' }}>
              Xush kelibsiz{ism ? `, ${ism}` : ''}!
            </h2>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: '0 0 22px', lineHeight: 1.5 }}>
              Urosfera&apos;dan qanday maqsadda foydalanmoqchisiz?
            </p>

            <button
              onClick={() => rolTanla('student')}
              className="soft-press"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                background: 'linear-gradient(120deg, var(--accent), var(--accent-2))', color: 'white',
                border: 'none', borderRadius: 16, padding: '16px 18px', marginBottom: 12, cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 26 }}>🎓</span>
              <span>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 800 }}>Men talabaman</span>
                <span style={{ display: 'block', fontSize: 12, opacity: .85 }}>Urologiyani o&apos;rganish, testlar, sertifikat</span>
              </span>
            </button>

            <button
              onClick={() => rolTanla('patient')}
              className="soft-press"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                background: 'var(--surface)', color: 'var(--ink)', border: '1.5px solid var(--line)',
                borderRadius: 16, padding: '16px 18px', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 26 }}>🩺</span>
              <span>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 800 }}>Men bemorman</span>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>Shifokorga murojaat, navbat, davolanish</span>
              </span>
            </button>

            <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 18, lineHeight: 1.5 }}>
              Shifokormisiz? <a href="/auth/register" style={{ color: 'var(--accent)' }}>To&apos;liq ro&apos;yxatdan o&apos;ting</a> — tasdiqlashdan o&apos;tasiz.
            </p>

            {xato && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 12 }}>{xato}</p>}
          </>
        )}
      </div>
    </div>
  )
}
