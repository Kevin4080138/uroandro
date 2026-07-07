import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { AdminSidebar } from '@/components/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', alignItems: 'flex-start' }}>
      <AdminSidebar />
      <main style={{ flex: 1, minHeight: '100vh', overflowY: 'auto' }} className="admin-layout-main">
        {children}
      </main>
      <style>{`
        @media (max-width: 768px) {
          .admin-layout-main header {
            padding-left: 60px !important;
          }
        }
      `}</style>
    </div>
  )
}
