BEGIN;

-- Only the worker's transactional claim may insert a job for an active schedule.
-- set_config(..., true) is transaction-local and cannot leak across pooled requests.
CREATE OR REPLACE FUNCTION public.guard_telegram_scheduled_job() RETURNS trigger
LANGUAGE plpgsql SET search_path=public AS $$
DECLARE plan public.telegram_schedules;
BEGIN
  IF NEW.post_id IS NOT NULL THEN PERFORM 1 FROM public.telegram_posts WHERE id=NEW.post_id FOR UPDATE;
  ELSE PERFORM 1 FROM public.telegram_quizzes WHERE id=NEW.quiz_id FOR UPDATE; END IF;
  SELECT * INTO plan FROM public.telegram_schedules WHERE status IN ('pending','sending')
    AND (post_id=NEW.post_id OR quiz_id=NEW.quiz_id);
  IF plan.id IS NOT NULL AND (plan.status <> 'sending' OR
    current_setting('app.telegram_schedule_id',true) IS DISTINCT FROM plan.id::text OR
    NEW.destination_id <> plan.destination_id OR NEW.revision <> plan.revision) THEN
    RAISE EXCEPTION 'Faol reja mavjud. Qo‘lda yuborishdan oldin uni bekor qiling' USING ERRCODE='55000';
  END IF;
  RETURN NEW;
END; $$;

CREATE FUNCTION public.claim_scheduled_telegram_quiz(p_schedule_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE plan public.telegram_schedules;
BEGIN
  SELECT * INTO plan FROM public.telegram_schedules WHERE id=p_schedule_id FOR SHARE;
  IF plan.id IS NULL OR plan.quiz_id IS NULL OR plan.status <> 'sending'
    OR plan.started_at < now()-interval '5 minutes' THEN
    RAISE EXCEPTION 'Faol yuborish rejasi topilmadi' USING ERRCODE='55000'; END IF;
  PERFORM set_config('app.telegram_schedule_id', plan.id::text, true);
  RETURN public.claim_telegram_quiz_delivery(plan.quiz_id,plan.destination_id,plan.revision);
END; $$;

CREATE FUNCTION public.claim_scheduled_telegram_post(p_schedule_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE plan public.telegram_schedules; post public.telegram_posts; dest public.telegram_destinations; job public.telegram_delivery_jobs;
BEGIN
  SELECT * INTO plan FROM public.telegram_schedules WHERE id=p_schedule_id FOR SHARE;
  IF plan.id IS NULL OR plan.post_id IS NULL OR plan.status <> 'sending'
    OR plan.started_at < now()-interval '5 minutes' THEN
    RAISE EXCEPTION 'Faol yuborish rejasi topilmadi' USING ERRCODE='55000'; END IF;
  SELECT * INTO post FROM public.telegram_posts WHERE id=plan.post_id FOR UPDATE;
  IF post.status <> 'approved' OR post.revision <> plan.revision OR btrim(post.body)='' THEN
    RAISE EXCEPTION 'Postning tasdiqlangan versiyasi o‘zgargan' USING ERRCODE='55000'; END IF;
  SELECT * INTO dest FROM public.telegram_destinations WHERE id=plan.destination_id FOR SHARE;
  IF NOT dest.is_active OR dest.use_for NOT IN ('posts','both') OR dest.chat_id <> plan.destination_chat_id THEN
    RAISE EXCEPTION 'Telegram manzili o‘zgargan yoki faol emas' USING ERRCODE='55000'; END IF;
  PERFORM set_config('app.telegram_schedule_id', plan.id::text, true);
  INSERT INTO public.telegram_delivery_jobs(post_id,destination_id,revision,payload,status,attempts,locked_at)
  VALUES(post.id,dest.id,post.revision,to_jsonb(post)||jsonb_build_object('destination',to_jsonb(dest)), 'sending',1,now())
  RETURNING * INTO job;
  RETURN to_jsonb(job);
END; $$;

REVOKE ALL ON FUNCTION public.claim_scheduled_telegram_quiz(uuid), public.claim_scheduled_telegram_post(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.claim_scheduled_telegram_quiz(uuid), public.claim_scheduled_telegram_post(uuid) TO service_role;
COMMIT;
