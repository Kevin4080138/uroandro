'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Friend = {
  id: string
  full_name: string
  role: string
  avatar_url: string | null
  created_at: string
}

const ROL_EMOJI: Record<string, string> = {
  student: '🎓', doctor: '👨‍⚕️', patient: '🧑', admin: '🛠️',
}

function formatSana(iso: string) {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  })
}

export default function TaklifPage() {
  const router = useRouter()
  const supabase = createClient()
  const [code, setCode] = useState<string | null>(null)
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('https://urosfera.uz')

  useEffect(() => {
    setOrigin(window.location.origin)
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      // Get/generate referral code
      const res = await fetch('/api/referral/ensure-code', { method: 'POST' })
      const json = await res.json()
      setCode(json.code ?? null)

      // Load invited friends
      const { data: refs } = await supabase
        .from('referrals')
        .select('invited_id, created_at')
        .eq('inviter_id', user.id)
        .order('created_at', { ascending: false })

      if (refs && refs.length > 0) {
        const ids = refs.map(r => r.invited_id)
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, role, avatar_url')
          .in('id', ids)

        const profileMap: Record<string, typeof profiles extends (infer T)[] | null ? T : never> = {}
        for (const p of profiles ?? []) profileMap[(p as { id: string }).id] = p as typeof profileMap[string]

        setFriends(refs.map(r => ({
          id: r.invited_id,
          full_name: (profileMap[r.invited_id] as { full_name: string })?.full_name ?? 'Foydalanuvchi',
          role: (profileMap[r.invited_id] as { role: string })?.role ?? 'student',
          avatar_url: (profileMap[r.invited_id] as { avatar_url: string | null })?.avatar_url ?? null,
          created_at: r.created_at,
        })))
      }

      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const link = code ? `${origin}/auth/register?ref=${code}` : ''
  const buOy = friends.filter(f => {
    const d = new Date(f.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--ink)' }}>Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', paddingBottom: '40px' }}>
      <Header backHref="/student/profil" backLabel="Profil" />

      <div className="mx-auto max-w-[600px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          borderRadius: '20px', padding: '28px 24px', color: 'white', textAlign: 'center',
        }}>
          <p style={{ fontSize: '48px', margin: '0 0 12px' }}>🎁</p>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800 }}>Do'stlarni taklif qiling</h2>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
            Urosfera platformasini do'stlaringizga tanishtiring.<br />
            Har bir yangi foydalanuvchi sizning ro'yxatingizda saqlanadi.
          </p>
        </div>

        {/* Referral link */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '16px', padding: '20px',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 700, color: 'var(--muted)' }}>
            Sizning taklif havolangiz
          </p>
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--line)',
            borderRadius: '10px', padding: '12px 14px', marginBottom: '12px',
            fontSize: '13px', wordBreak: 'break-all', color: 'var(--ink)', lineHeight: 1.5,
          }}>
            {link || '...'}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => copyToClipboard(link, setCopied)}
              style={{
                flex: 1, background: copied ? '#34d399' : 'var(--accent)', color: 'white',
                border: 'none', borderRadius: '10px', padding: '12px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                transition: 'background .2s',
              }}
            >
              {copied ? '✅ Nusxalandi!' : '📋 Nusxalash'}
            </button>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Urosfera — urologiya bo'yicha o'quv platformasi. Ro'yxatdan o'ting!")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, background: '#229ED9', color: 'white',
                border: 'none', borderRadius: '10px', padding: '12px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              ✈️ Telegram
            </a>
          </div>
        </div>

        {/* Kodingiz */}
        {code && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: '14px', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Sizning kod</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '4px', color: 'var(--accent)' }}>{code}</p>
            </div>
            <button
              onClick={() => copyToClipboard(code, setCopied)}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--line)',
                borderRadius: '10px', padding: '10px 16px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, color: 'var(--ink)',
              }}
            >
              📋 Kodni copy
            </button>
          </div>
        )}

        {/* Statistika */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { icon: '👥', label: 'Jami do\'stlar', value: friends.length, color: '#7c3aed' },
            { icon: '🗓️', label: 'Bu oy', value: buOy, color: '#2563eb' },
          ].map(k => (
            <div key={k.label} style={{
              background: 'var(--surface)', border: '1px solid var(--line)',
              borderRadius: '14px', padding: '18px',
            }}>
              <p style={{ margin: 0, fontSize: '24px' }}>{k.icon}</p>
              <p style={{ margin: '8px 0 2px', fontSize: '28px', fontWeight: 800, color: k.color }}>{k.value}</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Qanday ishlaydi */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '14px', padding: '20px',
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 800 }}>📖 Qanday ishlaydi?</h3>
          {[
            { n: '1', text: 'Yuqoridagi havolani nusxalab do\'stingizga yuboring' },
            { n: '2', text: "Do'stingiz havola orqali ro'yxatdan o'tadi" },
            { n: '3', text: "U sizning do'stlar ro'yxatingizda saqlanadi" },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: s.n === '3' ? 0 : '14px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 800, color: 'white',
              }}>
                {s.n}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>{s.text}</p>
            </div>
          ))}
        </div>

        {/* Do'stlar ro'yxati */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: '14px', overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 18px', borderBottom: friends.length > 0 ? '1px solid var(--line)' : 'none' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '14px' }}>
              👥 Taklif qilingan do'stlar — {friends.length} ta
            </p>
          </div>

          {friends.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: '36px', margin: '0 0 10px' }}>🤝</p>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Hali hech kim taklif qilinmagan.<br />Havolani ulashib boshlang!
              </p>
            </div>
          ) : (
            friends.map((f, i) => {
              const harf = (f.full_name?.trim()?.[0] ?? '?').toUpperCase()
              return (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 18px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 800, color: 'white', overflow: 'hidden',
                  }}>
                    {f.avatar_url
                      ? <img src={f.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : harf
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.full_name}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--muted)' }}>
                      {ROL_EMOJI[f.role]} {f.role === 'student' ? 'Talaba' : f.role === 'doctor' ? 'Shifokor' : 'Bemor'}
                      {' · '}{formatSana(f.created_at)}
                    </p>
                  </div>
                  <span style={{
                    background: '#7c3aed20', color: '#7c3aed',
                    borderRadius: '6px', padding: '3px 8px', fontSize: '11px', fontWeight: 700,
                  }}>
                    Yangi
                  </span>
                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}
