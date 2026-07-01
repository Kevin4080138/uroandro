export type Flashcard = {
  id: number
  kategoriya: string
  old: string
  yangi: string
}

const FLASHCARDLAR: Record<string, Flashcard[]> = {
  'h-varikotsele-kasalligi': [
    { id: 1, kategoriya: 'Epidemiologiya', old: 'Varikotsele umumiy tarqalishi qancha?', yangi: '15% umumiy populyatsiyada\n35–40% birlamchi bepushtlikda\n80% ikkilamchi bepushtlikda' },
    { id: 2, kategoriya: 'Epidemiologiya', old: 'Varikotsele qaysi tomonda ko\'proq uchraydi va nima uchun?', yangi: '80–90% — chap tomon\n\nSabab: chap v. testicularis chap buyrak venasiga to\'g\'ri burchak ostida quyiladi → venoz bosim yuqori → qon oqimi sekinlashadi' },
    { id: 3, kategoriya: 'Epidemiologiya', old: 'O\'smirlarda varikotsele qachon ko\'proq ko\'rinadi?', yangi: 'Pubertat davrida (10–15 yosh)\n\nTestis tez o\'sishi natijasida qon aylanishi ko\'payadi, venalar kuchsizlashadi' },
    { id: 4, kategoriya: 'Anatomiya', old: 'Pampiniform pleksus nima?', yangi: 'Testis venalarining to\'ri — chov kanalida joylashgan\n\nFunksiyasi: arterial qonni sovutadi (issiqlik almashinuvi) → testis haroratini tanadan 2–4°C past ushlab turadi' },
    { id: 5, kategoriya: 'Anatomiya', old: 'Chap v. testicularis qayerga quyiladi?', yangi: 'Chap buyrak venasiga (v. renalis sinistra)\n\nO\'ng tomon: bevosita pastki kovak venaga (v. cava inferior) — shuning uchun o\'ng tomonda bosim kamroq' },
    { id: 6, kategoriya: 'Anatomiya', old: 'Gemodinamik nazariya nima deydi?', yangi: 'Venoz bosim oshadi → qonning testisga qayta oqishi (reflux)\n\nBu testis haroratini ko\'taradi → sperm ishlab chiqarish buziladi' },
    { id: 7, kategoriya: 'Diagnostika', old: 'Varikotsele USI da qanday aniqlanadi?', yangi: 'Pampiniform pleksus vena diametri > 3 mm\n(dam olish yoki Valsalva paytida)\n\nDoppler: Valsalva bilan reflux aniqlanadi' },
    { id: 8, kategoriya: 'Diagnostika', old: 'Valsalva sinamasi nima va nima uchun ishlatiladi?', yangi: 'Og\'iz yopiq holda kuchli nafas chiqarish (bosimni oshirish)\n\nVarikotsele tekshiruvida: venalar kengayishini kuchaytiradi — aniqroq palpatsiya va USI imkonini beradi' },
    { id: 9, kategoriya: 'Diagnostika', old: 'Varikotsele darajalariga ko\'ra tasniflanadi (WHO/Dubin-Amelar)', yangi: 'I daraja: faqat Valsalva paytida palpatsiyada seziladi\nII daraja: dam olishda ham palpatsiyada aniqlanadi\nIII daraja: ko\'z bilan ko\'rinadi ("qurt to\'pi")' },
    { id: 10, kategoriya: 'Diagnostika', old: 'Subklinik varikotsele nima?', yangi: 'Ko\'rish va qo\'l bilan sezib bo\'lmaydi, faqat USI/doppler bilan aniqlanadi\n\nDavolash bo\'yicha tortishuv bor — ko\'pchilik mutaxassislar davolashni tavsiya etmaydi' },
    { id: 11, kategoriya: 'Jarrohlik', old: 'Marmar usuli (mikrojarrohlik) — asosiy afzalliklari', yangi: 'Retsidiv: < 1%\nGidrotsele: < 1%\nArteriya va limfa saqlangan\n\nSubingvinal yo\'l + mikroskop\nZamonaviy oltin standart' },
    { id: 12, kategoriya: 'Jarrohlik', old: 'Palomo operatsiyasi — nimaga e\'tibor berish kerak?', yangi: 'Retroperitoneal yo\'l\nYuqori (retroperitoneal) ligatura\n\nKamchiligi: limfa tomirlari ko\'pincha bog\'lanadi → gidrotsele 7–30%\nRetsidiv: kolateral venalar orqali 5–15%' },
    { id: 13, kategoriya: 'Jarrohlik', old: 'Laparoskopik varikotselectomiya — qachon tanlash kerak?', yangi: 'Ikki tomonlama varikotsele\nOldingi chov operatsiyasi (spayklar)\n\nAfzalligi: bir marta ikki tomoni ham\nKamchiligi: umumiy narkoz, qorin ichiga kirish' },
    { id: 14, kategoriya: 'Jarrohlik', old: 'Skleroterapiya (perkutan embolizatsiya) — mohiyati', yangi: 'Pах venasiga kateter — kontrast bilan vena aniqlanadi — sklerozant yuboriladi\n\nAfzalligi: kesish yo\'q\nKamchiligi: texnik jihatdan murakkab, radiatsiya, retsidiv 10–15%' },
    { id: 15, kategoriya: 'Jarrohlik', old: 'Ivanissevich operatsiyasi qanday farq qiladi?', yangi: 'Ingvinal (chov) yo\'l bilan yuqori ligatura\n\nPalomoga o\'xshash, lekin chov kanalidan\nGidrotsele kamroq Palomoga nisbatan, ammo mikrojarrohlikdan ko\'p' },
    { id: 16, kategoriya: 'Spermogramma', old: 'WHO 2021 bo\'yicha normal sperm konsentratsiyasi', yangi: '≥ 16 million/ml\n(yoki jami ≥ 39 million bir ejakulyatda)' },
    { id: 17, kategoriya: 'Spermogramma', old: 'WHO 2021 bo\'yicha normal sperm harakatchanligi', yangi: 'Progressiv harakat (PR): ≥ 30%\nJami harakat (PR+NP): ≥ 42%' },
    { id: 18, kategoriya: 'Spermogramma', old: 'Oligoastenoteratozoospermiya (OAT) nima?', yangi: 'Uchta ko\'rsatkich birga buzilgan:\n- Oligo: konsentratsiya past\n- Asteno: harakatchanlik past\n- Terato: morfologiya buzilgan\n\nVarikotsele da tez-tez uchraydi' },
    { id: 19, kategoriya: 'Spermogramma', old: 'Varikotsele operatsiyasidan keyin sperm qachon yaxshilanadi?', yangi: '3–6 oy\n(chunki spermatogenez sikli ~74 kun)\n\nNatijalarni 6 oydan oldin baholash noto\'g\'ri' },
    { id: 20, kategoriya: 'Ko\'rsatmalar', old: 'Varikotsele uchun jarrohlik ko\'rsatmalari (EAU)', yangi: '1. Klinik varikotsele + bepushtlik + normal spermogramma yo\'q\n2. O\'smirlarda testikular atrofiya (> 20% hajm farqi)\n3. Og\'riq (boshqa sabablar chiqarib tashlangandan keyin)\n4. Kattalar — ikkitasi ham: klinik belgi + sperm patologiyasi' },
    { id: 21, kategoriya: 'Ko\'rsatmalar', old: 'Subklinik varikotsele (faqat USI) uchun operatsiya qilinishi kerakmi?', yangi: 'Odatda YO\'Q\n\nEAU va AUA: subklinik varikotsele uchun davolash tavsiya etilmaydi, chunki klinik foyda isbotlanmagan' },
    { id: 22, kategoriya: 'Ko\'rsatmalar', old: 'Varikotsele operatsiyasidan keyin homiladorlik ehtimoli?', yangi: '30–50% (tabiiy yo\'l bilan)\nOperatsiyasiz: 16–20%\n\nSperm yaxshilanishi bilan birga ART (IVF/ICSI) natijasi ham yaxshilanadi' },
    { id: 23, kategoriya: 'Differensial', old: 'O\'ng tomonda varikotsele bo\'lsa nima o\'ylash kerak?', yangi: 'Retroperitoneal ommaviy o\'sma (buyrak, qorin pardasi)\n\nO\'ng v. testicularis pastki kovak venaga quyiladi — reflux kamroq\nO\'ng tomon varikotsele — boshqa sababni istisno qilish kerak!' },
    { id: 24, kategoriya: 'Differensial', old: 'Gidrotsele va varikotsele farqi', yangi: 'Gidrotsele:\n- Skrotumda suyuqlik\n- Diafanoskopiya — yorug\'lik o\'tadi\n- Yumshoq, og\'riqsiz\n\nVarikotsele:\n- Venalar kengayishi\n- Diafanoskopiya o\'tmaydi\n- "Qurt to\'pi" hissi' },
  ],

  'urologiya-predmeti': [
    { id: 1, kategoriya: 'Umumiy tushuncha', old: 'Urologiya nima?', yangi: "Buyrak, siydik yo'llari (ureter, qovuq, uretra) kasalliklarini,\nerkaklarda qo'shimcha jinsiy-tanosil a'zolari (prostata, moyak, urug' yo'llari) kasalliklarini\no'rganadigan va davolaydigan tibbiyot sohasi" },
    { id: 2, kategoriya: 'Umumiy tushuncha', old: "Ayollarda urolog nima bilan shug'ullanadi?", yangi: "Faqat siydik chiqarish tizimi bilan:\nbuyrak, siydik naychalari, siydik pufagi, uretra\n\nJinsiy-tanosil a'zolari — ginekolog vakolatida" },
    { id: 3, kategoriya: 'Umumiy tushuncha', old: "Erkaklarda urologiya vakolat doirasi ayollardagidan nimasi bilan keng?", yangi: "Siydik tizimidan tashqari jinsiy-tanosil a'zolari ham kiradi:\n• Prostata\n• Moyak (testis)\n• Urug' pufakchasi\n• Urug' yo'llari (vas deferens)" },
    { id: 4, kategoriya: 'Umumiy tushuncha', old: "Siydik yo'llari tarkibiga nimalar kiradi?", yangi: "• Siydik naychalari (ureterlar)\n• Siydik pufagi (qovuq)\n• Uretra (siydik chiqarish kanali)\n\nBuyrak — siydik hosil qiluvchi a'zo (alohida kategoriya)" },
    { id: 5, kategoriya: "Tor yo'nalishlar", old: 'Andrologiya nima?', yangi: "Erkak reproduktiv va jinsiy salomatligini o'rganadigan urologiya yo'nalishi\n\nAsosiy mavzulari:\n• Erkak bepushtligi\n• Jinsiy funksiya buzilishi (erektil disfunksiya)\n• Gormonal buzilishlar" },
    { id: 6, kategoriya: "Tor yo'nalishlar", old: 'Onkourologiya nima?', yangi: "Siydik-tanosil a'zolari saratoni bilan shug'ullanadigan yo'nalish\n\nBuyrak, qovuq, prostata, moyak saratoni" },
    { id: 7, kategoriya: "Tor yo'nalishlar", old: 'Pediatrik urologiya nima?', yangi: "Bolalardagi urologik kasalliklar:\n• Tug'ma anomaliyalar (gipospadiya, kriptorxizm)\n• Vesikoureteral reflyuks\n• Bolalar siydik yo'li infeksiyalari" },
    { id: 8, kategoriya: "Tor yo'nalishlar", old: 'Funksional urologiya nima bilan shug\'ullanadi?', yangi: "Siydik tutolmaslik va qovuq faoliyati buzilishi:\n• Neyrogen qovuq\n• Stress inkontinensiya\n• Urgentlik (tezkorlik) inkontinensiyasi\n• Tos tubi mushaklari disfunksiyasi" },
    { id: 9, kategoriya: "Tor yo'nalishlar", old: 'Endourologiya nima?', yangi: "Kam invaziv, endoskopik usullarga asoslangan yo'nalish\n\nMisol:\n• Sistoskopiya\n• Ureteroskopiya\n• Perkutan nefrolitotomiya (PCNL)\n\nAfzalligi: kichik kesim, tez tiklanish" },
    { id: 10, kategoriya: "Tor yo'nalishlar", old: "Urologiyaning 5 ta tor yo'nalishini sanab bering", yangi: "1. Andrologiya — erkak reproduktiv salomatligi\n2. Onkourologiya — saraton kasalliklari\n3. Pediatrik urologiya — bolalar\n4. Funksional urologiya — siydik tutolmaslik\n5. Endourologiya — kam invaziv usullar" },
    { id: 11, kategoriya: "A'zolar", old: 'Prostata bezi qaysi tizimga tegishli?', yangi: "Erkak jinsiy-tanosil a'zolariga tegishli\n\nJoylashuvi: qovuq ostida, uretra atrofida\nFunksiyasi: urug' suyuqligining bir qismini ishlab chiqaradi" },
    { id: 12, kategoriya: "A'zolar", old: 'Moyak (testis) vazifalari nimalardan iborat?', yangi: "Ikkita asosiy funksiya:\n1. Spermatozoidlar ishlab chiqarish (spermatogenez)\n2. Testosteron gormoni ishlab chiqarish (Leydig hujayralari)\n\nUrologiya + endokrinologiya chegarasidagi a'zo" },
  ],

  'urologik-simptomlar': [
    { id: 1, kategoriya: 'Dizuriya', old: 'Dizuriya nima?', yangi: "Siydik chiqarish vaqtida og'riq yoki achishish hissi\n\nKo'pincha qovuq yoki uretra shilliq qavatining yallig'lanishi natijasida paydo bo'ladi" },
    { id: 2, kategoriya: 'Dizuriya', old: 'Dizuriyaning eng ko\'p uchraydigan sabablari', yangi: "• Sistit (qovuq yallig'lanishi) — ayollarda ko'proq\n• Uretrit (JYI: gonoreya, xlamidiya)\n• Vaginit — ayollarda siydik yo'li emas, qin sohasidan og'riq\n• Kimyoviy/mexanik jarohat\n• Yashirin qovuq saratoni (CIS) — katta yoshlilarda" },
    { id: 3, kategoriya: 'Dizuriya', old: 'Dizuriya + uretral ajralma = ?', yangi: "Eng ehtimoliy tashxis: Uretrit (JYI tufayli)\n\nGonokokkli: yiringsimon ajralma, o'tkir\nNogonokokkli (xlamidiya): kamroq ajralma, subakut" },
    { id: 4, kategoriya: 'Dizuriya', old: 'Katta yoshdagi chekuvchi bemorda surunkali dizuriya — nima o\'ylash kerak?', yangi: "Yashirin qovuq saratoni (carcinoma in situ, CIS)\n\n50 yoshdan katta + chekish tarixi + davom etuvchi irritativ simptomlar\n→ sistoskopiya bilan istisno qilish kerak" },
    { id: 5, kategoriya: 'Gematuriya', old: 'Gematuriya nima va qanday turlarga bo\'linadi?', yangi: "Siydikda eritrotsitlar (qon) borligi\n\n• Makrogematuriya — ko'z bilan ko'rinadi (qizil/choy rangi)\n• Mikrogematuriya — faqat mikroskopda (HPF da ≥3 eritrotsit)" },
    { id: 6, kategoriya: 'Gematuriya', old: 'Gematuriyani oqim bo\'yicha tasniflash', yangi: "Boshlang'ich (initial) → uretra/prostata manbasi\nOxirgi (terminal) → qovuq bo'yni manbasi\nTotal (butun oqim) → yuqori siydik yo'llari yoki qovuq" },
    { id: 7, kategoriya: 'Gematuriya', old: 'Og\'riqsiz makrogematuriyada birinchi nima o\'ylash kerak?', yangi: "UROLOGIK SARATON!\n\nAyniqsa qovuq saratoni — og'riqsiz makrogematuriya birinchi va ba'zan yagona belgi\n→ to'liq urologik tekshiruv (sistoskopiya + tasvirlash) shart" },
    { id: 8, kategoriya: 'Gematuriya', old: 'AUA bo\'yicha mikroskopik gematuriya xavf guruhlari', yangi: "Past xavf: yosh <40–50, chekmaydigan, 3–10 erit/HPF\n→ qayta tahlil yoki sistoskopiya + UTT\n\nO'rta xavf: 40–59 yosh, 10–30 paket-yil\n→ sistoskopiya + UTT\n\nYuqori xavf: ≥60, >30 paket-yil, >25 erit/HPF\n→ sistoskopiya + CTU" },
    { id: 9, kategoriya: "Og'riq", old: 'Urologik og\'riqning ikki asosiy mexanizmi', yangi: "1. To'siqli (obstruktiv) — bo'shliqli a'zo cho'zilishi\n   Kolikasimon, bemor tinch turolmaydi\n\n2. Parenximatoz — to'qima yallig'lanishi/infeksiyasi\n   Doimiy, bemor harakatsiz yotadi" },
    { id: 10, kategoriya: "Og'riq", old: 'Buyrak og\'rig\'i — joylashuvi va xarakteri', yangi: "Joylashuvi: bel-qovurg'a burchagi (kostovertebral burchak)\n\nTo'siqda: kolikasimon\nYallig'lanishda (pielonefrit): doimiy + CVAT" },
    { id: 11, kategoriya: "Og'riq", old: 'Siydik yo\'li og\'rig\'i nima uchun moyak/labiyaga aks etadi?', yangi: "Umumiy nerv ta'minoti tufayli (T11–L1)\n\nSiydik yo'li va moyak/labiya bir xil segmentar innervatsiyaga ega\n→ boshqa a'zoda patologiya bo'lmasa ham og'riq seziladi (aks etgan og'riq)" },
    { id: 12, kategoriya: "Og'riq", old: 'Stranguriya nima?', yangi: "Siydik chiqarish oxirida kuchli, achishtiruvchi og'riq\n\nKo'pincha qovuq yallig'lanishi yoki qovuq toshi belgisi" },
    { id: 13, kategoriya: "Og'riq", old: 'CVAT nima va qaysi kasallikda tekshiriladi?', yangi: "Costovertebral Angle Tenderness\nBel-qovurg'a burchagida palpatsiyada og'riqlilik\n\nPielonefrit belgisi: isitma + CVAT + dizuriya = klassik uchlik" },
    { id: 14, kategoriya: 'Siydik ushlanishi', old: 'O\'tkir va surunkali siydik ushlanishi farqi', yangi: "O'tkir (AUR):\n• To'satdan, og'riqli\n• Shoshilinch — darhol kateterizatsiya kerak\n\nSurunkali:\n• Asta-sekin, ko'pincha og'riqsiz\n• Qovuqda doimiy qoldiq siydik (yuqori PVR)" },
    { id: 15, kategoriya: 'Siydik ushlanishi', old: 'Siydik ushlanishining asosiy sabablari (5 guruh)', yangi: "1. Mexanik to'siq: BPH, uretra stricture, fimoz\n2. Infeksiya: o'tkir prostatit, og'ir sistit\n3. Nevrologik: orqa miya jarohati, MS, diabetik neyropatiya\n4. Dori-darmon: antikolinergiklar, opioidlar\n5. Postoperatsion: anesteziyadan keyingi vaqtinchalik holat" },
    { id: 16, kategoriya: 'Siydik ushlanishi', old: 'O\'tkir siydik ushlanishida birinchi qadam nima?', yangi: "Kechiktirmasdan qovuqni bo'shatish!\n\n1-usul: uretral kateterizatsiya\n2-usul (uretra jarohati shubhasida): suprapubik kateter\n\nSo'ng sababni aniqlash va davolash" },
    { id: 17, kategoriya: 'Siydik ushlanishi', old: 'PVR (postvoid residual) nima va qanday o\'lchanadi?', yangi: "Siydik chiqargandan keyin qovuqda qolgan siydik hajmi\n\nO'lchash usullari:\n• Ultratovush (noinvaziv)\n• Kateterizatsiya (aniq, lekin invaziv)\n\nAniq bir \"normal\" qiymat yo'q — tendensiya va klinik belgilar bilan baholanadi" },
    { id: 18, kategoriya: 'Diagnostika', old: 'Siydik tahlili dipstick natijasiga ishonish mumkinmi?', yangi: "Faqat dipstick yetarli emas!\n\nKlinik belgilarga mos kelmasa:\n• Siydik mikroskopiyasi\n• Siydik ekinmasi (culture)\nbilan tasdiqlash kerak" },
  ],
}

export function flashcardlarOl(darsSlug: string): Flashcard[] {
  return FLASHCARDLAR[darsSlug] ?? []
}
