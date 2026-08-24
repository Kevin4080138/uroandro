-- Admin testlari production cronning kunlik unique kalitini band qilmasligi uchun.
ALTER TABLE public.yangilik_ishlari ALTER COLUMN run_key DROP NOT NULL;
ALTER TABLE public.yangilik_ishlari ALTER COLUMN run_key DROP DEFAULT;
