-- Varikotsele darsi (h-varikotsele-kasalligi) nazariya matnidagi imlo,
-- terminologiya va raqamli nomuvofiqliklarni tuzatish. Butun HTML matnini
-- qayta yozmasdan, faqat xato joylarni REPLACE() bilan almashtiramiz.

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(nazariya_html, 'Dopler UTT', 'Doppler UTT')
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(nazariya_html, 'kontakt termografiya, Dopler, venografiya', 'kontakt termografiya, Doppler, venografiya')
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(nazariya_html, 'Mosjonka', 'Moshonka')
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(nazariya_html, 'mosjonka', 'moshonka')
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(nazariya_html, 'anevuploidiyaga', 'aneuploidiyaga')
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(
  nazariya_html,
  $old$diagnostik usulga qarab 80% gachagi hollarda aniqlanishi mumkin$old$,
  $new$diagnostik usulga qarab 80%gacha bo'lgan hollarda aniqlanishi mumkin$new$
)
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(
  nazariya_html,
  $old$odatda 280–300 ng/dL dan past bo'lsa gipoandrogenizm haqida gap boradi$old$,
  $new$odatda 280–300 ng/dL dan past bo'lsa androgen yetishmovchiligi haqida gap boradi$new$
)
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(
  nazariya_html,
  $old$Mikroxirurgik usulda 0%, klassik usullarda 3–33% (o'rtacha ~7%)$old$,
  $new$Mikroxirurgik usulda 0%, klassik usullarda 3–30% (o'rtacha ~7%)$new$
)
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(
  nazariya_html,
  $old$Chov kanali bo'ylab joylashgan, ko'pincha qaytariladi (reduktabel)$old$,
  $new$Chov kanali bo'ylab joylashgan, ko'pincha qo'l bilan joyiga qaytariladigan (reduktabel)$new$
)
WHERE dars_slug = 'h-varikotsele-kasalligi';

UPDATE public.dars_tarkibi
SET nazariya_html = REPLACE(nazariya_html, '(Dubin va Amelar, 1970 asosida)', '(Dubin va Amelar, 1970-yil tasnifi asosida)')
WHERE dars_slug = 'h-varikotsele-kasalligi';
