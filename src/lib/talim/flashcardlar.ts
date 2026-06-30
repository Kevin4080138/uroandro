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
}

export function flashcardlarOl(darsSlug: string): Flashcard[] {
  return FLASHCARDLAR[darsSlug] ?? []
}
