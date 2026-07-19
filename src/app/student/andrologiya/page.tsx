'use client'

import { BolimTayyorlanmoqda } from '@/components/BolimTayyorlanmoqda'

// Faqat andrologiya yo'nalishini o'rganmoqchi bo'lgan talabalar uchun alohida
// bo'lim. Umumiy kursdan farqi — bu yerda andrologiya mavzulari ketma-ket,
// mustaqil kurs sifatida beriladi (umumiy kursda ular boshqa mavzular orasida
// tarqoq turadi).
//
// Mazmuni keyin to'ldiriladi; hozircha reja ko'rsatiladi.

export default function StudentAndrologiyaPage() {
  return (
    <BolimTayyorlanmoqda
      emoji="🧬"
      nom="Exclusive Andrologiya"
      tavsif="Faqat andrologiya yo'nalishi bo'yicha mustaqil kurs — erkaklar reproduktiv va jinsiy salomatligi bir ketma-ketlikda."
      izoh="Umumiy kursda andrologiya mavzulari boshqa bo'limlar orasida tarqoq turadi. Bu yerda ular alohida, ketma-ket kurs bo'lib yig'iladi."
      reja={[
        {
          sarlavha: 'Asoslar',
          punktlar: [
            'Erkak reproduktiv tizimi anatomiyasi va fiziologiyasi',
            'Gormonal boshqaruv — gipotalamus, gipofiz, moyak o\'qi',
            'Spermatogenez bosqichlari',
            'Andrologik bemorni so\'roq qilish va ko\'rish tartibi',
          ],
        },
        {
          sarlavha: 'Erkaklar bepushtligi',
          punktlar: [
            'Spermogramma — WHO 2021 me\'zonlari va talqini',
            'Azoospermiya: obstruktiv va nooobstruktiv farqi',
            'Varikotsele va bepushtlik bog\'liqligi',
            'Gormonal tekshiruv va genetik skrining',
            'Yordamchi reproduktiv texnologiyalar (IUI, IVF, ICSI)',
          ],
        },
        {
          sarlavha: 'Jinsiy funksiya buzilishlari',
          punktlar: [
            'Erektil disfunksiya — sabablari va bosqichma-bosqich davolash',
            'Erta eyakulyatsiya',
            'Orgazm va eyakulyatsiya buzilishlari',
            'Peyroni kasalligi',
            'Priapizm — shoshilinch yordam',
          ],
        },
        {
          sarlavha: 'Gormonal salomatlik',
          punktlar: [
            'Androgen yetishmovchiligi (kech boshlanuvchi gipogonadizm)',
            'Testosteron o\'rnini bosuvchi davolash — ko\'rsatma va xavflar',
            'Metabolik sindrom va erkaklar salomatligi bog\'liqligi',
          ],
        },
        {
          sarlavha: 'Amaliy qism',
          punktlar: [
            'Andrologik kalkulyatorlar: IIEF-5, AMS, ADAM, PEDT, spermogramma',
            'Klinik holatlar va vaziyatli masalalar',
            'Bo\'lim yakunida sertifikat',
          ],
        },
      ]}
    />
  )
}
