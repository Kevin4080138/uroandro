/**
 * Skrinshotlarni qirqib, landing uchun WebP ga o'giradi.
 *
 * Manba: 1080x2400 telefon skrinshoti. Kesiladigan qismlar:
 *   - tepada holat paneli (soat, batareya) va ilova sarlavhasi (avatar bilan)
 *   - pastda tab-navigatsiya va Android tugmalari
 * Qolgani — sof mazmun.
 *
 * Ishga tushirish: node skrinshotlar/qirq.js
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const MANBA = __dirname
const NATIJA = path.join(__dirname, '..', 'public', 'landing')

// y1..y2 — original 1080x2400 koordinatalarida mazmun chegarasi
const RASMLAR = [
  // ── TALABA ──
  { fayl: 'photo_2026-07-20_13-52-10.jpg',     nom: 'talaba-bolimlar',    y1: 380,  y2: 1960 },
  { fayl: 'photo_2026-07-20_13-52-11.jpg',     nom: 'talaba-bosqich-oson', y1: 390, y2: 1860 },
  { fayl: 'photo_2026-07-20_13-52-12.jpg',     nom: 'talaba-bosqich-pro', y1: 470,  y2: 2000 },
  // Boshqa kartalar bilan bir xil nisbatda bo'lishi uchun 11 qadamning
  // sarlavhasi + birinchi qismi olinadi (to'liq ro'yxat juda cho'ziq chiqadi)
  { fayl: 'photo_2026-07-20_13-52-15.jpg',     nom: 'talaba-dars-qadamlar', y1: 100, y2: 1560, x1: 0, x2: 880 },
  { fayl: 'photo_2026-07-20_13-52-14 (2).jpg', nom: 'talaba-nazariya',    y1: 500,  y2: 1990 },
  { fayl: 'photo_2026-07-20_13-52-16.jpg',     nom: 'talaba-kalkulyator', y1: 320,  y2: 2050 },

  // ── BEMOR ──
  { fayl: 'photo_2026-07-20_13-52-22.jpg',     nom: 'bemor-bolimlar',     y1: 350,  y2: 2150 },
  { fayl: 'photo_2026-07-20_13-52-22 (2).jpg', nom: 'bemor-qayeringiz',   y1: 380,  y2: 2130 },
  { fayl: 'photo_2026-07-20_13-52-23.jpg',     nom: 'bemor-shikoyat',     y1: 380,  y2: 2200 },
  { fayl: 'photo_2026-07-20_13-52-24.jpg',     nom: 'bemor-yonalish',     y1: 270,  y2: 2140 },
  { fayl: 'photo_2026-07-20_13-52-25.jpg',     nom: 'bemor-operatsiya',   y1: 320,  y2: 2150 },
  { fayl: 'photo_2026-07-20_13-52-27.jpg',     nom: 'bemor-oz-tekshiruv', y1: 300,  y2: 2150 },
]

const KENGLIK = 560 // landing'da karta ~280px, retina uchun 2x

;(async () => {
  fs.mkdirSync(NATIJA, { recursive: true })
  for (const r of RASMLAR) {
    const manba = path.join(MANBA, r.fayl)
    if (!fs.existsSync(manba)) { console.log('YO\'Q:', r.fayl); continue }

    const x1 = r.x1 ?? 0
    const x2 = r.x2 ?? 1080
    const chiqish = path.join(NATIJA, r.nom + '.webp')

    await sharp(manba)
      .extract({ left: x1, top: r.y1, width: x2 - x1, height: r.y2 - r.y1 })
      .resize({ width: KENGLIK })
      .webp({ quality: 82 })
      .toFile(chiqish)

    const { size } = fs.statSync(chiqish)
    const m = await sharp(chiqish).metadata()
    console.log(`${r.nom.padEnd(22)} ${m.width}x${m.height}  ${(size / 1024).toFixed(0)} KB`)
  }
})()
