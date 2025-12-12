import Link from 'next/link';

export function Header() {
  return (
    <header className='bg-white shadow'>
      <div className='max-w-4xl mx-auto px-6 py-5 flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold'>
            S
          </div>
          <div>
            <h1 className='text-lg font-semibold'>Shortly</h1>
            <p className='text-xs text-slate-500'>
              Encurtador de URLs — Portfólio
            </p>
          </div>
        </div>
        <nav className='hidden md:flex gap-4 items-center text-sm text-slate-600'>
          <Link href='/' className='hover:underline'>
            Encurtar
          </Link>
          <a href='#links' className='hover:underline'>
            Meus links
          </a>
        </nav>
      </div>
    </header>
  );
}
