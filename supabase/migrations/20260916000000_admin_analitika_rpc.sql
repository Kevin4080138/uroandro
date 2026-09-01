-- Admin analitikasi: og'ir agregatsiyalarni brauzerdan Postgres'ga ko'chirish.
--
-- Ilgari `talabalar-nazorati` butun dars_qadam_progress / talim_natijalari /
-- obunalar jadvallarini LIMIT'siz brauzerga tortib, agregatsiyani JS'da qilardi;
-- dashboard esa ~14 ta parallel COUNT so'rovi yuborardi. Foydalanuvchi ko'paygani
-- sari bu sekinlashib, uzilardi. Quyidagi SECURITY DEFINER funksiyalar hisobni
-- bazada bajaradi va har talaba/ko'rsatkich uchun bitta qator qaytaradi.
--
-- Xavfsizlik: har funksiya boshida `is_admin()` tekshiriladi (SECURITY DEFINER
-- RLS'ni chetlab o'tgani uchun majburiy). EXECUTE faqat `authenticated` rolga.

-- 1) Har talaba uchun bitta xulosa qatori ------------------------------------
-- "Tugallangan dars" ta'rifi klient bilan bir xil: dars ichida 'nazariya' VA
-- 'amaliy' qadamlari bo'lsa (ASOSIY_QADAMLAR, useDarsProgress.ts).
CREATE OR REPLACE FUNCTION public.admin_talabalar_xulosa()
RETURNS TABLE (
  student_id           uuid,
  full_name            text,
  email                text,
  telefon              text,
  created_at           timestamptz,
  tugallangan_darslar  bigint,
  jami_qadam           bigint,
  urinishlar           bigint,
  ortacha_foiz         int,
  nazorat_otgan        bigint,
  obunalar             text[],
  darslar              text[],
  oxirgi_faollik       timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Ruxsat yo''q' USING errcode = '42501';
  END IF;

  RETURN QUERY
  WITH talaba AS (
    SELECT p.id, p.full_name, p.email, p.telefon, p.created_at
    FROM profiles p
    WHERE p.role = 'student' AND p.arxivlangan = false
  ),
  dars_holati AS (  -- har (talaba, dars) uchun: tugadimi?
    SELECT dp.student_id, dp.dars_slug,
           (bool_or(dp.qadam = 'nazariya') AND bool_or(dp.qadam = 'amaliy')) AS tugadi
    FROM dars_qadam_progress dp
    GROUP BY dp.student_id, dp.dars_slug
  ),
  progress_agg AS (
    SELECT dp.student_id,
           count(*)          AS jami_qadam,
           max(dp.created_at) AS oxirgi_progress
    FROM dars_qadam_progress dp
    GROUP BY dp.student_id
  ),
  tugagan_agg AS (
    SELECT dh.student_id, count(*) FILTER (WHERE dh.tugadi) AS tugallangan
    FROM dars_holati dh
    GROUP BY dh.student_id
  ),
  natija_agg AS (
    SELECT n.student_id,
           count(*)                                                                        AS urinishlar,
           round(avg(n.foiz))::int                                                         AS ortacha_foiz,
           count(DISTINCT n.dars_slug) FILTER (WHERE n.turi = 'nazorat' AND n.foiz >= 70)  AS nazorat_otgan,
           max(n.created_at)                                                               AS oxirgi_natija
    FROM talim_natijalari n
    GROUP BY n.student_id
  ),
  obuna_agg AS (
    SELECT o.student_id, array_agg(o.bosqich ORDER BY o.bosqich) AS bosqichlar
    FROM obunalar o
    WHERE o.faol = true AND (o.tugash_sanasi IS NULL OR o.tugash_sanasi > now())
    GROUP BY o.student_id
  ),
  darslar_agg AS (  -- talaba tegib o'tgan dars slug'lari (bosqich filtri uchun)
    SELECT s.student_id, array_agg(DISTINCT s.dars_slug) AS slugs
    FROM (
      SELECT dp.student_id, dp.dars_slug FROM dars_qadam_progress dp
      UNION
      SELECT n.student_id, n.dars_slug FROM talim_natijalari n
    ) s
    GROUP BY s.student_id
  )
  SELECT
    t.id,
    t.full_name,
    t.email,
    t.telefon,
    t.created_at,
    COALESCE(tg.tugallangan, 0),
    COALESCE(pa.jami_qadam, 0),
    COALESCE(na.urinishlar, 0),
    na.ortacha_foiz,                              -- NULL bo'lsa klient '—' ko'rsatadi
    COALESCE(na.nazorat_otgan, 0),
    COALESCE(oa.bosqichlar, ARRAY[]::text[]),
    COALESCE(da.slugs, ARRAY[]::text[]),
    GREATEST(pa.oxirgi_progress, na.oxirgi_natija)  -- GREATEST NULL'larni e'tiborsiz qoldiradi
  FROM talaba t
  LEFT JOIN progress_agg pa ON pa.student_id = t.id
  LEFT JOIN tugagan_agg  tg ON tg.student_id = t.id
  LEFT JOIN natija_agg   na ON na.student_id = t.id
  LEFT JOIN obuna_agg    oa ON oa.student_id = t.id
  LEFT JOIN darslar_agg  da ON da.student_id = t.id;
END;
$$;

-- 2) Dashboard KPI'lari — bitta qatorda (14 so'rov o'rniga 1) --------------------
CREATE OR REPLACE FUNCTION public.admin_dashboard_kpi()
RETURNS TABLE (
  bugun_qoshildi     bigint,
  hafta_yangilar     bigint,
  korilmagan_fikr    bigint,
  yangi_murojaat     bigint,
  obunali_talabalar  bigint,
  faol_talabalar     bigint,
  student_soni       bigint,
  doctor_soni        bigint,
  patient_soni       bigint,
  admin_soni         bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  bugun timestamptz := date_trunc('day', now());
  hafta timestamptz := date_trunc('day', now()) - interval '7 days';
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Ruxsat yo''q' USING errcode = '42501';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT count(*) FROM profiles WHERE created_at >= bugun),
    (SELECT count(*) FROM profiles WHERE created_at >= hafta),
    (SELECT count(*) FROM fikrlar WHERE korildi = false),
    (SELECT count(*) FROM tashriflar WHERE holat = 'yangi'),
    (SELECT count(DISTINCT o.student_id) FROM obunalar o
       WHERE o.faol = true AND (o.tugash_sanasi IS NULL OR o.tugash_sanasi > now())),
    (SELECT count(DISTINCT s) FROM (
        SELECT student_id AS s FROM dars_qadam_progress WHERE created_at >= hafta
        UNION
        SELECT student_id     FROM talim_natijalari     WHERE created_at >= hafta
     ) x),
    (SELECT count(*) FROM profiles WHERE role = 'student'),
    (SELECT count(*) FROM profiles WHERE role = 'doctor'),
    (SELECT count(*) FROM profiles WHERE role = 'patient'),
    (SELECT count(*) FROM profiles WHERE role = 'admin');
END;
$$;

-- 3) So'nggi 7 kun yangi a'zolar — kun bo'yicha sanoq -------------------------
-- Bo'sh kunlar ham 0 bilan qaytadi (generate_series LEFT JOIN).
CREATE OR REPLACE FUNCTION public.admin_yangi_azolar_7kun()
RETURNS TABLE (kun date, soni bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Ruxsat yo''q' USING errcode = '42501';
  END IF;

  RETURN QUERY
  WITH kunlar AS (
    SELECT generate_series(
      date_trunc('day', now()) - interval '6 days',
      date_trunc('day', now()),
      interval '1 day'
    )::date AS kun
  )
  SELECT k.kun, count(p.id)
  FROM kunlar k
  LEFT JOIN profiles p ON date_trunc('day', p.created_at)::date = k.kun
  GROUP BY k.kun
  ORDER BY k.kun;
END;
$$;

-- Ruxsatlar: faqat tizimga kirgan foydalanuvchilar (ichida is_admin tekshiruvi bor)
REVOKE ALL ON FUNCTION public.admin_talabalar_xulosa()  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_dashboard_kpi()     FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_yangi_azolar_7kun() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_talabalar_xulosa()  TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_kpi()     TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_yangi_azolar_7kun() TO authenticated;
