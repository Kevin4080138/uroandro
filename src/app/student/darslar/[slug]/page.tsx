import { createServerSupabase } from '@/lib/supabaseServer'
import { DarsClient, type DarsMatni } from './DarsClient'

// Server komponent: darsning nazariya matni va havolalari sahifa bilan birga,
// tayyor HTML ichida keladi. Ilgari bu sahifa butunlay client edi va tarkibni
// brauzerdan so'rardi — ya'ni talaba avval JS yuklanishini, keyin bazaga
// borib-kelishni kutardi. O'zbekistondan xalqaro so'rov ~150 ms turgani uchun
// bu kutish sezilarli edi.
//
// Savol banklari bu yerda olinmaydi: ular og'ir va faqat test tabi ochilganda
// kerak. Ularni DarsClient talab bo'lganda o'zi yuklaydi.

type Props = { params: Promise<{ slug: string }> }

export default async function DarsDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabase()

  // RLS: `dars_tarkibi` ni faqat tizimga kirgan foydalanuvchi ko'radi. Cookie
  // orqali sessiya shu yerga ham keladi, shuning uchun tekshiruv saqlanadi.
  // Kirmagan foydalanuvchida `data` null bo'ladi va sahifa client tomonda
  // login sahifasiga yo'naltiradi — hozirgi xulq o'zgarmaydi.
  const { data } = await supabase
    .from('dars_tarkibi')
    .select('nazariya_html, asosiy_video_url, video_linklar, konspekt_url, prezentatsiya_url, nazorat_savol_soni, nazorat_vaqt_daqiqa, sertifikat_otish_foizi')
    .eq('dars_slug', slug)
    .maybeSingle()

  return <DarsClient slug={slug} tarkib={(data as DarsMatni) ?? null} />
}
