import type { Shablon, HujjatBlok } from './turlar'
import { cl, ro } from './turlar'

const KLINIKA = 'MERIDIAN DIAGNOSTIC HOSPITAL'

// ---- Umumiy matn bloklarini yasovchi yordamchilar ----
function shikoyatMatni(d: Record<string, any>) {
  const s = cl(d.shikoyatlar)
  return s.length ? s.join(', ').toLowerCase() + '.' : '—'
}

function statusPraesens(d: Record<string, any>): HujjatBlok[] {
  return [
    { tur: 'matn', matn: `Умумий аҳволи нисбатан қониқарли. Тана харорати-${ro(d.harorat, '36,6')} С. Суяк ва бўғим тизими деформациясиз.` },
    { tur: 'matn', matn: 'Нафас олиш тизими: Кўкрак қафаси деформациясиз. Нафас олиш бурун орқали равон. Ўпкаларда везикуляр нафас. Перкутор ўпка товуши.' },
    { tur: 'matn', matn: `Юрак қон томир тизими: Юрак қон томир уриши бир маромда, пульс 1 дақиқада ${ro(d.puls, '72')} та, АКБ ${ro(d.akb, '110/80')} мм.сим.уст.` },
    { tur: 'matn', matn: 'Овқат ҳазм қилиш тизими: Тили тоза, қорин пальпацияда юмшоқ, оғриқсиз. Жигар ва талоғи қўлга палпацияланмайди. Ич келиши меъёрда.' },
    { tur: 'matn', matn: 'Сийдик ажратув тизими: Бел соҳаси симметрик. Тукиллатиш симптоми икки томонлама манфий. Сийиши мустақил.' },
  ]
}

function tekshiruvlar(d: Record<string, any>): HujjatBlok[] {
  return [
    { tur: 'qator', chap: 'Сийдик копи (УЗИ)', ong: `Ҳажми-${ro(d.usi_qop_hajm, '140')} мл, шиллиқ қавати-${ro(d.usi_shilliq, '2')} мм` },
    { tur: 'qator', chap: 'Простата бези', ong: `ўлчамлари ${ro(d.prostata_olcham, '40х30х32')} мм, ҳажми-${ro(d.prostata_hajm, '19')} см³` },
    { tur: 'qator', chap: 'Умумий қон таҳлили', ong: `Hb-${ro(d.hb, '140')}; Эр-${ro(d.eritrotsit, '5.0')}; Ht-${ro(d.gematokrit, '41,9')}; Лей-${ro(d.leykotsit, '8.5')}; ЭЧТ-${ro(d.echt, '13')}` },
    { tur: 'qator', chap: 'Серология (RW/ВИЧ/HBs/HCV)', ong: ro(d.serologiya, 'Манфий') },
    { tur: 'qator', chap: 'Нечипоренко бўйича', ong: `Лей-${ro(d.nech_ley, '5000')}; Эр-${ro(d.nech_er, '1250')}; pH-${ro(d.nech_ph, '6,0')}; зичлиги-${ro(d.nech_zichlik, '1027')}` },
    { tur: 'qator', chap: 'Простата суюқлиги', ong: `Лей-${ro(d.pr_ley, '15-20')}; Эр-${ro(d.pr_er, '1-3')}; эпителий-${ro(d.pr_epitel, '6-8')}; сперматогенез-${ro(d.pr_spermatogenez, '1%')}` },
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
    { tur: 'qator', chap: 'Даволовчи врач', ong: ro(d.davolovchi, shifokorIsmi) },
    { tur: 'qator', chap: 'Бўлим мудири', ong: ro(d.bolim_mudiri, shifokorIsmi) },
  ]
}

function bemorBosh(d: Record<string, any>, bemor: any): HujjatBlok[] {
  return [
    { tur: 'qator', chap: 'Бемор', ong: `${ro(bemor?.fio, '—')}${d.tugilgan_yil ? `, ${d.tugilgan_yil}-йил` : ''}` },
  ]
}

export const prostatitShablon: Shablon = {
  id: 'prostatit',
  kasallik: 'Yallig\'langan prostatit',
  guruhlar: [
    {
      nom: 'Bemor ma\'lumotlari',
      maydonlar: [
        { key: 'tugilgan_yil', label: 'Tug\'ilgan yili', type: 'text' },
        { key: 'manzil', label: 'Manzili', type: 'text' },
        { key: 'ish_joyi', label: 'Ish joyi', type: 'select', variantlar: ['Ишсиз', 'Ишчи', 'Хизматчи', 'Тадбиркор', 'Нафақахўр'] },
        { key: 'tarix_raqami', label: 'Kasallik tarixi №', type: 'text' },
        { key: 'kelgan_sana', label: 'Kelgan sana', type: 'date' },
        { key: 'chiqgan_sana', label: 'Chiqgan sana', type: 'date' },
      ],
    },
    {
      nom: 'Shikoyatlar',
      maydonlar: [
        {
          key: 'shikoyatlar', label: 'Shikoyatlar', type: 'checklist',
          variantlar: [
            'Тез-тез сийишга', 'Сийдик босимини пасайишига', 'Қолдиқ сийдик ҳиссига',
            'Тунги сийдикка чақириқни кўплигига', 'Жинсий алоқани сусайишига',
            'Сийишда ачишишга', 'Иккала бел соҳасидаги суст оғриққа', 'Умумий ҳолсизликка',
          ],
        },
      ],
    },
    {
      nom: 'Anamnez',
      maydonlar: [
        { key: 'anamnez_morbi', label: 'Anamnesis morbi', type: 'textarea', default: 'Анамнезидан ўзини бир неча ойдан буён хаста деб билади. Хасталигини совуқ шароитдаги иш муҳити билан боғлайди. Хасталиги бўйича аввал даволанган. Юқоридаги шикоятлар билан текширувлардан ўтиш ва стационар даво учун MERIDIAN DIAGNOSTIC HOSPITAL клиникасига мурожаат қилиб келди.' },
        { key: 'anamnez_vitae', label: 'Anamnesis vitae', type: 'textarea', default: 'Ёшлигидан қониқарли оила шароитида ўсиб улғайган. Бемор сўзидан операция муолажалари ўтказмаган. Сурункали касалликлар ўтказмаган.' },
        { key: 'allergiya', label: 'Allergologik anamnez', type: 'text', default: 'Дори-дармонларга нисбатан ножўя ҳолат кузатилмаган.' },
      ],
    },
    {
      nom: 'Status praesens (ko\'rsatkichlar)',
      maydonlar: [
        { key: 'harorat', label: 'Tana harorati', type: 'text', birlik: '°C', default: '36,6' },
        { key: 'puls', label: 'Puls', type: 'number', birlik: 'bpm', default: '72' },
        { key: 'akb', label: 'AKB', type: 'text', birlik: 'mm.sim.', default: '110/80' },
      ],
    },
    {
      nom: 'Tekshiruvlar',
      maydonlar: [
        { key: 'usi_qop_hajm', label: 'Siydik qopi hajmi', type: 'text', birlik: 'ml', default: '140' },
        { key: 'usi_shilliq', label: 'Siydik qopi shilliq qavati', type: 'text', birlik: 'mm', default: '2' },
        { key: 'prostata_olcham', label: 'Prostata o\'lchami', type: 'text', default: '40х30х32' },
        { key: 'prostata_hajm', label: 'Prostata hajmi', type: 'text', birlik: 'sm³', default: '19' },
        { key: 'hb', label: 'Gemoglobin', type: 'text', default: '140' },
        { key: 'leykotsit', label: 'Leykotsit', type: 'text', default: '8.5' },
        { key: 'echt', label: 'EChT', type: 'text', default: '13' },
        { key: 'nech_ley', label: 'Nechiporenko leykotsit', type: 'text', default: '5000' },
        { key: 'pr_ley', label: 'Prostata suyuqligi leykotsit', type: 'text', default: '15-20' },
      ],
    },
    {
      nom: 'Tashxis',
      maydonlar: [
        {
          key: 'tashxis', label: 'Klinik tashxis', type: 'select',
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
          key: 'davo', label: 'Tavsiya etilgan dorilar', type: 'checklist',
          variantlar: [
            'Sol. Levofloxocini 100 ml в/в 1 маҳал 7 кун',
            'Sol. Reosorbilakti 200 ml в/в 1 маҳал томчилаб 5 кун',
            'Sol. Glucosae 5%-200 ml + Sol. Acidi ascorbinici 5%-6,0 ml в/в 1 маҳал 7 кун',
            'Caps. Tamsulozini 0,4 mg 1 капс х 1 маҳал 10 кун',
            'Supp. Diclofenaci 100 mg 1 св. х 1 маҳал 10 кун',
            'Стол №7, режим — умумий',
          ],
        },
        { key: 'chiqish_tavsiya', label: 'Chiqishdagi tavsiya', type: 'textarea', default: '1. Левофлоксоцин 500 мг 1 таб х 1 маҳал 7 кун\n2. Яшаш жойи уролог назорати\n3. Қайта кўрик 10 кундан сўнг' },
      ],
    },
    {
      nom: 'Imzolar',
      maydonlar: [
        { key: 'davolovchi', label: 'Davolovchi vrach', type: 'text' },
        { key: 'bolim_mudiri', label: 'Bo\'lim mudiri', type: 'text' },
        { key: 'bosh_vrach', label: 'Bosh vrach', type: 'text' },
      ],
    },
  ],

  hujjatlar: [
    // 1. Birlamchi ko'rik
    {
      id: 'birlamchi',
      nom: 'Birlamchi ko\'rik',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'sarlavha', matn: 'Урология бўлимида кўрик' },
        ...bemorBosh(d, bemor),
        { tur: 'qator', chap: 'Бемор шикоятлари', ong: shikoyatMatni(d) },
        { tur: 'bosh' },
        { tur: 'sarlavha', matn: 'Anamnesis morbi' },
        { tur: 'matn', matn: ro(d.anamnez_morbi) },
        { tur: 'sarlavha', matn: 'Anamnesis vitae' },
        { tur: 'matn', matn: ro(d.anamnez_vitae) },
        { tur: 'qator', chap: 'Аллергологик анамнез', ong: ro(d.allergiya) },
        { tur: 'sarlavha', matn: 'Status praesens' },
        ...statusPraesens(d),
        { tur: 'sarlavha', matn: 'Текширувларда' },
        ...tekshiruvlar(d),
        { tur: 'sarlavha', matn: 'Ташхис' },
        { tur: 'matn', matn: tashxisMatni(d) },
        { tur: 'sarlavha', matn: 'Тавсия' },
        { tur: 'royxat', bandlar: davoRoyxat(d) },
        ...imzolar(d, shifokorIsmi),
      ],
    },
    // 2. Kunlik yozuvlar (qisqa)
    {
      id: 'kunlik',
      nom: 'Kunlik yozuv',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'sarlavha', matn: 'Даволовчи врач кўриги' },
        { tur: 'qator', chap: 'Шикоятлари', ong: shikoyatMatni(d) },
        { tur: 'matn', matn: `Умумий аҳволи нисбатан қониқарли. Тана харорати-${ro(d.harorat, '36,6')} С. Юрак уриши бир маромда, пульс ${ro(d.puls, '72')} та, АКБ ${ro(d.akb, '110/80')} мм.сим.уст. Тили тоза, қорин юмшоқ, оғриқсиз. Бел соҳаси симметрик, тукиллатиш симптоми икки томонлама манфий. Сийдик ажралиши мустақил.` },
        { tur: 'qator', chap: 'Тавсия', ong: 'Даво муолажаларини давом эттириш.' },
        ...imzolar(d, shifokorIsmi),
      ],
    },
    // 3. Klinik tashxisni asoslash
    {
      id: 'asoslash',
      nom: 'Klinik tashxisni asoslash',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'sarlavha', matn: 'КЛИНИК ТАШХИСНИ АСОСЛАШ' },
        ...bemorBosh(d, bemor),
        { tur: 'qator', chap: 'Бемор шикоятлари', ong: shikoyatMatni(d) },
        { tur: 'matn', matn: ro(d.anamnez_morbi) },
        { tur: 'sarlavha', matn: 'Текширувларда' },
        ...tekshiruvlar(d),
        { tur: 'matn', matn: 'Юқоридагиларга асосланиб қуйидаги клиник ташхис қўйилди:' },
        { tur: 'sarlavha', matn: 'Диагноз' },
        { tur: 'matn', matn: tashxisMatni(d) },
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
