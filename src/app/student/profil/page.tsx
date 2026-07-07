'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { BottomNav } from '@/components/BottomNav'
import { useTheme } from '@/components/ThemeProvider'
import { createClient } from '@/lib/supabase'

type Profile = { full_name: string; telefon: string | null; role: string; avatar_url: string | null }

const ROL_NOMI: Record<string, string> = {
  student: '🎓 Talaba', doctor: '👨‍⚕️ Shifokor', patient: '🧑 Bemor', admin: '🛠️ Admin',
}

const BANDLAR = [
  { icon: '👤', label: 'Profil ma\'lumotlari', href: '/student/profil/tahrirlash' },
  { icon: 'ℹ️', label: 'Biz haqimizda', href: '/student/profil/biz-haqimizda' },
  { icon: '💬', label: 'Izoh (feedback)', href: '/student/profil/feedback' },
  { icon: '📩', label: 'Adminga yozish', href: 'https://t.me/urolog_arabboyev', tashqi: true },
  { icon: '📞', label: "Qo'ng'iroq qilish", href: 'tel:+998904080138', tashqi: true },
  { icon: '📖', label: "Yo'riqnoma", href: '/student/profil/yoriqnoma' },
  { icon: '📄', label: 'Ommaviy oferta', href: '/student/profil/oferta' },
]

export default function ProfilPage() {
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggle } = useTheme()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [ochirilmoqda, setOchirilmoqda] = useState(false)
  const [parolModal, setParolModal] = useState(false)
  const [parol, setParol] = useState('')
  const [parolXato, setParolXato] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('full_name, telefon, role, avatar_url').eq('id', user.id).maybeSingle()
      setProfile(data as Profile)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chiqish = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const hisobniOchir = () => {
    if (!confirm("Hisobingizni BUTUNLAY o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi va barcha ma'lumotlaringiz (natijalar, obunalar) yo'qoladi.")) return
    setParol('')
    setParolXato('')
    setParolModal(true)
  }

  const tasdiqlabOchir = async () => {
    if (!parol) { setParolXato('Parolni kiriting'); return }
    setOchirilmoqda(true)
    setParolXato('')
    const res = await fetch('/api/hisobni-ochirish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: parol }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      setParolXato(j.error ?? "Hisobni o'chirib bo'lmadi")
      setOchirilmoqda(false)
      return
    }
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!profile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
      </div>
    )
  }

  const harf = (profile.full_name?.trim()?.[0] ?? '?').toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '90px' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[600px] px-5 py-6 sm:px-8 sm:py-8">

        <div className="rise" style={{
          display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px',
          background: 'linear-gradient(135deg, #2563eb, #0891b2)', borderRadius: '18px', padding: '22px 22px',
          color: 'white',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, flexShrink: 0,
            overflow: 'hidden',
          }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : harf
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{profile.full_name}</h2>
            <p style={{ margin: '3px 0 0', fontSize: '13px', opacity: .85 }}>
              {profile.telefon ?? ROL_NOMI[profile.role] ?? profile.role}
            </p>
          </div>
        </div>

        <div className="rise" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
          padding: '14px 18px', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {theme === 'dark' ? '🌙' : '☀️'} Tungi rejim
          </span>
          <button
            onClick={toggle}
            aria-label="Tungi rejimni almashtirish"
            style={{
              width: '44px', height: '26px', borderRadius: '999px', border: 'none', cursor: 'pointer', position: 'relative',
              background: theme === 'dark' ? 'var(--accent)' : 'var(--line)', transition: 'background .2s',
            }}
          >
            <span style={{
              position: 'absolute', top: '3px', left: theme === 'dark' ? '22px' : '3px',
              width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left .2s',
            }} />
          </button>
        </div>

        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
          overflow: 'hidden', marginBottom: '16px',
        }}>
          {BANDLAR.map((b, i) => (
            <a
              key={b.label}
              href={b.href}
              target={b.tashqi ? '_blank' : undefined}
              rel={b.tashqi ? 'noopener noreferrer' : undefined}
              className="row-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
                borderTop: i === 0 ? 'none' : '1px solid var(--line)', textDecoration: 'none', color: 'var(--ink)',
              }}
            >
              <span style={{ fontSize: '17px' }}>{b.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, flex: 1 }}>{b.label}</span>
              <span style={{ color: 'var(--muted)' }}>›</span>
            </a>
          ))}
        </div>

        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden',
        }}>
          <button onClick={chiqish} className="row-hover" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', width: '100%',
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)',
          }}>
            <span style={{ fontSize: '17px' }}>↩️</span>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Hisobdan chiqish</span>
          </button>
          <button onClick={hisobniOchir} disabled={ochirilmoqda} className="row-hover" style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', width: '100%',
            background: 'none', border: 'none', borderTop: '1px solid var(--line)', cursor: ochirilmoqda ? 'wait' : 'pointer',
            textAlign: 'left', color: 'var(--danger)', opacity: ochirilmoqda ? .6 : 1,
          }}>
            <span style={{ fontSize: '17px' }}>🗑️</span>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>{ochirilmoqda ? "O'chirilmoqda..." : "Hisobni o'chirish"}</span>
          </button>
        </div>
      </div>

      {parolModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100,
        }}>
          <div style={{
            width: '100%', maxWidth: '380px', background: 'var(--surface)', borderRadius: '16px',
            padding: '24px', border: '1px solid var(--line)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '17px', color: 'var(--ink)' }}>Parolni tasdiqlang</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted)' }}>
              Hisobni o&apos;chirish irreversible amal — davom etish uchun joriy parolingizni kiriting.
            </p>
            <input
              type="password"
              value={parol}
              onChange={(e) => setParol(e.target.value)}
              placeholder="Joriy parol"
              autoFocus
              style={{
                width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
                borderRadius: '10px', padding: '12px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {parolXato && <p style={{ color: 'var(--danger)', fontSize: '13px', margin: '8px 0 0' }}>{parolXato}</p>}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                onClick={() => setParolModal(false)}
                disabled={ochirilmoqda}
                style={{
                  flex: 1, background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
                  borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Bekor qilish
              </button>
              <button
                onClick={tasdiqlabOchir}
                disabled={ochirilmoqda}
                style={{
                  flex: 1, background: 'var(--danger)', color: 'white', border: 'none',
                  borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 600,
                  cursor: ochirilmoqda ? 'wait' : 'pointer', opacity: ochirilmoqda ? .7 : 1,
                }}
              >
                {ochirilmoqda ? "O'chirilmoqda..." : "Hisobni o'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
