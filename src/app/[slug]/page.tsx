import { createClient } from '@/utils/supabase/server';
import { RedirectTimer } from './redirect-timer';
import Link from 'next/link';

// Desabilita cache para garantir que verifique a expiração sempre
export const revalidate = 0;

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SlugPage({ params }: SlugPageProps) {
  // 1. Pega o "código" (slug) da URL
  const { slug } = await params;

  const supabase = await createClient();

  // 2. Busca o link original no Banco de Dados
  const { data: link, error } = await supabase
    .from('urls')
    .select('target_url, expires_at')
    .eq('slug', slug)
    .single();

  // CENÁRIO 1: Link não existe no banco
  if (error || !link) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center'>
        <h1 className='text-4xl font-bold text-slate-800 mb-2'>404</h1>
        <p className='text-slate-600 mb-6'>Link não encontrado ou inválido.</p>
        <Link
          href='/'
          className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  // CENÁRIO 2: Link expirou
  if (link.expires_at && new Date(link.expires_at) < new Date()) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center'>
        <div className='w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto'>
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
            <line x1='12' x2='12' y1='8' y2='12' />
            <line x1='12' x2='12.01' y1='16' y2='16' />
          </svg>
        </div>
        <h1 className='text-2xl font-bold text-slate-800 mb-2'>
          Link Expirado
        </h1>
        <p className='text-slate-600 mb-6 max-w-md'>
          Este link tinha um prazo de validade e não está mais disponível.
        </p>
        <Link
          href='/'
          className='px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium'
        >
          Encurtar novo link
        </Link>
      </div>
    );
  }

  // CENÁRIO 3: Sucesso! Renderiza o Timer que redireciona
  // Incremento de cliques (opcional): Pode ser feito aqui se tiver RPC configurado

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4'>
      <div className='bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full text-center'>
        <div className='mb-6 flex justify-center'>
          <div className='w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M15 3h6v6' />
              <path d='M10 14 21 3' />
              <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
            </svg>
          </div>
        </div>

        <h1 className='text-xl font-semibold text-slate-800 mb-1'>
          Redirecionando...
        </h1>
        <p className='text-sm text-slate-500 mb-6 break-all'>
          Destino: {link.target_url}
        </p>

        {/* Aqui usamos o seu componente de Timer */}
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
