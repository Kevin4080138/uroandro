'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Profile = { full_name: string; role: string; avatar_url: string | null }

const ROL_NOMI: Record<string, string> = {
  student: '🎓 Talaba', doctor: '👨‍⚕️ Shifokor', patient: '🧑 Bemor', admin: '🛠️ Admin',
}

export function ProfileMenu() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [ochiq, setOchiq] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('full_name, role, avatar_url').eq('id', user.id).maybeSingle()
      if (data) setProfile(data as Profile)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const tashqiBosish = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOchiq(false)
    }
    document.addEventListener('mousedown', tashqiBosish)
    return () => document.removeEventListener('mousedown', tashqiBosish)
  }, [])

  const chiqish = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!profile) return null

  const harf = (profile.full_name?.trim()?.[0] ?? '?').toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOchiq((v) => !v)}
        aria-label="Profil menyusi"
        className="btn-animated"
        style={{
          width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'var(--accent)', color: 'white', fontSize: '14px', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 0,
        }}
      >
        {profile.avatar_url
          ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : harf
        }
      </button>

      {ochiq && (
        <div
          className="rise"
          style={{
            position: 'fixed', right: '12px', top: '60px', zIndex: 200, minWidth: '220px', maxWidth: 'calc(100vw - 24px)',
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
            boxShadow: 'var(--shadow)', padding: '14px', overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0 4px 12px', borderBottom: '1px solid var(--line)', marginBottom: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile.full_name}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
              {ROL_NOMI[profile.role] ?? profile.role}
            </p>
          </div>
          {profile.role === 'student' && (
            <button
              onClick={() => { setOchiq(false); router.push('/student/profil') }}
              className="soft-press"
              style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--ink)', fontSize: '13px', fontWeight: 600, padding: '8px 4px', borderRadius: '8px',
              }}
            >
              👤 Mening profilim
            </button>
          )}
          <button
            onClick={chiqish}
            className="soft-press"
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--danger)', fontSize: '13px', fontWeight: 600, padding: '8px 4px', borderRadius: '8px',
            }}
          >
            ↩ Chiqish
          </button>
        </div>
      )}
    </div>
  )
}
