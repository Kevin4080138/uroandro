'use client'

// Push bildirishnoma yuborish — auditoriya tanlab ommaviy xabar jo'natish + tarix.

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'

type Xabar = {
  id: string
  title: string
  body: string
  url: string | null
  auditoriya: string
  yuborildi: number
  created_at: string
}

const AUDITORIYALAR = [
  { id: 'hammasi', nom: '👥 Hammaga' },
  { id: 'student', nom: '🎓 Talabalarga' },
  { id: 'doctor', nom: '👨‍⚕️ Shifokorlarga' },
  { id: 'patient', nom: '🧑 Bemorlarga' },
]

export default function AdminPushPage() {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('')
  const [auditoriya, setAuditoriya] = useState('hammasi')
  const [yuborilmoqda, setYuborilmoqda] = useState(false)
  const [natija, setNatija] = useState<string | null>(null)
  const [tarix, setTarix] = useState<Xabar[]>([])

  const tarixYukla = async () => {
    const { data } = await supabase
      .from('push_xabarlar')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
    setTarix((data as Xabar[]) ?? [])
  }

  useEffect(() => {
    Promise.resolve().then(tarixYukla)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const yubor = async () => {
    if (!title.trim() || !body.trim()) { setNatija('❌ Sarlavha va matn majburiy'); return }
    if (!confirm(`"${AUDITORIYALAR.find((a) => a.id === auditoriya)?.nom}" auditoriyasiga push yuborilsinmi?`)) return
    setYuborilmoqda(true)
    setNatija(null)
    try {
      const res = await fetch('/api/push/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, url: url || undefined, auditoriya }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Xatolik')
      setNatija(`✅ ${json.yuborildi} ta qurilmaga yuborildi (jami ${json.qurilmalar} ta obunachi qurilma)`)
      setTitle(''); setBody(''); setUrl('')
      tarixYukla()
    } catch (e) {
      setNatija(`❌ ${e instanceof Error ? e.message : 'Xatolik yuz berdi'}`)
    } finally {
      setYuborilmoqda(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Dashboard" />

      <div className="mx-auto max-w-[760px] px-6 py-8">
        <h1 style={{ margin: '0 0 6px', fontSize: '23px', fontWeight: 900 }}>🔔 Push bildirishnoma</h1>
        <p style={{ margin: '0 0 20px', color: 'var(--muted)', fontSize: '13px' }}>
          Tanlangan auditoriyaning push obunachi qurilmalariga ommaviy xabar yuboriladi
        </p>

        {/* Forma */}
        <div className="rise" style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
          padding: '22px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>AUDITORIYA</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {AUDITORIYALAR.map((a) => (
                <button key={a.id} onClick={() => setAuditoriya(a.id)} className="soft-press" style={{
                  background: auditoriya === a.id ? 'var(--accent)' : 'var(--surface-2)',
                  color: auditoriya === a.id ? 'white' : 'var(--ink-soft)',
                  border: auditoriya === a.id ? 'none' : '1px solid var(--line)',
                  borderRadius: '999px', padding: '8px 16px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer',
                }}>{a.nom}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>SARLAVHA</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              placeholder="Masalan: Yangi dars qo'shildi!"
              style={{
                width: '100%', background: 'var(--surface-2)', border: '1px solid var(--line)',
                borderRadius: '12px', padding: '11px 14px', fontSize: '13.5px', color: 'var(--ink)', outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>MATN</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Qisqa va aniq xabar matni..."
              style={{
                width: '100%', background: 'var(--surface-2)', border: '1px solid var(--line)',
                borderRadius: '12px', padding: '11px 14px', fontSize: '13.5px', color: 'var(--ink)', outline: 'none',
                resize: 'vertical', fontFamily: 'inherit',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>HAVOLA (ixtiyoriy)</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/student/darslar"
              style={{
                width: '100%', background: 'var(--surface-2)', border: '1px solid var(--line)',
                borderRadius: '12px', padding: '11px 14px', fontSize: '13.5px', color: 'var(--ink)', outline: 'none',
              }}
            />
          </div>

          <button
            onClick={yubor}
            disabled={yuborilmoqda}
            className="soft-press"
            style={{
              background: yuborilmoqda ? 'var(--surface-2)' : 'var(--accent)',
              color: yuborilmoqda ? 'var(--muted)' : 'white',
              border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 800,
              cursor: yuborilmoqda ? 'wait' : 'pointer',
            }}
          >
            {yuborilmoqda ? 'Yuborilmoqda...' : '📤 Yuborish'}
          </button>

          {natija && (
            <div style={{
              fontSize: '13px', fontWeight: 700, padding: '11px 14px', borderRadius: '12px',
              background: natija.startsWith('✅') ? '#16a34a14' : '#dc262614',
              color: natija.startsWith('✅') ? '#16a34a' : '#dc2626',
            }}>{natija}</div>
          )}
        </div>

        {/* Tarix */}
        <h2 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 900 }}>📜 Yuborilganlar tarixi</h2>
        {tarix.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Hali xabar yuborilmagan.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tarix.map((x) => (
              <div key={x.id} style={{
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px',
                padding: '14px 18px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800 }}>{x.title}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 800, color: 'var(--accent)',
                    background: 'var(--surface-2)', borderRadius: '999px', padding: '2px 9px',
                  }}>{AUDITORIYALAR.find((a) => a.id === x.auditoriya)?.nom ?? x.auditoriya}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto' }}>
                    {new Date(x.created_at).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{x.body}</p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
                  <span>📲 {x.yuborildi} ta qurilmaga yetdi</span>
                  {x.url && <span>🔗 {x.url}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
