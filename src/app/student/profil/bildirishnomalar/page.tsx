'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Notification = {
  id: string
  title: string
  body: string
  type: string
  created_at: string
  read: boolean
}

const TYPE_STYLE: Record<string, { icon: string; bg: string; color: string; border: string }> = {
  info:    { icon: 'ℹ️', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  success: { icon: '✅', bg: '#f0fdf4', color: '#16a34a', border: '#86efac' },
  warning: { icon: '⚠️', bg: '#fefce8', color: '#ca8a04', border: '#fde047' },
  urgent:  { icon: '🚨', bg: '#fff1f2', color: '#dc2626', border: '#fca5a5' },
}

function formatSana(iso: string) {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function BildirishnomalarPage() {
  const router = useRouter()
  const supabase = createClient()
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (!profile) { setLoading(false); return }

      const { data: notifs } = await supabase
        .from('notifications')
        .select('id, title, body, type, created_at')
        .or(`target_role.is.null,target_role.eq.${profile.role}`)
        .order('created_at', { ascending: false })

      if (!notifs || notifs.length === 0) { setLoading(false); return }

      const { data: reads } = await supabase
        .from('notification_reads')
        .select('notification_id')
        .eq('user_id', user.id)
        .in('notification_id', notifs.map(n => n.id))

      const readSet = new Set((reads ?? []).map(r => r.notification_id))
      setItems(notifs.map(n => ({ ...n, read: readSet.has(n.id) })))
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const markRead = async (id: string) => {
    if (!userId) return
    await supabase.from('notification_reads')
      .upsert({ notification_id: id, user_id: userId }, { onConflict: 'notification_id,user_id', ignoreDuplicates: true })
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    const unread = items.filter(n => !n.read)
    if (!unread.length || !userId) return
    await supabase.from('notification_reads').upsert(
      unread.map(n => ({ notification_id: n.id, user_id: userId })),
      { onConflict: 'notification_id,user_id', ignoreDuplicates: true }
    )
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = items.filter(n => !n.read).length

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

      <div className="mx-auto max-w-[600px] px-5 py-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>🔔 Bildirishnomalar</h2>
            {unreadCount > 0 && (
              <span style={{
                background: 'var(--danger)', color: 'white', borderRadius: '999px',
                padding: '2px 10px', fontSize: '12px', fontWeight: 700,
              }}>
                {unreadCount} yangi
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{
              background: 'none', border: 'none', color: 'var(--accent)',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0,
            }}>
              Hammasini o'qildi deb belgilash
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)',
            borderRadius: '14px', padding: '48px 20px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '48px', margin: '0 0 12px' }}>🔕</p>
            <p style={{ fontWeight: 700, color: 'var(--ink)', margin: '0 0 6px' }}>Bildirishnoma yo'q</p>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>Yangi xabarlar shu yerda ko'rinadi</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map(n => {
              const s = TYPE_STYLE[n.type] ?? TYPE_STYLE['info']
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    background: n.read ? 'var(--surface)' : s.bg,
                    border: `1px solid ${n.read ? 'var(--line)' : s.border}`,
                    borderRadius: '14px', padding: '16px 18px', cursor: 'pointer',
                    transition: 'background .2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '1px' }}>{s.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>{n.title}</p>
                        {!n.read && (
                          <span style={{
                            background: s.color, color: 'white', borderRadius: '6px',
                            padding: '1px 7px', fontSize: '10px', fontWeight: 700,
                          }}>Yangi</span>
                        )}
                      </div>
                      <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, opacity: n.read ? 0.75 : 1 }}>
                        {n.body}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>{formatSana(n.created_at)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
