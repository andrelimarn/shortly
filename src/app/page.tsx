import { CreateForm } from '@/components/create-form';
import { LinkHistory } from '@/components/link-history';

// Força a página a ser estática (melhor performance) mas permite revalidação se necessário
export const revalidate = 0;

export default async function Home() {
  return (
    <div className='min-h-[calc(100vh-84px)] font-sans'>
      <main className='max-w-4xl mx-auto p-6 pt-10'>
        {/* --- Hero Section --- */}
        <section className='text-center space-y-4 mb-12 max-w-2xl mx-auto'>
          <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900'>
            Encurte seus links com{' '}
            <span className='text-indigo-600'>segurança</span>.
          </h1>
          <p className='text-lg text-slate-600'>
            O Shortly é a ferramenta moderna para gerenciar suas URLs. Crie
            links personalizados, defina validade, gere QR Codes e proteja com
            senha gratuitamente.
          </p>
        </section>

        {/* --- Formulário e Histórico --- */}
        <CreateForm />
        <LinkHistory />

        {/* --- NOVA SEÇÃO DE CONTEÚDO (SEO & AdSense Friendly) --- */}
        <div className='mt-24 border-t border-slate-200 pt-16'>
          {/* Recursos / Vantagens */}
          <section className='grid md:grid-cols-3 gap-8 mb-20'>
            <div className='space-y-3'>
              <div className='w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4'>
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
                  <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-slate-900'>
                Segurança Total
              </h3>
              <p className='text-slate-600 leading-relaxed'>
                Proteja seus links com senha criptografada. Ideal para
                compartilhar informações sensíveis ou conteúdo exclusivo apenas
                com quem você confia.
              </p>
            </div>

            <div className='space-y-3'>
              <div className='w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 mb-4'>
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
                  <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                  <rect x='7' y='7' width='3' height='3' />
                  <rect x='14' y='7' width='3' height='3' />
                  <rect x='7' y='14' width='3' height='3' />
                  <rect x='14' y='14' width='3' height='3' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-slate-900'>
                QR Code Grátis
              </h3>
              <p className='text-slate-600 leading-relaxed'>
                Cada link encurtado gera automaticamente um QR Code em alta
                resolução. Perfeito para cardápios, flyers, cartões de visita e
                marketing impresso.
              </p>
            </div>

            <div className='space-y-3'>
              <div className='w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4'>
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
                  <line x1='18' y1='20' x2='18' y2='10' />
                  <line x1='12' y1='20' x2='12' y2='4' />
                  <line x1='6' y1='20' x2='6' y2='14' />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-slate-900'>
                Análise de Cliques
              </h3>
              <p className='text-slate-600 leading-relaxed'>
                Acompanhe o desempenho dos seus links em tempo real. Saiba
                quantos cliques você recebeu, de quais cidades e quais
                dispositivos foram usados.
              </p>
            </div>
          </section>

          {/* Perguntas Frequentes (FAQ) */}
          <section className='max-w-3xl mx-auto'>
            <h2 className='text-3xl font-bold text-slate-900 text-center mb-10'>
              Perguntas Frequentes
            </h2>

            <div className='space-y-8'>
              <div>
                <h3 className='text-lg font-bold text-slate-800 mb-2'>
                  O Shortly é realmente gratuito?
                </h3>
                <p className='text-slate-600'>
                  Sim! Todas as funcionalidades, incluindo encurtamento, QR Code
                  e proteção por senha são 100% gratuitas. Mantemos o serviço
                  através de anúncios discretos que não atrapalham sua
                  experiência.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-bold text-slate-800 mb-2'>
                  Meus links têm validade?
                </h3>
                <p className='text-slate-600'>
                  Por padrão, seus links são permanentes e nunca expiram. Porém,
                  você tem a opção de definir uma &quot;Data de Expiração&quot;
                  se quiser criar um link temporário para uma promoção ou evento
                  específico.
                </p>
              </div>

              <div>
                <h3 className='text-lg font-bold text-slate-800 mb-2'>
                  Como criar um link personalizado?
                </h3>
                <p className='text-slate-600'>
                  Ao colar sua URL, clique em{' '}
                  <strong>&quot;Opções Avançadas&quot;</strong>. Lá você pode
                  digitar o nome que quiser (ex:{' '}
                  <code>shortlyurl.cc/minha-marca</code>). Se o nome estiver
                  disponível, ele será seu!
                </p>
              </div>

              <div>
                <h3 className='text-lg font-bold text-slate-800 mb-2'>
                  É seguro usar encurtadores de link?
                </h3>
                <p className='text-slate-600'>
                  O Shortly utiliza protocolo HTTPS e criptografia de ponta a
                  ponta. Além disso, monitoramos ativamente links maliciosos
                  para garantir que nossa plataforma seja segura para todos os
                  visitantes.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
