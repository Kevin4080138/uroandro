'use client'

import { Header } from '@/components/Header'

export default function YoriqnomaPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <Header backHref="/student/profil" backLabel="Profil" />
      <div className="mx-auto max-w-[600px] px-5 py-8 sm:px-8">
        <h2 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 800 }}>📖 Yo&apos;riqnoma</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            {
              raqam: 1, sarlavha: '📖 Darslarni boshlash',
              matn: "Bosh sahifadan \"Darslar\" bo'limiga kiring. Yuqorida 🟢 EASY, 🟡 O'RTA, 🔴 QIYIN bosqichlari ko'rinadi — har biri alohida sotib olinadi. Qulflangan (🔒) bosqichni ochish uchun \"Adminga yozish\" orqali murojaat qiling.",
            },
            {
              raqam: 2, sarlavha: '📂 Dars ichidagi bo\'limlar',
              matn: 'Har bir darsda bir nechta bo\'lim bor: Nazariya (matn), Video, Materiallar (konspekt/prezentatsiya), Amaliy test, USMLE va Nazorat. Bo\'limlar tarkibga qarab avtomatik ko\'rinadi.',
            },
            {
              raqam: 3, sarlavha: '✅ Amaliy test va 🏅 USMLE',
              matn: "Amaliy testda katta savol bankidan tasodifiy savollar tanlanadi, xohlagancha qayta urinish mumkin. To'g'ri javoblar faqat testni topshirgandan keyin ko'rinadi.",
            },
            {
              raqam: 4, sarlavha: '🔒 Nazorat testi',
              matn: "Bu — yopiq, qattiq nazorat: vaqt chegaralangan, faqat bitta marta urinish huquqi beriladi, javoblar darhol ko'rsatilmaydi. Belgilangan foizdan yuqori natija sertifikat olish huquqini beradi.",
            },
            {
              raqam: 5, sarlavha: '📊 Natijalarim va 🏆 Reyting',
              matn: "\"Natijalarim\" — barcha test urinishlaringiz va o'rtacha natijangiz. \"Reyting\" — qancha ko'p test ishlasangiz, shuncha yuqoriga ko'tarilasiz (nazorat testi reytingga kirmaydi).",
            },
            {
              raqam: 6, sarlavha: '📚 Kutubxona',
              matn: "Shifokorlar yuklagan qo'shimcha o'quv materiallari (PDF) shu yerda joylashgan.",
            },
            {
              raqam: 7, sarlavha: '👤 Profil',
              matn: "Pastki menyudagi \"Profil\" orqali tungi rejimni yoqish, fikr-mulohaza yuborish, adminga yozish/qo'ng'iroq qilish va hisob sozlamalariga kirish mumkin.",
            },
          ].map((b) => (
            <div key={b.raqam} className="rise" style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '14px', padding: '18px 20px',
              display: 'flex', gap: '14px',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0,
              }}>
                {b.raqam}
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '14.5px', fontWeight: 700 }}>{b.sarlavha}</h3>
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{b.matn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
