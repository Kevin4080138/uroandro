'use client'

import { YangiliklarFeed } from '@/components/YangiliklarFeed'

export default function StudentYangiliklarPage() {
  return <YangiliklarFeed audience="student" backHref="/student/dashboard" />
}
