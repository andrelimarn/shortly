import { supabase } from '@/lib/supabase';
import { Header } from '@/components/header';
import { CreateForm } from '@/components/create-form';
import { CopyButton } from '@/components/copy-button';
import Link from 'next/link';

export const revalidate = 0; // Garante que a lista de links esteja sempre atualizada

export default async function Home() {
  // Busca os links no servidor (Server Side Rendering)
  const { data: links } = await supabase
    .from('urls')
    .select('*')
    .order('created_at', { ascending: false });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 font-sans'>
      <Header />

      <main className='max-w-4xl mx-auto p-6'>
        {/* Formulário de Criação */}
        <CreateForm />

        {/* Lista de Links */}
        <section id='links' className='mt-6'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-lg font-medium'>Meus Links</h3>
            <span className='text-sm text-slate-500'>
              Total: <strong>{links?.length || 0}</strong>
            </span>
          </div>

          <div className='space-y-3'>
            {links?.map((link) => {
              const shortLink = `${baseUrl}/${link.slug}`;

              return (
                <div
                  key={link.id}
                  className='bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4'
                >
                  <div className='overflow-hidden'>
                    <div className='text-sm text-slate-500'>
                      {new Date(link.created_at).toLocaleString('pt-BR')}
                    </div>
                    <div className='mt-1 font-medium flex items-center gap-2'>
                      <span className='text-indigo-600'>/{link.slug}</span>
                      <span className='text-slate-400 text-sm'>—</span>
                      <span className='text-slate-600 text-sm truncate max-w-[200px] sm:max-w-md block'>
                        {link.target_url}
                      </span>
                    </div>
                    <div className='mt-2 text-xs text-slate-500'>
                      Cliques: {link.clicks}
                    </div>
                  </div>

                  <div className='flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0'>
                    <Link
                      href={`/${link.slug}`}
                      target='_blank'
                      className='text-indigo-600 underline text-sm hover:text-indigo-800 whitespace-nowrap'
                    >
                      Abrir Preview
                    </Link>
                    <CopyButton text={shortLink} />
                  </div>
                </div>
              );
            })}

            {(!links || links.length === 0) && (
              <div className='text-center py-10 text-slate-400'>
                Nenhum link criado ainda.
              </div>
            )}
          </div>
        </section>

        <footer className='mt-10 text-center text-slate-500 text-sm pb-10'>
          Portfólio Shortly • Next.js 14 + Supabase + Tailwind
        </footer>
      </main>
    </div>
  );
}
