'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Bell } from 'lucide-react'

export function NotificationBell() {
  const [unread, setUnread] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) return

      // Foydalanuvchiga tegishli barcha bildirishnomalar
      const { data: all } = await supabase
        .from('notifications')
        .select('id')
        .or(`target_role.is.null,target_role.eq.${profile.role}`)

      if (!all || all.length === 0) return

      const allIds = all.map(n => n.id)

      // O'qilganlar
      const { data: readRows } = await supabase
        .from('notification_reads')
        .select('notification_id')
        .eq('user_id', user.id)
        .in('notification_id', allIds)

      const readCount = readRows?.length ?? 0
      setUnread(allIds.length - readCount)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <button
      onClick={() => router.push('/student/profil/bildirishnomalar')}
      aria-label="Bildirishnomalar"
      className="btn-animated"
      style={{
        position: 'relative', background: 'var(--surface-2)', border: '1px solid var(--line)',
        borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', color: 'var(--ink-soft)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Bell size={17} strokeWidth={2} />
      {unread > 0 && (
        <span style={{
          position: 'absolute', top: '-4px', right: '-4px',
          background: 'var(--danger)', color: 'white', borderRadius: '999px',
          fontSize: '10px', fontWeight: 800, minWidth: '16px', height: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
          lineHeight: 1,
        }}>
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  )
}
