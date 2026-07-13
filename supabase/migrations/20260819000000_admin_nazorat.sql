-- Admin nazorati: yangi ekotizim kontentini moderatsiya qilish uchun DELETE huquqlari.
-- Klinikalar katalogi va bemor baholari (izohlar) admin tomonidan boshqariladi.
-- (shifokor_profillari uchun admin UPDATE va SELECT allaqachon mavjud — ochiq/yashirin toggle ishlaydi.)

-- Klinikani o'chirish — faqat admin
CREATE POLICY "Admin klinikani o'chiradi"
ON public.klinikalar FOR DELETE
USING (public.is_admin());

-- Bahoni o'chirish — admin (moderatsiya) yoki bahoni bergan bemorning o'zi
CREATE POLICY "Admin yoki bemor bahoni o'chiradi"
ON public.baholar FOR DELETE
USING (public.is_admin() OR patient_id = auth.uid());
