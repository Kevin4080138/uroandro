'use client'

// Savol-Javoblar (FAQ) boshqaruvi — CRUD. Talaba tomonda /student/profil/faq da ko'rinadi.

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Faq = { id: string; savol: string; javob: string; tartib: number; faol: boolean }

export default function AdminFaqPage() {
  const supabase = createClient()
  const [royxat, setRoyxat] = useState<Faq[]>([])
  const [yuklanmoqda, setYuklanmoqda] = useState(true)
  const [savol, setSavol] = useState('')
  const [javob, setJavob] = useState('')
  const [tahrirId, setTahrirId] = useState<string | null>(null)
  const [xabar, setXabar] = useState<string | null>(null)

  const yukla = async () => {
    const { data } = await supabase.from('faq').select('*').order('tartib').order('created_at')
    setRoyxat((data as Faq[]) ?? [])
    setYuklanmoqda(false)
  }

  useEffect(() => {
    Promise.resolve().then(yukla)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saqla = async () => {
    if (!savol.trim() || !javob.trim()) { setXabar('❌ Savol va javob majburiy'); return }
    setXabar(null)
    if (tahrirId) {
      const { error } = await supabase.from('faq').update({ savol: savol.trim(), javob: javob.trim() }).eq('id', tahrirId)
      setXabar(error ? `❌ ${error.message}` : '✅ Yangilandi')
    } else {
      const maxTartib = royxat.reduce((m, f) => Math.max(m, f.tartib), 0)
      const { error } = await supabase.from('faq').insert({ savol: savol.trim(), javob: javob.trim(), tartib: maxTartib + 1 })
      setXabar(error ? `❌ ${error.message}` : "✅ Qo'shildi")
    }
    setSavol(''); setJavob(''); setTahrirId(null)
    yukla()
  }

  const tahrirla = (f: Faq) => {
    setTahrirId(f.id); setSavol(f.savol); setJavob(f.javob)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const faolToggle = async (f: Faq) => {
    await supabase.from('faq').update({ faol: !f.faol }).eq('id', f.id)
    yukla()
  }

  const ochir = async (f: Faq) => {
    if (!confirm(`"${f.savol.slice(0, 60)}" savolini o'chirishni tasdiqlaysizmi?`)) return
    await supabase.from('faq').delete().eq('id', f.id)
    yukla()
  }

  const surish = async (indeks: number, yonalish: -1 | 1) => {
    const j = indeks + yonalish
    if (j < 0 || j >= royxat.length) return
    const a = royxat[indeks], b = royxat[j]
    await Promise.all([
      supabase.from('faq').update({ tartib: b.tartib }).eq('id', a.id),
      supabase.from('faq').update({ tartib: a.tartib }).eq('id', b.id),
    ])
    yukla()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[760px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>❔ Savol-Javoblar</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          Talabalar profildagi &quot;Savol-Javoblar&quot; sahifasida ko&apos;radi
        </p>

        {/* Forma */}
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '20px', marginBottom: '22px', display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          <input
            value={savol}
            onChange={(e) => setSavol(e.target.value)}
            placeholder="Savol..."
            style={{
              width: '100%', background: 'var(--surface-2)', border: '1px solid var(--line)',
              borderRadius: '12px', padding: '11px 14px', fontSize: '13.5px', color: 'var(--ink)', outline: 'none',
            }}
          />
          <textarea
            value={javob}
            onChange={(e) => setJavob(e.target.value)}
            rows={3}
            placeholder="Javob..."
            style={{
              width: '100%', background: 'var(--surface-2)', border: '1px solid var(--line)',
              borderRadius: '12px', padding: '11px 14px', fontSize: '13.5px', color: 'var(--ink)', outline: 'none',
              resize: 'vertical', fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={saqla} className="soft-press" style={{
              background: 'var(--accent)', color: 'white', border: 'none',
              borderRadius: '12px', padding: '11px 22px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
            }}>
              {tahrirId ? '💾 Saqlash' : "➕ Qo'shish"}
            </button>
            {tahrirId && (
              <button onClick={() => { setTahrirId(null); setSavol(''); setJavob('') }} className="soft-press" style={{
                background: 'var(--surface-2)', color: 'var(--ink-soft)', border: '1px solid var(--line)',
                borderRadius: '12px', padding: '11px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}>Bekor qilish</button>
            )}
            {xabar && <span style={{ fontSize: '12.5px', fontWeight: 700, color: xabar.startsWith('✅') ? '#16a34a' : '#dc2626' }}>{xabar}</span>}
          </div>
        </div>

        {/* Ro'yxat */}
        {yuklanmoqda ? (
          <UrosferaLoaderMini />
        ) : royxat.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hali savol qo&apos;shilmagan.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {royxat.map((f, i) => (
              <div key={f.id} style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                padding: '14px 18px', opacity: f.faol ? 1 : 0.55,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, marginBottom: '4px' }}>
                      {!f.faol && '🚫 '}{f.savol}
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{f.javob}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button onClick={() => surish(i, -1)} disabled={i === 0} title="Yuqoriga" className="soft-press" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', padding: '5px 8px', cursor: i === 0 ? 'default' : 'pointer', fontSize: '11px', opacity: i === 0 ? .4 : 1 }}>↑</button>
                    <button onClick={() => surish(i, 1)} disabled={i === royxat.length - 1} title="Pastga" className="soft-press" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', padding: '5px 8px', cursor: i === royxat.length - 1 ? 'default' : 'pointer', fontSize: '11px', opacity: i === royxat.length - 1 ? .4 : 1 }}>↓</button>
                    <button onClick={() => tahrirla(f)} title="Tahrirlash" className="soft-press" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>✏️</button>
                    <button onClick={() => faolToggle(f)} title={f.faol ? 'Yashirish' : 'Faollashtirish'} className="soft-press" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>{f.faol ? '👁' : '🚫'}</button>
                    <button onClick={() => ochir(f)} title="O'chirish" className="soft-press" style={{ background: '#dc262614', border: '1px solid #dc262633', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', fontSize: '11px' }}>🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
