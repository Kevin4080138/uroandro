BEGIN;

CREATE TABLE public.telegram_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.telegram_posts(id) ON DELETE RESTRICT,
  quiz_id uuid REFERENCES public.telegram_quizzes(id) ON DELETE RESTRICT,
  destination_id uuid NOT NULL REFERENCES public.telegram_destinations(id) ON DELETE RESTRICT,
  destination_chat_id text NOT NULL,
  revision integer NOT NULL CHECK (revision > 0),
  title text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','sent','failed','uncertain','cancelled')),
  last_error text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(post_id, quiz_id) = 1)
);
CREATE UNIQUE INDEX telegram_schedule_post_active ON public.telegram_schedules(post_id) WHERE status IN ('pending','sending');
CREATE UNIQUE INDEX telegram_schedule_quiz_active ON public.telegram_schedules(quiz_id) WHERE status IN ('pending','sending');
CREATE INDEX telegram_schedule_due ON public.telegram_schedules(scheduled_at) WHERE status = 'pending';
CREATE TABLE public.telegram_scheduler_state (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  last_run_at timestamptz,
  lease_until timestamptz
);
INSERT INTO public.telegram_scheduler_state(id) VALUES(true);
ALTER TABLE public.telegram_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_scheduler_state ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.telegram_schedules, public.telegram_scheduler_state FROM anon, authenticated;
GRANT SELECT ON public.telegram_schedules, public.telegram_scheduler_state TO authenticated;
GRANT ALL ON public.telegram_schedules, public.telegram_scheduler_state TO service_role;
CREATE POLICY admin_read ON public.telegram_schedules FOR SELECT TO authenticated USING(public.is_admin());
CREATE POLICY admin_read ON public.telegram_scheduler_state FOR SELECT TO authenticated USING(public.is_admin());

-- Content row locks serialize editing, planning and manual delivery.
CREATE FUNCTION public.guard_telegram_schedule_content() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF ( (to_jsonb(NEW) - ARRAY['updated_at','status','last_error','telegram_message_ids','sent_at','sent_to_destination_id'])
    IS DISTINCT FROM (to_jsonb(OLD) - ARRAY['updated_at','status','last_error','telegram_message_ids','sent_at','sent_to_destination_id'])
    OR (NEW.status IS DISTINCT FROM OLD.status AND NEW.status NOT IN ('sent','failed')) ) AND EXISTS (
    SELECT 1 FROM public.telegram_schedules WHERE status IN ('pending','sending')
    AND (post_id = OLD.id OR quiz_id = OLD.id)
  ) THEN RAISE EXCEPTION 'Avval rejalashtirilgan yuborishni bekor qiling' USING ERRCODE = '55000'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER protect_scheduled_post BEFORE UPDATE ON public.telegram_posts FOR EACH ROW EXECUTE FUNCTION public.guard_telegram_schedule_content();
CREATE TRIGGER protect_scheduled_quiz BEFORE UPDATE ON public.telegram_quizzes FOR EACH ROW EXECUTE FUNCTION public.guard_telegram_schedule_content();

CREATE FUNCTION public.guard_telegram_scheduled_destination() RETURNS trigger
LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
  IF NEW.chat_id IS DISTINCT FROM OLD.chat_id AND EXISTS(SELECT 1 FROM public.telegram_schedules
    WHERE destination_id=OLD.id AND status IN ('pending','sending')) THEN
    RAISE EXCEPTION 'Manzilni o‘zgartirishdan oldin faol rejalarni bekor qiling' USING ERRCODE='55000';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER protect_scheduled_destination BEFORE UPDATE ON public.telegram_destinations
  FOR EACH ROW EXECUTE FUNCTION public.guard_telegram_scheduled_destination();

CREATE FUNCTION public.guard_telegram_scheduled_job() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.post_id IS NOT NULL THEN PERFORM 1 FROM public.telegram_posts WHERE id=NEW.post_id FOR UPDATE;
  ELSE PERFORM 1 FROM public.telegram_quizzes WHERE id=NEW.quiz_id FOR UPDATE; END IF;
  IF EXISTS(SELECT 1 FROM public.telegram_schedules WHERE status='pending'
    AND (post_id=NEW.post_id OR quiz_id=NEW.quiz_id)) THEN
    RAISE EXCEPTION 'Yuborish rejalashtirilgan. Avval rejani bekor qiling' USING ERRCODE='55000';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER protect_scheduled_job BEFORE INSERT ON public.telegram_delivery_jobs FOR EACH ROW EXECUTE FUNCTION public.guard_telegram_scheduled_job();

CREATE FUNCTION public.create_telegram_schedule(p_kind text, p_content uuid, p_destination uuid, p_revision integer, p_at timestamptz)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE item record; dest public.telegram_destinations; result uuid;
BEGIN
  IF p_at IS NULL OR p_at < now() + interval '1 minute' OR p_at > now() + interval '366 days' THEN
    RAISE EXCEPTION 'Vaqt 1 daqiqadan 366 kungacha kelajakda bo‘lsin' USING ERRCODE='22023'; END IF;
  IF p_kind='post' THEN SELECT id,title,status,revision INTO item FROM public.telegram_posts WHERE id=p_content FOR UPDATE;
  ELSIF p_kind='quiz' THEN SELECT id,title,status,revision INTO item FROM public.telegram_quizzes WHERE id=p_content FOR UPDATE;
  ELSE RAISE EXCEPTION 'Kontent turi noto‘g‘ri' USING ERRCODE='22023'; END IF;
  IF item.id IS NULL THEN RAISE EXCEPTION 'Kontent topilmadi' USING ERRCODE='P0002'; END IF;
  IF item.status <> 'approved' OR item.revision <> p_revision THEN
    RAISE EXCEPTION 'Tasdiqlangan joriy versiyani tanlang' USING ERRCODE='55000'; END IF;
  IF (p_kind='post' AND EXISTS(SELECT 1 FROM public.telegram_posts WHERE id=p_content AND btrim(body)=''))
    OR (p_kind='quiz' AND NOT EXISTS(SELECT 1 FROM public.telegram_quiz_questions WHERE quiz_id=p_content)) THEN
    RAISE EXCEPTION 'Kontent bo‘sh' USING ERRCODE='22023'; END IF;
  IF EXISTS(SELECT 1 FROM public.telegram_delivery_jobs WHERE post_id=p_content OR quiz_id=p_content) THEN
    RAISE EXCEPTION 'Bu kontent uchun yuborish boshlangan. Yangi nusxa yarating' USING ERRCODE='55000'; END IF;
  SELECT * INTO dest FROM public.telegram_destinations WHERE id=p_destination FOR SHARE;
  IF dest.id IS NULL OR NOT dest.is_active OR (p_kind='post' AND dest.use_for NOT IN ('posts','both'))
    OR (p_kind='quiz' AND dest.use_for NOT IN ('quizzes','both')) THEN
    RAISE EXCEPTION 'Mos faol Telegram manzilini tanlang' USING ERRCODE='22023'; END IF;
  INSERT INTO public.telegram_schedules(post_id,quiz_id,destination_id,destination_chat_id,revision,title,scheduled_at)
  VALUES(CASE WHEN p_kind='post' THEN p_content END, CASE WHEN p_kind='quiz' THEN p_content END,p_destination,dest.chat_id,p_revision,item.title,p_at)
  RETURNING id INTO result;
  RETURN result;
END; $$;

CREATE FUNCTION public.change_telegram_schedule(p_id uuid, p_at timestamptz DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_at IS NOT NULL AND (p_at < now() + interval '1 minute' OR p_at > now() + interval '366 days') THEN
    RAISE EXCEPTION 'Kelajakdagi vaqtni tanlang' USING ERRCODE='22023'; END IF;
  UPDATE public.telegram_schedules SET scheduled_at=coalesce(p_at,scheduled_at),
    status=CASE WHEN p_at IS NULL THEN 'cancelled' ELSE 'pending' END
    WHERE id=p_id AND status='pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Yuborish boshlangan yoki reja topilmadi' USING ERRCODE='55000'; END IF;
END; $$;

-- One global lease also paces concurrent cron requests to the same Telegram group.
CREATE FUNCTION public.claim_due_telegram_schedule() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE state public.telegram_scheduler_state; item public.telegram_schedules;
BEGIN
  SELECT * INTO state FROM public.telegram_scheduler_state WHERE id=true FOR UPDATE;
  UPDATE public.telegram_scheduler_state SET last_run_at=now() WHERE id=true;
  IF state.lease_until > now() THEN RETURN NULL; END IF;
  UPDATE public.telegram_schedules SET status='uncertain', last_error='Server jarayoni uzildi. Telegramdagi natijani tekshiring; qayta yuborilmadi.', finished_at=now()
    WHERE status='sending' AND started_at < now()-interval '5 minutes';
  SELECT * INTO item FROM public.telegram_schedules WHERE status='pending' AND scheduled_at<=now()
    ORDER BY scheduled_at,id LIMIT 1 FOR UPDATE SKIP LOCKED;
  IF item.id IS NULL THEN RETURN NULL; END IF;
  UPDATE public.telegram_schedules SET status='sending',started_at=now() WHERE id=item.id RETURNING * INTO item;
  UPDATE public.telegram_scheduler_state SET lease_until=now()+interval '5 minutes' WHERE id=true;
  RETURN to_jsonb(item);
END; $$;

CREATE FUNCTION public.finish_telegram_schedule(p_id uuid, p_status text, p_error text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  -- Lock order matches claim, so overlapping invocations cannot deadlock.
  PERFORM 1 FROM public.telegram_scheduler_state WHERE id=true FOR UPDATE;
  IF p_status NOT IN ('sent','failed','uncertain') THEN RAISE EXCEPTION 'Invalid status'; END IF;
  UPDATE public.telegram_schedules SET status=p_status,last_error=p_error,finished_at=now() WHERE id=p_id AND status='sending';
  IF FOUND THEN UPDATE public.telegram_scheduler_state SET lease_until=now()+interval '5 seconds' WHERE id=true; END IF;
END; $$;

REVOKE ALL ON FUNCTION public.create_telegram_schedule(text,uuid,uuid,integer,timestamptz), public.change_telegram_schedule(uuid,timestamptz), public.claim_due_telegram_schedule(), public.finish_telegram_schedule(uuid,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.create_telegram_schedule(text,uuid,uuid,integer,timestamptz), public.change_telegram_schedule(uuid,timestamptz), public.claim_due_telegram_schedule(), public.finish_telegram_schedule(uuid,text,text) TO service_role;
COMMIT;
