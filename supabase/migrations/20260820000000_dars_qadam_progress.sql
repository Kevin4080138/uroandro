-- Dars ichidagi qadam progressi: talaba har bir qadamni (nazariya, video, amaliy, ...)
-- yakunlaganda yoziladi. Ketma-ket ochilish (keyingi dars/qadam) va keyinchalik
-- admin monitoring paneli shu jadvalga tayanadi.

CREATE TABLE public.dars_qadam_progress (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dars_slug   text NOT NULL,
  qadam       text NOT NULL,   -- 'nazariya' / 'video' / 'yuklab' / 'flashcard' / 'amaliy' / 'usmle' / 'nazorat' / ...
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, dars_slug, qadam)
);

CREATE INDEX dars_qadam_progress_student_idx ON public.dars_qadam_progress (student_id);
CREATE INDEX dars_qadam_progress_slug_idx ON public.dars_qadam_progress (dars_slug);

ALTER TABLE public.dars_qadam_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Talaba o'z progressini ko'radi"
ON public.dars_qadam_progress FOR SELECT
USING (student_id = auth.uid() OR public.is_admin());

CREATE POLICY "Talaba o'z progressini yozadi"
ON public.dars_qadam_progress FOR INSERT
WITH CHECK (student_id = auth.uid());

-- O'chirish/o'zgartirish talab qilinmaydi — progress faqat oldinga yuradi.
