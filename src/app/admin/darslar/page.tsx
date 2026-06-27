'use client'

import { useMemo, useRef, useState } from 'react'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { DARSLAR } from '@/lib/talim/darslar'

type DarsTarkibi = {
  dars_slug: string
  video_linklar: string[] | null
  konspekt_url: string | null
  prezentatsiya_url: string | null
}

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px' }

export default function AdminDarslarPage() {
  const supabase = createClient()

  const [qidiruv, setQidiruv] = useState('')
  const [tanlanganSlug, setTanlanganSlug] = useState<string | null>(null)
  const [tarkib, setTarkib] = useState<DarsTarkibi | null>(null)
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [saqlanmoqda, setSaqlanmoqda] = useState(false)
  const [xabar, setXabar] = useState<string | null>(null)

  const [videoLinklarMatn, setVideoLinklarMatn] = useState('')
  const [konspektFayl, setKonspektFayl] = useState<File | null>(null)
  const [prezentatsiyaFayl, setPrezentatsiyaFayl] = useState<File | null>(null)
  const konspektInput = useRef<HTMLInputElement>(null)
  const prezentatsiyaInput = useRef<HTMLInputElement>(null)

  const royxat = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    const filtrlangan = q ? DARSLAR.filter((d) => d.sarlavha.toLowerCase().includes(q)) : DARSLAR
    return filtrlangan.slice(0, 50)
  }, [qidiruv])

  const tanla = async (slug: string) => {
    setTanlanganSlug(slug)
    setXabar(null)
    setKonspektFayl(null)
    setPrezentatsiyaFayl(null)
    if (konspektInput.current) konspektInput.current.value = ''
    if (prezentatsiyaInput.current) prezentatsiyaInput.current.value = ''
    setYuklanmoqda(true)
    const { data } = await supabase.from('dars_tarkibi').select('dars_slug, video_linklar, konspekt_url, prezentatsiya_url').eq('dars_slug', slug).maybeSingle()
    setTarkib((data as DarsTarkibi) ?? null)
    setVideoLinklarMatn((data?.video_linklar ?? []).join('\n'))
    setYuklanmoqda(false)
  }

  const faylUrlOl = async (fayl: File, papka: string): Promise<string> => {
    const yol = `dars-tarkibi/${tanlanganSlug}/${papka}-${crypto.randomUUID()}_${fayl.name}`
    const { error } = await supabase.storage.from('kutubxona').upload(yol, fayl)
    if (error) throw error
    return supabase.storage.from('kutubxona').getPublicUrl(yol).data.publicUrl
  }

  const saqla = async () => {
    if (!tanlanganSlug) return
    setSaqlanmoqda(true)
    setXabar(null)
    try {
      const videoLinklar = videoLinklarMatn.split('\n').map((s) => s.trim()).filter(Boolean)
      const konspektUrl = konspektFayl ? await faylUrlOl(konspektFayl, 'konspekt') : tarkib?.konspekt_url ?? null
      const prezentatsiyaUrl = prezentatsiyaFayl ? await faylUrlOl(prezentatsiyaFayl, 'prezentatsiya') : tarkib?.prezentatsiya_url ?? null

      const { error } = await supabase.from('dars_tarkibi').upsert(
        { dars_slug: tanlanganSlug, video_linklar: videoLinklar, konspekt_url: konspektUrl, prezentatsiya_url: prezentatsiyaUrl },
        { onConflict: 'dars_slug' }
      )
      if (error) throw error

      setTarkib({ dars_slug: tanlanganSlug, video_linklar: videoLinklar, konspekt_url: konspektUrl, prezentatsiya_url: prezentatsiyaUrl })
      setKonspektFayl(null)
      setPrezentatsiyaFayl(null)
      if (konspektInput.current) konspektInput.current.value = ''
      if (prezentatsiyaInput.current) prezentatsiyaInput.current.value = ''
      setXabar("✓ Saqlandi")
    } catch (e) {
      setXabar(`Xato: ${e instanceof Error ? e.message : "noma'lum xato"}`)
    }
    setSaqlanmoqda(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/admin/dashboard" backLabel="Admin bosh sahifasi" />
      <div className="fade-in px-8 py-8" style={{ maxWidth: '820px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>Darslar tarkibi</h2>
        <p style={{ margin: '0 0 24px 0', color: 'var(--muted)', fontSize: '13.5px' }}>
          Video linklar, konspekt va prezentatsiya fayllarini har bir dars uchun alohida yuklang.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Dars qidirish</label>
          <input
            style={inputStyle}
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            placeholder="masalan, varikotsele"
          />
        </div>

        <div style={{
          maxHeight: '220px', overflowY: 'auto', border: '1px solid var(--line)', borderRadius: '10px',
          marginBottom: '24px', background: 'var(--surface)',
        }}>
          {royxat.map((d) => (
            <div
              key={d.slug}
              onClick={() => tanla(d.slug)}
              style={{
                padding: '10px 14px', cursor: 'pointer', fontSize: '13.5px',
                background: tanlanganSlug === d.slug ? 'var(--accent-soft)' : 'transparent',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <strong>{d.sarlavha}</strong>
              <span style={{ color: 'var(--muted)', fontSize: '11.5px', marginLeft: '8px' }}>{d.kategoriya} · {d.bosqich}</span>
            </div>
          ))}
        </div>

        {tanlanganSlug && (
          yuklanmoqda ? (
            <p style={{ color: 'var(--muted)' }}>Yuklanmoqda...</p>
          ) : (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 18px 0', fontSize: '16px', color: 'var(--accent)' }}>
                {DARSLAR.find((d) => d.slug === tanlanganSlug)?.sarlavha}
              </h3>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Video linklar (har biri yangi qatordan, YouTube va h.k.)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '90px' }}
                  value={videoLinklarMatn}
                  onChange={(e) => setVideoLinklarMatn(e.target.value)}
                  placeholder={'https://youtube.com/watch?v=...\nhttps://youtube.com/watch?v=...'}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Konspekt (PDF)</label>
                {tarkib?.konspekt_url && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12.5px' }}>
                    Hozirgi: <a href={tarkib.konspekt_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>faylni ko&apos;rish ↗</a>
                  </p>
                )}
                <input ref={konspektInput} type="file" accept="application/pdf" onChange={(e) => setKonspektFayl(e.target.files?.[0] ?? null)} style={{ color: 'var(--muted)', fontSize: '14px' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Prezentatsiya (PDF/PPTX)</label>
                {tarkib?.prezentatsiya_url && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12.5px' }}>
                    Hozirgi: <a href={tarkib.prezentatsiya_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>faylni ko&apos;rish ↗</a>
                  </p>
                )}
                <input ref={prezentatsiyaInput} type="file" accept="application/pdf,.ppt,.pptx" onChange={(e) => setPrezentatsiyaFayl(e.target.files?.[0] ?? null)} style={{ color: 'var(--muted)', fontSize: '14px' }} />
              </div>

              <button onClick={saqla} disabled={saqlanmoqda} className="btn-animated" style={{
                background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px',
                padding: '12px 24px', cursor: saqlanmoqda ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600,
                opacity: saqlanmoqda ? 0.7 : 1,
              }}>
                {saqlanmoqda ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>

              {xabar && <p style={{ marginTop: '14px', fontSize: '13px', color: xabar.startsWith('Xato') ? 'var(--danger)' : 'var(--good)' }}>{xabar}</p>}
            </div>
          )
        )}
      </div>
    </div>
  )
}
