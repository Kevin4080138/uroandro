'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function PrintReferralPage() {
  const { tashrifId } = useParams<{ tashrifId: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [tashrif, setTashrif] = useState<any>(null)
  const [bemor, setBemor] = useState<any>(null)
  const [shifokor, setShifokor] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: t } = await supabase.from('tashriflar').select('*').eq('id', tashrifId).single()
      if (!t) { setLoading(false); return }
      setTashrif(t)

      const [{ data: b }, { data: s }] = await Promise.all([
        supabase.from('bemorlar').select('*').eq('id', t.bemor_id).single(),
        supabase.from('profiles').select('*').eq('id', t.doctor_id).single(),
      ])
      setBemor(b)
      setShifokor(s)
      setLoading(false)
    }
    load()
  }, [tashrifId])

  if (loading) return <p style={{ padding: '32px' }}>Yuklanmoqda...</p>
  if (!tashrif || !bemor) return <p style={{ padding: '32px' }}>Topilmadi.</p>

  const tekshiruvlar = (tashrif.buyurilgan_tekshiruvlar || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  const yosh = bemor.tugilgan_sana ? Math.floor((Date.now() - new Date(bemor.tugilgan_sana).getTime()) / (365.25 * 24 * 3600 * 1000)) : null

  return (
    <div style={{ backgroundColor: '#eef2f7', minHeight: '100vh', padding: '24px' }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .yorlanma-karta { box-shadow: none !important; }
        }
      `}</style>

      <div className="no-print" style={{ maxWidth: '720px', margin: '0 auto 16px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => router.back()} style={{
          backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px',
          padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
        }}>
          ← Orqaga
        </button>
        <button onClick={() => window.print()} style={{
          backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px',
          padding: '8px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
        }}>
          🖨️ Chop etish / PDF
        </button>
      </div>

      <div className="yorlanma-karta" style={{
        maxWidth: '720px', margin: '0 auto', backgroundColor: 'white', color: '#0f172a',
        borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(15,23,42,0.12)',
      }}>
        {/* Bosh qism — rangli gradient */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)', color: 'white',
          padding: '28px 36px', position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>Urosfera</h1>
              <p style={{ margin: '2px 0 0', fontSize: '12px', opacity: 0.85 }}>Urologiya va Andrologiya platformasi</p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.18)', borderRadius: '999px', padding: '6px 16px',
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em',
            }}>
              YO&apos;LLANMA
            </div>
          </div>
          <h2 style={{ margin: '18px 0 0', fontSize: '19px', fontWeight: 700 }}>Tekshiruvga yo&apos;llanma</h2>
        </div>

        <div style={{ padding: '28px 36px 32px' }}>
          {/* Bemor karta */}
          <div style={{
            display: 'flex', gap: '16px', alignItems: 'center', background: '#f1f5f9',
            borderRadius: '14px', padding: '16px 18px', marginBottom: '24px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #0891b2)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '17px', flexShrink: 0,
            }}>
              {(bemor.fio || '?').trim().charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '17px', fontWeight: 700 }}>{bemor.fio}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                {yosh != null && <span>{yosh} yosh</span>}
                {bemor.tugilgan_sana && <span>🎂 {bemor.tugilgan_sana}</span>}
                {(bemor.passport_seria || bemor.passport_raqam) && (
                  <span>🪪 {[bemor.passport_seria, bemor.passport_raqam].filter(Boolean).join(' ')}</span>
                )}
              </div>
            </div>
          </div>

          {/* Asosiy: buyurilgan tekshiruvlar */}
          <h3 style={{
            fontSize: '12px', color: '#0891b2', textTransform: 'uppercase', letterSpacing: '0.06em',
            fontWeight: 800, marginBottom: '12px',
          }}>
            Buyurilgan tekshiruvlar
          </h3>
          {tekshiruvlar.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#94a3b8' }}>Tekshiruv belgilanmagan.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
              {tekshiruvlar.map((tek: string, i: number) => (
                <div key={tek} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: 'linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%)',
                  border: '1px solid #dbeafe', borderRadius: '12px', padding: '12px 16px',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', background: '#2563eb', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{tek}</span>
                </div>
              ))}
            </div>
          )}

          {tashrif.anamnez && (
            <>
              <h3 style={{
                fontSize: '12px', color: '#0891b2', textTransform: 'uppercase', letterSpacing: '0.06em',
                fontWeight: 800, marginTop: '22px', marginBottom: '8px',
              }}>
                Qo&apos;shimcha izoh
              </h3>
              <p style={{ fontSize: '14px', color: '#334155', margin: 0, lineHeight: 1.5 }}>{tashrif.anamnez}</p>
            </>
          )}

          <div style={{
            marginTop: '32px', paddingTop: '18px', borderTop: '1px dashed #cbd5e1',
            display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b',
          }}>
            <span>Sana: {new Date(tashrif.sana).toLocaleDateString()}</span>
            <span>Shifokor: <strong style={{ color: '#0f172a' }}>{shifokor?.full_name ?? '—'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
