'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { UrosferaLoaderMini } from '@/components/UrosferaLoader'

type Xizmat = { nom: string; narx: string }
type Profil = {
  doctor_id: string; full_name: string; klinika_id: string | null
  mutaxassislik: string | null; ilmiy_daraja: string | null; tajriba_yil: number | null
  bio: string | null; xizmatlar: Xizmat[]; qabul_narxi: string | null
  ish_vaqti: string | null; telefon: string | null
}
type Klinika = { id: string; nom: string; manzil: string | null; telefon: string | null }
type Baho = { doctor_id: string; muomala: number; samara: number; tushuntirish: number; kutish: number; izoh: string | null }

const card = {
  background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px',
} as React.CSSProperties

function Yulduzlar({ qiymat, olcham = 15 }: { qiymat: number; olcham?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: '1px', fontSize: `${olcham}px`, lineHeight: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ opacity: qiymat >= i - 0.25 ? 1 : 0.25 }}>⭐</span>
      ))}
    </span>
  )
}

export default function ShifokorlarKatalogiPage() {
  const supabase = createClient()
  const [profillar, setProfillar] = useState<Profil[]>([])
  const [klinikalar, setKlinikalar] = useState<Record<string, Klinika>>({})
  const [baholar, setBaholar] = useState<Record<string, Baho[]>>({})
  const [loading, setLoading] = useState(true)
  const [qidiruv, setQidiruv] = useState('')
  const [ochiqId, setOchiqId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const [{ data: prof }, { data: kl }, { data: bah }] = await Promise.all([
        supabase.from('shifokor_profillari').select('*').eq('ochiq', true).order('full_name'),
        supabase.from('klinikalar').select('id, nom, manzil, telefon'),
        supabase.from('baholar').select('doctor_id, muomala, samara, tushuntirish, kutish, izoh'),
      ])
      setProfillar((prof as Profil[]) ?? [])
      const kmap: Record<string, Klinika> = {}
      for (const k of (kl as Klinika[]) ?? []) kmap[k.id] = k
      setKlinikalar(kmap)
      const bmap: Record<string, Baho[]> = {}
      for (const b of (bah as Baho[]) ?? []) (bmap[b.doctor_id] ??= []).push(b)
      setBaholar(bmap)
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reyting = (doctorId: string) => {
    const blar = baholar[doctorId] ?? []
    if (blar.length === 0) return null
    const ortacha = (kalit: keyof Omit<Baho, 'doctor_id' | 'izoh'>) =>
      blar.reduce((s, b) => s + (b[kalit] as number), 0) / blar.length
    const umumiy = (ortacha('muomala') + ortacha('samara') + ortacha('tushuntirish') + ortacha('kutish')) / 4
    return {
      umumiy, soni: blar.length,
      mezonlar: [
        { nom: 'Muomala', q: ortacha('muomala') },
        { nom: 'Davolash samarasi', q: ortacha('samara') },
        { nom: 'Tushuntirish', q: ortacha('tushuntirish') },
        { nom: 'Kutish vaqti', q: ortacha('kutish') },
      ],
      izohlar: blar.filter((b) => b.izoh?.trim()).map((b) => b.izoh!) ,
    }
  }

  const filtered = useMemo(() => {
    const q = qidiruv.trim().toLowerCase()
    if (!q) return profillar
    return profillar.filter((p) => {
      const kl = p.klinika_id ? klinikalar[p.klinika_id] : null
      const matn = [p.full_name, p.mutaxassislik, kl?.nom, kl?.manzil, ...(p.xizmatlar ?? []).map((x) => x.nom)]
        .filter(Boolean).join(' ').toLowerCase()
      return matn.includes(q)
    })
  }, [qidiruv, profillar, klinikalar])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Ochiq sahifa sarlavhasi */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
        padding: '14px 24px', borderBottom: '1px solid var(--line)', background: 'var(--surface)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--ink)', fontWeight: 800, fontSize: '17px' }}>
          🩺 Urosfera
        </Link>
        <Link href="/auth/login" style={{
          textDecoration: 'none', background: 'var(--accent)', color: 'white', borderRadius: '999px',
          padding: '8px 18px', fontSize: '13px', fontWeight: 600,
        }}>
          Kirish
        </Link>
      </header>

      <div className="fade-in mx-auto max-w-[760px] px-4 py-8 sm:px-8">
        <h1 style={{ fontSize: '26px', margin: '0 0 6px' }}>Farg&apos;ona urolog shifokorlari</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
          Shifokor tanlang — tajribasi, xizmatlari, narxlari va bemorlar baholari bilan tanishing.
        </p>

        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>🔍</span>
          <input
            placeholder="Shifokor, klinika yoki xizmat nomi..."
            value={qidiruv}
            onChange={(e) => setQidiruv(e.target.value)}
            style={{
              width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1.5px solid var(--line)',
              borderRadius: '999px', padding: '12px 16px 12px 40px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {loading ? (
          <UrosferaLoaderMini />
        ) : filtered.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👨‍⚕️</div>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14px' }}>
              {qidiruv ? 'Hech narsa topilmadi.' : "Katalogda hozircha shifokor yo'q — tez orada qo'shiladi."}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filtered.map((p) => {
              const kl = p.klinika_id ? klinikalar[p.klinika_id] : null
              const r = reyting(p.doctor_id)
              const ochiq = ochiqId === p.doctor_id
              const boshHarf = p.full_name.trim().split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase()
              return (
                <div key={p.doctor_id} style={{ ...card, cursor: 'pointer' }} onClick={() => setOchiqId(ochiq ? null : p.doctor_id)}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <span className="avatar" style={{ width: '52px', height: '52px', fontSize: '18px', flexShrink: 0 }}>{boshHarf}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: '16.5px' }}>{p.full_name}</p>
                          <p style={{ margin: '2px 0 0', color: 'var(--accent)', fontSize: '13px', fontWeight: 600 }}>
                            {[p.mutaxassislik, p.ilmiy_daraja].filter(Boolean).join(' · ') || 'Urolog'}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          {r ? (
                            <>
                              <Yulduzlar qiymat={r.umumiy} />
                              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                                {r.umumiy.toFixed(1)} · {r.soni} ta baho
                              </p>
                            </>
                          ) : (
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>Hali baho yo&apos;q</p>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px', fontSize: '12.5px', color: 'var(--muted)' }}>
                        {p.tajriba_yil != null && <span>🧑‍⚕️ {p.tajriba_yil} yil tajriba</span>}
                        {kl && <span>🏥 {kl.nom}{kl.manzil ? ` — ${kl.manzil}` : ''}</span>}
                        {p.qabul_narxi && <span>💳 Qabul: {p.qabul_narxi}</span>}
                        {p.ish_vaqti && <span>🕐 {p.ish_vaqti}</span>}
                      </div>
                    </div>
                    <span style={{ color: 'var(--muted)', fontSize: '16px', flexShrink: 0 }}>{ochiq ? '▴' : '▾'}</span>
                  </div>

                  {ochiq && (
                    <div style={{ marginTop: '14px', borderTop: '1px solid var(--line)', paddingTop: '14px' }} onClick={(e) => e.stopPropagation()}>
                      {p.bio && <p style={{ margin: '0 0 12px', fontSize: '13.5px', lineHeight: 1.6 }}>{p.bio}</p>}

                      {(p.xizmatlar ?? []).length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Xizmatlar</p>
                          {p.xizmatlar.map((x, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '5px 0', borderBottom: '1px dashed var(--line)', fontSize: '13.5px' }}>
                              <span>{x.nom}</span>
                              <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{x.narx || '—'}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {r && (
                        <div style={{ marginBottom: '12px' }}>
                          <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Bemorlar bahosi</p>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '6px' }}>
                            {r.mezonlar.map((m) => (
                              <div key={m.nom} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)', borderRadius: '8px', padding: '6px 10px', fontSize: '12.5px' }}>
                                <span>{m.nom}</span>
                                <span style={{ fontWeight: 700 }}>{m.q.toFixed(1)}</span>
                              </div>
                            ))}
                          </div>
                          {r.izohlar.slice(0, 3).map((izoh, i) => (
                            <p key={i} style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                              &quot;{izoh}&quot;
                            </p>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <Link href={`/patient/navbat?doctor=${p.doctor_id}`} style={{
                          textDecoration: 'none', background: 'var(--good)', color: 'white', borderRadius: '10px',
                          padding: '11px 20px', fontSize: '13.5px', fontWeight: 700,
                        }}>
                          🗓 Navbat olish
                        </Link>
                        <Link href="/patient/murojaat" style={{
                          textDecoration: 'none', background: 'var(--accent)', color: 'white', borderRadius: '10px',
                          padding: '11px 20px', fontSize: '13.5px', fontWeight: 700,
                        }}>
                          📨 Murojaat yuborish
                        </Link>
                        {p.telefon && (
                          <a href={`tel:${p.telefon.replace(/\s/g, '')}`} style={{
                            textDecoration: 'none', background: 'var(--surface-2)', color: 'var(--ink)', borderRadius: '10px',
                            padding: '11px 20px', fontSize: '13.5px', fontWeight: 600, border: '1px solid var(--line)',
                          }}>
                            📞 {p.telefon}
                          </a>
                        )}
                      </div>
                    </div>
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
