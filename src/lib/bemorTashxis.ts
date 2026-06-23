// Har bir organ/shikoyat toifasi bo'yicha bemorga ko'rsatiladigan
// taxminiy yo'nalish — bu tashxis emas, faqat yo'naltiruvchi ma'lumot.
export type TashxisMaslahat = {
  nom: string
  sabablar: string[]
  tavsiya: string[]
}

export const BEMOR_TASHXIS: Record<string, TashxisMaslahat> = {
  Siyish: {
    nom: 'Siydik yo\'llari bilan bog\'liq muammo (masalan, infeksiya)',
    sabablar: ['Siydik yo\'li infeksiyasi', 'Qovuq yallig\'lanishi (sistit)', 'Prostata bilan bog\'liq o\'zgarishlar'],
    tavsiya: ['Ko\'p suyuqlik iching', 'O\'zingiz antibiotik ichmang', 'Umumiy siydik tahlili topshiring', 'Shifokorga murojaat qiling'],
  },
  Buyrak: {
    nom: 'Buyrak bilan bog\'liq muammo (masalan, tosh yoki infeksiya)',
    sabablar: ['Buyrak toshi', 'Buyrak infeksiyasi (pielonefrit)', 'Buyrak funksiyasi buzilishi'],
    tavsiya: ['Ko\'p suv iching', 'Og\'riq kuchli bo\'lsa shoshilinch yordamga murojaat qiling', 'Buyrak USI va qon tahlilini topshiring'],
  },
  Qovuq: {
    nom: 'Qovuq bilan bog\'liq muammo',
    sabablar: ['Qovuq yallig\'lanishi', 'Qovuqda tosh', 'Siydik chiqishida to\'siq'],
    tavsiya: ['Ko\'p suyuqlik iching', 'Siydikni uzoq ushlab turmang', 'Shifokorga murojaat qiling'],
  },
  'Prostata bezi': {
    nom: 'Prostata bezi bilan bog\'liq muammo (prostatit yoki kattalashish)',
    sabablar: ['Prostata yallig\'lanishi (prostatit)', 'Prostata bezining kattalashishi (BPH)'],
    tavsiya: ['Uzoq o\'tirishdan saqlaning', 'Achchiq/alkogolli ovqatlarni kamaytiring', 'Urolog ko\'rigidan o\'ting'],
  },
  'Jinsiy aloqa': {
    nom: 'Jinsiy funksiya bilan bog\'liq muammo',
    sabablar: ['Stress va psixologik omillar', 'Gormonal o\'zgarishlar', 'Qon aylanishi bilan bog\'liq sabablar'],
    tavsiya: ['Stressni kamaytirishga harakat qiling', 'Chekish/alkogolni cheklang', 'Androlog konsultatsiyasidan o\'ting'],
  },
  'Moshonka / Tuxumdon': {
    nom: 'Moshonka/tuxumdon sohasidagi o\'zgarish (masalan, varikotsele)',
    sabablar: ['Varikotsele (vena kengayishi)', 'Yallig\'lanish (epididimit/orxit)', 'Travma'],
    tavsiya: ['Og\'ir jismoniy yuklamadan saqlaning', 'Shoshilinch shish/kuchli og\'riqda darhol shifokorga boring', 'Skrotal USI tekshiruvidan o\'ting'],
  },
  'Bepushtlik / reproduktiv': {
    nom: 'Reproduktiv funksiya bilan bog\'liq muammo',
    sabablar: ['Varikotsele', 'Gormonal nomuvozanat', 'Spermogramma ko\'rsatkichlari pastligi'],
    tavsiya: ['Spermogramma topshiring', 'Issiq vannadan saqlaning', 'Androlog/urolog konsultatsiyasidan o\'ting'],
  },
}

// Shu shikoyatlar tanlansa — holat shoshilinch deb belgilanadi.
export const SHOSHILINCH_SHIKOYATLAR = [
  'Siydikda qon (gematuriya)', "Harorat ko'tarilishi", 'Buyrak sohasida og\'riq (kolikasimon)',
  'Moshonkada shish', 'Ejakulyatsiyadan keyin og\'riq',
]
