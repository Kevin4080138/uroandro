import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const roleHome: Record<string, string> = {
  student: '/student/dashboard',
  doctor: '/doctor/dashboard',
  patient: '/patient/dashboard',
  admin: '/admin/dashboard',
}

const protectedPrefixes = ['/student', '/doctor', '/patient', '/admin', '/dashboard']

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))
  const isAuthPage = pathname.startsWith('/auth')
  const isHome = pathname === '/'

  if (!user) {
    if (isProtected || isHome) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return response
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const home = profile?.role ? roleHome[profile.role] : null

  if ((isAuthPage || isHome) && home) {
    return NextResponse.redirect(new URL(home, request.url))
  }

  if (isProtected && profile?.role !== 'admin') {
    const allowedPrefix = home?.replace('/dashboard', '')
    if (!allowedPrefix || !pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL(home ?? '/auth/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
