'use client'

// Dashboard bloki: "Obuna e'tibor talab qiladi" —
// 1) Xavf zonasi: obunasi faol, lekin 14+ kun faollik ko'rsatmagan talabalar (+ bir bosishda push)
// 2) Yaqinda tugaydiganlar: obunasi 7 kun ichida tugaydigan talabalar

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import type { Bosqich } from '@/lib/talim/darslar'

type ObunaQator = { student_id: string; bosqich: Bosqich; faol: boolean; tugash_sanasi: string | null }
type Profil = { id: string; full_name: string | null; email: string | null }

const BOSQICH_EMOJI: Record<string, string> = { oson: '🟢', "o'rta": '🟡', qiyin: '🔴' }

const XAVF_KUN = 14
const TUGASH_KUN = 7

export function ObunaEtibor() {
  const supabase = createClient()
  const router = useRouter()
  const [obunalar, setObunalar] = useState<ObunaQator[]>([])
  const [profillar, setProfillar] = useState<Map<string, Profil>>(new Map())
  const [oxirgiFaollik, setOxirgiFaollik] = useState<Map<string, string>>(new Map())
  const [yuklandi, setYuklandi] = useState(false)
  const [pushYuborilgan, setPushYuborilgan] = useState<Set<string>>(new Set())
  const [pushKetmoqda, setPushKetmoqda] = useState<string | null>(null)
  const [hozir] = useState(() => Date.now())

  useEffect(() => {
    const yukla = async () => {
      const { data: o } = await supabase
        .from('obunalar')
        .select('student_id, bosqich, faol, tugash_sanasi')
        .eq('faol', true)
      const faollar = ((o as ObunaQator[]) ?? []).filter(
        (r) => !r.tugash_sanasi || new Date(r.tugash_sanasi).getTime() > Date.now()
      )
      setObunalar(faollar)

      const idlar = [...new Set(faollar.map((r) => r.student_id))]
      if (idlar.length === 0) { setYuklandi(true); return }

      const [p, pr, n] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email').in('id', idlar),
        supabase.from('dars_qadam_progress').select('student_id, created_at').in('student_id', idlar),
        supabase.from('talim_natijalari').select('student_id, created_at').in('student_id', idlar),
      ])
      setProfillar(new Map(((p.data as Profil[]) ?? []).map((x) => [x.id, x])))

      const m = new Map<string, string>()
      for (const r of [...(pr.data ?? []), ...(n.data ?? [])] as { student_id: string; created_at: string }[]) {
        const bor = m.get(r.student_id)
        if (!bor || r.created_at > bor) m.set(r.student_id, r.created_at)
      }
      setOxirgiFaollik(m)
      setYuklandi(true)
    }
    yukla()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Talaba bo'yicha guruhlangan faol obunalar
  const talabaObunalari = useMemo(() => {
    const m = new Map<string, ObunaQator[]>()
    for (const o of obunalar) {
      const arr = m.get(o.student_id) ?? []
      arr.push(o)
      m.set(o.student_id, arr)
    }
    return m
  }, [obunalar])

  const xavfZonasi = useMemo(() => {
    const r: { id: string; profil: Profil | undefined; bosqichlar: Bosqich[]; kunlar: number | null }[] = []
    talabaObunalari.forEach((obs, id) => {
      const oxirgi = oxirgiFaollik.get(id)
      const kunlar = oxirgi ? Math.floor((hozir - new Date(oxirgi).getTime()) / 86400000) : null
      if (kunlar === null || kunlar >= XAVF_KUN) {
        r.push({ id, profil: profillar.get(id), bosqichlar: obs.map((o) => o.bosqich), kunlar })
      }
    })
    return r.sort((a, b) => (b.kunlar ?? 9999) - (a.kunlar ?? 9999))
  }, [talabaObunalari, oxirgiFaollik, profillar, hozir])

  const tugaydiganlar = useMemo(() => {
    const chegara = hozir + TUGASH_KUN * 86400000
    return obunalar
      .filter((o) => o.tugash_sanasi && new Date(o.tugash_sanasi).getTime() <= chegara)
      .map((o) => ({
        ...o,
        profil: profillar.get(o.student_id),
        qoldi: Math.max(0, Math.ceil((new Date(o.tugash_sanasi!).getTime() - hozir) / 86400000)),
      }))
      .sort((a, b) => a.qoldi - b.qoldi)
  }, [obunalar, profillar, hozir])

  const eslatmaYubor = async (id: string, ism: string | null) => {
    setPushKetmoqda(id)
    try {
      const res = await fetch('/api/push/talaba', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          title: 'Darslaringiz sizni kutmoqda 📚',
          body: `${ism ?? 'Aziz talaba'}, ancha ko'rinmadingiz — progressingizni davom ettiring!`,
          url: '/student/darslar',
        }),
      })
      const json = await res.json()
      if (res.ok) setPushYuborilgan((s) => new Set(s).add(id))
      else alert(json.error ?? 'Xatolik')
    } finally {
      setPushKetmoqda(null)
    }
  }

  if (!yuklandi) return null

  const hammasiJoyida = xavfZonasi.length === 0 && tugaydiganlar.length === 0

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px',
      marginBottom: '32px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', margin: 0, fontWeight: 600 }}>
          💳 Obuna e&apos;tibor talab qiladi
        </h3>
        <span
          onClick={() => router.push('/admin/obunalar')}
          style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}
        >Obunalar sahifasi →</span>
      </div>

      {hammasiJoyida ? (
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
          ✅ Hammasi joyida — xavf zonasida talaba yo&apos;q, {TUGASH_KUN} kun ichida tugaydigan obuna yo&apos;q.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>

          {/* Xavf zonasi */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626', marginBottom: '8px' }}>
              ⚠️ Xavf zonasi — {XAVF_KUN}+ kun harakatsiz ({xavfZonasi.length})
            </div>
            {xavfZonasi.length === 0 ? (
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>✅ Bo&apos;sh — obunali talabalar faol.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {xavfZonasi.slice(0, 6).map((x) => (
                  <div key={x.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: '#dc26260a', border: '1px solid #dc262622', borderRadius: '12px',
                    padding: '10px 13px',
                  }}>
                    <div
                      onClick={() => router.push(`/admin/talabalar-nazorati/${x.id}`)}
                      style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                    >
                      <div style={{ fontSize: '12.5px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {x.bosqichlar.map((b) => BOSQICH_EMOJI[b]).join('')} {x.profil?.full_name ?? x.profil?.email ?? '—'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700 }}>
                        {x.kunlar === null ? 'Umuman boshlamagan' : `${x.kunlar} kun harakatsiz`}
                      </div>
                    </div>
                    <button
                      onClick={() => eslatmaYubor(x.id, x.profil?.full_name ?? null)}
                      disabled={pushYuborilgan.has(x.id) || pushKetmoqda === x.id}
                      className="soft-press"
                      style={{
                        background: pushYuborilgan.has(x.id) ? 'var(--surface-2)' : '#dc2626',
                        color: pushYuborilgan.has(x.id) ? 'var(--muted)' : 'white',
                        border: 'none', borderRadius: '10px', padding: '7px 12px',
                        fontSize: '11px', fontWeight: 800, flexShrink: 0,
                        cursor: pushYuborilgan.has(x.id) ? 'default' : 'pointer',
                      }}
                    >
                      {pushKetmoqda === x.id ? '...' : pushYuborilgan.has(x.id) ? '✅ Yuborildi' : '🔔 Eslatma'}
                    </button>
                  </div>
                ))}
                {xavfZonasi.length > 6 && (
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>
                    ... va yana {xavfZonasi.length - 6} ta talaba
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Yaqinda tugaydiganlar */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#d97706', marginBottom: '8px' }}>
              ⏰ {TUGASH_KUN} kun ichida tugaydi ({tugaydiganlar.length})
            </div>
            {tugaydiganlar.length === 0 ? (
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--muted)' }}>✅ Bo&apos;sh — yaqin orada tugaydigan obuna yo&apos;q.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tugaydiganlar.slice(0, 6).map((t) => (
                  <div
                    key={`${t.student_id}-${t.bosqich}`}
                    onClick={() => router.push('/admin/obunalar')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                      background: '#d977060a', border: '1px solid #d9770622', borderRadius: '12px',
                      padding: '10px 13px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {BOSQICH_EMOJI[t.bosqich]} {t.profil?.full_name ?? t.profil?.email ?? '—'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                        {t.bosqich.toUpperCase()} · {new Date(t.tugash_sanasi!).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric' })} gacha
                      </div>
                    </div>
                    <span style={{
                      fontSize: '11px', fontWeight: 900, color: t.qoldi <= 2 ? '#dc2626' : '#d97706',
                      background: (t.qoldi <= 2 ? '#dc2626' : '#d97706') + '14',
                      borderRadius: '999px', padding: '4px 10px', flexShrink: 0,
                    }}>
                      {t.qoldi === 0 ? 'Bugun' : `${t.qoldi} kun`}
                    </span>
                  </div>
                ))}
                {tugaydiganlar.length > 6 && (
                  <span style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 600 }}>
                    ... va yana {tugaydiganlar.length - 6} ta obuna
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
