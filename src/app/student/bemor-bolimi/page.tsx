'use client'

import { Header } from '@/components/Header'

const BOLIMLAR = [
  {
    ikon: '🩺', nom: 'Yangi murojaat', rang: 'linear-gradient(135deg, #2563eb, #0891b2)',
    tasvir: "Bemor organ tanlaydi → tegishli shikoyatlarni belgilaydi → taxminiy tashxis va tavsiya avtomatik ko'rsatiladi.",
    tafsilot: [
      'Bemor murojaatni umumiy navbatga yoki aniq tanlagan shifokorga yuborishi mumkin.',
      "Shoshilinch deb belgilangan shikoyatlar alohida belgi bilan ajratiladi.",
      'Yuborilgandan keyin shifokor(lar)ga darhol push-bildirishnoma boradi.',
    ],
  },
  {
    ikon: '📨', nom: 'Mening murojaatlarim', rang: 'linear-gradient(135deg, #16a34a, #84cc16)',
    tasvir: 'Bemor yuborgan barcha murojaatlari va shifokor javoblarini xronologik tartibda ko\'radi.',
    tafsilot: [
      'Murojaat holati ko\'rinadi: Kutilmoqda → Qabul qilindi → Javob berildi.',
      'Javob kelganda bemorga darhol push + bosh sahifada bannerli bildirishnoma chiqadi.',
    ],
  },
  {
    ikon: '💊', nom: 'Dorilarim', rang: 'linear-gradient(135deg, #dc2626, #f97316)',
    tasvir: "Shifokor yozgan dori retseptlari, kuniga necha marta va necha kun ichilishi, qabul qilish eslatmalari.",
    tafsilot: [
      'Har bir dori uchun avtomatik kunlik vaqt jadvali tuziladi.',
      'Bemor har dozani "✓ Ichdim" tugmasi bilan belgilaydi, "Hali ichilmagan"/"Ichilgan" deb guruhlanadi.',
      "Haftalik intizom statistikasi va kurs tugashidan oldin davom ettirish so'rovi ham mavjud.",
    ],
  },
  {
    ikon: '❓', nom: 'Savol-javob', rang: 'linear-gradient(135deg, #d97706, #facc15)',
    tasvir: "Eng ko'p so'raladigan savollar — kategoriya bo'yicha qidiruv bilan.",
    tafsilot: ['Har bir savolga batafsil, tibbiy jihatdan aniq javob beriladi.'],
  },
  {
    ikon: '🩻', nom: "O'z-o'zini tekshirish", rang: 'linear-gradient(135deg, #7c3aed, #c026d3)',
    tasvir: "Bosqichma-bosqich o'z-o'zini tekshirish yo'riqnomalari (masalan, moyaklarni oylik tekshirish).",
    tafsilot: ["Har yo'riqnoma oxirida 'qachon shifokorga murojaat qilish kerak' belgilari bor."],
  },
]

export default function StudentBemorBolimi() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[920px] px-8 py-8">
        <div className="rise" style={{
          background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
          padding: '16px 20px', marginBottom: '24px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          ℹ️ Bu — bemor bo&apos;limining <strong>statik ko&apos;rinishi</strong>, faqat tanishish uchun. To&apos;liq foydalanish
          (haqiqiy murojaat yuborish, dori belgilash va h.k.) uchun <strong>alohida &quot;bemor&quot; rolidagi hisob yaratishingiz</strong> kerak.
        </div>

        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800 }}>Bemor bo&apos;limi qanday tuzilgan</h2>
        <p className="rise" style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '13.5px', maxWidth: '70ch' }}>
          Bemorlar ro&apos;yxatdan o&apos;tib, telefon raqami orqali kirib, quyidagi bo&apos;limlardan foydalanadi.
        </p>

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
      </div>
    </div>
  )
}
