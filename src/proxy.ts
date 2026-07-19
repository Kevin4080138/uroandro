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

  // `getUser()` emas, `getClaims()`: loyihada asimmetrik JWT kalitlari (ES256)
  // yoqilgani uchun token Supabase'ga borilmasdan, WebCrypto orqali joyida
  // tekshiriladi. Imzo baribir tekshirilgani uchun xavfsizlik pasaymaydi —
  // `getSession()` dan farqi shu. JWKS bir marta olinib keshlanadi.
  const { data: claimsData, error: claimsXato } = await supabase.auth.getClaims()
  let userId = claimsData?.claims?.sub ?? null

  // Ehtiyot chorasi: sessiya umuman yo'q bo'lsa `data` ham, `error` ham bo'sh
  // keladi — bu oddiy mehmon, qo'shimcha tekshiruv kerak emas. Lekin `error`
  // to'lgan bo'lsa (kalit olinmadi, kutilmagan format va h.k.) — tarmoq orqali
  // qayta tekshiramiz. Aks holda mahalliy tekshiruvdagi bitta nosozlik barcha
  // kirgan foydalanuvchini login sahifasiga uloqtirib yuborardi.
  if (!userId && claimsXato) {
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id ?? null
  }
  const { pathname } = request.nextUrl

  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))
  const isAuthPage = pathname.startsWith('/auth')
  const isHome = pathname === '/'

  if (!userId) {
    if (isProtected) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return response
  }

  // Rol faqat shu uch holatda kerak: himoyalangan sahifaga ruxsatni tekshirish,
  // yoki kirgan foydalanuvchini bosh/auth sahifasidan o'z kabinetiga yuborish.
  // Boshqa yo'llarda `profiles` so'rovi behuda edi — har so'rovda bitta ortiqcha
  // borib-kelish (O'zbekistondan ~150 ms) degani.
  if (!isProtected && !isAuthPage && !isHome) {
    return response
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
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

// Middleware har bir so'rovda ishlaydi va ichida Supabase Auth'ga tarmoq
// chaqiruvi bor (~150 ms). Shuning uchun u faqat haqiqatan kerak bo'lgan
// yo'llarda ishlasin.
//
// Chetlashtirilganlar:
//   · /darslar, /sertifikat — ochiq sahifalar. Middleware ular uchun hech narsa
//     qilmaydi (himoyalangan ham, auth ham, bosh sahifa ham emas), faqat ikkita
//     tarmoq chaqiruvi qo'shardi. Aynan shular Google'dan keladigan trafik.
//   · statik fayllar va rasm/shrift kengaytmalari.
//
// DIQQAT: chetlashtirish faqat yo'l boshidan hisoblanadi. `/student/darslar/...`
// "student" bilan boshlangani uchun middleware'da qoladi va himoya saqlanadi.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|darslar|sertifikat|logolar|nazariyalar|robots.txt|sitemap.xml|manifest.json|sw.js|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf)$).*)',
  ],
}
