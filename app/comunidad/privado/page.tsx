import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { readData } from '@/services/db';
import { verifySessionToken } from '@/lib/security';
import PrivateAreaClient from './PrivateAreaClient';

export default async function PrivateCommunityPage() {
  // Verificar sesión activa
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('member-session');

  if (!sessionCookie?.value) {
    redirect('/comunidad?login=true');
  }

  const memberEmail = verifySessionToken(sessionCookie.value);

  if (!memberEmail) {
    redirect('/comunidad?login=true');
  }

  // Obtener datos del miembro
  const { data: member } = await supabaseAdmin
    .from('members')
    .select('nombre, email, status, created_at, avatar_url')
    .eq('email', memberEmail)
    .eq('status', 'activo')
    .maybeSingle();

  if (!member) {
    redirect('/comunidad?login=true');
  }

  // Cargar recursos y artículos exclusivos en paralelo
  const [allResources, allBlogPosts] = await Promise.all([
    readData<any[]>('resources').catch(() => []),
    readData<any[]>('blog').catch(() => []),
  ]);

  const resources = Array.isArray(allResources) ? allResources : [];
  const exclusivePosts = Array.isArray(allBlogPosts)
    ? allBlogPosts.filter((p: any) => p.exclusive && (!p.state || p.state === 'publicado'))
    : [];
  const freePosts = Array.isArray(allBlogPosts)
    ? allBlogPosts
        .filter((p: any) => !p.exclusive && (!p.state || p.state === 'publicado'))
        .slice(0, 5)
    : [];

  return (
    <>
      <Navbar />
      <PrivateAreaClient
        member={{ name: member.nombre || memberEmail.split('@')[0], email: member.email, created_at: member.created_at, avatar_url: member.avatar_url || null }}
        resources={resources}
        exclusivePosts={exclusivePosts}
        freePosts={freePosts}
      />
      <Footer />
    </>
  );
}
