-- Talaba avatari uchun hayvon belgisi (rasm o'rniga tanlanadigan variant).
-- Kalit sifatida saqlanadi: 'mushuk', 'it', 'quyon', 'qush', 'baliq',
-- 'toshbaqa', 'olmaxon', 'panda' (src/lib/hayvonAvatar.tsx dagi HAYVONLAR).
alter table profiles add column if not exists avatar_ikon text;
