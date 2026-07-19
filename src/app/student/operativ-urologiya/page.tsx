'use client'

import { BolimTayyorlanmoqda } from '@/components/BolimTayyorlanmoqda'

// Operativ urologiya — nazariy darslardan alohida bo'lim. Nazariya darsi
// "qanday qaror qilaman" ga javob bersa, bu yerda "qanday bajariladi":
// operatsiya bosqichlari, kerakli asboblar va usul mualliflari.
//
// Mazmuni keyin to'ldiriladi; hozircha reja ko'rsatiladi.

export default function StudentOperativUrologiyaPage() {
  return (
    <BolimTayyorlanmoqda
      emoji="🔪"
      nom="Operativ urologiya"
      tavsif="Operatsiyalar, ularda ishlatiladigan asbob-uskunalar, bajarish usullari va usul mualliflari."
      izoh="Nazariya darslari 'qanday qaror qilaman' ga javob beradi. Bu bo'lim esa 'qanday bajariladi' — bosqichlar, asboblar va texnika."
      reja={[
        {
          sarlavha: 'Umumiy qism',
          punktlar: [
            'Operatsiyaga tayyorgarlik va bemorni baholash',
            'Anesteziya turlari va urologiyada tanlash',
            'Bemor pozitsiyalari (litotomiya, yon, Trendelenburg)',
            'Aseptika, antiseptika va operatsiya maydonini tayyorlash',
            'Operatsiyadan keyingi asoratlar — Clavien-Dindo tasnifi',
          ],
        },
        {
          sarlavha: 'Asbob-uskunalar',
          punktlar: [
            'Umumjarrohlik asboblari — ushlagich, qisqich, ignatutgich',
            'Endoskopik asboblar: sistoskop, ureteroskop, rezektoskop',
            'Laparoskopik uskunalar va troakarlar',
            'Litotripsiya uskunalari — lazer, pnevmatik, ultratovush',
            'Stentlar, kateterlar va drenajlar turlari',
            'Tikuv materiallari — turi, o\'lchami, qachon qaysi biri',
          ],
        },
        {
          sarlavha: 'Endoskopik operatsiyalar',
          punktlar: [
            'TURP — prostataning transuretral rezeksiyasi',
            'TURBT — qovuq o\'smasining transuretral rezeksiyasi',
            'URS va RIRS — ureteroskopiya va retrograd intrarenal jarrohlik',
            'PNL — perkutan nefrolitotomiya',
            'Optik uretrotomiya',
          ],
        },
        {
          sarlavha: 'Ochiq va laparoskopik operatsiyalar',
          punktlar: [
            'Nefrektomiya — radikal va qisman',
            'Piyeloplastika',
            'Radikal prostatektomiya',
            'Sistektomiya va siydik yo\'lini qayta tiklash',
            'Adrenalektomiya',
          ],
        },
        {
          sarlavha: 'Andrologik operatsiyalar',
          punktlar: [
            'Varikotselektomiya — Marmar, Palomo, Ivanissevich, laparoskopik',
            'Sirkumsizio',
            'Gidrotselektomiya — Winkelmann, Bergmann, Lord usullari',
            'Orxiopeksiya — kriptorxizm va torsiyada',
            'Penis protezlash',
          ],
        },
        {
          sarlavha: 'Usul mualliflari (eponimlar)',
          punktlar: [
            'Har bir usul kim tomonidan va qachon taklif qilingani',
            'Usullar orasidagi farq va nima uchun biri boshqasini almashtirgani',
            'Zamonaviy standart qaysi usul va sababi',
          ],
        },
      ]}
    />
  )
}
