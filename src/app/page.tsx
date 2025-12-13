import { Header } from '@/components/header';
import { CreateForm } from '@/components/create-form';
import { LinkHistory } from '@/components/link-history';

// Garante que a página não faça cache de servidor
export const revalidate = 0;

export default async function Home() {
  // AQUI É A MUDANÇA:
  // Removemos a busca no 'supabase'.
  // Agora a página carrega "limpa" e o componente <LinkHistory /> lá embaixo
  // se encarrega de mostrar o que está no navegador do usuário.

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 font-sans'>
      <Header />

      <main className='max-w-4xl mx-auto p-6'>
        {/* Formulário de Criação */}
        <CreateForm />

        {/* Componente que mostra o histórico local e o botão Limpar */}
        <LinkHistory />

        <footer className='mt-10 text-center text-slate-500 text-sm pb-10'>
          Portfólio Shortly • Next.js 16 + Supabase + LocalStorage
        </footer>
      </main>
    </div>
  );
}
