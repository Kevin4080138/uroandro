-- ============================================================
-- UROLOGIYA 3-LEVEL — MODUL SKELETLARI (Bosqich C)
-- 34 modul + darslar. nazariya_html BO'SH — mazmun admin paneldan
-- (yoki keyingi seed'lardan) to'ldiriladi.
--
-- ON CONFLICT (slug) DO NOTHING — qayta Run xavfsiz: allaqachon
-- kiritilgan (va admin to'ldirgan) darslar ustiga yozilmaydi.
--
-- Modul raqamlari GLOBAL (1–34), Dr. Arabboyev rejasidagidek:
--   Level 1 (oson)  → modul 1–7
--   Level 2 (orta)  → modul 8–19
--   Level 3 (qiyin) → modul 20–34
--
-- Matn maydonlari $$...$$ (dollar-quote) — o' va g' apostroflari uchun.
-- Oldin 20260916000000_kurs_darslar_3level.sql Run qilingan bo'lsin.
-- ============================================================

INSERT INTO public.kurs_darslar
  (yonalish, bosqich, modul_no, modul_nom, slug, sarlavha, kategoriya, daqiqa, sort_order)
VALUES
-- ══════════ LEVEL 1 — FOUNDATION (oson) ══════════
-- 1-modul: Urologiyaga kirish
('urologiya','oson',1,$$Urologiyaga kirish$$,$$urologiya-nima$$,$$Urologiya nima?$$,$$Kirish$$,7,0),
('urologiya','oson',1,$$Urologiyaga kirish$$,$$urologiya-yonalishlari$$,$$Urologiyaning asosiy yo'nalishlari$$,$$Kirish$$,7,1),
('urologiya','oson',1,$$Urologiyaga kirish$$,$$urolog-nefrolog-farqi$$,$$Urolog va nefrolog farqi$$,$$Kirish$$,6,2),
('urologiya','oson',1,$$Urologiyaga kirish$$,$$urologik-davolash-turlari$$,$$Konservativ, intervension va jarrohlik davolash$$,$$Kirish$$,7,3),
('urologiya','oson',1,$$Urologiyaga kirish$$,$$urologik-anatomiya-ahamiyat$$,$$Urologik anatomiyaning klinik ahamiyati$$,$$Kirish$$,7,4),

-- 2-modul: Buyrak anatomiyasi va gistologiyasi
('urologiya','oson',2,$$Buyrak anatomiyasi va gistologiyasi$$,$$buyrak-anatomiyasi$$,$$Buyrak anatomiyasi: joylashuvi va tuzilishi$$,$$Anatomiya$$,7,0),
('urologiya','oson',2,$$Buyrak anatomiyasi va gistologiyasi$$,$$buyrak-qon-taminoti$$,$$Buyrak qon ta'minoti$$,$$Anatomiya$$,7,1),
('urologiya','oson',2,$$Buyrak anatomiyasi va gistologiyasi$$,$$buyrak-topografiyasi$$,$$Buyrak topografiyasi va qo'shni a'zolar$$,$$Anatomiya$$,7,2),
('urologiya','oson',2,$$Buyrak anatomiyasi va gistologiyasi$$,$$buyrak-gistologiyasi$$,$$Nefron va buyrak gistologiyasi$$,$$Gistologiya$$,8,3),
('urologiya','oson',2,$$Buyrak anatomiyasi va gistologiyasi$$,$$juxtaglomerular-apparat$$,$$Yukstaglomerular apparat$$,$$Gistologiya$$,6,4),

-- 3-modul: Siydik yo'llari anatomiyasi va fiziologiyasi
('urologiya','oson',3,$$Siydik yo'llari anatomiyasi va fiziologiyasi$$,$$ureter-anatomiyasi$$,$$Ureter: anatomiya va peristaltika$$,$$Anatomiya$$,7,0),
('urologiya','oson',3,$$Siydik yo'llari anatomiyasi va fiziologiyasi$$,$$siydik-pufagi-anatomiyasi$$,$$Siydik pufagi tuzilishi$$,$$Anatomiya$$,7,1),
('urologiya','oson',3,$$Siydik yo'llari anatomiyasi va fiziologiyasi$$,$$uretra-anatomiyasi$$,$$Uretra: erkak va ayolda farqi$$,$$Anatomiya$$,7,2),
('urologiya','oson',3,$$Siydik yo'llari anatomiyasi va fiziologiyasi$$,$$siydik-hosil-bolishi$$,$$Siydik qanday hosil bo'ladi?$$,$$Fiziologiya$$,7,3),

-- 4-modul: Siydik chiqarish fiziologiyasi
('urologiya','oson',4,$$Siydik chiqarish fiziologiyasi$$,$$mikturitsiya-nima$$,$$Siyish (micturition) nima?$$,$$Fiziologiya$$,6,0),
('urologiya','oson',4,$$Siydik chiqarish fiziologiyasi$$,$$pufak-tolishi$$,$$Siydik pufagining to'lishi$$,$$Fiziologiya$$,7,1),
('urologiya','oson',4,$$Siydik chiqarish fiziologiyasi$$,$$siyish-refleksi$$,$$Siyish refleksi$$,$$Fiziologiya$$,7,2),
('urologiya','oson',4,$$Siydik chiqarish fiziologiyasi$$,$$siyish-nerv-boshqaruvi$$,$$Siyishning nerv boshqaruvi$$,$$Fiziologiya$$,7,3),
('urologiya','oson',4,$$Siydik chiqarish fiziologiyasi$$,$$soglom-siyish$$,$$Sog'lom siyish qanday bo'ladi?$$,$$Fiziologiya$$,6,4),

-- 5-modul: Erkak reproduktiv tizimi
('urologiya','oson',5,$$Erkak reproduktiv tizimi$$,$$moyak-anatomiyasi$$,$$Moyak: anatomiya va gistologiya$$,$$Anatomiya$$,7,0),
('urologiya','oson',5,$$Erkak reproduktiv tizimi$$,$$epididimis-vas-deferens$$,$$Epididimis va urug' yo'llari$$,$$Anatomiya$$,6,1),
('urologiya','oson',5,$$Erkak reproduktiv tizimi$$,$$urug-pufakchalari$$,$$Urug' pufakchalari$$,$$Anatomiya$$,6,2),
('urologiya','oson',5,$$Erkak reproduktiv tizimi$$,$$prostata-asoslari$$,$$Prostata: joylashuvi va vazifasi$$,$$Anatomiya$$,7,3),
('urologiya','oson',5,$$Erkak reproduktiv tizimi$$,$$jinsiy-olat-anatomiyasi$$,$$Jinsiy olat anatomiyasi$$,$$Anatomiya$$,7,4),
('urologiya','oson',5,$$Erkak reproduktiv tizimi$$,$$spermatogenez$$,$$Spermatogenez$$,$$Fiziologiya$$,7,5),
('urologiya','oson',5,$$Erkak reproduktiv tizimi$$,$$testosteron-fiziologiyasi$$,$$Testosteron va gormonal boshqaruv$$,$$Fiziologiya$$,7,6),

-- 6-modul: Urologik bemorni tekshirish
('urologiya','oson',6,$$Urologik bemorni tekshirish$$,$$urologik-anamnez$$,$$Urologik anamnez qanday yig'iladi?$$,$$Klinik ko'nikma$$,7,0),
('urologiya','oson',6,$$Urologik bemorni tekshirish$$,$$urologik-fizik-korik$$,$$Fizik ko'rik$$,$$Klinik ko'nikma$$,7,1),
('urologiya','oson',6,$$Urologik bemorni tekshirish$$,$$dre-asoslari$$,$$Rektal barmoq tekshiruvi (DRE)$$,$$Klinik ko'nikma$$,6,2),
('urologiya','oson',6,$$Urologik bemorni tekshirish$$,$$urologik-laborator-tekshiruvlar$$,$$Asosiy laborator tekshiruvlar$$,$$Diagnostika$$,7,3),
('urologiya','oson',6,$$Urologik bemorni tekshirish$$,$$urologik-tasvirlash-kirish$$,$$Urologiyada tasvirlash usullari$$,$$Diagnostika$$,7,4),

-- 7-modul: Urologik simptomlar va sindromlar
('urologiya','oson',7,$$Urologik simptomlar va sindromlar$$,$$siydik-simptomlari$$,$$Siyish bilan bog'liq simptomlar$$,$$Simptomlar$$,7,0),
('urologiya','oson',7,$$Urologik simptomlar va sindromlar$$,$$siydik-patologik-ozgarishlari$$,$$Siydikning patologik o'zgarishlari$$,$$Simptomlar$$,7,1),
('urologiya','oson',7,$$Urologik simptomlar va sindromlar$$,$$urologik-ogriq$$,$$Urologik og'riq turlari$$,$$Simptomlar$$,7,2),
('urologiya','oson',7,$$Urologik simptomlar va sindromlar$$,$$erkak-jinsiy-simptomlar$$,$$Erkak jinsiy simptomlari$$,$$Simptomlar$$,6,3),

-- ══════════ LEVEL 2 — CLINICAL (orta) ══════════
-- 8-modul: Siydik yo'llari infeksiyalari
('urologiya','orta',8,$$Siydik yo'llari infeksiyalari$$,$$uti-asoslari$$,$$Siydik yo'llari infeksiyasi (UTI): asoslar$$,$$Infeksiya$$,14,0),
('urologiya','orta',8,$$Siydik yo'llari infeksiyalari$$,$$sistit$$,$$Sistit$$,$$Infeksiya$$,14,1),
('urologiya','orta',8,$$Siydik yo'llari infeksiyalari$$,$$uretrit$$,$$Uretrit$$,$$Infeksiya$$,13,2),
('urologiya','orta',8,$$Siydik yo'llari infeksiyalari$$,$$pielonefrit$$,$$Pielonefrit$$,$$Infeksiya$$,15,3),
('urologiya','orta',8,$$Siydik yo'llari infeksiyalari$$,$$uti-diagnostika-davolash$$,$$UTI diagnostikasi va davolash$$,$$Infeksiya$$,15,4),

-- 9-modul: Urolitiaz
('urologiya','orta',9,$$Urolitiaz$$,$$siydik-toshi-turlari$$,$$Buyrak toshlari turlari$$,$$Urolitiaz$$,14,0),
('urologiya','orta',9,$$Urolitiaz$$,$$tosh-hosil-mexanizmi$$,$$Tosh hosil bo'lish mexanizmi$$,$$Urolitiaz$$,13,1),
('urologiya','orta',9,$$Urolitiaz$$,$$renal-kolika$$,$$Renal kolika va klinika$$,$$Urolitiaz$$,14,2),
('urologiya','orta',9,$$Urolitiaz$$,$$tosh-diagnostika$$,$$Tosh diagnostikasi$$,$$Urolitiaz$$,14,3),
('urologiya','orta',9,$$Urolitiaz$$,$$tosh-davolash-asoslari$$,$$Tosh davolash asoslari$$,$$Urolitiaz$$,15,4),
('urologiya','orta',9,$$Urolitiaz$$,$$tosh-profilaktika$$,$$Tosh profilaktikasi$$,$$Urolitiaz$$,13,5),

-- 10-modul: BPH
('urologiya','orta',10,$$Prostata bezi adenomasi (BPH)$$,$$bph-etiologiya$$,$$BPH: etiologiya va patofiziologiya$$,$$BPH$$,14,0),
('urologiya','orta',10,$$Prostata bezi adenomasi (BPH)$$,$$bph-luts$$,$$BPH va LUTS klinikasi$$,$$BPH$$,15,1),
('urologiya','orta',10,$$Prostata bezi adenomasi (BPH)$$,$$bph-diagnostika$$,$$BPH diagnostikasi (IPSS, PSA, uroflow, PVR)$$,$$BPH$$,15,2),
('urologiya','orta',10,$$Prostata bezi adenomasi (BPH)$$,$$bph-davolash$$,$$BPH davolash prinsiplari$$,$$BPH$$,15,3),

-- 11-modul: Prostatit
('urologiya','orta',11,$$Prostatit$$,$$otkir-bakterial-prostatit$$,$$O'tkir bakterial prostatit$$,$$Prostatit$$,14,0),
('urologiya','orta',11,$$Prostatit$$,$$surunkali-prostatit$$,$$Surunkali prostatit va CPPS$$,$$Prostatit$$,14,1),
('urologiya','orta',11,$$Prostatit$$,$$prostatit-diagnostika-davolash$$,$$Prostatit diagnostikasi va davolash$$,$$Prostatit$$,14,2),
('urologiya','orta',11,$$Prostatit$$,$$prostatit-bph-ca-differensial$$,$$Prostatit vs BPH vs prostata saratoni$$,$$Prostatit$$,15,3),

-- 12-modul: LUTS va siydik tutolmaslik
('urologiya','orta',12,$$LUTS va siydik tutolmaslik$$,$$siydik-tutolmaslik-turlari$$,$$Siydik tutolmaslik turlari$$,$$LUTS$$,14,0),
('urologiya','orta',12,$$LUTS va siydik tutolmaslik$$,$$luts-tasnifi$$,$$LUTS: saqlash, chiqarish, post-mikturitsion$$,$$LUTS$$,14,1),
('urologiya','orta',12,$$LUTS va siydik tutolmaslik$$,$$tutolmaslik-diagnostika-davolash$$,$$Diagnostika va davolash prinsiplari$$,$$LUTS$$,14,2),

-- 13-modul: Siydik tutilishi
('urologiya','orta',13,$$Siydik tutilishi$$,$$otkir-siydik-tutilishi$$,$$O'tkir siydik tutilishi$$,$$Siydik tutilishi$$,14,0),
('urologiya','orta',13,$$Siydik tutilishi$$,$$surunkali-siydik-tutilishi$$,$$Surunkali siydik tutilishi$$,$$Siydik tutilishi$$,13,1),
('urologiya','orta',13,$$Siydik tutilishi$$,$$kateterizatsiya-asoslari$$,$$Kateterizatsiya asoslari$$,$$Siydik tutilishi$$,13,2),

-- 14-modul: Torayishlar
('urologiya','orta',14,$$Siydik yo'llari torayishlari$$,$$uretra-torayishi$$,$$Uretra torayishi (stricture)$$,$$Obstruksiya$$,14,0),
('urologiya','orta',14,$$Siydik yo'llari torayishlari$$,$$ureter-obstruksiyasi$$,$$Ureter obstruksiyasi$$,$$Obstruksiya$$,14,1),

-- 15-modul: Erektil disfunksiya
('urologiya','orta',15,$$Erkak jinsiy disfunksiyalari$$,$$erektil-disfunksiya$$,$$Erektil disfunksiya: sabablari$$,$$Andrologiya$$,14,0),
('urologiya','orta',15,$$Erkak jinsiy disfunksiyalari$$,$$ed-diagnostika-davolash$$,$$ED diagnostikasi va davolash$$,$$Andrologiya$$,15,1),
('urologiya','orta',15,$$Erkak jinsiy disfunksiyalari$$,$$ejakulyatsiya-buzilishlari$$,$$Ejakulyatsiya buzilishlari$$,$$Andrologiya$$,13,2),

-- 16-modul: Varikotsele va scrotal patologiya
('urologiya','orta',16,$$Varikotsele va moyak patologiyalari$$,$$varikotsele$$,$$Varikotsele$$,$$Moyak patologiyasi$$,14,0),
('urologiya','orta',16,$$Varikotsele va moyak patologiyalari$$,$$gidrotsele$$,$$Gidrotsele$$,$$Moyak patologiyasi$$,13,1),
('urologiya','orta',16,$$Varikotsele va moyak patologiyalari$$,$$epididimit-orxit$$,$$Epididimit va orxit$$,$$Moyak patologiyasi$$,14,2),

-- 17-modul: Gematuriya
('urologiya','orta',17,$$Gematuriya$$,$$gematuriya-turlari$$,$$Gematuriya: gross va mikroskopik$$,$$Gematuriya$$,14,0),
('urologiya','orta',17,$$Gematuriya$$,$$gematuriya-algoritm$$,$$Gematuriya diagnostik algoritmi$$,$$Gematuriya$$,15,1),

-- 18-modul: Urologik travma asoslari
('urologiya','orta',18,$$Urologik travma asoslari$$,$$buyrak-travmasi$$,$$Buyrak travmasi$$,$$Travma$$,14,0),
('urologiya','orta',18,$$Urologik travma asoslari$$,$$ureter-pufak-travmasi$$,$$Ureter va siydik pufagi travmasi$$,$$Travma$$,14,1),
('urologiya','orta',18,$$Urologik travma asoslari$$,$$uretra-genital-travma$$,$$Uretra va tashqi jinsiy a'zolar travmasi$$,$$Travma$$,14,2),

-- 19-modul: Bolalar urologiyasiga kirish
('urologiya','orta',19,$$Bolalar urologiyasiga kirish$$,$$kriptorxizm-kirish$$,$$Kriptorxizm$$,$$Pediatriya$$,13,0),
('urologiya','orta',19,$$Bolalar urologiyasiga kirish$$,$$gipospadiya-kirish$$,$$Gipospadiya$$,$$Pediatriya$$,13,1),
('urologiya','orta',19,$$Bolalar urologiyasiga kirish$$,$$fimoz-kirish$$,$$Fimoz$$,$$Pediatriya$$,12,2),
('urologiya','orta',19,$$Bolalar urologiyasiga kirish$$,$$vur-gidronefroz-kirish$$,$$VUR va gidronefroz (kirish)$$,$$Pediatriya$$,14,3),

-- ══════════ LEVEL 3 — ADVANCED (qiyin) ══════════
-- 20-modul: Murakkab urolitiaz va endourologiya
('urologiya','qiyin',20,$$Murakkab urolitiaz va endourologiya$$,$$metabolik-baholash$$,$$Metabolik baholash$$,$$Endourologiya$$,28,0),
('urologiya','qiyin',20,$$Murakkab urolitiaz va endourologiya$$,$$murakkab-toshlar$$,$$Staghorn va murakkab toshlar$$,$$Endourologiya$$,30,1),
('urologiya','qiyin',20,$$Murakkab urolitiaz va endourologiya$$,$$tosh-intervension-davolash$$,$$ESWL, URS, RIRS, PCNL$$,$$Endourologiya$$,32,2),
('urologiya','qiyin',20,$$Murakkab urolitiaz va endourologiya$$,$$obstruktiv-infeksiyalangan-buyrak$$,$$Obstruktiv infeksiyalangan tizim$$,$$Endourologiya$$,28,3),

-- 21-modul: Advanced BPH
('urologiya','qiyin',21,$$Advanced BPH$$,$$bph-urodinamika$$,$$BPH: urodinamika va chuqur baholash$$,$$BPH$$,28,0),
('urologiya','qiyin',21,$$Advanced BPH$$,$$bph-jarrohlik$$,$$BPH jarrohligi (TURP, HoLEP, prostatektomiya)$$,$$BPH$$,32,1),
('urologiya','qiyin',21,$$Advanced BPH$$,$$bph-jarrohlik-asoratlari$$,$$Jarrohlik asoratlari$$,$$BPH$$,28,2),

-- 22-modul: Prostata saratoni
('urologiya','qiyin',22,$$Prostata saratoni$$,$$prostata-ca-epidemiologiya$$,$$Prostata saratoni: epidemiologiya va xavf$$,$$Onkologiya$$,28,0),
('urologiya','qiyin',22,$$Prostata saratoni$$,$$psa-tahlili$$,$$PSA: total, free, density, velocity$$,$$Onkologiya$$,30,1),
('urologiya','qiyin',22,$$Prostata saratoni$$,$$prostata-mrt-biopsiya$$,$$Multiparametrik MRT (PI-RADS) va biopsiya$$,$$Onkologiya$$,30,2),
('urologiya','qiyin',22,$$Prostata saratoni$$,$$gleason-staging$$,$$Gleason/Grade Group va staging$$,$$Onkologiya$$,30,3),
('urologiya','qiyin',22,$$Prostata saratoni$$,$$prostata-ca-davolash$$,$$Davolash: kuzatuv, jarrohlik, nurlanish, gormonal$$,$$Onkologiya$$,32,4),

-- 23-modul: Buyrak o'smalari
('urologiya','qiyin',23,$$Buyrak o'smalari$$,$$rcc-turlari$$,$$Buyrak hujayrali saraton turlari$$,$$Onkologiya$$,28,0),
('urologiya','qiyin',23,$$Buyrak o'smalari$$,$$buyrak-osma-tasvirlash$$,$$Buyrak o'smasi tasvirlash va staging$$,$$Onkologiya$$,30,1),
('urologiya','qiyin',23,$$Buyrak o'smalari$$,$$buyrak-osma-davolash$$,$$Nefrektomiya va tizimli davolash$$,$$Onkologiya$$,30,2),

-- 24-modul: Siydik pufagi o'smalari
('urologiya','qiyin',24,$$Siydik pufagi o'smalari$$,$$pufak-saratoni-asoslari$$,$$Siydik pufagi saratoni: xavf va klinika$$,$$Onkologiya$$,28,0),
('urologiya','qiyin',24,$$Siydik pufagi o'smalari$$,$$pufak-saraton-diagnostika$$,$$Diagnostika: sistoskopiya, sitologiya$$,$$Onkologiya$$,30,1),
('urologiya','qiyin',24,$$Siydik pufagi o'smalari$$,$$nmibc-mibc-davolash$$,$$NMIBC va MIBC davolash$$,$$Onkologiya$$,32,2),

-- 25-modul: Yuqori siydik yo'llari patologiyalari
('urologiya','qiyin',25,$$Yuqori siydik yo'llari patologiyalari$$,$$gidronefroz$$,$$Gidronefroz$$,$$Obstruksiya$$,28,0),
('urologiya','qiyin',25,$$Yuqori siydik yo'llari patologiyalari$$,$$upj-obstruksiya$$,$$UPJ obstruksiyasi$$,$$Obstruksiya$$,28,1),
('urologiya','qiyin',25,$$Yuqori siydik yo'llari patologiyalari$$,$$yuqori-yollar-diagnostika-davolash$$,$$Diagnostika va davolash (MAG3/DTPA)$$,$$Obstruksiya$$,28,2),

-- 26-modul: Neyro-urologiya
('urologiya','qiyin',26,$$Neyro-urologiya$$,$$neyrogen-pufak$$,$$Neyrogen pufak: sabablar va turlar$$,$$Neyro-urologiya$$,28,0),
('urologiya','qiyin',26,$$Neyro-urologiya$$,$$neyrouro-urodinamika$$,$$Urodinamika$$,$$Neyro-urologiya$$,30,1),
('urologiya','qiyin',26,$$Neyro-urologiya$$,$$neyrogen-pufak-davolash$$,$$Davolash: kateter, dori, botulinum, neyromodulyatsiya$$,$$Neyro-urologiya$$,30,2),

-- 27-modul: Erkaklar bepushtligi
('urologiya','qiyin',27,$$Erkaklar bepushtligi$$,$$erkak-bepushtligi-tasnifi$$,$$Erkak bepushtligi: pretestikular/testikular/posttestikular$$,$$Andrologiya$$,28,0),
('urologiya','qiyin',27,$$Erkaklar bepushtligi$$,$$spermogramma-tahlili$$,$$Spermogramma tahlili$$,$$Andrologiya$$,28,1),
('urologiya','qiyin',27,$$Erkaklar bepushtligi$$,$$bepushtlik-gormonal-baholash$$,$$Gormonal baholash$$,$$Andrologiya$$,28,2),
('urologiya','qiyin',27,$$Erkaklar bepushtligi$$,$$azoospermiya$$,$$Obstruktiv va non-obstruktiv azoospermiya$$,$$Andrologiya$$,30,3),
('urologiya','qiyin',27,$$Erkaklar bepushtligi$$,$$bepushtlik-davolash-art$$,$$Davolash: medikamentoz, jarrohlik, ART (IVF/ICSI)$$,$$Andrologiya$$,32,4),

-- 28-modul: Erkaklar gormonal patologiyalari
('urologiya','qiyin',28,$$Erkaklar gormonal patologiyalari$$,$$gipogonadizm$$,$$Gipogonadizm: birlamchi va ikkilamchi$$,$$Andrologiya$$,28,0),
('urologiya','qiyin',28,$$Erkaklar gormonal patologiyalari$$,$$testosteron-orin-bosuvchi-terapiya$$,$$Testosteron o'rin bosuvchi terapiya (TRT)$$,$$Andrologiya$$,30,1),

-- 29-modul: Moyak o'smalari
('urologiya','qiyin',29,$$Moyak o'smalari$$,$$moyak-osmasi-turlari$$,$$Moyak o'smalari: germ hujayrali$$,$$Onkologiya$$,28,0),
('urologiya','qiyin',29,$$Moyak o'smalari$$,$$moyak-osma-markerlar-staging$$,$$Markerlar (AFP, β-hCG, LDH) va staging$$,$$Onkologiya$$,28,1),

-- 30-modul: Urologik onkologiya — umumiy yondashuv
('urologiya','qiyin',30,$$Urologik onkologiya — umumiy klinik yondashuv$$,$$onkologik-klinik-fikrlash$$,$$Urologik onkologiyada klinik fikrlash$$,$$Onkologiya$$,30,0),
('urologiya','qiyin',30,$$Urologik onkologiya — umumiy klinik yondashuv$$,$$onkologik-case-tahlil$$,$$Case: gematuriya, PSA, buyrak massasi$$,$$Onkologiya$$,32,1),

-- 31-modul: Urologik shoshilinch holatlar
('urologiya','qiyin',31,$$Urologik shoshilinch holatlar$$,$$urosepsis$$,$$Urosepsis va obstruktiv infeksiyalangan buyrak$$,$$Shoshilinch$$,30,0),
('urologiya','qiyin',31,$$Urologik shoshilinch holatlar$$,$$moyak-torsiyasi$$,$$Moyak torsiyasi$$,$$Shoshilinch$$,28,1),
('urologiya','qiyin',31,$$Urologik shoshilinch holatlar$$,$$furnye-gangrenasi$$,$$Fournier gangrenasi$$,$$Shoshilinch$$,28,2),
('urologiya','qiyin',31,$$Urologik shoshilinch holatlar$$,$$priapizm$$,$$Priapizm$$,$$Shoshilinch$$,28,3),

-- 32-modul: Advanced pediatric urology
('urologiya','qiyin',32,$$Advanced pediatric urology$$,$$vur-advanced$$,$$VUR (chuqur)$$,$$Pediatriya$$,28,0),
('urologiya','qiyin',32,$$Advanced pediatric urology$$,$$posterior-uretra-klapani$$,$$Posterior uretra klapani$$,$$Pediatriya$$,28,1),
('urologiya','qiyin',32,$$Advanced pediatric urology$$,$$pediatrik-gidronefroz-tosh$$,$$Pediatrik gidronefroz va tosh kasalligi$$,$$Pediatriya$$,28,2),

-- 33-modul: Minimal invaziv va endourologik texnologiyalar
('urologiya','qiyin',33,$$Minimal invaziv va endourologik texnologiyalar$$,$$endoskopiya-asoslari$$,$$Sistoskopiya va ureteroskopiya$$,$$Endourologiya$$,28,0),
('urologiya','qiyin',33,$$Minimal invaziv va endourologik texnologiyalar$$,$$tosh-jarrohligi-texnologiyalari$$,$$Tosh jarrohligi: RIRS, URS, PCNL$$,$$Endourologiya$$,30,1),
('urologiya','qiyin',33,$$Minimal invaziv va endourologik texnologiyalar$$,$$lazer-texnologiyalari$$,$$Lazer texnologiyalari (Holmium, Thulium)$$,$$Endourologiya$$,28,2),
('urologiya','qiyin',33,$$Minimal invaziv va endourologik texnologiyalar$$,$$stentlash$$,$$DJ stent va nefrostomiya$$,$$Endourologiya$$,28,3),

-- 34-modul: Advanced urologik diagnostika
('urologiya','qiyin',34,$$Advanced urologik diagnostika$$,$$urodinamika-advanced$$,$$Urodinamika (chuqur)$$,$$Diagnostika$$,28,0),
('urologiya','qiyin',34,$$Advanced urologik diagnostika$$,$$uro-tasvirlash-advanced$$,$$CT urografiya, mpMRT, nuklear renografiya$$,$$Diagnostika$$,30,1),
('urologiya','qiyin',34,$$Advanced urologik diagnostika$$,$$diagnostik-qaror-daraxti$$,$$Qaysi bemorga qaysi tekshiruv? (decision tree)$$,$$Diagnostika$$,30,2)

ON CONFLICT (slug) DO NOTHING;
