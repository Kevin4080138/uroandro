<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Kontent qoidalari

## Daraja matritsasi — bo'limlar

| Bo'lim               | EASY       | O'RTA | QIYIN    |
|----------------------|------------|-------|----------|
| Nazariya             | ✅ sodda   | ✅    | ✅ chuqur |
| Flashcard            | ✅         | ✅    | ✅        |
| Amaliy test          | ✅         | ✅    | ✅        |
| Materiallar + Media  | ✅         | ✅    | ✅        |
| Nazorat              | ❌         | ✅    | ✅        |
| USMLE                | ❌         | ✅    | ✅        |
| Interaktiv case      | ❌         | ❌    | ✅        |
| Vaziyatli masala     | ❌         | ❌    | ✅        |
| Xatolar tahlili      | ❌         | ❌    | ✅        |
| Sertifikat           | ❌         | ✅    | ✅        |

Qoida: Normalogiya → klinik format yo'q (har darajada)

## Bosqichlar o'rtasidagi mavzu munosabati

### Umumiy tamoyil
Har bir klinik mavzu uchta bosqichda **ketma-ket chuqurlashib** boradi.
EASY → O'RTA → QIYIN bir-birini takrorlamaydi, balki bir-birini davom ettiradi.

### Mavzu tarqalishi

| Daraja | Maqsad | Misol |
|--------|--------|-------|
| EASY | Tushuncha, tasnif, asosiy belgilar | `prostata-adenomasi-asosiy-belgilar` |
| O'RTA | Diagnostika algoritmi, differensial tashxis, dori davolash | `prostata-adenomasi-diagnostika` |
| QIYIN | Jarrohlik, asoratlar, murakkab klinik holatlar, Campbell-Walsh darajasi | `bph-luts` |

### Slug qoidasi
- EASY: `[mavzu]-asoslari` yoki `[mavzu]-umumiy-[tushuncha]`
- O'RTA: `[mavzu]-klinik` yoki `[mavzu]-diagnostika` yoki `[mavzu]-davolash`
- QIYIN: `[mavzu]` (to'liq nom, suffix shart emas)

### Yangi mavzular
Ba'zi mavzular faqat O'RTA yoki QIYIN da boshlanishi mumkin (EASY da asosi yo'q):
- Erektil disfunksiya, Prostata saratoni — QIYIN da boshlanadi (EASY da namuna yo'q)
- Bunday holatlarda shu bosqichdan boshlanadi, quyi bosqichda bo'sh qoladi

### Takrorlash qoidasi
- Bir bosqich ichida bir xil mavzu ikki marta bo'lmasin
- O'RTA darsi EASY darsini qaytarmasin — yangi klinik qatlam qo'shsin
- QIYIN darsi O'RTA darsini qaytarmasin — murakkablik qo'shsin

## Sertifikat qoidasi

- Sertifikat **har bir dars uchun emas** — **bosqich** (O'RTA yoki QIYIN) uchun bitta
- Berilish sharti: o'sha bosqichdagi **barcha darslarning Nazorat testidan** muvaffaqiyatli o'tish
- Nazorat tab — har bir dars ichida (test o'tkazish uchun)
- Sertifikat — bosqich sahifasida yoki alohida sertifikat sahifasida ko'rsatiladi (dars ichida emas)
- EASY bosqichida Nazorat ham, Sertifikat ham yo'q

## Amaliy test savol banki

| Daraja | Bankdagi savol soni | Ko'rsatiladigan (shuffle) |
|--------|---------------------|---------------------------|
| EASY   | 40 ta               | 15 ta                     |
| O'RTA  | 45 ta               | 20 ta                     |
| QIYIN  | 50 ta               | 25 ta                     |

- `savollarBanki` — to'liq bank
- `amaliySavolSoni` — shuffle bo'lib chiqadigan son
- Savollar nazariya HTML mazmuniga asoslanib tuziladi

## Flashcard banki

| Daraja | Ko'rsatiladigan | Bankdagi (ikki barobar, shuffle) |
|--------|-----------------|----------------------------------|
| EASY   | 10 ta           | 20 ta                            |
| O'RTA  | 15 ta           | 30 ta                            |
| QIYIN  | 20 ta           | 40 ta                            |

## Test savollari tuzish qoidalari (sifat talablari)

1. **To'g'ri javob tarqalishi**: A, B, C, D variantlari orasida to'g'ri javoblar taxminan teng taqsimlangan bo'lsin — faqat B yoki faqat C to'g'ri bo'lib qolmasin
2. **Variant uzunligi**: Barcha variantlar taxminan bir xil uzunlikda bo'lsin — faqat to'g'ri javob uzun (yoki qisqa) bo'lmasin, chunki bu javobni ko'rsatib qo'yadi
3. **Chalg'ituvchi variantlar**: Har bir noto'g'ri variant mantiqli va o'xshash bo'lsin — "hech qaysi" yoki aniq bema'ni javoblar qo'yilmasin
4. **Bir mavzu, bir savol**: Bir xil faktni so'raydigan savollar takrorlanmasin
5. **Izoh majburiy**: Har bir savolda `izoh` bo'lishi shart — nima uchun to'g'ri javob to'g'ri ekanligini tushuntirsin
6. **Uzun javob tuzoq**: Ko'pincha uzun variant to'g'ri bo'lib qolmasin — bu talabani o'ylamasdan uzun javobni tanlashga o'rgatadi. To'g'ri javob ba'zan qisqa ham bo'lishi mumkin.
