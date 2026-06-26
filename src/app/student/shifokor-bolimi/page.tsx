'use client'

import { Header } from '@/components/Header'

const BOLIMLAR = [
  {
    ikon: '🧑‍🤝‍🧑', nom: 'Bemorlar reestri', rang: 'linear-gradient(135deg, #2563eb, #0891b2)',
    tasvir: "Barcha bemorlarning pasport darajasidagi ma'lumotlari (ism, telefon, manzil) — har bir shifokorga umumiy ko'rinadi.",
    tafsilot: [
      "Yangi bemor qo'shish, qidirish, har bemorga avtomatik tartib raqami beriladi.",
      "Har bemor kartasida shifokorning shaxsiy klinik yozuvlari (tashriflar) saqlanadi.",
    ],
  },
  {
    ikon: '🩺', nom: 'Klinik qaror jarayoni', rang: 'linear-gradient(135deg, #16a34a, #84cc16)',
    tasvir: "Shikoyat/anamnez → tekshiruv buyurtmasi → natija kiritish → tavsiya varaqasi — bosqichma-bosqich qabul jarayoni.",
    tafsilot: [
      "Organ bo'yicha shikoyat chiplari, har bir tekshiruv natijasi uchun moslashtirilgan maydonlar.",
      "Yo'llanma va yakuniy tavsiya varaqasi avtomatik PDF/chop etish ko'rinishida tayyorlanadi.",
    ],
  },
  {
    ikon: '📄', nom: 'Hujjatlar', rang: 'linear-gradient(135deg, #dc2626, #f97316)',
    tasvir: "Kasallik shabloni tanlanadi (masalan prostatit, varikotsele) va bitta forma to'ldirilib, 4-5 xil rasmiy hujjat (birlamchi ko'rik, kunlik, epikriz va h.k.) avtomatik generatsiya qilinadi.",
    tafsilot: [
      "Har hujjat alohida tahrirlanadi, lekin birinchi hujjatdan ma'lumot avtomatik o'tadi.",
      "Bitta A4 betga moslashtirilgan, toza chop etish.",
    ],
  },
  {
    ikon: '🧮', nom: 'Kalkulyatorlar', rang: 'linear-gradient(135deg, #7c3aed, #c026d3)',
    tasvir: "15 ta standart urologik/andrologik kalkulyator (IPSS, PSA, eGFR, IIEF-5, spermogramma va h.k.) — har biri standart, manbasi bilan.",
    tafsilot: [
      "Bemor kartasidan to'g'ridan-to'g'ri ochiladi, natija bemor tarixiga saqlanadi.",
    ],
  },
  {
    ikon: '💊', nom: 'Retsept yozish', rang: 'linear-gradient(135deg, #d97706, #facc15)',
    tasvir: "Bemorga dori retsepti (nomi, dozasi, kuniga necha marta, necha kun, sana) yoziladi — telefon orqali bemor ilovasiga avtomatik bog'lanadi.",
    tafsilot: ["Bemor ilovasida darhol bildirishnoma va kunlik eslatma sifatida chiqadi."],
  },
  {
    ikon: '📨', nom: 'Murojaatlar', rang: 'linear-gradient(135deg, #0d9488, #22c55e)',
    tasvir: "Bemorlardan kelgan shikoyatlarni qabul qilish va javob yozish — 'Javob kutilayotgan' va 'Javob berilgan' deb guruhlangan.",
    tafsilot: ["Yangi murojaat kelganda push-bildirishnoma olish mumkin."],
  },
  {
    ikon: '📋', nom: "Protokollar va Qo'llanmalar", rang: 'linear-gradient(135deg, #475569, #94a3b8)',
    tasvir: "Klinik protokollar (admin tahrirlaydi) va 15 ta xalqaro qo'llanmaga havolalar, kategoriya bo'yicha.",
    tafsilot: [],
  },
]

export default function StudentShifokorBolimi() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/dashboard" backLabel="Bosh sahifa" />
      <div className="mx-auto max-w-[920px] px-8 py-8">
        <div className="rise" style={{
          background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: '14px',
          padding: '16px 20px', marginBottom: '24px', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          ℹ️ Bu — shifokor bo&apos;limining <strong>statik ko&apos;rinishi</strong>, faqat tanishish uchun. To&apos;liq foydalanish
          (bemor qo&apos;shish, hujjat yozish, retsept tayinlash va h.k.) uchun <strong>alohida &quot;shifokor&quot; rolidagi hisob yaratishingiz</strong> kerak.
        </div>

        <h2 className="rise" style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800 }}>Shifokor bo&apos;limi qanday tuzilgan</h2>
        <p className="rise" style={{ margin: '0 0 24px', color: 'var(--muted)', fontSize: '13.5px', maxWidth: '70ch' }}>
          Shifokorlar bemorlarni qabul qiladi, klinik hujjatlar yozadi va bemorlar bilan masofadan muloqot qiladi.
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
                {b.tafsilot.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {b.tafsilot.map((t) => (
                      <li key={t} style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: 1.5 }}>{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
