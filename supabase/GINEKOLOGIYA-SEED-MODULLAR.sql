-- ============================================================
-- GINEKOLOGIYA — 30 MODUL SKELETI (o'quv reja bo'yicha)
-- Level 1 (oson/bepul) 6 · Level 2 (orta) 11 · Level 3 (qiyin) 13
-- Har modul: video + konspekt + quick revision + klinik holat + take-home shabloni.
-- HAMMASI faol=false (qoralama) — ginekolog admin'da to'ldirib, faol qiladi.
-- Qayta Run qilsa dublikat bo'lmaydi (ON CONFLICT slug DO NOTHING).
-- ============================================================

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l1-modul-1', '1-modul. Ginekologiyaga kirish', NULL, 'oson', 'darslar', 'Ginekologiya, reproduktiv anatomiya va funksiyalar', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>1.1. Ginekologiya nima?</h3>
<ul><li>Ginekologiya tushunchasi</li><li>Asosiy bo‘limlari</li><li>Ginekologiya va akusherlik farqi</li><li>Ginekologning vazifalari</li><li>Reproduktiv salomatlik tushunchasi</li></ul>
<h3>1.2. Ayollar reproduktiv tizimi</h3>
<ul><li>Tashqi jinsiy a’zolar</li><li>Ichki jinsiy a’zolar</li><li>Bachadon</li><li>Bachadon bo‘yni</li><li>Bachadon naylari</li><li>Tuxumdonlar</li><li>Qin</li><li>Vulva</li></ul>
<h3>1.3. Topografik anatomiya</h3>
<ul><li>Kichik chanoq anatomiyasi</li><li>Organlarning o‘zaro joylashuvi</li><li>Bachadonning normal holati</li><li>Qorin parda bilan munosabati</li><li>Asosiy boylamlar</li></ul>
<h3>1.4. Jinsiy a’zolarning funksiyalari</h3>
<ul><li>Reproduktiv funksiya</li><li>Endokrin funksiya</li><li>Menstrual funksiya</li><li>Jinsiy funksiya</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 1, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l1-modul-2', '2-modul. Tuxumdon va follikulogenez', NULL, 'oson', 'darslar', 'Tuxumdon anatomiyasi, gistologiya, follikulogenez, oogenez', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>2.1. Tuxumdon anatomiyasi</h3>
<ul><li>Joylashuvi</li><li>O‘lchami</li><li>Qavatlari</li><li>Qon ta’minoti</li><li>Innervatsiyasi</li></ul>
<h3>2.2. Tuxumdon gistologiyasi</h3>
<ul><li>Korteks</li><li>Medulla</li><li>Follikulalar</li><li>Stromal hujayralar</li></ul>
<h3>2.3. Follikulogenez</h3>
<ul><li>Primordial follikula</li><li>Birlamchi follikula</li><li>Ikkilamchi follikula</li><li>Antral follikula</li><li>Dominant follikula</li></ul>
<h3>2.4. Oogenez</h3>
<ul><li>Oogoniya</li><li>Birlamchi ootsit</li><li>Ikkilamchi ootsit</li><li>Meiosis</li></ul>
<h3>2.5. Ovulyatsiyadan keyin</h3>
<ul><li>Follikulaning yorilishi</li><li>Sariq tana</li><li>Progesteron ishlab chiqarilishi</li><li>Sariq tananing regressiyasi</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 2, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l1-modul-3', '3-modul. Normal hayz sikli', NULL, 'oson', 'darslar', 'Sikl fazalari, GGT o‘qi, ovulyatsiya, sikl hisobi', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>3.1. Hayz sikli nima?</h3>
<ul><li>Sikl davomiyligi</li><li>Normal sikl parametrlari</li><li>Menarxe</li><li>Reproduktiv davr</li></ul>
<h3>3.2. Hayz sikli fazalari</h3>
<ul><li>Menstrual faza</li><li>Follikulyar faza</li><li>Ovulyatsiya</li><li>Luteal faza</li></ul>
<h3>3.3. Gipotalamus–gipofiz–tuxumdon o‘qi</h3>
<ul><li>GnRH</li><li>FSH</li><li>LH</li><li>Estrogen</li><li>Progesteron</li><li>Feedback mexanizmi</li></ul>
<h3>3.4. Ovulyatsiya</h3>
<ul><li>LH surge</li><li>Dominant follikula</li><li>Ovulyatsiya mexanizmi</li></ul>
<h3>3.5. Hayz siklini hisoblash</h3>
<ul><li>Cycle day</li><li>Fertile window</li><li>Ovulyatsiyani taxmin qilish</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 3, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l1-modul-4', '4-modul. Ginekologik bemorni tekshirish', NULL, 'oson', 'darslar', 'Anamnez, ko‘rik, bimanual va instrumental diagnostikaga kirish', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>4.1. Anamnez</h3>
<ul><li>Asosiy shikoyat</li><li>Menstrual anamnez</li><li>Reproduktiv anamnez</li><li>Jinsiy anamnez</li><li>Kontratseptsiya</li><li>Oldingi kasalliklar</li><li>Dori vositalari</li></ul>
<h3>4.2. Umumiy ko‘rik</h3>
<ul><li>Tana tuzilishi</li><li>BMI</li><li>Teri</li><li>Sochlanish</li><li>Sut bezlari</li><li>Qorin</li></ul>
<h3>4.3. Ginekologik ko‘rik</h3>
<ul><li>Vulva</li><li>Qin</li><li>Bachadon bo‘yni</li><li>Ajralmalar</li></ul>
<h3>4.4. Bimanual tekshiruv</h3>
<ul><li>Bachadon</li><li>Adnekslar</li><li>Og‘riqlilik</li><li>Harakatchanlik</li></ul>
<h3>4.5. Instrumental diagnostikaga kirish</h3>
<ul><li>UTT</li><li>Transabdominal UTT</li><li>Transvaginal UTT</li><li>Biopsiya haqida tushuncha</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 4, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l1-modul-5', '5-modul. Sut bezi', NULL, 'oson', 'darslar', 'Anatomiya, gormonal boshqaruv, laktogenez', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>5.1. Anatomiya</h3>
<ul><li>Lobula</li><li>Duktuslar</li><li>Areola</li><li>So‘rg‘ich</li></ul>
<h3>5.2. Gormonal boshqaruv</h3>
<ul><li>Estrogen</li><li>Progesteron</li><li>Prolaktin</li><li>Oksitotsin</li></ul>
<h3>5.3. Laktogenez</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>5.4. Galaktopoez</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>5.5. Sut ajralishi mexanizmi</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 5, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l1-modul-6', '6-modul. Kontratseptsiya asoslari', NULL, 'oson', 'darslar', 'Kontratseptsiya usullari — asosiy tushuncha', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>6.1. Kontratseptsiya nima?</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>6.2. Gormonal usullar</h3>
<ul><li>Combined hormonal contraception</li><li>Progestin-only methods</li></ul>
<h3>6.3. Bachadon ichi vositalari</h3>
<ul><li>Copper IUD</li><li>LNG-IUD</li></ul>
<h3>6.4. Barer usullar</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>6.5. Tabiiy usullar</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>6.6. Emergency contraception</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>6.7. Sterilizatsiya haqida umumiy tushuncha</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 6, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-7', '7-modul. Hayz sikli buzilishlari', NULL, 'orta', 'darslar', 'Amenoreya, etiologiya, diagnostika, davolash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>7.1. Normal va patologik sikl</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>7.2. Amenoreya</h3>
<ul><li>Birlamchi</li><li>Ikkilamchi</li></ul>
<h3>7.3. Amenoreya etiologiyasi</h3>
<ul><li>Gipotalamik</li><li>Gipofizar</li><li>Tuxumdon</li><li>Bachadon</li><li>Homiladorlik</li></ul>
<h3>7.4. Diagnostika</h3>
<ul><li>Pregnancy test</li><li>FSH/LH</li><li>Prolaktin</li><li>TSH</li><li>Estradiol</li><li>UTT</li></ul>
<h3>7.5. Differensial diagnostika</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>7.6. Davolash prinsiplari</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 7, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-8', '8-modul. Vulva va qinning yallig‘lanish kasalliklari', NULL, 'orta', 'darslar', 'Vulvit, kolpit, vulvovaginit', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Kasalliklar</h3>
<ul><li>Vulvit</li><li>Kolpit</li><li>Vulvovaginit</li></ul>
<h3>Etiologiya</h3>
<ul><li>Bakterial</li><li>Zamburug‘li</li><li>Parazitar</li></ul>
<h3>Klinik va diagnostika</h3>
<ul><li>Klinik belgilar</li><li>Ajralmalarni baholash</li><li>Mikroskopiya</li><li>Davolash</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 8, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-9', '9-modul. Urogenital infeksiyalar', NULL, 'orta', 'darslar', 'Gonoreya, trixomoniaz, BV, kandidoz', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Gonoreya</h3>
<ul><li>Etiologiya</li><li>Klinikasi</li><li>NAAT/laborator diagnostika</li><li>Davolash</li></ul>
<h3>Boshqa infeksiyalar</h3>
<ul><li>Trixomoniaz</li><li>Bakterial vaginoz</li><li>Vaginal kandidoz</li></ul>
<h3>Format</h3>
<ul><li>Kasallik · Ajralma · pH · Mikroskopiya · Diagnostika · Davolash</li><li>Oxirida clinical cases</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 9, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-10', '10-modul. Yuqori jinsiy yo‘l yallig‘lanishlari (PID)', NULL, 'orta', 'darslar', 'Servitsit, endometrit, adneksit, PID', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Kasalliklar</h3>
<ul><li>Servitsit</li><li>Endometrit</li><li>Salpingooforit</li><li>Adneksit</li><li>Parametrit</li><li>Pelvioperitonit</li></ul>
<h3>Pelvic inflammatory disease — PID</h3>
<ul><li>Etiologiyasi</li><li>Ascending infection</li><li>Klinikasi</li><li>Diagnostika</li><li>Asoratlar</li><li>Davolash</li></ul>
<h3>Clinical case</h3>
<ul><li>20 yoshli ayol + pastki qorin og‘rig‘i + isitma + cervical motion tenderness</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 10, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-11', '11-modul. Bachadon bo‘yni fon kasalliklari va HPV', NULL, 'orta', 'darslar', 'Ektopiya, polip, HPV', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Fon kasalliklari</h3>
<ul><li>11.1. Ektopiya</li><li>11.2. “Eroziya” tushunchasi</li><li>11.3. Servikal polip</li></ul>
<h3>11.4. HPV</h3>
<ul><li>HPV nima?</li><li>High-risk HPV</li><li>Low-risk HPV</li><li>Yuqish</li><li>Persistent infection</li><li>Saraton bilan bog‘liqligi</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 11, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-12', '12-modul. Bachadon bo‘ynini zamonaviy diagnostika qilish', NULL, 'orta', 'darslar', 'Pap-test, HPV test, kolposkopiya, biopsiya', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Pap-test</h3>
<ul><li>Maqsadi</li><li>Namuna olish</li><li>Natijalar</li></ul>
<h3>HPV test</h3>
<ul><li>Qachon?</li><li>Kimga?</li><li>Natijalarni interpretatsiya qilish</li></ul>
<h3>Kolposkopiya</h3>
<ul><li>Ko‘rsatmalar</li><li>Acetic acid</li><li>Lugol</li><li>Transformatsiya zonasi</li></ul>
<h3>Biopsiya</h3>
<ul><li>Qachon?</li><li>Nima uchun?</li><li>Algoritm: Screening → abnormal result → colposcopy → biopsy</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 12, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-13', '13-modul. Bachadon miomasi', NULL, 'orta', 'darslar', 'Turlari, klinika, diagnostika, davolash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>13.1. Mioma nima?</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>13.2. Turlari</h3>
<ul><li>Submukoz</li><li>Intramural</li><li>Subseroz</li></ul>
<h3>13.3. Klinikasi</h3>
<ul><li>Menorragiya</li><li>Pelvik bosim</li><li>Og‘riq</li><li>Bepushtlik</li></ul>
<h3>13.4. Diagnostika</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>13.5. Davolash</h3>
<ul><li>Kuzatuv</li><li>Medikamentoz</li><li>Intervensional</li><li>Jarrohlik</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 13, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-14', '14-modul. Endometrioz', NULL, 'orta', 'darslar', 'Patogenez, klinika, diagnostika, davolash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Umumiy</h3>
<ul><li>Endometrioz nima?</li><li>Patogenezi</li><li>Turlari</li></ul>
<h3>Klinikasi</h3>
<ul><li>Dysmenorrhea</li><li>Dyspareunia</li><li>Chronic pelvic pain</li><li>Infertility</li></ul>
<h3>Diagnostika va davolash</h3>
<ul><li>Diagnostika</li><li>Medikamentoz davolash</li><li>Jarrohlik</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 14, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-15', '15-modul. Endometriy poliplari va giperplastik jarayonlarga kirish', NULL, 'orta', 'darslar', 'Polip, gistologiya', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Polip</h3>
<ul><li>Klinikasi</li><li>UTT</li><li>Histeroskopiya haqida tushuncha</li><li>Biopsiya</li><li>Gistologiya</li></ul>
<h3>Eslatma</h3>
<ul><li>Chuqur onkologik qism Level 3 da</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 15, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-16', '16-modul. Tuxumdon funksional kistalari', NULL, 'orta', 'darslar', 'Follikulyar, corpus luteum, gemorragik kista', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Turlari</h3>
<ul><li>Follikulyar kista</li><li>Corpus luteum cyst</li><li>Gemorragik kista</li></ul>
<h3>Klinik-diagnostik</h3>
<ul><li>Patogenez</li><li>Klinikasi</li><li>UTT ko‘rinishi</li><li>Kuzatish</li><li>Davolash</li><li>Asoratlar</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 16, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l2-modul-17', '17-modul. Giperprolaktinemiya', NULL, 'orta', 'darslar', 'Prolaktin fiziologiyasi, sabablar, davolash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Fiziologiya va sabablar</h3>
<ul><li>Prolaktin fiziologiyasi</li><li>Dori</li><li>Prolaktinoma</li><li>Gipotiroidizm</li><li>Boshqa sabablar</li></ul>
<h3>Klinikasi</h3>
<ul><li>Galaktoreya</li><li>Amenoreya</li><li>Infertility</li></ul>
<h3>Diagnostika va davolash</h3>
<ul><li>Diagnostika</li><li>Davolash prinsiplari</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 17, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-18', '18-modul. PCOS', NULL, 'qiyin', 'darslar', 'Patofiziologiya, Rotterdam, davolash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Patofiziologiya</h3>
<ul><li>Hyperandrogenism</li><li>Insulin resistance</li><li>LH/FSH dynamics</li></ul>
<h3>Tashxis</h3>
<ul><li>Klinik fenotiplar</li><li>Rotterdam mezonlari</li><li>Differensial diagnostika</li><li>Metabolik xavflar</li><li>Fertility</li></ul>
<h3>Davolash</h3>
<ul><li>Lifestyle</li><li>Menstrual regulation</li><li>Hyperandrogenism</li><li>Ovulation induction</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 18, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-19', '19-modul. Bachadon noto‘g‘ri joylashishi va prolaps', NULL, 'qiyin', 'darslar', 'Retroversiya, prolaps, inversiya', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Retroversiya / Prolaps</h3>
<ul><li>Retroversiya</li><li>Prolaps: I–IV daraja</li><li>Klinikasi</li><li>POP-Q haqida tushuncha</li><li>Davolash</li></ul>
<h3>Bachadon inversiyasi</h3>
<ul><li>Sabablari</li><li>Klinikasi</li><li>Emergency management</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 19, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-20', '20-modul. Tug‘ma rivojlanish nuqsonlari', NULL, 'qiyin', 'darslar', 'Müllerian anomaliyalar', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Müllerian anomalies</h3>
<ul><li>Uterus didelphys</li><li>Bicornuate uterus</li><li>Septate uterus</li><li>Unicornuate uterus</li></ul>
<h3>Vaginal anomalies</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h3>Diagnostika va oqibat</h3>
<ul><li>UTT</li><li>MRI</li><li>HSG</li><li>Reproduktiv oqibatlar</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 20, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-21', '21-modul. Tuxumdon o‘smalari', NULL, 'qiyin', 'darslar', 'Tasnif, markerlar, davolash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Tasnifi</h3>
<ul><li>Epithelial (serous, mucinous, endometrioid, clear cell)</li><li>Germ cell (teratoma, dysgerminoma)</li><li>Sex-cord stromal</li></ul>
<h3>Baholash</h3>
<ul><li>Benign vs borderline vs malignant</li><li>Klinikasi</li><li>UTT</li><li>Tumor markers</li><li>Risk assessment</li></ul>
<h3>Davolash prinsiplari</h3>
<p><em>Mazmun shu yerga qo‘shiladi.</em></p>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 21, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-22', '22-modul. Bachadon bo‘yni saratonoldi kasalliklari (CIN)', NULL, 'qiyin', 'darslar', 'CIN 1–3, management', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>CIN</h3>
<ul><li>CIN 1</li><li>CIN 2</li><li>CIN 3</li><li>HPV persistence</li><li>Progression</li><li>Regression</li></ul>
<h3>Diagnostika</h3>
<ul><li>Cytology</li><li>HPV</li><li>Colposcopy</li><li>Biopsy</li></ul>
<h3>Management</h3>
<ul><li>Observation</li><li>Excisional treatment</li><li>Ablative treatment</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 22, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-23', '23-modul. Bachadon bo‘yni saratoni', NULL, 'qiyin', 'darslar', 'Epidemiologiya, FIGO, davolash, profilaktika', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Asoslar</h3>
<ul><li>Epidemiologiya</li><li>Risk factors</li><li>HPV carcinogenesis</li><li>Klinikasi</li></ul>
<h3>Tashxis</h3>
<ul><li>FIGO stagingga kirish</li><li>Biopsy</li><li>Imaging</li><li>Staging</li></ul>
<h3>Davolash va profilaktika</h3>
<ul><li>Surgery</li><li>Radiotherapy</li><li>Chemoradiotherapy</li><li>Advanced disease</li><li>HPV vaccination</li><li>Screening</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 23, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-24', '24-modul. Endometriy giperplaziyasi va endometriy saratoni', NULL, 'qiyin', 'darslar', 'Giperplaziya, EIN, davolash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Endometriy giperplaziyasi</h3>
<ul><li>Etiologiya</li><li>Unopposed estrogen</li><li>Giperplaziya turlari</li><li>Atypia/EIN tushunchasi</li></ul>
<h3>Diagnostika</h3>
<ul><li>UTT</li><li>Endometrial biopsy</li><li>Hysteroscopy</li></ul>
<h3>Davolash</h3>
<ul><li>Progestin therapy</li><li>Hysterectomy</li><li>Fertility-sparing approach</li><li>Endometriy saratoniga kirish</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 24, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-25', '25-modul. Bepushtlik', NULL, 'qiyin', 'darslar', 'Erkak va ayol omili, davolash (IUI/IVF/ICSI)', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Umumiy</h3>
<ul><li>Primary</li><li>Secondary</li></ul>
<h3>Ayol omili</h3>
<ul><li>Ovulation</li><li>Ovarian reserve</li><li>Tubal patency</li><li>Uterine factor</li><li>AMH haqida tushuncha</li></ul>
<h3>Erkak omili</h3>
<ul><li>Spermogramma</li><li>Semen parameters</li></ul>
<h3>Davolash</h3>
<ul><li>Lifestyle</li><li>Ovulation induction</li><li>IUI</li><li>IVF</li><li>ICSI</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 25, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-26', '26-modul. Ginekologik diagnostik protseduralar', NULL, 'qiyin', 'darslar', 'HSG, gisteroskopiya, biopsiya — tanlash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>HSG</h3>
<ul><li>Indications</li><li>Contraindications</li><li>Preparation</li><li>Procedure</li><li>Interpretation</li><li>Complications</li></ul>
<h3>Boshqa protseduralar</h3>
<ul><li>Gidrotubatsiya</li><li>Bachadon zondlash</li><li>Endometrial biopsy</li><li>Cervical biopsy</li><li>Hysteroscopy</li></ul>
<h3>Maqsad</h3>
<ul><li>Qaysi bemorga qaysi tekshiruvni tanlash</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 26, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-27', '27-modul. Homiladorlik fiziologiyasi', NULL, 'qiyin', 'darslar', 'Implantatsiya, platsenta, monitoring', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Asoslar</h3>
<ul><li>Implantatsiya</li><li>Platsenta</li><li>hCG</li><li>Progesteron</li><li>Estrogen</li><li>Trimestrlar</li></ul>
<h3>Ona organizmidagi o‘zgarishlar</h3>
<ul><li>Yurak-qon tomir</li><li>Nafas olish</li><li>Buyrak</li><li>Endokrin</li><li>Reproduktiv tizim</li></ul>
<h3>Monitoring</h3>
<ul><li>Fiziologik monitoring</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 27, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-28', '28-modul. Bachadondan tashqari homiladorlik', NULL, 'qiyin', 'darslar', 'Turlari, diagnostika, davolash', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Turlari</h3>
<ul><li>Tubal</li><li>Cervical</li><li>Ovarian</li><li>Abdominal</li></ul>
<h3>Klinik-diagnostik</h3>
<ul><li>Risk factors</li><li>Klinikasi</li><li>β-hCG</li><li>Transvaginal UTT</li><li>Differential diagnosis</li></ul>
<h3>Davolash</h3>
<ul><li>Expectant</li><li>Medical</li><li>Surgical</li><li>Emergency management</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 28, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-29', '29-modul. Amniotik suyuqlik patologiyalari', NULL, 'qiyin', 'darslar', 'Oligo/polyhydramnios', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Patologiyalar</h3>
<ul><li>Oligohydramnios</li><li>Polyhydramnios</li></ul>
<h3>Diagnostika va xavflar</h3>
<ul><li>Sabablari</li><li>Diagnostik mezonlar</li><li>UTT</li><li>Homila va ona uchun xavflar</li><li>Management principles</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 29, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gin_darslar (slug, sarlavha, kategoriya, bosqich, bolim, qisqa, nazariya_html, daqiqa, sort_order, faol)
VALUES ('gin-l3-modul-30', '30-modul. Menopauza va perimenopauza', NULL, 'qiyin', 'darslar', 'Simptomlar, MHT, oqibatlar', '<h2>🎥 Video dars</h2>
<p><em>Video havolasi shu yerga qo‘shiladi (10–25 daq).</em></p>
<h2>📖 Klinik konspekt</h2>
<h3>Asoslar</h3>
<ul><li>Menopauza nima?</li><li>Perimenopauza</li><li>Gormonal o‘zgarishlar</li></ul>
<h3>Simptomlar</h3>
<ul><li>Vasomotor</li><li>Urogenital</li><li>Sleep</li><li>Mood</li></ul>
<h3>Oqibat va davolash</h3>
<ul><li>Osteoporosis</li><li>Cardiovascular risk</li><li>MHT: indications/contraindications/risks/benefits</li><li>Non-hormonal therapy</li></ul>
<h2>🧠 Quick Revision</h2>
<p><em>Oldingi modullardan kerakli bilim shu yerda qisqa eslatiladi.</em></p>
<h2>🩺 Klinik holat</h2>
<p><em>Real klinik scenario shu yerga qo‘shiladi.</em></p>
<h2>🎯 Asosiy nuqtalar (Take-home)</h2>
<ul><li><em>5–10 ta asosiy nuqta shu yerda.</em></li></ul>
', 15, 30, false)
ON CONFLICT (slug) DO NOTHING;


-- Barcha modul skeletlarini NASHR qilish (struktura talabaga ko'rinsin).
-- Ginekolog kontentni admin'dan to'ldiraveradi; yashirmoqchi bo'lsa admin'da "Faol" ni o'chiradi.
UPDATE public.gin_darslar SET faol = true WHERE slug LIKE 'gin-l%-modul-%';
