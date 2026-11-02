import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getServiceRoleSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') || '/dashboard';
  const emailParam = searchParams.get('email') || '';

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_config`);
  }

  // Create redirect response so cookies can be set on it
  let redirectTarget = `${origin}${next}`;
  if (type === 'recovery') {
    redirectTarget = `${origin}/auth/reset-password`;
  } else if (type === 'signup' || type === 'email' || (!type && (code || token_hash))) {
    redirectTarget = `${origin}/auth/verified?next=${encodeURIComponent(next)}`;
  }

  const response = NextResponse.redirect(redirectTarget);

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  try {
    let authError: any = null;
    let authUser: any = null;

    if (code) {
      // PKCE flow
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      authError = error;
      authUser = data.user;
    } else if (token_hash) {
      // Email OTP / token hash flow (standard Supabase email confirmation link)
      const otpType: EmailOtpType = (type || 'email') as EmailOtpType;
      let res = await supabase.auth.verifyOtp({
        token_hash,
        type: otpType,
      });

      // If 'email' failed and type was omitted, retry with 'signup'
      if (res.error && !type) {
        res = await supabase.auth.verifyOtp({
          token_hash,
          type: 'signup',
        });
      }

      authError = res.error;
      authUser = res.data.user;
    } else {
      // Neither code nor token_hash provided
      return NextResponse.redirect(
        `${origin}/auth/verify-email?error=missing_token&email=${encodeURIComponent(emailParam)}`
      );
    }

    if (authError) {
      console.error('Supabase auth callback verification error:', authError);
      const isExpired =
        authError.message?.toLowerCase().includes('expired') ||
        authError.message?.toLowerCase().includes('invalid') ||
        authError.code === 'otp_expired';
      
      const errorQuery = isExpired ? 'expired' : 'auth_failed';
      return NextResponse.redirect(
        `${origin}/auth/verify-email?error=${errorQuery}&email=${encodeURIComponent(
          emailParam || authUser?.email || ''
        )}`
      );
    }

    // Ensure profile row exists in database for this newly verified user
    if (authUser?.id && authUser?.email) {
      try {
        const serviceSupabase = getServiceRoleSupabase();
        const { data: existing } = await serviceSupabase
          .from('profiles')
          .select('id')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!existing) {
          await serviceSupabase.from('profiles').insert({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || null,
            subscription_tier: 'free',
          });
        }
      } catch (profileErr) {
        console.error('Profile creation during callback error:', profileErr);
      }
    }

    return response;
  } catch (err: any) {
    console.error('Unexpected error in auth callback:', err);
    return NextResponse.redirect(
      `${origin}/auth/verify-email?error=server_error&email=${encodeURIComponent(emailParam)}`
    );
  }
}
