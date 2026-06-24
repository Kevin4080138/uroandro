import type { Shablon, HujjatBlok } from './turlar'
import { cl, ro } from './turlar'

const KLINIKA = 'MERIDIAN DIAGNOSTIC HOSPITAL'

// ---- Umumiy matn bloklarini yasovchi yordamchilar ----
function shikoyatMatni(d: Record<string, any>) {
  const s = cl(d.shikoyatlar)
  return s.length ? s.join(', ').toLowerCase() + '.' : '—'
}

// Status praesens — bitta oqib turuvchi paragraf (haqiqiy hujjatdagidek)
function statusPraesensMatni(d: Record<string, any>) {
  return `Умумий аҳволи нисбатан қониқарли. Тана харорати-${ro(d.harorat, '36,6')} С. Суяк ва бўғим тизими деформациясиз. `
    + 'Нафас олиш тизими: Кўкрак қафаси деформациясиз. Нафас олиш бурун орқали равон. Ўпкаларда везикуляр нафас. Перкутор ўпка товуши. '
    + `Юрак қон томир тизими: Юрак қон томир уриши бир маромда пульс 1 дақиқада ${ro(d.puls, '72')} та, АКБ ${ro(d.akb, '110/80')} мм.сим.уст. `
    + 'Овқат хазм қилиш тизими: Тили тоза, қорин пальпацияда юмшоқ, оғриқсиз. Жигар ва талоғи қўлга палпацияланмайди. Ич келиши меъёрда. '
    + 'Сийдик ажратув тизими: Бел соҳаси симметрик. Тукиллатиш симптоми икки томонлама манфий. Сийиши мустақил.'
}

function tekshiruvlar(d: Record<string, any>): HujjatBlok[] {
  const kjs = ro(d.kjs, 'кенгаймаган')
  return [
    { tur: 'matn', matn: `УЗИ: Унг буйрак котурлари-тугри, улчами ${ro(d.ung_buyrak, '105х49')} мм, ТПП-${ro(d.ung_tpp, '18')} мм, КЖС-${kjs}. Чап буйрак котурлари-тугри, улчами ${ro(d.chap_buyrak, '110х59')} мм, ТПП-${ro(d.chap_tpp, '19')} мм, КЖС-${kjs}.` },
    { tur: 'matn', matn: `Сийдик копи: Хажми-${ro(d.usi_qop_hajm, '140')} мл, шиллик кавати-${ro(d.usi_shilliq, '2')} мм.` },
    { tur: 'matn', matn: `Простата бези: улчамлари ${ro(d.prostata_olcham, '40х30х32')} мм, хажми-${ro(d.prostata_hajm, '19')} см³.` },
    { tur: 'matn', matn: `Умумий қон таҳлили: Гемоглобин-${ro(d.hb, '140')}; Эритроцитлар-${ro(d.eritrotsit, '5.0')}; Гематокрит-${ro(d.gematokrit, '41,9')}; Лейкоцитлар-${ro(d.leykotsit, '8.5')}; ЭЧТ-${ro(d.echt, '5')}; Қон ивиш вақти-${ro(d.kon_ivish, '240-450')}.` },
    { tur: 'matn', matn: `RW – ${ro(d.rw, 'Манфий')}    ВИЧ – ${ro(d.vich, 'Манфий')}` },
    { tur: 'matn', matn: `HBS-Ag ВГ "В" – ${ro(d.hbsag, 'Манфий')}` },
    { tur: 'matn', matn: `Анти HCV ВГ "С" антитела – ${ro(d.hcv, 'Манфий')}` },
    { tur: 'matn', matn: `Нечипоренко бўйича сийдик тахлили: Лейкоцитлар-${ro(d.nech_ley, '5000')}; Эритроцитлар-${ro(d.nech_er, '1250')}; pH-${ro(d.nech_ph, '6,0')}; нисбий зичлиги-${ro(d.nech_zichlik, '1027')}.` },
    { tur: 'matn', matn: `Простата бези суюклиги тахлили: Лейкоцитлар-${ro(d.pr_ley, '15-20')}; Эритроцитлар-${ro(d.pr_er, '1-3')}; эпителий-${ro(d.pr_epitel, '6-8')}; сперматогенез-${ro(d.pr_spermatogenez, '1%')}.` },
  ]
}

function tashxisMatni(d: Record<string, any>) {
  return ro(d.tashxis, 'Асоратланмаган ПСЙИ. Яллиғланган простатит 3а категория. Эректил дисфункция.')
}

function davoRoyxat(d: Record<string, any>) {
  const dlar = cl(d.davo)
  return dlar.length ? dlar : ['Стол №7, режим — умумий']
}

function imzolar(d: Record<string, any>, shifokorIsmi: string): HujjatBlok[] {
  return [
    { tur: 'bosh' },
    { tur: 'imzo', chap: 'Даволовчи врач', ong: ro(d.davolovchi, shifokorIsmi) },
    { tur: 'imzo', chap: 'Бўлим мудири', ong: ro(d.bolim_mudiri, shifokorIsmi) },
  ]
}

function bemorTavsifi(bemor: any, d: Record<string, any>) {
  return `${ro(bemor?.fio, '—')} ${ro(d.tugilgan_yil, '____')}-йил.`
}

export const prostatitShablon: Shablon = {
  id: 'prostatit',
  kasallik: 'Yallig\'langan prostatit',
  guruhlar: [
    {
      nom: 'Bemor ma\'lumotlari',
      maydonlar: [
        { key: 'tugilgan_yil', label: 'Tug\'ilgan yili', type: 'text' },
        { key: 'korik_sana', label: 'Ko\'rik sanasi', type: 'date', faqat: ['birlamchi', 'asoslash'] },
        { key: 'korik_vaqt', label: 'Ko\'rik vaqti', type: 'select', default: '10:45', variantlar: ['08:30', '09:15', '10:00', '10:45', '11:30', '14:00'], faqat: ['birlamchi', 'asoslash'] },
        { key: 'manzil', label: 'Manzili', type: 'text', keng: true, faqat: ['epikriz'] },
        { key: 'ish_joyi', label: 'Ish joyi', type: 'select', variantlar: ['Ишсиз', 'Ишчи', 'Хизматчи', 'Тадбиркор', 'Нафақахўр'], faqat: ['epikriz'] },
        { key: 'tarix_raqami', label: 'Kasallik tarixi №', type: 'text', faqat: ['epikriz'] },
        { key: 'kelgan_sana', label: 'Kelgan sana', type: 'date', faqat: ['epikriz'] },
        { key: 'chiqgan_sana', label: 'Chiqgan sana', type: 'date', faqat: ['epikriz'] },
      ],
    },
    {
      nom: 'Shikoyatlar',
      maydonlar: [
        {
          key: 'shikoyatlar', label: 'Shikoyatlar', type: 'checklist',
          variantlar: [
            'Тез-тез сийишга', 'Сийдиганда ачишишга', 'Сийдик босимини пасайишига', 'Қолдиқ сийдик ҳиссига',
            'Тунги сийдикка чақирувни кўплигига', 'Жинсий алоқани сусайишига',
            'Иккала бел соҳасидаги суст оғриққа', 'Умумий ҳолсизликка',
          ],
        },
      ],
    },
    {
      nom: 'Anamnez',
      maydonlar: [
        { key: 'anamnez_morbi', label: 'Anamnesis morbi', type: 'textarea', keng: true, default: 'Анамнезидан ўзини бир неча ойдан буён хаста деб билади. Хасталигини совуқ шароитдаги иш муҳити билан боғлайди. Хасталиги бўйича аввал даволанган. Юқоридаги шикоятлар билан текширувлардан ўтиш ва стационар даво учун MERIDIAN DIAGNOSTIC HOSPITAL клиникасига мурожаат қилиб келди.' },
        { key: 'anamnez_vitae', label: 'Anamnesis vitae', type: 'textarea', keng: true, faqat: ['birlamchi'], default: 'Ёшлигидан қониқарли оила шароитида ўсиб улғайган. Бемор сўзидан операция муолажалари ўтказмаган. Сурункали касалликлар ўтказмаган.' },
        { key: 'allergiya', label: 'Allergologik anamnez', type: 'text', keng: true, faqat: ['birlamchi'], default: 'Дори-дармонларга нисбатан ножўя ҳолат кузатилмаган.' },
      ],
    },
    {
      nom: 'Status praesens (ko\'rsatkichlar)',
      maydonlar: [
        { key: 'harorat', label: 'Tana harorati', type: 'select', birlik: '°C', default: '36,6', variantlar: ['36,4', '36,5', '36,6', '36,8', '37,0', '37,2', '37,5', '38,0'] },
        { key: 'puls', label: 'Puls', type: 'select', birlik: 'bpm', default: '72', variantlar: ['66', '68', '70', '72', '74', '76', '78', '80', '84', '88'] },
        { key: 'akb', label: 'AKB', type: 'select', birlik: 'mm.sim.', default: '110/80', variantlar: ['100/60', '110/70', '110/80', '120/80', '120/90', '130/80', '130/90', '140/90'] },
      ],
    },
    {
      nom: 'Tekshiruvlar — Buyrak USI',
      maydonlar: [
        { key: 'ung_buyrak', label: "O'ng buyrak o'lchami", type: 'text', birlik: 'mm', default: '105х49', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'ung_tpp', label: "O'ng TPP", type: 'text', birlik: 'mm', default: '18', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'chap_buyrak', label: 'Chap buyrak o\'lchami', type: 'text', birlik: 'mm', default: '110х59', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'chap_tpp', label: 'Chap TPP', type: 'text', birlik: 'mm', default: '19', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'kjs', label: 'KJS (kosa-jom)', type: 'select', default: 'кенгаймаган', variantlar: ['кенгаймаган', 'кенгайган'], faqat: ['birlamchi', 'asoslash', 'epikriz'] },
      ],
    },
    {
      nom: 'Tekshiruvlar — Qolgan',
      maydonlar: [
        { key: 'usi_qop_hajm', label: 'Siydik qopi hajmi', type: 'text', birlik: 'ml', default: '140', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'usi_shilliq', label: 'Siydik qopi shilliq', type: 'text', birlik: 'mm', default: '2', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'prostata_olcham', label: 'Prostata o\'lchami (hajm avtomatik)', type: 'olcham', keng: true, default: '40х30х32', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'hb', label: 'Gemoglobin', type: 'text', default: '140', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'leykotsit', label: 'Leykotsit', type: 'text', default: '8.5', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'echt', label: 'EChT', type: 'text', default: '13', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'kon_ivish', label: 'Qon ivish vaqti', type: 'text', default: '240-450', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'rw', label: 'RW', type: 'select', default: 'Манфий', variantlar: ['Манфий', 'Мусбат'], faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'vich', label: 'ВИЧ', type: 'select', default: 'Манфий', variantlar: ['Манфий', 'Мусбат'], faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'hbsag', label: 'HBs-Ag (ВГ "В")', type: 'select', default: 'Манфий', variantlar: ['Манфий', 'Мусбат'], faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'hcv', label: 'Анти HCV (ВГ "С")', type: 'select', default: 'Манфий', variantlar: ['Манфий', 'Мусбат'], faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'nech_ley', label: 'Nechiporenko leykotsit', type: 'text', default: '5000', faqat: ['birlamchi', 'asoslash', 'epikriz'] },
        { key: 'pr_ley', label: 'Prostata suyuqligi ley.', type: 'select', default: '15-20', variantlar: ['1-3', '5-10', '15-20', '25-30', '30-40', 'спл'], faqat: ['birlamchi', 'asoslash', 'epikriz'] },
      ],
    },
    {
      nom: 'Tashxis',
      maydonlar: [
        {
          key: 'tashxis', label: 'Klinik tashxis', type: 'select', keng: true,
          variantlar: [
            'Асоратланмаган ПСЙИ. Яллиғланган простатит 3а категория. Эректил дисфункция.',
            'Асоратланмаган ПСЙИ. Яллиғланган простатит 3b категория.',
            'Ўткир простатит.',
            'Сурункали бактериал простатит.',
          ],
        },
      ],
    },
    {
      nom: 'Davolash',
      maydonlar: [
        {
          key: 'davo', label: 'Tavsiya etilgan dorilar', type: 'checklist', faqat: ['birlamchi', 'epikriz'],
          variantlar: [
            'Стол №7, режим — умумий',
            'Sol. Levofloxocini 100 ml в/в синама билан 1 маҳал 7 кун',
            'Sol. Reosorbilakti 200 ml в/в 1 маҳал томчилаб 5 кун',
            'Sol. Glucosae 5%-200 ml + Sol. Acidi ascorbinici 5%-6,0 ml в/в 1 маҳал 7 кун',
            'Sol. Ketorolaci 2,0 ml в/м 1 маҳал овқатдан сўнг 5 кун',
            'Caps. Tamsulozini 0,4 mg 1 капс х 1 маҳал 10 кун',
            'Supp. Diclofenaci 100 mg 1 св. х 1 маҳал 10 кун',
          ],
        },
        { key: 'chiqish_tavsiya', label: 'Chiqishdagi tavsiya', type: 'textarea', keng: true, faqat: ['epikriz'], default: '1. Левофлоксоцин 500 мг 1 таб х 1 маҳал 7 кун\n2. Яшаш жойи уролог назорати\n3. Қайта кўрик 10 кундан сўнг' },
      ],
    },
    {
      nom: 'Imzolar',
      maydonlar: [
        { key: 'davolovchi', label: 'Davolovchi vrach', type: 'text' },
        { key: 'bolim_mudiri', label: 'Bo\'lim mudiri', type: 'text' },
        { key: 'bosh_vrach', label: 'Bosh vrach', type: 'text', faqat: ['epikriz'] },
      ],
    },
  ],

  hujjatlar: [
    // 1. Birlamchi ko'rik (oqib turuvchi matn — haqiqiy hujjatdek)
    {
      id: 'birlamchi',
      nom: 'Birlamchi ko\'rik',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'matn', matn: `${ro(d.korik_sana, '__.__.____')}-й   Соат: ${ro(d.korik_vaqt, '____')}        Урология бўлимида кўрик.` },
        { tur: 'band', etiket: 'Бемор', matn: bemorTavsifi(bemor, d) },
        { tur: 'band', etiket: 'Бемор шикоятлари', matn: shikoyatMatni(d) },
        { tur: 'band', etiket: 'Anamnesis morbi', matn: ro(d.anamnez_morbi) },
        { tur: 'band', etiket: 'Anamnesis vitae', matn: `${ro(d.anamnez_vitae)} Аллергологик анамнез: ${ro(d.allergiya)}` },
        { tur: 'band', etiket: 'Status praesens', matn: statusPraesensMatni(d) },
        { tur: 'matn', matn: 'Текширувларда:' },
        ...tekshiruvlar(d),
        { tur: 'matn', matn: 'Юкоридагиларга асосланиб куйидаги дастлабки ташхис куйилди:' },
        { tur: 'band', etiket: 'Ташхис', matn: tashxisMatni(d) },
        { tur: 'band', etiket: 'Тавсия', matn: '' },
        { tur: 'royxat', bandlar: davoRoyxat(d) },
        { tur: 'matn', matn: 'ВМ 404 сонли буйрук 1-илова 9-бандига кура шифохонада йук дорилар бемор кулига ёзиб берилди. Дорилар мувофиклиги, яроклилик муддати, урамлар бутунлиги, тиниклиги текширилди.' },
        ...imzolar(d, shifokorIsmi),
      ],
    },
    // 2. Kunlik yozuvlar (bir nechta kun)
    {
      id: 'kunlik',
      nom: 'Kunlik yozuvlar',
      kunlik: true,
      render: (d, bemor, shifokorIsmi) => {
        const kunlar: any[] = Array.isArray(d.kunlar) && d.kunlar.length ? d.kunlar : [{}]
        const bloklar: HujjatBlok[] = []
        kunlar.forEach((k, idx) => {
          const shik = Array.isArray(k.shikoyatlar) && k.shikoyatlar.length ? k.shikoyatlar.join(', ').toLowerCase() + '.' : '—'
          if (idx > 0) bloklar.push({ tur: 'bosh' })
          bloklar.push({ tur: 'matn', matn: `${ro(k.sana, '__.__.____')}-й   Соат: ${ro(k.vaqt, '____')}        Даволовчи врач кўриги.` })
          bloklar.push({ tur: 'band', etiket: 'Шикоятлари', matn: shik })
          bloklar.push({ tur: 'matn', matn: `Умумий аҳволи нисбатан қониқарли. Кўринадиган тери ва шиллиқ қаватлари одатдаги рангда. Тана харорати-${ro(k.harorat, '36,6')} С. Кўкрак қафаси деформациясиз. Нафас олиш бурун орқали равон. Ўпкаларда везикуляр нафас. Юрак қон томир уриши бир маромда, пульс 1 дақиқада ${ro(k.puls, '72')} та, АКБ ${ro(k.akb, '110/70')} мм.сим.уст. Тили тоза, қорин пальпацияда юмшоқ оғриқсиз, жигар ва талоғи қўлга палпацияланмайди. Ич келиши меъёрда. Бел соҳаси симметрик. Тукиллатиш симптоми икки томонлама манфий. Сийдик ажралиши мустақил.` })
          bloklar.push({ tur: 'band', etiket: 'Тавсия', matn: ro(k.tavsiya, 'Даво муолажаларини давом эттириш.') })
          bloklar.push({ tur: 'imzo', chap: 'Даволовчи врач', ong: ro(d.davolovchi, shifokorIsmi) })
        })
        return bloklar
      },
    },
    // 3. Klinik tashxisni asoslash
    {
      id: 'asoslash',
      nom: 'Klinik tashxisni asoslash',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'sarlavha', matn: 'КЛИНИК ТАШХИСНИ АСОСЛАШ' },
        { tur: 'band', etiket: 'Бемор', matn: bemorTavsifi(bemor, d) },
        { tur: 'band', etiket: 'Бемор шикоятлари', matn: shikoyatMatni(d) },
        { tur: 'matn', matn: ro(d.anamnez_morbi) },
        { tur: 'matn', matn: 'Текширувларда:' },
        ...tekshiruvlar(d),
        { tur: 'matn', matn: 'Юкоридагиларга асосланиб куйидаги клиник ташхис куйилди:' },
        { tur: 'band', etiket: 'Диагноз', matn: tashxisMatni(d) },
        ...imzolar(d, shifokorIsmi),
      ],
    },
    // 4. Epikriz / Kasallik tarixidan ko'chirma
    {
      id: 'epikriz',
      nom: 'Epikriz (kasallik tarixidan ko\'chirma)',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'sarlavha', matn: `${KLINIKA} — Касаллик тарихидан кўчирма №${ro(d.tarix_raqami, '____')}` },
        { tur: 'qator', chap: '1) Бемор', ong: ro(bemor?.fio) },
        { tur: 'qator', chap: '2) Туғилган йили', ong: ro(d.tugilgan_yil) },
        { tur: 'qator', chap: '3) Манзили', ong: ro(d.manzil) },
        { tur: 'qator', chap: '4) Иш жойи', ong: ro(d.ish_joyi, 'Ишсиз') },
        { tur: 'qator', chap: '5) Даволанган кунлари', ong: `${ro(d.kelgan_sana, '—')} — ${ro(d.chiqgan_sana, '—')}` },
        { tur: 'qator', chap: '6) Клиник диагноз', ong: tashxisMatni(d) },
        { tur: 'sarlavha', matn: '7) Қисқача маълумот' },
        { tur: 'qator', chap: 'Шикоятлар', ong: shikoyatMatni(d) },
        { tur: 'matn', matn: ro(d.anamnez_morbi) },
        { tur: 'sarlavha', matn: 'Текширувлар' },
        ...tekshiruvlar(d),
        { tur: 'matn', matn: 'Бўлимда қуйидаги даво муолажаларини олди: ' + davoRoyxat(d).join('; ') + '. Динамикада умумий аҳволи яхшиланди, қониқарли ҳолатда яшаш жойи уролог назоратига чиқарилди.' },
        { tur: 'sarlavha', matn: 'Тавсия' },
        { tur: 'matn', matn: ro(d.chiqish_tavsiya) },
        ...imzolar(d, shifokorIsmi),
        { tur: 'qator', chap: 'Бош врач', ong: ro(d.bosh_vrach, '—') },
      ],
    },
  ],
}
