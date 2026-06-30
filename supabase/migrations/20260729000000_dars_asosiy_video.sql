-- Video bo'limini ikkiga ajratish: asosiy dars videosi va qo'shimcha videolar.
-- video_linklar endi faqat "qo'shimcha videolar" ro'yxati sifatida ishlatiladi.
ALTER TABLE public.dars_tarkibi
  ADD COLUMN asosiy_video_url text;
