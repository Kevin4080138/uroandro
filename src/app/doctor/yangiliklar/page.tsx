'use client'

import { YangiliklarFeed } from '@/components/YangiliklarFeed'

export default function DoctorYangiliklarPage() {
  return <YangiliklarFeed audience="doctor" backHref="/doctor/dashboard" />
}
