'use client'

import { useMemo, useRef, useState } from 'react'
import { Header } from '@/components/Header'
import { createClient } from '@/lib/supabase'
import { DARSLAR } from '@/lib/talim/darslar'

type DarsTarkibi = {
  dars_slug: string
  asosiy_video_url: string | null
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

  const [asosiyVideoUrl, setAsosiyVideoUrl] = useState('')
  const [videoLinklarMatn, setVideoLinklarMatn] = useState('')
  const [konspektFayl, setKonspektFayl] = useState<File | null>(null)
  const [prezentatsiyaFayl, setPrezentatsiyaFayl] = useState<File | null>(null)
  const konspektInput = useRef<HTMLInputElement>(null)
  const prezentatsiyaInput = useRef<HTMLInputElement>(null)

  const royxat = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    return q ? DARSLAR.filter((d) => d.sarlavha.toLowerCase().includes(q)) : DARSLAR
  }, [qidiruv])

  const tanla = async (slug: string) => {
    setTanlanganSlug(slug)
    setXabar(null)
    setKonspektFayl(null)
    setPrezentatsiyaFayl(null)
    if (konspektInput.current) konspektInput.current.value = ''
    if (prezentatsiyaInput.current) prezentatsiyaInput.current.value = ''
    setYuklanmoqda(true)
    const { data } = await supabase.from('dars_tarkibi').select('dars_slug, asosiy_video_url, video_linklar, konspekt_url, prezentatsiya_url').eq('dars_slug', slug).maybeSingle()
    setTarkib((data as DarsTarkibi) ?? null)
    setAsosiyVideoUrl(data?.asosiy_video_url ?? '')
    setVideoLinklarMatn((data?.video_linklar ?? []).join('\n'))
    setYuklanmoqda(false)
  }

  const BUCKET = 'dars-materiallari'

  // Yangi fayl yuklashdan oldin eski faylni storage dan o'chiradi
  const faylYoliniOl = async (fayl: File, papka: string, eskiYol: string | null | undefined): Promise<string> => {
    if (eskiYol) {
      await supabase.storage.from(BUCKET).remove([eskiYol])
    }
    const yol = `${tanlanganSlug}/${papka}-${crypto.randomUUID()}_${fayl.name}`
    const { error } = await supabase.storage.from(BUCKET).upload(yol, fayl)
    if (error) throw error
    return yol
  }

  const koʻrishUchunOch = async (yol: string) => {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(yol, 3600)
    if (error || !data) return
    const kengaytma = yol.split('.').pop()?.toLowerCase() ?? ''
    if (['pptx', 'ppt', 'docx', 'doc'].includes(kengaytma)) {
      // MS Office Online viewer — PPTX/DOCX ni to'liq sifatda ko'rsatadi
      const viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(data.signedUrl)}`
      window.open(viewerUrl, '_blank')
    } else {
      window.open(data.signedUrl, '_blank')
    }
  }

  const saqla = async () => {
    if (!tanlanganSlug) return
    setSaqlanmoqda(true)
    setXabar(null)
    try {
      const asosiyVideo = asosiyVideoUrl.trim() || null
      const videoLinklar = videoLinklarMatn.split('\n').map((s) => s.trim()).filter(Boolean)
      const konspektUrl = konspektFayl ? await faylYoliniOl(konspektFayl, 'konspekt', tarkib?.konspekt_url) : tarkib?.konspekt_url ?? null
      const prezentatsiyaUrl = prezentatsiyaFayl ? await faylYoliniOl(prezentatsiyaFayl, 'prezentatsiya', tarkib?.prezentatsiya_url) : tarkib?.prezentatsiya_url ?? null
      // bosqich/bepul_namuna — obuna/RLS tekshiruvi shularni o'qiydi, shu sababli darslar.ts bilan avtomatik sinxronlanadi.
      const darsMa = DARSLAR.find((d) => d.slug === tanlanganSlug)
      const bosqich = darsMa?.bosqich ?? null
      const bepulNamuna = darsMa?.bepulNamuna ?? false

      const { error } = await supabase.from('dars_tarkibi').upsert(
        { dars_slug: tanlanganSlug, bosqich, bepul_namuna: bepulNamuna, asosiy_video_url: asosiyVideo, video_linklar: videoLinklar, konspekt_url: konspektUrl, prezentatsiya_url: prezentatsiyaUrl },
        { onConflict: 'dars_slug' }
      )
      if (error) throw error

      setTarkib({ dars_slug: tanlanganSlug, asosiy_video_url: asosiyVideo, video_linklar: videoLinklar, konspekt_url: konspektUrl, prezentatsiya_url: prezentatsiyaUrl })
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
                <label style={labelStyle}>Asosiy dars videosi (YouTube, Instagram yoki Facebook havolasi)</label>
                <input
                  style={inputStyle}
                  value={asosiyVideoUrl}
                  onChange={(e) => setAsosiyVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Qo&apos;shimcha videolar (har biri yangi qatordan — YouTube, Instagram, Facebook)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '90px' }}
                  value={videoLinklarMatn}
                  onChange={(e) => setVideoLinklarMatn(e.target.value)}
                  placeholder={'https://youtube.com/watch?v=...\nhttps://instagram.com/reel/...\nhttps://facebook.com/.../videos/...'}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Konspekt (PDF, DOCX)</label>
                {tarkib?.konspekt_url && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12.5px' }}>
                    Hozirgi fayl: <strong>{tarkib.konspekt_url.split('/').pop()}</strong> —{' '}
                    <button onClick={() => koʻrishUchunOch(tarkib.konspekt_url!)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', cursor: 'pointer', fontSize: '12.5px' }}>
                      ko&apos;rish ↗
                    </button>
                    <span style={{ color: 'var(--muted)', marginLeft: '6px', fontSize: '11px' }}>(yangi yuklasangiz eski o&apos;chadi)</span>
                  </p>
                )}
                <input ref={konspektInput} type="file" accept="application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setKonspektFayl(e.target.files?.[0] ?? null)} style={{ color: 'var(--muted)', fontSize: '14px' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Prezentatsiya (PDF, PPTX, DOCX)</label>
                {tarkib?.prezentatsiya_url && (
                  <p style={{ margin: '0 0 8px 0', fontSize: '12.5px' }}>
                    Hozirgi fayl: <strong>{tarkib.prezentatsiya_url.split('/').pop()}</strong> —{' '}
                    <button onClick={() => koʻrishUchunOch(tarkib.prezentatsiya_url!)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', cursor: 'pointer', fontSize: '12.5px' }}>
                      ko&apos;rish ↗
                    </button>
                    <span style={{ color: 'var(--muted)', marginLeft: '6px', fontSize: '11px' }}>(yangi yuklasangiz eski o&apos;chadi)</span>
                  </p>
                )}
                <input ref={prezentatsiyaInput} type="file" accept="application/pdf,.ppt,.pptx,.doc,.docx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={(e) => setPrezentatsiyaFayl(e.target.files?.[0] ?? null)} style={{ color: 'var(--muted)', fontSize: '14px' }} />
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
