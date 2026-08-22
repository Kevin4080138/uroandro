# Reja — Admin bo'limi (keyingi ishlar)

> Hozir qilinmaydigan, **keyin** bajariladigan tavsiyalar. CODIFY admin panelini
> tahlil qilib ajratilgan g'oyalar (2026-08-22).

## 📞 CRM / Qo'ng'iroqlar (YANGI — asosiy)

Admin talaba **va** bemor bilan aloqa tarixini yuritadigan jurnal.
**Ikkala rol uchun ham** (talaba = ta'lim sotuvi/retention, bemor = klinika follow-up).

- [ ] Yangi jadval: `aloqa_yozuvlari` (kim, kimga, rol, status, xulosa, sana, admin_id)
- [ ] Status: `qongiroq_qilindi` · `xabar_yuborildi` · `javob_bermadi` · `keyinroq` ...
- [ ] Yangi sahifa `/admin/crm` (yoki `/admin/qongiroqlar`):
      - Ustunlar: admin · foydalanuvchi · telefon · rol (talaba/bemor) · status · xulosa · vaqt · amallar
      - Filtrlar: rol (talaba/bemor), admin, potok/guruh, status
      - Telefon/ism bo'yicha qidiruv
      - "➕ Yangi aloqa" tugmasi
- [ ] Talaba/bemor profilidan **bir bosishda "aloqa qo'shish"**
- [ ] RLS: faqat admin ko'radi/yozadi

## 📊 Analitika (talabalar-nazorati) — kichik yaxshilanishlar

Asosiy narsalar allaqachon bor (progress, test %, faollik, telefon, filtr, Excel eksport, KPI).
CODIFY'dan olinadigan qo'shimchalar:

- [ ] **"Hozirgi dars"** ustuni — talaba ayni qaysi darsda ekani
- [ ] Har qatorda **tezkor qo'ng'iroq tugmasi** — telefonga bosib qo'ng'iroq / CRM'ga yozuv qo'shish
- [ ] Saralash: **test ball · ism · faollik** bo'yicha (hozir faqat faollik)
- [ ] **Faollik turi** belgisi (Kirish / Video)

---

*Yaratilgan: 2026-08-22. Bajarilgani sari `[ ]` → `[x]`.*
