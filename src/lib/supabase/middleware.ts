import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/upload',
  '/cases',
  '/copilot',
  '/compliance',
  '/compare',
  '/forms',
  '/document-generator',
  '/search',
  '/settings',
  '/team',
  '/history',
  '/risk',
  '/risk-assessment',
];

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let supabaseResponse = NextResponse.next({ request });

  if (!url || !key) {
    return supabaseResponse;
  }

  let user = null;
  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const authRes = await supabase.auth.getUser();
    user = authRes.data?.user ?? null;
  } catch (error) {
    console.error('Middleware auth check error:', error);
  }

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((path) => pathname.startsWith(path));

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('redirect', pathname);
    const redirectResponse = NextResponse.redirect(loginUrl);
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value);
    });
    return redirectResponse;
  }

  if (pathname.startsWith('/auth/login') && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    const dest = request.nextUrl.clone();
    dest.pathname = redirectTo;
    dest.search = '';
    const redirectResponse = NextResponse.redirect(dest);
    supabaseResponse.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
