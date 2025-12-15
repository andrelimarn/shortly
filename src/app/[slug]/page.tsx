import { createClient } from '@/utils/supabase/server';
import { trackClick } from '@/actions/track-click';
import { LinkGate } from '@/components/link-gate';
import Link from 'next/link';

export const revalidate = 0;

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Busca os dados do link
  const { data: link, error } = await supabase
    .from('urls')
    .select('target_url, expires_at, password_hash') // <--- Trazemos o hash para checar se existe
    .eq('slug', slug)
    .single();

  // 404
  if (error || !link) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center'>
        <h1 className='text-4xl font-bold text-slate-800 mb-2'>404</h1>
        <p className='text-slate-600 mb-6'>Link não encontrado.</p>
        <Link href='/' className='text-indigo-600 hover:underline'>
          Voltar para Home
        </Link>
      </div>
    );
  }

  // Verificação de Expiração
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center'>
        <div className='w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='32'
            height='32'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='10' />
            <line x1='15' y1='9' x2='9' y2='15' />
            <line x1='9' y1='9' x2='15' y2='15' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold text-slate-800 mb-2'>
          Link Expirado
        </h1>
        <p className='text-slate-500 mb-6'>
          Este link atingiu a data limite e não está mais disponível.
        </p>
        <Link
          href='/'
          className='px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors'
        >
          Encurtar novo link
        </Link>
      </div>
    );
  }

  // Conta o clique mesmo se tiver senha
  try {
    await trackClick(slug);
  } catch (err) {
    console.error('Erro analytics:', err);
  }

  const hasPassword = !!link.password_hash;

  // Se tiver senha, NÃO passamos a URL de destino (undefined).
  // O componente LinkGate terá que pedir ao servidor depois.
  const safeTargetUrl = hasPassword ? undefined : link.target_url;

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4'>
      <LinkGate
        slug={slug}
        hasPassword={hasPassword}
        targetUrl={safeTargetUrl}
      />
    </div>
  );
}
