'use client'

// Obunalar boshqaruvi — Telegram orqali to'lov qilgan talabaga bosqich obunasini
// berish, uzaytirish yoki o'chirish. useObuna/RLS shu jadvalga tayanadi.

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import type { Bosqich } from '@/lib/talim/darslar'

type Obuna = {
  id: string
  student_id: string
  bosqich: Bosqich
  faol: boolean
  tugash_sanasi: string | null
  created_at: string
}

type Talaba = { id: string; full_name: string | null; email: string | null; telefon: string | null }

const BOSQICH_NOMI: Record<string, string> = { oson: '🟢 Oson', "o'rta": "🟡 O'rta", qiyin: '🔴 Qiyin' }
const BOSQICH_RANG: Record<string, string> = { oson: '#16a34a', "o'rta": '#d97706', qiyin: '#dc2626' }

function sanaFmt(s: string | null): string {
  if (!s) return 'Muddatsiz'
  return new Date(s).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' })
}

function amaldami(o: Obuna): boolean {
  return o.faol && (!o.tugash_sanasi || new Date(o.tugash_sanasi) > new Date())
}

export default function AdminObunalarPage() {
  const supabase = createClient()
  const [obunalar, setObunalar] = useState<Obuna[]>([])
  const [talabalar, setTalabalar] = useState<Talaba[]>([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xabar, setXabar] = useState<string | null>(null)

  // Yangi obuna formasi
  const [qidiruv, setQidiruv] = useState('')
  const [tanlangan, setTanlangan] = useState<Talaba | null>(null)
  const [bosqich, setBosqich] = useState<Bosqich>("o'rta")
  const [muddatOy, setMuddatOy] = useState('')

  const yukla = async () => {
    const [o, t] = await Promise.all([
      supabase.from('obunalar').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name, email, telefon').eq('role', 'student').eq('arxivlangan', false),
    ])
    setObunalar((o.data as Obuna[]) ?? [])
    setTalabalar((t.data as Talaba[]) ?? [])
    setYuklanmoqda(false)
  }

  useEffect(() => {
    Promise.resolve().then(yukla)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const talabaMap = useMemo(() => new Map(talabalar.map((t) => [t.id, t])), [talabalar])

  const qidiruvNatija = useMemo(() => {
    if (!qidiruv.trim() || tanlangan) return []
    const q = qidiruv.trim().toLowerCase()
    return talabalar.filter((t) =>
      (t.full_name ?? '').toLowerCase().includes(q) ||
      (t.email ?? '').toLowerCase().includes(q) ||
      (t.telefon ?? '').includes(q)
    ).slice(0, 8)
  }, [qidiruv, talabalar, tanlangan])

  const obunaBer = async () => {
    if (!tanlangan) { setXabar('❌ Avval talabani tanlang'); return }
    setXabar(null)
    const oy = muddatOy ? parseInt(muddatOy, 10) : null
    const tugash = oy ? new Date(Date.now() + oy * 30 * 86400000).toISOString() : null
    // Bir talaba + bosqich unikal — mavjud bo'lsa yangilanadi (uzaytirish ham shu yo'l bilan)
    const { error } = await supabase
      .from('obunalar')
      .upsert(
        { student_id: tanlangan.id, bosqich, faol: true, tugash_sanasi: tugash },
        { onConflict: 'student_id,bosqich' }
      )
    if (error) { setXabar(`❌ ${error.message}`); return }
    setXabar(`✅ ${tanlangan.full_name ?? 'Talaba'} uchun ${BOSQICH_NOMI[bosqich]} obunasi ochildi${oy ? ` (${oy} oy)` : ' (muddatsiz)'}`)
    setTanlangan(null); setQidiruv(''); setMuddatOy('')
    yukla()
  }

  const bekorQil = async (o: Obuna) => {
    const t = talabaMap.get(o.student_id)
    if (!confirm(`${t?.full_name ?? 'Talaba'}ning ${BOSQICH_NOMI[o.bosqich]} obunasini o'chirishni tasdiqlaysizmi?`)) return
    await supabase.from('obunalar').update({ faol: false }).eq('id', o.id)
    yukla()
  }

  const qaytaFaollashtir = async (o: Obuna) => {
    await supabase.from('obunalar').update({ faol: true }).eq('id', o.id)
    yukla()
  }

  const faollar = obunalar.filter(amaldami).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[860px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>💳 Obunalar</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          To&apos;lov tasdiqlangach shu yerda obuna ochasiz — talaba darhol bosqichga kira oladi.
          Hozir <strong style={{ color: 'var(--ink)' }}>{faollar}</strong> ta amaldagi obuna bor.
        </p>

        {/* Yangi obuna berish */}
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 900 }}>➕ Obuna berish / uzaytirish</div>

          {/* Talaba tanlash */}
          {tanlangan ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'var(--surface-2)', border: '1px solid var(--accent)', borderRadius: '12px',
              padding: '10px 14px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 800 }}>{tanlangan.full_name ?? '—'}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{tanlangan.email ?? tanlangan.telefon ?? ''}</div>
              </div>
              <button onClick={() => { setTanlangan(null); setQidiruv('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '15px' }}>✕</button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <input
                value={qidiruv}
                onChange={(e) => setQidiruv(e.target.value)}
                placeholder="Talabani qidiring: ism, email yoki telefon..."
                style={{
                  width: '100%', background: 'var(--surface-2)', border: '1px solid var(--line)',
                  borderRadius: '12px', padding: '11px 14px', fontSize: '13.5px', color: 'var(--ink)', outline: 'none',
                }}
              />
              {qidiruvNatija.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, marginTop: '4px',
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px',
                  boxShadow: 'var(--shadow)', overflow: 'hidden',
                }}>
                  {qidiruvNatija.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTanlangan(t)}
                      className="list-row"
                      style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--line)' }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 700 }}>{t.full_name ?? '—'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{t.email ?? t.telefon ?? ''}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['oson', "o'rta", 'qiyin'] as Bosqich[]).map((b) => (
                <button key={b} onClick={() => setBosqich(b)} className="soft-press" style={{
                  background: bosqich === b ? BOSQICH_RANG[b] : 'var(--surface-2)',
                  color: bosqich === b ? 'white' : 'var(--ink-soft)',
                  border: bosqich === b ? 'none' : '1px solid var(--line)',
                  borderRadius: '999px', padding: '8px 15px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                }}>{BOSQICH_NOMI[b]}</button>
              ))}
            </div>
            <input
              value={muddatOy}
              onChange={(e) => setMuddatOy(e.target.value)}
              placeholder="Muddat (oy) — bo'sh = muddatsiz"
              inputMode="numeric"
              style={{
                width: '220px', background: 'var(--surface-2)', border: '1px solid var(--line)',
                borderRadius: '12px', padding: '9px 14px', fontSize: '12.5px', color: 'var(--ink)', outline: 'none',
              }}
            />
            <button onClick={obunaBer} className="soft-press" style={{
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '12px', padding: '10px 22px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
            }}>
              ✅ Obuna ochish
            </button>
          </div>

          {xabar && (
            <div style={{
              fontSize: '12.5px', fontWeight: 700, padding: '10px 14px', borderRadius: '12px',
              background: xabar.startsWith('✅') ? '#16a34a14' : '#dc262614',
              color: xabar.startsWith('✅') ? '#16a34a' : '#dc2626',
            }}>{xabar}</div>
          )}
        </div>

        {/* Ro'yxat */}
        <h2 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 900 }}>📜 Barcha obunalar</h2>
        {yuklanmoqda ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Yuklanmoqda...</p>
        ) : obunalar.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hali obuna berilmagan.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {obunalar.map((o) => {
              const t = talabaMap.get(o.student_id)
              const amal = amaldami(o)
              return (
                <div key={o.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                  padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                  opacity: amal ? 1 : 0.6,
                }}>
                  <span style={{
                    fontSize: '10.5px', fontWeight: 900, color: BOSQICH_RANG[o.bosqich],
                    background: BOSQICH_RANG[o.bosqich] + '14', borderRadius: '999px', padding: '3px 10px', flexShrink: 0,
                  }}>{BOSQICH_NOMI[o.bosqich]}</span>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{t?.full_name ?? '—'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{t?.email ?? t?.telefon ?? o.student_id}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: amal ? '#16a34a' : '#dc2626' }}>
                      {amal ? '✅ Amalda' : o.faol ? '⌛ Muddati tugagan' : "🚫 O'chirilgan"}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{sanaFmt(o.tugash_sanasi)}</div>
                  </div>
                  {o.faol ? (
                    <button onClick={() => bekorQil(o)} className="soft-press" style={{
                      background: '#dc262614', color: '#dc2626', border: '1px solid #dc262633',
                      borderRadius: '10px', padding: '7px 13px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer', flexShrink: 0,
                    }}>O&apos;chirish</button>
                  ) : (
                    <button onClick={() => qaytaFaollashtir(o)} className="soft-press" style={{
                      background: '#16a34a14', color: '#16a34a', border: '1px solid #16a34a33',
                      borderRadius: '10px', padding: '7px 13px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer', flexShrink: 0,
                    }}>Faollashtirish</button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
