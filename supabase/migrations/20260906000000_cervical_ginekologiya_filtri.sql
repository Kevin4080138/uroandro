-- "Cervical" so'zining nevrologik ma'nolarini ginekologiya qidiruvidan chiqarish.

UPDATE public.yangilik_manbalari
SET search_query = '(
  gynecology[Title/Abstract]
  OR gynaecology[Title/Abstract]
  OR ovarian[Title]
  OR uterine[Title]
  OR endometriosis[Title]
  OR cervix[Title/Abstract]
  OR "uterine cervix"[Title/Abstract]
  OR "cervical cancer"[Title/Abstract]
  OR "cervical carcinoma"[Title/Abstract]
  OR "cervical screening"[Title/Abstract]
) NOT (
  cervical[Title]
  AND (
    dystonia[Title]
    OR spine[Title]
    OR myelopathy[Title]
    OR radiculopathy[Title]
  )
)',
updated_at = now()
WHERE source_type = 'pubmed' AND category = 'ginekologiya';
