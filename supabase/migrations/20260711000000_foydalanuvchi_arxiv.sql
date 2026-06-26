-- Foydalanuvchini arxivlash imkoni (o'chirmasdan ro'yxatdan vaqtincha yashirish)
ALTER TABLE public.profiles
  ADD COLUMN arxivlangan boolean NOT NULL DEFAULT false;
