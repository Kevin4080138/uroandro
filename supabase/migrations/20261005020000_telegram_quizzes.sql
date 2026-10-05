BEGIN;

ALTER TABLE public.telegram_quizzes ADD COLUMN subject_type text NOT NULL DEFAULT 'clinical'
  CHECK (subject_type IN ('normalogiya', 'clinical'));
ALTER TABLE public.telegram_delivery_jobs ADD COLUMN lease_token uuid;
CREATE UNIQUE INDEX telegram_delivery_poll_unique ON public.telegram_delivery_parts(telegram_poll_id) WHERE telegram_poll_id IS NOT NULL;

-- Anonim umumiy natijalar. Foydalanuvchi ismi yoki shaxsiy javobi saqlanmaydi.
-- Poll Telegramdan qaytib kelishidan oldin webhook yetib kelsa ham natija yo'qolmaydi.
CREATE TABLE public.telegram_quiz_poll_results (
  poll_id text PRIMARY KEY,
  update_id bigint NOT NULL,
  options jsonb NOT NULL CHECK (jsonb_typeof(options) = 'array'),
  total_voter_count integer NOT NULL CHECK (total_voter_count >= 0),
  is_closed boolean NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.telegram_quiz_poll_results ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.telegram_quiz_poll_results FROM anon, authenticated;
GRANT SELECT ON public.telegram_quiz_poll_results TO authenticated;
GRANT ALL ON public.telegram_quiz_poll_results TO service_role;
CREATE POLICY admin_read ON public.telegram_quiz_poll_results FOR SELECT TO authenticated USING (public.is_admin());

-- Muharrir bitta tranzaksiyada ishlaydi: savollar o'chib, yangilari yaratilmay qolishi mumkin emas.
-- Quizni o'zgartirish va yuborishni boshlash bir xil row lock orqali ketadi.
REVOKE UPDATE, DELETE ON public.telegram_quizzes FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.telegram_quiz_questions FROM authenticated;

CREATE FUNCTION public.save_telegram_quiz(p_id uuid, p_revision integer, p_document jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE q public.telegram_quizzes; item jsonb; position_index integer := 0;
BEGIN
  SELECT * INTO q FROM public.telegram_quizzes WHERE id = p_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Quiz topilmadi' USING ERRCODE = 'P0002'; END IF;
  IF q.revision <> p_revision THEN RAISE EXCEPTION 'Quiz boshqa oynada yangilangan' USING ERRCODE = '40001'; END IF;
  IF EXISTS (SELECT 1 FROM public.telegram_delivery_jobs WHERE quiz_id = p_id) THEN
    RAISE EXCEPTION 'Yuborish boshlangan quiz tahrirlanmaydi. Yangi nusxa yarating' USING ERRCODE = '55000';
  END IF;
  IF p_document->>'status' NOT IN ('draft', 'review', 'approved') OR
     jsonb_typeof(p_document->'questions') IS DISTINCT FROM 'array' OR
     jsonb_array_length(p_document->'questions') > 5 OR
     (p_document->>'status' <> 'draft' AND jsonb_array_length(p_document->'questions') = 0) THEN
    RAISE EXCEPTION 'Quiz formati noto‘g‘ri' USING ERRCODE = '22023';
  END IF;
  UPDATE public.telegram_quizzes SET title = p_document->>'title', topic = p_document->>'topic',
    difficulty = p_document->>'difficulty', subject_type = p_document->>'subject_type',
    audience = p_document->>'audience', status = p_document->>'status', is_anonymous = true,
    revision = revision + 1 WHERE id = p_id;
  DELETE FROM public.telegram_quiz_questions WHERE quiz_id = p_id;
  FOR item IN SELECT value FROM jsonb_array_elements(p_document->'questions') LOOP
    IF coalesce(item->>'case_text', '') <> '' AND
       (p_document->>'difficulty' <> 'qiyin' OR p_document->>'subject_type' = 'normalogiya') THEN
      RAISE EXCEPTION 'Vaziyatli masala faqat QIYIN klinik mavzuda mumkin' USING ERRCODE = '22023';
    END IF;
    INSERT INTO public.telegram_quiz_questions(quiz_id, position, question, case_text, options, correct_option,
      explanation, image_url, image_credit, image_license, image_source_url, sources)
    VALUES(p_id, position_index, item->>'question', coalesce(item->>'case_text', ''), item->'options',
      (item->>'correct_option')::integer, item->>'explanation', item->>'image_url', item->>'image_credit',
      item->>'image_license', item->>'image_source_url', coalesce(item->'sources', '[]'::jsonb));
    position_index := position_index + 1;
  END LOOP;
  RETURN q.revision + 1;
END;
$$;

CREATE FUNCTION public.claim_telegram_quiz_delivery(p_quiz_id uuid, p_destination_id uuid, p_revision integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE q public.telegram_quizzes; d public.telegram_destinations; j public.telegram_delivery_jobs;
  question_list jsonb; token uuid := gen_random_uuid();
BEGIN
  SELECT * INTO q FROM public.telegram_quizzes WHERE id = p_quiz_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Quiz topilmadi' USING ERRCODE = 'P0002'; END IF;
  IF q.revision <> p_revision THEN RAISE EXCEPTION 'Quiz versiyasi o‘zgargan' USING ERRCODE = '40001'; END IF;
  IF q.status NOT IN ('approved', 'sent', 'failed') THEN
    RAISE EXCEPTION 'Avval quizni tasdiqlang' USING ERRCODE = '55000';
  END IF;
  SELECT * INTO d FROM public.telegram_destinations WHERE id = p_destination_id FOR SHARE;
  IF NOT FOUND OR NOT d.is_active OR d.use_for NOT IN ('quizzes', 'both') THEN
    RAISE EXCEPTION 'Faol quiz manzili topilmadi' USING ERRCODE = '55000';
  END IF;
  SELECT * INTO j FROM public.telegram_delivery_jobs
    WHERE quiz_id = p_quiz_id AND destination_id = p_destination_id AND revision = p_revision FOR UPDATE;
  IF FOUND THEN
    IF j.status = 'sent' THEN RETURN to_jsonb(j); END IF;
    IF j.status <> 'failed' OR EXISTS (SELECT 1 FROM public.telegram_delivery_parts
      WHERE job_id = j.id AND status IN ('sending', 'uncertain')) THEN
      RAISE EXCEPTION 'Yuborish davom etmoqda yoki natija noaniq. Telegramni tekshiring; takror yuborish bloklandi' USING ERRCODE = '55000';
    END IF;
    -- Snapshot o'zgarmaydi; faqat aniq rad etilgan qism qayta uriniladi.
    UPDATE public.telegram_delivery_jobs SET status = 'sending', attempts = attempts + 1,
      locked_at = now(), lease_token = token, last_error = null WHERE id = j.id RETURNING * INTO j;
  ELSE
    SELECT jsonb_agg(to_jsonb(t) ORDER BY t.position) INTO question_list
      FROM public.telegram_quiz_questions t WHERE quiz_id = p_quiz_id;
    IF question_list IS NULL OR jsonb_array_length(question_list) NOT BETWEEN 1 AND 5 THEN
      RAISE EXCEPTION '1–5 ta savol kerak' USING ERRCODE = '22023';
    END IF;
    INSERT INTO public.telegram_delivery_jobs(quiz_id, destination_id, revision, payload, status, attempts, locked_at, lease_token)
    VALUES(p_quiz_id, p_destination_id, p_revision,
      jsonb_build_object('quiz', to_jsonb(q) || jsonb_build_object('questions', question_list), 'destination', to_jsonb(d)),
      'sending', 1, now(), token) RETURNING * INTO j;
  END IF;
  RETURN to_jsonb(j);
END;
$$;

-- Eskirgan yoki qayta yetkazilgan webhook natijani orqaga qaytarmaydi.
CREATE FUNCTION public.record_telegram_quiz_poll(p_poll_id text, p_update_id bigint, p_options jsonb, p_total integer, p_closed boolean)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.telegram_quiz_poll_results(poll_id, update_id, options, total_voter_count, is_closed)
  VALUES(p_poll_id, p_update_id, p_options, p_total, p_closed)
  ON CONFLICT (poll_id) DO UPDATE SET update_id = EXCLUDED.update_id, options = EXCLUDED.options,
    total_voter_count = EXCLUDED.total_voter_count, is_closed = EXCLUDED.is_closed, updated_at = now()
  WHERE telegram_quiz_poll_results.update_id < EXCLUDED.update_id;
$$;

REVOKE ALL ON FUNCTION public.save_telegram_quiz(uuid, integer, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_telegram_quiz_delivery(uuid, uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_telegram_quiz_poll(text, bigint, jsonb, integer, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.save_telegram_quiz(uuid, integer, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_telegram_quiz_delivery(uuid, uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_telegram_quiz_poll(text, bigint, jsonb, integer, boolean) TO service_role;

COMMIT;
