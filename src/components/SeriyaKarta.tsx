'use client'

import { bugunToshkent, bugunSanalganmi, type Seriya } from '@/lib/talim/seriya'

const KUN_NOMLARI = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh']

// Oxirgi 7 kunning har biri faol bo'lganmi. Bazada faqat `oxirgi_sana` va `joriy`
// saqlanadi — uzluksiz seriya ta'rifiga ko'ra faol kunlar aynan oxirgi_sana'dan
// orqaga qarab `joriy` ta kun, shundan haftalik ko'rinishni aniq tiklash mumkin.
function haftaKunlari(seriya: Seriya | null) {
  const bugun = bugunToshkent()
  const kunlar: { sana: string; nomi: string; faol: boolean; bugunmi: boolean }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(`${bugun}T00:00:00Z`)
    d.setUTCDate(d.getUTCDate() - i)
    const sana = d.toISOString().slice(0, 10)
    let faol = false
    if (seriya?.oxirgi_sana && seriya.joriy > 0) {
      const oxirgi = new Date(`${seriya.oxirgi_sana}T00:00:00Z`)
      const farq = Math.round((oxirgi.getTime() - d.getTime()) / 86400000)
      faol = farq >= 0 && farq < seriya.joriy
    }
    kunlar.push({ sana, nomi: KUN_NOMLARI[d.getUTCDay()], faol, bugunmi: sana === bugun })
  }
  return kunlar
}

export function SeriyaKarta({ seriya, onClick }: { seriya: Seriya | null; onClick?: () => void }) {
  const kunlar = haftaKunlari(seriya)
  const joriy = seriya?.joriy ?? 0
  const bugunBajarildi = bugunSanalganmi(seriya)
  const rekord = seriya?.eng_uzun ?? 0
  const rekordArafasida = joriy > 0 && !bugunBajarildi && joriy + 1 > rekord && rekord > 0

  // Seriya bor va bugun bajarilgan bo'lsa — issiq gradient; aks holda bosiq, "harakat kerak" ko'rinishi.
  const issiq = bugunBajarildi && joriy > 0

  return (
    <div
      onClick={onClick}
      className="rise soft-press"
      style={{
        background: issiq
          ? 'linear-gradient(120deg, #f97316, #dc2626)'
          : 'var(--surface)',
        border: issiq ? 'none' : '1px solid var(--line)',
        color: issiq ? 'white' : 'var(--ink)',
        borderRadius: '16px', padding: '14px 16px', cursor: onClick ? 'pointer' : 'default',
        animationDelay: '.045s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '13px', flexShrink: 0,
          background: issiq ? 'rgba(255,255,255,.2)' : 'rgba(249,115,22,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', filter: joriy > 0 ? 'none' : 'grayscale(1)', opacity: joriy > 0 ? 1 : .6,
        }}>
          🔥
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase',
            opacity: issiq ? .85 : 1, color: issiq ? 'white' : 'var(--muted)',
          }}>
            Kunlik seriya
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, margin: '1px 0 2px' }}>
            {joriy > 0 ? `${joriy} kun ketma-ket` : 'Seriyani bugun boshlang'}
          </div>
          <div style={{
            fontSize: '11.5px', lineHeight: 1.45,
            color: issiq ? 'rgba(255,255,255,.9)' : 'var(--muted)',
          }}>
            {bugunBajarildi
              ? (rekord > joriy ? `Rekordingiz ${rekord} kun — davom eting!` : 'Bugun bajarildi ✓ Rekord sizda!')
              : rekordArafasida
                ? `Bugun bir qadam — ${joriy + 1} kun bilan rekord yangilanadi!`
                : joriy > 0
                  ? 'Bugun bir qadam qilmasangiz seriya uziladi'
                  : 'Har kuni bitta qadam — seriya shunday yig‘iladi'}
          </div>
        </div>
      </div>

      {/* Oxirgi 7 kun */}
      <div style={{ display: 'flex', gap: '5px', marginTop: '11px' }}>
        {kunlar.map((k) => (
          <div key={k.sana} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: '5px', borderRadius: '999px', marginBottom: '4px',
              background: k.faol
                ? (issiq ? 'white' : '#f97316')
                : (issiq ? 'rgba(255,255,255,.28)' : 'var(--surface-2)'),
              outline: k.bugunmi && !k.faol ? '1px dashed rgba(249,115,22,.6)' : 'none',
            }} />
            <span style={{
              fontSize: '9.5px', fontWeight: 700,
              color: issiq ? 'rgba(255,255,255,.75)' : 'var(--muted)',
            }}>
              {k.nomi}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
