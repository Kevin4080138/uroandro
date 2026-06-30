'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type LogYozuvi = {
  id: string
  admin_id: string | null
  amal: string
  maqsad_user_id: string | null
  tafsilot: any
  created_at: string
  admin_ism?: string
  maqsad_ism?: string
}

const AMAL_LABEL: Record<string, string> = {
  foydalanuvchi_ochirish: "🗑️ Foydalanuvchi o'chirildi",
  foydalanuvchi_tahrirlash: '✏️ Foydalanuvchi tahrirlandi',
  rol_ozgartirish: "🛠️ Rol o'zgartirildi",
  faol_ozgartirish: '🔒 Holat o\'zgartirildi',
  arxiv_ozgartirish: '🗄️ Arxivlash holati o\'zgartirildi',
  obuna_berish: '💳 Obuna berildi',
  obuna_bekor: '❌ Obuna bekor qilindi',
}

function TafsilotKorish({ amal, tafsilot }: { amal: string; tafsilot: any }) {
  if (!tafsilot) return null

  if (amal === 'rol_ozgartirish' && tafsilot.eski_rol && tafsilot.yangi_rol) {
    return (
      <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
        <span style={{ background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 6 }}>{tafsilot.eski_rol}</span>
        {' → '}
        <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>{tafsilot.yangi_rol}</span>
      </p>
    )
  }

  if (amal === 'faol_ozgartirish' && tafsilot.faol !== undefined) {
    return (
      <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
        Yangi holat:{' '}
        <span style={{ fontWeight: 600, color: tafsilot.faol ? 'var(--good)' : 'var(--danger)' }}>
          {tafsilot.faol ? 'Faol' : 'Bloklangan'}
        </span>
      </p>
    )
  }

  return (
    <pre style={{
      margin: '8px 0 0', fontSize: '11.5px', color: 'var(--muted)', background: 'var(--surface-2)',
      borderRadius: '8px', padding: '8px 10px', overflowX: 'auto',
    }}>{JSON.stringify(tafsilot, null, 2)}</pre>
  )
}

export default function AdminAuditPage() {
  const supabase = createClient()
  const [loglar, setLoglar] = useState<LogYozuvi[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: logData } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)

      const ids = Array.from(new Set((logData ?? []).flatMap((l) => [l.admin_id, l.maqsad_user_id]).filter(Boolean))) as string[]
      const { data: profillar } = ids.length
        ? await supabase.from('profiles').select('id, full_name').in('id', ids)
        : { data: [] as any[] }
      const ismMap = new Map((profillar ?? []).map((p: any) => [p.id, p.full_name]))

      setLoglar(
        (logData ?? []).map((l) => ({
          ...l,
          admin_ism: ismMap.get(l.admin_id) ?? '—',
          maqsad_ism: ismMap.get(l.maqsad_user_id) ?? '—',
        }))
      )
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin paneli" />

      <div className="mx-auto max-w-[800px] px-6 py-8">
        <h1 className="rise" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>Audit log</h1>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '22px' }}>
          Admin panelda amalga oshirilgan nozik amallar (foydalanuvchi tahrirlash/o&apos;chirish, rol o&apos;zgartirish) tarixi.
        </p>

        {loading ? (
          <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
        ) : loglar.length === 0 ? (
          <div className="rise" style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px', opacity: 0.6 }}>🗂️</div>
            <p style={{ margin: 0, fontSize: '14px' }}>Hozircha yozuv yo&apos;q.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loglar.map((l, i) => (
              <div key={l.id} className="rise" style={{
                animationDelay: `${Math.min(i * 0.02, 0.3)}s`,
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '14px 18px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>
                    {AMAL_LABEL[l.amal] ?? (
                      <span style={{ background: 'var(--surface-2)', color: 'var(--muted)', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>{l.amal}</span>
                    )}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{new Date(l.created_at).toLocaleString()}</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--ink-soft)' }}>
                  <strong>{l.admin_ism}</strong> tomonidan, <strong>{l.maqsad_ism}</strong> uchun
                </p>
                <TafsilotKorish amal={l.amal} tafsilot={l.tafsilot} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
