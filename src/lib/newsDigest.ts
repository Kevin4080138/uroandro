import { createAdminClient } from '@/lib/supabaseAdmin'
import { eslatmaYubor, bugunToshkent } from '@/lib/bildirishnoma'

export type DigestResult = { subscribers: number; matched: number; sent: number; skipped: number; errors: number }

// Kunlik yangilik digesti: har obunachiga oʻzi obuna boʻlgan mavzular boʻyicha
// soʻnggi ~26 soatda nashr qilingan yangi materiallarni bitta xabarda yuboradi.
export async function yangilikDigestYubor(windowHours = 26): Promise<DigestResult> {
  const admin = createAdminClient()
  const result: DigestResult = { subscribers: 0, matched: 0, sent: 0, skipped: 0, errors: 0 }
  const since = new Date(Date.now() - windowHours * 3600 * 1000).toISOString()

  const { data: articleRows } = await admin.from('yangiliklar')
    .select('id,slug,title_uz,original_title,tags,audience,published_at')
    .eq('status', 'published').gte('published_at', since).order('published_at', { ascending: false })
  const articles = (articleRows ?? []) as { id: string; slug: string; title_uz: string | null; original_title: string; tags: string[] | null; audience: string[] | null }[]
  if (!articles.length) return result

  const { data: subRows } = await admin.from('teg_obunalari').select('user_id,teg_slug')
  const subs = (subRows ?? []) as { user_id: string; teg_slug: string }[]
  if (!subs.length) return result

  const byUser = new Map<string, Set<string>>()
  for (const sub of subs) {
    if (!byUser.has(sub.user_id)) byUser.set(sub.user_id, new Set())
    byUser.get(sub.user_id)!.add(sub.teg_slug)
  }
  result.subscribers = byUser.size

  const userIds = [...byUser.keys()]
  const { data: profileRows } = await admin.from('profiles').select('id,role').in('id', userIds)
  const roles = new Map((profileRows ?? []).map((row) => [row.id as string, row.role as string]))

  for (const [userId, slugs] of byUser) {
    const role = roles.get(userId)
    const audience = role === 'doctor' ? 'doctor' : role === 'student' ? 'student' : null
    if (!audience) { result.skipped++; continue }

    const matched = articles.filter((article) =>
      (article.audience ?? []).includes(audience) && (article.tags ?? []).some((tag) => slugs.has(tag)))
    if (!matched.length) { result.skipped++; continue }
    result.matched += matched.length

    const sarlavhalar = matched.slice(0, 5).map((article) => `• ${article.title_uz ?? article.original_title}`).join('\n')
    const qolgan = matched.length > 5 ? `\n… va yana ${matched.length - 5} ta` : ''
    const xabar = {
      title: `🆕 Obuna mavzularingiz boʻyicha ${matched.length} ta yangi material`,
      body: `${sarlavhalar}${qolgan}`,
      url: audience === 'doctor' ? '/doctor/yangiliklar' : '/student/yangiliklar',
    }
    const natija = await eslatmaYubor({ userId, turi: 'yangilik', manbaId: bugunToshkent(), xabar, kunlikLimit: false })
    if (natija === 'yuborildi') result.sent++
    else if (natija === 'xato') result.errors++
    else result.skipped++
  }
  return result
}
