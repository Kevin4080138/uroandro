'use client'

import { AppShell } from '@/components/AppShell'
import { DARSLAR } from '@/lib/talim/darslar'

const BOLIMLAR = [
  {
    ikon: '📖', nom: 'Darslar', rang: 'linear-gradient(135deg, #2563eb, #0891b2)',
    tasvir: `Urologiya va andrologiyaning asosiy mavzulari bo'yicha ${DARSLAR.length} ta dars — EAU/AUA/WHO rasmiy qo'llanmalariga asoslangan.`,
    tafsilot: [
      "Har dars bosqichma-bosqich bo'limlarga (patofiziologiya, tashxis, davolash) bo'lingan.",
      "Dars oxirida 5 savollik test — javob berilgandan keyin to'g'ri/noto'g'ri va izoh ko'rsatiladi.",
      "Har dars manbalar ro'yxati bilan yakunlanadi (qo'llanma nomi va yili).",
    ],
  },
  {
    ikon: '📊', nom: 'Natijalarim', rang: 'linear-gradient(135deg, #16a34a, #84cc16)',
    tasvir: "Talaba topshirgan har bir test natijasi saqlanadi va umumiy progress kuzatiladi.",
    tafsilot: [
      "Necha dars o'zlashtirilgani (masalan 4/6), jami urinishlar soni va o'rtacha ball ko'rsatiladi.",
      "Har bir urinish sanasi va foizi bilan tarixda saqlanadi, qayta urinish mumkin.",
    ],
  },
  {
    ikon: '📚', nom: 'Kutubxona', rang: 'linear-gradient(135deg, #7c3aed, #c026d3)',
    tasvir: "Shifokorlar yuklagan o'quv materiallari (PDF) — talaba uchun faqat o'qish/yuklab olish rejimida.",
    tafsilot: [
      "Talaba fayl yuklay olmaydi yoki o'chira olmaydi — faqat ko'radi va yuklab oladi.",
    ],
  },
]

export default function TalabaBolimiHaqida() {
  return (
    <AppShell title="Talaba bo'limi haqida">
      <div className="mx-auto max-w-[920px] px-8 py-8">
        <div className="rise" style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Talaba bo&apos;limi qanday tuzilgan</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: '13.5px', maxWidth: '70ch' }}>
            Bu — talabalarga mo&apos;ljallangan ilova qismining statik ko&apos;rinishi. Talabalar ro&apos;yxatdan o&apos;tib, quyidagi
            bo&apos;limlardan foydalanib o&apos;qiydi va o&apos;z bilimini sinab ko&apos;radi. Bu sahifa shifokorlarga talaba tomonda
            nimalar mavjudligini tushunish uchun mo&apos;ljallangan — jonli ma&apos;lumot ko&apos;rsatmaydi.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {BOLIMLAR.map((b, i) => (
            <div key={b.nom} className="rise" style={{
              animationDelay: `${Math.min(i * 0.06, 0.4)}s`,
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px',
              padding: '20px 22px', display: 'flex', gap: '16px', alignItems: 'flex-start',
            }}>
              <div style={{
                width: '46px', height: '46px', borderRadius: '13px', flexShrink: 0, background: b.rang,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
              }}>
                {b.ikon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>{b.nom}</h3>
                <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{b.tasvir}</p>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {b.tafsilot.map((t) => (
                    <li key={t} style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Darslar ro'yxati */}
        <div className="rise" style={{ marginTop: '20px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
            Mavjud darslar ro&apos;yxati
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {DARSLAR.map((d, i) => (
              <div key={d.slug} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px',
                background: 'var(--surface-2)', borderRadius: '8px', fontSize: '13px',
              }}>
                <span style={{ color: 'var(--muted)', fontWeight: 700, width: '20px' }}>{i + 1}.</span>
                <span style={{ fontWeight: 600 }}>{d.sarlavha}</span>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--muted)' }}>{d.kategoriya} · {d.test.length} savol</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rise" style={{
          marginTop: '24px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
          padding: '16px 20px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          ℹ️ Talaba bo&apos;limiga real kirish uchun <strong>alohida &quot;talaba&quot; rolidagi hisob</strong> yaratish kerak (shifokor hisobi bilan kirib bo&apos;lmaydi).
          Test maqsadida ko&apos;rish kerak bo&apos;lsa — yangi ro&apos;yxatdan o&apos;tishda rol sifatida &quot;Talaba&quot;ni tanlang, yoki admin hisobi orqali kiring.
        </div>
      </div>
    </AppShell>
  )
}
