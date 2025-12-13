import Link from 'next/link';

export function Header() {
  return (
    <header className='bg-white shadow-sm border-b border-slate-100'>
      <div className='max-w-4xl mx-auto px-6 py-5 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {/* Ícone com as cores originais */}
          <Link href='/' className='hover:opacity-90 transition-opacity'>
            <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold shadow-sm'>
              S
            </div>
          </Link>
          <div>
            <h1 className='text-lg font-semibold text-slate-800'>Shortly</h1>
            <p className='text-xs text-slate-500'>
              Encurtador de URLs — Portfólio
            </p>
          </div>
        </div>

        {/* Menu removido como solicitado, para deixar a interface limpa */}
      </div>
    </header>
  );
}
