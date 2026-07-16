'use client'

// Tariflar — bosqichlar narxini boshqarish. Faol tariflar talaba tomonda
// (darslar sahifasi kartalari va dars qulf ekranida) ko'rsatiladi.

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import type { Bosqich } from '@/lib/talim/darslar'
import { narxFmt } from '@/lib/talim/tariflar'

type Tarif = {
  id: string
  bosqich: Bosqich
  nom: string
  narx: number
  muddat_oy: number | null
  tavsif: string | null
  faol: boolean
  tartib: number
}

const BOSQICH_NOMI: Record<string, string> = { oson: '🟢 Oson', "o'rta": "🟡 O'rta", qiyin: '🔴 Qiyin' }
const BOSQICH_RANG: Record<string, string> = { oson: '#16a34a', "o'rta": '#d97706', qiyin: '#dc2626' }

export default function AdminTariflarPage() {
  const supabase = createClient()
  const [royxat, setRoyxat] = useState<Tarif[]>([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [xabar, setXabar] = useState<string | null>(null)

  // Forma
  const [tahrirId, setTahrirId] = useState<string | null>(null)
  const [bosqich, setBosqich] = useState<Bosqich>("o'rta")
  const [nom, setNom] = useState('')
  const [narx, setNarx] = useState('')
  const [muddatOy, setMuddatOy] = useState('')
  const [tavsif, setTavsif] = useState('')

  const yukla = async () => {
    const { data } = await supabase.from('tariflar').select('*').order('tartib').order('created_at')
    setRoyxat((data as Tarif[]) ?? [])
    setYuklanmoqda(false)
  }

  useEffect(() => {
    Promise.resolve().then(yukla)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tozala = () => {
    setTahrirId(null); setNom(''); setNarx(''); setMuddatOy(''); setTavsif(''); setBosqich("o'rta")
  }

  const saqla = async () => {
    const narxSon = parseInt(narx.replace(/\D/g, ''), 10)
    if (!nom.trim() || !narxSon) { setXabar('❌ Nom va narx majburiy'); return }
    setXabar(null)
    const body = {
      bosqich, nom: nom.trim(), narx: narxSon,
      muddat_oy: muddatOy ? parseInt(muddatOy, 10) : null,
      tavsif: tavsif.trim() || null,
    }
    if (tahrirId) {
      const { error } = await supabase.from('tariflar').update(body).eq('id', tahrirId)
      setXabar(error ? `❌ ${error.message}` : '✅ Yangilandi')
    } else {
      const { error } = await supabase.from('tariflar').insert(body)
      setXabar(error ? `❌ ${error.message}` : "✅ Qo'shildi")
    }
    tozala()
    yukla()
  }

  const tahrirla = (t: Tarif) => {
    setTahrirId(t.id); setBosqich(t.bosqich); setNom(t.nom)
    setNarx(String(t.narx)); setMuddatOy(t.muddat_oy ? String(t.muddat_oy) : ''); setTavsif(t.tavsif ?? '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const faolToggle = async (t: Tarif) => {
    await supabase.from('tariflar').update({ faol: !t.faol }).eq('id', t.id)
    yukla()
  }

  const ochir = async (t: Tarif) => {
    if (!confirm(`"${t.nom}" tarifini o'chirishni tasdiqlaysizmi?`)) return
    await supabase.from('tariflar').delete().eq('id', t.id)
    yukla()
  }

  const inputStil = {
    width: '100%', background: 'var(--surface-2)', border: '1px solid var(--line)',
    borderRadius: '12px', padding: '11px 14px', fontSize: '13.5px', color: 'var(--ink)', outline: 'none',
  } as const

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[760px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>💎 Tariflar</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          Faol tariflar talaba tomonda bosqich kartalari va dars qulf ekranida ko&apos;rinadi
        </p>

        {/* Forma */}
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '20px', marginBottom: '22px', display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['oson', "o'rta", 'qiyin'] as Bosqich[]).map((b) => (
              <button key={b} onClick={() => setBosqich(b)} className="soft-press" style={{
                background: bosqich === b ? BOSQICH_RANG[b] : 'var(--surface-2)',
                color: bosqich === b ? 'white' : 'var(--ink-soft)',
                border: bosqich === b ? 'none' : '1px solid var(--line)',
                borderRadius: '999px', padding: '8px 16px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
              }}>{BOSQICH_NOMI[b]}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Tarif nomi (masalan: 3 oylik)" style={inputStil} />
            <input value={narx} onChange={(e) => setNarx(e.target.value)} placeholder="Narx (so'm, masalan 299000)" inputMode="numeric" style={inputStil} />
            <input value={muddatOy} onChange={(e) => setMuddatOy(e.target.value)} placeholder="Muddat (oy) — bo'sh = muddatsiz" inputMode="numeric" style={inputStil} />
          </div>
          <input value={tavsif} onChange={(e) => setTavsif(e.target.value)} placeholder="Qisqa tavsif (ixtiyoriy)" style={inputStil} />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={saqla} className="soft-press" style={{
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '12px', padding: '11px 22px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
            }}>
              {tahrirId ? '💾 Saqlash' : "➕ Qo'shish"}
            </button>
            {tahrirId && (
              <button onClick={tozala} className="soft-press" style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                borderRadius: '12px', padding: '11px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}>Bekor qilish</button>
            )}
            {xabar && <span style={{ fontSize: '12.5px', fontWeight: 700, color: xabar.startsWith('✅') ? '#16a34a' : '#dc2626' }}>{xabar}</span>}
          </div>
        </div>

        {/* Ro'yxat */}
        {yuklanmoqda ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Yuklanmoqda...</p>
        ) : royxat.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hali tarif qo&apos;shilmagan.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {royxat.map((t) => (
              <div key={t.id} style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                padding: '14px 18px', opacity: t.faol ? 1 : 0.55,
                display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
              }}>
                <span style={{
                  fontSize: '10.5px', fontWeight: 900, color: BOSQICH_RANG[t.bosqich],
                  background: BOSQICH_RANG[t.bosqich] + '14', borderRadius: '999px', padding: '3px 10px',
                }}>{BOSQICH_NOMI[t.bosqich]}</span>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800 }}>{!t.faol && '🚫 '}{t.nom}</div>
                  {t.tavsif && <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>{t.tavsif}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: BOSQICH_RANG[t.bosqich] }}>{narxFmt(t.narx)}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                    {t.muddat_oy ? `${t.muddat_oy} oy` : 'Muddatsiz'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => tahrirla(t)} title="Tahrirlash" className="soft-press" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>✏️</button>
                  <button onClick={() => faolToggle(t)} title={t.faol ? 'Yashirish' : 'Faollashtirish'} className="soft-press" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>{t.faol ? '👁' : '🚫'}</button>
                  <button onClick={() => ochir(t)} title="O'chirish" className="soft-press" style={{ background: '#dc262614', border: '1px solid #dc262633', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
