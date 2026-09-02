-- Nazorat testidagi qoidabuzarlik belgisini saqlash.
--
-- Anti-cheat faqat brauzer hodisalariga (visibilitychange/fullscreenchange)
-- tayanadi — ikkinchi qurilma yoki devtools'ni to'smaydi, shuning uchun jiddiy
-- imtihon kafolati emas. Lekin oyna/tab almashtirish tufayli test avtomatik
-- yakunlanganda, buni yozib qo'yamiz: o'qituvchi/admin natijani ko'rganda
-- qoidabuzarlik bo'lganini bilishi va kerak bo'lsa qayta topshirishni
-- rasmiylashtirishi mumkin.
ALTER TABLE public.talim_natijalari
  ADD COLUMN IF NOT EXISTS qoidabuzarlik boolean NOT NULL DEFAULT false;
