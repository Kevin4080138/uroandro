'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { USULLAR, USUL_IDLARI, usulTavsiyaBerish, type QarorKirish } from '@/lib/varikotseleUsullari'

const inputStyle = {
  width: '100%',
  backgroundColor: '#1e1e2e',
  color: 'white',
  border: '1px solid #2e2e3e',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = { color: '#d1d5db', fontSize: '13px', display: 'block', marginBottom: '6px' }

const bosh: QarorKirish = { indic: 'infertility', lat: 'left', recur: false, expert: true, bmi: 0 }

export default function VarikotseleKalkulyatorPage() {
  const router = useRouter()
  const [forma, setForma] = useState<QarorKirish>(bosh)
  const [natija, setNatija] = useState<ReturnType<typeof usulTavsiyaBerish> | null>(null)

  const hisobla = () => setNatija(usulTavsiyaBerish(forma))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f', color: 'white' }}>
      <div style={{
        backgroundColor: '#111118', borderBottom: '1px solid #1e1e2e',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>
          Uro<span style={{ color: '#60a5fa' }}>Andro</span>
        </h1>
        <button onClick={() => router.push('/doctor/dashboard')} style={{
          backgroundColor: '#1e1e2e', color: '#9ca3af', border: '1px solid #2e2e3e',
          borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px',
        }}>
          ← Bosh sahifa
        </button>
      </div>

      <div style={{ padding: '32px', maxWidth: '760px', margin: '0 auto' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>Varikotsele — usul tanlash kalkulyatori</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 24px 0' }}>
          Bemor ma&apos;lumotlarini kiriting — tizim 5 ta jarrohlik usuli orasidan eng mosini tavsiya qiladi:
          Laparoskopik, Marmar (mikrojarrohlik), Skleroterapiya, Palomo, Ivanissevich.
        </p>

        <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Asosiy ko&apos;rsatma</label>
              <select style={inputStyle} value={forma.indic} onChange={(e) => setForma((f) => ({ ...f, indic: e.target.value as QarorKirish['indic'] }))}>
                <option value="infertility">Bepushtlik</option>
                <option value="pain">Og&apos;riq</option>
                <option value="hypo">Urug&apos;don gipotrofiyasi</option>
                <option value="cosmetic">Kosmetik/boshqa</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tomoni</label>
              <select style={inputStyle} value={forma.lat} onChange={(e) => setForma((f) => ({ ...f, lat: e.target.value as QarorKirish['lat'] }))}>
                <option value="left">Chap</option>
                <option value="right">O&apos;ng</option>
                <option value="bilateral">Ikki tomon</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Avval operatsiya qilinganmi (retsidiv)?</label>
              <select style={inputStyle} value={forma.recur ? 'ha' : "yo'q"} onChange={(e) => setForma((f) => ({ ...f, recur: e.target.value === 'ha' }))}>
                <option value="yo'q">Yo&apos;q</option>
                <option value="ha">Ha</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Mikrojarrohlik imkoniyati bormi?</label>
              <select style={inputStyle} value={forma.expert ? 'ha' : "yo'q"} onChange={(e) => setForma((f) => ({ ...f, expert: e.target.value === 'ha' }))}>
                <option value="ha">Ha</option>
                <option value="yo'q">Yo&apos;q</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tana massasi indeksi (BMI) — ixtiyoriy</label>
              <input type="number" style={inputStyle} value={forma.bmi || ''} onChange={(e) => setForma((f) => ({ ...f, bmi: Number(e.target.value) || 0 }))} placeholder="masalan, 27" />
            </div>
          </div>

          <button onClick={hisobla} style={{
            marginTop: '20px', backgroundColor: '#2563eb', color: 'white', border: 'none',
            borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
          }}>
            Tavsiyani hisoblash
          </button>
        </div>

        {natija && (
          <div style={{ marginTop: '24px', backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', background: `linear-gradient(120deg, ${USULLAR[natija.winner].color}cc, ${USULLAR[natija.winner].color})` }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>Tavsiya etilgan usul</div>
              <h3 style={{ margin: '6px 0 0', fontSize: '22px' }}>{USULLAR[natija.winner].nom}</h3>
              <div style={{ fontSize: '12px', opacity: 0.85, marginTop: '4px' }}>{USULLAR[natija.winner].alias}</div>
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                <span>Ishonchlilik: <strong>{natija.conf}%</strong></span>
                <span style={{ flex: 1, height: '10px', borderRadius: '6px', background: 'rgba(255,255,255,.25)', overflow: 'hidden', maxWidth: '200px' }}>
                  <span style={{ display: 'block', height: '100%', width: `${natija.conf}%`, background: '#fff', borderRadius: '6px' }} />
                </span>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', margin: '0 0 12px' }}>Asoslar</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {natija.sabablar.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13.5px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, background: USULLAR[r.usul].color }} />
                    <span style={{ color: '#d1d5db' }}>{r.matn}</span>
                  </li>
                ))}
              </ul>

              <h4 style={{ fontSize: '13px', color: '#6b7280', textTransform: 'uppercase', margin: '20px 0 12px' }}>Kutilayotgan natijalar (adabiyot bo&apos;yicha)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ border: `1px solid ${USULLAR[natija.winner].color}`, borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '24px', fontFamily: 'monospace', color: USULLAR[natija.winner].color }}>{USULLAR[natija.winner].recur}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Retsidiv darajasi</div>
                </div>
                <div style={{ border: `1px solid ${USULLAR[natija.winner].color}`, borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '24px', fontFamily: 'monospace', color: USULLAR[natija.winner].color }}>{USULLAR[natija.winner].hydro}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Gidrotsele rivojlanishi</div>
                </div>
              </div>

              <div style={{ marginTop: '18px', backgroundColor: '#1f1505', border: '1px solid #6b4a14', borderRadius: '10px', padding: '13px 15px', fontSize: '12.5px', color: '#fbbf24' }}>
                Bu vosita faqat qaror qabul qilishni qo&apos;llab-quvvatlaydi va malakali shifokor klinik baholashining o&apos;rnini bosmaydi.
              </div>
            </div>
          </div>
        )}

        <h3 style={{ fontSize: '16px', color: '#9ca3af', margin: '32px 0 12px' }}>5 usulni qiyoslash (retsidiv va gidrotsele)</h3>
        <div style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a24', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 500 }}>Usul</th>
                <th style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 500 }}>Retsidiv</th>
                <th style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 500 }}>Gidrotsele</th>
              </tr>
            </thead>
            <tbody>
              {USUL_IDLARI.map((id) => (
                <tr key={id} style={{ borderTop: '1px solid #1e1e2e' }}>
                  <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: USULLAR[id].color, display: 'inline-block' }} />
                    {USULLAR[id].nom}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{USULLAR[id].recur}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{USULLAR[id].hydro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
