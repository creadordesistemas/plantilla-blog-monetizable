import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('member-session');

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { authenticated: false },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
          },
        }
      );
    }

    const memberEmail = verifySessionToken(sessionCookie.value);

    if (!memberEmail) {
      return NextResponse.json(
        { authenticated: false },
        { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
      );
    }

    const { data: member, error } = await supabaseAdmin
      .from('members')
      .select('nombre, email, avatar_url, status, created_at')
      .eq('email', memberEmail)
      .eq('status', 'activo')
      .maybeSingle();

    if (error || !member) {
      return NextResponse.json(
        { authenticated: false },
        {
          headers: {
            'Cache-Control': 'no-store, max-age=0, must-revalidate',
          },
        }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        member: {
          name: member.nombre || memberEmail.split('@')[0],
          email: member.email,
          avatar_url: member.avatar_url || null,
          created_at: member.created_at,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        },
      }
    );
  }
}
