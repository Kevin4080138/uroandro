-- Bemorlar bazasida kuzatuv natijalarini (retsidiv, gidrotsele va h.k.) yangilash uchun.
CREATE POLICY "Shifokor o'z tadqiqot yozuvini yangilaydi"
ON public.varikotsele_tadqiqot FOR UPDATE
USING (doctor_id = auth.uid() OR public.is_admin());
