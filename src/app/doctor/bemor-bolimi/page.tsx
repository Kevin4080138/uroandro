'use client'

import { AppShell } from '@/components/AppShell'

const BOLIMLAR = [
  {
    ikon: '🩺', nom: 'Yangi murojaat', rang: 'linear-gradient(135deg, #2563eb, #0891b2)',
    tasvir: "Bemor organ tanlaydi → tegishli shikoyatlarni belgilaydi → taxminiy tashxis va tavsiya avtomatik ko'rsatiladi.",
    tafsilot: [
      'Bemor murojaatni umumiy navbatga yoki aniq tanlagan shifokorga yuborishi mumkin.',
      "Shoshilinch deb belgilangan shikoyatlar (masalan kuchli og'riq, qon ketishi) alohida belgi bilan ajratiladi.",
      'Yuborilgandan keyin shifokor(lar)ga darhol push-bildirishnoma boradi (agar yoqilgan bo\'lsa).',
    ],
  },
  {
    ikon: '📨', nom: 'Mening murojaatlarim', rang: 'linear-gradient(135deg, #16a34a, #84cc16)',
    tasvir: 'Bemor yuborgan barcha murojaatlari va shifokor javoblarini xronologik tartibda ko\'radi.',
    tafsilot: [
      'Murojaat holati ko\'rinadi: Kutilmoqda → Qabul qilindi → Javob berildi.',
      'Bemor javobni ochib o\'qigach, shifokor tomonida "✓✓ Bemor ko\'rdi" belgisi chiqadi.',
      'Javob kelganda bemorga darhol push + bosh sahifada bannerli bildirishnoma chiqadi.',
    ],
  },
  {
    ikon: '💊', nom: 'Dorilarim', rang: 'linear-gradient(135deg, #dc2626, #f97316)',
    tasvir: "Shifokor yozgan dori retseptlari, kuniga necha marta va necha kun ichilishi, qabul qilish eslatmalari.",
    tafsilot: [
      'Har bir dori uchun avtomatik kunlik vaqt jadvali (masalan kuniga 3 marta — 08:00/14:00/20:00) tuziladi.',
      'Bemor har dozani "✓ Ichdim" tugmasi bilan belgilaydi, kunlik progress ko\'rinadi.',
      "Bosh sahifada keyingi doza vaqti avtomatik ko'rinadi, vaqti o'tib ketsa qizil rangda ogohlantiradi.",
      "Yangi retsept yozilganda va kursning so'nggi/ertangi kunida push-bildirishnoma yuboriladi.",
    ],
  },
  {
    ikon: '❓', nom: 'Savol-javob', rang: 'linear-gradient(135deg, #d97706, #facc15)',
    tasvir: "Eng ko'p so'raladigan savollar (prostata, erkak salomatligi, tekshiruvlar, operatsiya) — kategoriya bo'yicha qidiruv bilan.",
    tafsilot: [
      'Har bir savolga batafsil, tibbiy jihatdan aniq javob — tashxis o\'rnini bosmaydigan, faqat ma\'lumot beruvchi tarzda.',
      'Qidiruv qatori va kategoriya filtri orqali tez topish mumkin.',
    ],
  },
  {
    ikon: '🩻', nom: "O'z-o'zini tekshirish", rang: 'linear-gradient(135deg, #7c3aed, #c026d3)',
    tasvir: "Moyaklarni oylik o'z-o'zini tekshirish (TSE) va siydik simptomlarini kuzatish kabi bosqichma-bosqich yo'riqnomalar.",
    tafsilot: [
      'Har bosqich uchun oddiy chizma (illyustratsiya) va tushunarli tasvir.',
      "Har yo'riqnoma oxirida 'qachon shifokorga murojaat qilish kerak' ogohlantiruvchi belgilar ro'yxati bor.",
    ],
  },
  {
    ikon: '🔔', nom: 'Bosh sahifa bildirishnomalari', rang: 'linear-gradient(135deg, #475569, #94a3b8)',
    tasvir: "Bemor ilovaga kirganda darhol ko'radigan markaziy bildirishnomalar paneli.",
    tafsilot: [
      'Yangi dori tayinlanganda, murojaatga javob kelganda — banner sifatida chiqadi, bosilganda tegishli bo\'limga olib boradi.',
      'Bu push-bildirishnomadan mustaqil ishlaydi — bemor sahifani ochishi bilanoq ko\'rinadi, qo\'shimcha sozlash kerak emas.',
    ],
  },
]

export default function BemorBolimiHaqida() {
  return (
    <AppShell title="Bemor bo'limi haqida">
      <div className="mx-auto max-w-[920px] px-8 py-8">
        <div className="rise" style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Bemor bo&apos;limi qanday tuzilgan</h2>
          <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: '13.5px', maxWidth: '70ch' }}>
            Bu — bemorlarga mo&apos;ljallangan ilova qismining statik ko&apos;rinishi. Bemorlar ro&apos;yxatdan o&apos;tib, telefon raqami orqali kirib,
            quyidagi bo&apos;limlardan foydalanadi. Bu sahifa shifokorlarga bemor tomonda nimalar mavjudligini tushunish uchun mo&apos;ljallangan —
            jonli ma&apos;lumot ko&apos;rsatmaydi.
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

        <div className="rise" style={{
          marginTop: '24px', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
          padding: '16px 20px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          ℹ️ Bemorlar bo&apos;limiga real kirish faqat <strong>admin</strong> hisobi orqali mumkin (test maqsadida). Shifokor hisobi
          xavfsizlik sabablariga ko&apos;ra faqat o&apos;ziga tegishli bo&apos;limlarga kira oladi.
        </div>
      </div>
    </AppShell>
  )
}
