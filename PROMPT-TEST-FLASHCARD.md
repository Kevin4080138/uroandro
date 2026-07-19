# Savol banki va flashcard yozdirish uchun promptlar

Nazariya tayyor bo'lgach shu promptlarni ishlating. Ikkalasi ham **nazariya
matniga tayanadi** — nazariyani ham promptga qo'shib bering, aks holda savollar
darsda yo'q narsani so'raydi.

Chiqish — JSON massiv. Uni admin panelda (`/admin/darslar`) tegishli maydonga
qo'yasiz, u yerda element soni va JSON to'g'riligi darhol ko'rinadi.

| Bosqich | Amaliy bank | Ko'rsatiladi | Flashcard bank | Ko'rsatiladi |
|---|---|---|---|---|
| EASY | 40 | 15 | 20 | 10 |
| O'RTA | 45 | 20 | 30 | 15 |
| QIYIN | 50 | 25 | 40 | 20 |

---

## 1. Amaliy test banki

```
Quyidagi nazariya matni asosida urologiya darsi uchun test savollari bankini yoz.

DARS:    {mavzu}
BOSQICH: O'RTA
SAVOL SONI: 45 ta

NAZARIYA:
{nazariya HTML yoki matnini shu yerga qo'ying}

QOIDALAR — sifat
1. Savollar FAQAT yuqoridagi nazariyada bor ma'lumotga tayansin. Nazariyada
   yo'q faktni so'rama.
2. To'g'ri javob A, B, C, D orasida taxminan teng tarqalsin — faqat B yoki
   faqat C to'g'ri bo'lib qolmasin.
3. Barcha variantlar taxminan bir xil uzunlikda bo'lsin. To'g'ri javob eng
   uzun (yoki eng qisqa) bo'lib ajralib turmasin — bu javobni ko'rsatib qo'yadi.
4. Har bir noto'g'ri variant mantiqli va ishonarli bo'lsin. "Hech qaysi",
   "Barchasi to'g'ri" yoki aniq bema'ni javoblar ishlatilmasin.
5. Bir xil faktni so'raydigan ikkita savol bo'lmasin.
6. Har savolda `izoh` majburiy — nima uchun to'g'ri javob to'g'riligini
   tushuntirsin, shunchaki javobni takrorlamasin.
7. Savollar butun nazariya bo'ylab tarqalsin, bitta bo'limga to'planmasin.

BOSQICH DARAJASI (O'RTA)
Savollar "qanday tashxis qo'yaman" darajasida bo'lsin: tekshiruv tanlash,
differensial tashxis, ball tizimlari, birinchi qator davolash.
Operatsiya texnikasi va intraoperatsion asoratlar bo'yicha savol bo'lmasin.

CHIQISH — faqat JSON massiv, boshqa matnsiz:
[
  {
    "savol": "Savol matni?",
    "variantlar": ["A varianti", "B varianti", "C varianti", "D varianti"],
    "togri": 0,
    "izoh": "Nima uchun bu javob to'g'ri — qisqa tushuntirish."
  }
]

`togri` — to'g'ri variantning indeksi (0 dan boshlanadi).
```

---

## 2. USMLE savollari

USMLE savoli oddiy testdan **klinik vinyetka** bilan farq qiladi: bemor
tavsifi beriladi, talaba undan xulosa chiqaradi.

```
Yuqoridagi nazariya asosida USMLE uslubidagi savollar yoz.

SAVOL SONI: 15 ta

FARQI: har savol klinik vinyetka bilan boshlanadi — bemor yoshi, shikoyati,
anamnezi, ko'rik va tekshiruv natijalari. Talaba shu ma'lumotdan tashxis yoki
keyingi qadamni aniqlashi kerak. Faktni to'g'ridan-to'g'ri so'ramaydi.

Yuqoridagi sifat qoidalari (1-7) shu yerda ham amal qiladi.

CHIQISH — JSON massiv:
[
  {
    "vinyetka": "45 yoshli erkak ... shikoyati bilan murojaat qildi. Ko'rikda ... UTT da ...",
    "savol": "Eng to'g'ri keyingi qadam qaysi?",
    "variantlar": ["...", "...", "...", "..."],
    "togri": 2,
    "izoh": "..."
  }
]
```

---

## 3. Nazorat savollari

⚠️ Bu bank **sertifikat uchun**. Bo'sh bo'lsa, o'sha bosqich sertifikati
umuman berilmaydi (`sertifikat.ts` shunday tekshiradi).

```
Yuqoridagi nazariya asosida nazorat (sertifikat) testini yoz.

SAVOL SONI: 25 ta

FARQI amaliy testdan: bular darsning ASOSIY, o'tkazib yuborib bo'lmaydigan
bilimini tekshiradi. Ikkinchi darajali tafsilot so'ralmaydi. Talaba shu
savollarga javob bera olsa — mavzuni bilgan hisoblanadi.

Yuqoridagi sifat qoidalari (1-7) shu yerda ham amal qiladi.

CHIQISH — amaliy test bilan bir xil JSON format.
```

---

## 4. Flashcardlar

```
Yuqoridagi nazariya asosida flashcardlar yoz.

KARTA SONI: 30 ta

QOIDALAR
1. Bir karta — bitta fakt. Ikkita savolni bitta kartaga tiqishtirma.
2. `old` — savol yoki atama. Qisqa bo'lsin.
3. `yangi` — javob. Ro'yxat kerak bo'lsa \n bilan yangi qatordan yoz.
   Sabab-natijani ko'rsatish uchun \n\n bilan ajratilgan izoh qo'shsa bo'ladi.
4. `kategoriya` — kartani guruhlaydi (masalan: Anatomiya, Diagnostika,
   Davolash, Asoratlar). Har kategoriyada bir nechta karta bo'lsin.
5. Kartalar yod olishga mo'ljallangan: raqam, tasnif, chegara qiymat,
   differensial belgi — shular yaxshi karta bo'ladi. Uzun mulohaza — yomon.
6. `id` — 1 dan boshlab ketma-ket.

CHIQISH — JSON massiv:
[
  {
    "id": 1,
    "kategoriya": "Diagnostika",
    "old": "Varikotsele UTT da qanday aniqlanadi?",
    "yangi": "Pampiniform pleksus vena diametri > 3 mm\n(dam olishda yoki Valsalva paytida)\n\nDoppler: Valsalva bilan reflux aniqlanadi"
  }
]
```

---

## Joylashtirish

1. `/admin/darslar` sahifasini oching
2. Darsni qidiruvdan toping va bosing
3. Tegishli maydonga JSON ni qo'ying — yonida element soni chiqadi
4. JSON buzuq bo'lsa maydon qizarib, xato yoziladi va saqlanmaydi
5. **Saqlash**

Deploy kerak emas — o'zgarish darhol kuchga kiradi.
