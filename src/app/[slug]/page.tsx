import { createClient } from '@/utils/supabase/server';
import { RedirectTimer } from './redirect-timer';
import { trackClick } from '@/actions/track-click'; // <--- Importante!
import Link from 'next/link';

// Desabilita cache para garantir que sempre conte o clique
export const revalidate = 0;

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
  // 1. Pega o slug da URL
  const { slug } = await params;

  // LOG DE DEBUG: Se isso não aparecer, a rota nem está sendo acessada
  console.log(`--- ACESSANDO ROTA: /${slug} ---`);

  const supabase = await createClient();

  // 2. Busca o link original
  const { data: link, error } = await supabase
    .from('urls')
    .select('target_url, expires_at')
    .eq('slug', slug)
    .single();

  // Tratamento de erro (404)
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
        <h1 className='text-2xl font-bold text-slate-800 mb-2'>
          Link Expirado
        </h1>
        <Link href='/' className='text-indigo-600 hover:underline'>
          Encurtar novo link
        </Link>
      </div>
    );
  }

  // ============================================================
  // 3. AQUI ESTÁ O RASTREAMENTO (ANALYTICS)
  // ============================================================
  // Precisamos chamar a função que criamos. Se essa linha faltar, nada é gravado.
  try {
    await trackClick(slug);
  } catch (err) {
    console.error('Erro ao chamar analytics:', err);
  }

  // 4. Renderiza a tela com o Timer
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4'>
      <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center'>
        <h1 className='text-xl font-semibold text-slate-800 mb-1'>
          Redirecionando...
        </h1>
        <p className='text-sm text-slate-500 mb-6 break-all'>
          Destino: {link.target_url}
        </p>

        {/* Componente do Timer */}
        <RedirectTimer targetUrl={link.target_url} />

        <div className='mt-8 pt-6 border-t border-slate-100'>
          <Link
            href='/'
            className='text-xs text-slate-400 hover:text-indigo-500 transition-colors'
          >
            Encurtado com Shortly
          </Link>
        </div>
      </div>
    </div>
  );
}
