'use client'

import { T, card } from '../_theme'
import { USULLAR, USUL_IDLARI } from '@/lib/varikotseleUsullari'

const GRADES = [
  { g: 'I', d: 'Faqat Valsalva sinamasi paytida paypaslanadi.' },
  { g: 'II', d: 'Valsalvasiz, tinch holatda paypaslanadi.' },
  { g: 'III', d: "Teri orqali ko'zga ko'rinadi." },
  { g: 'Sub', d: "Faqat ultratovush (Doppler) da aniqlanadi." },
]

export default function TalimPage() {
  return (
    <div>
      <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: T.teal, marginBottom: 10 }}>
        Ta&apos;lim moduli
      </div>
      <h1 style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.025em', marginBottom: 8 }}>Varikotsele va davolash usullari</h1>
      <p style={{ color: T.inkSoft, fontSize: 15.5, maxWidth: '62ch' }}>
        Kasallik haqida qisqacha ma&apos;lumot va besh jarrohlik usulining qiyosiy tavsifi.
      </p>

      <div style={{ fontSize: 18, fontWeight: 700, margin: '34px 0 14px' }}>Varikotsele nima?</div>
      <div style={card}>
        <p style={{ margin: 0, color: T.inkSoft }}>
          Varikotsele — urug&apos;don atrofidagi chigal venalar (pampiniform chigal) ning g&apos;ayritabiiy kengayishi. Erkaklarda eng ko&apos;p uchraydigan, jarrohlik yo&apos;li bilan tuzatish mumkin bo&apos;lgan bepushtlik sababidir. Asosan chap tomonda uchraydi.
        </p>
        <div style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: T.muted, marginTop: 14, marginBottom: 8 }}>
          Darajalari (Dubin–Amelar)
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {GRADES.map((row) => (
            <div key={row.g} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, fontSize: 13.5, padding: '8px 0', borderBottom: `1px solid ${T.line}` }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: T.teal }}>{row.g}</span>
              <span>{row.d}</span>
            </div>
          ))}
        </div>
        <div style={{ background: T.surface2, borderRadius: 9, padding: '16px 18px', marginTop: 16, fontSize: 14, color: T.inkSoft }}>
          <strong>Jarrohlik ko&apos;rsatmalari.</strong> Spermogramma ko&apos;rsatkichlari yomonlashgan bepushtlik; urug&apos;don hajmining kichrayishi (o&apos;smirlarda); og&apos;riq; katta simptomatik varikotsele.
        </div>
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, margin: '34px 0 14px' }}>Besh asosiy usul</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {USUL_IDLARI.map((id) => (
          <div key={id} style={{ ...card, borderTop: `4px solid ${USULLAR[id].color}` }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600,
              padding: '4px 10px', borderRadius: 999, fontFamily: 'monospace', background: `${USULLAR[id].color}1A`, color: USULLAR[id].color,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: USULLAR[id].color, display: 'inline-block' }} />
              {id}
            </span>
            <h3 style={{ fontSize: 17, margin: '10px 0 4px' }}>{USULLAR[id].nom}</h3>
            <div style={{ fontFamily: 'monospace', fontSize: 11.5, color: T.muted, marginBottom: 10 }}>{USULLAR[id].alias}</div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
              <div><div style={{ fontFamily: 'monospace', fontWeight: 700, color: USULLAR[id].color }}>{USULLAR[id].recur}</div><div style={{ color: T.muted, fontSize: 11.5 }}>Retsidiv</div></div>
              <div><div style={{ fontFamily: 'monospace', fontWeight: 700, color: USULLAR[id].color }}>{USULLAR[id].hydro}</div><div style={{ color: T.muted, fontSize: 11.5 }}>Gidrotsele</div></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, margin: '34px 0 14px' }}>Qiyosiy ko&apos;rsatkichlar</div>
      <div style={{ overflowX: 'auto', border: `1px solid ${T.line}`, borderRadius: 14, background: T.surface }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13.5, minWidth: 640 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 14px', background: T.surface2, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: T.muted, borderBottom: `1px solid ${T.line}` }}></th>
              {USUL_IDLARI.map((id) => (
                <th key={id} style={{ textAlign: 'left', padding: '12px 14px', background: T.surface2, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: T.muted, borderBottom: `1px solid ${T.line}`, whiteSpace: 'nowrap' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: USULLAR[id].color, display: 'inline-block', marginRight: 6 }} />
                  {USULLAR[id].nom}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}`, fontWeight: 600, color: T.inkSoft }}>Retsidiv darajasi</td>
              {USUL_IDLARI.map((id) => <td key={id} style={{ padding: '11px 14px', borderBottom: `1px solid ${T.line}`, fontFamily: 'monospace' }}>{USULLAR[id].recur}</td>)}
            </tr>
            <tr>
              <td style={{ padding: '11px 14px', fontWeight: 600, color: T.inkSoft }}>Gidrotsele rivojlanishi</td>
              {USUL_IDLARI.map((id) => <td key={id} style={{ padding: '11px 14px', fontFamily: 'monospace' }}>{USULLAR[id].hydro}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: T.muted, marginTop: 12 }}>
        Quyidagi qiymatlar ilmiy adabiyotdagi umumlashtirilgan diapazonlardir va faqat yo&apos;naltiruvchi ma&apos;lumot sifatida xizmat qiladi.
      </p>
    </div>
  )
}
