import type { Shablon, HujjatBlok } from './turlar'
import { cl, ro } from './turlar'

const KLINIKA = 'MERIDIAN DIAGNOSTIC HOSPITAL'

function shikoyatMatni(d: Record<string, any>) {
  const s = cl(d.shikoyatlar)
  return s.length ? s.join(', ').toLowerCase() + '.' : '—'
}

function uroStatus(d: Record<string, any>) {
  const tomon = ro(d.tomon, 'чап')
  return 'URO STATUS: Бел соҳаси курилганда симметрик. Терида кўкариш, шиш белгилари йўқ. Тукиллатиш симптоми икки томонлама манфий. '
    + 'Сийиши мустақил, қовуқ соҳаси ўзгаришсиз, пальпацияда оғриқсиз. '
    + `Ташқи жинсий аъзолари курилганда ${tomon} мояк хажми бироз кичиклашган. Қарама-қарши мояк ва мояк ортиклари ўзгаришсиз, оғриқсиз. `
    + `${tomon[0].toUpperCase() + tomon.slice(1)} томонда уруғ тизимчаси веналари бўртиб кенгайган. Вальсалва синамаси мусбат.`
}

function statusPraesensMatni(d: Record<string, any>) {
  return `Умумий ахволи нисбатан қониқарли. Тана харорати-${ro(d.harorat, '36,6')} С. Суяк ва бўғим тизими деформациясиз. `
    + 'Нафас олиш тизими: Кўкрак қафаси деформациясиз. Нафас олиш бурун орқали равон. Ўпкаларда везикуляр нафас. Перкутор ўпка товуши. '
    + `Юрак қон томир тизими: Юрак қон томир уриши бир маромда пульс 1 дақиқада ${ro(d.puls, '72')} та, АКБ ${ro(d.akb, '120/80')} мм.сим.уст. Юрак чегаралари нормада. `
    + 'Овқат хазм қилиш тизими: Тили тоза, қорин пальпацияда юмшоқ, оғриқсиз. Жигар ва талоғи қўлга урилмаяпти. Ич келиши меъёрда.'
}

function tekshiruvlar(d: Record<string, any>): HujjatBlok[] {
  return [
    { tur: 'matn', matn: `УЗИ мояклар: Унг мояк - ${ro(d.ong_moyak, '47х22х26')} мм, объём-${ro(d.ong_hajm, '14')} см³, контур-текис, тузилиши бир хил. Чап мояк - ${ro(d.chap_moyak, '41х21х23')} мм, объём-${ro(d.chap_hajm, '10,5')} см³, контур-текис, тузилиши бир хил. Хулоса: ${ro(d.usi_xulosa, 'Чап томонлама варикоцеле II ст. Чап мояк гипоплазияси.')}` },
    { tur: 'matn', matn: `Умумий қон таҳлили: Гемоглобин-${ro(d.hb, '134')}; Эритроцитлар-${ro(d.eritrotsit, '4,6')}; Гематокрит-${ro(d.gematokrit, '40,6')}; Лейкоцитлар-${ro(d.leykotsit, '8,4')}; ЭЧТ-${ro(d.echt, '8')}; Қон ивиш вақти-${ro(d.kon_ivish, '230-500')}; Глюкоза-${ro(d.glukoza, '5,7')} ммоль/л.` },
    { tur: 'matn', matn: `RW – ${ro(d.rw, 'Манфий')}    ОИВ – ${ro(d.vich, 'Манфий')}` },
    { tur: 'matn', matn: `HBS-Ag ВГ "В" – ${ro(d.hbsag, 'Манфий')}` },
    { tur: 'matn', matn: `Анти HCV ВГ "С" антитела – ${ro(d.hcv, 'Манфий')}` },
    { tur: 'matn', matn: `Нечипоренко тахлили: Лейкоцитлар-${ro(d.nech_ley, '3000')}; Эритроцитлар-${ro(d.nech_er, '1750')}; pH-${ro(d.nech_ph, '6,8')}; тузлар-+.` },
  ]
}

function tashxisMatni(d: Record<string, any>) {
  return ro(d.tashxis, 'Чап томонлама варикоцеле III даража. Чап мояк гипоплазияси.')
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

export const varikotseleShablon: Shablon = {
  id: 'varikotsele',
  kasallik: 'Varikotsele (operatsiya)',
  guruhlar: [
    {
      nom: 'Bemor ma\'lumotlari',
      maydonlar: [
        { key: 'tugilgan_yil', label: 'Tug\'ilgan yili', type: 'text' },
        { key: 'korik_sana', label: 'Ko\'rik sanasi', type: 'date', faqat: ['birlamchi'] },
        { key: 'korik_vaqt', label: 'Ko\'rik vaqti', type: 'select', default: '14:45', variantlar: ['08:30', '10:00', '14:45', '16:00'], faqat: ['birlamchi'] },
        { key: 'manzil', label: 'Manzili', type: 'text', keng: true, faqat: ['oldi', 'epikriz'] },
        { key: 'ish_joyi', label: 'Ish joyi', type: 'select', variantlar: ['Ишламайди', 'Ишчи', 'Хизматчи', 'Тадбиркор'], faqat: ['oldi', 'epikriz'] },
        { key: 'tarix_raqami', label: 'Kasallik tarixi №', type: 'text', faqat: ['oldi', 'epikriz'] },
        { key: 'kelgan_sana', label: 'Kelgan sana', type: 'date', faqat: ['oldi', 'epikriz'] },
        { key: 'chiqgan_sana', label: 'Chiqgan sana', type: 'date', faqat: ['epikriz'] },
      ],
    },
    {
      nom: 'Tomon va daraja',
      maydonlar: [
        { key: 'tomon', label: 'Tomoni', type: 'select', default: 'чап', variantlar: ['чап', 'ўнг', 'икки томонлама'] },
        { key: 'daraja', label: 'Darajasi', type: 'select', default: 'III', variantlar: ['I', 'II', 'III'] },
      ],
    },
    {
      nom: 'Shikoyatlar',
      maydonlar: [
        {
          key: 'shikoyatlar', label: 'Shikoyatlar', type: 'checklist',
          variantlar: [
            'Чап ёрғоқ соҳасидаги қон томирлар бўртиб кенгайишига',
            'Ўнг ёрғоқ соҳасидаги қон томирлар бўртиб кенгайишига',
            'Шу соҳадаги зўриқишда суст оғриққа',
            'Моякда симиллаб оғриққа', 'Умумий ҳолсизликка', 'Бепуштлик бўйича',
          ],
        },
      ],
    },
    {
      nom: 'Anamnez',
      maydonlar: [
        { key: 'anamnez_morbi', label: 'Anamnesis morbi', type: 'textarea', keng: true, default: 'Анамнезидан ўзини бир неча йилдан буён хаста деб билади. Бемор сўзидан аввал текширувлардан ўтмаган ва уролог томонидан кўрилмаган. Юқоридаги шикоятлар билан тўлиқ текширувлардан ўтиш ва оператив даво учун MERIDIAN DIAGNOSTIC HOSPITAL клиникасига мурожаат қилиб келди.' },
        { key: 'anamnez_vitae', label: 'Anamnesis vitae', type: 'textarea', keng: true, faqat: ['birlamchi', 'epikriz'], default: 'Ёшлигидан қониқарли оилавий шароитда ўсиб улғайган. Эпид анамнезидан сурункали касалликлар ўтказмаган. Аллергологик анамнезидан дори-дармонларга сезгирлиги аниқланмаган.' },
      ],
    },
    {
      nom: 'Status (ko\'rsatkichlar)',
      maydonlar: [
        { key: 'harorat', label: 'Tana harorati', type: 'select', birlik: '°C', default: '36,6', variantlar: ['36,4', '36,5', '36,6', '36,8', '37,0'] },
        { key: 'puls', label: 'Puls', type: 'select', default: '72', variantlar: ['68', '70', '72', '76', '80', '82'] },
        { key: 'akb', label: 'AKB', type: 'select', default: '120/80', variantlar: ['110/70', '110/80', '120/80', '120/90', '130/80'] },
      ],
    },
    {
      nom: 'Tekshiruvlar — Moyak USI',
      maydonlar: [
        { key: 'ong_moyak', label: 'O\'ng moyak o\'lchami', type: 'text', birlik: 'mm', default: '47х22х26', faqat: ['birlamchi', 'epikriz'] },
        { key: 'ong_hajm', label: 'O\'ng moyak hajmi', type: 'text', birlik: 'sm³', default: '14', faqat: ['birlamchi', 'epikriz'] },
        { key: 'chap_moyak', label: 'Chap moyak o\'lchami', type: 'text', birlik: 'mm', default: '41х21х23', faqat: ['birlamchi', 'epikriz'] },
        { key: 'chap_hajm', label: 'Chap moyak hajmi', type: 'text', birlik: 'sm³', default: '10,5', faqat: ['birlamchi', 'epikriz'] },
        { key: 'usi_xulosa', label: 'USI xulosasi', type: 'text', keng: true, default: 'Чап томонлама варикоцеле II ст. Чап мояк гипоплазияси.', faqat: ['birlamchi', 'epikriz'] },
      ],
    },
    {
      nom: 'Tekshiruvlar — Qon/Siydik',
      maydonlar: [
        { key: 'hb', label: 'Gemoglobin', type: 'text', default: '134', faqat: ['birlamchi', 'epikriz'] },
        { key: 'leykotsit', label: 'Leykotsit', type: 'text', default: '8.4', faqat: ['birlamchi', 'epikriz'] },
        { key: 'glukoza', label: 'Glyukoza', type: 'text', default: '5.7', faqat: ['birlamchi', 'epikriz'] },
        { key: 'rw', label: 'RW', type: 'select', default: 'Манфий', variantlar: ['Манфий', 'Мусбат'], faqat: ['birlamchi', 'epikriz'] },
        { key: 'vich', label: 'ОИВ', type: 'select', default: 'Манфий', variantlar: ['Манфий', 'Мусбат'], faqat: ['birlamchi', 'epikriz'] },
        { key: 'hbsag', label: 'HBs-Ag', type: 'select', default: 'Манфий', variantlar: ['Манфий', 'Мусбат'], faqat: ['birlamchi', 'epikriz'] },
        { key: 'hcv', label: 'Анти HCV', type: 'select', default: 'Манфий', variantlar: ['Манфий', 'Мусбат'], faqat: ['birlamchi', 'epikriz'] },
      ],
    },
    {
      nom: 'Tashxis',
      maydonlar: [
        { key: 'tashxis', label: 'Klinik tashxis', type: 'select', keng: true, variantlar: ['Чап томонлама варикоцеле III даража. Чап мояк гипоплазияси.', 'Чап томонлама варикоцеле II даража.', 'Ўнг томонлама варикоцеле III даража.', 'Икки томонлама варикоцеле.'] },
      ],
    },
    {
      nom: 'Operatsiya',
      maydonlar: [
        { key: 'operatsiya_nomi', label: 'Operatsiya nomi', type: 'select', keng: true, default: 'Чап томонлама Мармар операцияси', variantlar: ['Чап томонлама Мармар операцияси', 'Ўнг томонлама Мармар операцияси', 'Лапароскопик варикоцелэктомия', 'Иваниссевич операцияси'], faqat: ['oldi', 'bayoni', 'epikriz'] },
        { key: 'korsatma', label: 'Ko\'rsatma', type: 'textarea', keng: true, default: 'Консерватив давони ёрдам бермаслиги, асоратларни олдини олиш, беморни розилиги.', faqat: ['oldi'] },
        { key: 'premedikatsiya', label: 'Premedikatsiya', type: 'text', keng: true, default: 'Sol. Promedoli 2%-1,0 ml в/м операциядан 30 минут олдин', faqat: ['oldi'] },
        { key: 'anesteziya', label: 'Og\'riqsizlantirish', type: 'text', keng: true, default: 'Махаллий Sol. Novocaini 0,5%-200 ml', faqat: ['oldi', 'bayoni'] },
        { key: 'operatsiya_sana', label: 'Operatsiya sanasi', type: 'date', faqat: ['oldi', 'bayoni'] },
        { key: 'operatsiya_vaqt', label: 'Operatsiya vaqti', type: 'text', default: '16:00-16:40', faqat: ['oldi', 'bayoni'] },
        { key: 'davomiyligi', label: 'Davomiyligi (min)', type: 'text', default: '40', faqat: ['oldi'] },
        { key: 'xirurg', label: 'Xirurg', type: 'text', faqat: ['oldi', 'bayoni'] },
        { key: 'assistent', label: 'Assistent', type: 'text', faqat: ['oldi', 'bayoni'] },
        { key: 'hamshira', label: 'Operatsion hamshira', type: 'text', faqat: ['oldi', 'bayoni'] },
        { key: 'bayon_raqami', label: 'Bayon №', type: 'text', faqat: ['bayoni'] },
        { key: 'operatsiya_matni', label: 'Operatsiya bayoni matni', type: 'textarea', keng: true, faqat: ['bayoni'], default: 'Асептик шароитда операция майдони 4 марта 96% ли спирт билан ишлов берилиб, тери чап чов соҳасидан Sol. Novocaini 0,5%-200 мл билан оғриқсизлантирилди ва 3 см кесилди. Гемостаз. Тери ости ёғ қавати кесиб очилди. Чап уруғ тизимча венаси топилди, ажратилди. Уруғ тизимчаси веналари 2 та қисқичга олиниб, улар орасидан кесилиб боғланди. Жароҳат гемостаз ва ёт жисмга текширилиб, қаватма-қават тикиб беркитилди. Спирт. Асептик боғлам.' },
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
    // 1. Birlamchi ko'rik
    {
      id: 'birlamchi',
      nom: 'Birlamchi ko\'rik',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'matn', matn: `${ro(d.korik_sana, '__.__.____')}-й   Соат: ${ro(d.korik_vaqt, '____')}        Урология бўлимида кўрик.` },
        { tur: 'band', etiket: 'Бемор', matn: bemorTavsifi(bemor, d) },
        { tur: 'band', etiket: 'Бемор шикоятлари', matn: shikoyatMatni(d) },
        { tur: 'band', etiket: 'Anamnesis morbi', matn: ro(d.anamnez_morbi) },
        { tur: 'band', etiket: 'Anamnesis vitae', matn: ro(d.anamnez_vitae) },
        { tur: 'band', etiket: 'Status praesens', matn: statusPraesensMatni(d) },
        { tur: 'matn', matn: uroStatus(d) },
        { tur: 'matn', matn: 'Текширувларда:' },
        ...tekshiruvlar(d),
        { tur: 'matn', matn: 'Юкоридаги текширувларга асосланиб куйидаги дастлабки ташхис куйилди:' },
        { tur: 'band', etiket: 'Ташхис', matn: tashxisMatni(d) },
        { tur: 'band', etiket: 'Даволаш режаси', matn: 'Тартиб умумий. Диета Стол №7. Оператив даво.' },
        ...imzolar(d, shifokorIsmi),
      ],
    },
    // 2. Operatsiya oldi epikrizi (klinik asoslash + pre-op)
    {
      id: 'oldi',
      nom: 'Operatsiya oldi epikrizi',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'sarlavha', matn: 'КЛИНИК ТАШХИСНИ АСОСЛАШ ВА ОПЕРАЦИЯ ОЛДИ ЭПИКРИЗИ' },
        { tur: 'matn', matn: 'Юкоридаги текширувларга асосланиб куйидаги клиник ташхис куйилди:' },
        { tur: 'band', etiket: 'Ташхис', matn: tashxisMatni(d) },
        { tur: 'band', etiket: 'Операцияга кўрсатма', matn: ro(d.korsatma) },
        { tur: 'band', etiket: 'Операцияга қарши кўрсатма', matn: 'Абсолют қарши кўрсатма йўқ.' },
        { tur: 'band', etiket: 'Режа', matn: ro(d.operatsiya_nomi) },
        { tur: 'band', etiket: 'Премедикация', matn: ro(d.premedikatsiya) },
        { tur: 'band', etiket: 'Оғриқсизлантириш', matn: ro(d.anesteziya) },
        { tur: 'bosh' },
        { tur: 'qator', chap: 'Бемор ФИШ', ong: ro(bemor?.fio) },
        { tur: 'qator', chap: 'Ёши', ong: `${ro(d.tugilgan_yil)}-й.т.` },
        { tur: 'qator', chap: 'Яшаш жойи', ong: ro(d.manzil) },
        { tur: 'qator', chap: 'Касаллик тарихи №', ong: ro(d.tarix_raqami) },
        { tur: 'qator', chap: 'Операция куни', ong: `${ro(d.operatsiya_sana, '—')}   ${ro(d.operatsiya_vaqt, '')}` },
        { tur: 'qator', chap: 'Давомийлиги', ong: `${ro(d.davomiyligi, '—')} минут` },
        { tur: 'qator', chap: 'Операциядан олдинги диагноз', ong: tashxisMatni(d) },
        { tur: 'qator', chap: 'Операциядан кейинги диагноз', ong: tashxisMatni(d) },
        { tur: 'qator', chap: 'Хирург', ong: ro(d.xirurg, shifokorIsmi) },
        { tur: 'qator', chap: 'Ассистент', ong: ro(d.assistent) },
        { tur: 'qator', chap: 'Операцион ҳамшира', ong: ro(d.hamshira) },
        ...imzolar(d, shifokorIsmi),
      ],
    },
    // 3. Operatsiya bayoni (protokol)
    {
      id: 'bayoni',
      nom: 'Operatsiya bayoni',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'sarlavha', matn: `ОПЕРАЦИЯ БАЁНИ № ${ro(d.bayon_raqami, '____')}` },
        { tur: 'sarlavha', matn: (ro(d.operatsiya_nomi, 'МАРМАР')).toUpperCase() },
        { tur: 'qator', chap: 'Оғриқсизлантириш', ong: ro(d.anesteziya) },
        { tur: 'qator', chap: 'Сана/вақт', ong: `${ro(d.operatsiya_sana, '—')}   ${ro(d.operatsiya_vaqt, '')}` },
        { tur: 'bosh' },
        { tur: 'matn', matn: ro(d.operatsiya_matni) },
        { tur: 'band', etiket: 'Тавсия', matn: 'Тартиб ётоқ №1. Оғриқда: Sol. Ketorolaci 2,0 ml в/м.' },
        { tur: 'bosh' },
        { tur: 'imzo', chap: 'Хирург', ong: ro(d.xirurg, shifokorIsmi) },
      ],
    },
    // 4. Kunlik yozuvlar (operatsiyadan keyin)
    {
      id: 'kunlik',
      nom: 'Kunlik yozuvlar',
      kunlik: true,
      render: (d, bemor, shifokorIsmi) => {
        const kunlar: any[] = Array.isArray(d.kunlar) && d.kunlar.length ? d.kunlar : [{}]
        const bloklar: HujjatBlok[] = []
        kunlar.forEach((k, idx) => {
          const shik = Array.isArray(k.shikoyatlar) && k.shikoyatlar.length ? k.shikoyatlar.join(', ').toLowerCase() + '.' : 'актив шикоятлар билдирмади.'
          if (idx > 0) bloklar.push({ tur: 'bosh' })
          bloklar.push({ tur: 'matn', matn: `${ro(k.sana, '__.__.____')}-й   Соат: ${ro(k.vaqt, '____')}        Даволовчи врач кўриги.` })
          bloklar.push({ tur: 'band', etiket: 'Бемор кўрикда', matn: shik })
          bloklar.push({ tur: 'matn', matn: `Умумий аҳволи нисбатан қониқарли. Тана харорати-${ro(k.harorat, '36,7')} С. Юрак қон томир уриши бир маромда, пульс ${ro(k.puls, '76')} та, АКБ ${ro(k.akb, '110/70')} мм.сим.уст. Тили тоза, қорин юмшоқ оғриқсиз. Сийдик ажралиши мустақил.` })
          bloklar.push({ tur: 'band', etiket: 'St. localis', matn: 'Боғлов материаллари тоза ва қуруқ.' })
          bloklar.push({ tur: 'band', etiket: 'Тавсия', matn: ro(k.tavsiya, 'Даво муолажаларини давом эттириш.') })
          bloklar.push({ tur: 'imzo', chap: 'Даволовчи врач', ong: ro(d.davolovchi, shifokorIsmi) })
        })
        return bloklar
      },
    },
    // 5. Chiqaruv epikrizi
    {
      id: 'epikriz',
      nom: 'Epikriz (chiqaruv)',
      render: (d, bemor, shifokorIsmi) => [
        { tur: 'sarlavha', matn: `${KLINIKA} — Касаллик тарихидан кўчирма №${ro(d.tarix_raqami, '____')}` },
        { tur: 'qator', chap: '1) Бемор', ong: ro(bemor?.fio) },
        { tur: 'qator', chap: '2) Туғилган йили', ong: ro(d.tugilgan_yil) },
        { tur: 'qator', chap: '3) Манзили', ong: ro(d.manzil) },
        { tur: 'qator', chap: '4) Иш жойи', ong: ro(d.ish_joyi, 'Ишламайди') },
        { tur: 'qator', chap: '5) Даволанган кунлари', ong: `${ro(d.kelgan_sana, '—')} — ${ro(d.chiqgan_sana, '—')}` },
        { tur: 'qator', chap: '6) Клиник диагноз', ong: tashxisMatni(d) },
        { tur: 'sarlavha', matn: '7) Қисқача маълумот' },
        { tur: 'band', etiket: 'Шикоятлар', matn: shikoyatMatni(d) },
        { tur: 'matn', matn: ro(d.anamnez_morbi) },
        { tur: 'matn', matn: 'Текширувларда:' },
        ...tekshiruvlar(d),
        { tur: 'matn', matn: `Бемор бўлимда ${ro(d.operatsiya_sana, '—')} куни маҳаллий анестезия остида ${ro(d.operatsiya_nomi, 'Мармар')} ташрихи ўтказилди ва оғриқ қолдирувчи инъекцияларни олди. Динамикада аҳволи қониқарли, жароҳати тоза, қуруқ, битиши бирламчи. Қониқарли ҳолатда яшаш жой урологи назоратига амбулатор давога чиқарилмоқда.` },
        { tur: 'band', etiket: 'Тавсия', matn: 'Яшаш жой урологи назорати. Оғир жисмоний меҳнатни чегаралаш (3 ойга). Бир ҳафтадан кейин қайта кўрик ва чокларни олиш.' },
        ...imzolar(d, shifokorIsmi),
        { tur: 'qator', chap: 'Бош врач', ong: ro(d.bosh_vrach, '—') },
      ],
    },
  ],
}
