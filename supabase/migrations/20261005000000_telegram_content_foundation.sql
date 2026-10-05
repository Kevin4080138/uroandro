-- Telegram kontentining mustaqil asosi. Mavjud yangiliklar va bot oqimi o'zgarmaydi.
BEGIN;

CREATE TABLE public.telegram_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  chat_id text NOT NULL CHECK (chat_id ~ '^-[1-9][0-9]{0,15}$' OR chat_id ~ '^@[a-z][a-z0-9_]{4,31}$'),
  chat_type text NOT NULL CHECK (chat_type IN ('channel', 'group')),
  use_for text NOT NULL DEFAULT 'both' CHECK (use_for IN ('posts', 'quizzes', 'both')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (chat_id)
);

CREATE TABLE public.telegram_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 240),
  topic text NOT NULL CHECK (char_length(btrim(topic)) BETWEEN 1 AND 240),
  body text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT 'student' CHECK (audience IN ('student', 'doctor', 'patient')),
  image_url text,
  image_source_url text,
  image_credit text,
  image_license text,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(sources) = 'array'),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'scheduled', 'sent', 'failed', 'archived')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.telegram_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 240),
  topic text NOT NULL CHECK (char_length(btrim(topic)) BETWEEN 1 AND 240),
  audience text NOT NULL DEFAULT 'student' CHECK (audience IN ('student', 'doctor', 'patient')),
  difficulty text NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'orta', 'qiyin')),
  is_anonymous boolean NOT NULL DEFAULT true,
  source_post_id uuid REFERENCES public.telegram_posts(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'scheduled', 'sent', 'failed', 'archived')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.telegram_quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES public.telegram_quizzes(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK (position >= 0),
  question text NOT NULL CHECK (char_length(btrim(question)) > 0),
  case_text text NOT NULL DEFAULT '',
  options jsonb NOT NULL CHECK (jsonb_typeof(options) = 'array' AND jsonb_array_length(options) BETWEEN 4 AND 5),
  correct_option integer NOT NULL CHECK (correct_option >= 0 AND correct_option < jsonb_array_length(options)),
  explanation text NOT NULL CHECK (char_length(btrim(explanation)) > 0),
  image_url text,
  image_source_url text,
  image_credit text,
  image_license text,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(sources) = 'array'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (quiz_id, position)
);

-- Navbatni keyingi bosqichda serverdagi worker boshqaradi. Brauzer yozolmaydi.
-- Har bir yuborish tasdiqlangan kontent va manzil nusxasini payload ichida saqlaydi.
CREATE TABLE public.telegram_delivery_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id uuid NOT NULL REFERENCES public.telegram_destinations(id) ON DELETE RESTRICT,
  post_id uuid REFERENCES public.telegram_posts(id) ON DELETE RESTRICT,
  quiz_id uuid REFERENCES public.telegram_quizzes(id) ON DELETE RESTRICT,
  revision integer NOT NULL CHECK (revision > 0),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sending', 'sent', 'failed', 'uncertain', 'cancelled')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  locked_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (num_nonnulls(post_id, quiz_id) = 1)
);
CREATE UNIQUE INDEX telegram_delivery_post_once ON public.telegram_delivery_jobs(destination_id, post_id, revision) WHERE post_id IS NOT NULL;
CREATE UNIQUE INDEX telegram_delivery_quiz_once ON public.telegram_delivery_jobs(destination_id, quiz_id, revision) WHERE quiz_id IS NOT NULL;
CREATE INDEX telegram_delivery_due ON public.telegram_delivery_jobs(scheduled_at) WHERE status = 'queued';

-- Rasm, matn va poll alohida qayd etiladi: muvaffaqiyatli qism takror yuborilmaydi.
CREATE TABLE public.telegram_delivery_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.telegram_delivery_jobs(id) ON DELETE CASCADE,
  part_key text NOT NULL,
  method text NOT NULL CHECK (method IN ('sendPhoto', 'sendMessage', 'sendPoll')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'uncertain')),
  telegram_message_id text,
  telegram_poll_id text,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (status <> 'sent' OR telegram_message_id IS NOT NULL),
  UNIQUE (job_id, part_key)
);

CREATE INDEX telegram_posts_created ON public.telegram_posts(created_at DESC);
CREATE INDEX telegram_quizzes_created ON public.telegram_quizzes(created_at DESC);
CREATE INDEX telegram_quizzes_source_post ON public.telegram_quizzes(source_post_id);

CREATE FUNCTION public.telegram_content_touch_updated_at() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['telegram_destinations', 'telegram_posts', 'telegram_quizzes', 'telegram_quiz_questions', 'telegram_delivery_jobs', 'telegram_delivery_parts'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', table_name);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', table_name);
    EXECUTE format('CREATE TRIGGER touch_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.telegram_content_touch_updated_at()', table_name);
    IF table_name IN ('telegram_delivery_jobs', 'telegram_delivery_parts') THEN
      EXECUTE format('GRANT SELECT ON public.%I TO authenticated', table_name);
      EXECUTE format('CREATE POLICY admin_read ON public.%I FOR SELECT TO authenticated USING (public.is_admin())', table_name);
    ELSE
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
      EXECUTE format('CREATE POLICY admin_manage ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', table_name);
    END IF;
  END LOOP;
END;
$$;

COMMIT;
