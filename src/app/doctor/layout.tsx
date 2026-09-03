import { Toaster } from '@/components/Toast'

// Shifokor bo'limi — umumiy bildirishnoma (Toast) tizimi shu yerda turadi.
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
