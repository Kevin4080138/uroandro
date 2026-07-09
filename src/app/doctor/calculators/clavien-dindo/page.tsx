'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/AppShell'

const DARAJALAR = [
  {
    daraja: 'I', rang: '#22c55e', icon: '🟢',
    sarlavha: 'I-daraja — Oddiy asorat',
    tavsif: 'Normal postoperatsion kechimdan har qanday og\'ishish. Farmakologik davolash, fiziologik yoki psixologik davolash talab qilinmaydi.',
    misol: 'Yuqori temperatura (antipretikssiz), ko\'ngil aynishi, yara infeksiyasi (faqat dressing bilan)',
    davolash: 'Yaraga dressing almashtirish, fiziologiya',
  },
  {
    daraja: 'II', rang: '#84cc16', icon: '🟡',
    sarlavha: 'II-daraja — Farmakologik davolash',
    tavsif: 'I-darajada ko\'rsatilmaganlar bundan mustasno, farmakologik davolash talab qilinadi.',
    misol: 'Antibiotik bilan davolashni talab qiluvchi infeksiya, qon quyish, TPN, qonda ivish buzilishi',
    davolash: 'Antibiotiklar, diuretiklar, antikoagulyantlar, qon quyish, TPN',
  },
  {
    daraja: 'IIIa', rang: '#eab308', icon: '🟠',
    sarlavha: 'III-daraja (a) — Jarrohlik aralashuvi, lokal anesteziya',
    tavsif: 'Jarrohlik, endoskopik yoki radiologik aralashuvni talab qiladi. Lokal anesteziya ostida.',
    misol: 'Mahalliy anesteziyada drenaj, endoskopik gemostatik muolaja, KT boshqaruvida aspiratsiya',
    davolash: 'Lokal anesteziya ostida protsedura',
  },
  {
    daraja: 'IIIb', rang: '#f97316', icon: '🔴',
    sarlavha: 'III-daraja (b) — Jarrohlik aralashuvi, umumiy anesteziya',
    tavsif: 'Umumiy yoki spinal anesteziya ostida jarrohlik, endoskopik yoki radiologik aralashuvni talab qiladi.',
    misol: 'Anastomoz buzilishi — relaparotomiya, peritoneal qo\'zg\'alish, churraga drenaj',
    davolash: 'Umumiy anesteziya ostida operatsiya',
  },
  {
    daraja: 'IVa', rang: '#ef4444', icon: '🔴',
    sarlavha: 'IV-daraja (a) — Hayotga xavfli, bir a\'zo yetishmovchiligi',
    tavsif: 'Hayotga xavfli asorat (bosh miya asoratlari bundan mustasno), bitta organ yetishmovchiligini o\'z ichiga oladi.',
    misol: 'Reanimatsion chora talab qiluvchi holat: ARF, ARDS, miokard infarkti',
    davolash: 'REAT (IT), organ qo\'llab-quvvatlash',
  },
  {
    daraja: 'IVb', rang: '#dc2626', icon: '🔴',
    sarlavha: 'IV-daraja (b) — Hayotga xavfli, ko\'p a\'zo yetishmovchiligi',
    tavsif: 'Bir necha organlar yetishmovchiligi.',
    misol: 'Septik shok bilan ARDS va ARF, MOF (ko\'p organ yetishmovchiligi)',
    davolash: 'REAT (IT), ko\'p organ qo\'llab-quvvatlash',
  },
  {
    daraja: 'V', rang: '#7f1d1d', icon: '⬛',
    sarlavha: "V-daraja — O'lim",
    tavsif: 'Bemorning vafoti.',
    misol: null,
    davolash: null,
  },
]

export default function ClavienDindoPage() {
  const router = useRouter()
  const [tanlangan, setTanlangan] = useState<string | null>(null)
  const natija = DARAJALAR.find(d => d.daraja === tanlangan)

  return (
    <AppShell title="Clavien-Dindo Klassifikatsiyasi">
      <div className="mx-auto max-w-[820px] px-8 py-8">
        <button onClick={() => router.push('/doctor/calculators')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer',
          padding: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          ← Kalkulyatorlarga qaytish
        </button>

        <div className="rise" style={{
          background: 'linear-gradient(135deg, #1d4ed8, #dc2626)', color: 'white',
          borderRadius: '18px', padding: '26px 28px', marginBottom: '20px',
        }}>
          <h2 style={{ margin: 0, fontSize: '21px', fontWeight: 800 }}>Clavien-Dindo Klassifikatsiyasi</h2>
          <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.92, maxWidth: '60ch' }}>
            Jarrohlik asoratlari og&apos;irligini standartlashtirilgan tarzda baholash uchun xalqaro qabul qilingan
            5 bosqichli (I–V) klassifikatsiya. Urologik operatsiyalarning klinik natijalarini taqqoslashda keng qo&apos;llaniladi.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {DARAJALAR.map((d, i) => (
            <div
              key={d.daraja}
              className="rise"
              onClick={() => setTanlangan(tanlangan === d.daraja ? null : d.daraja)}
              style={{
                animationDelay: `${i * 0.04}s`,
                background: tanlangan === d.daraja ? d.rang + '18' : 'var(--surface)',
                border: tanlangan === d.daraja ? `2px solid ${d.rang}` : '1px solid var(--line)',
                borderRadius: '14px', padding: '16px 18px', cursor: 'pointer', transition: 'all .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                  background: d.rang, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '14px', fontWeight: 800,
                }}>
                  {d.daraja}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: tanlangan === d.daraja ? d.rang : 'var(--ink)', marginBottom: '4px' }}>
                    {d.sarlavha}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{d.tavsif}</div>
                  {tanlangan === d.daraja && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {d.misol && (
                        <div style={{ background: 'var(--surface-2)', borderRadius: '8px', padding: '10px 12px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', marginBottom: '3px' }}>MISOL</div>
                          <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>{d.misol}</div>
                        </div>
                      )}
                      {d.davolash && (
                        <div style={{ background: d.rang + '12', borderRadius: '8px', padding: '10px 12px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: d.rang, marginBottom: '3px' }}>DAVOLASH</div>
                          <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>{d.davolash}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span style={{ color: 'var(--muted)', fontSize: '14px', flexShrink: 0, marginTop: '4px' }}>
                  {tanlangan === d.daraja ? '▲' : '▼'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {natija && (
          <div style={{
            background: natija.rang + '18', border: `2px solid ${natija.rang}`,
            borderRadius: '14px', padding: '18px 22px', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', color: natija.rang, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: '6px' }}>
              Tanlangan daraja
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: natija.rang }}>{natija.sarlavha}</div>
          </div>
        )}

        <div className="rise" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Standart haqida
          </h3>
          <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Clavien-Dindo klassifikatsiyasi</strong> 1992-yilda Clavien tomonidan taklif etilgan,
              2004-yilda Dindo boshchiligidagi guruh tomonidan yangilangan va xalqaro jirrohlik hamjamiyati tomonidan qabul qilingan.
              EAU va AUA qo&apos;llanmalarida jarrohlik natijalarini standartlashtirilgan holda bayon qilish uchun tavsiya etiladi.
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
              Manba: Dindo D et al. Ann Surg 2004; 240:205. Clavien PA et al. Ann Surg 2009; 250:187.
              Faqat klinik yordamchi vosita.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
