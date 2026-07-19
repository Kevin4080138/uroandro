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

## Nazariya yozish qoidalari

### Asosiy tamoyil: uzunlik emas, savol o'zgaradi

Darslik bobini qisqartirish boshlang'ich dars bermaydi — u shunchaki **siqilgan
darslik bobi** bo'lib qoladi. Uchala bosqich bir xil skeletdan
(ta'rif → patofiziologiya → klinika → diagnostika → davolash) foydalansa,
talaba bosqichlar orasidagi farqni his qilmaydi.

Shuning uchun har bir bosqich **boshqa savolga** javob beradi:

| Bosqich | Dars javob beradigan savol | Talaba nima qila oladi |
|---------|----------------------------|------------------------|
| EASY    | "Bu nima va nega muhim?"   | **Tanib oladi** va to'g'ri yo'naltiradi |
| O'RTA   | "Qanday tashxis qo'yaman?" | **Tekshiruv buyuradi**, boshlang'ich davolaydi |
| QIYIN   | "Murakkab holatda qanday qaror qilaman?" | **Operatsiya qiladi**, asoratni boshqaradi |

EASY — "kamroq ma'lumot" emas, **boshqa turdagi** ma'lumot: bemor kelganda
"bu nima bo'lishi mumkin, shoshilinchmi, kimga yuboraman" degan savolga javob.

### Hajm normasi

| O'lchov       | EASY    | O'RTA       | QIYIN       |
|---------------|---------|-------------|-------------|
| So'z soni     | 600–900 | 1 500–2 200 | 3 500–6 000 |
| Bo'lim (H2)   | 4–5     | 6–8         | 9–12        |
| Jadval        | 0–1     | 2–3         | 4–6         |
| Rasm/sxema    | 2–3     | 3–5         | 5–8         |
| O'qish vaqti  | 5–7 daq | 12–15 daq   | 25–35 daq   |

`daqiqa` maydoni haqiqiy o'qish vaqtiga mos bo'lsin — talabaga aytilgan
vaqt yolg'on bo'lmasin. Hisob **~130 so'z/daqiqa**: tibbiy matn oddiy
matndan sekin o'qiladi va sxema/jadvalni ko'zdan kechirish ham vaqt oladi.

### Taqiqlangan elementlar

So'z sanashdan ko'ra ishonchli nazorat — bosqichga tegishli bo'lmagan
element umuman kirmasin:

**EASY da bo'lmasin:** dori nomi va dozasi · algoritm sxemasi ·
ball tizimlari (IPSS, Gleason, TNM) · differensial tashxis jadvali ·
statistik foizlar · adabiyot iqtiboslari · operatsiya nomi

**O'RTA da bo'lmasin:** operatsiya texnikasi bosqichlari ·
intraoperatsion asoratlar · gaydlar o'rtasidagi qarama-qarshiliklar ·
nodir uchraydigan variantlar

**QIYIN da bo'lsin:** ayni shu narsalar + Campbell-Walsh darajasidagi nozikliklar

### Bo'lim sarlavhalari

EASY da sarlavhalar **savol shaklida** bo'lsin — bu boshlang'ich darsni
darslikdan darrov ajratib turadi:

> "Bu nima?" · "Kimda uchraydi?" · "Qanday bilinadi?" · "Qachon xavfli?" · "Nima qilish kerak?"

O'RTA va QIYIN da klassik ilmiy sarlavhalar ishlatiladi.

### Progressni ko'rinadigan qilish

Talaba bosqichlar orasida o'sishni **his qilishi** uchun har bir darsda
ikkita `callout` bo'ladi:

1. **Dars oxirida — "keyingi bosqich" va'dasi.** Quyi bosqichdan olib
   tashlangan mazmun yo'qolmaydi, unga ishora qilinadi:

   > **O'rta bosqichda bu mavzuda:** IPSS bali bilan simptomlarni o'lchash ·
   > alfa-blokator tanlash · operatsiyaga ko'rsatmalar → *[dars havolasi]*

2. **Dars boshida — "avvalgi bosqichda" eslatmasi.** Yuqori bosqich darsi
   quyi bosqichni uch punktda takrorlab, so'ng ustiga quradi.

Bu ikkisi o'chirilgan mazmunni **va'daga** aylantiradi va talabaga o'zining
qayerdan qayerga kelganini ko'rsatadi.

## Sertifikat qoidasi

- Sertifikat **har bir dars uchun emas** — **bosqich** (O'RTA yoki QIYIN) uchun bitta
- Berilish sharti: o'sha bosqichdagi **barcha darslarning Nazorat testidan** muvaffaqiyatli o'tish
- Nazorat tab — har bir dars ichida (test o'tkazish uchun)
- Sertifikat — bosqich sahifasida yoki alohida sertifikat sahifasida ko'rsatiladi (dars ichida emas)
- EASY bosqichida Nazorat ham, Sertifikat ham yo'q

⚠️ **Nazorat banki bo'lmagan dars sertifikatni arzonlashtiradi.**
Hozirgi hisob mantig'i (`sertifikat.ts`): `nazorat_savollar` bo'sh bo'lsa,
dars shunchaki **tugatilganda** "o'tilgan" hisoblanadi. Ya'ni bosqichdagi
darslarning nazorat banki bo'lmasa, talaba bitta ham test topshirmasdan
bosqich sertifikatini oladi.

Shuning uchun: bosqichga dars qo'shilganda **nazorat banki ham qo'shilsin**,
aks holda o'sha bosqich sertifikati e'lon qilinmasin.

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

## Rasm qoidalari

### Mualliflik huquqi — qat'iy chegara

**Campbell-Walsh (va boshqa darsliklar) rasmlarini platformaga ko'chirib
bo'lmaydi.** Kitob matnidagi faktlarni o'z so'zi bilan qayta yozish mumkin —
faktlar himoyalanmaydi. Lekin rasm, sxema va jadval tasvirlari nashriyotning
himoyalangan mulki. Urosfera pullik platforma bo'lgani uchun bu jiddiy
huquqiy xavf.

⚠️ **Radiopaedia** rasmlarining ko'pi CC BY-**NC** (nokommersiya) —
pullik platformada ishlatib bo'lmaydi.

### Asosiy yechim: o'z SVG sxemalari

Urologiyadagi nazariy rasmlarning aksariyati fotosurat emas, **sxema**:
prostata zonalari, gidronefroz darajalari, varikotsele gradlari,
torsiya va epididimit farqi, fimoz/parafimoz mexanizmi.

SVG afzalliklari:
- HTML ichiga to'g'ridan-to'g'ri yoziladi — fayl saqlash va bandwidth kerak emas
- telefonda cheksiz aniq (vektor), 300 KB rasm o'rniga ~8 KB
- **yozuvlari o'zbekcha** — kitob rasmlarida bunday imkoniyat yo'q
- keyinchalik interaktiv qilish mumkin (zonani bosganda izoh) — QIYIN
  bosqichdagi "interaktiv case" uchun tayyor poydevor

### Haqiqiy tasvirlar uchun ochiq manbalar

| Manba | Litsenziya | Nimaga yaxshi |
|-------|------------|---------------|
| SMART Servier Medical Art | CC BY 3.0 | Professional tibbiy illyustratsiya |
| Wikimedia Commons | CC / public domain | USG, rentgen, makropreparat |
| Gray's Anatomy plitalari | Public domain | Anatomiya |
| NIH / NCI Visuals Online | Public domain | Onkologiya sxemalari |

Eng kuchli uzoq muddatli manba — **o'z klinikasi**: USG, urografiya,
operatsiya suratlari. Litsenziya muammosi yo'q va raqobatchida yo'q.
Shart: DICOM'dagi bemor ismi/ID sini albatta o'chirish va rozilik olish.

### Rasm ham bosqichma-bosqich o'ssin

| Bosqich | Rasm turi |
|---------|-----------|
| EASY    | Sodda SVG sxema — "bu qayerda joylashgan, nima bo'lyapti" |
| O'RTA   | Diagnostik tasvirlar — USG, urografiya, analiz natijasi |
| QIYIN   | Operatsion suratlar, murakkab KT/MRT, gistologiya |

Rasm gradienti bilim gradientini takrorlaydi — talaba bir so'z o'qimasdan,
sahifani ochishi bilanoq boshqa darajaga kirganini ko'radi.

### Rasm saqlash

- **Sxemalar** → HTML ichida inline SVG (saqlash joyi egallamaydi)
- **Fotosurat/tasvirlar** → **Supabase Storage** ochiq bucket
  (loyihada allaqachon bor, CDN'i bilan keladi)
- Format: **WebP**, eni ≤1600px, ~150 KB dan oshmasin

❌ **Google Drive / Disk ishlatilmaydi** — hotlink rasmiy qo'llab-quvvatlanmaydi
va vaqti-vaqti bilan ishlamay qoladi, mashhur fayllarda kvota xatosi chiqadi,
rasm optimizatsiyasi yo'q, va har bir fayl uchun qo'lda "havolasi bor
hamma ko'radi" ruxsati kerak — bitta xato butun kursda rasmni o'chiradi.

❌ **base64 inline rasm ishlatilmaydi** — brauzer keshini buzadi va HTML
hajmini bir necha barobar oshiradi.

## Texnik qoidalar

### Slug — bu ID, sarlavha emas

Dars slug'i **hech qachon o'zgartirilmaydi**, garchi u bosqich nomiga mos
kelmay qolsa ham. Slug quyidagi joylarga bog'langan:
`talim_natijalari.dars_slug` (talaba progressi) · `dars_qadam_progress` ·
`dars_tarkibi.dars_slug` · flashcard kalitlari · sertifikat yozuvlari ·
ochiq dars sahifalarining SEO manzillari.

Slug qoidasi (yuqorida) faqat **yangi** darslar uchun. Boshqa bosqichga
ko'chirilgan eski darslar o'z slug'ini saqlaydi — masalan `-asoslari` bilan
tugagan dars O'RTA bosqichda ham shu nomda qoladi.

### Nazariya `dars_tarkibi` jadvalida saqlanadi

Yangi nazariya `public/nazariyalar/*.html` + `nazariyaIframe` shaklida
qo'shilmaydi. Iframe ichidagi mazmun qidiruvga tushmaydi, o'qish progressini
kuzatib bo'lmaydi va SEO'ga kirmaydi. Faqat `dars_tarkibi.nazariya_html`.

### Uslub takrorlanmaydi

Nazariya HTML'i o'z `<style>` blokini olib kelmasin — uslub
`globals.css` dagi `.maqola-html` da bir marta turadi.

1. **To'g'ri javob tarqalishi**: A, B, C, D variantlari orasida to'g'ri javoblar taxminan teng taqsimlangan bo'lsin — faqat B yoki faqat C to'g'ri bo'lib qolmasin
2. **Variant uzunligi**: Barcha variantlar taxminan bir xil uzunlikda bo'lsin — faqat to'g'ri javob uzun (yoki qisqa) bo'lmasin, chunki bu javobni ko'rsatib qo'yadi
3. **Chalg'ituvchi variantlar**: Har bir noto'g'ri variant mantiqli va o'xshash bo'lsin — "hech qaysi" yoki aniq bema'ni javoblar qo'yilmasin
4. **Bir mavzu, bir savol**: Bir xil faktni so'raydigan savollar takrorlanmasin
5. **Izoh majburiy**: Har bir savolda `izoh` bo'lishi shart — nima uchun to'g'ri javob to'g'ri ekanligini tushuntirsin
6. **Uzun javob tuzoq**: Ko'pincha uzun variant to'g'ri bo'lib qolmasin — bu talabani o'ylamasdan uzun javobni tanlashga o'rgatadi. To'g'ri javob ba'zan qisqa ham bo'lishi mumkin.
