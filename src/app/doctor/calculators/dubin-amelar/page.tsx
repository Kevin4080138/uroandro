'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

const inputStyle = {
  width: '100%', background: 'var(--surface-2)', color: 'var(--ink)', border: '1px solid var(--line)',
  borderRadius: '10px', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const,
}
const labelStyle = { color: 'var(--ink-soft)', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 600 }

const VARIANTLAR = [
  {
    key: 'subklinik',
    daraja: '0-daraja (Subklinik)',
    matn: 'Palpatsiyada va ko\'rinishda aniqlanmaydi — faqat USI/Doppler tekshiruvida ko\'rinadi',
    rang: '#65a30d',
    tavsif: 'Klinik muayyan kuzatuv tavsiya etiladi. Bepushtlik shikoyati bo\'lmasa, odatda faol davolash talab qilinmaydi.',
  },
  {
    key: 'I',
    daraja: 'I-daraja',
    matn: 'Tinch holatda palpatsiyada sezilmaydi, faqat Valsalva sinamasi (kuchanish) vaqtida palpatsiya qilinadi',
    rang: '#16a34a',
    tavsif: 'Yengil daraja. Simptomsiz bo\'lsa kuzatuv, spermogramma o\'zgargan yoki og\'riq bo\'lsa konservativ/jarrohlik muhokama qilinadi.',
  },
  {
    key: 'II',
    daraja: 'II-daraja',
    matn: 'Valsalva sinamasisiz ham palpatsiya qilinadi, lekin ko\'z bilan ko\'rinmaydi',
    rang: '#d97706',
    tavsif: 'O\'rtacha daraja. Bepushtlik, og\'riq yoki moyak gipoplaziyasi mavjud bo\'lsa jarrohlik davolash ko\'rib chiqiladi.',
  },
  {
    key: 'III',
    daraja: 'III-daraja',
    matn: 'Moshonka terisi orqali ko\'z bilan aniq ko\'rinadi, palpatsiyada ham aniq seziladi ("qurtlar to\'plami" ko\'rinishi)',
    rang: '#dc2626',
    tavsif: 'Og\'ir daraja. Odatda jarrohlik davolash (Marmar, laparoskopik, Palomo va h.k.) tavsiya etiladi, ayniqsa bepushtlik yoki moyak atrofiyasi bilan birga bo\'lsa.',
  },
] as const

export default function DubinAmelarKalkulyator() {
  const router = useRouter()
  const [tanlangan, setTanlangan] = useState<string | null>(null)
  const [venaDiametri, setVenaDiametri] = useState('')

  const natija = VARIANTLAR.find((v) => v.key === tanlangan) ?? null
  const venaN = parseFloat(venaDiametri)

  return (
    <AppShell title="Dubin-Amelar darajasi">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #7c3aed, #c026d3)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>Dubin-Amelar darajasi</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            <strong>Dubin va Amelar</strong> 1970-yilda taklif qilgan, hozirgача urologiyada eng keng qo&apos;llaniladigan
            <strong> varikotsele</strong> (urug&apos;don venalarining kengayishi) klinik darajalash tizimi.
            Faqat jismoniy ko&apos;rik (palpatsiya va Valsalva sinamasi) asosida, qo&apos;shimcha asbob talab qilmasdan darajalanadi.
          </p>
        </div>

        {/* Variantlar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {VARIANTLAR.map((v, i) => (
            <div
              key={v.key}
              onClick={() => setTanlangan(v.key)}
              className="rise soft-press"
              style={{
                animationDelay: `${i * 0.06}s`,
                cursor: 'pointer',
                background: tanlangan === v.key ? `${v.rang}11` : 'var(--surface)',
                border: tanlangan === v.key ? `2px solid ${v.rang}` : '1px solid var(--line)',
                borderRadius: '14px', padding: '16px 18px',
                transition: 'all .15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '34px', height: '34px', borderRadius: '10px', background: v.rang, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0,
                }}>
                  {v.key === 'subklinik' ? '0' : v.key}
                </span>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{v.daraja}</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>{v.matn}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Natija */}
        {natija && (
          <div className="rise" style={{
            background: 'var(--surface)', border: `2px solid ${natija.rang}33`, borderRadius: '16px', padding: '22px 24px', marginBottom: '18px',
          }}>
            <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '.04em' }}>Aniqlangan daraja</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: natija.rang, margin: '4px 0 10px' }}>{natija.daraja}</div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{natija.tavsif}</p>
          </div>
        )}

        {/* USI vena diametri — qo'shimcha */}
        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 24px', marginBottom: '18px' }}>
          <label style={labelStyle}>USI/Doppler: uruğ tizimchasi venasi diametri (mm) — ixtiyoriy</label>
          <input style={{ ...inputStyle, maxWidth: '220px' }} type="number" step="0.1" value={venaDiametri} onChange={(e) => setVenaDiametri(e.target.value)} placeholder="masalan, 3.2" />
          {Number.isFinite(venaN) && venaN > 0 && (
            <p style={{ margin: '10px 0 0', fontSize: '13px', color: 'var(--ink-soft)' }}>
              {venaN < 2 && 'Diametr 2 mm dan kichik — odatda klinik ahamiyatsiz qabul qilinadi.'}
              {venaN >= 2 && venaN < 3 && "Diametr 2–3 mm — chegara holat, Valsalva bilan reflyuks (qon teskari oqimi) tekshirilishi muhim."}
              {venaN >= 3 && 'Diametr 3 mm dan katta — varikotsele uchun USI bo\'yicha tipik ko\'rsatkich hisoblanadi.'}
            </p>
          )}
        </div>

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Varikotsele</strong> — uruğ tizimchasidagi (pampiniform pleksus) venalarning patologik kengayishi va burama tarzda
              cho&apos;zilishi, ko&apos;pincha chap tomonda uchraydi (uruğ venasi chap buyrak venasiga to&apos;g&apos;ri burchak ostida quyilishi sababli).
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Dubin-Amelar tizimi</strong> (1970) — <strong>Valsalva sinamasi</strong> (bemor nafasini ushlab kuchanishi, qorin ichi bosimini oshirib venoz reflyuksni
              kuchaytiradi) va oddiy palpatsiya yordamida 3 darajaga ajratadi (I — eng yengil, III — eng og&apos;ir).
              Klinikada bemalol qo&apos;llanadigan, asbob-uskunasiz tizim bo&apos;lgani uchun hozirgача eng ko&apos;p ishlatiladi.
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Subklinik varikotsele</strong> (0-daraja) — klinik amaliyotda qo&apos;shimcha ravishda qo&apos;llaniladigan tushuncha:
              jismoniy ko&apos;rikda umuman aniqlanmaydigan, faqat <strong>USI/Doppler</strong> orqali topiladigan varikotsele.
              Uning klinik ahamiyati (davolash kerakligi) bo&apos;yicha adabiyotda yagona fikr yo&apos;q.
            </p>
            <p style={{ margin: 0 }}>
              Davolash qarori faqat darajaga emas, balki <strong style={{ color: 'var(--ink)' }}>spermogramma natijalari</strong>,
              <strong style={{ color: 'var(--ink)' }}> og&apos;riq</strong> mavjudligi va <strong style={{ color: 'var(--ink)' }}>moyak hajmi/gipotrofiyasi</strong>ga ham bog&apos;liq —
              shu sabab II-III darajadagi, ammo simptomsiz va fertillik muammosi bo&apos;lmagan bemorlarda kuzatuv ham mumkin.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Dubin L, Amelar RD. Varicocele size and results of varicocelectomy in selected subfertile men with varicocele. Fertil Steril. 1970. EAU andrologiya qo&apos;llanmasi. Bu kalkulyator faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
